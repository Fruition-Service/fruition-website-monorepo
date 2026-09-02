/**
 * Read-only accessors for the Marketa brain's competitive-intelligence tables
 * (AEO citation runs and competitor snapshots), surfaced in the portal at
 * /internal/insights.
 *
 * Written by the Marketa Vercel crons `/api/internal/aeo/scan` (weekly, Mon) and
 * `/api/internal/competitors/scan` (weekly, Fri) — see marketa-monorepo. The
 * portal only ever reads. Same REST-over-fetch seam as `marketaDrafts.ts`: the
 * Workers runtime is happier with fetch than with the supabase-js client.
 *
 * Every accessor returns null on any failure so a page renders a "not connected"
 * state instead of a 500.
 */

function restBase(): string {
  const url = process.env.MARKETA_SUPABASE_URL
  if (!url) throw new Error("MARKETA_SUPABASE_URL missing")
  return `${url.replace(/\/+$/, "")}/rest/v1`
}

function headers(): Record<string, string> {
  const key = process.env.MARKETA_SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error("MARKETA_SUPABASE_SERVICE_ROLE_KEY missing")
  return { apikey: key, Authorization: `Bearer ${key}` }
}

async function query<T>(path: string): Promise<T[]> {
  const res = await fetch(`${restBase()}/${path}`, { headers: headers() })
  if (!res.ok) throw new Error(`Marketa REST ${res.status}: ${await res.text()}`)
  return (await res.json()) as T[]
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString()
}

/* ------------------------------- AEO ------------------------------- */

interface AeoRunRow {
  run_at: string
  engine: string | null
  query_id: number | null
  cited: boolean | null
  rank: number | null
  competitors_cited: string[] | null
  answer_excerpt: string | null
}

interface AeoQueryRow {
  id: number
  query: string
  active: boolean | null
}

export interface AeoQueryResult {
  query: string
  runs: number
  citations: number
  /** 0-100. */
  citationRate: number
  bestRank: number | null
  lastRunAt: string | null
  /** Engines where we were cited at least once in the window. */
  citedOn: string[]
}

export interface AeoVisibility {
  totalRuns: number
  totalCitations: number
  /** 0-100 — the headline "how often does an AI answer mention us". */
  citationRate: number
  byEngine: { engine: string; runs: number; citations: number; citationRate: number }[]
  byQuery: AeoQueryResult[]
  /** Competitors named in answers, most frequent first. */
  topCompetitors: { name: string; mentions: number }[]
  lastRunAt: string | null
}

export async function getAeoVisibility(days = 90): Promise<AeoVisibility | null> {
  try {
    const [runs, queries] = await Promise.all([
      query<AeoRunRow>(
        `aeo_runs?select=run_at,engine,query_id,cited,rank,competitors_cited,answer_excerpt` +
          `&run_at=gte.${encodeURIComponent(isoDaysAgo(days))}&order=run_at.desc&limit=2000`,
      ),
      query<AeoQueryRow>(`aeo_queries?select=id,query,active&limit=500`),
    ])
    if (runs.length === 0) {
      return {
        totalRuns: 0,
        totalCitations: 0,
        citationRate: 0,
        byEngine: [],
        byQuery: [],
        topCompetitors: [],
        lastRunAt: null,
      }
    }

    const queryText = new Map(queries.map((q) => [q.id, q.query]))
    const engines = new Map<string, { runs: number; citations: number }>()
    const perQuery = new Map<
      number,
      { runs: number; citations: number; bestRank: number | null; lastRunAt: string | null; engines: Set<string> }
    >()
    const competitors = new Map<string, number>()
    let totalCitations = 0

    for (const run of runs) {
      const engine = run.engine ?? "unknown"
      const cited = run.cited === true
      if (cited) totalCitations += 1

      const e = engines.get(engine) ?? { runs: 0, citations: 0 }
      e.runs += 1
      if (cited) e.citations += 1
      engines.set(engine, e)

      if (run.query_id != null) {
        const q = perQuery.get(run.query_id) ?? {
          runs: 0,
          citations: 0,
          bestRank: null,
          lastRunAt: null,
          engines: new Set<string>(),
        }
        q.runs += 1
        if (cited) {
          q.citations += 1
          q.engines.add(engine)
          // Rank is only meaningful on a run that actually cited us.
          if (run.rank != null && (q.bestRank == null || run.rank < q.bestRank)) q.bestRank = run.rank
        }
        // Runs arrive newest-first, so the first one we see is the latest.
        if (!q.lastRunAt) q.lastRunAt = run.run_at
        perQuery.set(run.query_id, q)
      }

      for (const name of run.competitors_cited ?? []) {
        const clean = name.trim()
        if (clean) competitors.set(clean, (competitors.get(clean) ?? 0) + 1)
      }
    }

    const rate = (cited: number, total: number) => (total > 0 ? (cited / total) * 100 : 0)

    return {
      totalRuns: runs.length,
      totalCitations,
      citationRate: rate(totalCitations, runs.length),
      byEngine: [...engines.entries()]
        .map(([engine, v]) => ({
          engine,
          runs: v.runs,
          citations: v.citations,
          citationRate: rate(v.citations, v.runs),
        }))
        .sort((a, b) => b.runs - a.runs),
      byQuery: [...perQuery.entries()]
        .map(([id, v]) => ({
          query: queryText.get(id) ?? `Query #${id}`,
          runs: v.runs,
          citations: v.citations,
          citationRate: rate(v.citations, v.runs),
          bestRank: v.bestRank,
          lastRunAt: v.lastRunAt,
          citedOn: [...v.engines].sort(),
        }))
        .sort((a, b) => b.citationRate - a.citationRate || b.runs - a.runs),
      topCompetitors: [...competitors.entries()]
        .map(([name, mentions]) => ({ name, mentions }))
        .sort((a, b) => b.mentions - a.mentions)
        .slice(0, 12),
      lastRunAt: runs[0]?.run_at ?? null,
    }
  } catch {
    return null
  }
}

/* --------------------------- Competitors --------------------------- */

interface CompetitorSnapshotRow {
  captured_at: string
  competitor: string
  summary: string | null
  new_posts: unknown
  source: string | null
}

export interface CompetitorPost {
  title: string
  url: string | null
  publishedAt: string | null
}

export interface CompetitorActivity {
  competitor: string
  capturedAt: string
  summary: string | null
  source: string | null
  posts: CompetitorPost[]
  /** Snapshots seen for this competitor in the window — a crude activity signal. */
  snapshots: number
}

/** `new_posts` is written as free-form jsonb; accept the shapes actually seen. */
function parsePosts(raw: unknown): CompetitorPost[] {
  if (!Array.isArray(raw)) return []
  const posts: CompetitorPost[] = []
  for (const entry of raw) {
    if (typeof entry === "string") {
      posts.push({ title: entry, url: null, publishedAt: null })
      continue
    }
    if (entry && typeof entry === "object") {
      const o = entry as Record<string, unknown>
      const title = [o.title, o.name, o.headline].find((v) => typeof v === "string") as string | undefined
      const url = [o.url, o.link, o.href].find((v) => typeof v === "string") as string | undefined
      const at = [o.publishedAt, o.published_at, o.date].find((v) => typeof v === "string") as string | undefined
      if (title) posts.push({ title, url: url ?? null, publishedAt: at ?? null })
    }
  }
  return posts
}

export async function getCompetitorActivity(days = 90): Promise<CompetitorActivity[] | null> {
  try {
    const rows = await query<CompetitorSnapshotRow>(
      `competitor_snapshots?select=captured_at,competitor,summary,new_posts,source` +
        `&captured_at=gte.${encodeURIComponent(isoDaysAgo(days))}&order=captured_at.desc&limit=500`,
    )

    // Newest-first, so the first row per competitor is the current snapshot.
    const latest = new Map<string, CompetitorActivity>()
    for (const row of rows) {
      const name = (row.competitor ?? "").trim()
      if (!name) continue
      const existing = latest.get(name)
      if (existing) {
        existing.snapshots += 1
        continue
      }
      latest.set(name, {
        competitor: name,
        capturedAt: row.captured_at,
        summary: row.summary,
        source: row.source,
        posts: parsePosts(row.new_posts),
        snapshots: 1,
      })
    }
    return [...latest.values()].sort((a, b) => b.posts.length - a.posts.length || a.competitor.localeCompare(b.competitor))
  } catch {
    return null
  }
}

/**
 * Internal linking CLI for blog posts (monday 2896332398).
 *
 *   npm run internal-links -- --dry-run            report only (default)
 *   npm run internal-links -- --apply              patch Sanity (needs SANITY_WRITE_TOKEN)
 *
 * Flags: --limit <n>, --only <slug> (repeatable or comma separated),
 * --report <path> (default scripts/internal-links/report.md).
 *
 * Matching rules live in src/lib/internalLinks.ts. See README.md here.
 */
import { createClient } from "@sanity/client"
import * as dotenv from "dotenv"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import {
  clampMaxLinks,
  normalizePath,
  planInternalLinks,
  type AddedLink,
  type InternalLinkTarget,
  type PtBlock,
  type SkipReason,
} from "../../src/lib/internalLinks"

dotenv.config({ path: ".env.local" })

// npm run always starts in the repo root.
const HERE = join(process.cwd(), "scripts", "internal-links")

type Config = {
  maxLinksPerDoc?: number
  skipFirstParagraph?: boolean
  targets: InternalLinkTarget[]
}

type Args = {
  apply: boolean
  limit?: number
  only: string[]
  report: string
}

function parseArgs(argv: string[]): Args {
  const args: Args = { apply: false, only: [], report: join(HERE, "report.md") }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => {
      const v = argv[++i]
      if (v === undefined) fail(`Missing value for ${a}`)
      return v
    }
    if (a === "--apply") args.apply = true
    else if (a === "--dry-run") args.apply = false
    else if (a === "--limit") {
      const n = Number(next())
      if (!Number.isInteger(n) || n < 1) fail("--limit must be a positive integer")
      args.limit = n
    } else if (a === "--only") args.only.push(...next().split(",").map((s) => s.trim()).filter(Boolean))
    else if (a === "--report") args.report = next()
    else fail(`Unknown flag: ${a}`)
  }
  if (argv.includes("--apply") && argv.includes("--dry-run")) fail("Use either --apply or --dry-run, not both")
  return args
}

function fail(message: string): never {
  console.error(`internal-links: ${message}`)
  process.exit(1)
}

function loadConfig(): Config {
  const raw = JSON.parse(readFileSync(join(HERE, "targets.json"), "utf8")) as Config
  if (!Array.isArray(raw.targets) || !raw.targets.length) fail("targets.json has no targets")
  const seen = new Set<string>()
  for (const t of raw.targets) {
    if (typeof t.path !== "string" || !t.path.startsWith("/")) fail(`Target path must start with "/": ${t.path}`)
    if (!Array.isArray(t.keywords) || !t.keywords.length) fail(`Target ${t.path} has no keywords`)
    const p = normalizePath(t.path)!
    if (seen.has(p)) fail(`Duplicate target path: ${t.path}`)
    seen.add(p)
  }
  return raw
}

type Post = { _id: string; title?: string; slug: string; body?: PtBlock[] }

type DocResult = { post: Post; added: AddedLink[]; skipped: Partial<Record<SkipReason, number>>; body: PtBlock[] }

function buildReport(opts: {
  mode: string
  config: Config
  maxLinks: number
  scanned: number
  results: DocResult[]
}): string {
  const { config, maxLinks, scanned, results } = opts
  const changed = results.filter((r) => r.added.length)
  const total = changed.reduce((n, r) => n + r.added.length, 0)
  const perTarget = new Map<string, number>()
  for (const t of config.targets) perTarget.set(t.path, 0)
  for (const r of changed) for (const a of r.added) perTarget.set(a.targetPath, (perTarget.get(a.targetPath) ?? 0) + 1)
  const unmatched = [...perTarget].filter(([, n]) => n === 0).map(([p]) => p)
  const capped = changed.filter((r) => r.added.length >= maxLinks)
  const skippedTotals: Partial<Record<SkipReason, number>> = {}
  for (const r of results)
    for (const [k, v] of Object.entries(r.skipped)) skippedTotals[k as SkipReason] = (skippedTotals[k as SkipReason] ?? 0) + (v ?? 0)

  const lines: string[] = []
  lines.push(`# Internal links report`, "")
  lines.push(`Mode: ${opts.mode}. Generated ${new Date().toISOString()}.`, "")
  lines.push(`## Totals`, "")
  lines.push(`- Documents scanned: ${scanned}`)
  lines.push(`- Documents changed: ${changed.length}`)
  lines.push(`- Links added: ${total}`)
  lines.push(`- Max links per document: ${maxLinks}`)
  lines.push(`- Documents at the cap: ${capped.length}`)
  lines.push(`- Targets with zero matches: ${unmatched.length}`, "")
  lines.push(`## Links per target`, "", "| Target | Links |", "| --- | ---: |")
  for (const [p, n] of [...perTarget].sort((a, b) => b[1] - a[1])) lines.push(`| ${p} | ${n} |`)
  lines.push("", `## Targets with zero matches`, "")
  lines.push(...(unmatched.length ? unmatched.map((p) => `- ${p}`) : ["None."]))
  lines.push("", `## Skipped matches by reason`, "")
  const sk = Object.entries(skippedTotals).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
  lines.push(...(sk.length ? sk.map(([k, v]) => `- ${k}: ${v}`) : ["None."]))
  lines.push("", `## Documents at the cap`, "")
  lines.push(...(capped.length ? capped.map((r) => `- /post/${r.post.slug}`) : ["None."]))
  lines.push("", `## Per document`, "")
  for (const r of changed) {
    lines.push(`### /post/${r.post.slug}`, "")
    for (const a of r.added) {
      lines.push(`- "${a.anchorText}" -> ${a.targetPath} (keyword "${a.keyword}", block ${a.blockIndex}, ${a.style})`)
      lines.push(`  - ${a.before.replace(/\|/g, "\\|")}`)
    }
    lines.push("")
  }
  return lines.join("\n")
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const config = loadConfig()
  const maxLinks = clampMaxLinks(config.maxLinksPerDoc)

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) fail("NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set (.env.local)")

  const token = process.env.SANITY_WRITE_TOKEN
  if (args.apply && !token) fail("--apply needs SANITY_WRITE_TOKEN. Nothing was changed.")

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "published",
    ...(args.apply ? { token } : {}),
  })

  const posts = await client.fetch<Post[]>(
    `*[_type=="blogPost" && defined(slug.current)] | order(publishedAt desc){_id, title, "slug": slug.current, body}`,
  )
  let selected = posts
  if (args.only.length) {
    const want = new Set(args.only)
    selected = selected.filter((p) => want.has(p.slug))
    const missing = args.only.filter((s) => !posts.some((p) => p.slug === s))
    if (missing.length) console.warn(`internal-links: no post with slug: ${missing.join(", ")}`)
  }
  if (args.limit) selected = selected.slice(0, args.limit)

  const results: DocResult[] = []
  for (const post of selected) {
    const res = planInternalLinks({
      blocks: Array.isArray(post.body) ? post.body : [],
      docPath: `/post/${post.slug}`,
      targets: config.targets,
      maxLinks,
      skipFirstParagraph: !!config.skipFirstParagraph,
    })
    results.push({ post, added: res.added, skipped: res.skipped, body: res.blocks })
  }

  const changed = results.filter((r) => r.added.length)
  if (args.apply) {
    for (const r of changed) {
      await client.patch(r.post._id).set({ body: r.body }).commit()
      console.log(`patched /post/${r.post.slug}: ${r.added.length} link(s)`)
    }
  }

  const report = buildReport({
    mode: args.apply ? "apply" : "dry run (nothing written to Sanity)",
    config,
    maxLinks,
    scanned: selected.length,
    results,
  })
  mkdirSync(dirname(args.report), { recursive: true })
  writeFileSync(args.report, report)

  const total = changed.reduce((n, r) => n + r.added.length, 0)
  console.log(
    `${args.apply ? "Applied" : "Dry run"}: scanned ${selected.length}, changed ${changed.length}, links ${total}. Report: ${relative(process.cwd(), args.report) || args.report}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

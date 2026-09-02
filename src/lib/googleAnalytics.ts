/**
 * Read-only GA4 (Data API) + Google Search Console (Search Analytics) clients.
 * Auth via the shared service account (see googleServiceAuth.ts). All functions
 * return null / empty on missing config so callers can render a graceful
 * "not connected yet" state instead of throwing.
 *
 * Env:
 *   GOOGLE_SA_KEY_B64  — base64 of the service-account JSON (server-only)
 *   GA4_PROPERTY_ID    — numeric GA4 property id (e.g. 542191003)
 *   GSC_SITE_URL       — optional; the exact Search Console property
 *                        (`sc-domain:fruitionservices.io` or
 *                        `https://www.fruitionservices.io/`). Auto-detected if unset.
 */
import { getGoogleAccessToken } from "./googleServiceAuth"

const SCOPE_GA4 = "https://www.googleapis.com/auth/analytics.readonly"
const SCOPE_GSC = "https://www.googleapis.com/auth/webmasters.readonly"

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10)
}

/* ----------------------------- GA4 ----------------------------- */

export interface Ga4Overview {
  totalUsers: number
  sessions: number
  pageViews: number
  conversions: number
  daily: { date: string; users: number }[]
  topCountries: { country: string; users: number }[]
}

interface Ga4Row {
  dimensionValues: { value: string }[]
  metricValues: { value: string }[]
}

async function ga4RunReport(
  property: string,
  token: string,
  body: Record<string, unknown>,
): Promise<{ rows?: Ga4Row[] }> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
  if (!res.ok) throw new Error(`GA4 runReport ${res.status}: ${await res.text()}`)
  return res.json() as Promise<{ rows?: Ga4Row[] }>
}

export async function getGa4Overview(days = 28): Promise<Ga4Overview | null> {
  const property = process.env.GA4_PROPERTY_ID
  if (!property) return null

  const token = await getGoogleAccessToken([SCOPE_GA4])
  const dateRanges = [{ startDate: isoDaysAgo(days), endDate: "today" }]

  // Daily totals. "keyEvents" is GA4's current name for conversions; if the
  // property rejects it, retry without so the core metrics still resolve.
  const baseMetrics = [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }]
  let rows: Ga4Row[] = []
  let hasConversions = false
  try {
    const r = await ga4RunReport(property, token, {
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: [...baseMetrics, { name: "keyEvents" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    })
    rows = r.rows ?? []
    hasConversions = true
  } catch {
    const r = await ga4RunReport(property, token, {
      dateRanges,
      dimensions: [{ name: "date" }],
      metrics: baseMetrics,
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    })
    rows = r.rows ?? []
  }

  let totalUsers = 0
  let sessions = 0
  let pageViews = 0
  let conversions = 0
  const daily: { date: string; users: number }[] = []
  for (const row of rows) {
    const d = row.dimensionValues[0]?.value ?? ""
    const users = Number(row.metricValues[0]?.value ?? 0)
    totalUsers += users
    sessions += Number(row.metricValues[1]?.value ?? 0)
    pageViews += Number(row.metricValues[2]?.value ?? 0)
    if (hasConversions) conversions += Number(row.metricValues[3]?.value ?? 0)
    daily.push({ date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, users })
  }

  let topCountries: { country: string; users: number }[] = []
  try {
    const geo = await ga4RunReport(property, token, {
      dateRanges,
      dimensions: [{ name: "country" }],
      metrics: [{ name: "totalUsers" }],
      orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
      limit: 6,
    })
    topCountries = (geo.rows ?? []).map((r) => ({
      country: r.dimensionValues[0]?.value ?? ", ",
      users: Number(r.metricValues[0]?.value ?? 0),
    }))
  } catch {
    // countries are a nice-to-have; ignore failures
  }

  return { totalUsers, sessions, pageViews, conversions, daily, topCountries }
}

/* ----------------------------- GSC ----------------------------- */

export interface GscClicks {
  siteUrl: string
  /** pathname (e.g. "/post/foo") → total clicks over the window */
  byPath: Map<string, number>
  totalClicks: number
  totalImpressions: number
}

async function resolveGscSite(token: string): Promise<string | null> {
  // `no-store`: Next patches fetch and caches GETs, and a stale sites list here
  // would outlive a permissions change. This is the only GET in the path.
  const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  const override = process.env.GSC_SITE_URL
  if (!res.ok) {
    // Can't verify — an explicit override is still better than nothing.
    return override ?? null
  }
  const data = (await res.json()) as { siteEntry?: { siteUrl: string }[] }
  const sites = data.siteEntry ?? []

  // An override is only honoured if the service account actually has it. A
  // stale or foreign value (a leftover from another project, say) otherwise
  // 403s on every query and silently zeroes every Search Console column.
  if (override) {
    if (sites.some((s) => s.siteUrl === override)) return override
    console.warn(
      `GSC_SITE_URL is set to "${override}", which this service account cannot read. Falling back to auto-detection.`,
    )
  }

  // Prefer a domain property, then any URL-prefix on the domain.
  const domain = sites.find((s) => s.siteUrl.startsWith("sc-domain:") && /fruitionservices\.io/i.test(s.siteUrl))
  const prefix = sites.find((s) => /fruitionservices\.io/i.test(s.siteUrl))
  return (domain ?? prefix)?.siteUrl ?? null
}

export async function getGscClicksByPage(days = 28): Promise<GscClicks | null> {
  const token = await getGoogleAccessToken([SCOPE_GSC])
  const siteUrl = await resolveGscSite(token)
  if (!siteUrl) return null

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: isoDaysAgo(days),
        endDate: isoDaysAgo(0),
        dimensions: ["page"],
        rowLimit: 1000,
      }),
    },
  )
  if (!res.ok) throw new Error(`GSC searchAnalytics ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as {
    rows?: { keys: string[]; clicks: number; impressions: number }[]
  }

  const byPath = new Map<string, number>()
  let totalClicks = 0
  let totalImpressions = 0
  for (const row of data.rows ?? []) {
    let path: string
    try {
      path = new URL(row.keys[0]).pathname.replace(/\/$/, "") || "/"
    } catch {
      continue
    }
    byPath.set(path, (byPath.get(path) ?? 0) + row.clicks)
    totalClicks += row.clicks
    totalImpressions += row.impressions
  }
  return { siteUrl, byPath, totalClicks, totalImpressions }
}

/* --------------------- Per-page performance --------------------- */

export interface PageTraffic {
  views: number
  sessions: number
  users: number
}

/**
 * GA4 traffic per page path. `pathPrefix` narrows the report server-side so a
 * blog-only view does not pull the whole site and then discard most of it.
 */
export async function getPageTrafficByPath(
  days = 28,
  pathPrefix?: string,
): Promise<Map<string, PageTraffic> | null> {
  const property = process.env.GA4_PROPERTY_ID
  if (!property) return null
  const token = await getGoogleAccessToken([SCOPE_GA4])

  const report = await ga4RunReport(property, token, {
    dateRanges: [{ startDate: isoDaysAgo(days), endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "sessions" }, { name: "totalUsers" }],
    ...(pathPrefix
      ? {
          dimensionFilter: {
            filter: {
              fieldName: "pagePath",
              stringFilter: { matchType: "BEGINS_WITH", value: pathPrefix },
            },
          },
        }
      : {}),
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 1000,
  })

  const byPath = new Map<string, PageTraffic>()
  for (const row of report.rows ?? []) {
    const path = normalisePath(row.dimensionValues[0]?.value ?? "")
    if (!path) continue
    const prev = byPath.get(path)
    const next: PageTraffic = {
      views: (prev?.views ?? 0) + Number(row.metricValues[0]?.value ?? 0),
      sessions: (prev?.sessions ?? 0) + Number(row.metricValues[1]?.value ?? 0),
      users: (prev?.users ?? 0) + Number(row.metricValues[2]?.value ?? 0),
    }
    byPath.set(path, next)
  }
  return byPath
}

/**
 * `cta_click` events per page path — the events pushed by `trackCtaClick()`
 * (src/lib/ctaTracking.ts) and forwarded to GA4 by the GTM trigger.
 *
 * Returns an empty map (not null) when the property has no such events yet, so
 * the UI can distinguish "not configured" (null) from "configured, no data yet".
 */
export async function getCtaClicksByPath(days = 28): Promise<Map<string, number> | null> {
  const property = process.env.GA4_PROPERTY_ID
  if (!property) return null
  const token = await getGoogleAccessToken([SCOPE_GA4])

  const report = await ga4RunReport(property, token, {
    dateRanges: [{ startDate: isoDaysAgo(days), endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        stringFilter: { matchType: "EXACT", value: "cta_click" },
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 1000,
  })

  const byPath = new Map<string, number>()
  for (const row of report.rows ?? []) {
    const path = normalisePath(row.dimensionValues[0]?.value ?? "")
    if (!path) continue
    byPath.set(path, (byPath.get(path) ?? 0) + Number(row.metricValues[0]?.value ?? 0))
  }
  return byPath
}

export interface GscPageMetrics {
  clicks: number
  impressions: number
  /** 0-1, as GSC reports it. */
  ctr: number
  position: number
}

/** Full Search Console metrics per page, not just the click count. */
export async function getGscMetricsByPath(days = 28): Promise<Map<string, GscPageMetrics> | null> {
  const token = await getGoogleAccessToken([SCOPE_GSC])
  const siteUrl = await resolveGscSite(token)
  if (!siteUrl) return null

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: isoDaysAgo(days),
        endDate: isoDaysAgo(0),
        dimensions: ["page"],
        rowLimit: 1000,
      }),
    },
  )
  if (!res.ok) throw new Error(`GSC searchAnalytics ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as {
    rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[]
  }

  // Several GSC rows can normalise to one path (trailing slash, query-string
  // variants), so accumulate rather than overwrite — a plain set lets a
  // low-traffic variant silently replace the real row.
  const byPath = new Map<string, GscPageMetrics>()
  for (const row of data.rows ?? []) {
    let path: string
    try {
      path = normalisePath(new URL(row.keys[0]).pathname)
    } catch {
      continue
    }
    if (!path) continue
    const prev = byPath.get(path)
    const clicks = (prev?.clicks ?? 0) + row.clicks
    const impressions = (prev?.impressions ?? 0) + row.impressions
    byPath.set(path, {
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      // Average position weighted by impressions — the only way to combine two
      // rows without over-weighting a page variant nobody sees.
      position:
        prev && impressions > 0
          ? (prev.position * prev.impressions + row.position * row.impressions) / impressions
          : row.position,
    })
  }
  return byPath
}

/**
 * Trailing slashes and query strings vary between GA4 and GSC, and a mismatch
 * silently splits one post into two rows. Exported for tests.
 */
export function normalisePath(raw: string): string {
  if (!raw) return ""
  const path = raw.split("?")[0].split("#")[0]
  const trimmed = path.replace(/\/+$/, "")
  return trimmed === "" ? "/" : trimmed
}

export interface PostPerformance {
  slug: string
  path: string
  views: number
  sessions: number
  users: number
  ctaClicks: number
  /** CTA clicks per 100 views — comparable across posts of different reach. */
  ctaRate: number | null
  search: GscPageMetrics | null
}

export interface BlogPerformance {
  posts: PostPerformance[]
  totals: { views: number; sessions: number; ctaClicks: number; searchClicks: number }
  /** True when GA4 returned no cta_click events at all — the GTM tag is likely not live yet. */
  ctaTrackingIdle: boolean
}

/**
 * Everything the portal shows per blog post, in one call: GA4 traffic, GA4
 * `cta_click` counts and Search Console metrics, joined on `/post/<slug>`.
 *
 * Each source is fetched independently and a failure in one degrades that column
 * to zero rather than failing the page — the portal must still render when, say,
 * Search Console permissions lapse.
 */
export async function getBlogPerformance(days = 28): Promise<BlogPerformance | null> {
  const [traffic, cta, search] = await Promise.all([
    getPageTrafficByPath(days, "/post/").catch(() => null),
    getCtaClicksByPath(days).catch(() => null),
    getGscMetricsByPath(days).catch(() => null),
  ])
  if (!traffic && !cta && !search) return null

  const paths = new Set<string>()
  for (const p of traffic?.keys() ?? []) paths.add(p)
  for (const p of cta?.keys() ?? []) if (p.startsWith("/post/")) paths.add(p)
  for (const p of search?.keys() ?? []) if (p.startsWith("/post/")) paths.add(p)

  const posts: PostPerformance[] = []
  const totals = { views: 0, sessions: 0, ctaClicks: 0, searchClicks: 0 }

  for (const path of paths) {
    const slug = path.replace(/^\/post\//, "")
    if (!slug) continue
    const t = traffic?.get(path)
    const ctaClicks = cta?.get(path) ?? 0
    const s = search?.get(path) ?? null
    const views = t?.views ?? 0

    posts.push({
      slug,
      path,
      views,
      sessions: t?.sessions ?? 0,
      users: t?.users ?? 0,
      ctaClicks,
      ctaRate: views > 0 ? (ctaClicks / views) * 100 : null,
      search: s,
    })
    totals.views += views
    totals.sessions += t?.sessions ?? 0
    totals.ctaClicks += ctaClicks
    totals.searchClicks += s?.clicks ?? 0
  }

  posts.sort((a, b) => b.views - a.views)
  return { posts, totals, ctaTrackingIdle: cta !== null && cta.size === 0 }
}

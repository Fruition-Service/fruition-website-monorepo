import { NextResponse } from "next/server"
import { runHubSpotBlogSync } from "@/lib/hubspotBlog/sync"
import { recordRun, lastRun } from "@/lib/hubspotBlog/heartbeat"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 300

/** The "Fruition Services blog" in HubSpot portal 442278519. */
const DEFAULT_BLOG_ID = "367476848118"

function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * HubSpot → Fruition blog sync. Called every 5 minutes by the Worker's cron
 * (workers/site-entry.ts) and by hand for a dry run:
 *
 *   curl -X POST -H "x-sync-secret: $HUBSPOT_SYNC_SECRET" \
 *     "https://www.fruitionservices.io/api/cron/hubspot-blog-sync?dryRun=1"
 *
 * `?force=1` rewrites every HubSpot post even if unchanged. Website only:
 * publishing here never creates social posts (see src/lib/hubspotBlog/sync.ts).
 *
 * Env: HUBSPOT_BLOG_TOKEN (private app, `content` scope, portal 442278519),
 * HUBSPOT_SYNC_SECRET, optional HUBSPOT_BLOG_CONTENT_GROUP_ID and
 * HUBSPOT_BLOG_SYNC_DISABLED=1 as an off switch.
 */
function authorized(req: Request): boolean {
  const secret = process.env.HUBSPOT_SYNC_SECRET
  return Boolean(secret) && sameSecret(req.headers.get("x-sync-secret") ?? "", secret as string)
}

/** When the last real (not dry) run happened and what it did. */
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  return NextResponse.json({ lastRun: await lastRun() })
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  if (process.env.HUBSPOT_BLOG_SYNC_DISABLED === "1") {
    return NextResponse.json({ ok: true, skipped: "HUBSPOT_BLOG_SYNC_DISABLED" })
  }
  const token = process.env.HUBSPOT_BLOG_TOKEN
  if (!token) return NextResponse.json({ error: "HUBSPOT_BLOG_TOKEN not set" }, { status: 503 })

  const url = new URL(req.url)
  try {
    const report = await runHubSpotBlogSync({
      token,
      dryRun: url.searchParams.get("dryRun") === "1",
      force: url.searchParams.get("force") === "1",
      contentGroupId: process.env.HUBSPOT_BLOG_CONTENT_GROUP_ID || DEFAULT_BLOG_ID,
    })
    const changed = report.draftsWritten.length + report.published.length + report.unpublished.length + report.deleted.length
    if (changed > 0 || report.errors.length > 0) console.log("[hubspot-blog-sync]", JSON.stringify(report))
    if (!report.dryRun) {
      await recordRun({
        ok: report.ok,
        posts: report.hubspotPosts,
        changed,
        errors: report.errors.slice(0, 5),
        trigger: req.headers.get("x-sync-trigger") ?? "manual",
      })
    }
    return NextResponse.json(report, { status: report.ok ? 200 : 500 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[hubspot-blog-sync] failed:", message)
    await recordRun({ ok: false, error: message.slice(0, 300), trigger: req.headers.get("x-sync-trigger") ?? "manual" })
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}

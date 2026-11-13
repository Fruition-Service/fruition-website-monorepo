/**
 * Run the HubSpot -> Fruition blog sync from a laptop (same code the Worker
 * cron runs). Dry run unless --apply. Cache refresh happens through the Sanity
 * publish webhook; revalidatePath warnings outside Next are expected.
 *
 *   HUBSPOT_BLOG_TOKEN=... npx tsx --env-file=.env.local scripts/hubspot-blog-sync.ts [--apply] [--force]
 */
import { runHubSpotBlogSync } from "../src/lib/hubspotBlog/sync"

async function main() {
  const token = process.env.HUBSPOT_BLOG_TOKEN
  if (!token) throw new Error("HUBSPOT_BLOG_TOKEN missing")
  const report = await runHubSpotBlogSync({
    token,
    dryRun: !process.argv.includes("--apply"),
    force: process.argv.includes("--force"),
    contentGroupId: process.env.HUBSPOT_BLOG_CONTENT_GROUP_ID || "367476848118",
  })
  console.log(JSON.stringify(report, null, 2))
  if (!report.ok) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

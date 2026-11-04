/**
 * Fill the client logo wall heading on the monday-for-* `industryPage`
 * documents so it is a Sanity value the inline editor can click.
 *
 *   npx tsx scripts/seed-industry-logo-headings.ts           # dry run
 *   npx tsx scripts/seed-industry-logo-headings.ts --apply   # writes
 *
 * These pages render ClientLogoSection's standard heading whenever
 * logoCloudHeadingPart1 / logoCloudHeadingAccent are missing or blank. This
 * writes that same standard heading into each field that is missing or blank
 * (on the published document and any open Studio draft), so the page reads
 * exactly as before. A field with real text is never touched, and no other
 * field is written.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { createClient } from "@sanity/client"
import { INDUSTRY_SECTIONS } from "../src/data/industrySections"

loadEnv({ path: ".env.local" })

const apply = process.argv.includes("--apply")
const SLUGS = Object.keys(INDUSTRY_SECTIONS).filter((slug) => slug.startsWith("monday-for-"))

/** ClientLogoSection's DEFAULT_PART1 and DEFAULT_ACCENT, trailing space included. */
const DEFAULTS = {
  logoCloudHeadingPart1: "Clients who have used our ",
  logoCloudHeadingAccent: "monday.com consulting services",
} as const

type Doc = { _id: string; slug: string; logoCloudHeadingPart1?: unknown; logoCloudHeadingAccent?: unknown }

const blank = (v: unknown) => v == null || (typeof v === "string" && !v.trim())

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    perspective: "raw",
  })

  const docs = await client.fetch<Doc[]>(
    `*[_type == "industryPage" && slug.current in $slugs] | order(_id asc){
      _id, "slug": slug.current, logoCloudHeadingPart1, logoCloudHeadingAccent
    }`,
    { slugs: SLUGS },
  )
  for (const slug of SLUGS) {
    if (!docs.some((d) => d.slug === slug && !d._id.startsWith("drafts."))) {
      console.log(`WARNING: no published industryPage for ${slug}`)
    }
  }

  const tx = client.transaction()
  let writes = 0
  for (const doc of docs) {
    const set = Object.fromEntries(
      (Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[])
        .filter((k) => blank(doc[k]))
        .map((k) => [k, DEFAULTS[k]]),
    )
    const keep = (Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[])
      .filter((k) => !blank(doc[k]))
      .map((k) => `${k}=${JSON.stringify(doc[k])}`)
    console.log(
      `${doc._id} (${doc.slug}): set ${Object.keys(set).join(", ") || "nothing"}${keep.length ? `; keeps ${keep.join(", ")}` : ""}`,
    )
    if (Object.keys(set).length) {
      tx.patch(doc._id, (p) => p.set(set))
      writes++
    }
  }

  if (!apply) {
    console.log(`\nDry run: ${writes} patch(es) planned. Re-run with --apply to write.`)
    return
  }
  if (!writes) {
    console.log("Nothing to write.")
    return
  }
  const res = await tx.commit()
  console.log(`Committed ${res.results.length} patch(es), transaction ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

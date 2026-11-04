/**
 * Seed the /monday-for-government long-form sections into Sanity.
 *
 *   npx tsx scripts/seed-monday-for-government.ts           # dry run
 *   npx tsx scripts/seed-monday-for-government.ts --apply   # writes
 *
 * The page reads its copy from the `industryPage` document already; only the
 * `sections` object (the numbered capability blocks and the permission
 * ledger) is new. This writes today's wording from
 * src/data/industrySections.ts into it, so the text becomes editable in
 * Studio and in the inline editor. Fields that already exist are never
 * overwritten, and the document is skipped entirely once `sections` is
 * present, so edits made by an editor survive re-runs.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { createClient } from "@sanity/client"
import { PAGE_SLUG } from "../src/app/monday-for-government/content"
import { toSanitySections } from "../src/app/monday-for-government/contentMerge"

loadEnv({ path: ".env.local" })

const apply = process.argv.includes("--apply")
const DOC_ID = `industryPage-${PAGE_SLUG}`

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    perspective: "raw",
  })

  const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in [$id, $draft]]`, {
    id: DOC_ID,
    draft: `drafts.${DOC_ID}`,
  })
  if (!docs.some((d) => d._id === DOC_ID)) throw new Error(`No published ${DOC_ID} document`)

  const sections = toSanitySections()
  const tx = client.transaction()
  for (const doc of docs) {
    if (doc.sections !== undefined) {
      console.log(`${doc._id}: sections already present, left alone`)
      continue
    }
    console.log(`${doc._id}: set sections`)
    tx.patch(doc._id as string, (p) => p.set({ sections }))
  }

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write.")
    return
  }
  const res = await tx.commit()
  console.log(`Committed ${res.results.length} patch(es), transaction ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

/**
 * Seed the /implementation-packages copy into its Sanity singleton.
 *
 *   npx tsx scripts/seed-implementation-packages.ts           # dry run
 *   npx tsx scripts/seed-implementation-packages.ts --apply   # writes
 *   npx tsx scripts/seed-implementation-packages.ts --retire --apply  # also unsets the old fields
 *
 * Sets every field the `implementationPackagesPage` document (and any open
 * Studio draft of it) doesn't have yet to today's wording from
 * src/app/implementation-packages/content.ts. Fields that already exist are
 * never overwritten, so edits made in Studio or the inline editor survive
 * re-runs. The first run also replaces the stale pre-redesign meta title and
 * description (the live page has used content.ts's since PR #355). --retire
 * unsets the pre-redesign fields; run it once the new page code is live.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { createClient } from "@sanity/client"
import { RETIRED_FIELDS, toSanityFields } from "../src/app/implementation-packages/contentMerge"

loadEnv({ path: ".env.local" })

const DOC_ID = "implementationPackagesPage"
const apply = process.argv.includes("--apply")
const retire = process.argv.includes("--retire")

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

  const fields = toSanityFields()
  const tx = client.transaction()
  for (const doc of docs) {
    const firstRun = doc.hero === undefined
    const set = Object.fromEntries(
      Object.entries(fields).filter(([k]) => doc[k] === undefined || (firstRun && (k === "seoTitle" || k === "seoDescription"))),
    )
    const unset = retire ? RETIRED_FIELDS.filter((k) => doc[k] !== undefined) : []
    console.log(`${doc._id}: set ${Object.keys(set).join(", ") || "nothing"}; unset ${unset.join(", ") || "nothing"}`)
    if (firstRun && doc.seoTitle !== undefined) console.log(`  old meta title: ${JSON.stringify(doc.seoTitle)}`)
    if (Object.keys(set).length || unset.length) tx.patch(doc._id as string, (p) => p.set(set).unset(unset))
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

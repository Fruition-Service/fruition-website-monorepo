/**
 * Seed the practice page copy into `practicePage` Sanity documents.
 *
 *   npx tsx scripts/seed-practice-pages.ts           # dry run
 *   npx tsx scripts/seed-practice-pages.ts --apply   # writes
 *
 * One document per route in EDITABLE_PRACTICE_PAGES
 * (src/data/practicePages/editable.ts): the 22 PracticePageTemplate routes
 * and the five /industries leaves. Ids are deterministic
 * (`practicePage-<path with / replaced by ->`), so re-runs find the same
 * documents. A missing document is created; on an existing one (and any open
 * Studio draft of it) only the fields that are not set yet are filled in from
 * today's wording in src/data/practicePages/. Fields that already exist are
 * never overwritten, so edits made in Studio or the inline editor survive
 * re-runs.
 *
 * The shared blocks are seeded with the copy each route renders today, and
 * only on the routes that show them: the logo wall heading on the /industries
 * leaves, and the coverage, practice leader, booking and FAQ headings on the
 * PracticePageTemplate routes (renderedSharedFields in editable.ts).
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { createClient } from "@sanity/client"

loadEnv({ path: ".env.local" })

const apply = process.argv.includes("--apply")

async function main() {
  // Imported after loadEnv: the page data reaches src/sanity/env.ts, which
  // throws at import time when the Sanity env vars are not set yet.
  const { EDITABLE_PRACTICE_PAGES, practicePageDocId, toPracticePageFields } = await import(
    "../src/data/practicePages/editable"
  )
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    perspective: "raw",
  })

  const ids = EDITABLE_PRACTICE_PAGES.map((p) => practicePageDocId(p.path))
  const docs = await client.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, {
    ids: [...ids, ...ids.map((id) => `drafts.${id}`)],
  })
  const byId = new Map(docs.map((d) => [d._id as string, d]))

  // A document on another id already claiming one of these paths would make
  // the route's lookup ambiguous. Report it rather than create a twin.
  const clashes = await client.fetch<{ _id: string; path: string }[]>(
    `*[_type == "practicePage" && path in $paths && !(_id in $ids)]{ _id, path }`,
    { paths: EDITABLE_PRACTICE_PAGES.map((p) => p.path), ids: [...ids, ...ids.map((id) => `drafts.${id}`)] },
  )
  for (const c of clashes) console.log(`WARNING: ${c._id} already uses ${c.path}`)

  const tx = client.transaction()
  let writes = 0
  for (const page of EDITABLE_PRACTICE_PAGES) {
    const id = practicePageDocId(page.path)
    const fields = toPracticePageFields(page)
    const published = byId.get(id)
    if (!published) {
      console.log(`${id}: create with ${Object.keys(fields).join(", ")}`)
      tx.createIfNotExists({ _id: id, _type: "practicePage", ...fields })
      writes++
    }
    for (const doc of [published, byId.get(`drafts.${id}`)]) {
      if (!doc) continue
      const set = Object.fromEntries(Object.entries(fields).filter(([k]) => doc[k] === undefined))
      console.log(`${doc._id}: set ${Object.keys(set).join(", ") || "nothing"}`)
      if (Object.keys(set).length) {
        tx.patch(doc._id as string, (p) => p.set(set))
        writes++
      }
    }
  }

  if (!apply) {
    console.log(`\nDry run: ${writes} write(s) planned. Re-run with --apply to write.`)
    return
  }
  if (!writes) {
    console.log("Nothing to write.")
    return
  }
  const res = await tx.commit()
  console.log(`Committed ${res.results.length} mutation(s), transaction ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

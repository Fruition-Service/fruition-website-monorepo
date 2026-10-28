/**
 * Seed the home page copy slots into Sanity.
 *
 *   npx tsx scripts/seed-home-copy.ts          # dry run: prints what would change
 *   npx tsx scripts/seed-home-copy.ts --apply  # writes
 *
 * Adds every slot in HOME_COPY (src/components/home/copy.ts) that the
 * `homePage` document doesn't have yet, with today's default wording, and
 * refreshes slot labels. Text that already exists in Sanity is never
 * overwritten, so edits made with the inline editor survive re-runs.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { createClient } from "@sanity/client"
import { HOME_COPY } from "../src/components/home/copy"

loadEnv({ path: ".env.local" })

const DOC_ID = "homePage"
const apply = process.argv.includes("--apply")

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    perspective: "raw",
  })

  const ids = [DOC_ID, `drafts.${DOC_ID}`]
  const docs = await client.fetch<{ _id: string; copy?: { _key: string; label?: string }[] }[]>(
    `*[_id in $ids]{ _id, copy[]{ _key, label } }`,
    { ids },
  )
  if (!docs.some((d) => d._id === DOC_ID)) throw new Error(`No published ${DOC_ID} document`)

  const slots = Object.entries(HOME_COPY) as [string, { label: string; text: string }][]
  const tx = client.transaction()
  for (const doc of docs) {
    const existing = new Map((doc.copy ?? []).map((s) => [s._key, s.label]))
    const missing = slots.filter(([id]) => !existing.has(id))
    const relabel = slots.filter(([id, s]) => existing.has(id) && existing.get(id) !== s.label)
    console.log(`${doc._id}: ${existing.size} existing, ${missing.length} to add, ${relabel.length} to relabel`)
    if (!missing.length && !relabel.length) continue
    tx.patch(doc._id, (p) => {
      let patch = p.setIfMissing({ copy: [] })
      if (missing.length) {
        patch = patch.append(
          "copy",
          missing.map(([id, s]) => ({ _key: id, _type: "copySlot", label: s.label, text: s.text })),
        )
      }
      if (relabel.length) {
        patch = patch.set(Object.fromEntries(relabel.map(([id, s]) => [`copy[_key=="${id}"].label`, s.label])))
      }
      return patch
    })
  }

  if (!apply) {
    console.log("Dry run. Re-run with --apply to write.")
    return
  }
  const res = await tx.commit({ visibility: "sync" })
  console.log(`Committed ${res.transactionId}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

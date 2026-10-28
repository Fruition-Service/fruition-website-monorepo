/**
 * Seed copy slots into Sanity.
 *
 *   npx tsx scripts/seed-home-copy.ts                 # home page, dry run
 *   npx tsx scripts/seed-home-copy.ts --apply         # home page, writes
 *   npx tsx scripts/seed-home-copy.ts --site --apply  # shared copy on siteSettings
 *
 * Adds every slot in HOME_COPY (src/components/home/copy.ts), or with --site
 * SITE_COPY (src/lib/siteCopy.ts), that the target document doesn't have yet,
 * with today's default wording, and refreshes slot labels. Text that already exists in Sanity is never
 * overwritten, so edits made with the inline editor survive re-runs.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { createClient } from "@sanity/client"
import { HOME_COPY } from "../src/components/home/copy"
import { SITE_COPY } from "../src/lib/siteCopy"

loadEnv({ path: ".env.local" })

const site = process.argv.includes("--site")
const DOC_TYPE = site ? "siteSettings" : "homePage"
const COPY: Record<string, { label: string; text: string }> = site ? SITE_COPY : HOME_COPY
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

  // Both singletons are looked up by type: siteSettings' _id isn't fixed.
  const docs = await client.fetch<{ _id: string; copy?: { _key: string; label?: string }[] }[]>(
    `*[_type == $type && !(_id in path("versions.**"))]{ _id, copy[]{ _key, label } }`,
    { type: DOC_TYPE },
  )
  if (!docs.some((d) => !d._id.startsWith("drafts."))) throw new Error(`No published ${DOC_TYPE} document`)

  const slots = Object.entries(COPY)
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

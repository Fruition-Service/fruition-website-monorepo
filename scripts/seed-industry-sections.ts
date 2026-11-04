/**
 * Seed the long-form industry sections into the monday-for-* `industryPage`
 * documents.
 *
 *   npx tsx scripts/seed-industry-sections.ts           # dry run
 *   npx tsx scripts/seed-industry-sections.ts --apply   # writes
 *
 * Copies capabilityBlocks, benefitLedger and templateSpec from
 * src/data/industrySections.ts onto the seven monday-for-* industry pages
 * (and any open Studio draft of them), where UniversalPageTemplate merges
 * them over the code copy. Only fields that are not set yet are written: a
 * missing section is set whole, a section that already exists only gets its
 * missing top-level fields. Existing values are never overwritten, so edits
 * made in Studio or the inline editor survive re-runs. The /industries
 * leaves are not industryPage documents and are not touched.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { createClient } from "@sanity/client"
import { INDUSTRY_SECTIONS, type IndustrySections } from "../src/data/industrySections"

loadEnv({ path: ".env.local" })

const apply = process.argv.includes("--apply")
const SLUGS = Object.keys(INDUSTRY_SECTIONS).filter((slug) => slug.startsWith("monday-for-"))
const SECTIONS = ["capabilityBlocks", "benefitLedger", "templateSpec"] as const

/** Adds the `_key` / `_type` Sanity needs on every object inside an array. */
function withKeys(value: unknown, type: string, path = "item"): unknown {
  if (Array.isArray(value)) {
    return value.map((item, i) =>
      item && typeof item === "object" ? { _key: `${path}-${i}`, _type: type, ...(withKeys(item, type, `${path}-${i}`) as object) } : item,
    )
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, Array.isArray(v) ? withKeys(v, ARRAY_TYPES[k] ?? k, `${path}-${k}`) : v]),
    )
  }
  return value
}

/** Array member type names, as declared in src/sanity/schemas/industryPage.ts. */
const ARRAY_TYPES: Record<string, string> = {
  blocks: "industryCapabilityBlock",
  points: "industryPoint",
  items: "industryLedgerItem",
  panels: "industrySpecPanel",
  groups: "industrySpecGroup",
}

function toSanity(sections: IndustrySections): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {}
  for (const name of SECTIONS) {
    const section = sections[name]
    if (section) out[name] = withKeys(section, name, name) as Record<string, unknown>
  }
  return out
}

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    perspective: "raw",
  })

  const docs = await client.fetch<Record<string, unknown>[]>(
    `*[_type == "industryPage" && slug.current in $slugs]{ _id, "slug": slug.current, ${SECTIONS.join(", ")} }`,
    { slugs: SLUGS },
  )
  for (const slug of SLUGS) {
    if (!docs.some((d) => d.slug === slug && !(d._id as string).startsWith("drafts."))) {
      console.log(`WARNING: no published industryPage for ${slug}`)
    }
  }

  const tx = client.transaction()
  let writes = 0
  for (const doc of docs) {
    const fields = toSanity(INDUSTRY_SECTIONS[doc.slug as string])
    const set: Record<string, unknown> = {}
    for (const [name, section] of Object.entries(fields)) {
      const existing = doc[name] as Record<string, unknown> | null | undefined
      if (existing == null) {
        set[name] = section
        continue
      }
      for (const [k, v] of Object.entries(section)) {
        if (existing[k] === undefined || existing[k] === null) set[`${name}.${k}`] = v
      }
    }
    console.log(`${doc._id} (${doc.slug}): set ${Object.keys(set).join(", ") || "nothing"}`)
    if (Object.keys(set).length) {
      tx.patch(doc._id as string, (p) => p.set(set))
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

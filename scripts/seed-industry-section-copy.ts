/**
 * Fill the use case catalogue, testimonials and FAQ copy on the seven
 * monday-for-* `industryPage` documents so each string is a Sanity value the
 * inline editor can click.
 *
 *   npx tsx scripts/seed-industry-section-copy.ts           # dry run
 *   npx tsx scripts/seed-industry-section-copy.ts --apply   # writes
 *
 * Each page renders code copy for these blocks whenever the field is missing
 * or blank. This writes that same copy into each field that is missing or
 * blank (on the published document and any open Studio draft), so the page
 * reads exactly as before. A field with real text is never touched, and no
 * other field is written. A block is only seeded on the pages that render it:
 *
 *   - use case catalogue: every page except /monday-for-marketing, which has
 *     no catalogue block. The button label is seeded as "See all {count} use
 *     cases" so the number stays live.
 *   - testimonials: the pages that render TestimonialsGrid (government,
 *     manufacturing, retail through UniversalPageTemplate, and construction
 *     with its own heading). Real estate, professional services and marketing
 *     have no such block.
 *   - FAQ heading and contact line: all seven.
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN (from .env.local).
 */
import { config as loadEnv } from "dotenv"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { createClient } from "@sanity/client"
import { LANDING_PAGE_USE_CASES } from "../src/features/ai-use-cases/featured"
import {
  CONSTRUCTION_TESTIMONIALS_COPY,
  TESTIMONIALS_DEFAULTS,
  USE_CASE_CATALOGUE_DEFAULTS,
  defaultUseCaseCatalogueHeading,
} from "../src/features/content/industryPageCopy"
import { DEFAULT_CONTACT_LEAD } from "../src/components/sections/FaqAccordion"

loadEnv({ path: ".env.local" })

const apply = process.argv.includes("--apply")

const SLUGS = [
  "monday-for-construction",
  "monday-for-government",
  "monday-for-manufacturing",
  "monday-for-marketing",
  "monday-for-professional-services",
  "monday-for-real-estate",
  "monday-for-retail",
] as const
type Slug = (typeof SLUGS)[number]

/** UniversalPageTemplate's and FaqAccordion's FAQ heading. */
const FAQ_HEADING = "Frequently asked questions"

const TESTIMONIALS: Partial<Record<Slug, { heading: string; ctaLabel: string }>> = {
  "monday-for-construction": CONSTRUCTION_TESTIMONIALS_COPY,
  "monday-for-government": TESTIMONIALS_DEFAULTS,
  "monday-for-manufacturing": TESTIMONIALS_DEFAULTS,
  "monday-for-retail": TESTIMONIALS_DEFAULTS,
}

/** The catalogue block's words for a page, or null when the page renders none. */
function useCaseCopy(slug: Slug): Record<string, string> | null {
  const path = `/${slug}`
  if (!(path in LANDING_PAGE_USE_CASES)) return null
  const source = LANDING_PAGE_USE_CASES[path as keyof typeof LANDING_PAGE_USE_CASES]
  const file = join(process.cwd(), "public/data/ai-use-cases", `${source.industrySlug}.json`)
  const data = JSON.parse(readFileSync(file, "utf8")) as { name: string; useCases: unknown[] }
  if (!data.useCases.length) return null
  const heading = ("heading" in source ? source.heading : undefined) ?? defaultUseCaseCatalogueHeading(data.name)
  return {
    useCaseCatalogueEyebrow: USE_CASE_CATALOGUE_DEFAULTS.eyebrow,
    useCaseCatalogueHeading: heading,
    useCaseCatalogueLead: USE_CASE_CATALOGUE_DEFAULTS.lead,
    useCaseCatalogueCtaLabel: USE_CASE_CATALOGUE_DEFAULTS.ctaLabel,
    useCaseCatalogueBrowseLabel: USE_CASE_CATALOGUE_DEFAULTS.browseLabel,
  }
}

/** Every field this script may write on a page, with the words the page renders today. */
function renderedCopy(slug: Slug): Record<string, string> {
  const testimonials = TESTIMONIALS[slug]
  return {
    ...(useCaseCopy(slug) ?? {}),
    ...(testimonials
      ? {
          testimonialsEyebrow: TESTIMONIALS_DEFAULTS.eyebrow,
          testimonialsHeading: testimonials.heading,
          testimonialsIntro: TESTIMONIALS_DEFAULTS.intro,
          testimonialsCtaLabel: testimonials.ctaLabel,
        }
      : {}),
    faqHeading: FAQ_HEADING,
    faqContactLead: DEFAULT_CONTACT_LEAD,
  }
}

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

  const fieldNames = [...new Set(SLUGS.flatMap((s) => Object.keys(renderedCopy(s))))]
  const docs = await client.fetch<({ _id: string; slug: Slug } & Record<string, unknown>)[]>(
    `*[_type == "industryPage" && slug.current in $slugs] | order(_id asc){
      _id, "slug": slug.current, ${fieldNames.join(", ")}
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
    const copy = renderedCopy(doc.slug)
    const set = Object.fromEntries(Object.entries(copy).filter(([k]) => blank(doc[k])))
    const keep = Object.keys(copy).filter((k) => !blank(doc[k]))
    console.log(
      `${doc._id}: set ${Object.keys(set).length} (${Object.keys(set).join(", ") || "nothing"})` +
        (keep.length ? `; keeps ${keep.map((k) => `${k}=${JSON.stringify(doc[k])}`).join(", ")}` : ""),
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

/**
 * Seed the six `locationPage` documents with the region copy that the
 * redesigned template renders, and unset every pre-redesign field the
 * template stopped reading.
 *
 *   npx tsx scripts/seed-region-pages.ts            # dry run: prints the diff
 *   npx tsx scripts/seed-region-pages.ts --apply    # backs up, then writes
 *   npx tsx scripts/seed-region-pages.ts --restore scripts/region-backups/<file>.json
 *
 * DEPLOY ORDER: merge and deploy the schema change BEFORE running --apply.
 * The seeded values are byte-identical to what the pages already render (the
 * template falls back to the same `src/data/regionPages.ts` copy), so applying
 * this changes no pixel — it only makes the words editable in the Studio.
 *
 * The four generic monday.com questions that lived in each document's
 * `faqTabs` are folded onto the end of `faq.items`, preserving the order the
 * accordion renders today, and `faqTabs` is then unset. One FAQ list per page.
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'
import { REGION_PAGES, type RegionSlug } from '../src/data/regionPages'
import { toSanityRegionContent } from '../src/lib/mergeRegionContent'

const BACKUP_DIR = path.join(__dirname, 'region-backups')

/**
 * Pre-redesign fields the template no longer reads. Unset on every region
 * document so the Studio form matches what the page actually renders.
 */
const DEAD_FIELDS = [
  'heroHeading', 'heroSubheading', 'secondaryCtaLabel', 'secondaryCtaUrl', 'body',
  'comparisonHeading', 'comparisonSubheading', 'comparisonTabs',
  'methodologyHeading', 'methodologySteps',
  'calendlyHeading', 'calendlySubheading',
  'faqTabs', 'faqHeading',
  'featureBlocks', 'roiStats',
  'joinHeadingPart1', 'joinHeadingAccent', 'joinHeadingPart2',
  'joinSubheading', 'joinStats', 'joinFootnote',
  'industryHeading', 'industryTabs',
  'capabilitiesHeading', 'capabilitiesCards',
  'solutionCards',
  'caseStudySectionHeading', 'caseStudyCards',
  'bottomVideoUrl', 'bottomVideoTitle',
  'logoCloudHeadingPart1', 'logoCloudHeadingAccent',
  'teamGridHeading', 'teamGridSubheading', 'teamGridCtaLabel', 'teamGridCtaUrl',
  'testimonialsGridHeading', 'testimonialsGridCtaLabel',
  'testimonialsGridStatValue', 'testimonialsGridStatSubtitle',
  'testimonialsGridStatCtaLabel', 'testimonialsGridStatCtaUrl',
  'teamMemberNames',
  'croSections',
]

interface ExistingFaqPair { question?: string; answer?: string }
interface ExistingFaqTab { items?: ExistingFaqPair[] }

/**
 * The region's own questions, then anything the document curated in `faqTabs`
 * that isn't already covered. Same order, same dedupe rule (by question) the
 * accordion applies today, so the rendered list does not move.
 */
function faqItems(slug: RegionSlug, existingTabs: ExistingFaqTab[] | undefined) {
  const items = REGION_PAGES[slug].faq.items.map((i) => ({ ...i }))
  const seen = new Set(items.map((i) => i.question.trim().toLowerCase()))
  for (const tab of existingTabs ?? []) {
    for (const pair of tab.items ?? []) {
      const q = pair.question?.trim()
      if (!q || !pair.answer?.trim() || seen.has(q.toLowerCase())) continue
      seen.add(q.toLowerCase())
      items.push({ question: q, answer: pair.answer })
    }
  }
  return items
}

function buildPatch(slug: RegionSlug, doc: Record<string, unknown>) {
  const merged = {
    ...REGION_PAGES[slug],
    faq: {
      ...REGION_PAGES[slug].faq,
      items: faqItems(slug, doc.faqTabs as ExistingFaqTab[] | undefined),
    },
  }
  return toSanityRegionContent(merged)
}

async function main() {
  const apply = process.argv.includes('--apply')
  const restoreIdx = process.argv.indexOf('--restore')

  if (restoreIdx !== -1) {
    const file = process.argv[restoreIdx + 1]
    const docs = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<Record<string, unknown>>
    for (const doc of docs) await writeClient.createOrReplace(doc as never)
    console.log(`↩️  restored ${docs.length} documents from ${file}`)
    return
  }

  const slugs = Object.keys(REGION_PAGES) as RegionSlug[]
  const docs: Array<Record<string, unknown>> = await writeClient.fetch(
    `*[_type == "locationPage" && slug.current in $slugs]`,
    { slugs },
  )
  const bySlug = new Map(
    docs.map((d) => [(d.slug as { current: string })?.current, d]),
  )

  const missing = slugs.filter((s) => !bySlug.has(s))
  if (missing.length) throw new Error(`No locationPage document for: ${missing.join(', ')}`)

  if (apply) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    const file = path.join(BACKUP_DIR, `locationPages-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    fs.writeFileSync(file, JSON.stringify(docs, null, 2))
    console.log(`💾 backup → ${file}\n`)
  }

  for (const slug of slugs) {
    const doc = bySlug.get(slug)!
    const set = buildPatch(slug, doc)
    const unset = DEAD_FIELDS.filter((f) => doc[f] !== undefined)

    console.log(`── ${slug}`)
    console.log(`   set:   ${Object.keys(set).join(', ')}`)
    console.log(`   unset: ${unset.length ? unset.join(', ') : '(none)'}`)
    console.log(`   faq:   ${set.faq?.items?.length ?? 0} questions`)

    if (apply) {
      let patch = writeClient.patch(doc._id as string).set(set)
      if (unset.length) patch = patch.unset(unset)
      await patch.commit()
      console.log('   ✅ written')
    }
  }

  console.log(apply ? '\n✅ done' : '\nDry run — re-run with --apply to write.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

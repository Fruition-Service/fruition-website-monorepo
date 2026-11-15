/**
 * /monday-for-government: take Tourism Australia out of "Government case studies." (monday item
 * 2908075208, Josh Jebathilak, 15 Nov 2026).
 *
 * Why: Tourism Australia was only ever a presales prospect; Fruition never transacted with them, so
 * they cannot be shown as a client build. Josh asked to keep one case study (Tourism NT) and use the
 * right-hand slot to point visitors to the government use cases in the hub, or to show government
 * logos. The new `hub` link card on vcCases does both: real government client logos from this page's
 * own logo strip on the panel, and a link to /ai-use-cases?industry=government#catalogue.
 * Designed in Claude Design first (Fruition project, file "Government case studies").
 *
 *   npx tsx scripts/vc/gov-remove-tourism-australia-2026-11.ts            # dry run
 *   npx tsx scripts/vc/gov-remove-tourism-australia-2026-11.ts --apply    # backup, then write
 *   npx tsx scripts/vc/gov-remove-tourism-australia-2026-11.ts --restore <backup.json>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local', quiet: true })
const APPLY = process.argv.includes('--apply')
const restoreIdx = process.argv.indexOf('--restore')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const PAGE = 'vcPage-monday-for-government'
const REMOVE = 'vcCase-tourism-australia'
/** Logos for the hub panel, by alt text, taken from this page's own "Agencies and councils" strip. */
const HUB_LOGOS = [
  'Government of Western Australia Department of Finance',
  'Queensland Government, Queensland Health',
  'NSW Government EnergyCo',
  'CSIRO',
  'VicHealth',
  'Albury City Council',
]

type Logo = { _key: string; _type: 'vcLogo'; alt?: string; image?: unknown }
type Section = { _key: string; _type: string; cases?: { _key: string; _ref: string }[]; logos?: Logo[]; head?: { lead?: string }; hub?: unknown }
type Page = { _id: string; _rev: string; sections: Section[] }

async function restore(file: string) {
  const doc = JSON.parse(readFileSync(file, 'utf8')) as Page
  await client.patch(PAGE).set({ sections: doc.sections }).commit()
  console.log(`restored ${PAGE} sections from ${file}`)
}

async function main() {
  if (restoreIdx > 0) return restore(process.argv[restoreIdx + 1])

  const page = await client.fetch<Page | null>(`*[_id == $id][0]`, { id: PAGE })
  if (!page) throw new Error(`${PAGE} not found`)
  const drafts = await client.fetch<number>(`count(*[_id == $id])`, { id: `drafts.${PAGE}` })
  if (drafts) throw new Error(`${PAGE} has an unpublished draft; publish or discard it first`)

  const cases = page.sections.filter((s) => s._type === 'vcCases')
  const strip = page.sections.find((s) => s._type === 'vcLogos')
  if (cases.length !== 1 || !strip?.logos) throw new Error(`expected one vcCases and a vcLogos strip`)
  const sec = cases[0]

  const logos = HUB_LOGOS.map((alt, i) => {
    const l = strip.logos!.find((x) => x.alt === alt)
    if (!l) throw new Error(`logo "${alt}" not in the page's logo strip`)
    return { _key: `hub${i}${l._key.slice(0, 6)}`, _type: 'vcLogo' as const, alt: l.alt, image: l.image }
  })

  const nextCases = (sec.cases ?? []).filter((c) => c._ref !== REMOVE)
  const hub = {
    label: 'Use case hub · Government',
    title: 'More government builds',
    body: 'Case management, compliance, grants and approvals: see the process, boards and automations behind each build, with client names withheld.',
    linkLabel: 'Explore government use cases',
    href: '/ai-use-cases?industry=government#catalogue',
    logos,
  }
  const lead = 'One client build, and where to find more.'

  console.log(`cases: ${(sec.cases ?? []).map((c) => c._ref).join(', ')}  ->  ${nextCases.map((c) => c._ref).join(', ')}`)
  console.log(`lead: "${sec.head?.lead}"  ->  "${lead}"`)
  console.log(`hub: ${hub.title} -> ${hub.href} with ${logos.length} logos`)
  if (!APPLY) return console.log('dry run, pass --apply to write')

  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/gov-remove-tourism-australia-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify(page, null, 2))
  console.log(`backup: ${file}`)

  await client
    .patch(PAGE)
    .ifRevisionId(page._rev)
    .set({
      [`sections[_key=="${sec._key}"].cases`]: nextCases,
      [`sections[_key=="${sec._key}"].head.lead`]: lead,
      [`sections[_key=="${sec._key}"].hub`]: hub,
    })
    .commit()
  console.log(`patched ${PAGE}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

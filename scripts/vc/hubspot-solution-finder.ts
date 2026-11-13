/**
 * /hubspot-consulting: add the HubSpot solution finder directly under the hero.
 *
 * Ported from the chat-style solution finder on the oglabs.io home page
 * (oglabs-website-monorepo nextjs/src/components/home/finder), HubSpot builds
 * only: the 26 builds in scripts/vc/data/oglabs-hubspot-builds.json are a
 * snapshot of that component's solutions.json filtered to platform HubSpot.
 * Copy is kept verbatim; only the field names change to the vcSolutionFinder
 * schema. Edward asked for it on 13 Nov 2026 as a page-specific section.
 *
 * The section is PAGE-SPECIFIC: key pagespecific-hubspot-solution-finder,
 * pageSpecific: true and a pageSpecificNote, registered in
 * src/data/vcPageSpecificSections.ts.
 *
 *   npx tsx scripts/vc/hubspot-solution-finder.ts           # dry run
 *   npx tsx scripts/vc/hubspot-solution-finder.ts --apply   # write (insert or replace in place)
 *   npx tsx scripts/vc/hubspot-solution-finder.ts --remove  # take it off the page again
 */
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local', quiet: true })
const APPLY = process.argv.includes('--apply')
const REMOVE = process.argv.includes('--remove')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
const k = () => randomBytes(6).toString('hex')

const PAGE_PATH = '/hubspot-consulting'
const KEY = 'pagespecific-hubspot-solution-finder'

interface Raw {
  id: string; ind: string; uc: string; n: string; d: string; sc: string; u: string; st: string
  o: string[]; b: { l: string; s: string; h: string }[]; hub: string; per: { l: string; t: string }[]
  ph: string[]; k: string[]; intg: string[]
}
const raw: Raw[] = JSON.parse(readFileSync(new URL('./data/oglabs-hubspot-builds.json', import.meta.url), 'utf8'))

const builds = raw.map((r) => ({
  _key: r.id.toLowerCase(),
  _type: 'vcFinderBuild',
  buildId: r.id,
  industry: r.ind,
  name: r.n,
  useCase: r.uc,
  description: r.d,
  hubs: r.hub,
  scope: r.sc,
  users: r.u,
  strength: r.st,
  outcomes: r.o,
  steps: r.b.map((b) => ({ _key: k(), _type: 'vcFinderStep', label: b.l, summary: b.s, how: b.h })),
  roles: r.per.map((p) => ({ _key: k(), _type: 'vcFinderRole', label: p.l, text: p.t })),
  phases: r.ph,
  kpis: r.k,
  integrations: r.intg,
}))

const section = {
  _key: KEY,
  _type: 'vcSolutionFinder',
  tone: 'plain',
  anchor: 'solution-finder',
  pageSpecific: true,
  pageSpecificNote:
    'Added 13 Nov 2026 at Edward’s request: the oglabs.io home page solution finder, HubSpot builds only (26), seeded by scripts/vc/hubspot-solution-finder.ts. Not part of the partner template.',
  head: {
    badge: 'Solution finder',
    heading: 'Find the HubSpot build *for your industry.*',
    lead: 'Answer one question and see the builds we deliver for teams like yours, with the hubs, steps, KPIs and integrations behind each one.',
  },
  howTo: [
    'Pick your industry.',
    'See the HubSpot builds we deliver for it.',
    'Open one for the hubs, steps and KPIs behind it.',
  ],
  platform: 'HubSpot',
  label: 'Solution finder',
  greeting: 'Hi! Let’s find the right HubSpot build for your business. Which industry are you in?',
  allLabel: 'Show me everything',
  changePrompt: 'No problem. Which industry should we look at?',
  scopePrompt: 'Want a build scoped for your business?',
  scopeLabel: 'Get it scoped',
  scopeHref: '/contact-us#book',
  builds,
}

async function main() {
  const page = await client.fetch<{ _id: string; _rev: string; sections: { _key: string; _type: string }[] } | null>(
    `*[_type == "vcPage" && path == $p && !(_id in path("drafts.**"))][0]{ _id, _rev, sections[]{ _key, _type } }`,
    { p: PAGE_PATH },
  )
  if (!page) throw new Error(`no vcPage at ${PAGE_PATH}`)
  const existing = page.sections.findIndex((s) => s._key === KEY)
  const heroIdx = page.sections.findIndex((s) => s._type === 'vcHero')
  if (heroIdx !== 0) throw new Error(`expected the hero first, found ${page.sections[0]?._type}`)

  if (REMOVE) {
    if (existing < 0) return console.log('not on the page, nothing to remove')
    console.log(`removing ${KEY} from ${page._id}`)
    await client.patch(page._id).ifRevisionId(page._rev).unset([`sections[_key=="${KEY}"]`]).commit()
    return
  }

  console.log(`${page._id}: ${existing >= 0 ? 'replace' : 'insert after hero'} ${KEY} with ${builds.length} builds`)
  console.log(`  industries: ${[...new Set(builds.map((b) => b.industry))].join(', ')}`)
  if (!APPLY) return console.log('dry run; pass --apply to write')

  const patch = client.patch(page._id).ifRevisionId(page._rev)
  if (existing >= 0) patch.insert('replace', `sections[_key=="${KEY}"]`, [section])
  else patch.insert('after', 'sections[0]', [section])
  const res = await patch.commit()
  console.log(`written, rev ${res._rev}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

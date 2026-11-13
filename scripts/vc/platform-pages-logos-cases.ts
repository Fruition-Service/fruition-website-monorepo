/**
 * Platform pages (Atlassian, HubSpot and the /partnerships/* partner pages):
 *
 * 1. Drop the hero statistics strip and show the client logo carousel in the
 *    hero instead: the same "Trusted by teams across 900+ implementations"
 *    marquee as the AI pages (hero `trustLabel` + `trustLogos`, copied from
 *    vcPage-ai-consulting). The first version of this script misread the
 *    request and added a static "Platforms" partner-badge grid under the hero;
 *    re-running it removes that grid (fixed 2026-11-13).
 * 2. Give every page that showed a single case study a second one:
 *    Long-Term Care Consultants (SNF Clinic) on /atlassian-consulting and
 *    Rod Schubert Financial Advice on /partnerships/aircall-partner. Both are
 *    signed work orders on the Work Order Fruition board (1919805112, items
 *    2712125749 and 2015851024 / 2031391047), listed in
 *    vc-mockups/platform-cases.json but skipped by the mock-up build because
 *    they had no logo or about line yet.
 *    Pacific Community joined APCO on /partnerships/certified-clickup-partner
 *    on 2026-11-12 (Edward's call; its work order is marked Void).
 *
 *   npx tsx scripts/vc/platform-pages-logos-cases.ts           # dry run
 *   npx tsx scripts/vc/platform-pages-logos-cases.ts --apply   # write
 *
 * Re-runnable: heroes that already carry the carousel, and case lists that
 * already reference the new case, are left alone.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local', quiet: true })
const APPLY = process.argv.includes('--apply')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
const key = () => randomBytes(6).toString('hex')
const img = (ref: string) => ({ _type: 'image', asset: { _type: 'reference', _ref: ref } })

const PAGES = [
  '/atlassian-consulting',
  '/hubspot-consulting',
  '/partnerships/aircall-partner',
  '/partnerships/anthropic-claude-partner',
  '/partnerships/certified-clickup-partner',
  '/partnerships/google-gemini-vertex-ai-partner',
  '/partnerships/make-partners',
  '/partnerships/monday-consulting-partner',
  '/partnerships/n8n-integration-partner',
  '/partnerships/openai-chatgpt-partner',
  '/partnerships/openclaw-partner',
  '/partnerships/vapi-partner',
]

/** The AI pages' hero carousel is the source; every platform hero gets the same label and logos. */
const CAROUSEL_SOURCE = 'vcPage-ai-consulting'
/** Heading of the badge grid the first run added by mistake; sections with it are removed. */
const OLD_GRID_HEADING = 'Certified on *every platform we implement.*'

const ASSETS = join(__dirname, 'assets', 'platform-cases')
const NEW_CASES = [
  {
    page: '/atlassian-consulting',
    doc: {
      _id: 'vcCase-long-term-care-consultants',
      _type: 'vcCase',
      client: 'Long-Term Care Consultants',
      label: 'Client project · United States',
      body: 'The team behind SNF Clinic, training and compliance resources for nurses and caregivers in skilled nursing.',
      results: [],
      tags: [],
    },
    logo: { file: 'ltcc-logo.png', alt: 'SNF Clinic logo' },
    photo: 'ltcc.jpg',
  },
  {
    page: '/partnerships/aircall-partner',
    doc: {
      _id: 'vcCase-rod-schubert-financial-advice',
      _type: 'vcCase',
      client: 'Rod Schubert Financial Advice',
      label: 'Client project · New Zealand',
      body: 'A New Zealand financial advice firm for mortgages, insurance and KiwiSaver, now trading as Real Savvy Financial Advice.',
      results: [],
      tags: [],
    },
    logo: { file: 'rsfa-logo.png', alt: 'Rod Schubert Financial Advice logo' },
    photo: 'rsfa.jpg',
  },
  {
    // Added 2026-11-12 at Edward's request. Work Order item 2747782095
    // (ClickUp, EQAP finance team, Suva) is marked Void on the board.
    page: '/partnerships/certified-clickup-partner',
    doc: {
      _id: 'vcCase-pacific-community',
      _type: 'vcCase',
      client: 'Pacific Community',
      label: 'Client project · Fiji',
      body: 'The principal scientific and technical organisation for the Pacific region, owned by its 27 member countries and territories.',
      results: [],
      tags: [],
    },
    logo: { file: 'spc-logo.png', alt: 'Pacific Community logo' },
    photo: 'spc.jpg',
  },
]

type Logo = { _key?: string; [k: string]: unknown }
type Section = { _key: string; _type: string; stats?: unknown[]; statsNote?: string; trustLabel?: string; trustLogos?: Logo[]; head?: { heading?: string }; cases?: { _ref: string }[] }

async function upload(file: string) {
  if (!APPLY) return `image-DRYRUN-${file}`
  const a = await client.assets.upload('image', readFileSync(join(ASSETS, file)), { filename: file })
  return a._id
}

async function main() {
  const tx = client.transaction()
  const source = await client.fetch<{ trustLabel?: string; trustLogos?: Logo[] } | null>(
    `*[_id == $id][0].sections[_type == "vcHero"][0]{ trustLabel, trustLogos }`,
    { id: CAROUSEL_SOURCE },
  )
  if (!source?.trustLabel || !source.trustLogos?.length) throw new Error(`no hero carousel on ${CAROUSEL_SOURCE}`)

  for (const c of NEW_CASES) {
    const existing = await client.fetch(`*[_id==$id][0]._id`, { id: c.doc._id })
    if (!existing) {
      const logoRef = await upload(c.logo.file)
      const photoRef = await upload(c.photo)
      tx.createIfNotExists({ ...c.doc, logo: { ...img(logoRef), alt: c.logo.alt }, photo: img(photoRef) })
      console.log(`create ${c.doc._id}`)
    }
  }

  for (const path of PAGES) {
    const page = await client.fetch<{ _id: string; sections: Section[] } | null>(
      `*[_type=="vcPage" && path==$path && !(_id in path("drafts.**"))][0]{_id, sections}`,
      { path },
    )
    if (!page) throw new Error(`no vcPage for ${path}`)
    const hero = page.sections.find((s) => s._type === 'vcHero')
    if (!hero) throw new Error(`no hero on ${path}`)
    const p = client.patch(page._id)
    let changed = false

    if (hero.stats?.length || hero.statsNote) {
      p.unset([`sections[_key=="${hero._key}"].stats`, `sections[_key=="${hero._key}"].statsNote`])
      console.log(`${path}: drop ${hero.stats?.length ?? 0} hero stats`)
      changed = true
    }
    if (!hero.trustLogos?.length) {
      p.set({
        [`sections[_key=="${hero._key}"].trustLabel`]: source.trustLabel,
        [`sections[_key=="${hero._key}"].trustLogos`]: source.trustLogos.map((l) => ({ ...l, _key: key() })),
      })
      console.log(`${path}: add the client logo carousel to the hero (${source.trustLogos.length} logos)`)
      changed = true
    }
    for (const grid of page.sections.filter((s) => s._type === 'vcLogos' && s.head?.heading === OLD_GRID_HEADING)) {
      p.unset([`sections[_key=="${grid._key}"]`])
      console.log(`${path}: remove the platform badge grid added by mistake`)
      changed = true
    }
    const add = NEW_CASES.find((c) => c.page === path)
    const cases = page.sections.find((s) => s._type === 'vcCases')
    if (add && cases && !cases.cases?.some((r) => r._ref === add.doc._id)) {
      // Its own patch: a patch holds one insert op, so append() here would
      // replace the logo-row insert above.
      tx.patch(
        client
          .patch(page._id)
          .append(`sections[_key=="${cases._key}"].cases`, [{ _type: 'reference', _key: key(), _ref: add.doc._id }]),
      )
      console.log(`${path}: add case ${add.doc.client} (now ${(cases.cases?.length ?? 0) + 1})`)
    }
    if (changed) tx.patch(p)
  }

  if (!APPLY) {
    console.log('\nDry run. Pass --apply to write.')
    return
  }
  const res = await tx.commit()
  console.log(`\ncommitted transaction ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

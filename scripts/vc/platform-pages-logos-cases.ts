/**
 * Platform pages (Atlassian, HubSpot and the /partnerships/* partner pages):
 *
 * 1. Drop the hero statistics strip and put the partner logo row (the
 *    "Platforms" vcLogos section used on /ai-readiness-blueprint) straight
 *    under the hero instead.
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
 * Re-runnable: pages that already have the logo row, and case lists that
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

/** Partner badges already in the dataset (blueprint row plus each partner page's own badge). */
const LOGOS: { alt: string; ref: string; shape?: string }[] = [
  { alt: 'monday.com Platinum Partner', ref: 'image-f8884b26b1df478c718a6625ee989370c5afcfa2-400x136-png' },
  { alt: 'Atlassian Platinum Solution Partner', ref: 'image-bbd8251a00797677ebd5bbca9c59326cd10a150d-291x97-png' },
  { alt: 'HubSpot Solutions Partner', ref: 'image-6a5a255ad471dafb78258b25c86021470cd48dbc-124x124-png', shape: 'sq' },
  { alt: 'ClickUp Registered Partner', ref: 'image-7ec9df4adbbf17eb381c68a45ecbe01d6fd3a4e7-123x123-png', shape: 'sq' },
  { alt: 'Aircall Partner', ref: 'image-ea4be7caa487639e94ca1f8bc9fd1924630325ef-480x349-png', shape: 'sq' },
  { alt: 'Anthropic Claude Partner Network', ref: 'image-22427abb08ced2db62ca61fbf41998f7371cd8ed-253x80-png' },
  { alt: 'OpenAI Select Partner', ref: 'image-d3cca438d824022b892882bd550422cc70a37c40-469x221-png' },
  { alt: 'Google Cloud Partner', ref: 'image-2e1d55d3156180112209e070a7e9dcbdb85bf74a-200x90-png' },
  { alt: 'n8n Certified Expert Partner', ref: 'image-f69be9721952f5e05ffcf234d223cfdb414e5360-600x600-png', shape: 'sq' },
  { alt: 'Make Partner', ref: 'image-b87b9dfb0343383eefa24d60300caa988b9bdec5-512x131-png' },
]

function logosSection() {
  return {
    _type: 'vcLogos',
    _key: key(),
    tone: 'alt',
    gridClass: 'ten',
    head: {
      _type: 'vcHead',
      badge: 'Platforms',
      heading: 'Certified on *every platform we implement.*',
      lead: 'Partner status across the work management, CRM, automation and AI platforms your teams already use.',
    },
    logos: LOGOS.map((l) => ({ _key: key(), _type: 'vcLogo', alt: l.alt, ...(l.shape ? { shape: l.shape } : {}), image: img(l.ref) })),
  }
}

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

type Section = { _key: string; _type: string; stats?: unknown[]; statsNote?: string; cases?: { _ref: string }[] }

async function upload(file: string) {
  if (!APPLY) return `image-DRYRUN-${file}`
  const a = await client.assets.upload('image', readFileSync(join(ASSETS, file)), { filename: file })
  return a._id
}

async function main() {
  const tx = client.transaction()

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
    if (!page.sections.some((s) => s._type === 'vcLogos')) {
      p.insert('after', `sections[_key=="${hero._key}"]`, [logosSection()])
      console.log(`${path}: add platform logo row under the hero`)
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

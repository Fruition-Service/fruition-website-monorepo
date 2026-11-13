/**
 * Vadim's follow-up on monday 2900266080 ("Build the new consolidated HubSpot page"), 13 Nov 2026.
 *
 *   1. FAQ on /hubspot-consulting split into tabs: Implementation, Migration, Integration, Breeze AI.
 *   3. The four old leaf URLs redirect to #implementation, #breeze-ai, #integration and #migration
 *      (next.config.ts), but Version C dropped those ids. They now sit on the four "Our HubSpot
 *      services" cards (vcItem.anchor). The nav and /pricing link to the same anchors.
 *   5. "Delivered locally across six regions.": a page-specific vcOffices section before the
 *      booking band (key pagespecific-hubspot-offices), and every office in Site Settings links to
 *      its Google Business Profile listing (cid links for the listings Vadim gave).
 *   2. Links to the retired /partnerships/certified-hubspot-partner on live Version C pages point at
 *      /hubspot-consulting (the URL itself 301s, see next.config.ts).
 *
 *   npx tsx scripts/vc/hubspot-vadim-2900266080.ts            # dry run
 *   npx tsx scripts/vc/hubspot-vadim-2900266080.ts --apply    # backup, then write
 *   (add --skip-offices to hold the offices section back until its CSS is deployed)
 *   npx tsx scripts/vc/hubspot-vadim-2900266080.ts --restore <backup.json>
 */
import { randomBytes } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local', quiet: true })
const APPLY = process.argv.includes('--apply')
/** Write everything except the offices section (its CSS ships with the code). */
const SKIP_OFFICES = process.argv.includes('--skip-offices')
const restoreIdx = process.argv.indexOf('--restore')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
const k = () => randomBytes(6).toString('hex')

const PAGE = 'vcPage-hubspot-consulting'
const SERVICES_KEY = '846f6b70ae85'
const FAQ_KEY = '503204a80bcf'
const OFFICES_KEY = 'pagespecific-hubspot-offices'
const LINK_DOCS = ['vcPage-partnerships', 'vcPage-certifications-and-awards']
const OLD = '/partnerships/certified-hubspot-partner'
const NEW = '/hubspot-consulting'

/** Card title -> anchor, matching the redirect targets in next.config.ts. */
const CARD_ANCHORS: Record<string, string> = {
  'HubSpot implementation': 'implementation',
  'Breeze AI enablement': 'breeze-ai',
  'monday ↔ HubSpot integration': 'integration',
  'HubSpot → monday migration': 'migration',
}

const ref = (id: string) => ({ _key: k(), _type: 'reference', _ref: id })
const tab = (label: string, ids: string[]) => ({ _key: k(), _type: 'vcFaqTab', label, items: ids.map(ref) })
const M = 'faqItem-migrated-hubspot-consulting'
const TABS = [
  tab('Implementation', [
    `${M}-0`, // What does a HubSpot consulting partner do?
    `${M}-implementation-0`, // How long does a HubSpot implementation take?
    `${M}-3`, // How much does HubSpot consulting cost with Fruition?
    'faqItem-vc-hubspot-onboarding-fee',
    'faqItem-vc-hubspot-tiers',
    `${M}-implementation-1`, // We already have HubSpot but it's a mess
    `${M}-4`, // Which regions does Fruition deliver HubSpot services in?
  ]),
  tab('Migration', [
    'faqItem-vc-hubspot-migrate-to', // to HubSpot from Salesforce or another CRM
    `${M}-hubspot-to-monday-migration-0`,
    `${M}-hubspot-to-monday-migration-1`,
    `${M}-hubspot-to-monday-migration-2`,
  ]),
  tab('Integration', [
    `${M}-2`, // Can Fruition connect HubSpot to monday.com?
    `${M}-monday-hubspot-integration-0`,
    `${M}-monday-hubspot-integration-1`,
    `${M}-1`, // HubSpot or monday CRM for our sales team?
  ]),
  tab('Breeze AI', [
    `${M}-breeze-ai-0`,
    `${M}-breeze-ai-1`,
    `${M}-breeze-ai-2`,
    `${M}-breeze-ai-4`,
  ]),
]

const OFFICES = {
  _key: OFFICES_KEY,
  _type: 'vcOffices',
  tone: 'alt',
  anchor: 'locations',
  pageSpecific: true,
  pageSpecificNote:
    'Added 13 Nov 2026 for Vadim (monday 2900266080): "Delivered locally across six regions" with the six office cards from Site Settings, each linked to its Google Business Profile. Not part of the partner template.',
  head: {
    _type: 'vcHead',
    badge: 'HubSpot consulting',
    heading: 'Delivered locally across *six regions.*',
    lead: 'HubSpot consultants in Australia, the US, the UK, Singapore, India and the Philippines, working in your timezone.',
  },
}

/** Google Business Profile listings (Vadim's links), as cid URLs. Keyed by the office city prefix. */
const GBP: Record<string, string> = {
  Sydney: 'https://maps.google.com/?cid=9446191563858555132',
  'New York': 'https://maps.google.com/?cid=12106880826435152823',
  London: 'https://maps.google.com/?cid=10959644037773551899',
  Singapore: 'https://maps.google.com/?cid=17251294583334625938',
  'New Delhi': 'https://maps.google.com/?cid=12495776467071715702',
  Manila: 'https://maps.google.com/?cid=14161425124531920130',
}

type Doc = { _id: string; _rev: string; [k: string]: unknown }
type Section = { _key: string; _type: string; items?: { _key: string; title?: string; anchor?: string }[] }

function replaceDeep(v: unknown): unknown {
  if (typeof v === 'string') return v === OLD || v.startsWith(OLD + '#') ? NEW + v.slice(OLD.length) : v
  if (Array.isArray(v)) return v.map(replaceDeep)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([a, b]) => [a, replaceDeep(b)]))
  return v
}

async function restore(file: string) {
  const docs: Doc[] = JSON.parse(readFileSync(file, 'utf8'))
  const tx = client.transaction()
  for (const d of docs) {
    const { _rev, _createdAt, _updatedAt, ...rest } = d as Doc & { _createdAt?: string; _updatedAt?: string }
    void _rev; void _createdAt; void _updatedAt
    tx.createOrReplace(rest as Doc)
  }
  await tx.commit()
  console.log(`restored ${docs.length} documents from ${file}`)
}

async function main() {
  if (restoreIdx > 0) return restore(process.argv[restoreIdx + 1])
  const ids = [PAGE, 'siteSettings', ...LINK_DOCS]
  const docs = await client.fetch<Doc[]>('*[_id in $ids]', { ids })
  const by = Object.fromEntries(docs.map((d) => [d._id, d]))
  const page = by[PAGE] as Doc & { sections: Section[] }

  // 3. card anchors
  const services = page.sections.find((s) => s._key === SERVICES_KEY)
  if (!services?.items) throw new Error('services cards not found')
  const anchorSets = services.items.flatMap((it) => {
    const a = CARD_ANCHORS[it.title ?? '']
    return a ? [[`sections[_key=="${SERVICES_KEY}"].items[_key=="${it._key}"].anchor`, a] as const] : []
  })
  if (anchorSets.length !== 4) throw new Error(`expected 4 service cards, matched ${anchorSets.length}`)

  // 1. FAQ tabs: every referenced item must exist
  const want = TABS.flatMap((t) => t.items.map((i) => i._ref))
  const found = await client.fetch<string[]>('*[_id in $want]._id', { want })
  const missing = want.filter((id) => !found.includes(id))
  if (missing.length) throw new Error(`missing faqItems: ${missing.join(', ')}`)

  // 5. offices section position: before the booking band
  const hasOffices = page.sections.some((s) => s._key === OFFICES_KEY)
  const booking = page.sections.find((s) => s._type === 'vcBooking')
  if (!booking) throw new Error('booking section not found')

  const settings = by.siteSettings as Doc & { offices: { _key: string; city?: string; addressUrl?: string }[] }
  const officeSets = settings.offices.flatMap((o) => {
    const city = Object.keys(GBP).find((c) => (o.city ?? '').startsWith(c))
    return city ? [[`offices[_key=="${o._key}"].addressUrl`, GBP[city]] as const] : []
  })
  if (officeSets.length !== 6) throw new Error(`expected 6 offices, matched ${officeSets.length}`)

  const linkDocs = LINK_DOCS.map((id) => by[id]).filter(Boolean)
  const linkChanges = linkDocs.filter((d) => JSON.stringify(d).includes(OLD))

  console.log('card anchors:', anchorSets.map(([, a]) => a).join(', '))
  console.log('faq tabs:', TABS.map((t) => `${t.label} (${t.items.length})`).join(', '))
  console.log('offices section:', hasOffices ? 'already there' : `insert before ${booking._key}`)
  console.log('office links:', officeSets.length)
  console.log('docs linking the old partner page:', linkChanges.map((d) => d._id).join(', ') || 'none')
  if (!APPLY) return console.log('dry run; pass --apply to write')

  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/hubspot-vadim-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify(docs, null, 1))
  console.log('backup', file)

  const tx = client.transaction()
  const p = client.patch(PAGE).ifRevisionId(page._rev)
  for (const [path, v] of anchorSets) p.set({ [path]: v })
  p.set({ [`sections[_key=="${FAQ_KEY}"].tabs`]: TABS })
  tx.patch(p)
  if (!hasOffices && !SKIP_OFFICES) tx.patch(client.patch(PAGE).insert('before', `sections[_key=="${booking._key}"]`, [OFFICES]))
  const sp = client.patch('siteSettings').ifRevisionId(settings._rev)
  for (const [path, v] of officeSets) sp.set({ [path]: v })
  tx.patch(sp)
  for (const d of linkChanges) {
    const { _id, _rev, _type, _createdAt, _updatedAt, ...rest } = d as Doc & { _type: string; _createdAt?: string; _updatedAt?: string }
    void _type; void _createdAt; void _updatedAt
    tx.patch(client.patch(_id).ifRevisionId(_rev).set(replaceDeep(rest) as Record<string, unknown>))
  }
  const res = await tx.commit()
  console.log('written', res.transactionId)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

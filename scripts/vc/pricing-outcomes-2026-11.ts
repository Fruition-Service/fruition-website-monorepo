/**
 * /implementation-packages (vcPage-pricing), Edward 13 Nov 2026.
 *
 *   1. AI consulting and agents now starts from A$5,000 (overview card, hero "pricing at a
 *      glance" art and its aria text, the facts row, the AI tab's "Starting from").
 *   2. Section order: monday.com packages first (with the "Not sure which package fits?" band
 *      under them), then "Starting prices for everything else we build", then "Fruition pricing
 *      by service", then licences.
 *   3. The AI & agents tab becomes six outcome-based packages, one per outcome in the AI use
 *      case catalogue (Grow revenue ... Quality and experience), all under A$10,000.
 *      The figures are Claude's proposal from Edward's "all sub 10k" brief; change them here
 *      or in Studio.
 *
 *   npx tsx scripts/vc/pricing-outcomes-2026-11.ts            # dry run
 *   npx tsx scripts/vc/pricing-outcomes-2026-11.ts --apply    # backup, then write
 *   npx tsx scripts/vc/pricing-outcomes-2026-11.ts --restore <backup.json>
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

const PAGE = 'vcPage-pricing'
const KEYS = {
  hero: 'c1a2670992a7',
  byService: 'a57e6b79a6af',
  audit: '87b08665c40b',
  packages: '073c71278d1c',
  services: '1d553fa81ad3',
  licences: '482ffd30ca91',
  facts: 'e6998312b741',
}
const AI_TAB = '83d21b20a316'
const AI_CARD = 'f022355b8a78'
const OLD_FROM = 'A$18,000'
const NEW_FROM = 'A$5,000'

/** One package per outcome, in the catalogue's order. Keys are stable so re-runs are idempotent. */
const AI_ROWS = [
  { _key: 'outcome-revenue', name: 'Grow revenue: AI sales and outbound agent', href: '/ai-consulting/sales-outbound', price: 'A$7,500' },
  { _key: 'outcome-cost', name: 'Cut cost and speed up cash: back-office automation', href: '/ai-consulting/operations-back-office', price: 'A$6,500' },
  { _key: 'outcome-risk', name: 'Reduce risk: AI governance and compliance', href: '/ai-consulting/governance-and-compliance', price: 'A$5,000' },
  { _key: 'outcome-speed', name: 'Move faster: one workflow handed to an AI agent', href: '/ai-consulting/agent-development', price: 'A$8,500' },
  { _key: 'outcome-clarity', name: 'See clearly: knowledge and reporting assistant', href: '/ai-consulting/rag-knowledge-systems', price: 'A$9,500' },
  { _key: 'outcome-quality', name: 'Quality and experience: AI customer service agent', href: '/ai-consulting/customer-service', price: 'A$7,000' },
].map((r) => ({ ...r, _type: 'vcServiceRow', note: 'Fixed-fee package, from' }))
const AI_BODY =
  'Pick the outcome you need. Each package is a fixed-fee first build on OpenAI or Anthropic Claude, live in weeks, with a clear path to scale.'

const FAQ_ID = 'faqItem-vc-f561649d35'
const OLD_FAQ = 'AI consulting from A$24,500, production AI agents from A$35,000'
const NEW_FAQ = 'outcome-based AI packages from A$5,000 (all under A$10,000)'

type Section ={ _key: string; _type: string; [k: string]: unknown }

async function main() {
  if (restoreIdx > 0) {
    const doc = JSON.parse(readFileSync(process.argv[restoreIdx + 1], 'utf8'))
    await client.createOrReplace(doc)
    console.log(`restored ${doc._id} rev ${doc._rev}`)
    return
  }
  const doc = await client.getDocument(PAGE)
  if (!doc) throw new Error(`${PAGE} not found`)
  const sections = doc.sections as Section[]
  const byKey = new Map(sections.map((s) => [s._key, s]))
  for (const [name, key] of Object.entries(KEYS)) if (!byKey.has(key)) throw new Error(`section ${name} (${key}) missing`)

  // 2. Reorder: the six pricing sections move as one block, in the new order, where the block began.
  const block = [KEYS.packages, KEYS.audit, KEYS.services, KEYS.byService, KEYS.licences]
  const start = Math.min(...block.map((k) => sections.findIndex((s) => s._key === k)))
  const rest = sections.filter((s) => !block.includes(s._key))
  const reordered = [...rest.slice(0, start), ...block.map((k) => byKey.get(k)!), ...rest.slice(start)]

  // 1. A$18,000 -> A$5,000 for the AI line wherever the page quotes it as the AI starting price.
  const hero = structuredClone(byKey.get(KEYS.hero)!) as Section & { frameSvg: string; frameSvgAria: string }
  hero.frameSvg = hero.frameSvg.replace(
    /(AI consulting and agents<\/text>(?:(?!<rect)[\s\S])*?text-anchor="end">)A\$18,000(<\/text>)/,
    `$1${NEW_FROM}$2`,
  )
  hero.frameSvgAria = hero.frameSvgAria.replace(`AI consulting and agents from ${OLD_FROM}`, `AI consulting and agents from ${NEW_FROM}`)

  const byService = structuredClone(byKey.get(KEYS.byService)!) as Section & { items: Array<Record<string, unknown>> }
  const card = byService.items.find((i) => i._key === AI_CARD)!
  card.price = NEW_FROM
  card.body = 'Outcome-based packages'

  const facts = structuredClone(byKey.get(KEYS.facts)!)
  const factsJson = JSON.stringify(facts).replace(`AI consulting and agents (from ${OLD_FROM})`, `AI consulting and agents (from ${NEW_FROM})`)

  // 3. Outcome-based AI tab.
  const services = structuredClone(byKey.get(KEYS.services)!) as Section & { tabs: Array<Record<string, unknown>> }
  const tab = services.tabs.find((t) => t._key === AI_TAB)!
  tab.from = NEW_FROM
  tab.body = AI_BODY
  tab.title = 'AI packages by business outcome'
  tab.rows = AI_ROWS

  const replace = (s: Section) =>
    s._key === KEYS.hero ? hero : s._key === KEYS.byService ? byService : s._key === KEYS.services ? services : s._key === KEYS.facts ? JSON.parse(factsJson) : s
  const next = reordered.map(replace)

  console.log('order before:', sections.map((s) => s._type).join(' > '))
  console.log('order after: ', next.map((s) => s._type).join(' > '))
  console.log('hero svg AI price:', /AI consulting and agents[\s\S]*?A\$5,000/.test(hero.frameSvg) ? 'updated' : 'NOT FOUND')
  console.log('hero aria:', hero.frameSvgAria.includes(NEW_FROM) ? 'updated' : 'NOT FOUND')
  console.log('facts row:', factsJson.includes(`(from ${NEW_FROM})`) ? 'updated' : 'NOT FOUND')
  console.log('AI rows:', AI_ROWS.map((r) => `${r.name} ${r.price}`).join('\n         '))
  // The pricing FAQ answer that quotes the old AI figures (portable text, so swap inside the spans).
  const faq = await client.getDocument(FAQ_ID)
  const faqJson = JSON.stringify(faq?.answer ?? null)
  const nextFaq = faqJson.replace(OLD_FAQ, NEW_FAQ)
  console.log('faq answer:', nextFaq !== faqJson ? 'updated' : faqJson.includes(NEW_FAQ) ? 'already updated' : 'NOT FOUND')
  if (!APPLY) return console.log('\ndry run; pass --apply to write')

  mkdirSync('scripts/sanity-backups', { recursive: true })
  const backup = `scripts/sanity-backups/pricing-outcomes-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(backup, JSON.stringify(doc, null, 2))
  console.log(`backup ${backup}`)
  writeFileSync(backup.replace('.json', '-faq.json'), JSON.stringify(faq, null, 2))
  const res = await client.patch(PAGE).ifRevisionId(doc._rev).set({ sections: next }).commit()
  console.log(`written ${res._id} rev ${res._rev}`)
  if (nextFaq !== faqJson && faq) {
    const f = await client.patch(FAQ_ID).ifRevisionId(faq._rev).set({ answer: JSON.parse(nextFaq) }).commit()
    console.log(`written ${f._id} rev ${f._rev}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

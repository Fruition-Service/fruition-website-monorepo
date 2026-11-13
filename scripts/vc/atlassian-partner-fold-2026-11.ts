/**
 * Fold the old Atlassian partner page (/partnerships/certified-atlassian-partner) into
 * /atlassian-consulting. Edward approved this on 13 Nov 2026; the URL 301s to
 * /atlassian-consulting#partner (next.config.ts).
 *
 *   1. One page-specific section on vcPage-atlassian-consulting, key pagespecific-atlassian-partner,
 *      anchor #partner, between "Our Atlassian services" and the four deep dives. It carries the old
 *      page's "Accelerate Your Enterprise & Maximise Efficiency with Atlassian" block and its three
 *      items, verbatim, under an "Atlassian Certified Partner" badge so the page keeps ranking for
 *      "Atlassian certified partner". The only text removed is the unsourced "Return on your
 *      investment of 277%" claim in the Service Management item.
 *   2. The old page's four FAQs as central faqItem-vc-atlassian-partner-* documents (off the /faqs
 *      hub), appended to the first FAQ tab ("Atlassian") of the page.
 *   3. Published documents that linked to the old URL now link to /atlassian-consulting#partner.
 *      Drafts are left alone.
 *
 * No existing section, heading or subheading on the page is changed (SEO hold on headings).
 *
 *   npx tsx scripts/vc/atlassian-partner-fold-2026-11.ts             # dry run
 *   npx tsx scripts/vc/atlassian-partner-fold-2026-11.ts --apply     # backup, then write
 *   npx tsx scripts/vc/atlassian-partner-fold-2026-11.ts --restore <backup.json>
 *
 * Re-runnable: a section, FAQ or link that is already in place is left alone.
 */
import { randomBytes } from 'node:crypto'
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
const k = () => randomBytes(6).toString('hex')

const PAGE = 'vcPage-atlassian-consulting'
const SERVICES_KEY = '1de14271c602' // "Our Atlassian services" cards
export const SECTION_KEY = 'pagespecific-atlassian-partner'
const OLD = '/partnerships/certified-atlassian-partner'
const NEW = '/atlassian-consulting#partner'

const NOTE =
  'Page-specific to /atlassian-consulting, outside the partner page template. Copy of the "Accelerate Your Enterprise & Maximise Efficiency with Atlassian" block of the retired /partnerships/certified-atlassian-partner page, folded in on 13 Nov 2026 (Edward). The old URL 301s to this anchor. The unsourced 277% ROI claim in the Service Management item was removed.'

const SECTION = {
  _key: SECTION_KEY,
  _type: 'vcCards',
  anchor: 'partner',
  tone: 'alt',
  layout: 'cards3',
  pageSpecific: true,
  pageSpecificNote: NOTE,
  head: {
    _type: 'vcHead',
    badge: 'Atlassian Certified Partner',
    heading: 'Accelerate Your Enterprise & Maximise Efficiency *with Atlassian*',
    lead: 'We modernise your business with intelligent Atlassian solutions, streamlined services, and expert migration that deliver measurable ROI across your entire organization.',
  },
  items: [
    {
      _key: `${SECTION_KEY}-01`,
      _type: 'vcItem',
      label: '01',
      title: '#1 in ROVO',
      body: "As former Atlassian team members, we're on the edge of what customers are doing & we'll help build out ROVO Atlassian AI agents that save you time and have a clear ROI. Get in touch to explore how Rovo brings AI-driven simplicity to your workflows, creating virtual agents for service management, chat support for Jira issues, and automating search across Confluence and Jira.",
    },
    {
      _key: `${SECTION_KEY}-02`,
      _type: 'vcItem',
      label: '02',
      title: 'Service Management',
      // Old text: "...intelligent service management solutions. Return on your investment of 277% and
      // eliminate disconnects..." The unsourced percentage is dropped, nothing else changes.
      body: 'Transform customer and employee support and elevate your service with intelligent service management solutions. Eliminate disconnects between development and operations. Jira Service Management offers seamless integration on a unified platform.',
    },
    {
      _key: `${SECTION_KEY}-03`,
      _type: 'vcItem',
      label: '03',
      title: 'Cloud Migration',
      body: 'Future-proof your Atlassian investment with secure and optimised expert cloud migration services. Our certified partnership delivers seamless Monday Atlassian integration, Jira Monday connector solutions, and comprehensive API integration with workflow automation for optimised tool connectivity.',
    },
  ],
}

// The old page's four FAQs, verbatim. Dot-free ids; faqItem-vc-* stays off the /faqs hub.
const FAQS: [string, string][] = [
  ['What is Atlassian used for?', 'Atlassian Cloud is a suite of cloud-based software and collaboration tools: products designed to help teams with software development, project management and team collaboration tasks.'],
  ['What does Atlassian do?', 'Atlassian Corporation is an Australian-American software company that specialises in collaboration tools designed primarily for software development and project management.'],
  ['What is Atlassian best known for?', 'Jira, Confluence, Trello and Bitbucket. Jira is project management, Confluence is collaboration and knowledge base, Trello is visual project management, and Bitbucket is code hosting and collaboration.'],
  ['Who uses Atlassian?', 'Atlassian products are used by teams across many industries. Notable customers include Citigroup, eBay, Netflix, NASA, Coca-Cola, and United Airlines. 80% of Fortune 500 companies are Atlassian customers.'],
]
const faqId = (i: number) => `faqItem-vc-atlassian-partner-${i}`
const faqDocs = FAQS.map(([q, a], i) => ({
  _id: faqId(i),
  _type: 'faqItem',
  question: q,
  answer: [{ _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _key: k(), _type: 'span', marks: [], text: a }] }],
  category: 'Atlassian Consulting',
  pages: ['atlassian-consulting'],
  order: 20 + i,
}))

type Doc = { _id: string; _rev: string; [key: string]: unknown }
type Section = { _key: string; _type: string; label?: string; tabs?: { _key: string; label?: string; items?: { _key: string; _ref: string }[] }[] }

const LINK_RE = /(https:\/\/www\.fruitionservices\.io)?\/partnerships\/certified-atlassian-partner\b/g
function rewrite(v: unknown): unknown {
  if (typeof v === 'string') return v.replace(LINK_RE, (_m, host) => `${host ?? ''}${NEW}`)
  if (Array.isArray(v)) return v.map(rewrite)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([a, b]) => [a, rewrite(b)]))
  return v
}

async function restore(file: string) {
  const { docs, created } = JSON.parse(readFileSync(file, 'utf8')) as { docs: Doc[]; created: string[] }
  const tx = client.transaction()
  for (const d of docs) {
    const { _rev, _createdAt, _updatedAt, ...rest } = d as Doc & { _createdAt?: string; _updatedAt?: string }
    void _rev; void _createdAt; void _updatedAt
    tx.createOrReplace(rest as Doc)
  }
  for (const id of created) tx.delete(id)
  await tx.commit()
  console.log(`restored ${docs.length} documents, deleted ${created.length} created ones, from ${file}`)
}

async function main() {
  if (restoreIdx > 0) return restore(process.argv[restoreIdx + 1])

  const page = await client.fetch<(Doc & { sections: Section[] }) | null>('*[_id == $id][0]', { id: PAGE })
  if (!page) throw new Error(`no ${PAGE}`)
  const tx = client.transaction()
  const touched: Doc[] = [] // pre-change copies, for the backup
  const created: string[] = []
  let changes = 0

  // 1. The section, right after "Our Atlassian services" (so before the deep dives).
  if (page.sections.some((s) => s._key === SECTION_KEY)) console.log(`section ${SECTION_KEY}: already on the page`)
  else {
    if (!page.sections.some((s) => s._key === SERVICES_KEY)) throw new Error('"Our Atlassian services" cards not found')
    const at = page.sections.findIndex((s) => s._key === SERVICES_KEY)
    console.log(`add section ${SECTION_KEY} (vcCards, #partner) after ${page.sections[at]._key}, before ${page.sections[at + 1]?._key}`)
    tx.patch(client.patch(PAGE).ifRevisionId(page._rev).insert('after', `sections[_key=="${SERVICES_KEY}"]`, [SECTION]))
    touched.push(page)
    changes++
  }

  // 2. FAQs: create the four items, append them to the first tab.
  const have = new Set((await client.fetch<{ _id: string }[]>('*[_id in $ids]{_id}', { ids: faqDocs.map((d) => d._id) })).map((d) => d._id))
  for (const d of faqDocs) {
    if (have.has(d._id)) { console.log(`faq ${d._id}: exists`); continue }
    console.log(`create ${d._id}: ${d.question}`)
    tx.create(d)
    created.push(d._id)
    changes++
  }
  const faq = page.sections.find((s) => s._type === 'vcFaq')
  const tab = faq?.tabs?.[0]
  if (!faq || !tab) throw new Error('FAQ section or its first tab not found')
  const inTab = new Set((tab.items ?? []).map((i) => i._ref))
  const missing = faqDocs.filter((d) => !inTab.has(d._id))
  if (missing.length) {
    console.log(`append ${missing.length} FAQ refs to tab "${tab.label}" (${tab.items?.length} existing)`)
    tx.patch(client.patch(PAGE).insert('after', `sections[_key=="${faq._key}"].tabs[_key=="${tab._key}"].items[-1]`, missing.map((d) => ({ _key: k(), _type: 'reference', _ref: d._id }))))
    if (!touched.includes(page)) touched.push(page)
    changes++
  }

  // 3. Published documents that link to the old URL.
  const all = await client.fetch<Doc[]>('*[!(_type match "sanity.*") && !(_type match "system.*")]')
  const hasOld = (d: Doc) => JSON.stringify(d).includes(OLD)
  const linked = all.filter((d) => !d._id.startsWith('drafts.') && d._id !== PAGE && d._id !== 'partnershipPage-certified-atlassian-partner' && hasOld(d))
  const drafts = all.filter((d) => d._id.startsWith('drafts.') && hasOld(d)).map((d) => d._id)
  for (const d of linked) {
    const set: Record<string, unknown> = {}
    for (const [field, value] of Object.entries(d)) {
      if (field.startsWith('_')) continue
      const next = rewrite(value)
      if (JSON.stringify(next) !== JSON.stringify(value)) set[field] = next
    }
    if (!Object.keys(set).length) continue
    console.log(`links ${d._id} (${d._type}): ${Object.keys(set).join(', ')}`)
    tx.patch(client.patch(d._id).ifRevisionId(d._rev).set(set))
    touched.push(d)
    changes++
  }
  console.log(`drafts with the old link, left alone: ${drafts.join(', ') || 'none'}`)

  if (!changes) return console.log('\nnothing to do')
  if (!APPLY) return console.log(`\nDry run: ${changes} change(s). Pass --apply to write.`)

  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/atlassian-partner-fold-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs: touched, created }, null, 2))
  console.log(`\nbackup: ${file}`)
  const res = await tx.commit()
  console.log(`committed transaction ${res.transactionId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

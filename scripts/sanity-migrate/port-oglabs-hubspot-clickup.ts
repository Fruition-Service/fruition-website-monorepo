/**
 * Ports OG Labs' HubSpot and ClickUp service content (oglabs.io/services/*) onto the Fruition
 * Version C pages /hubspot-consulting and /partnerships/certified-clickup-partner.
 *
 *   npx tsx scripts/sanity-migrate/port-oglabs-hubspot-clickup.ts             # dry run, prints the plan
 *   npx tsx scripts/sanity-migrate/port-oglabs-hubspot-clickup.ts --apply     # back up, then write
 *   npx tsx scripts/sanity-migrate/port-oglabs-hubspot-clickup.ts --restore scripts/sanity-backups/<file>.json
 *
 * What it changes (Edward approved, 12 Nov 2026):
 *   - Adds page-specific sections (outside the partner template), each with `pageSpecific: true`,
 *     a `pageSpecificNote`, a `_key` starting "pagespecific-", and an entry in
 *     src/data/vcPageSpecificSections.ts. See docs/version-c.md "Page-specific sections".
 *   - Edits inside existing template sections: HubSpot implementation card covers all six Hubs;
 *     ClickUp service card bodies rewritten (titles kept); ClickUp "How we deliver" grows from 3 to
 *     6 steps; both Results leads say the case studies span our platform work.
 *   - FAQs: removes monday-only questions from both pages ("Does monday com have a CRM?",
 *     "What is monday CRM used for?", "How much does a monday.com implementation cost?") and adds
 *     new `faqItem-vc-*` questions ported from OG Labs.
 *
 * --apply first saves both page documents to scripts/sanity-backups/oglabs-port-<timestamp>.json.
 * --restore puts the saved `sections` back and deletes the FAQ items this script created.
 * Content is OG Labs' copy rewritten in Fruition's voice; unsupported OG Labs statistics were dropped.
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './lib'

const BACKUP_DIR = path.join(__dirname, '..', 'sanity-backups')
const HUBSPOT_ID = 'vcPage-hubspot-consulting'
const CLICKUP_ID = 'vcPage-clickup-partner'
const NOTE_HS = 'Ported from oglabs.io/services/hubspot (OG Labs), 12 Nov 2026. Not part of the partner template.'
const NOTE_CU = 'Ported from oglabs.io/services/clickup (OG Labs), 12 Nov 2026. Not part of the partner template.'

type Obj = Record<string, unknown> & { _key?: string; _type?: string }
interface Page { _id: string; _rev: string; path: string; sections: Obj[] }

let keySeq = 0
const k = (prefix: string) => `${prefix}-${(++keySeq).toString().padStart(2, '0')}`

const block = (text: string, key: string) => [
  { _key: key, _type: 'block', style: 'normal', markDefs: [], children: [{ _key: `${key}s`, _type: 'span', marks: [], text }] },
]

const head = (badge: string, heading: string, lead: string) => ({ _type: 'vcHead', badge, heading, lead })

const cards = (key: string, note: string, tone: 'plain' | 'alt', anchor: string, h: ReturnType<typeof head>, items: [string, string][]): Obj => ({
  _key: key,
  _type: 'vcCards',
  pageSpecific: true,
  pageSpecificNote: note,
  tone,
  anchor,
  head: h,
  layout: 'cards4',
  items: items.map(([title, body], i) => ({ _key: k(key), _type: 'vcItem', label: String(i + 1).padStart(2, '0'), title, body })),
})

const steps = (keyPrefix: string, items: [string, string][]) =>
  items.map(([title, body], i) => ({ _key: k(keyPrefix), _type: 'vcStep', n: String(i + 1).padStart(2, '0'), title, body }))

/* ----------------------------------------------------------------- new FAQ items */

interface NewFaq { _id: string; question: string; answer: string; category: string; pages: string[] }

const FAQS_HUBSPOT: NewFaq[] = [
  {
    _id: 'faqItem-vc-hubspot-onboarding-fee',
    question: 'Do we still pay HubSpot’s onboarding fee?',
    answer:
      'Often not. As a HubSpot Solutions Partner we can run onboarding ourselves, so HubSpot’s own onboarding fee may be waived. You pay for your licences and our fixed-fee implementation, and we confirm what applies to your tier before you buy.',
    category: 'HubSpot Consulting',
    pages: ['hubspot-consulting'],
  },
  {
    _id: 'faqItem-vc-hubspot-tiers',
    question: 'Which HubSpot tiers do you work with?',
    answer:
      'All of them, from Starter to Enterprise, across every Hub. We tell you which tier and add-ons you actually need, and when a lower tier will do the job.',
    category: 'HubSpot Consulting',
    pages: ['hubspot-consulting'],
  },
  {
    _id: 'faqItem-vc-hubspot-migrate-to',
    question: 'Can you migrate us to HubSpot from Salesforce or another CRM?',
    answer:
      'Yes. We move teams from Salesforce, Pipedrive, Zoho and spreadsheets. Objects, owners and history are mapped and cleaned before anything moves, reports are rebuilt to match, and the cutover is staged so sales keeps working.',
    category: 'HubSpot Consulting',
    pages: ['hubspot-consulting'],
  },
]
/** Existing question reused on the HubSpot page ("We already have HubSpot but it's a mess"). */
const REUSED_HUBSPOT_FAQS = ['faqItem-migrated-hubspot-consulting-implementation-1']

const FAQS_CLICKUP: NewFaq[] = [
  {
    _id: 'faqItem-vc-clickup-certified-consultant',
    question: 'Do we need a certified consultant to set up ClickUp?',
    answer:
      'You don’t have to use one, but a planned build avoids the rework and sprawl that come from learning as you go, and it gets every team using ClickUp the same way much sooner.',
    category: 'ClickUp FAQs',
    pages: ['partnerships/certified-clickup-partner'],
  },
  {
    _id: 'faqItem-vc-clickup-crm',
    question: 'Can ClickUp connect to our CRM?',
    answer:
      'Yes. We connect ClickUp to HubSpot and other CRMs, using native integrations first and n8n or Make where the logic needs more. A won deal becomes a delivery project without anyone rekeying it, and status flows back to sales.',
    category: 'ClickUp FAQs',
    pages: ['partnerships/certified-clickup-partner'],
  },
  {
    _id: 'faqItem-vc-clickup-migrate',
    question: 'Can you migrate us to ClickUp from Asana, Jira or Trello?',
    answer:
      'Yes. We map your projects, tasks, custom fields, files and comments, rebuild the workflows in ClickUp, and import in stages so nothing is lost and teams keep working during the move.',
    category: 'ClickUp FAQs',
    pages: ['partnerships/certified-clickup-partner'],
  },
]

/** monday-only questions that were sitting on these two pages. The documents stay; only the references go. */
const REMOVE_FAQ_REFS = new Set(['faq-996791c3b8e54fea', 'faq-bc75e24da0921cc2', 'faqItem-vc-d6429d3124'])

/* -------------------------------------------------------------- new sections */

const HUBSPOT_NEW: Obj[] = [
  cards('pagespecific-hubspot-migration', NOTE_HS, 'alt', 'migration-to-hubspot',
    head('Migration to HubSpot', 'Move to HubSpot *without losing your history.*', 'Objects, owners and reports mapped before anything moves.'),
    [
      ['From Salesforce', 'Objects, custom fields, owners and opportunity history mapped to HubSpot, with reports rebuilt to match what leadership already reads.'],
      ['From Pipedrive and Zoho', 'Deals, activities and notes carried across with their timelines intact, and pipelines rebuilt around how you sell now.'],
      ['From spreadsheets', 'Contacts and companies cleaned, deduplicated and given owners and lifecycle stages before they land in the CRM.'],
      ['A staged cutover', 'The switch is planned around your sales calendar, so the team keeps selling while it happens.'],
    ]),
  cards('pagespecific-hubspot-portal-rescue', NOTE_HS, 'plain', 'portal-audit',
    head('Portal audit and rescue', 'Already on HubSpot and *it feels messy?*', 'We audit the portal, then fix what stops your team trusting it.'),
    [
      ['Property clean-up', 'Unused and duplicate properties retired, records deduplicated, and required fields set so the data stays clean.'],
      ['Lifecycle rebuild', 'Lifecycle stages and lead statuses that mean the same thing to marketing, sales and service.'],
      ['Workflow audit', 'Every workflow reviewed, conflicting and dead automation removed, and what remains documented.'],
      ['Permissions and reporting', 'Teams and permissions tidied, and dashboards rebuilt on numbers leadership can trust.'],
    ]),
  cards('pagespecific-hubspot-revops-integrations', NOTE_HS, 'alt', 'revops',
    head('RevOps and integrations', 'HubSpot connected to *the rest of your stack.*', 'Custom objects and attribution inside HubSpot, clean data flowing in and out.'),
    [
      ['RevOps and attribution', 'Custom objects, properties and attribution reporting, so leadership sees revenue by source, not vanity metrics.'],
      ['ERP and finance', 'Two-way sync with your ERP or finance system, so orders and invoices match the deal without rekeying.'],
      ['ClickUp and project tools', 'Won deals become delivery projects in ClickUp or monday, with status flowing back to the HubSpot record.'],
      ['Custom and legacy apps', 'Internal tools and systems without a native connector, linked through their APIs with n8n or Make.'],
    ]),
  {
    _key: 'pagespecific-hubspot-process',
    _type: 'vcSteps',
    pageSpecific: true,
    pageSpecificNote: NOTE_HS,
    tone: 'plain',
    anchor: 'implementation-process',
    head: head('Implementation process', 'How a HubSpot build *runs.*', 'Six stages, with the architecture agreed before anything is configured.'),
    layout: 'steps',
    items: steps('pagespecific-hubspot-process', [
      ['Discovery', 'We map your sales process, customer journey and current tools before touching any configuration.'],
      ['Architecture', 'Objects, properties, pipelines, lifecycle stages and permissions designed up front, which avoids expensive rework.'],
      ['Build', 'HubSpot configured and automation set up against the approved architecture.'],
      ['Data import', 'Data cleaned, deduplicated and imported, then checked against the source before go-live.'],
      ['Enablement', 'Role-based training and documentation for your exact setup, so adoption holds after launch.'],
      ['Optimise', 'Regular reviews to refine workflows, improve reporting and add capability as you grow.'],
    ]),
  },
]

const CLICKUP_NEW: Obj[] = [
  cards('pagespecific-clickup-beyond-setup', NOTE_CU, 'alt', 'beyond-setup',
    head('Beyond setup', 'Keep ClickUp *earning its place.*', 'What we add once the workspace is live.'),
    [
      ['Dashboards and reporting', 'Workload, capacity, project health and delivery against deadline, on dashboards built for team leads and for leadership.'],
      ['Advanced automations', 'ClickUp automations first, then Make or n8n for multi-step logic, approvals and anything that crosses into other tools.'],
      ['Training by role', 'Sessions and written guides for admins, team leads and everyday users, built on your own workspace rather than a demo.'],
      ['Optimisation and support', 'Regular reviews that tidy what has drifted and add capability as teams and projects grow.'],
    ]),
  cards('pagespecific-clickup-hubspot', NOTE_CU, 'plain', 'hubspot-clickup',
    head('HubSpot ↔ ClickUp', 'Sales in HubSpot. *Delivery in ClickUp.*', 'A won deal becomes a delivery project, with status visible on both sides.'),
    [
      ['Deal to project handoff', 'When a deal closes in HubSpot, the ClickUp project is created from your template with the scope, contacts and dates filled in.'],
      ['Status back to sales', 'Milestones and delivery status sync back to the HubSpot record, so account managers see progress without asking.'],
      ['One owner per field', 'We agree which system owns each field before building, so the two tools never overwrite each other.'],
      ['Built to fail safely', 'Retries, alerts and a log for every sync, so a broken connection is caught the same day, not at month end.'],
    ]),
]

const CLICKUP_STEPS: [string, string][] = [
  ['Discovery and process mapping', 'We document how work moves through your teams today before designing anything.'],
  ['Workspace design', 'Spaces, hierarchy, permissions and custom fields designed around your real workflows.'],
  ['Collaborative build', 'We configure ClickUp in working sessions with your team, so the result fits from day one.'],
  ['Testing', 'Your team runs real work through the workspace, and we fix what doesn’t fit before launch.'],
  ['Import and go-live', 'Data imported cleanly, then a planned switch-over so no team is left working between two tools.'],
  ['Adoption and support', 'Training by role, documentation and ongoing optimisation as the business changes.'],
]

/** ClickUp "Our ClickUp services" card bodies, matched by current title (titles unchanged). */
const CLICKUP_SERVICE_BODIES: Record<string, string> = {
  'Discovery & Strategic Planning': 'A tool audit and process map, then a workspace architecture and workflow plan agreed before anything is built.',
  'Migration & Data Transfer': 'Tasks, projects, files and comments moved from your current tools, with custom fields mapped and history kept.',
  'Workspace Configuration & Setup': 'Spaces, folders and lists, custom statuses, workflows and custom fields set up around how your teams deliver.',
  'Integration & Automation': 'Native integrations, ClickUp automations, and Make, Zapier or n8n flows for logic ClickUp can’t handle on its own.',
}

const HUBSPOT_IMPLEMENTATION_BODY =
  'Sales, Marketing, Service, Operations, Content and Commerce Hub setups with lifecycle architecture, lead scoring and reporting built right the first time.'
const RESULTS_LEAD = 'Published case studies from across our platform work, with the hours each client saved.'

/* ------------------------------------------------------------------ transforms */

const ref = (id: string, key: string) => ({ _key: key, _type: 'reference', _ref: id })

function editFaq(section: Obj, add: string[], keyPrefix: string, log: string[]) {
  const tabs = section.tabs as { items: { _ref: string }[] }[]
  const tab = tabs[0]
  const before = tab.items.length
  const seen = new Set<string>()
  tab.items = tab.items.filter((r) => {
    if (REMOVE_FAQ_REFS.has(r._ref) || seen.has(r._ref)) return false
    seen.add(r._ref)
    return true
  })
  const removed = before - tab.items.length
  const toAdd = add.filter((id) => !seen.has(id))
  tab.items.push(...toAdd.map((id) => ref(id, k(keyPrefix))))
  log.push(`FAQ: removed ${removed} monday-only or duplicate reference(s), added ${toAdd.length}: ${toAdd.join(', ')}`)
}

function find(sections: Obj[], key: string): Obj {
  const s = sections.find((x) => x._key === key)
  if (!s) throw new Error(`Section ${key} not found; the page has changed since this script was written`)
  return s
}

function insertAfter(sections: Obj[], afterKey: string, add: Obj[], log: string[]) {
  const existing = new Set(sections.map((s) => s._key))
  const fresh = add.filter((s) => !existing.has(s._key))
  const i = sections.findIndex((s) => s._key === afterKey)
  if (i < 0) throw new Error(`Section ${afterKey} not found`)
  sections.splice(i + 1, 0, ...fresh)
  log.push(`Inserted after ${afterKey}: ${fresh.map((s) => s._key).join(', ') || '(already present)'}`)
}

function transformHubspot(sections: Obj[], log: string[]) {
  const services = find(sections, '846f6b70ae85')
  const impl = (services.items as Obj[]).find((it) => it.title === 'HubSpot implementation')
  if (impl) { impl.body = HUBSPOT_IMPLEMENTATION_BODY; log.push('Services: implementation card now names all six Hubs') }
  ;(find(sections, 'bf7b51818d32').head as Obj).lead = RESULTS_LEAD
  log.push('Results: lead says the case studies span our platform work')
  editFaq(find(sections, '503204a80bcf'), [...FAQS_HUBSPOT.map((f) => f._id), ...REUSED_HUBSPOT_FAQS], 'faq-hs-port', log)
  insertAfter(sections, '846f6b70ae85', HUBSPOT_NEW, log)
}

function transformClickup(sections: Obj[], log: string[]) {
  const stepsSec = find(sections, 'a28256e86cc6')
  ;(stepsSec.head as Obj).lead = 'Six steps, the same consultant from scoping to support.'
  stepsSec.items = steps('cu-steps-port', CLICKUP_STEPS)
  log.push('How we deliver: 3 steps replaced by 6 (ported from the OG Labs process)')
  const services = find(sections, '800fcca573fb')
  for (const it of services.items as Obj[]) {
    const body = CLICKUP_SERVICE_BODIES[String(it.title)]
    if (body) it.body = body
  }
  log.push('Services: 4 card bodies rewritten, titles kept')
  ;(find(sections, '77366f203f3b').head as Obj).lead = RESULTS_LEAD
  log.push('Results: lead says the case studies span our platform work')
  editFaq(find(sections, '8bac7b1e8d1a'), FAQS_CLICKUP.map((f) => f._id), 'faq-cu-port', log)
  insertAfter(sections, '800fcca573fb', CLICKUP_NEW, log)
}

/* ------------------------------------------------------------------------ run */

async function getPage(id: string): Promise<Page> {
  const p = await writeClient.fetch<Page | null>(`*[_id == $id][0]{ _id, _rev, path, sections }`, { id })
  if (!p) throw new Error(`${id} not found`)
  return p
}

async function restore(file: string) {
  const saved = JSON.parse(fs.readFileSync(file, 'utf8')) as { pages: Page[]; createdFaqIds: string[] }
  const tx = writeClient.transaction()
  for (const p of saved.pages) tx.patch(p._id, (patch) => patch.set({ sections: p.sections }))
  for (const id of saved.createdFaqIds) tx.delete(id)
  await tx.commit()
  console.log(`Restored sections of ${saved.pages.map((p) => p._id).join(', ')} and deleted ${saved.createdFaqIds.length} FAQ item(s).`)
}

async function main() {
  const args = process.argv.slice(2)
  const ri = args.indexOf('--restore')
  if (ri >= 0) return restore(args[ri + 1])
  const apply = args.includes('--apply')

  const [hs, cu] = await Promise.all([getPage(HUBSPOT_ID), getPage(CLICKUP_ID)])
  const hsSections = structuredClone(hs.sections)
  const cuSections = structuredClone(cu.sections)
  const hsLog: string[] = []
  const cuLog: string[] = []
  transformHubspot(hsSections, hsLog)
  transformClickup(cuSections, cuLog)

  console.log(`${hs.path}\n  ${hsLog.join('\n  ')}\n${cu.path}\n  ${cuLog.join('\n  ')}`)
  const newFaqs = [...FAQS_HUBSPOT, ...FAQS_CLICKUP]
  const existingFaqIds = await writeClient.fetch<string[]>(`*[_id in $ids]._id`, { ids: newFaqs.map((f) => f._id) })
  const createdFaqIds = newFaqs.map((f) => f._id).filter((id) => !existingFaqIds.includes(id))
  console.log(`FAQ items to create: ${createdFaqIds.length} (${createdFaqIds.join(', ')})`)

  if (!apply) {
    console.log('\nDry run. Add --apply to back up and write.')
    return
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backup = path.join(BACKUP_DIR, `oglabs-port-${stamp}.json`)
  fs.writeFileSync(backup, JSON.stringify({ note: 'Before port-oglabs-hubspot-clickup.ts --apply', pages: [hs, cu], createdFaqIds }, null, 2))
  console.log(`Backup: ${path.relative(process.cwd(), backup)}`)

  const tx = writeClient.transaction()
  newFaqs.forEach((f, i) =>
    tx.createIfNotExists({ _id: f._id, _type: 'faqItem', question: f.question, answer: block(f.answer, `ans${i}`), category: f.category, pages: f.pages }),
  )
  tx.patch(hs._id, (p) => p.ifRevisionId(hs._rev).set({ sections: hsSections }))
  tx.patch(cu._id, (p) => p.ifRevisionId(cu._rev).set({ sections: cuSections }))
  await tx.commit()
  console.log('Applied. The Sanity webhook (/api/webhooks/sanity) revalidates the site; changes show within a minute or two.')
  console.log('Next: npx tsx scripts/vc/check-page-specific.ts')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

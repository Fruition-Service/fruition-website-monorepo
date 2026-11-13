/**
 * Page-specific FAQs, 13 Nov 2026.
 *
 * Edward: the first FAQ tab on every page must be about that page; anything generic or about another
 * topic goes to the selector bubbles (the other tabs). Example: /atlassian-consulting showed "Does
 * monday com have a CRM?" and "How much does a monday.com implementation cost?" as questions 7 and 8.
 *
 * What the script does to every vcPage FAQ section (vcFaq):
 *   1. Per-page spec below: rename the first tab after the page topic, move off-topic questions out of
 *      the first tab into a named bubble (appended to an existing tab with that label, or a new tab),
 *      put a different tab first, drop a tab, or replace/add first-tab questions.
 *   2. Every page: a question listed twice in one tab is kept once, and a first-tab question that
 *      another tab on the page already carries is dropped from the first tab.
 *
 * Questions are matched by text ("monday com" = "monday.com", case and punctuation ignored).
 * New faqItem documents (careers) get ids `faqItem-vc-careers-*`, which keeps them off the /faqs hub.
 *
 *   npx tsx scripts/vc/page-specific-faqs-2026-11.ts             # dry run, prints every change
 *   npx tsx scripts/vc/page-specific-faqs-2026-11.ts --apply     # backup, then write
 *   npx tsx scripts/vc/page-specific-faqs-2026-11.ts --restore <backup.json>
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
  perspective: 'published',
})
const k = () => randomBytes(6).toString('hex')
const norm = (q: string) =>
  q
    .toLowerCase()
    .replace(/monday com\b/g, 'monday.com')
    .replace(/[’'"?.,:!()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

type Ref = { _key: string; _type: 'reference'; _ref: string }
type Tab = { _key: string; _type?: string; label?: string; items?: Ref[] }
type Spec = {
  /** New label for the first tab (after any reorder). */
  tab1Label?: string
  /** Tab labels to put first, in this order. Applied before tab1Label. */
  first?: string[]
  /** Tabs to remove, by label. Dropped only while they exactly duplicate another tab. */
  dropTabs?: string[]
  renameTabs?: Record<string, string>
  /** Bubble label -> first-tab questions to move there. */
  move?: Record<string, string[]>
  /** faqItem ids that replace the first tab's questions. */
  tab1Replace?: string[]
  /** faqItem ids appended to the first tab. */
  tab1Add?: string[]
}

const AI_AGENT_COST = 'How much does it cost to build an AI agent?'
const EU_AI_ACT = 'Does the EU AI Act apply to Australian or US companies?'
const AI_FIRM = 'What does an AI consulting firm do?'
const RAG = 'What is RAG (retrieval-augmented generation)?'
const ASSESSMENT = 'What is an AI Capability Assessment?'
const BIG4 = 'Why choose Fruition over a Big-4 consulting firm?'
const REMOTE = 'Can Fruition deliver this remotely?'
const AUTOMATION_TOOL = 'Which automation tool should we use: Zapier, Make, or n8n?'
const MONDAY_CRM = 'Does monday com have a CRM?'
const MONDAY_COST = 'How much does a monday.com implementation cost?'
const CLAUDE = 'What does a Claude implementation partner do?'
const CHATGPT = 'What does a ChatGPT implementation partner do?'
const GEMINI = 'What does a Gemini implementation partner do?'
const OPENCLAW = 'What is an Openclaw expert consulting partner?'
const N8N = 'What does n8n stand for?'
const VAPI = 'What is Vapi?'
const AIRCALL = 'What is Aircall and how does it work?'

const WORKING = 'Working with Fruition'
const RELATED_AI = 'Related AI services'

const CAREERS_NEW = [
  {
    _id: 'faqItem-vc-careers-remote',
    question: 'Is Fruition a remote company?',
    answer:
      'Yes. Fruition is 100% remote. You can work from home or anywhere, with flexible hours, an async-friendly culture and no relocation required.',
  },
  {
    _id: 'faqItem-vc-careers-where',
    question: 'Where is the Fruition team based?',
    answer:
      'Our consultants, developers and strategists work across several countries, collaborating with offices and clients in Sydney (head office), New York, London, Singapore and India.',
  },
  {
    _id: 'faqItem-vc-careers-roles',
    question: 'What kinds of roles does Fruition hire for?',
    answer:
      'We hire consultants, developers and strategists who design and build workflows, automations, integrations and AI solutions on platforms such as monday.com for clients around the world.',
  },
  {
    _id: 'faqItem-vc-careers-looking-for',
    question: 'What does Fruition look for in candidates?',
    answer:
      'Problem-solvers with a consultant mindset, technical people with a human touch who build workflows teams actually want to use, and growth-minded professionals who keep learning and share what they know.',
  },
  {
    _id: 'faqItem-vc-careers-why',
    question: 'Why work at Fruition?',
    answer:
      'Your work changes how clients operate, with measurable results. You get flexibility and room to grow as we scale, you work alongside expert consultants on current platforms, and you have the autonomy to recommend the right solution for each client.',
  },
  {
    _id: 'faqItem-vc-careers-apply',
    question: 'How do I apply for a role at Fruition?',
    answer:
      'Use the Apply Now form on this page and tell us about yourself and the work you do best. We review every application and contact you if there is a fit.',
  },
]

const SPECS: Record<string, Spec> = {
  // AI pages
  '/ai-capability-assessment': { tab1Label: 'AI capability assessment', move: { [RELATED_AI]: [AI_FIRM, EU_AI_ACT] } },
  '/ai-consulting/agent-development': { tab1Label: 'AI agents', move: { [RELATED_AI]: [AI_FIRM, RAG, EU_AI_ACT] } },
  '/ai-consulting/governance-and-compliance': { tab1Label: 'AI governance', move: { [RELATED_AI]: [AI_FIRM, ASSESSMENT, RAG] } },
  '/ai-consulting/rag-knowledge-systems': { tab1Label: 'RAG knowledge systems', move: { [RELATED_AI]: [AI_AGENT_COST, EU_AI_ACT, AI_FIRM] } },
  '/ai-readiness-blueprint': { tab1Label: 'AI readiness blueprint', move: { [RELATED_AI]: ['What is AI strategy consulting?', EU_AI_ACT] } },
  '/ai-strategy-and-execution': { tab1Label: 'AI strategy', move: { [RELATED_AI]: [AI_FIRM, ASSESSMENT, AI_AGENT_COST] } },
  '/ai-consulting': { tab1Label: 'AI consulting', move: { [RELATED_AI]: [AI_AGENT_COST, EU_AI_ACT] } },

  // Partner pages
  '/atlassian-consulting': { tab1Label: 'Atlassian', move: { 'Other platforms': [AUTOMATION_TOOL, MONDAY_CRM, MONDAY_COST] } },
  '/integrations': {
    tab1Label: 'Integrations',
    move: { 'Platforms we connect': [N8N, AIRCALL, 'What does a HubSpot consulting partner do?'], [WORKING]: [BIG4] },
  },
  '/partnerships': {
    tab1Label: 'Partnerships',
    move: { 'Our platforms': [MONDAY_CRM, 'What does an Atlassian consultant do?', 'What does a HubSpot consulting partner do?', AI_FIRM] },
  },
  '/partnerships/aircall-partner': { tab1Label: 'Aircall', move: { 'Related platforms': [AUTOMATION_TOOL, 'What is monday CRM used for?', VAPI] } },
  '/partnerships/anthropic-claude-partner': { tab1Label: 'Claude', move: { 'Other AI platforms': [CHATGPT, GEMINI, AI_AGENT_COST] } },
  '/partnerships/certified-clickup-partner': { tab1Label: 'ClickUp', move: { Integrations: [AUTOMATION_TOOL] } },
  '/partnerships/google-gemini-vertex-ai-partner': { tab1Label: 'Gemini & Vertex AI', move: { 'Other AI platforms': [CLAUDE, CHATGPT, AI_AGENT_COST] } },
  '/partnerships/openai-chatgpt-partner': { tab1Label: 'ChatGPT & OpenAI', move: { 'Other AI platforms': [CLAUDE, GEMINI, AI_AGENT_COST] } },
  '/partnerships/grok-bot-partner': { tab1Label: 'Grok Bot', move: { 'AI agents': [AI_AGENT_COST] } },
  '/partnerships/meta-muse-partner': { tab1Label: 'Meta Muse', move: { 'AI agents': [AI_AGENT_COST] } },
  '/partnerships/n8n-integration-partner': { tab1Label: 'n8n', move: { 'Related platforms': [AI_AGENT_COST, OPENCLAW] } },
  '/partnerships/openclaw-partner': { tab1Label: 'OpenClaw', move: { 'Related platforms': [AI_AGENT_COST, N8N, VAPI] } },
  '/partnerships/vapi-partner': { tab1Label: 'Vapi', move: { 'Related platforms': [AIRCALL, AI_AGENT_COST, OPENCLAW] } },

  // Company pages
  '/careers': {
    tab1Replace: [...CAREERS_NEW.map((c) => c._id), 'faqItem-vc-7057ab2ace'],
    move: {},
  },
  '/certifications-and-awards': {
    move: { [WORKING]: ['How much does consulting cost with Fruition?', 'Which regions does Fruition deliver consulting services in?', 'How long does a typical consulting engagement take?', BIG4, REMOTE] },
    tab1Add: ['faqItem-vc-f583325f82', 'faqItem-vc-4da6d89733', 'faq-monday-consulting-partner-consulting-partner-3-1'],
  },
  '/contact-us': { renameTabs: { Careers: 'monday.com implementation' } },

  // Industry pages
  '/industries/education': { move: { [WORKING]: [BIG4, REMOTE] } },
  '/industries/financial-services': { move: { [WORKING]: [BIG4, REMOTE] } },
  '/industries/healthcare': { move: { [WORKING]: [BIG4, REMOTE] } },
  '/industries/solar-renewables': { move: { [WORKING]: [BIG4, REMOTE] }, renameTabs: { 'Project management': 'monday.com consulting' } },
  '/monday-for-construction': { dropTabs: ['Project management'] },
  '/monday-for-government': { dropTabs: ['Project management'] },
  '/monday-for-manufacturing': { dropTabs: ['Project management'] },
  '/monday-for-professional-services': { dropTabs: ['Project management'] },
  '/monday-for-marketing': {
    // The "Marketing" tab held the four generic monday.com questions. They move to a bubble and the
    // central store's Marketing & Creative questions take the first tab.
    move: { 'monday.com consulting': ['Does monday.com have a CRM?', 'Does monday.com have task management?', 'Why is monday.com so successful?', 'What exactly does monday.com do?'] },
    tab1Add: [
      'faq-5877b7ab5de19628',
      'faq-f102f02222644363',
      'faq-cf18a71c30da974d',
      'faq-600c8d3a85c79d3c',
      'faq-4ae029389e9c4bf8',
      'faq-fd4c381dade3e6fb',
      'faq-acbab1e596d2df3f',
      'faq-b0c85506b888daa5',
      'faq-67e60b4b65b6b6e3',
      'faq-0c35367d782d0ba7',
    ],
  },

  // monday.com solution pages
  '/monday-consulting-solutions/monday-project-management': {
    dropTabs: ['Project management'],
    renameTabs: { 'monday Work Management': 'Project management' },
    first: ['Project management'],
  },
  '/monday-implementation-consultants': { first: ['Implementation partner'] },
  '/training': { first: ['Training'] },
}

async function main() {
  if (restoreIdx > -1) {
    const backup = JSON.parse(readFileSync(process.argv[restoreIdx + 1], 'utf8')) as { _id: string; sections: unknown[] }[]
    const tx = client.transaction()
    for (const d of backup) tx.patch(d._id, { set: { sections: d.sections } })
    await tx.commit()
    console.log(`restored ${backup.length} pages`)
    return
  }

  const pages = (await client.fetch(`*[_type=="vcPage" && count(sections[_type=="vcFaq"]) > 0]{_id, path, sections} | order(path asc)`)) as {
    _id: string
    path: string
    sections: { _key: string; _type: string; tabs?: Tab[] }[]
  }[]
  const ids = new Set<string>()
  for (const p of pages) for (const s of p.sections) for (const t of s.tabs ?? []) for (const r of t.items ?? []) ids.add(r._ref)
  for (const s of Object.values(SPECS)) for (const id of [...(s.tab1Replace ?? []), ...(s.tab1Add ?? [])]) ids.add(id)
  const qs = new Map<string, string>(
    ((await client.fetch(`*[_id in $ids]{_id, question}`, { ids: [...ids].filter((i) => !i.startsWith('faqItem-vc-careers-')) })) as { _id: string; question: string }[]).map((d) => [d._id, d.question]),
  )
  for (const c of CAREERS_NEW) qs.set(c._id, c.question)
  const q = (r: Ref) => qs.get(r._ref) ?? `<missing ${r._ref}>`
  const ref = (id: string): Ref => {
    if (!qs.has(id)) throw new Error(`faqItem ${id} not found`)
    return { _key: k(), _type: 'reference', _ref: id }
  }

  const changed: { _id: string; path: string; before: unknown[]; after: unknown[] }[] = []
  const unmatched: string[] = []
  for (const p of pages) {
    const spec = SPECS[p.path] ?? {}
    const sections = structuredClone(p.sections)
    const log: string[] = []
    for (const s of sections) {
      if (s._type !== 'vcFaq') continue
      let tabs = (s.tabs ?? []).map((t) => ({ ...t, items: [...(t.items ?? [])] }))
      for (const label of spec.dropTabs ?? []) {
        // Only an exact duplicate of another tab is dropped, so a rerun leaves the page alone.
        const set = (t: Tab) => (t.items ?? []).map((r) => norm(q(r))).sort().join('\n')
        const i = tabs.findIndex((t) => t.label === label && tabs.some((o) => o !== t && set(o) === set(t)))
        if (i >= 0) {
          tabs.splice(i, 1)
          log.push(`drop tab "${label}"`)
        }
      }
      for (const [from, to] of Object.entries(spec.renameTabs ?? {})) {
        const t = tabs.find((x) => x.label === from)
        if (!t) unmatched.push(`${p.path}: no tab "${from}" to rename`)
        else {
          t.label = to
          log.push(`rename tab "${from}" -> "${to}"`)
        }
      }
      for (const label of [...(spec.first ?? [])].reverse()) {
        const i = tabs.findIndex((t) => t.label === label)
        if (i < 0) unmatched.push(`${p.path}: no tab "${label}" to put first`)
        else if (i > 0) {
          tabs.unshift(...tabs.splice(i, 1))
          log.push(`tab "${label}" first`)
        }
      }
      if (!tabs.length) continue
      const t1 = tabs[0]
      if (spec.tab1Label && t1.label !== spec.tab1Label) {
        log.push(`first tab "${t1.label}" -> "${spec.tab1Label}"`)
        t1.label = spec.tab1Label
      }
      // Move off-topic questions out of the first tab.
      const careersOld = spec.tab1Replace ? [...t1.items] : []
      for (const [label, questions] of Object.entries(spec.move ?? {})) {
        const want = new Set(questions.map(norm))
        const moving = t1.items.filter((r) => want.has(norm(q(r))))
        for (const w of want) if (!moving.some((r) => norm(q(r)) === w)) unmatched.push(`${p.path}: "${w}" not in first tab`)
        if (!moving.length) continue
        t1.items = t1.items.filter((r) => !moving.includes(r))
        let dest = tabs.find((t) => t.label === label && t !== t1)
        if (!dest) {
          dest = { _key: k(), _type: t1._type, label, items: [] }
          tabs.push(dest)
        }
        const have = new Set(dest.items!.map((r) => norm(q(r))))
        for (const r of moving) if (!have.has(norm(q(r)))) dest.items!.push({ ...r, _key: k() })
        log.push(`move to "${label}": ${moving.map(q).join(' | ')}`)
      }
      if (spec.tab1Replace && t1.items.map((r) => r._ref).join() !== spec.tab1Replace.join()) {
        t1.items = spec.tab1Replace.map(ref)
        // The old first-tab questions are about hiring Fruition, not working here: keep them as a bubble.
        const rest = careersOld.filter((r) => !spec.tab1Replace!.includes(r._ref))
        if (rest.length) {
          tabs.push({ _key: k(), _type: t1._type, label: 'monday.com implementation', items: rest.map((r) => ({ ...r, _key: k() })) })
          log.push(`move to "monday.com implementation": ${rest.map(q).join(' | ')}`)
        }
        log.push(`first tab replaced: ${t1.items.map(q).join(' | ')}`)
      }
      if (spec.tab1Add) {
        const have = new Set(t1.items.map((r) => norm(q(r))))
        const add = spec.tab1Add.map(ref).filter((r) => !have.has(norm(q(r))))
        t1.items.push(...add)
        if (add.length) log.push(`first tab add: ${add.map(q).join(' | ')}`)
      }
      // Every page: dedupe inside each tab, then drop first-tab questions another tab carries.
      for (const t of tabs) {
        const seen = new Set<string>()
        const before = t.items!.length
        t.items = t.items!.filter((r) => {
          const n = norm(q(r))
          if (seen.has(n)) return false
          seen.add(n)
          return true
        })
        if (t.items.length < before) log.push(`dedupe "${t.label}" (${before - t.items.length})`)
      }
      if (tabs.length > 1) {
        const elsewhere = new Set(tabs.slice(1).flatMap((t) => t.items!.map((r) => norm(q(r)))))
        const dup = t1.items!.filter((r) => elsewhere.has(norm(q(r))))
        if (dup.length) {
          t1.items = t1.items!.filter((r) => !dup.includes(r))
          log.push(`first tab drops (already in another tab): ${dup.map(q).join(' | ')}`)
        }
      }
      tabs = tabs.filter((t) => t.items!.length)
      s.tabs = tabs
    }
    if (log.length) {
      changed.push({ _id: p._id, path: p.path, before: p.sections, after: sections })
      console.log(`\n## ${p.path}`)
      for (const l of log) console.log(`  - ${l}`)
      for (const s of sections) if (s._type === 'vcFaq') for (const t of s.tabs ?? []) console.log(`    [${t.label}] ${(t.items ?? []).map(q).join(' | ')}`)
    }
  }
  for (const path of Object.keys(SPECS)) if (!pages.some((p) => p.path === path)) unmatched.push(`${path}: no vcPage with an FAQ`)
  if (unmatched.length) {
    console.log('\nUNMATCHED:')
    for (const u of unmatched) console.log(`  ${u}`)
  }
  console.log(`\n${changed.length} pages change`)
  if (!APPLY) return
  if (unmatched.length) throw new Error('unmatched spec entries, fix before applying')

  mkdirSync('scripts/vc/backups', { recursive: true })
  const file = `scripts/vc/backups/page-specific-faqs-${Date.now()}.json`
  writeFileSync(file, JSON.stringify(changed.map((c) => ({ _id: c._id, path: c.path, sections: c.before })), null, 1))
  console.log(`backup: ${file}`)
  const tx = client.transaction()
  for (const c of CAREERS_NEW)
    tx.createIfNotExists({
      _id: c._id,
      _type: 'faqItem',
      question: c.question,
      category: 'Careers',
      pages: ['careers'],
      answer: [{ _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _key: k(), _type: 'span', marks: [], text: c.answer }] }],
    })
  for (const c of changed) tx.patch(c._id, { set: { sections: c.after } })
  await tx.commit()
  console.log(`applied ${changed.length} pages`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

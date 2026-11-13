/**
 * Names a page's own leader on five partner pages, and pins two of them to Thana's calendar.
 *
 *   npx tsx scripts/sanity-migrate/partner-page-leaders.ts             # dry run, prints the plan
 *   npx tsx scripts/sanity-migrate/partner-page-leaders.ts --apply     # back up, then write
 *   npx tsx scripts/sanity-migrate/partner-page-leaders.ts --restore scripts/sanity-backups/<file>.json
 *
 * Edward's request, 13 Nov 2026:
 *   - /hubspot-consulting and /partnerships/certified-clickup-partner: the booking card always books
 *     with Thana, whatever the visitor's region (`vcBooking.desk = "thana"`, see src/lib/bookingDesks.ts),
 *     and "Who leads it" shows Thana.
 *   - /partnerships/aircall-partner: Suzzane Castro. /partnerships/n8n-integration-partner: Yash Khowal.
 *     /partnerships/openclaw-partner: Edward Zhang.
 *
 * "Who leads it" (vcPractitioners) gets `leader` (a teamMember reference: photo, name and role come
 * from the person's own record), `leaderFacts` and `leaderPills`, and its paragraphs stop naming
 * Josh. The badge and heading stay on the shared block (SEO heading hold, CLAUDE.md).
 * Facts are drawn from each person's teamMember bio and regions only; badges repeat the partner
 * claim the page already makes. Nothing else on the pages changes.
 *
 * --apply first saves the five page documents to scripts/sanity-backups/partner-leaders-<timestamp>.json;
 * --restore puts the saved `sections` back.
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './lib'

const BACKUP_DIR = path.join(__dirname, '..', 'sanity-backups')

type Obj = Record<string, unknown> & { _key?: string; _type?: string }
interface Page { _id: string; _rev: string; path: string; sections: Obj[] }

interface Plan {
  pageId: string
  person: string
  desk?: 'thana'
  paragraph: string
  facts: [string, string][]
  pills: string[]
}

const INK = 'The consultant who scopes your engagement is the consultant who delivers it.'

const THANA_FACTS: [string, string][] = [
  ['Focus', 'CRM and workflow operations'],
  ['Platforms', 'HubSpot · ClickUp · monday.com'],
  ['Markets', 'AU · SG · PH'],
]

const PLANS: Plan[] = [
  {
    pageId: 'vcPage-hubspot-consulting',
    person: 'team-roster-5024398393',
    desk: 'thana',
    paragraph:
      'Thana Witchawut, Principal AI Consultant, leads every HubSpot engagement, combining strategy and implementation to build CRM and workflow operations that help growing teams scale, not just tool setups.',
    facts: THANA_FACTS,
    pills: ['HubSpot Solutions Partner'],
  },
  {
    pageId: 'vcPage-clickup-partner',
    person: 'team-roster-5024398393',
    desk: 'thana',
    paragraph:
      'Thana Witchawut, Principal AI Consultant, leads every ClickUp engagement, combining strategy and implementation to build workspaces and workflow operations that help growing teams scale, not just tool setups.',
    facts: THANA_FACTS,
    pills: ['Certified ClickUp Partner'],
  },
  {
    pageId: 'vcPage-aircall-partner',
    person: 'team-suzzane',
    paragraph:
      'Suzzane Castro, Regional AI Delivery Manager, leads every Aircall engagement. As a business automation specialist, Suzzane connects your phone system with the tools around it, from monday.com and Make to Xero, Slack and Google Workspace.',
    facts: [
      ['Focus', 'Business automation'],
      ['Tools', 'monday.com · Make · Zapier'],
      ['Markets', 'AU · SG · PH'],
    ],
    pills: ['Official Aircall Partner'],
  },
  {
    pageId: 'vcPage-n8n-integration-partner',
    person: 'team-yash',
    paragraph:
      'Yash Khowal, AI Engineer, leads every n8n engagement. With a background in AI engineering, cloud infrastructure and full-stack development, Yash turns complex workflows into production-ready systems, from LLM pipelines to agentic automations.',
    facts: [
      ['Focus', 'AI engineering'],
      ['Builds', 'LLM pipelines · AI agents'],
      ['Market', 'AU'],
    ],
    pills: ['n8n Partner'],
  },
  {
    pageId: 'vcPage-openclaw-partner',
    person: 'team-roster-2607577824',
    paragraph:
      'Edward Zhang leads every OpenClaw engagement. A founder and product designer building at the intersection of AI and SaaS, Edward runs OpenClaw agents in day-to-day operations and designs the systems around them.',
    facts: [
      ['Focus', 'AI agents and products'],
      ['Studio', 'Kelin Studio'],
      ['Based', 'Singapore'],
    ],
    pills: ['OpenClaw Partner'],
  },
]

const key = (s: string) => s.replace(/[^a-z0-9]/gi, '').slice(0, 12).toLowerCase()

function patchFor(page: Page, plan: Plan) {
  const lead = page.sections.find((s) => s._type === 'vcPractitioners')
  if (!lead?._key) throw new Error(`${page.path}: no "Who leads it" section`)
  const set: Record<string, unknown> = {
    [`sections[_key=="${lead._key}"].leader`]: {
      _type: 'vcTeamRef',
      person: { _type: 'reference', _ref: plan.person },
    },
    [`sections[_key=="${lead._key}"].leaderFacts`]: plan.facts.map(([label, value]) => ({
      _key: `lf${key(label)}`,
      _type: 'vcFact',
      label,
      value,
    })),
    [`sections[_key=="${lead._key}"].leaderPills`]: plan.pills,
    [`sections[_key=="${lead._key}"].paragraphs`]: [
      { _key: 'leadp1', _type: 'vcLeadPara', style: 'body', text: plan.paragraph },
      { _key: 'leadp2', _type: 'vcLeadPara', style: 'ink', text: INK },
    ],
  }
  if (plan.desk) {
    const book = page.sections.find((s) => s._type === 'vcBooking')
    if (!book?._key) throw new Error(`${page.path}: no booking section`)
    set[`sections[_key=="${book._key}"].desk`] = plan.desk
  }
  return set
}

async function restore(file: string) {
  const saved = JSON.parse(fs.readFileSync(file, 'utf8')) as { pages: Page[] }
  const tx = writeClient.transaction()
  for (const p of saved.pages) tx.patch(p._id, (patch) => patch.set({ sections: p.sections }))
  await tx.commit()
  console.log(`Restored ${saved.pages.length} pages from ${file}`)
}

async function main() {
  const args = process.argv.slice(2)
  const ri = args.indexOf('--restore')
  if (ri >= 0) return restore(args[ri + 1])

  const ids = PLANS.map((p) => p.pageId)
  const pages = await writeClient.fetch<Page[]>(`*[_id in $ids]{ _id, _rev, path, sections }`, { ids })
  const people = await writeClient.fetch<{ _id: string; name: string }[]>(
    `*[_id in $ids]{ _id, name }`,
    { ids: [...new Set(PLANS.map((p) => p.person))] },
  )
  const nameOf = new Map(people.map((p) => [p._id, p.name]))

  const work = PLANS.map((plan) => {
    const page = pages.find((p) => p._id === plan.pageId)
    if (!page) throw new Error(`missing page ${plan.pageId}`)
    if (!nameOf.has(plan.person)) throw new Error(`missing teamMember ${plan.person}`)
    return { page, plan, set: patchFor(page, plan) }
  })

  for (const { page, plan } of work) {
    console.log(`${page.path}: leader ${nameOf.get(plan.person)}${plan.desk ? `, booking desk "${plan.desk}"` : ''}`)
  }
  if (!args.includes('--apply')) {
    console.log('\nDry run. Re-run with --apply to write.')
    return
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backup = path.join(BACKUP_DIR, `partner-leaders-${stamp}.json`)
  fs.writeFileSync(backup, JSON.stringify({ note: 'Before partner-page-leaders.ts --apply', pages }, null, 2))
  console.log(`Backup: ${path.relative(process.cwd(), backup)}`)

  const tx = writeClient.transaction()
  for (const { page, set } of work) tx.patch(page._id, (p) => p.ifRevisionId(page._rev).set(set))
  await tx.commit()
  console.log('Applied.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

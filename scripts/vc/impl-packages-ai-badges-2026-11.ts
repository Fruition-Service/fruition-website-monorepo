/**
 * /implementation-packages and /fruition-team (17 Nov 2026, Edward).
 *
 *   npx tsx scripts/vc/impl-packages-ai-badges-2026-11.ts          # dry run
 *   npx tsx scripts/vc/impl-packages-ai-badges-2026-11.ts --apply  # backs up, then writes
 *   npx tsx scripts/vc/impl-packages-ai-badges-2026-11.ts --restore <backup.json>
 *
 * 1. /implementation-packages hero badge card: adds the OpenAI and Anthropic Claude partner badges
 *    after monday.com, Atlassian and HubSpot (credsClass "two" wraps them into two rows).
 * 2. /implementation-packages: restores "What's included in each monday.com implementation package"
 *    directly under the packages section. A page-specific vcTable (variant "matrix"); the copy is
 *    the pre-Version C comparison table (src/app/implementation-packages/content.ts COMPARE_ROWS at
 *    156e85c^, identical to the retired implementationPackagesPage.compareRows in Sanity), verbatim.
 *    Empty cells read "Not included", as the old page did.
 * 3. /fruition-team hero: HubSpot and Atlassian badges join monday.com at the top right (`creds`),
 *    OpenAI and Claude sit at the bottom right (`floatBadges`).
 *
 * Badges are partner references (`partner-<key>`), so the images stay in step with the Partner docs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from '../sanity-migrate/lib'

const newKey = () => Math.random().toString(16).slice(2, 14)
const MATRIX_KEY = 'pagespecific-pricing-package-matrix'
const AFTER_KEY = '073c71278d1c'
const BACKUP_DIR = path.join(process.cwd(), 'scripts/sanity-backups')

const COLUMNS = ['Training & Optimisation', 'Lock-Step', 'Deployed Engineer']
const ROWS: [string, string, string, string][] = [
  ['Team size', '1 team, up to 25 users', '1-2 teams, up to 50 users', 'Multiple teams, up to 250 users'],
  ['Best for', 'Existing accounts that need a reset', 'New rollouts and core rebuilds, built and deployed together', 'Continuous change and scale'],
  ['Process mapping', 'Review of current boards and workflows', '1-2 workflows mapped end to end', 'Every new workflow, as needed'],
  ['Solution design', 'Written recommendations', '✓ Signed off before build', '✓ For each new build'],
  ['Boards and dashboards', 'Up to 5 boards cleaned up', 'Up to 8 boards + 2 dashboards built', 'New boards and dashboards each month'],
  ['Automations', 'Up to 10 optimised', 'Up to 15 built', '✓ Ongoing'],
  ['Integrations and data migration', '', '1 integration + 1 data import', '✓ Ongoing'],
  ['Working sessions', '1 discovery session', '4 build sessions with your team', 'Weekly check-in'],
  ['Training', '2 sessions (users and admins)', '3 sessions (users, champions, admins)', '✓ As teams and roles change'],
  ['Go-live support', '', '30 days after go-live', '✓ Ongoing'],
  ['Admin support and change requests', '', '', '✓ Within 2 business days'],
  ['Documentation', '✓ Handover guide', '✓ Handover and admin guide', '✓ Living documentation'],
  ['Roadmap reviews', '', '', '✓ Monthly'],
]

type Sec = Record<string, any> & { _key: string; _type: string }

async function logo(partnerId: string, extra: Record<string, unknown> = {}) {
  const p = await writeClient.fetch<{ badge?: { alt?: string; asset?: { _ref: string } } }>(`*[_id == $id][0]{ badge }`, { id: partnerId })
  if (!p?.badge?.asset?._ref) throw new Error(`${partnerId} has no badge`)
  return {
    _key: newKey(),
    _type: 'vcLogo',
    alt: p.badge.alt,
    image: { _type: 'image', asset: { _type: 'reference', _ref: p.badge.asset._ref } },
    partner: { _type: 'reference', _ref: partnerId },
    partnerImage: 'badge',
    ...extra,
  }
}
const hasPartner = (arr: any[] | undefined, id: string) => (arr ?? []).some((c) => c?.partner?._ref === id)

async function main() {
  const args = process.argv.slice(2)
  const restoreAt = args.indexOf('--restore')
  if (restoreAt !== -1) {
    const snap = JSON.parse(fs.readFileSync(args[restoreAt + 1], 'utf8'))
    for (const d of snap.pages) await writeClient.patch(d._id).set({ sections: d.sections }).commit()
    console.log('Restored', snap.pages.map((d: any) => d._id).join(', '))
    return
  }
  const apply = args.includes('--apply')
  const ids = ['vcPage-pricing', 'vcPage-fruition-team']
  const pages = await writeClient.fetch<{ _id: string; sections: Sec[] }[]>(`*[_id in $ids]{ _id, sections }`, { ids })
  const backup = JSON.parse(JSON.stringify(pages))
  const [openai, claude, hubspot, atlassian] = await Promise.all([
    logo('partner-openai'),
    logo('partner-claude'),
    logo('partner-hubspot', { shape: 'sqh' }),
    logo('partner-atlassian'),
  ])
  const clone = (l: any) => ({ ...l, _key: newKey() })

  for (const page of pages) {
    const hero = page.sections.find((s) => s._type === 'vcHero')!
    if (page._id === 'vcPage-pricing') {
      for (const l of [openai, claude]) if (!hasPartner(hero.creds, l.partner._ref)) hero.creds.push(clone(l))
      hero.credsClass = 'two'
      if (!page.sections.some((s) => s._key === MATRIX_KEY)) {
        const at = page.sections.findIndex((s) => s._key === AFTER_KEY)
        if (at === -1) throw new Error('packages section not found')
        page.sections.splice(at + 1, 0, {
          _key: MATRIX_KEY,
          _type: 'vcTable',
          pageSpecific: true,
          pageSpecificNote:
            "17 Nov 2026, Edward: the detailed 'what is included' comparison the page had before the Version C redesign, restored verbatim from the old comparison table (content.ts COMPARE_ROWS at 156e85c^, same as the retired implementationPackagesPage.compareRows). Seeded by scripts/vc/impl-packages-ai-badges-2026-11.ts.",
          anchor: 'whats-included',
          tone: 'plain',
          variant: 'matrix',
          head: {
            _type: 'vcHead',
            badge: 'What each package includes',
            heading: "What's included in *each monday.com implementation package*",
            lead: 'One package is purchased per monday.com product. monday.com licences are paid separately to monday.com.',
          },
          columns: COLUMNS,
          rows: ROWS.map(([label, ...cells]) => ({ _key: newKey(), _type: 'vcRow', label, cells })),
        })
      }
    } else {
      hero.creds = hero.creds ?? []
      for (const l of [hubspot, atlassian]) if (!hasPartner(hero.creds, l.partner._ref)) hero.creds.push(clone(l))
      hero.floatBadges = hero.floatBadges ?? []
      for (const l of [openai, claude]) if (!hasPartner(hero.floatBadges, l.partner._ref)) hero.floatBadges.push(clone(l))
    }
  }

  for (const p of pages) {
    const hero = p.sections.find((s) => s._type === 'vcHero')!
    console.log(p._id, 'creds:', hero.creds.map((c: any) => c.partner?._ref).join(', '), '| float:', (hero.floatBadges ?? []).map((c: any) => c.partner?._ref).join(', '), '| sections:', p.sections.length)
  }
  if (!apply) return console.log('Dry run. Re-run with --apply.')
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(BACKUP_DIR, `impl-packages-ai-badges-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(file, JSON.stringify({ pages: backup }, null, 2))
  for (const p of pages) await writeClient.patch(p._id).set({ sections: p.sections }).commit()
  console.log('Applied. Backup:', file)
}
main()

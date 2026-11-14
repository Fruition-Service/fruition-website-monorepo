/**
 * /industries hub tiles (Edward, 14 Nov 2026): "make sure the descriptions are all similar length, add an
 * icon for each, remove the arrow". The arrow is gone in code (Card, cardTile); this sets each tile's
 * one-line description (85 to 100 characters, was 66 to 197) and its line icon.
 *
 * Icons are the menu's own (scripts/nav-icons), recoloured by CSS (stroke set to currentColor here). Two
 * of those files draw a <rect> with no width or height, so construction and professional services show
 * only part of the shape; the tile copies carry the full building and briefcase.
 *
 *   npx tsx scripts/vc/industries-tiles-2026-11.ts            # dry run
 *   npx tsx scripts/vc/industries-tiles-2026-11.ts --apply    # back up, then write
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
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
const DOC = 'vcPage-industries'
const ICONS = join(__dirname, '..', 'nav-icons')

/** Full shapes for the two menu icons whose <rect> has no size. */
const RECT_FIX: Record<string, [string, string]> = {
  construction: ['<rect x="4" y="2" rx="2"></rect>', '<rect x="4" y="2" width="16" height="20" rx="2"></rect>'],
  'professional-services': ['<rect x="2" y="7" rx="2"></rect>', '<rect x="2" y="7" width="20" height="14" rx="2"></rect>'],
}

function icon(name: string) {
  let svg = readFileSync(join(ICONS, `${name}.svg`), 'utf8').trim()
  const fix = RECT_FIX[name]
  if (fix) {
    if (!svg.includes(fix[0])) throw new Error(`${name}: rect to fix not found`)
    svg = svg.replace(fix[0], fix[1])
  }
  return svg.replace(/ width="24" height="24"/, '').replace(/stroke="#8015e8"/, 'stroke="currentColor"')
}

/** Tile title -> [icon file, one-line description or null to keep]. */
const TILES: Record<string, [string, string | null]> = {
  Construction: ['construction', null],
  Manufacturing: ['manufacturing', null],
  Government: ['government', null],
  'Professional services': ['professional-services', null],
  'Real estate': ['real-estate', 'Listings, deal pipelines, property operations and tenant requests, tracked on one board.'],
  'Financial services': ['financial-services', 'APRA- and FCA-aligned workflows, approvals and client onboarding, with AI that keeps an audit trail.'],
  Retail: ['retail', 'Store operations, supply chain and customer experience, run consistently across every location.'],
  Healthcare: ['healthcare', 'Patient workflows, referral management and back-office automation on HIPAA-configured platforms.'],
  'Solar & renewables': ['solar-and-renewables', 'Install pipelines, crew scheduling, rebate workflows and the compliance chain in between.'],
  Education: ['education', 'Admissions, student services, staff operations and compliance, with privacy built in.'],
  Nonprofits: ['nonprofits', 'Donor and grant management, program delivery, volunteers and regulator-ready reporting.'],
  'Transport & logistics': ['transport-and-logistics', 'Dispatch, fleet, freight and depot workflows, with automation where the manual handoffs live.'],
  'Hospitality, tourism & events': ['hospitality-and-events', 'Event delivery, tourism campaigns, venue operations and multi-site hospitality workflows.'],
  'Technology & SaaS': ['technology-and-saas', 'Product delivery, sales pipeline, onboarding and support, connected to the tools engineering uses.'],
  'Energy & utilities': ['energy-and-utilities', 'Field jobs, network projects, asset maintenance and the compliance evidence behind them.'],
  'Media & entertainment': ['media-and-entertainment', 'Production, editorial and client delivery workflows for broadcasters, publishers and studios.'],
  Legal: ['legal', 'Matter tracking, client intake and deadlines, with governed AI that keeps privileged work private.'],
  'Marketing & creative': ['marketing-and-creative', 'Campaign workflows, creative asset production and consistent brand delivery across teams.'],
  // "Use case hub" tiles (title only).
  'Project management': ['crm-and-sales', null],
  HR: ['hr-operations', null],
  Service: ['service-itsm', null],
}

async function main() {
  const doc = await client.fetch(`*[_id == $id][0]`, { id: DOC })
  if (!doc) throw new Error(`${DOC} not found`)
  let n = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = doc.sections.map((s: any) => {
    if (s._type !== 'vcCards') return s
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (s.items ?? []).map((it: any) => {
      const t = TILES[it.title]
      if (!it.cardTile || !t) return it
      const [ico, body] = t
      n++
      const setBody = body && it.body ? body : null
      const next = { ...it, icon: icon(ico), ...(setBody ? { body: setBody } : {}) }
      console.log(`${it.title}: icon ${ico}${setBody ? `, body ${it.body.length} -> ${setBody.length}` : ''}`)
      return next
    })
    return { ...s, items }
  })
  console.log(`${n} tiles`)
  if (!APPLY) return console.log('dry run: add --apply')
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/industries-tiles-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs: [doc] }, null, 2))
  await client.patch(DOC).set({ sections }).commit()
  console.log(`backed up to ${file} and applied`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

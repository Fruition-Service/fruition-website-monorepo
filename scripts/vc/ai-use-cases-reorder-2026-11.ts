/**
 * /ai-use-cases (Edward, 17 Nov 2026): move "Find a use case like yours." (vcCatalogue) above
 * "Browse by industry." (vcIndustryGrid). Tones are set so the bands keep alternating:
 * hero, catalogue (alt), industries (plain), audit (alt), steps (plain), proof (alt).
 * Re-runnable: it finds the sections by type and sets the order, so a second run changes nothing.
 *
 *   npx tsx scripts/vc/ai-use-cases-reorder-2026-11.ts            # dry run
 *   npx tsx scripts/vc/ai-use-cases-reorder-2026-11.ts --apply    # back up, then write
 */
import { writeFileSync, mkdirSync } from 'node:fs'
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
const DOC = 'vcPage-ai-use-cases'

type Section = { _key: string; _type: string; tone?: string }

async function main() {
  const doc = await client.getDocument<{ sections: Section[] }>(DOC)
  if (!doc) throw new Error(`${DOC} not found`)
  const sections = doc.sections
  const cat = sections.find((s) => s._type === 'vcCatalogue')
  const grid = sections.find((s) => s._type === 'vcIndustryGrid')
  if (!cat || !grid) throw new Error('catalogue or industry grid section missing')
  const rest = sections.filter((s) => s !== cat && s !== grid)
  const hero = rest.findIndex((s) => s._type === 'vcHero')
  const next = [...rest.slice(0, hero + 1), { ...cat, tone: 'alt' }, { ...grid, tone: 'plain' }, ...rest.slice(hero + 1)]
  const audit = next.find((s) => s._type === 'vcAudit')
  if (audit) audit.tone = 'alt'
  console.log('Order:', next.map((s) => `${s._type}${s.tone ? `(${s.tone})` : ''}`).join(' > '))
  if (!APPLY) return console.log('Dry run. Add --apply to write.')
  const dir = join(__dirname, '..', 'sanity-backups')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, `ai-use-cases-reorder-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify({ _id: DOC, sections }, null, 2))
  await client.patch(DOC).set({ sections: next }).commit()
  console.log('Written. Backup:', file)
}
main()

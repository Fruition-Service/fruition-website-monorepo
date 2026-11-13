/**
 * Swaps the hero art on /industries/legal and /industries/hospitality-tourism-events
 * (13 Nov 2026: calmer scales + gavel for legal, bell + pin + ticket for hospitality).
 * Uploads the files in assets/industries-2026-11 and points each page's vcHero.art at them.
 *
 *   npx tsx scripts/vc/swap-hero-art-2026-11.ts           # dry run
 *   npx tsx scripts/vc/swap-hero-art-2026-11.ts --apply
 */
import * as fs from 'fs'
import * as path from 'path'
import { writeClient } from '../sanity-migrate/lib'

const APPLY = process.argv.includes('--apply')
const ASSETS = path.join(__dirname, 'assets', 'industries-2026-11')
const SWAPS = [
  { id: 'vcPage-industries-legal', file: 'hero-legal.webp' },
  { id: 'vcPage-industries-hospitality-tourism-events', file: 'hero-hospitality.webp' },
]

async function main() {
  for (const s of SWAPS) {
    for (const id of [s.id, `drafts.${s.id}`]) {
      const doc = await writeClient.fetch<{ sections?: { _key: string; _type: string; art?: { asset?: { _ref: string } } }[] } | null>(`*[_id == $id][0]{ sections[]{ _key, _type, art } }`, { id })
      if (!doc) continue
      const hero = doc.sections?.find((x) => x._type === 'vcHero')
      if (!hero) throw new Error(`${id}: no vcHero`)
      console.log(`${id}: hero ${hero._key}, art ${hero.art?.asset?._ref}`)
      if (!APPLY) continue
      const asset = await writeClient.assets.upload('image', fs.readFileSync(path.join(ASSETS, s.file)), { filename: s.file })
      await writeClient.patch(id).set({ [`sections[_key=="${hero._key}"].art.asset._ref`]: asset._id }).commit()
      console.log(`  -> ${asset._id}`)
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })

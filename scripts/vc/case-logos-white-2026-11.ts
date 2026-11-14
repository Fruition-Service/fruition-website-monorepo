/**
 * Case-card logos are white over the tinted photo (Edward, 15 Nov 2026: "all the logos should be white").
 * An audit of the 57 logos on live case cards found two with colour: ADG Construction (orange
 * "CONSTRUCTION") and Office Furniture Company (grey anti-aliased edges). Both get an all-white copy (same
 * shape and alpha, RGB set to white). Only the vcCase logos change; the logo-wall asset is untouched.
 *
 *   npx tsx scripts/vc/case-logos-white-2026-11.ts            # dry run
 *   npx tsx scripts/vc/case-logos-white-2026-11.ts --apply    # back up, upload, patch
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
const ASSETS = join(__dirname, 'assets', 'platform-cases')
const FIXES = [
  { id: 'vcCase-adg-construction', file: 'adg-logo-white.png', alt: 'ADG Construction logo' },
  { id: 'vcCase-office-furniture-company', file: 'ofc-logo-white.png', alt: 'Office Furniture Company logo' },
]

async function main() {
  const docs = await client.fetch(`*[_id in $ids]`, { ids: FIXES.map((f) => f.id) })
  for (const f of FIXES) console.log(`${f.id}: logo <- ${f.file}`)
  if (!APPLY) return console.log('dry run: add --apply')
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/case-logos-white-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs }, null, 2))
  for (const f of FIXES) {
    const a = await client.assets.upload('image', readFileSync(join(ASSETS, f.file)), { filename: f.file })
    await client.patch(f.id).set({ logo: { _type: 'image', asset: { _type: 'reference', _ref: a._id }, alt: f.alt } }).commit()
    console.log(`patched ${f.id} -> ${a._id}`)
  }
  console.log(`backup: ${file}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

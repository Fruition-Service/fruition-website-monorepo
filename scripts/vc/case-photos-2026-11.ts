/**
 * Case-card fixes from Edward's 14 Nov 2026 review.
 *
 * - ADG Construction (/integrations/twilio) showed the placeholder clay art and no logo. It now gets
 *   a stock photo (Unsplash, free licence: timber roof frame on a new house, photo-1676802037786) and
 *   the ADG logo already used on the client logo wall (l-adg-construction.png).
 * - Pacific Community (/partnerships/certified-clickup-partner) reused BasePoint's photo, a different
 *   client. It gets its own (Unsplash, free licence: a meeting in Suva, photo-1700616270774).
 *
 * An audit of every vcCase on a live page found no other missing logo or photo shared between two
 * different clients (same-client repeats across pages are fine).
 *
 *   npx tsx scripts/vc/case-photos-2026-11.ts            # dry run
 *   npx tsx scripts/vc/case-photos-2026-11.ts --apply    # back up, upload, patch
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

const FIXES: { id: string; photo?: string; logo?: { file: string; alt: string } }[] = [
  { id: 'vcCase-adg-construction', photo: 'adg.jpg', logo: { file: 'adg-logo.png', alt: 'ADG Construction logo' } },
  { id: 'vcCase-pacific-community', photo: 'spc-meeting.jpg' },
]

async function upload(file: string) {
  const a = await client.assets.upload('image', readFileSync(join(ASSETS, file)), { filename: file })
  return { _type: 'image', asset: { _type: 'reference', _ref: a._id } }
}

async function main() {
  const docs = await client.fetch(`*[_id in $ids]`, { ids: FIXES.map((f) => f.id) })
  for (const f of FIXES) console.log(`${f.id}: ${f.photo ? `photo <- ${f.photo}` : ''} ${f.logo ? `logo <- ${f.logo.file}` : ''}`)
  if (!APPLY) return console.log('dry run: add --apply')
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/case-photos-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs }, null, 2))
  for (const f of FIXES) {
    const set: Record<string, unknown> = {}
    if (f.photo) set.photo = await upload(f.photo)
    if (f.logo) set.logo = { ...(await upload(f.logo.file)), alt: f.logo.alt }
    await client.patch(f.id).set(set).commit()
    console.log(`patched ${f.id}`)
  }
  console.log(`backup: ${file}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

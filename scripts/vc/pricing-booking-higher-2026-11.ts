/**
 * /implementation-packages: move the booking section ("Book a free 30-minute system audit.") up to sit
 * straight after the "Not sure which package fits?" band, 14 Nov 2026.
 *
 * Why: PostHog (31 Oct to 14 Nov) showed 45 visitors, 1 "Get quote" click and 1 form submit. Half of
 * visitors stop scrolling at 38% of the page (about 4,700px on desktop), but the booking section sat at
 * about 9,900px, so most never saw it, and every package button jumped 9,000px down to reach it.
 * Section order only: no copy, heading or section content changes.
 *
 *   npx tsx scripts/vc/pricing-booking-higher-2026-11.ts            # dry run
 *   npx tsx scripts/vc/pricing-booking-higher-2026-11.ts --apply    # backup, then write
 *   npx tsx scripts/vc/pricing-booking-higher-2026-11.ts --restore <backup.json>
 */
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

const PAGE = 'vcPage-pricing'

type Section = { _key: string; _type: string; heading?: string }
type Page = { _id: string; _rev: string; sections: Section[] }

const label = (s: Section) => `${s._type}${s.heading ? `  ${s.heading}` : ''}`

async function restore(file: string) {
  const doc = JSON.parse(readFileSync(file, 'utf8')) as Page
  await client.patch(PAGE).set({ sections: doc.sections }).commit()
  console.log(`restored ${PAGE} sections from ${file}`)
}

async function main() {
  if (restoreIdx > 0) return restore(process.argv[restoreIdx + 1])

  const page = await client.fetch<Page | null>(`*[_id == $id][0]`, { id: PAGE })
  if (!page) throw new Error(`${PAGE} not found`)
  const drafts = await client.fetch<number>(`count(*[_id == $id])`, { id: `drafts.${PAGE}` })
  if (drafts) throw new Error(`${PAGE} has an unpublished draft; publish or discard it first`)

  const sections = page.sections
  const booking = sections.filter((s) => s._type === 'vcBooking')
  const audit = sections.filter((s) => s._type === 'vcAudit')
  if (booking.length !== 1 || audit.length !== 1) {
    throw new Error(`expected one vcBooking and one vcAudit, found ${booking.length} and ${audit.length}`)
  }
  const auditIdx = sections.indexOf(audit[0])
  if (sections.indexOf(booking[0]) === auditIdx + 1) {
    console.log('already in place, nothing to do')
    return
  }

  const next = sections.filter((s) => s !== booking[0])
  next.splice(next.indexOf(audit[0]) + 1, 0, booking[0])

  console.log('new order:')
  next.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${label(s)}`))
  if (!APPLY) {
    console.log('\ndry run; pass --apply to write')
    return
  }

  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/pricing-booking-higher-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify(page, null, 1))
  console.log('backup', file)

  const res = await client.patch(PAGE).ifRevisionId(page._rev).set({ sections: next }).commit()
  console.log('written, rev', res._rev)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

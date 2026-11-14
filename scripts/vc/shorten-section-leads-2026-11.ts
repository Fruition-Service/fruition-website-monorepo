/**
 * Shortens the section-heading leads (the paragraph to the right of a section title) that ran far past
 * the template's one line. Edward, 14 Nov 2026: "some description on the right of section title is way too
 * long". Template leads are 40 to 110 characters; these were 160 to 418.
 *
 *   npx tsx scripts/vc/shorten-section-leads-2026-11.ts             # dry run
 *   npx tsx scripts/vc/shorten-section-leads-2026-11.ts --apply     # back up, then write
 *   npx tsx scripts/vc/shorten-section-leads-2026-11.ts --restore scripts/sanity-backups/<file>.json --apply
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local', quiet: true })
const APPLY = process.argv.includes('--apply')
const RESTORE = process.argv.includes('--restore') ? process.argv[process.argv.indexOf('--restore') + 1] : null
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>

/** path, section _key, the start of the current lead (so a lead edited since is left alone), the new lead. */
const LEADS: [string, string, string, string][] = [
  ['/integrations/line', 'e2d9e7cf7fc8', 'A friend-add gives you an opaque user ID',
    'A friend-add gives you an opaque user ID. The integration turns it into a customer you can contact.'],
  ['/integrations/line', 'eb69310bcee5', 'If a vendor tells you LINE needs custom work',
    'The gap is real but specific, and it is where most of our clients sit. Checked in September 2026.'],
  ['/integrations/whatsapp', '5d35c9540b12', 'Meta’s Cloud API posts every inbound message',
    'Every inbound message lands on a webhook. What happens next is the integration.'],
  ['/integrations/whatsapp', '3e6f6dacde92', 'Nobody sells you an honest version of this table',
    'Checked against each vendor’s own documentation in September 2026, and re-checked every quarter.'],
  ['/integrations/viber', '0c6e3f82a647', 'Viber has no direct API for brands',
    'Brands reach Viber through an approved partner, and that choice sets your rates and templates.'],
  ['/integrations/viber', 'f6fd5bdfe8d6', 'Every Viber listing on every one of these marketplaces',
    'Every Viber listing on these marketplaces comes from an aggregator or agency. Checked in September 2026.'],
  ['/partnerships/hootsuite-delivery-partner', 'b9959d8c74a9', 'We transform disconnected social media scheduling',
    'Training and implementation that turn scattered scheduling and monitoring into one workflow.'],
  ['/partnerships/clay-partner', '5dc5f03dadc7', 'Clay is a spreadsheet with an API budget attached',
    'Six capability areas: the difference between a clever table and a system your revenue team relies on.'],
]

async function main() {
  if (RESTORE) {
    const backup = JSON.parse(readFileSync(RESTORE, 'utf8')) as { docs: Json[] }
    const tx = client.transaction()
    for (const d of backup.docs) tx.createOrReplace(d as never)
    if (!APPLY) return console.log(`would restore ${backup.docs.length} documents (add --apply)`)
    await tx.commit()
    return console.log(`restored ${backup.docs.length} documents`)
  }
  const paths = [...new Set(LEADS.map((l) => l[0]))]
  const docs = await client.fetch<Json[]>(`*[_type == "vcPage" && path in $paths && !(_id in path("drafts.**"))]`, { paths })
  const tx = client.transaction()
  let n = 0
  for (const [path, key, from, to] of LEADS) {
    const doc = docs.find((d) => d.path === path)
    const sec = (doc?.sections as Json[] | undefined)?.find((s) => s._key === key)
    const lead: string | undefined = sec?.head?.lead
    if (!doc || !sec || !lead) throw new Error(`${path} ${key}: section or lead not found`)
    if (lead === to) { console.log(`${path} ${key}: already short`); continue }
    if (!lead.startsWith(from)) { console.log(`${path} ${key}: lead changed since, skipped`); continue }
    console.log(`${path} ${key}: ${lead.length} -> ${to.length}\n  ${to}`)
    tx.patch(doc._id, (p) => p.set({ [`sections[_key=="${key}"].head.lead`]: to }))
    n++
  }
  if (!APPLY) return console.log(`\ndry run: ${n} leads, add --apply to write`)
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/shorten-section-leads-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs }, null, 2))
  await tx.commit()
  console.log(`\nbacked up to ${file}, ${n} leads written`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

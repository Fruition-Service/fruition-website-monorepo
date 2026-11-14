/**
 * Trims /integrations/{whatsapp,line,viber} to the /integrations page's rhythm.
 *
 * Edward, 14 Nov 2026: the three messaging pages added in PR #517 read as a
 * copy dump (16 sections, nine card grids in a row, a heading-only "engineering
 * problem" callout) and do not fit the other Version C pages. Each page keeps:
 *
 *   hero · the four-step flow (now a numbered vcSteps band, was a card grid)
 *   · "Your stack" · audit band · "What we build" · client quotes · booking
 *   · FAQ · closing
 *
 * and drops the callout, the market figures, the platform rules, "By
 * industry", "What goes wrong", "How we build it" and "The engagement" cards.
 * The dropped copy stays in the backup file this writes before applying.
 *
 *   npx tsx scripts/vc/messaging-pages-trim-2026-11.ts             # dry run: prints the new section list
 *   npx tsx scripts/vc/messaging-pages-trim-2026-11.ts --apply     # back up, then write
 *   npx tsx scripts/vc/messaging-pages-trim-2026-11.ts --restore scripts/sanity-backups/<file>.json --apply
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

const PATHS = ['/integrations/whatsapp', '/integrations/line', '/integrations/viber']

/** Section types every page keeps as they are. */
const KEEP_TYPES = new Set(['vcHero', 'vcAudit', 'vcProof', 'vcBooking', 'vcFaq', 'vcClosing'])

/** The kept card sections, found by badge so a reordered page cannot pick the wrong one. */
const FLOW_BADGES = ['The pipe']
const KEEP_CARD_BADGES = ['Your stack', 'What we build']

function trim(page: Json): { sections: Json[]; dropped: string[] } {
  const out: Json[] = []
  const dropped: string[] = []
  for (const s of page.sections as Json[]) {
    const badge = (s.head?.badge ?? '').trim()
    if (KEEP_TYPES.has(s._type)) {
      out.push(s)
    } else if (s._type === 'vcCards' && FLOW_BADGES.includes(badge)) {
      const items = (s.items ?? []) as Json[]
      // The four-step flow reads as steps, with the progress bar the other pages use.
      out.push({
        _key: s._key,
        _type: 'vcSteps',
        head: s.head,
        layout: items.length === 4 ? 'steps s4' : 'steps',
        tone: s.tone,
        items: items.map((it, i) => ({
          _key: it._key,
          _type: 'vcStep',
          n: it.label || String(i + 1).padStart(2, '0'),
          title: it.title,
          body: it.body,
          bar: Math.round(((i + 1) / items.length) * 100),
        })),
      })
    } else if (s._type === 'vcCards' && KEEP_CARD_BADGES.includes(badge)) {
      const n = (s.items ?? []).length
      // Four cards in a three-column grid leave one alone on the second row.
      out.push(n === 4 && s.layout === 'cards3' ? { ...s, layout: 'cards2' } : s)
    } else {
      dropped.push(`${s._type}${s.layout ? `/${s.layout}` : ''} "${badge}: ${(s.head?.heading ?? '').slice(0, 60)}"`)
    }
  }
  return { sections: out, dropped }
}

async function restore(file: string) {
  const backup = JSON.parse(readFileSync(file, 'utf8')) as { docs: Json[] }
  const tx = client.transaction()
  for (const d of backup.docs) tx.createOrReplace(d as never)
  if (APPLY) {
    await tx.commit()
    console.log(`restored ${backup.docs.length} documents from ${file}`)
  } else console.log(`would restore ${backup.docs.length} documents (add --apply)`)
}

async function main() {
  if (RESTORE) return restore(RESTORE)
  const docs = await client.fetch<Json[]>(`*[_type == "vcPage" && path in $paths && !(_id in path("drafts.**"))]`, { paths: PATHS })
  const tx = client.transaction()
  for (const path of PATHS) {
    const doc = docs.find((d) => d.path === path)
    if (!doc) throw new Error(`no vcPage for ${path}`)
    const { sections, dropped } = trim(doc)
    if (sections.length === doc.sections.length) {
      console.log(`${path}: already trimmed`)
      continue
    }
    console.log(`\n${path}: ${doc.sections.length} -> ${sections.length} sections`)
    for (const s of sections) console.log(`  keep ${s._type}${s.layout ? `/${s.layout}` : ''} ${s.tone ?? ''} ${(s.head?.heading ?? s.heading ?? '').slice(0, 60)}`)
    for (const d of dropped) console.log(`  drop ${d}`)
    tx.patch(doc._id, (p) => p.set({ sections }))
  }
  if (!APPLY) return console.log('\ndry run: add --apply to write')
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/messaging-pages-trim-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs }, null, 2))
  await tx.commit()
  console.log(`\nbacked up to ${file} and applied`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

/**
 * Alternating section backgrounds (Edward, 14 Nov 2026: "Our approach and What we deliver are both white
 * background sections, which is not the correct design theme").
 *
 * Version C alternates white (`plain`) and grey (`alt`) sections. The audit band takes the colour of the
 * section above it (`section:not(.alt) + section.cta-band.alt` is transparent), so on a partner page with
 * no case-study section the band turned white between two white sections. A live check of all 84 vcPages
 * found 17 with two neighbouring sections in the same colour.
 *
 * For each page this finds the fewest tone flips that leave no two neighbouring sections in the same
 * colour. The hero, the section under it, the booking band (dark) and the closing band (accent) keep their
 * colours; the audit band always takes the colour of the section above it, so it is never flipped.
 *
 *   npx tsx scripts/vc/retone-sections-2026-11.ts <path> ...           # dry run (no paths: every vcPage)
 *   npx tsx scripts/vc/retone-sections-2026-11.ts <path> ... --apply   # back up, then write
 *   npx tsx scripts/vc/retone-sections-2026-11.ts --restore scripts/sanity-backups/<file>.json --apply
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

/** Sections that paint their own background whatever their tone. */
const DARK = new Set(['vcBooking', 'vcClosing'])
const toneOf = (s: Json) => (s.tone === 'alt' ? 'alt' : 'plain')

/** Rendered colour of every section for a given tone assignment: the audit band copies the one above it. */
function colours(sections: Json[], tones: ('plain' | 'alt')[]) {
  let prev = 'plain'
  return sections.map((s, i) => {
    if (s._type === 'vcHero') return (prev = 'plain')
    if (DARK.has(s._type)) return (prev = 'dark')
    if (s._type === 'vcAudit') return prev
    return (prev = tones[i])
  })
}

/** Pairs of neighbouring sections in the same colour (the hero and the section under it may match by design). */
function clashes(sections: Json[], tones: ('plain' | 'alt')[]) {
  const c = colours(sections, tones)
  let n = 0
  for (let i = 2; i < c.length; i++) if (c[i] === c[i - 1] && c[i] !== 'dark' && sections[i]._type !== 'vcAudit') n++
  return n
}

/** The fewest tone flips that leave no clash (exhaustive: a page has at most ~16 toned sections). */
export function retone(sections: Json[]): { sections: Json[]; changes: string[] } {
  const base = sections.map(toneOf)
  if (!clashes(sections, base)) return { sections, changes: [] }
  // The section under the hero may flip too, but never to white (it would merge with the white hero).
  const free = sections.map((s, i) => i).filter((i) => i > 0 && !DARK.has(sections[i]._type) && sections[i]._type !== 'vcHero' && sections[i]._type !== 'vcAudit')
  let best: { tones: ('plain' | 'alt')[]; flips: number } | null = null
  for (let mask = 1; mask < 1 << free.length; mask++) {
    const flips = mask.toString(2).replace(/0/g, '').length
    if (best && flips >= best.flips) continue
    const tones = [...base]
    free.forEach((i, k) => { if (mask & (1 << k)) tones[i] = tones[i] === 'alt' ? 'plain' : 'alt' })
    if (tones[1] !== base[1] && tones[1] === 'plain') continue
    if (!clashes(sections, tones)) best = { tones, flips }
  }
  if (!best) throw new Error('no alternating assignment found')
  const changes: string[] = []
  const out = sections.map((s, i) => {
    if (best!.tones[i] === base[i]) return s
    changes.push(`${s._type}[${s.head?.badge ?? s.badge ?? ''}] ${base[i]} -> ${best!.tones[i]}`)
    return { ...s, tone: best!.tones[i] }
  })
  return { sections: out, changes }
}

async function main() {
  if (RESTORE) {
    const backup = JSON.parse(readFileSync(RESTORE, 'utf8')) as { docs: Json[] }
    const tx = client.transaction()
    for (const d of backup.docs) tx.createOrReplace(d as never)
    if (!APPLY) return console.log(`would restore ${backup.docs.length} documents (add --apply)`)
    await tx.commit()
    return console.log(`restored ${backup.docs.length} documents`)
  }
  // Only the pages the live check flagged (a few section types paint their own background, so the
  // tone model is checked against the rendered page, not trusted site-wide).
  const only = process.argv.slice(2).filter((a) => a.startsWith('/'))
  const docs = await client.fetch<Json[]>(`*[_type == "vcPage" && !(_id in path("drafts.**")) && (count($only) == 0 || path in $only)] | order(path asc)`, { only })
  const tx = client.transaction()
  const touched: Json[] = []
  for (const d of docs) {
    const { sections, changes } = retone(d.sections ?? [])
    if (!changes.length) continue
    touched.push(d)
    console.log(`${d.path}\n  ${changes.join('\n  ')}`)
    tx.patch(d._id, (p) => p.set({ sections }))
  }
  console.log(`\n${touched.length} pages to retone`)
  if (!APPLY) return console.log('dry run: add --apply to write')
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/retone-sections-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs: touched }, null, 2))
  await tx.commit()
  console.log(`backed up to ${file} and applied`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

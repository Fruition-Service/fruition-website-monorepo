/**
 * Home hero (/): swap the "Copilot" platform pill for ElevenLabs.
 *
 * The hero network is a vcNode tree on `vcPage-home` (section 0, `stage`). The
 * pill is a `div.hn-pill` holding an `img` node and a `#text` node. This script
 * uploads public/images/home/logos/elevenlabs.svg (the simple-icons mark, CC0)
 * and points the pill's image and label at it. Edward asked for it on 13 Nov 2026.
 *
 *   npx tsx scripts/vc/home-hero-elevenlabs.ts           # dry run
 *   npx tsx scripts/vc/home-hero-elevenlabs.ts --apply   # write
 *
 * Re-runnable: finds the pill by its label (Copilot or ElevenLabs), not by key.
 */
import { readFileSync } from 'node:fs'
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

const PAGE_ID = 'vcPage-home'
const LABEL = 'ElevenLabs'
const LOGO = 'public/images/home/logos/elevenlabs.svg'

type VcNode = { _key: string; tag?: string; text?: string; className?: string; children?: VcNode[] }

/** Path to the hn-pill whose text is Copilot or ElevenLabs, as Sanity key selectors. */
function findPill(nodes: VcNode[], path: string): { path: string; pill: VcNode } | null {
  for (const n of nodes) {
    const here = `${path}[_key=="${n._key}"]`
    const kids = n.children ?? []
    if (n.className?.split(' ').includes('hn-pill') && kids.some((k) => k.tag === '#text' && /^(copilot|elevenlabs)$/i.test(k.text ?? ''))) {
      return { path: here, pill: n }
    }
    const hit = findPill(kids, `${here}.children`)
    if (hit) return hit
  }
  return null
}

async function main() {
  const doc = await client.getDocument(PAGE_ID)
  if (!doc) throw new Error(`${PAGE_ID} not found`)
  const hero = doc.sections?.[0]
  if (hero?._type !== 'vcHero') throw new Error('section 0 is not the hero')
  const hit = findPill(hero.stage ?? [], `sections[_key=="${hero._key}"].stage`)
  if (!hit) throw new Error('Copilot/ElevenLabs pill not found in the hero')
  const img = hit.pill.children!.find((k) => k.tag === 'img')!
  const text = hit.pill.children!.find((k) => k.tag === '#text')!
  console.log(`pill: ${hit.path}\n  label "${text.text}" -> "${LABEL}"`)
  if (!APPLY) return console.log('dry run; pass --apply to write')

  const asset = await client.assets.upload('image', readFileSync(LOGO), { filename: 'elevenlabs.svg', contentType: 'image/svg+xml' })
  await client
    .patch(PAGE_ID)
    .set({
      [`${hit.path}.children[_key=="${text._key}"].text`]: LABEL,
      [`${hit.path}.children[_key=="${img._key}"].image`]: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    })
    .commit()
  console.log(`done: ${asset._id}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

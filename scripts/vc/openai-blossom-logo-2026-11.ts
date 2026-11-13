/**
 * Swap the old, broken OpenAI knot for the current (2025) bold blossom mark.
 *
 * The OpenAI SVG used in the nav (siteSettings, 24x24 asset) and the home hero
 * pill (vcPage-home, 256x260 asset) had a malformed path: its right-hand loops
 * rendered as broken slivers, so the logo looked cut off. Edward asked on
 * 13 Nov 2026 for the newer logo. public/images/home/logos/openai.svg is a
 * potrace trace of the current brand mark; this script uploads it, repoints
 * every reference to the two old assets at it, and sets it as the OpenAI
 * partner's `mark` (square icon) so registry-driven tiles get it too. The
 * partner's `logo` is a wordmark slot, so it is left alone.
 *
 *   npx tsx scripts/vc/openai-blossom-logo-2026-11.ts           # dry run
 *   npx tsx scripts/vc/openai-blossom-logo-2026-11.ts --apply   # write
 *
 * Re-runnable: once no document references the old assets it only re-sets the
 * partner fields. Backs up every document it touches to scripts/sanity-backups.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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
  perspective: 'raw',
})

const OLD = [
  'image-338451bfa75fb3e58bec2d0d0295db8a62430552-24x24-svg',
  'image-6794ffe8030e83074787fa7620f300a1e9cf7887-256x260-svg',
]
const LOGO = 'public/images/home/logos/openai.svg'
const PARTNER_ID = 'partner-openai'

type Json = unknown
/** Paths (Sanity patch syntax) of every asset reference to an OLD id. */
function findRefs(node: Json, path: string, out: string[]): void {
  if (Array.isArray(node)) {
    node.forEach((v, i) => {
      const key = (v as { _key?: string })?._key
      findRefs(v, key ? `${path}[_key=="${key}"]` : `${path}[${i}]`, out)
    })
  } else if (node && typeof node === 'object') {
    const o = node as Record<string, Json>
    if (typeof o._ref === 'string' && OLD.includes(o._ref)) out.push(`${path}._ref`)
    for (const [k, v] of Object.entries(o)) if (!k.startsWith('_')) findRefs(v, path ? `${path}.${k}` : k, out)
  }
}

async function main() {
  const docs: Array<Record<string, Json> & { _id: string }> = await client.fetch(`*[references($ids)]`, { ids: OLD })
  const plan = docs.map((d) => {
    const refs: string[] = []
    findRefs(d, '', refs)
    return { doc: d, refs }
  })
  for (const p of plan) console.log(`${p.doc._id}: ${p.refs.length} ref(s)\n  ${p.refs.join('\n  ')}`)
  console.log(`${PARTNER_ID}: set mark`)
  if (!APPLY) return console.log('dry run; pass --apply to write')

  const partner = await client.getDocument(PARTNER_ID)
  mkdirSync('scripts/sanity-backups', { recursive: true })
  writeFileSync(
    `scripts/sanity-backups/openai-blossom-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
    JSON.stringify([...docs, partner], null, 1),
  )

  const asset = await client.assets.upload('image', readFileSync(LOGO), { filename: 'openai-blossom.svg', contentType: 'image/svg+xml' })
  const tx = client.transaction()
  for (const p of plan) tx.patch(p.doc._id, (q) => q.set(Object.fromEntries(p.refs.map((r) => [r, asset._id]))))
  const img = (alt: string) => ({ _type: 'image', alt, asset: { _type: 'reference', _ref: asset._id } })
  tx.patch(PARTNER_ID, (q) => q.set({ mark: img('OpenAI') }))
  await tx.commit()
  console.log(`done: ${asset._id}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

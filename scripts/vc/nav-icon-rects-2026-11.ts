/**
 * Three menu icons drew a <rect> with no width or height, so only part of each shape rendered
 * (construction showed its window dots, careers and professional services a bare handle). Edward, 14 Nov
 * 2026. The source files in scripts/nav-icons are fixed; this uploads them and repoints every Sanity
 * reference to the old uploads (the menu in siteSettings.navigation and anywhere else they are used).
 *
 *   npx tsx scripts/vc/nav-icon-rects-2026-11.ts            # dry run
 *   npx tsx scripts/vc/nav-icon-rects-2026-11.ts --apply    # back up, upload, repoint
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
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
const NAMES = ['careers', 'construction', 'professional-services']
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any

/** Paths (Sanity patch syntax) of every reference to one of `ids` inside a document. */
function findRefs(node: Json, ids: string[], path: string, out: string[]) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => findRefs(v, ids, `${path}[${v && typeof v === 'object' && v._key ? `_key=="${v._key}"` : i}]`, out))
  } else if (node && typeof node === 'object') {
    if (typeof node._ref === 'string' && ids.includes(node._ref)) out.push(`${path}._ref`)
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('_')) findRefs(v, ids, path ? `${path}.${k}` : k, out)
  }
}

async function main() {
  const assets: { _id: string; originalFilename: string }[] = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename in $files]{_id, originalFilename}`,
    { files: NAMES.map((n) => `${n}.svg`) },
  )
  const byName = new Map(NAMES.map((n) => [n, assets.filter((a) => a.originalFilename === `${n}.svg`).map((a) => a._id)]))
  const oldIds = assets.map((a) => a._id)
  const docs: Json[] = await client.fetch(`*[references($ids)]`, { ids: oldIds })
  for (const [n, ids] of byName) console.log(`${n}: ${ids.length} old upload(s) ${ids.join(', ')}`)
  for (const d of docs) {
    const refs: string[] = []
    findRefs(d, oldIds, '', refs)
    console.log(`${d._id}: ${refs.length} reference(s)`)
  }
  if (!APPLY) return console.log('dry run: add --apply')
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/nav-icon-rects-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify({ docs }, null, 2))
  const newId = new Map<string, string>()
  for (const n of NAMES) {
    const a = await client.assets.upload('image', readFileSync(`scripts/nav-icons/${n}.svg`), { filename: `${n}.svg`, contentType: 'image/svg+xml' })
    for (const old of byName.get(n) ?? []) newId.set(old, a._id)
    console.log(`${n} -> ${a._id}`)
  }
  for (const d of docs) {
    const set: Record<string, string> = {}
    // Repoint every reference to an old upload at its fixed replacement.
    const walk = (node: Json, path: string) => {
      if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${path}[${v && typeof v === 'object' && v._key ? `_key=="${v._key}"` : i}]`))
      else if (node && typeof node === 'object') {
        if (typeof node._ref === 'string' && newId.has(node._ref)) set[`${path}._ref`] = newId.get(node._ref)!
        for (const [k, v] of Object.entries(node)) if (!k.startsWith('_')) walk(v, path ? `${path}.${k}` : k)
      }
    }
    walk(d, '')
    await client.patch(d._id).set(set).commit()
    console.log(`patched ${d._id}: ${Object.keys(set).length}`)
  }
  console.log(`backup: ${file}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

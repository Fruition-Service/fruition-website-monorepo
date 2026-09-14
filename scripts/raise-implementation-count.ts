/**
 * Finish the 500+ → 900+ implementation-count raise across the Sanity dataset.
 *
 *   npx tsx scripts/raise-implementation-count.ts            # dry run
 *   npx tsx scripts/raise-implementation-count.ts --apply    # backs up, then writes
 *   npx tsx scripts/raise-implementation-count.ts --restore scripts/stat-backups/<file>.json
 *
 * The 2026-09-14 sweep behind #210 patched most of the dataset but missed
 * every string nested inside an object field — including the region pages'
 * `numbers.stats[].value` and `process.lead`, which had moved into nested
 * objects hours earlier (#209). This walks every string in every document.
 *
 * NOT every "500+" is Fruition's count. These are left alone:
 *   - anything inside a larger number (1,500+ onboarding fees, 1,500+ employees)
 *   - dollar amounts (USD 165 to USD 500+)
 *   - third-party product facts (n8n's 500+ integrations, monday Service's
 *     500+ hubs, "500+ apps" on the n8n partner page)
 * Everything else is a Fruition project/client/organisation count.
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'

const BACKUP_DIR = path.join(__dirname, 'stat-backups')

/** A bare 500+ — never one inside 1,500+ or 2500+. */
const BARE = /(?<![\d,])500\+/g

/** Contexts where 500+ is not Fruition's count. Tested against ±70 chars. */
const NOT_OURS =
  /500\+\s*(native\s+)?(integrations|apps|hubs|applications)|USD\s*500\+|\$\s*500\+/i

function raise(value: string): string {
  let out = ''
  let last = 0
  for (const m of value.matchAll(BARE)) {
    const i = m.index!
    const ctx = value.slice(Math.max(0, i - 70), i + m[0].length + 70)
    out += value.slice(last, i) + (NOT_OURS.test(ctx) ? m[0] : '900+')
    last = i + m[0].length
  }
  return out + value.slice(last)
}

type Json = string | number | boolean | null | Json[] | { [k: string]: Json }

/** Rewrite every string in the document tree, counting the edits. */
function walk(node: Json, hits: { n: number }): Json {
  if (typeof node === 'string') {
    const next = raise(node)
    if (next !== node) hits.n++
    return next
  }
  if (Array.isArray(node)) return node.map((v) => walk(v, hits))
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, k.startsWith('_') ? v : walk(v, hits)]),
    ) as Json
  }
  return node
}

async function main() {
  const apply = process.argv.includes('--apply')
  const restoreIdx = process.argv.indexOf('--restore')

  if (restoreIdx !== -1) {
    const file = process.argv[restoreIdx + 1]
    const docs = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<Record<string, unknown>>
    for (const doc of docs) await writeClient.createOrReplace(doc as never)
    console.log(`↩️  restored ${docs.length} documents from ${file}`)
    return
  }

  // Fetch everything and filter locally: 500+ hides inside portable-text
  // blocks and nested objects that no GROQ text filter reaches reliably.
  const docs: Array<Record<string, Json>> = await writeClient.fetch(
    `*[!(_id in path("drafts.**"))] | order(_id asc)`,
  )

  const touched: Array<{ doc: Record<string, Json>; next: Record<string, Json>; n: number }> = []
  for (const doc of docs) {
    const hits = { n: 0 }
    const next = walk(doc as Json, hits) as Record<string, Json>
    if (hits.n > 0) touched.push({ doc, next, n: hits.n })
  }

  const total = touched.reduce((s, t) => s + t.n, 0)
  console.log(`${touched.length} documents, ${total} strings to raise\n`)
  for (const t of touched) {
    console.log(`  ${String(t.doc._type).padEnd(28)} ${t.doc._id}  (${t.n})`)
  }

  if (!apply) {
    console.log('\nDry run — re-run with --apply to write.')
    return
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(
    BACKUP_DIR,
    `pre-900-raise-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  )
  fs.writeFileSync(file, JSON.stringify(touched.map((t) => t.doc), null, 2))
  console.log(`\n💾 backup → ${file}`)

  let tx = writeClient.transaction()
  for (const t of touched) tx = tx.createOrReplace(t.next as never)
  await tx.commit()
  console.log(`✅ raised ${total} strings across ${touched.length} documents`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

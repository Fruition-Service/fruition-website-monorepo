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

interface Edit {
  /** Sanity patch path, e.g. `numbers.stats[_key=="stat-3"].value`. */
  path: string
  from: string
  to: string
}

/**
 * Collect one edit per string that needs raising, addressed by a Sanity patch
 * path. Array items are addressed by `_key` where they have one (stable across
 * concurrent edits) and by index only where they don't — plain string arrays
 * and table cells.
 *
 * Targeted patches rather than createOrReplace: the write token is editor-role
 * (replacing a whole document wants `manage`), and another session has been
 * editing this dataset, so touching only the strings that change is safer.
 */
function collect(node: Json, path: string, out: Edit[]): void {
  if (typeof node === 'string') {
    const next = raise(node)
    if (next !== node) out.push({ path, from: node, to: next })
    return
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      const key =
        item && typeof item === 'object' && !Array.isArray(item)
          ? (item as Record<string, Json>)._key
          : undefined
      const seg = typeof key === 'string' ? `[_key=="${key}"]` : `[${i}]`
      collect(item, `${path}${seg}`, out)
    })
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('_')) continue
      collect(v, path ? `${path}.${k}` : k, out)
    }
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const restoreIdx = process.argv.indexOf('--restore')

  if (restoreIdx !== -1) {
    const file = process.argv[restoreIdx + 1]
    const undo = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{
      _id: string
      path: string
      from: string
    }>
    const byDoc = new Map<string, Record<string, string>>()
    for (const e of undo) {
      const set = byDoc.get(e._id) ?? {}
      set[e.path] = e.from
      byDoc.set(e._id, set)
    }
    for (const [id, set] of byDoc) await writeClient.patch(id).set(set).commit()
    console.log(`↩️  reverted ${undo.length} edits across ${byDoc.size} documents from ${file}`)
    return
  }

  // Fetch everything and filter locally: 500+ hides inside portable-text
  // blocks and nested objects that no GROQ text filter reaches reliably.
  const docs: Array<Record<string, Json>> = await writeClient.fetch(
    // Content documents only. `system.schema` holds the deployed Studio schema
    // (which quotes the figure in a docblock) and is redeployed from code, not
    // patched — and patching it needs `manage`, which the write token lacks.
    `*[!(_id in path("drafts.**")) && !(_type match "system.*") && !(_type match "sanity.*")] | order(_id asc)`,
  )

  const touched: Array<{ doc: Record<string, Json>; edits: Edit[] }> = []
  for (const doc of docs) {
    const edits: Edit[] = []
    collect(doc as Json, '', edits)
    if (edits.length) touched.push({ doc, edits })
  }

  const total = touched.reduce((s, t) => s + t.edits.length, 0)
  console.log(`${touched.length} documents, ${total} strings to raise\n`)
  for (const t of touched) {
    console.log(`  ${String(t.doc._type).padEnd(28)} ${t.doc._id}  (${t.edits.length})`)
    if (process.argv.includes('--verbose')) {
      for (const e of t.edits) console.log(`      ${e.path}`)
    }
  }

  if (!apply) {
    console.log('\nDry run — re-run with --apply to write.')
    return
  }

  // Back up the individual edits, not whole documents: restoring a whole
  // document would also roll back anything else edited since, and the six
  // pages here are edited by other people while this runs.
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
  const file = path.join(
    BACKUP_DIR,
    `pre-900-raise-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  )
  const undo = touched.flatMap((t) =>
    t.edits.map((e) => ({ _id: t.doc._id as string, path: e.path, from: e.from, to: e.to })),
  )
  fs.writeFileSync(file, JSON.stringify(undo, null, 2))
  console.log(`\n💾 backup → ${file} (${undo.length} edits)`)

  let done = 0
  for (const t of touched) {
    const set: Record<string, string> = {}
    for (const e of t.edits) set[e.path] = e.to
    await writeClient.patch(t.doc._id as string).set(set).commit()
    done += t.edits.length
    console.log(`   ✅ ${t.doc._id} (${t.edits.length})`)
  }
  console.log(`\n✅ raised ${done} strings across ${touched.length} documents`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

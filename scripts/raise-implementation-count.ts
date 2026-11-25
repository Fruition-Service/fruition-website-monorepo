/**
 * OPTIONAL Studio tidy-up: replace hard-coded implementation counts in the
 * Sanity dataset ("900+", "700+", "1,000+", ...) with the {{implementations}}
 * token.
 *
 * The live site does not need this. Every CMS read already swaps old counts
 * for the current value (src/lib/implementationCount.ts, wired in
 * src/sanity/client.ts). Running it only makes Studio show the token, so
 * editors see that the figure is managed in one place.
 *
 *   npx tsx scripts/raise-implementation-count.ts            # dry run
 *   npx tsx scripts/raise-implementation-count.ts --apply    # backs up, then writes
 *   npx tsx scripts/raise-implementation-count.ts --restore scripts/stat-backups/<file>.json
 *
 * Walks every string in every published document, including strings nested
 * inside objects and portable text, and writes targeted `set` patches to the
 * published documents. Documents with an open draft are listed; their draft
 * keeps the old text until someone publishes or discards it.
 *
 * Figures that are not Fruition's count are left alone: larger numbers
 * (1,900+), prices ($900+) and other products' figures (1000+ apps). Prose
 * such as "over 900 implementations" is also left as is; the read layer
 * keeps it current.
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'
import { tokeniseImplementationCount } from '../src/lib/implementationCount'

const BACKUP_DIR = path.join(__dirname, 'stat-backups')

const raise = tokeniseImplementationCount

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
  console.log(`${touched.length} documents, ${total} strings to tokenise\n`)
  for (const t of touched) {
    console.log(`  ${String(t.doc._type).padEnd(28)} ${t.doc._id}  (${t.edits.length})`)
    if (process.argv.includes('--verbose')) {
      for (const e of t.edits) console.log(`      ${e.path}`)
    }
  }

  const draftIds: string[] = await writeClient.fetch(`*[_id in path("drafts.**")]._id`)
  const withDraft = touched.filter((t) => draftIds.includes(`drafts.${t.doc._id}`))
  if (withDraft.length) {
    console.log(`\n⚠️  ${withDraft.length} of these have an open draft that keeps the old figure:`)
    for (const t of withDraft) console.log(`      drafts.${t.doc._id}`)
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
    `pre-count-token-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
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
  console.log(`\n✅ tokenised ${done} strings across ${touched.length} documents`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

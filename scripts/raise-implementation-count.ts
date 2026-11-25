/**
 * Raise Fruition's implementation/client count across the Sanity dataset.
 * Current raise (2026-11-25): every "900+" and "700+" becomes "1000+", and
 * prose "over 900" / "more than 900" becomes "over 1,000" / "more than 1,000".
 * (The previous run, 2026-09-14, took 500+ to 900+.)
 *
 *   npx tsx scripts/raise-implementation-count.ts            # dry run
 *   npx tsx scripts/raise-implementation-count.ts --apply    # backs up, then writes
 *   npx tsx scripts/raise-implementation-count.ts --restore scripts/stat-backups/<file>.json
 *
 * Walks every string in every published document, including strings nested
 * inside objects and portable text. Writes go straight to the published
 * documents (targeted `set` patches), so the site picks them up through the
 * Sanity webhook in about two minutes. Documents with an open draft are
 * listed; their draft keeps the old figure until someone publishes or
 * discards it, so check those by hand.
 *
 * NOT every match is Fruition's count. These are left alone:
 *   - anything inside a larger number (1,900+, 2700+)
 *   - dollar amounts ($900+, USD 700+)
 *   - third-party product facts (700+ integrations, 900+ apps, ...)
 *   - a bare "700" or "900" without "+", which in old blog posts is a dated
 *     historical figure ("Platinum in 2026 with 700 clients")
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from './sanity-migrate/lib'

const BACKUP_DIR = path.join(__dirname, 'stat-backups')

const TO = '1000+'

/** A bare 900+ or 700+ — never one inside 1,900+ or 2700+. */
const BARE = /(?<![\d,.])(?:900|700)\+/g

/** "over 900 implementations" style prose, without the plus. */
const PROSE = /\b(over|more than)( )(?:900|700)\b(?![\d,+])/gi

/** Contexts where the match is not Fruition's count. Tested against ±70 chars. */
const NOT_OURS =
  /(?:900|700)\+?\s*(native\s+)?(integrations|apps|hubs|applications|templates|connectors)|USD\s*(?:900|700)|\$\s*(?:900|700)/i

function replaceOurs(value: string, re: RegExp, to: (m: RegExpMatchArray) => string): string {
  let out = ''
  let last = 0
  for (const m of value.matchAll(re)) {
    const i = m.index!
    const ctx = value.slice(Math.max(0, i - 70), i + m[0].length + 70)
    out += value.slice(last, i) + (NOT_OURS.test(ctx) ? m[0] : to(m))
    last = i + m[0].length
  }
  return out + value.slice(last)
}

function raise(value: string): string {
  const plus = replaceOurs(value, BARE, () => TO)
  return replaceOurs(plus, PROSE, (m) => `${m[1]}${m[2]}1,000`)
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
    `pre-1000-raise-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
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

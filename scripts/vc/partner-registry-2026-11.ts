/**
 * Partners & badges migration (13 Nov 2026).
 *
 *   npx tsx scripts/vc/partner-registry-2026-11.ts          # dry run: prints the partners and every link it would make
 *   npx tsx scripts/vc/partner-registry-2026-11.ts --apply  # backs up, creates the partner documents, links the images
 *
 * Creates one `partner` document per technology partner (id partner-<key>)
 * with its badge, logo and mark, taken from the images the pages already use
 * (the most used one wins; the duplicates are identical re-uploads). Then
 * every partner badge, logo, directory tile, tool card and markup image on
 * every Version C page gets `partner` + `partnerImage`, so the page shows the
 * partner's current image. Each item keeps its own image as the fallback.
 * Client logos are left alone. Re-runnable.
 *
 * Rollback: --restore <backup.json> (puts the pages back; partner docs stay, unused)
 */
import fs from 'node:fs'
import path from 'node:path'
import { writeClient } from '../sanity-migrate/lib'
import { PARTNER_RULES, partnerKeyFor } from './partner-keys'

type Role = 'badge' | 'logo' | 'mark'
/** Plain wordmarks (not badges, not square marks). */
const WORDMARKS = new Set(['8f1f0139', '3f437cf1', 'ba0fde69', '2701458b'])
const short = (ref: string) => ref.replace('image-', '').slice(0, 8)
/**
 * Assets whose label is wrong or whose crop differs: the Advanced Delivery
 * badge labelled "monday.com Platinum Partner" on the monday page, and the
 * home row's tight-cropped Google Cloud badge (kept as Google Cloud's logo so
 * the home row keeps its look).
 */
const ASSET_OVERRIDES: Record<string, [string, Role]> = {
  ec19782d: ['monday-advanced-delivery', 'badge'],
  '8553f855': ['google-cloud', 'logo'],
}

function roleOf(ref: string, shape?: string): Role {
  if (WORDMARKS.has(short(ref))) return 'logo'
  const m = ref.match(/-(\d+)x(\d+)-([a-z]+)$/)
  if (shape === 'mk') return 'mark'
  if (m && m[1] === m[2] && (m[3] === 'svg' ? Number(m[1]) <= 256 : Number(m[1]) <= 48)) return 'mark'
  return 'badge'
}

interface Item { page: string; docId: string; node: any; field: 'image' | 'logo'; key: string; role: Role; ref: string; label: string }

function collect(docs: any[]): Item[] {
  const items: Item[] = []
  for (const d of docs) {
    const visit = (o: any) => {
      if (Array.isArray(o)) return o.forEach(visit)
      if (!o || typeof o !== 'object') return
      const t = o._type
      let label: string | undefined, href: string | undefined, img: any, field: 'image' | 'logo' | undefined, shape: string | undefined
      if (t === 'vcLogo') { label = o.alt; img = o.image; field = 'image'; shape = o.shape }
      if (t === 'vcTile' || t === 'vcTool') { label = o.title; href = o.href; img = o.logo; field = 'logo'; shape = o.logoShape }
      if (t === 'vcNode' && o.tag === 'img') { label = o.image?.alt; img = o.image; field = 'image' }
      const ref = img?.asset?._ref
      const key = ref ? partnerKeyFor(label, href) : null
      const ov = ref ? ASSET_OVERRIDES[short(ref)] : undefined
      if ((key || ov) && field) items.push({ page: d.path, docId: d._id, node: o, field, key: ov?.[0] ?? key!, role: ov?.[1] ?? roleOf(ref, shape), ref, label: label || '' })
      for (const [k, v] of Object.entries(o)) if (k !== '_type' && k !== 'partner') visit(v)
    }
    visit(d.sections)
  }
  return items
}

async function main() {
  const args = process.argv.slice(2)
  const r = args.indexOf('--restore')
  if (r !== -1) {
    const snap = JSON.parse(fs.readFileSync(args[r + 1], 'utf8'))
    for (const d of snap) await writeClient.patch(d._id).set({ sections: d.sections }).commit()
    return console.log(`Restored ${snap.length} pages.`)
  }
  const apply = args.includes('--apply')
  const docs = await writeClient.fetch<any[]>(`*[_type == "vcPage" && !(_id in path("drafts.**"))]{ _id, _rev, path, sections }`)
  const original = JSON.parse(JSON.stringify(docs))
  const items = collect(docs)

  // Canonical image per partner and role: the most used one.
  const tally: Record<string, Record<Role, Map<string, { n: number; labels: Map<string, number> }>>> = {}
  for (const it of items) {
    const t = (tally[it.key] ||= { badge: new Map(), logo: new Map(), mark: new Map() })
    const e = t[it.role].get(it.ref) || { n: 0, labels: new Map() }
    e.n++
    e.labels.set(it.label, (e.labels.get(it.label) || 0) + 1)
    t[it.role].set(it.ref, e)
  }
  // An asset that is one partner's top badge belongs to that partner (e.g. the
  // Advanced Delivery badge labelled "monday.com Platinum Partner" on one hero).
  const topBadge = new Map<string, string>()
  for (const [key, t] of Object.entries(tally)) {
    const best = [...t.badge.entries()].sort((a, b) => b[1].n - a[1].n)[0]
    if (best) topBadge.set(best[0], key)
  }
  for (const it of items) {
    const owner = topBadge.get(it.ref)
    if (owner && owner !== it.key && !ASSET_OVERRIDES[short(it.ref)]) { it.key = owner; it.role = 'badge' }
  }

  const partnerDocs = PARTNER_RULES.filter((p) => tally[p.key]).map((p) => {
    const t = tally[p.key]
    const best = (role: Role) => {
      const e = [...t[role].entries()].filter(([ref]) => role !== 'badge' || !topBadge.has(ref) || topBadge.get(ref) === p.key).sort((a, b) => b[1].n - a[1].n)[0]
      if (!e) return undefined
      const labels = [...e[1].labels.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l)
      const alt = role === 'badge' ? labels.find((l) => /partner|agency/i.test(l)) || labels[0] : p.name
      return { _type: 'image', alt, asset: { _type: 'reference', _ref: e[0] } }
    }
    return {
      _id: `partner-${p.key}`,
      _type: 'partner',
      name: p.name,
      key: { _type: 'slug', current: p.key },
      ...(p.href ? { href: p.href } : {}),
      ...(best('badge') ? { badge: best('badge') } : {}),
      ...(best('logo') ? { logo: best('logo') } : {}),
      ...(best('mark') ? { mark: best('mark') } : {}),
    }
  })

  for (const p of partnerDocs) console.log(`${p._id.padEnd(34)} badge=${p.badge ? short(p.badge.asset._ref) + ' "' + p.badge.alt + '"' : '-'}  logo=${p.logo ? short(p.logo.asset._ref) : '-'}  mark=${p.mark ? short(p.mark.asset._ref) : '-'}`)
  // A link whose partner has no image for its role falls back to the badge.
  const has = new Map(partnerDocs.map((p) => [p._id, p]))
  const byPage = new Map<string, number>()
  for (const it of items) {
    const p: any = has.get(`partner-${it.key}`)
    if (!p?.[it.role]) it.role = p?.badge ? 'badge' : p?.logo ? 'logo' : 'mark'
    it.node.partner = { _type: 'reference', _ref: `partner-${it.key}` }
    it.node.partnerImage = it.role
    byPage.set(it.page, (byPage.get(it.page) || 0) + 1)
  }
  console.log(`\n${items.length} images linked on ${byPage.size} pages:`)
  for (const [pg, n] of [...byPage.entries()].sort()) console.log(`  ${String(n).padStart(3)}  ${pg}`)
  const changed = items.filter((it) => short(it.ref) !== short((has.get(`partner-${it.key}`) as any)?.[it.role]?.asset?._ref || it.ref))
  console.log(`\n${changed.length} images will display a different (canonical) file:`)
  for (const it of changed) console.log(`  ${it.page}  ${it.label} [${it.role}] ${short(it.ref)} -> ${short((has.get(`partner-${it.key}`) as any)[it.role].asset._ref)}`)

  if (!apply) return console.log('\nDry run. Add --apply to write.')

  const dir = path.join(process.cwd(), 'scripts/sanity-backups')
  fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `partner-registry-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  const touched = new Set(items.map((i) => i.docId))
  fs.writeFileSync(file, JSON.stringify(original.filter((d: any) => touched.has(d._id)).map((d: any) => ({ _id: d._id, sections: d.sections })), null, 1))
  console.log(`Backup: ${file}`)
  for (const p of partnerDocs) {
    await writeClient.createIfNotExists({ _id: p._id, _type: 'partner', name: p.name, key: p.key })
    const { _id, _type, ...fields } = p
    await writeClient.patch(_id).set(fields).commit()
  }
  console.log(`Partners written: ${partnerDocs.length}`)
  for (const d of docs) {
    if (!touched.has(d._id)) continue
    await writeClient.patch(d._id).ifRevisionId(d._rev).set({ sections: d.sections }).commit()
  }
  console.log(`Pages updated: ${touched.size}`)
  console.log(`Rollback: npx tsx scripts/vc/partner-registry-2026-11.ts --restore ${path.relative(process.cwd(), file)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

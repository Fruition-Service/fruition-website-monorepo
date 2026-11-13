/**
 * Retire the 12 /ai-use-cases/<industry> pages (Edward, 13 Nov 2026).
 *
 * What it changes in the production dataset:
 *   1. The 12 industry pages' hand-built use case cards (a `vcCards` section
 *      badged "Use case catalogue", `items` linking to /ai-use-cases/<slug>#uc-...)
 *      become a `vcUseCases` section in the same slot, same `_key`, same
 *      `head` (heading, badge and lead untouched, so no SEO-held heading
 *      changes), with `source` set to the page path, anchor `ai-use-cases`
 *      (the 301 target) and the "See all" button. The cards then come from
 *      public/data/ai-use-cases through getFeaturedUseCases, so they follow the
 *      catalogue and link "See the build" into the hub. The sections sit inside
 *      the industry group's template, so they are not page-specific.
 *   2. Any other string pointing at /ai-use-cases/<slug>[#uc-...] (the solar,
 *      energy, hospitality and media pages' cards, the nav feature slides in
 *      siteSettings) is rewritten: builds open in the hub with the industry
 *      preselected, industries go to their page's #ai-use-cases section.
 *
 *   npx tsx scripts/vc/retire-ai-use-case-pages-2026-11.ts              # dry run
 *   npx tsx scripts/vc/retire-ai-use-case-pages-2026-11.ts --apply      # write (backs up first)
 *   npx tsx scripts/vc/retire-ai-use-case-pages-2026-11.ts --restore scripts/sanity-backups/<file>.json
 *
 * Re-runnable: converted sections and rewritten links are skipped.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { LANDING_PAGE_USE_CASES, pickFeaturedUseCases } from '../../src/features/ai-use-cases/featured'
import { caseAnchorHref, industryHref, type IndustryUseCases, type UseCaseIndex } from '../../src/features/ai-use-cases/types'

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

/** The 12 industry pages that carry the section (solar has its own cards and only gets its links rewritten). */
const CONVERT_PATHS = [
  '/monday-for-construction', '/industries/education', '/industries/nonprofits', '/industries/financial-services',
  '/monday-for-government', '/industries/healthcare', '/industries/transport-logistics', '/monday-for-manufacturing',
  '/monday-for-professional-services', '/monday-for-real-estate', '/monday-for-retail', '/industries/technology-saas',
]
const KEEP = new Set(['_key', 'tone', 'sectionClass', 'pageSpecific', 'pageSpecificNote', 'head'])
const OLD_LINK = /^\/ai-use-cases\/([a-z-]+)(?:#(uc-[\w-]+))?$/

type Json = Record<string, any>
const readJson = <T>(f: string) => JSON.parse(readFileSync(`public/data/ai-use-cases/${f}`, 'utf8')) as T
const index = readJson<UseCaseIndex>('index.json')
const bySlug = new Map(index.industries.map((i) => [i.slug, i]))

function rewriteLink(href: string): string | null {
  const m = OLD_LINK.exec(href)
  if (!m) return null
  const ind = bySlug.get(m[1])
  if (!ind) return null
  return m[2] ? caseAnchorHref(ind.key, m[2]) : industryHref(ind)
}

/** Every string under `o` that is an old catalogue link, with its keyed Sanity path. */
function oldLinks(o: unknown, path: string, out: { path: string; from: string; to: string }[]) {
  if (typeof o === 'string') {
    const to = rewriteLink(o)
    if (to) out.push({ path, from: o, to })
  } else if (Array.isArray(o)) {
    o.forEach((v, i) => oldLinks(v, `${path}[${v && typeof v === 'object' && v._key ? `_key=="${v._key}"` : i}]`, out))
  } else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) oldLinks(v, path ? `${path}.${k}` : k, out)
  }
}

async function restore(file: string) {
  const backup = JSON.parse(readFileSync(file, 'utf8')) as { docs: Json[] }
  const tx = client.transaction()
  for (const d of backup.docs) tx.createOrReplace(d as any)
  if (APPLY || process.argv.includes('--yes')) {
    await tx.commit()
    console.log(`restored ${backup.docs.length} documents from ${file}`)
  } else console.log(`would restore ${backup.docs.length} documents (add --apply)`)
}

async function main() {
  if (RESTORE) return restore(RESTORE)

  const docs = await client.fetch<Json[]>(`*[!(_type match "system.*") && !(_id in path("drafts.**"))]`)
  const pages = new Map(docs.filter((d) => d._type === 'vcPage').map((d) => [d.path as string, d]))

  const patches: { id: string; set: Record<string, unknown> }[] = []
  const touched = new Set<string>()
  const report: string[] = []

  // 1. Convert the use case cards on the 12 pages.
  for (const path of CONVERT_PATHS) {
    const page = pages.get(path)
    if (!page) throw new Error(`no vcPage for ${path}`)
    const src = (LANDING_PAGE_USE_CASES as Record<string, any>)[path]
    const data = readJson<IndustryUseCases>(`${src.industrySlug}.json`)
    const picks = pickFeaturedUseCases(data.useCases, src).map((u) => u.id)
    const secs: Json[] = page.sections
    const done = secs.find((s) => s._type === 'vcUseCases' && s.source === path)
    const old = secs.find((s) => s._type === 'vcCards' && s.head?.badge === 'Use case catalogue')
    if (done) {
      if (done.anchor !== 'ai-use-cases') {
        patches.push({ id: page._id, set: { [`sections[_key=="${done._key}"].anchor`]: 'ai-use-cases' } })
        touched.add(page._id)
        report.push(`${path}: vcUseCases ${done._key} anchor -> ai-use-cases`)
      } else report.push(`${path}: already converted, skipped`)
      continue
    }
    if (!old) throw new Error(`${path}: no "Use case catalogue" vcCards section to convert`)
    const next: Json = { _type: 'vcUseCases', anchor: 'ai-use-cases', source: path, linkLabel: 'See the build', moreLabel: 'See all {count} {industry} use cases' }
    for (const [k, v] of Object.entries(old)) if (KEEP.has(k)) next[k] = v
    const oldIds = (old.items ?? []).map((i: Json) => /#(uc-[\w-]+)/.exec(i.href ?? '')?.[1]).filter(Boolean)
    const dropped = Object.keys(old).filter((k) => !KEEP.has(k) && !['_type', 'anchor', 'items'].includes(k))
    const same = oldIds.filter((id: string) => picks.includes(id)).length
    report.push(
      `${path}: vcCards ${old._key} -> vcUseCases (anchor ${old.anchor ?? '-'} -> ai-use-cases); heading kept: ${JSON.stringify(old.head?.heading)}; ` +
        `cards ${oldIds.length} -> ${picks.length}, ${same} in common${dropped.length ? `; dropped fields: ${dropped.join(',')}` : ''}`,
    )
    patches.push({ id: page._id, set: { [`sections[_key=="${old._key}"]`]: next } })
    touched.add(page._id)
  }

  // 2. Rewrite every remaining link to a retired URL.
  const converted = new Set(patches.map((p) => Object.keys(p.set)[0]))
  for (const d of docs) {
    const links: { path: string; from: string; to: string }[] = []
    oldLinks(d, '', links)
    const todo = links.filter((l) => ![...converted].some((c) => l.path.startsWith(c)))
    if (!todo.length) continue
    patches.push({ id: d._id, set: Object.fromEntries(todo.map((l) => [l.path, l.to])) })
    touched.add(d._id)
    report.push(`${d._id}: ${todo.length} link(s) rewritten, e.g. ${todo[0].from} -> ${todo[0].to}`)
  }

  console.log(report.join('\n'))
  console.log(`\n${patches.length} patch(es) across ${touched.size} document(s). ${APPLY ? 'APPLYING' : 'DRY RUN (add --apply)'}`)
  if (!APPLY) return

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  mkdirSync('scripts/sanity-backups', { recursive: true })
  const file = `scripts/sanity-backups/retire-ai-use-case-pages-${stamp}.json`
  writeFileSync(file, JSON.stringify({ at: stamp, docs: docs.filter((d) => touched.has(d._id)) }, null, 1))
  console.log(`backup: ${file}`)

  const tx = client.transaction()
  for (const p of patches) tx.patch(p.id, (q) => q.set(p.set as any))
  await tx.commit()
  console.log('applied')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

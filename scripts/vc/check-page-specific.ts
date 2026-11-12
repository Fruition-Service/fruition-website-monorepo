/**
 * Compares src/data/vcPageSpecificSections.ts with the live Sanity dataset.
 *
 *   npx tsx scripts/vc/check-page-specific.ts
 *
 * Reports, and exits 1 on any of:
 *   - a registry entry whose section is missing from its page;
 *   - a registered section without `pageSpecific: true`, or with a different `_type`;
 *   - a section in Sanity marked `pageSpecific`, or keyed "pagespecific-", that the registry lacks.
 *
 * Read-only. Run it before re-templating a page group, and after adding a page-specific section.
 * Background: docs/version-c.md, "Page-specific sections".
 */
import { writeClient } from '../sanity-migrate/lib'
import { PAGE_SPECIFIC_KEY_PREFIX, VC_PAGE_SPECIFIC_SECTIONS } from '../../src/data/vcPageSpecificSections'

interface LiveSection { _key: string; _type: string; pageSpecific?: boolean; pageSpecificNote?: string }
interface LivePage { _id: string; path: string; group?: string; sections?: LiveSection[] }

async function main() {
  const pages = await writeClient.fetch<LivePage[]>(
    `*[_type == "vcPage" && !(_id in path("drafts.**"))]{ _id, path, group, "sections": sections[]{ _key, _type, pageSpecific, pageSpecificNote } }`,
  )
  const byPath = new Map(pages.map((p) => [p.path, p]))
  const problems: string[] = []

  for (const entry of VC_PAGE_SPECIFIC_SECTIONS) {
    const page = byPath.get(entry.path)
    const section = page?.sections?.find((s) => s._key === entry.key)
    if (!page) problems.push(`${entry.path}: no vcPage document`)
    else if (!section) problems.push(`${entry.path}: registered section ${entry.key} is not on the page`)
    else {
      if (section._type !== entry.type) problems.push(`${entry.path} ${entry.key}: type ${section._type}, registry says ${entry.type}`)
      if (section.pageSpecific !== true) problems.push(`${entry.path} ${entry.key}: pageSpecific is not true in Sanity`)
    }
  }

  const registered = new Set(VC_PAGE_SPECIFIC_SECTIONS.map((e) => `${e.path}#${e.key}`))
  for (const page of pages) {
    for (const s of page.sections ?? []) {
      const flagged = s.pageSpecific === true || s._key.startsWith(PAGE_SPECIFIC_KEY_PREFIX)
      if (flagged && !registered.has(`${page.path}#${s._key}`)) {
        problems.push(`${page.path}: section ${s._key} (${s._type}) is page-specific in Sanity but not in the registry`)
      }
    }
  }

  const live = pages.flatMap((p) => (p.sections ?? []).filter((s) => s.pageSpecific).map((s) => ({ path: p.path, group: p.group, ...s })))
  console.log(`Page-specific sections in Sanity: ${live.length}`)
  for (const s of live) console.log(`  ${s.path} [${s.group ?? 'no group'}] ${s._key} (${s._type})  ${s.pageSpecificNote ?? ''}`)

  if (problems.length) {
    console.error(`\n${problems.length} problem(s):`)
    for (const p of problems) console.error(`  - ${p}`)
    process.exit(1)
  }
  console.log('\nRegistry and Sanity agree.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

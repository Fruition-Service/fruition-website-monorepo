/**
 * Drop four FAQs from /atlassian-consulting (monday 2901620001, 17 Nov 2026).
 *
 * The monday item numbers them as the consolidated Atlassian FAQ list showed them
 * (01 to 15, src/data/practicePages/atlassian.ts before this change):
 *   02 Can Fruition help with a messy Jira instance?
 *   10 What did the Givergy migration achieve?
 *   12 Why choose Fruition over a Big-4 consulting firm?
 *   13 How much does Atlassian consulting cost with Fruition?
 *
 * Only 02 is still on the live Version C page (first FAQ tab of
 * vcPage-atlassian-consulting); the Version C rollout had already left the other
 * three off. This script removes any reference to the four faqItem documents from
 * that page's FAQ tabs. The faqItem documents themselves stay: /faqs and
 * /certifications-and-awards still reference some of them. Numbering is worked out
 * at render time (VcFaqTabs), so the remaining questions renumber 01, 02, ... and
 * the FAQPage JSON-LD (VcFaq) is built from the same list.
 *
 *   npx tsx scripts/vc/atlassian-faq-trim-2026-11.ts             # dry run
 *   npx tsx scripts/vc/atlassian-faq-trim-2026-11.ts --apply     # backup, then write
 *   npx tsx scripts/vc/atlassian-faq-trim-2026-11.ts --restore <backup.json>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local', quiet: true })
const APPLY = process.argv.includes('--apply')
const restoreIdx = process.argv.indexOf('--restore')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  perspective: 'published',
})

const PAGE = 'vcPage-atlassian-consulting'
export const DROPPED_FAQ_IDS = [
  'faqItem-migrated-atlassian-consulting-1',
  'faqItem-migrated-atlassian-consulting-jira-to-monday-migration-3',
  'faqItem-migrated-atlassian-consulting-6',
  'faqItem-migrated-atlassian-consulting-3',
]

type Ref = { _key: string; _ref: string }
type Tab = { _key: string; label?: string; items?: Ref[] }
type Section = { _key: string; _type: string; tabs?: Tab[] }

async function main() {
  if (restoreIdx > -1) {
    const backup = JSON.parse(readFileSync(process.argv[restoreIdx + 1], 'utf8')) as { _id: string; sections: unknown[] }
    await client.patch(backup._id).set({ sections: backup.sections }).commit()
    console.log(`restored ${backup._id}`)
    return
  }
  const page = await client.fetch<{ _id: string; sections: Section[] } | null>(`*[_id == $id][0]{ _id, sections }`, { id: PAGE })
  if (!page) throw new Error(`${PAGE} not found`)
  const drop = new Set(DROPPED_FAQ_IDS)
  const unsets: string[] = []
  for (const s of page.sections) {
    if (s._type !== 'vcFaq') continue
    for (const t of s.tabs ?? []) {
      for (const it of t.items ?? []) {
        if (!drop.has(it._ref)) continue
        unsets.push(`sections[_key=="${s._key}"].tabs[_key=="${t._key}"].items[_key=="${it._key}"]`)
        console.log(`drop ${it._ref} from tab "${t.label ?? t._key}"`)
      }
    }
  }
  if (!unsets.length) {
    console.log('nothing to drop')
    return
  }
  if (!APPLY) {
    console.log(`dry run: ${unsets.length} reference(s) would be removed. Re-run with --apply.`)
    return
  }
  mkdirSync('scripts/vc/backups', { recursive: true })
  const file = `scripts/vc/backups/atlassian-faq-trim-${Date.now()}.json`
  writeFileSync(file, JSON.stringify(page, null, 2))
  console.log(`backup: ${file}`)
  await client.patch(PAGE).unset(unsets).commit()
  console.log(`removed ${unsets.length} reference(s) from ${PAGE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

/**
 * /monday-partner-australia FAQ repair, 17 Nov 2026.
 *
 * Vadim tried to delete the "Training" tab in the inline editor. The editor had no remove action, so
 * he cleared its label instead, which left a blank pill no one could click again. The same save path
 * read the uppercase-styled first label back as "MONDAY.COM IN AUSTRALIA". This removes the blank tab
 * (what he meant to do; its six faqItem questions stay in the central store) and restores the first
 * label's real case. The editor itself was fixed in the same PR (Remove tab, no empty saves).
 *
 *   npx tsx scripts/vc/au-faq-training-tab-2026-11.ts           # dry run
 *   npx tsx scripts/vc/au-faq-training-tab-2026-11.ts --apply
 */
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
  perspective: 'published',
})

const ID = 'vcPage-monday-partner-australia'
type Tab = { _key: string; label?: string; items?: unknown[] }
type Section = { _key: string; _type: string; tabs?: Tab[] }

async function main() {
  const doc = await client.getDocument<{ sections: Section[] }>(ID)
  if (!doc) throw new Error(`${ID} not found`)
  const faq = doc.sections.find((s) => s._type === 'vcFaq')
  if (!faq?.tabs) throw new Error('no vcFaq section')

  const blank = faq.tabs.filter((t) => !t.label?.trim())
  const shouty = faq.tabs.find((t) => t.label === 'MONDAY.COM IN AUSTRALIA')
  console.log('tabs:', faq.tabs.map((t) => JSON.stringify(t.label ?? '')).join(', '))
  console.log('remove blank tabs:', blank.map((t) => `${t._key} (${t.items?.length ?? 0} questions)`).join(', ') || 'none')
  console.log('restore case:', shouty ? `${shouty._key} -> "monday.com in Australia"` : 'none')

  if (!APPLY) {
    console.log('dry run; pass --apply to write')
    return
  }
  let p = client.patch(ID)
  const base = `sections[_key=="${faq._key}"].tabs`
  if (blank.length) p = p.unset(blank.map((t) => `${base}[_key=="${t._key}"]`))
  if (shouty) p = p.set({ [`${base}[_key=="${shouty._key}"].label`]: 'monday.com in Australia' })
  await p.commit({ visibility: 'sync' })
  console.log('applied')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

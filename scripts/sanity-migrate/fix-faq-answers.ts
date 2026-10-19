/**
 * Repair faqItem.answer rich text.
 *
 * Background: the live faqItem documents were seeded from scraped page text,
 * which flattened every answer into plain `normal` blocks — bullet lists lost
 * their markers, and a few answers lost their paragraph breaks entirely so the
 * words ran together ("across portfoliosCross-board dependencies…").
 *
 * This migration rebuilds the answer for every faqItem whose question matches
 * the clean authored source in scripts/migrate-faq.ts (FAQ_TABS), using the
 * list-aware converter in ./lib. That deterministically restores real bullet /
 * numbered lists and correct spacing from the original text — no guessing on
 * the scraped data.
 *
 * Run:  npx tsx scripts/sanity-migrate/fix-faq-answers.ts --dry-run
 *       npx tsx scripts/sanity-migrate/fix-faq-answers.ts
 */
import { writeClient, answerToPortableText } from './lib'
import { FAQ_TABS } from '../migrate-faq'

const DRY_RUN = process.argv.includes('--dry-run')

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

// Build normalized-question -> clean authored answer from the migrate-faq source.
const cleanByQuestion = new Map<string, string>()
for (const tab of FAQ_TABS) {
  for (const item of tab.items as Array<{ question: string; answer: string }>) {
    cleanByQuestion.set(norm(item.question), item.answer)
  }
}

type FaqDoc = { _id: string; question: string; answer?: unknown[] }

function blocksToText(blocks: unknown[] | undefined): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((b) => {
      const block = b as { children?: { text?: string }[]; listItem?: string }
      const text = (block.children || []).map((c) => c.text ?? '').join('')
      return block.listItem ? `• ${text}` : text
    })
    .join('\n')
}

async function main() {
  const docs: FaqDoc[] = await writeClient.fetch(
    '*[_type == "faqItem"]{ _id, question, answer }',
  )
  console.log(`Fetched ${docs.length} faqItem documents.`)
  console.log(`Clean authored answers available: ${cleanByQuestion.size}\n`)

  // Compare answers by their letters/digits only. This ignores whitespace,
  // punctuation, and curly-vs-straight quotes, so it isolates a *formatting*
  // difference (safe to fix) from a genuine *content* difference (leave alone,
  // so we never clobber an answer that was edited in Sanity after seeding).
  const letters = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

  let matched = 0
  let reformatted = 0
  let skippedContent = 0

  for (const doc of docs) {
    const clean = cleanByQuestion.get(norm(doc.question))
    if (!clean) continue
    matched++

    const beforeText = blocksToText(doc.answer)
    const newBlocks = answerToPortableText(clean)
    const afterText = blocksToText(newBlocks)

    if (letters(beforeText) !== letters(clean)) {
      skippedContent++
      console.log(`\n--- SKIP (content differs, not just formatting): ${doc.question}`)
      continue
    }
    if (beforeText === afterText) continue // already correctly formatted
    reformatted++

    console.log(`\n=== ${doc.question} (${doc._id}) ===`)
    console.log('--- BEFORE ---')
    console.log(beforeText.slice(0, 700))
    console.log('--- AFTER ---')
    console.log(afterText.slice(0, 700))

    if (!DRY_RUN) {
      await writeClient.patch(doc._id).set({ answer: newBlocks }).commit()
      console.log('  ✓ written')
    }
  }

  console.log(
    `\n${DRY_RUN ? '[dry-run] ' : ''}matched ${matched} clean-source questions → ${reformatted} ${
      DRY_RUN ? 'would be reformatted' : 'reformatted'
    }, ${skippedContent} skipped (content differs).`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

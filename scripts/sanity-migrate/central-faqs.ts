/**
 * Seed central `faqItem` documents from every FAQ that is still hardcoded
 * (practice-page data files) or page-local (aiPartnerPage.faq arrays), so all
 * site FAQs are Sanity-driven, render through the shared FaqAccordion, and
 * appear in /faqs search.
 *
 * CREATE-ONLY: uses createIfNotExists with deterministic ids — rerunning is a
 * no-op and existing documents are never modified or deleted. Page keys match
 * what the templates fetch via getFaqItemsForPageStrict (route path minus the
 * leading slash). Items are intentionally NOT tagged with the curated "faqs"
 * page key — /faqs lists every faqItem regardless.
 *
 * Run with:
 *   npx tsx scripts/sanity-migrate/central-faqs.ts
 */
import { writeClient } from './lib'

import { AI_CONSULTING_PAGES } from '../../src/data/practicePages/aiConsulting'
import { ATLASSIAN_PAGES } from '../../src/data/practicePages/atlassian'
import { HUBSPOT_PAGES } from '../../src/data/practicePages/hubspot'
import { INDUSTRIES_PAGES } from '../../src/data/practicePages/industries'
import { INTEGRATIONS_PAGES } from '../../src/data/practicePages/integrations'
import { MONDAY_PRODUCTS_PAGES } from '../../src/data/practicePages/mondayProducts'
import { PROOF_PAGES } from '../../src/data/practicePages/proof'
import { LICENSING_PAGES } from '../../src/data/practicePages/licensing'
import type { PracticePage } from '../../src/data/practicePages/types'

/* Plain text (with \n\n paragraph breaks) → Portable Text blocks */
function toBlocks(text: string) {
  return text
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para, i) => ({
      _type: 'block',
      _key: `b${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text: para, marks: [] }],
    }))
}

function humanize(slugSegment: string) {
  return slugSegment
    .split('-')
    .map((w) => (w === 'ai' ? 'AI' : w === 'monday' ? 'monday' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

/* Public doc ids must be DOT-FREE: Sanity treats ids containing `.` as
 * namespaced/private and omits them from unauthenticated queries
 * ("reason": "permission"). Hyphens only. */
const idSafe = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '-')

interface PendingItem {
  pageKey: string
  category: string
  question: string
  answerText: string
  order: number
}

async function main() {
  const pending: PendingItem[] = []

  /* ---- 1. Practice pages (hardcoded TSX data) ---- */
  const maps: Record<string, PracticePage>[] = [
    AI_CONSULTING_PAGES, ATLASSIAN_PAGES, HUBSPOT_PAGES, INDUSTRIES_PAGES,
    INTEGRATIONS_PAGES, MONDAY_PRODUCTS_PAGES, PROOF_PAGES, LICENSING_PAGES,
  ]
  for (const map of maps) {
    for (const page of Object.values(map)) {
      if (!page?.path || !page.faqs?.length) continue
      // Pages that own their FAQs render them from the page document, not from
      // this collection. Seeding them here would only create records nobody's
      // edits reach.
      if (page.preferPageFaqs) continue
      const pageKey = page.path.replace(/^\//, '')
      const lastCrumb = page.breadcrumb?.[page.breadcrumb.length - 1]?.label
      const category = lastCrumb || humanize(pageKey.split('/').pop() || pageKey)
      page.faqs.forEach((f, i) => {
        if (!f.q?.trim() || !f.a?.trim()) return
        pending.push({ pageKey, category, question: f.q.trim(), answerText: f.a.trim(), order: i })
      })
    }
  }

  /* ---- 2. aiPartnerPage docs (page-local Sanity FAQs) ---- */
  const partnerDocs: { slug: string; title?: string; faq?: { question?: string; answer?: string }[] }[] =
    await writeClient.fetch(`*[_type == "aiPartnerPage"]{ "slug": slug.current, title, faq }`)
  for (const doc of partnerDocs) {
    if (!doc.slug || !doc.faq?.length) continue
    const pageKey = doc.slug === 'ai-capability-assessment' ? doc.slug : `partnerships/${doc.slug}`
    const category = humanize(doc.slug)
    doc.faq.forEach((f, i) => {
      if (!f.question?.trim() || !f.answer?.trim()) return
      pending.push({ pageKey, category, question: f.question.trim(), answerText: f.answer.trim(), order: i })
    })
  }

  console.log(`Pending: ${pending.length} FAQ items across ${new Set(pending.map((p) => p.pageKey)).size} pages`)

  /* ---- 2b. Remove any docs from the earlier dotted-id run (they were
   * invisible to public queries — see idSafe comment). Only ids under our own
   * migration namespace are touched. ---- */
  const dotted: string[] = await writeClient.fetch(`*[_type == "faqItem" && string::startsWith(_id, "faqItem.migrated.")]._id`)
  for (const id of dotted) await writeClient.delete(id)
  if (dotted.length) console.log(`Cleaned up ${dotted.length} dotted-id docs from previous run.`)

  /* ---- 3. Create (idempotent) ---- */
  let created = 0
  let existed = 0
  for (const item of pending) {
    const _id = `faqItem-migrated-${idSafe(item.pageKey)}-${item.order}`
    const before = await writeClient.fetch(`defined(*[_id == $id][0])`, { id: _id })
    await writeClient.createIfNotExists({
      _id,
      _type: 'faqItem',
      question: item.question,
      answer: toBlocks(item.answerText),
      category: item.category,
      pages: [item.pageKey],
      order: item.order,
    })
    before ? existed++ : created++
  }
  console.log(`Done. Created ${created} new faqItem docs, ${existed} already existed (untouched).`)
}

main().catch((e) => { console.error(e); process.exit(1) })

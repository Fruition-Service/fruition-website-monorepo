import type { PracticePage } from '@/data/practicePages/types'
import type { FaqTab } from '@/components/sections/types'
import type { CentralFaqItem } from '@/sanity/groupFaqs'

/**
 * The central `faqItem` page keys /hubspot-consulting reads, in render order.
 * The four leaf keys belong to pages that now live on the hub as in-page
 * sections (monday 2900266080); their questions are still tagged with them in
 * Sanity, so the merged page reads all five instead of retagging documents.
 */
export const HUBSPOT_FAQ_PAGE_KEYS = [
  'hubspot-consulting',
  'hubspot-consulting/implementation',
  'hubspot-consulting/breeze-ai',
  'hubspot-consulting/monday-hubspot-integration',
  'hubspot-consulting/hubspot-to-monday-migration',
] as const

function plain(item: CentralFaqItem): string {
  return (item.answer ?? [])
    .map((block) =>
      block._type === 'block'
        ? ((block as { children?: { text?: string }[] }).children ?? []).map((c) => c.text ?? '').join('')
        : '',
    )
    .filter(Boolean)
    .join('\n\n')
}

/**
 * The FAQ /hubspot-consulting renders: one list, no tabs. The central
 * documents for the five keys win (each key's questions in their own order,
 * keys in HUBSPOT_FAQ_PAGE_KEYS order, a question repeated across keys kept
 * once), unless the page sets `preferPageFaqs`; with none in Sanity the
 * page's own list renders. Pure, so it can be tested without Sanity.
 */
export function hubspotFaqTabs(
  page: Pick<PracticePage, 'faqs' | 'preferPageFaqs'>,
  centralByKey: (CentralFaqItem[] | null | undefined)[],
): FaqTab[] {
  const seen = new Set<string>()
  const items: { _key: string; question: string; answer: string }[] = []
  if (!page.preferPageFaqs) {
    for (const list of centralByKey) {
      const sorted = [...(list ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      for (const item of sorted) {
        const question = item.question?.trim()
        if (!question || seen.has(question)) continue
        seen.add(question)
        items.push({ _key: item._id, question: item.question, answer: plain(item) })
      }
    }
  }
  if (items.length) return [{ label: 'General Questions', items }]
  return [{ label: 'General Questions', items: page.faqs.map((f) => ({ question: f.q, answer: f.a })) }]
}

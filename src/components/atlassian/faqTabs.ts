import type { PracticePage } from '@/data/practicePages/types'
import type { FaqTab } from '@/components/sections/types'
import type { CentralFaqItem } from '@/sanity/groupFaqs'

/**
 * The FAQ tabs /atlassian-consulting renders. The central `faqItem` documents
 * tagged `atlassian-consulting` win (one category, so one list of 15), unless
 * the page sets `preferPageFaqs`; with none in Sanity the page's own list
 * renders. Same precedence as PracticePageTemplate, kept pure so it can be
 * tested without Sanity.
 */
export function atlassianFaqTabs(
  page: Pick<PracticePage, 'faqs' | 'preferPageFaqs'>,
  centralFaqs: CentralFaqItem[] | null | undefined,
  group: (items: CentralFaqItem[]) => FaqTab[],
): FaqTab[] {
  if (!page.preferPageFaqs && centralFaqs?.length) return group(centralFaqs)
  return [{ label: 'General Questions', items: page.faqs.map((f) => ({ question: f.q, answer: f.a })) }]
}

import { BOOKING_ANCHOR } from '@/lib/bookingLink'
import type { PracticePage } from './types'
import { getIndustrySections, type IndustrySections } from '@/data/industrySections'
import { groupFaqsIntoTabs, type CentralFaqItem } from '@/sanity/groupFaqs'
import type { FaqTab } from '@/components/sections/types'

/**
 * Adapters that let a /industries leaf render through UniversalPageTemplate —
 * the template every other industry landing page uses — while its copy keeps
 * living in the practice-cluster data.
 *
 * The mapping is deliberately lossless for page-specific copy: hero, the
 * approach trio, the services list and the FAQs all carry over. What does not
 * carry over is the practice cluster's shared furniture — the geographic
 * coverage cards and the practice-leader block — because the industry template
 * has no equivalent section and that copy is identical on every other practice
 * page and on /about-us.
 */

/** Practice-cluster page → the document shape UniversalPageTemplate reads. */
export function practiceToIndustryPage(page: PracticePage) {
  return {
    slug: pageKeyFor(page),
    title: page.heading,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,

    heroHeading: page.heading,
    heroSubheading: page.lead,
    primaryCtaLabel: 'Book a discovery call',
    primaryCtaUrl: BOOKING_ANCHOR,
    secondaryCtaLabel: 'Common questions',
    secondaryCtaUrl: '#faq',

    /* The approach trio leads, as it does on the practice template; the
       services list follows it through CapabilityBlocksSection below. */
    capabilitiesEyebrow: page.approachEyebrow ?? 'Our approach',
    capabilitiesHeading: page.approachHeading,
    capabilitiesColumns: 3 as const,
    capabilitiesCards: page.approach.map((a, i) => ({
      _key: `approach-${i}`,
      title: a.title,
      description: a.body,
    })),

    /* Platform-agnostic pages, so the booking CTA does not lead with a
       platform the sector page may not be about. */
    calendlyHeading: 'Book a 30-minute discovery call with a Fruition consultant',

    /* The template's stats banner needs numbers these pages don't carry; the
       closing testimonial banner already says the same thing. */
    hideJoinStatsSection: true,
  }
}

/** Central Sanity FAQs win; the page's own list is the fallback, as before. */
export function practiceFaqTabs(
  page: PracticePage,
  centralFaqs: CentralFaqItem[] | null | undefined,
): FaqTab[] {
  if (centralFaqs?.length) return groupFaqsIntoTabs(centralFaqs)
  return [
    {
      _key: 'practice-faqs',
      label: 'General Questions',
      items: page.faqs.map((f, i) => ({ _key: `faq-${i}`, question: f.q, answer: f.a })),
    },
  ]
}

/**
 * Long-form sections for a converted page. The services list renders through
 * CapabilityBlocksSection so these pages carry the same section designs as the
 * rest of the industry set; anything mined from the blog archive for this slug
 * (see src/data/industrySections.ts) is layered on top and wins.
 */
export function practiceIndustrySections(page: PracticePage): IndustrySections {
  const mined = getIndustrySections(pageKeyFor(page))
  return {
    capabilityBlocks: {
      eyebrow: `// ${page.servicesEyebrow ?? 'What we build'}`,
      heading: page.servicesHeading,
      // Four services land as a clean 2x2 rather than a row of three plus one.
      columns: page.services.length === 4 ? 2 : 3,
      blocks: page.services.map((s, i) => ({
        number: String(i + 1).padStart(2, '0'),
        title: s.title,
        lead: s.body,
      })),
    },
    ...mined,
  }
}

/** '/industries/healthcare' → 'industries/healthcare' — the Sanity page key. */
export function pageKeyFor(page: PracticePage): string {
  return page.path.replace(/^\/+/, '')
}

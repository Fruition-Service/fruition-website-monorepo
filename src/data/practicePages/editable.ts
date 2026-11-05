import {
  withPracticeSharedCopy,
  withPracticeTemplateCopy,
  type PracticePage,
  type PracticeSharedField,
} from './types'
import { INDUSTRY_TEMPLATE_FALLBACKS } from './toIndustryPage'
import { AI_CONSULTING_PAGES } from './aiConsulting'
import { ATLASSIAN_PAGES } from './atlassian'
import { HUBSPOT_PAGES } from './hubspot'
import { INTEGRATIONS_PAGES } from './integrations'
import { PROOF_PAGES } from './proof'
import { INDUSTRIES_PAGES } from './industries'

/**
 * Every live route whose PracticePage copy is merged with a `practicePage`
 * Studio document (getPracticePageContent). The seed script creates one
 * document per entry; practicePage.test.ts checks each has a route file that
 * reads it. /licence-procurement is not here: it has its own `licensingPage`
 * singleton. Pages in the data files without a route of their own
 * (/integrations/aircall, /integrations/make, the /industries hub) are not
 * here either.
 */
export const EDITABLE_PRACTICE_PAGES: PracticePage[] = [
  AI_CONSULTING_PAGES['hub'],
  AI_CONSULTING_PAGES['agent-development'],
  AI_CONSULTING_PAGES['governance-and-compliance'],
  AI_CONSULTING_PAGES['rag-knowledge-systems'],
  AI_CONSULTING_PAGES['marketing-automation'],
  AI_CONSULTING_PAGES['sales-outbound'],
  AI_CONSULTING_PAGES['customer-service'],
  AI_CONSULTING_PAGES['operations-back-office'],
  ATLASSIAN_PAGES['hub'],
  HUBSPOT_PAGES['hub'],
  HUBSPOT_PAGES['implementation'],
  HUBSPOT_PAGES['breeze-ai'],
  HUBSPOT_PAGES['monday-hubspot-integration'],
  HUBSPOT_PAGES['hubspot-to-monday-migration'],
  INTEGRATIONS_PAGES['hub'],
  INTEGRATIONS_PAGES['twilio'],
  INTEGRATIONS_PAGES['zapier'],
  PROOF_PAGES['certifications-and-awards'],
  INDUSTRIES_PAGES['healthcare'],
  INDUSTRIES_PAGES['financial-services'],
  INDUSTRIES_PAGES['solar-renewables'],
  INDUSTRIES_PAGES['education'],
  INDUSTRIES_PAGES['nonprofits'],
]

/** Deterministic Studio document id: '/hubspot-consulting/implementation' to 'practicePage-hubspot-consulting-implementation'. */
export function practicePageDocId(path: string): string {
  return `practicePage-${path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-')}`
}

/**
 * The /industries leaves render through UniversalPageTemplate, which shows a
 * client logo wall and the FAQ block but not the practice template's
 * coverage, leader and booking blocks. Every other route renders
 * PracticePageTemplate, which has no logo wall on these routes (none of them
 * has an industry logo set).
 */
export function rendersThroughIndustryTemplate(page: PracticePage): boolean {
  return page.path.startsWith('/industries/')
}

const INDUSTRY_LEAF_FIELDS: PracticeSharedField[] = ['logoHeading', 'logoHeadingAccent', 'faqHeading', 'faqContactLead']
const TEMPLATE_FIELDS: PracticeSharedField[] = [
  'coverageEyebrow',
  'coverageHeading',
  'coverageRegions',
  'leaderEyebrow',
  'leaderHeading',
  'leaderName',
  'leaderTitle',
  'leaderBio',
  'leaderPull',
  'leaderBadges',
  'bookingHeading',
  'bookingSubheading',
  'faqHeading',
  'faqContactLead',
]

/**
 * The plain string fields this route renders from a code fallback when the
 * page data leaves them unset (the CTA label, the eyebrows, the linked-pages
 * heading), with the words it renders today. Seeding them makes the words
 * clickable without changing them. The linked-pages block only renders on
 * pages that have child links.
 */
export function renderedFallbackFields(page: PracticePage): Record<string, string> {
  if (rendersThroughIndustryTemplate(page)) {
    const d = INDUSTRY_TEMPLATE_FALLBACKS
    return {
      primaryCtaLabel: page.primaryCtaLabel ?? d.primaryCtaLabel,
      approachEyebrow: page.approachEyebrow ?? d.approachEyebrow,
      servicesEyebrow: page.servicesEyebrow ?? d.servicesEyebrow,
    }
  }
  const t = withPracticeTemplateCopy(page)
  return {
    primaryCtaLabel: t.primaryCtaLabel,
    approachEyebrow: t.approachEyebrow,
    servicesEyebrow: t.servicesEyebrow,
    ...(page.children?.length ? { childrenEyebrow: t.childrenEyebrow, childrenHeading: t.childrenHeading } : {}),
  }
}

/** The shared-block fields this route actually renders, so only those are seeded. */
export function renderedSharedFields(page: PracticePage): PracticeSharedField[] {
  return rendersThroughIndustryTemplate(page) ? INDUSTRY_LEAF_FIELDS : TEMPLATE_FIELDS
}

/**
 * A PracticePage as the fields of its `practicePage` document. The shared
 * blocks and the template fallbacks carry the copy the route renders today
 * (its own value, else the shared or fallback copy), limited to the blocks the
 * route shows.
 */
export function toPracticePageFields(page: PracticePage): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    title: `${page.heading} (${page.path})`,
    path: page.path,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    primaryCtaLabel: page.primaryCtaLabel,
    heading: page.heading,
    lead: page.lead,
    approachEyebrow: page.approachEyebrow,
    approachHeading: page.approachHeading,
    approach: page.approach.map((a, i) => ({
      _key: `approach-${i}`,
      _type: 'practiceApproachItem',
      title: a.title,
      body: a.body,
    })),
    servicesEyebrow: page.servicesEyebrow,
    servicesHeading: page.servicesHeading,
    services: page.services.map((s, i) => ({
      _key: `service-${i}`,
      _type: 'practiceServiceItem',
      title: s.title,
      body: s.body,
      ...(s.href ? { href: s.href } : {}),
    })),
    childrenEyebrow: page.childrenEyebrow,
    childrenHeading: page.childrenHeading,
    childLinks: page.children?.map((c, i) => ({
      _key: `child-${i}`,
      _type: 'practiceChildLink',
      label: c.label,
      href: c.href,
      ...(c.description ? { description: c.description } : {}),
    })),
    faqs: page.faqs.map((f, i) => ({ _key: `faq-${i}`, _type: 'practiceFaqItem', q: f.q, a: f.a })),
  }
  Object.assign(fields, renderedFallbackFields(page))
  const shared = withPracticeSharedCopy(page)
  for (const name of renderedSharedFields(page)) {
    fields[name] =
      name === 'coverageRegions'
        ? shared.coverageRegions.map((r, i) => ({ _key: `region-${i}`, _type: 'practiceCoverageRegion', ...r }))
        : shared[name]
  }
  return Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined))
}

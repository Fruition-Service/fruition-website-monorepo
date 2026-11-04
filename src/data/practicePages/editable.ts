import type { PracticePage } from './types'
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
  ATLASSIAN_PAGES['jira'],
  ATLASSIAN_PAGES['confluence'],
  ATLASSIAN_PAGES['jira-service-management'],
  ATLASSIAN_PAGES['jira-to-monday-migration'],
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

/** Deterministic Studio document id: '/atlassian-consulting/jira' → 'practicePage-atlassian-consulting-jira'. */
export function practicePageDocId(path: string): string {
  return `practicePage-${path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-')}`
}

/** A PracticePage as the fields of its `practicePage` document. */
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
  return Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined))
}

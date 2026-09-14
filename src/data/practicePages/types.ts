/**
 * Practice pages — Site Architecture v2.1 clusters (Atlassian, HubSpot,
 * AI consulting, integrations, monday products).
 *
 * Copy ported from Josh's approved mockups (fruition-site-architecture.vercel.app,
 * source HTML in the v2.1 proposal bundle). Content is hardcoded in TSX for now —
 * same pattern the Atlassian partnership page used before it was seeded to Sanity —
 * and can be migrated to Sanity later without changing the rendered output.
 *
 * NOTE: the mockups credited "Josh Roszler"; the correct surname is Jebathilak
 * (see commit 3b650e8) — all ported copy uses the corrected name.
 */
import type { Metadata } from 'next'
import { buildOgMetadata } from '@/lib/metadata'

export interface PracticeLink {
  label: string
  href: string
  description?: string
}

export interface PracticeFaq {
  q: string
  a: string
}

export interface PracticePage {
  /** Route path, also used as canonical, e.g. '/atlassian-consulting/jira' */
  path: string
  seoTitle: string
  seoDescription: string
  /** Trail after Home; last entry is the current page */
  breadcrumb: PracticeLink[]
  eyebrow: string
  heading: string
  lead: string
  /** Search queries this page targets — documentation only, never rendered */
  targetQueries?: string[]
  approachEyebrow?: string
  approachHeading: string
  approach: { title: string; body: string }[]
  servicesEyebrow?: string
  servicesHeading: string
  services: { title: string; body: string }[]
  childrenEyebrow?: string
  childrenHeading?: string
  children?: PracticeLink[]
  faqs: PracticeFaq[]
}

/** Same Calendly link the navbar CTA uses (siteSettings.calendlyLink). */
import { BOOKING_ANCHOR } from '@/lib/bookingLink'

export const DISCOVERY_CALL_URL = BOOKING_ANCHOR

export const GEO_REGIONS = [
  {
    flag: '🇦🇺',
    region: 'APAC',
    cities: 'Sydney · Singapore · India',
    body: 'Headquartered at 12/64 York Street, Sydney. Serving Australia, New Zealand, Singapore, and India with APP and PDPA-aligned delivery.',
  },
  {
    flag: '🇬🇧',
    region: 'UK & Europe',
    cities: 'London',
    body: 'London delivery centre serving the UK, Ireland, and EU. UK GDPR and EU AI Act-aware frameworks as standard.',
  },
  {
    flag: '🇺🇸',
    region: 'North America',
    cities: 'New York',
    body: 'New York delivery centre serving all 50 states and Canada with SOC 2, HIPAA, and CCPA/CPRA-aware overlays.',
  },
] as const

export const PRACTICE_LEADER = {
  name: 'Josh Jebathilak',
  title: 'Managing Director',
  heading: 'Led by practitioners, not account managers.',
  bio: 'Josh Jebathilak, Managing Director, spent six years at monday.com before founding Fruition and has led over 900 implementations across work platforms and AI systems in financial services, healthcare, construction, professional services, and government.',
  pull: 'The consultant who scopes your engagement is the consultant who delivers it.',
  badges: ['monday.com Platinum Partner', 'Rising Star 2026', '900+ implementations', 'AU · UK · US'],
} as const

export function practiceMetadata(page: PracticePage): Metadata {
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: page.path },
    ...buildOgMetadata({
      title: page.seoTitle,
      description: page.seoDescription,
      path: page.path,
    }),
  }
}

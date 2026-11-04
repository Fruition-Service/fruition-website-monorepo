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
  /** Hero CTA label. Defaults to "Book a discovery call"; still links to DISCOVERY_CALL_URL. */
  primaryCtaLabel?: string
  heading: string
  lead: string
  /** Search queries this page targets — documentation only, never rendered */
  targetQueries?: string[]
  approachEyebrow?: string
  approachHeading: string
  approach: { title: string; body: string }[]
  servicesEyebrow?: string
  servicesHeading: string
  /** `href` turns the card into a link (e.g. the industries hub sector grid) */
  services: { title: string; body: string; href?: string }[]
  childrenEyebrow?: string
  childrenHeading?: string
  children?: PracticeLink[]
  faqs: PracticeFaq[]
  /**
   * Treat `faqs` as the authoritative list for this route, ahead of the central
   * `faqItem` collection. Set it when the page's questions have been rewritten
   * and the central docs still hold the previous page's copy: FAQPage JSON-LD
   * has to match what the page renders, so the stale central set must not win.
   * See /sanity-content, "The FAQ two-source trap".
   */
  preferPageFaqs?: boolean
  /*
   * Shared blocks. Every page renders the same copy for these
   * (PRACTICE_SHARED_COPY) unless its `practicePage` document fills them in,
   * so the page data files leave them unset.
   */
  /** Client logo wall heading: plain part, then the brand-coloured part. */
  logoHeading?: string
  logoHeadingAccent?: string
  coverageEyebrow?: string
  coverageHeading?: string
  coverageRegions?: PracticeRegion[]
  leaderEyebrow?: string
  leaderHeading?: string
  leaderName?: string
  leaderTitle?: string
  leaderBio?: string
  leaderPull?: string
  leaderBadges?: string[]
  bookingHeading?: string
  bookingSubheading?: string
  faqHeading?: string
}

export interface PracticeRegion {
  flag: string
  region: string
  cities: string
  body: string
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

/** The shared blocks' copy, as every practice page rendered it before it moved to Sanity. */
export const PRACTICE_SHARED_COPY = {
  // Same words as ClientLogoSection's own default, trailing space included.
  logoHeading: 'Clients who have used our ',
  logoHeadingAccent: 'monday.com consulting services',
  coverageEyebrow: 'Geographic coverage',
  coverageHeading: 'Delivered locally across three regions.',
  coverageRegions: GEO_REGIONS.map((g) => ({ ...g })),
  leaderEyebrow: 'Who leads it',
  leaderHeading: PRACTICE_LEADER.heading,
  leaderName: PRACTICE_LEADER.name,
  leaderTitle: PRACTICE_LEADER.title,
  leaderBio: PRACTICE_LEADER.bio,
  leaderPull: PRACTICE_LEADER.pull,
  leaderBadges: [...PRACTICE_LEADER.badges],
  bookingHeading: "Let's design the way your business should run.",
  bookingSubheading: '30 minutes. No obligation. Speak to a consultant, not a salesperson.',
  faqHeading: 'Frequently asked questions',
} satisfies Required<Pick<PracticePage, PracticeSharedField>>

export type PracticeSharedField =
  | 'logoHeading'
  | 'logoHeadingAccent'
  | 'coverageEyebrow'
  | 'coverageHeading'
  | 'coverageRegions'
  | 'leaderEyebrow'
  | 'leaderHeading'
  | 'leaderName'
  | 'leaderTitle'
  | 'leaderBio'
  | 'leaderPull'
  | 'leaderBadges'
  | 'bookingHeading'
  | 'bookingSubheading'
  | 'faqHeading'

/** The page with every shared block resolved: its own value, else the shared copy. */
export function withPracticeSharedCopy(
  page: PracticePage,
): PracticePage & Required<Pick<PracticePage, PracticeSharedField>> {
  const d = PRACTICE_SHARED_COPY
  return {
    ...page,
    logoHeading: page.logoHeading ?? d.logoHeading,
    logoHeadingAccent: page.logoHeadingAccent ?? d.logoHeadingAccent,
    coverageEyebrow: page.coverageEyebrow ?? d.coverageEyebrow,
    coverageHeading: page.coverageHeading ?? d.coverageHeading,
    coverageRegions: page.coverageRegions ?? d.coverageRegions,
    leaderEyebrow: page.leaderEyebrow ?? d.leaderEyebrow,
    leaderHeading: page.leaderHeading ?? d.leaderHeading,
    leaderName: page.leaderName ?? d.leaderName,
    leaderTitle: page.leaderTitle ?? d.leaderTitle,
    leaderBio: page.leaderBio ?? d.leaderBio,
    leaderPull: page.leaderPull ?? d.leaderPull,
    leaderBadges: page.leaderBadges ?? d.leaderBadges,
    bookingHeading: page.bookingHeading ?? d.bookingHeading,
    bookingSubheading: page.bookingSubheading ?? d.bookingSubheading,
    faqHeading: page.faqHeading ?? d.faqHeading,
  }
}

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

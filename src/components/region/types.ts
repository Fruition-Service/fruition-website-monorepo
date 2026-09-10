import type { BookingRegion } from "@/components/sections/BookingSection"
import type { TeamRegion } from "@/components/TeamGridSection"
/**
 * Content model for the region pages (/monday-partner-*).
 *
 * The redesign introduced six structural sections that have no equivalent in
 * the `locationPage` Sanity schema (services grid, AEO answer block, process,
 * numbers, national coverage, long-form FAQ). Rather than grow the schema and
 * reseed six documents, this content lives in `src/data/regionPages.ts` — the
 * same pattern the long-form industry and practice pages already use.
 *
 * Sanity still owns everything it already owned: SEO title/description, the
 * hero image, testimonials, the team roster, the Calendly link and the
 * per-region monday.com referral URL (partner UTM attribution stays editable).
 */

export interface RegionService {
  /** Icon key resolved against ICONS in RegionServicesSection. */
  icon: "layers" | "chart" | "zap" | "users" | "database" | "sparkles"
  title: string
  body: string
}

export interface RegionServiceLink {
  label: string
  href: string
}

export interface RegionProcessStep {
  title: string
  body: string
}

export interface RegionStat {
  value: string
  label: string
}

export interface RegionLocation {
  city: string
  detail: string
  /** Marks the office city — renders the pulsing "live" dot. */
  headquarters?: boolean
}

export interface RegionFaq {
  question: string
  answer: string
}

export interface RegionContent {
  /** Sanity `locationPage` slug this content belongs to. */
  slug: string
  country: string
  /**
   * Which team members the grid shows — the Sanity teamMember tag vocabulary.
   * Not the same thing as `bookingRegion`, and not the same values: this page
   * set uses US/IN/APAC where booking uses NA/IND/SEA.
   */
  teamRegion: TeamRegion
  /**
   * Which consultation desk the booking card offers, instead of detecting it
   * from the visitor's IP. A country page is already an answer to "where are
   * you?", so declaring it beats geo-detection here.
   */
  bookingRegion: BookingRegion
  flag: string

  hero: {
    /** Pill copy beside the flag, e.g. "monday.com Platinum Partner in Sydney · Melbourne". */
    eyebrow: string
    heading: string
    /** Trailing half of the H1, rendered in voltage purple. */
    headingAccent: string
    subheading: string
    /** Small credential line beside the partner badge. */
    badgeStrap: string
  }

  services: {
    eyebrow: string
    heading: string
    lead: string
    cards: RegionService[]
    alsoLabel: string
    alsoLinks: RegionServiceLink[]
  }

  /** Answer-engine block: one question, one self-contained answer. */
  answerBlock: {
    question: string
    answer: string
  }

  testimonials: {
    heading: string
    lead: string
  }

  process: {
    eyebrow: string
    heading: string
    lead: string
    steps: RegionProcessStep[]
  }

  numbers: {
    eyebrow: string
    heading: string
    lead: string
    stats: RegionStat[]
    footnote: string
  }

  team: {
    heading: string
    lead: string
  }

  coverage: {
    eyebrow: string
    heading: string
    lead: string
    locations: RegionLocation[]
    office: {
      title: string
      address: string
      mapQuery: string
      mapUrl: string
    }
  }

  faq: {
    heading: string
    /** Aside under the sticky FAQ heading. */
    contactLead: string
    items: RegionFaq[]
  }

  closingCta: {
    heading: string
    lead: string
  }
}

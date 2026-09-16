import type { BookingRegion } from "@/components/sections/BookingSection"
import type { TeamRegion } from "@/components/TeamGridSection"
/**
 * Content model for the region pages (/monday-partner-*).
 *
 * Every field below is editable in Sanity on the matching `locationPage`
 * document — the schema mirrors this interface one-for-one, and all six
 * documents are seeded with the copy in `src/data/regionPages.ts`.
 *
 * That file remains the shipped default: `mergeRegionContent` overlays the
 * Sanity document on top of it, so a field left blank in the Studio renders
 * the code copy rather than a hole in the page. Sanity also owns the hero
 * image, the case studies, the team roster and the Calendly link.
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

/** Structured office details for the page's ProfessionalService JSON-LD. */
export interface RegionLocalBusiness {
  /** `name` on the ProfessionalService node. */
  name: string
  description: string
  /** E.164-ish display form, e.g. "+61 483 955 931". */
  telephone: string
  address: {
    streetAddress: string
    addressLocality: string
    /** State / province. Omitted for city-states such as Singapore. */
    addressRegion?: string
    postalCode: string
    /** ISO 3166-1 alpha-2 — "GB" for the UK, not "UK". */
    addressCountry: string
  }
  /** Cities the office serves, emitted as schema.org City nodes. */
  areaServedCities: string[]
  /** Countries the office serves, emitted as schema.org Country nodes. */
  areaServedCountries: string[]
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

  /**
   * The client proof band under the hero. The logos themselves are a
   * `regionLogoSet` document (see `src/sanity/regionLogos.ts`); only the copy
   * around them lives here.
   */
  clients: {
    eyebrow: string
    heading: string
    lead: string
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

  video: {
    eyebrow: string
    heading: string
    lead: string
    caption: string
    /** YouTube video ID, not a URL. */
    videoId: string
    /** Accessible title for the embed. */
    videoTitle: string
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

  /** Feeds the per-region ProfessionalService JSON-LD block. */
  localBusiness: RegionLocalBusiness
}

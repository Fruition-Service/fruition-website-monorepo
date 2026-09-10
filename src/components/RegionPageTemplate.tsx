import { bookingHref } from "@/lib/bookingLink"
import { faqTabsToPairs } from "@/lib/faqSchema"
import { urlFor } from "@/sanity/image"
import {
  CalendlySection,
  StickyCtaConfig,
  TestimonialsGrid,
} from "@/components/sections"
import type {
  CaseStudy,
  FaqTab,
  SanityImageRef,
  SiteSettingsData,
} from "@/components/sections/types"
import TeamGridSection, { type TeamMember } from "@/components/TeamGridSection"
import {
  AnswerBlockSection,
  ProcessStepsSection,
  RegionCoverageSection,
  RegionFaqSection,
  RegionHero,
  RegionNumbersSection,
  RegionServicesSection,
  RegionVideoSection,
  type RegionContent,
} from "@/components/region"

interface RegionSanityPage {
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  /** The wide monday.com product banner shown under the hero copy. */
  heroImage?: SanityImageRef
}

interface Props {
  content: RegionContent
  page: RegionSanityPage | null
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  /** Sanity-resolved FAQ tabs — appended after the region's own questions. */
  faqTabs?: FaqTab[]
  teamMembers: TeamMember[]
}

/** The marketing video every region page shares. */
const VIDEO_ID = "eoOCR6OjJhI"

function heroImageUrl(ref?: SanityImageRef | null): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(2000).fit("max").auto("format").url()
  } catch {
    return null
  }
}

/**
 * One template behind all six /monday-partner-* pages.
 *
 * Section copy comes from `src/data/regionPages.ts` (see region/types.ts for
 * why it isn't in Sanity). Sanity supplies SEO title/description, the primary
 * CTA label/URL, the hero banner image, the case studies, the team roster and
 * any extra FAQ entries.
 *
 * The redesigned sections deliberately do NOT fall back to the pre-redesign
 * Sanity headings (`heroHeading`, `testimonialsGridHeading`, `calendlyHeading`
 * and friends). Those were written for the old page and would override the new
 * copy on every region — and the new H1 splits into a plain half plus a purple
 * accent half, which a single stored string cannot express.
 */
export default function RegionPageTemplate({
  content,
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
  teamMembers,
}: Props) {
  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const bookingUrl = bookingHref(page?.primaryCtaUrl || rawCalendly)

  // Region questions first, then anything editors added in Sanity. The FAQ
  // component dedupes by question and builds its JSON-LD from what it renders.
  const faqItems = [...content.faq.items, ...faqTabsToPairs(faqTabs ?? [])]

  return (
    <div>
      <StickyCtaConfig label="Book a Free Consultation" href={bookingUrl} />

      <RegionHero
        hero={content.hero}
        flag={content.flag}
        heroImageUrl={heroImageUrl(page?.heroImage)}
        primaryCtaLabel={page?.primaryCtaLabel || "Book a Free Consultation →"}
        primaryCtaUrl={bookingUrl}
      />

      <RegionServicesSection services={content.services} />

      <AnswerBlockSection answerBlock={content.answerBlock} />

      <TestimonialsGrid
        heading={content.testimonials.heading}
        ctaLabel="Book a call"
        ctaUrl={bookingUrl}
        caseStudies={caseStudies}
      />

      <ProcessStepsSection process={content.process} />

      <RegionVideoSection
        heading="Watch: how Fruition builds monday.com systems"
        lead={`A walkthrough of a real ${content.country} implementation — from messy spreadsheets to a working system.`}
        caption="Fruition · monday.com implementation walkthrough"
        videoId={VIDEO_ID}
        videoTitle="How Fruition builds monday.com systems"
      />

      <RegionNumbersSection numbers={content.numbers} />

      <TeamGridSection
        heading={content.team.heading}
        subheading={content.team.lead}
        members={teamMembers}
        region={content.teamRegion}
      />

      <RegionCoverageSection coverage={content.coverage} />

      <RegionFaqSection
        heading={content.faq.heading}
        contactLead={content.faq.contactLead}
        items={faqItems}
      />

      {/*
        The design closes on a purple→midnight gradient CTA. BookingSection is
        already that gradient and already owns the `#book` anchor every CTA on
        the page resolves to, so it plays the closing-CTA role directly rather
        than sitting under a second, near-identical dark banner.
      */}
      <CalendlySection
        heading={content.closingCta.heading}
        subheading={content.closingCta.lead}
        calendlyUrl={rawCalendly}
        bookingRegion={content.bookingRegion}
      />
    </div>
  )
}

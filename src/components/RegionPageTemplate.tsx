import { bookingHref } from "@/lib/bookingLink"
import { mergeRegionContent, type RegionSanityContent } from "@/lib/mergeRegionContent"
import { urlFor } from "@/sanity/image"
import {
  CalendlySection,
  StickyCtaConfig,
  TestimonialsGrid,
} from "@/components/sections"
import type {
  CaseStudy,
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

type RegionSanityPage = RegionSanityContent & {
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  /** The wide monday.com product banner shown under the hero copy. */
  heroImage?: SanityImageRef
}

interface Props {
  /** Shipped copy from `src/data/regionPages.ts` — the fallback, not the source of truth. */
  content: RegionContent
  page: RegionSanityPage | null
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  teamMembers: TeamMember[]
}

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
 * Every word here is editable on the page's `locationPage` document in Sanity;
 * `mergeRegionContent` lays that document over the shipped copy in
 * `src/data/regionPages.ts`, so a blank field renders the shipped wording
 * instead of an empty section. Sanity also supplies the hero banner, the case
 * studies behind the testimonials, the team roster and the Calendly link.
 */
export default function RegionPageTemplate({
  content,
  page,
  siteSettings,
  caseStudies = [],
  teamMembers,
}: Props) {
  const region = mergeRegionContent(content, page)
  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const bookingUrl = bookingHref(page?.primaryCtaUrl || rawCalendly)

  return (
    <div>
      <StickyCtaConfig label="Book a Free Consultation" href={bookingUrl} />

      <RegionHero
        hero={region.hero}
        flag={region.flag}
        heroImageUrl={heroImageUrl(page?.heroImage)}
        primaryCtaLabel={page?.primaryCtaLabel || "Book a Free Consultation →"}
        primaryCtaUrl={bookingUrl}
      />

      <RegionServicesSection services={region.services} />

      <AnswerBlockSection answerBlock={region.answerBlock} />

      {/*
        The contact + booking band sits third, straight under the "who is the
        best partner" answer block: the page has just made its case, so the way
        to act on it is right there rather than ten sections down.

        It used to close the page — BookingSection is the purple→midnight
        gradient the design ends on — so nothing follows the FAQ now. The FAQ's
        own contact aside (a consultant + mailto) carries the bottom instead,
        and the sticky CTA bar stays available the whole way down.
      */}
      <CalendlySection
        heading={region.closingCta.heading}
        subheading={region.closingCta.lead}
        calendlyUrl={rawCalendly}
        bookingRegion={region.bookingRegion}
      />

      <TestimonialsGrid
        heading={region.testimonials.heading}
        ctaLabel="Book a call"
        ctaUrl={bookingUrl}
        caseStudies={caseStudies}
      />

      <ProcessStepsSection process={region.process} />

      <RegionVideoSection
        eyebrow={region.video.eyebrow}
        heading={region.video.heading}
        lead={region.video.lead}
        caption={region.video.caption}
        videoId={region.video.videoId}
        videoTitle={region.video.videoTitle}
      />

      <RegionNumbersSection numbers={region.numbers} />

      <TeamGridSection
        heading={region.team.heading}
        subheading={region.team.lead}
        members={teamMembers}
        region={region.teamRegion}
      />

      <RegionCoverageSection coverage={region.coverage} />

      {/*
        The page's only FAQ, and the source of its FAQPage structured data —
        the accordion builds the JSON-LD from what it renders. The old
        `faqTabs` array and the central `faqItem` fallback were dropped from
        these six pages when the questions moved onto the region document:
        three sources feeding one accordion is how edits went missing before.
      */}
      <RegionFaqSection
        heading={region.faq.heading}
        contactLead={region.faq.contactLead}
        items={region.faq.items}
      />
    </div>
  )
}

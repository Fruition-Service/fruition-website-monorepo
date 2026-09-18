import { bookingHref } from "@/lib/bookingLink"
import { mergeRegionContent, type RegionSanityContent } from "@/lib/mergeRegionContent"
import {
  CalendlySection,
  ClientProofSection,
  StickyCtaConfig,
  TestimonialsGrid,
} from "@/components/sections"
import type {
  CarouselLogo,
  CaseStudy,
  SiteSettingsData,
} from "@/components/sections/types"
import TeamGridSection, { type TeamMember } from "@/components/TeamGridSection"
import { filterTeamForRegionPage } from "@/lib/mergeTeamMembers"
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
}

interface Props {
  /** Shipped copy from `src/data/regionPages.ts` — the fallback, not the source of truth. */
  content: RegionContent
  page: RegionSanityPage | null
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  teamMembers: TeamMember[]
  /**
   * The client wall under the hero — this region's own `regionLogoSet`, or the
   * global carousel where no set has been curated yet. See
   * `src/sanity/regionLogos.ts`.
   */
  clientLogos?: CarouselLogo[]
  /** Studio override for the client-wall lead, from the same document. */
  clientLogosLead?: string
}

/** Nine tiles plus the counter cell — two full rows of five. */
const CLIENT_TILES = 9

/**
 * One template behind all six /monday-partner-* pages.
 *
 * Every word here is editable on the page's `locationPage` document in Sanity;
 * `mergeRegionContent` lays that document over the shipped copy in
 * `src/data/regionPages.ts`, so a blank field renders the shipped wording
 * instead of an empty section. Sanity also supplies the case studies behind
 * the testimonials, the team roster and the Calendly link.
 *
 * The hero graphic is the exception: it is a generated map of the region's own
 * country (see RegionMap), not an image, so `locationPage.heroImage` is not
 * read. To change which cities it marks, edit `src/data/regionMaps.ts` and
 * re-run `node scripts/build-region-maps.mjs`.
 */
export default function RegionPageTemplate({
  content,
  page,
  siteSettings,
  caseStudies = [],
  teamMembers,
  clientLogos = [],
  clientLogosLead,
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
        slug={region.slug}
        // The office country doubles as the hero flag — one source, so the
        // medallion can never drift from the address in the page's schema.
        flagCode={region.localBusiness.address.addressCountry.toLowerCase()}
        countryName={region.country}
        primaryCtaLabel={page?.primaryCtaLabel || "Book a Free Consultation →"}
        primaryCtaUrl={bookingUrl}
      />

      <RegionServicesSection services={region.services} />

      {/*
        The offer first, then the proof that backs it: the client wall and the
        quotes stay together as one unit and now follow the services list
        rather than running straight off the hero.
      */}
      <ClientProofSection
        eyebrow={region.clients.eyebrow}
        heading={region.clients.heading}
        lead={clientLogosLead?.trim() || region.clients.lead}
        logos={clientLogos}
        maxTiles={CLIENT_TILES}
        counterLabel="900+ more"
      />

      <TestimonialsGrid
        heading={region.testimonials.heading}
        ctaLabel="Book a call"
        ctaUrl={bookingUrl}
        caseStudies={caseStudies}
      />

      {/*
        The contact + booking band stays high on the page: the offer, then the
        proof, then the way to act on it — rather than ten sections down.

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

      <RegionVideoSection
        eyebrow={region.video.eyebrow}
        heading={region.video.heading}
        lead={region.video.lead}
        caption={region.video.caption}
        videoId={region.video.videoId}
        videoTitle={region.video.videoTitle}
      />

      <ProcessStepsSection process={region.process} />

      <RegionNumbersSection numbers={region.numbers} />

      {/*
        Regions show a shortened roster — leadership and implementation
        consultants with a real photo and bio, capped at three rows of three —
        then link through to the full team page for everyone else.

        `regionPageSlug` is what lets TeamGridSection apply the per-page pins
        (see REGION_PAGES_ONLY). It comes from the shipped content, not the
        Sanity overlay, so a Studio edit can't reroute it — and the grid drops
        pinned people when it's missing, so losing this line hides them rather
        than putting them back on all six pages.

        The same filter runs HERE too, and that is not redundant. This is a
        server component and the grid is a client one, so whatever is handed
        across that boundary is serialised into the page's flight payload —
        rendered or not. Filtering only inside the grid left a pinned person's
        name, bio and photo in the HTML source of all five other region pages,
        where crawlers and answer engines still read them. Drop them before the
        boundary; the grid re-checks after it.
      */}
      <TeamGridSection
        heading={region.team.heading}
        subheading={region.team.lead}
        members={filterTeamForRegionPage(teamMembers, content.slug)}
        region={region.teamRegion}
        regionPageSlug={content.slug}
        deliveryRosterOnly
        limit={9}
        footerLink={{
          label: "Meet the full Fruition delivery team",
          href: "/fruition-team",
        }}
      />

      {/*
        "Who is the best monday.com partner in X?" — the answer-engine block.
        It sits after the team grid rather than near the top: the claim reads
        as a summing-up once the page has shown the clients, the quotes, the
        method and the people, and an AI crawler quotes it just as happily
        from here.
      */}
      <AnswerBlockSection answerBlock={region.answerBlock} />

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

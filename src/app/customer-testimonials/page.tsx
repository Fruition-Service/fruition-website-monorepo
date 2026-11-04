import { bookingHref } from "@/lib/bookingLink"
import { getSiteSettings, getPageBySlug, getAllQuoteTestimonials } from "@/sanity/queries"
import { ClientLogoSection, CalendlySection, DiscoverCtaSection, CroSections, StickyCtaConfig, TestimonialFilterGrid } from "@/components/sections"
import type { SanityImageRef } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import { HubHero, HubSection } from "@/components/hubs/HubSections"
import TestimonialQuoteGrid from "@/components/hubs/TestimonialQuoteGrid"
import { buildTestimonialCards, testimonialFilterTags } from "@/lib/testimonials"
import { buildOgMetadata } from "@/lib/metadata"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import type { CaseStudyStoryContent } from "@/components/sections/CaseStudyStory"

export async function generateMetadata() {
  const page = await getPageBySlug("customer-testimonials")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/customer-testimonials" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/customer-testimonials",
    }),
  }
}

interface CaseStudyCard extends Omit<CaseStudyStoryContent, "logoUrl" | "quotePeople"> {
  _key?: string
  title?: string
  image?: SanityImageRef | string
  product?: string
  industry?: string
  services?: string
  timeline?: string
  verifiedSource?: string
  logo?: SanityImageRef
  quotePeople?: { name?: string; role?: string; company?: string; photo?: SanityImageRef }[]
}

function imageUrl(ref: SanityImageRef | undefined, width: number): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(width).fit("max").auto("format").url()
  } catch {
    return null
  }
}

function getCaseStudyImageSrc(image?: SanityImageRef | string): string | null {
  if (!image) return null
  // Support both Sanity image refs and legacy string paths
  if (typeof image === "string") return image
  return imageUrl(image, 1600)
}

export default async function CustomerTestimonialsPage() {
  const [siteSettings, page, quoteDocs] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("customer-testimonials"),
    getAllQuoteTestimonials(),
  ])

  const rawCalendly = siteSettings?.calendlyLink || ""
  const calendlyUrl = bookingHref(rawCalendly)

  const primaryCtaLabel = page?.primaryCtaLabel
  const primaryCtaUrl = page?.primaryCtaUrl || calendlyUrl

  const logoCloudPart1 = page?.logoCloudHeadingPart1
  const logoCloudAccent = page?.logoCloudHeadingAccent

  const caseStudyCards: CaseStudyCard[] = (page?.caseStudyCards ?? []) as CaseStudyCard[]
  const testimonials = buildTestimonialCards(quoteDocs ?? [], caseStudyCards)

  const calendlyHeading = page?.calendlyHeading
  const calendlySubheading = page?.calendlySubheading

  const discoverHeading = page?.discoverHeading
  const discoverPrimaryLabel = page?.discoverPrimaryCtaLabel
  const discoverPrimaryUrl = page?.discoverPrimaryCtaUrl || calendlyUrl
  const discoverSecondaryLabel = page?.discoverSecondaryCtaLabel
  const discoverSecondaryUrl = page?.discoverSecondaryCtaUrl || calendlyUrl

  return (
    <div>
      <StickyCtaConfig label={page?.croSections?.stickyCtaLabel} mobileLabel={page?.croSections?.stickyCtaMobileLabel} href={bookingHref(page?.croSections?.stickyCtaUrl || rawCalendly)} />
      <HubHero
        heading="Customer stories"
        accent="and case studies"
        lead="Read what Fruition's clients say in their own words, then see how the work was done in our verified case studies. Filter by industry or platform to find a team like yours."
      />

      {/* Client logos */}
      {(logoCloudPart1 || logoCloudAccent) && (
        <ClientLogoSection
          headingPart1={logoCloudPart1}
          headingAccent={logoCloudAccent}
          logos={siteSettings?.carouselLogos || []}
        />
      )}

      {/* Testimonials, word for word from Sanity, filterable by industry & platform */}
      {testimonials.length > 0 && (
        <HubSection eyebrow="In their words" heading="What our clients say" subtle>
          <TestimonialQuoteGrid cards={testimonials} tags={testimonialFilterTags(testimonials)} />
        </HubSection>
      )}

      {/* Case studies — filterable by industry & solution */}
      <TestimonialFilterGrid
        heading={page?.caseStudySectionHeading || "Case studies"}
        subheading="Eight verified client implementations, with the problem, the build and the result."
        cards={caseStudyCards.map((s) => ({
          _key: s._key,
          title: s.title,
          product: s.product,
          industry: s.industry,
          services: s.services,
          timeline: s.timeline,
          verifiedSource: s.verifiedSource,
          imageUrl: getCaseStudyImageSrc(s.image),
          clientName: s.clientName,
          logoUrl: imageUrl(s.logo, 400),
          quote: s.quote,
          quotePeople: s.quotePeople?.map((p) => ({
            name: p.name,
            role: p.role,
            company: p.company,
            photoUrl: imageUrl(p.photo, 112),
          })),
          challenge: s.challenge,
          solution: s.solution,
          impactMetrics: s.impactMetrics,
          impact: s.impact,
          location: s.location,
          companySize: s.companySize,
          sector: s.sector,
          useCase: s.useCase,
        }))}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* CRO action items */}
      <CroSections data={page?.croSections} primaryCtaLabel={primaryCtaLabel} primaryCtaUrl={primaryCtaUrl} />

      {/* Calendly */}
      {(calendlyHeading || calendlySubheading) && (
        <CalendlySection
          heading={calendlyHeading}
          subheading={calendlySubheading}
          calendlyUrl={rawCalendly}
        />
      )}

      {/* Final CTA */}
      {discoverHeading && (
        <DiscoverCtaSection
          badge={siteSettings?.badgeCertifications}
          heading={discoverHeading}
          primaryCtaLabel={discoverPrimaryLabel}
          primaryCtaUrl={discoverPrimaryUrl}
          secondaryCtaLabel={discoverSecondaryLabel}
          secondaryCtaUrl={discoverSecondaryUrl}
        />
      )}
    </div>
  )
}

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

interface CaseStudyCard {
  _key?: string
  title?: string
  image?: SanityImageRef | string
  product?: string
  industry?: string
  services?: string
  timeline?: string
  verifiedSource?: string
}

/**
 * The Sanity card images are only 797x421, but the card renders them full-bleed
 * at up to ~1088 CSS px (~2176 device px at 2x), so small in-image text was
 * upscaled and pixelated. Known cards are served from local high-res AVIFs
 * (generated from the original captures in public/images), keyed by the Sanity
 * card `_key`. Cards without an entry fall back to their Sanity image.
 */
const HIGH_RES_CASE_STUDY_IMAGES: Record<string, { src: string; srcSet: string }> = {
  "cs-bl-air": {
    src: "/case-studies/bl-air.avif",
    srcSet: "/case-studies/bl-air-1200.avif 1200w, /case-studies/bl-air.avif 2400w",
  },
  "cs-clsq": {
    src: "/case-studies/clsq.avif",
    srcSet: "/case-studies/clsq-1200.avif 1200w, /case-studies/clsq.avif 2400w",
  },
  "cs-givergy": {
    src: "/case-studies/givergy.avif",
    srcSet: "/case-studies/givergy-1200.avif 1200w, /case-studies/givergy.avif 2400w",
  },
  "cs-hvac": {
    src: "/case-studies/hvac.avif",
    srcSet: "/case-studies/hvac-1200.avif 1200w, /case-studies/hvac.avif 2400w",
  },
  "cs-popology": {
    src: "/case-studies/popology.avif",
    srcSet: "/case-studies/popology-1200.avif 1200w, /case-studies/popology.avif 2400w",
  },
  "cs-promotify": {
    src: "/case-studies/promotify.avif",
    srcSet: "/case-studies/promotify-1200.avif 1200w, /case-studies/promotify.avif 2400w",
  },
  "cs-r2s": {
    src: "/case-studies/r2s.avif",
    srcSet: "/case-studies/r2s-1200.avif 1200w, /case-studies/r2s.avif 2400w",
  },
  "cs-tourism-nt": {
    src: "/case-studies/tourism-nt.avif",
    srcSet: "/case-studies/tourism-nt-1200.avif 1200w, /case-studies/tourism-nt.avif 2400w",
  },
}

function cardImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(1600).fit("max").auto("format").url()
  } catch {
    return null
  }
}

function getCaseStudyImageSrc(image?: SanityImageRef | string): string | null {
  if (!image) return null
  // Support both Sanity image refs and legacy string paths
  if (typeof image === "string") return image
  return cardImageUrl(image)
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
        eyebrow="Customers"
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
        cards={caseStudyCards.map((s) => {
          const highRes = s._key ? HIGH_RES_CASE_STUDY_IMAGES[s._key] : undefined
          return {
            _key: s._key,
            title: s.title,
            product: s.product,
            industry: s.industry,
            services: s.services,
            timeline: s.timeline,
            verifiedSource: s.verifiedSource,
            imageUrl: highRes ? highRes.src : getCaseStudyImageSrc(s.image),
            imageSrcSet: highRes?.srcSet,
          }
        })}
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

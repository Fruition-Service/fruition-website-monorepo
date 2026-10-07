import { bookingHref } from "@/lib/bookingLink"
import { getSiteSettings, getPageBySlug } from "@/sanity/queries"
import { ClientLogoSection, CalendlySection, DiscoverCtaSection, CroSections, StickyCtaConfig, TestimonialFilterGrid } from "@/components/sections"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import FramedMedia from "@/components/common/FramedMedia"
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

/** Rendered height of a hero partner badge, in CSS pixels. */
const BADGE_HEIGHT = 44

/**
 * Partner badges render at `h-[44px] w-auto`, so constrain by height only —
 * these are wide wordmarks and a square crop lops the name off. `fit=max`
 * preserves the aspect ratio and never upscales past the source.
 */
function badgeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).height(BADGE_HEIGHT * 2).fit("max").auto("format").url()
  } catch {
    return null
  }
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
  const [siteSettings, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("customer-testimonials"),
  ])

  const rawCalendly = siteSettings?.calendlyLink || ""
  const calendlyUrl = bookingHref(rawCalendly)
  const partnerBadges: PartnerBadge[] = page?.heroPartnerBadges?.length > 0
    ? page.heroPartnerBadges
    : siteSettings?.navbarPartnerBadges || []

  const heroHeading = page?.heroHeading
  const heroSubheading = page?.heroSubheading
  const heroBody = page?.heroBody
  const primaryCtaLabel = page?.primaryCtaLabel
  const primaryCtaUrl = page?.primaryCtaUrl || calendlyUrl
  const secondaryCtaLabel = page?.secondaryCtaLabel
  const secondaryCtaUrl = page?.secondaryCtaUrl

  const logoCloudPart1 = page?.logoCloudHeadingPart1
  const logoCloudAccent = page?.logoCloudHeadingAccent

  const caseStudyCards: CaseStudyCard[] = (page?.caseStudyCards ?? []) as CaseStudyCard[]

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
      {/* Hero */}
      <section className="bg-surface">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 80, paddingBottom: 80, maxWidth: 1200 }}
        >
          {partnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = badgeImageUrl(badge.image)
                if (!src) return null
                // Reserve the badge's real footprint so it doesn't shift on load —
                // these wordmarks are all different shapes.
                const intrinsicWidth =
                  badge.width && badge.height
                    ? Math.round((badge.width / badge.height) * BADGE_HEIGHT)
                    : 120
                return (
                  <FramedMedia key={badge._key || `badge-${i}`} className="dark:p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={badge.name || "Partner badge"}
                      width={intrinsicWidth}
                      height={BADGE_HEIGHT}
                      className="h-[44px] w-auto rounded-[5px]"
                    />
                  </FramedMedia>
                )
              })}
            </div>
          )}

          {heroHeading && (
            <h1
              className="text-center font-bold"
              style={{
                fontSize: "clamp(32px, 8vw, 48px)",
                lineHeight: "1.2",
                marginTop: partnerBadges.length > 0 ? 42 : 0,
                maxWidth: 924,
                color: "var(--text-body)",
              }}
            >
              {heroHeading}
            </h1>
          )}

          {heroSubheading && (
            <p
              className="text-center"
              style={{
                fontSize: 18,
                lineHeight: "28px",
                color: "var(--text-body)",
                marginTop: 24,
                maxWidth: 860,
              }}
            >
              {heroSubheading}
            </p>
          )}

          {heroBody && (
            <p
              className="text-center"
              style={{
                fontSize: 16,
                lineHeight: "26px",
                color: "var(--text-body)",
                marginTop: 16,
                maxWidth: 860,
              }}
            >
              {heroBody}
            </p>
          )}

          {(primaryCtaLabel || secondaryCtaLabel) && (
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: 20, marginTop: 40 }}
            >
              {primaryCtaLabel && (
                <CtaButton
                  href={primaryCtaUrl}
                  label={primaryCtaLabel}
                  variant="primary"
                  style={{ width: 260 }}
                />
              )}
              {secondaryCtaLabel && (
                <CtaButton
                  href={secondaryCtaUrl || "#case-studies"}
                  label={secondaryCtaLabel}
                  variant="outline"
                  style={{ width: 260 }}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Client logos */}
      {(logoCloudPart1 || logoCloudAccent) && (
        <ClientLogoSection
          headingPart1={logoCloudPart1}
          headingAccent={logoCloudAccent}
          logos={siteSettings?.carouselLogos || []}
        />
      )}

      {/* Case studies — filterable by industry & solution */}
      <TestimonialFilterGrid
        heading={page?.caseStudySectionHeading}
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

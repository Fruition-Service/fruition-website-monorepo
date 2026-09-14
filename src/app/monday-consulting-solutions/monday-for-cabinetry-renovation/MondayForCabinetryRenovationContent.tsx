"use client"

import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import { Check } from "lucide-react"
import { urlFor } from "@/sanity/image"
import {
  HeroBanner,
  ClientLogoSection,
  CapabilitiesGrid,
  ComparisonTabsSection,
  CalendlySection,
  SolutionCardsSection,
} from "@/components/sections"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  ComparisonTab,
} from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined
function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(800).auto("format").url()
  } catch {
    return null
  }
}

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

// Fallback content (used only when Sanity fields empty). Sourced originally from
// https://www.fruitionservices.io/monday-consulting-solutions/monday-for-cabinetry-renovation




/* -------- Key Features + Services -------- */
function KeyFeaturesSection({
  keyFeaturesPart1,
  keyFeaturesAccent,
  keyFeatures,
  servicesPart1,
  servicesAccent,
  services,
}: {
  keyFeaturesPart1: string
  keyFeaturesAccent: string
  keyFeatures: { title: string; body: string }[]
  servicesPart1: string
  servicesAccent: string
  services: string[]
}) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 w-full max-w-[1100px] gap-10 md:gap-12">
        <div>
          <h2 className="text-section-h2 text-body mb-6">
            {keyFeaturesPart1} <span className="text-brand">{keyFeaturesAccent}</span>
          </h2>
          <ul className="flex flex-col gap-3.5">
            {keyFeatures.map((f) => (
              <li key={f.title} className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-brand" aria-hidden />
                <p className="text-body-sm text-body">
                  <span className="font-bold">{f.title}:</span> {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-section-h2 text-body mb-6">
            {servicesPart1} <span className="text-brand">{servicesAccent}</span>
          </h2>
          <ul className="flex flex-col gap-3.5">
            {services.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <Check size={16} className="shrink-0 text-brand" aria-hidden />
                <p className="text-body-sm text-body">{s}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* -------- Stats banner with rotating testimonials -------- */
type InlineTestimonial = {
  quote: string
  name: string
  role: string
  company: string
  photo: string
}

function ReturnsBannerSection({
  heading,
  subheading,
  testimonials,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}: {
  heading: string
  subheading: string
  testimonials: InlineTestimonial[]
  primaryLabel: string
  primaryUrl: string
  secondaryLabel: string
  secondaryUrl: string
}) {
  return (
    <section className="px-4 relative overflow-hidden py-14 md:py-24 bg-gradient-to-br from-surface-dark-2 to-surface-dark">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-section-h2 text-center text-white mb-3">
          {heading}
        </h2>
        <p className="text-center text-body-lead text-white/80 mb-12">
          {subheading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-surface-raised dark:shadow-none dark:border dark:border-ui rounded-card p-6 flex flex-col gap-4"
            >
              <blockquote className="text-sm leading-[22px] text-body">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center mt-auto gap-3">
                {t.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.photo}
                    alt={t.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover w-14 h-14 shrink-0"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="rounded-full w-14 h-14 shrink-0 bg-brand-soft text-brand flex items-center justify-center font-bold"
                  >
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-body text-sm">{t.name}</p>
                  <p className="text-muted text-xs">{t.role}</p>
                  <p className="text-brand text-xs font-bold">{t.company}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Link
            href={primaryUrl}
            className="cta-btn cta-btn-on-dark-primary"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryUrl}
            className="cta-btn cta-btn-on-dark-outline"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function MondayForCabinetryRenovationContent({ page, siteSettings }: Props) {
  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const calendlyUrl = bookingHref(rawCalendly)

  // CapabilitiesCards holds the challenges set for this page.
  const challengeCards = page.capabilitiesCards ?? []
  const solutionCards = (page.solutionCards ?? []).map((card: any) => {
    const sanityImg = safeImageUrl(card.image)
    if (sanityImg) return { ...card, imageSrc: sanityImg }
    return card
  })
  const solutionTop = solutionCards.slice(0, 2)
  const solutionBottom = solutionCards.slice(2)

  // Sanity-driven values with hardcoded fallbacks (preserves current visual output).
  const keyFeatures =
    page.keyFeatures ?? []
  const servicesList =
    page.servicesListItems ?? []
  const inlineTestimonials: InlineTestimonial[] =
    page.inlineTestimonials?.length > 0
      ? page.inlineTestimonials.map((t: any) => ({
          quote: t.quote ?? "",
          name: t.name ?? "",
          role: t.role ?? "",
          company: t.company ?? "",
          photo: safeImageUrl(t.photo) ?? "",
        }))
      : []
  const beforeAfterTabs: ComparisonTab[] =
    page.beforeAfterTabs ?? []

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroImageUrl={page.heroImageUrl || "/images/cabinetry-hero.png"}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "Book a Consultation"}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel || "Get Started with monday.com"}
        secondaryCtaUrl={page.secondaryCtaUrl || "https://monday.com"}
      />

      {/* Trusted-by caption */}
      <section className="bg-surface px-4 pt-0 pb-6">
        <p className="text-center text-sm font-semibold text-body">
          {page.trustedByCaption || "Trusted by 900+ businesses worldwide"}
        </p>
      </section>

      {/* 2. Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1 || "900+ clients globally use Fruition's "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consultants"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Facing these challenges? */}
      {challengeCards.length > 0 && (
        <CapabilitiesGrid
          heading={page.capabilitiesHeading || "Facing these "}
          headingAccent={page.capabilitiesHeadingAccent ?? "challenges?"}
          theme="light"
          columns={3}
          cards={challengeCards}
        />
      )}

      {/* 4. Key Features + Services */}
      <KeyFeaturesSection
        keyFeaturesPart1={page.keyFeaturesHeadingPart1 || "Key"}
        keyFeaturesAccent={page.keyFeaturesHeadingAccent || "Features"}
        keyFeatures={keyFeatures}
        servicesPart1={page.servicesListHeadingPart1 || "Our"}
        servicesAccent={page.servicesListHeadingAccent || "Services"}
        services={servicesList}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 5. Solution cards — top pair (PROJECT SCHEDULING + INVENTORY TRACKING) */}
      {solutionTop.length > 0 && <SolutionCardsSection cards={solutionTop} />}

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule Your Personalised Demo with A monday.com Expert"}
        subheading={
          page.calendlySubheading ||
          "Book a time with one of our certified monday.com consultants to see how monday.com can be customized for your cabinetry renovation and installation business and start your free 4-week extended trial."
        }
        calendlyUrl={rawCalendly}
      />

      {/* 7. Solution cards — bottom pair (CLIENT COMMUNICATION + CHANGE ORDER MANAGEMENT) */}
      {solutionBottom.length > 0 && <SolutionCardsSection cards={solutionBottom} />}

      {/* 8. Returns banner + testimonials carousel */}
      <ReturnsBannerSection
        heading={page.returnsBannerHeading || "We bring real returns on investment."}
        subheading={
          page.returnsBannerSubheading ||
          "Join 900+ organisations that have implemented with us."
        }
        testimonials={inlineTestimonials}
        primaryLabel={page.returnsBannerPrimaryLabel || "Book a Consultation"}
        primaryUrl={bookingHref(page.returnsBannerPrimaryUrl || calendlyUrl)}
        secondaryLabel={page.returnsBannerSecondaryLabel || "Get Started with monday.com"}
        secondaryUrl={page.returnsBannerSecondaryUrl || "https://monday.com"}
      />

      {/* 9. Before vs After (sideBySide, both columns) */}
      <ComparisonTabsSection
        heading={page.comparisonHeading || "Before vs After"}
        tabs={beforeAfterTabs}
        theme="light"
        layout="sideBySide"
        withPurpleCircle={false}
      />
    </div>
  )
}

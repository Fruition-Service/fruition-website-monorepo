"use client"

import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import { Check } from "lucide-react"
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
} from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

type KeyFeature = { title?: string; body?: string }
type SolarTestimonial = {
  quote?: string
  name?: string
  role?: string
  company?: string
  photo?: string
}
type JoinStat = { value?: string; label?: string }

/* -------- Key Features + Services -------- */
function KeyFeaturesSection({
  features,
  services,
  featuresHeadingPart1,
  featuresHeadingAccent,
  servicesHeadingPart1,
  servicesHeadingAccent,
}: {
  features: KeyFeature[]
  services: string[]
  featuresHeadingPart1?: string
  featuresHeadingAccent?: string
  servicesHeadingPart1?: string
  servicesHeadingAccent?: string
}) {
  if (features.length === 0 && services.length === 0) return null
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 w-full max-w-[1100px] gap-10 md:gap-12">
        <div>
          <h2 className="text-section-h2 text-body mb-6">
            {featuresHeadingPart1}
            {featuresHeadingAccent && (
              <span className="text-brand">{featuresHeadingAccent}</span>
            )}
          </h2>
          <ul className="flex flex-col gap-3.5">
            {features.map((f, i) => (
              <li key={f.title || i} className="flex items-start gap-2.5">
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
            {servicesHeadingPart1}
            {servicesHeadingAccent && (
              <span className="text-brand">{servicesHeadingAccent}</span>
            )}
          </h2>
          <ul className="flex flex-col gap-3.5">
            {services.map((s, i) => (
              <li key={s || i} className="flex items-start gap-2.5">
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
function ReturnsBannerSection({
  heading,
  subheading,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
  testimonials,
}: {
  heading?: string
  subheading?: string
  primaryLabel?: string
  primaryUrl?: string
  secondaryLabel?: string
  secondaryUrl?: string
  testimonials: SolarTestimonial[]
}) {
  return (
    <section className="px-4 relative overflow-hidden py-14 md:py-24 bg-gradient-to-br from-surface-dark-2 to-surface-dark">
      <div className="mx-auto w-full max-w-[1100px]">
        {heading && (
          <h2 className="text-section-h2 text-center text-white mb-3">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-center text-body-lead text-white/80 mb-12">
            {subheading}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <figure
              key={t.name || i}
              className="bg-surface rounded-card p-6 flex flex-col gap-4"
            >
              <blockquote className="text-sm leading-[22px] text-body">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center mt-auto gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.photo}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-14 h-14 shrink-0"
                />
                <div>
                  <p className="font-bold text-surface-dark text-sm">{t.name}</p>
                  <p className="text-muted text-xs">{t.role}</p>
                  <p className="text-brand text-xs font-bold">{t.company}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {(primaryLabel || secondaryLabel) && (
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {primaryLabel && primaryUrl && (
              <Link
                href={primaryUrl}
                className="cta-btn cta-btn-on-dark-primary"
              >
                {primaryLabel}
              </Link>
            )}
            {secondaryLabel && secondaryUrl && (
              <Link
                href={secondaryUrl}
                className="cta-btn cta-btn-on-dark-outline"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/* -------- Final 4-stat grid -------- */
function FinalStatsSection({ stats }: { stats: JoinStat[] }) {
  if (stats.length === 0) return null
  return (
    <section className="bg-surface px-4 pt-14 pb-20 md:pt-16 md:pb-24">
      <div className="mx-auto grid grid-cols-2 md:grid-cols-4 text-center w-full max-w-[1100px] gap-6">
        {stats.map((s, i) => (
          <div key={s.label || i}>
            <p className="text-section-h3 text-brand">
              {s.value}
            </p>
            <p className="mt-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function SolarCrmSolutionContent({ page, siteSettings }: Props) {
  if (!page) return null

  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const calendlyUrl = bookingHref(rawCalendly)

  const secondaryCards = page.secondaryCapabilitiesCards ?? []
  const solutionCards = page.solutionCards ?? []
  const solutionTop = solutionCards.slice(0, 2)
  const solutionBottom = solutionCards.slice(2)

  const keyFeatures: KeyFeature[] = page.keyFeatures ?? []
  const services: string[] = page.servicesList ?? []
  const testimonials: SolarTestimonial[] = page.solarTestimonials ?? []
  const joinStats: JoinStat[] = page.joinStats ?? []
  const beforeAfterTabs = page.beforeAfterTabs ?? []

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={page.heroPartnerBadges ?? []}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl}
      />

      {/* "Trusted by 300+ businesses worldwide" caption */}
      {page.trustedByCaption && (
        <section className="bg-surface px-4 pt-0 pb-6">
          <p className="text-center text-sm font-semibold text-body">
            {page.trustedByCaption}
          </p>
        </section>
      )}

      {/* 2. Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Facing these challenges? */}
      {secondaryCards.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.secondaryCapabilitiesEyebrow}
          heading={page.secondaryCapabilitiesHeading}
          headingAccent={page.secondaryCapabilitiesHeadingAccent}
          subheading={page.secondaryCapabilitiesSubheading}
          theme="light"
          columns={3}
          cards={secondaryCards}
        />
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 4. Key Features + Services 2-column section */}
      <KeyFeaturesSection
        features={keyFeatures}
        services={services}
        featuresHeadingPart1={page.keyFeaturesHeadingPart1}
        featuresHeadingAccent={page.keyFeaturesHeadingAccent}
        servicesHeadingPart1={page.servicesListHeadingPart1}
        servicesHeadingAccent={page.servicesListHeadingAccent}
      />

      {/* 5. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 6. Solution cards — top pair */}
      {solutionTop.length > 0 && <SolutionCardsSection cards={solutionTop} />}

      {/* 7. Returns banner with testimonials + CTAs */}
      <ReturnsBannerSection
        heading={page.returnsBannerHeading}
        subheading={page.returnsBannerSubheading}
        primaryLabel={page.returnsBannerPrimaryLabel}
        primaryUrl={bookingHref(page.returnsBannerPrimaryUrl || rawCalendly)}
        secondaryLabel={page.returnsBannerSecondaryLabel}
        secondaryUrl={page.returnsBannerSecondaryUrl}
        testimonials={testimonials}
      />

      {/* 8. Solution cards — bottom pair */}
      {solutionBottom.length > 0 && <SolutionCardsSection cards={solutionBottom} />}

      {/* 9. Before vs After comparison */}
      {beforeAfterTabs.length > 0 && (
        <ComparisonTabsSection
          heading="Before vs After"
          tabs={beforeAfterTabs}
          theme="light"
          layout="sideBySide"
          withPurpleCircle={false}
        />
      )}

      {/* 10. Final 4-stat grid */}
      <FinalStatsSection stats={joinStats} />
    </div>
  )
}

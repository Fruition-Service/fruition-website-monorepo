"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  ServicesCardsGrid,
  CapabilitiesGrid,
} from "@/components/sections"
import type { CaseStudy, FaqTab, SiteSettingsData } from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface AiStrategyContentProps {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

export default function AiStrategyContent({
  page,
  siteSettings,
  faqTabs,
}: AiStrategyContentProps) {
  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const resolvedFaqTabs =
    faqTabs && faqTabs.length > 0 ? faqTabs : page.faqTabs ?? []

  return (
    <div>
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroImageUrl={page.heroImageUrl}
        heroImageContain
        heroImageMaxHeight={520}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
      />

      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {page.capabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.capabilitiesEyebrow}
          heading={page.capabilitiesHeading}
          headingAccent={page.capabilitiesHeadingAccent}
          subheading={page.capabilitiesSubheading}
          theme={page.capabilitiesTheme || "light"}
          columns={
            page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
              ? page.capabilitiesColumns
              : undefined
          }
          cards={page.capabilitiesCards}
          ctaLabel={page.capabilitiesCtaLabel}
          ctaUrl={page.capabilitiesCtaUrl}
        />
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {page.comparisonTabs?.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={page.comparisonTabs}
          theme={page.comparisonTheme || "light"}
        />
      )}

      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {resolvedFaqTabs.length > 0 && <FaqAccordion tabs={resolvedFaqTabs} />}

      {page.servicesCards?.length > 0 && (
        <ServicesCardsGrid
          heading={page.servicesHeading}
          headingAccent={page.servicesHeadingAccent}
          subheading={page.servicesSubheading}
          theme={page.servicesTheme || "dark"}
          cards={page.servicesCards}
        />
      )}

    </div>
  )
}

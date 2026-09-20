"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  CapabilitiesGrid,
  SolutionCardsSection,
  CaseStudyCardsSection,
  IndustryTabsSection,
  TestimonialsGrid,
  DiscoverCtaSection,
  JoinStatsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, FaqTab } from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

// Hardcoded fallbacks — kept as defaults so the page renders correctly
// while Sanity is being migrated. When the corresponding field is populated
// on the solutionPage doc, the FE prefers Sanity.
const PM_LOGO_CLOUD_PART1 = "Clients who have used our "
const PM_LOGO_CLOUD_ACCENT = "monday.com consulting services"
const PM_TB_HEADING_PART1 = "Join "
const PM_TB_HEADING_ACCENT = "900+ organisations"
const PM_TB_HEADING_PART2 =
  " that have maximised their workflows with our monday.com expert support"


export default function MondayProjectManagementContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const comparisonTabs = page.comparisonTabs ?? []
  const capabilitiesColumns =
    page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
      ? page.capabilitiesColumns
      : undefined

  const featuredTestimonial = caseStudies[0]

  const PM_CALENDLY_HEADING =
    "Book Your Personalised Demo With a monday.com Project Management Expert"
  const PM_CALENDLY_SUBHEADING =
    "Schedule a demo with our certified monday.com consultants to explore how Monday.com can streamline your project management workflows. Discover custom solutions for planning, tracking, and reporting projects, and receive a 4-week extended trial."

  const calendlyHeading = page.calendlyHeading || PM_CALENDLY_HEADING
  const calendlySubheading = page.calendlySubheading || PM_CALENDLY_SUBHEADING

  const resolvedFaqTabs = faqTabs ?? []

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
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

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1 || PM_LOGO_CLOUD_PART1}
        headingAccent={page.logoCloudHeadingAccent ?? PM_LOGO_CLOUD_ACCENT}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 1. Three-tab comparison section */}
      {comparisonTabs.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={comparisonTabs}
          theme={page.comparisonTheme || "light"}
          layout={page.comparisonLayout === "sideBySide" ? "sideBySide" : "tabs"}
          withPurpleCircle={page.comparisonWithPurpleCircle ?? true}
        />
      )}

      {/* 2. Calendly */}
      <CalendlySection
        heading={calendlyHeading}
        subheading={calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 3. FAQ */}
      <FaqAccordion tabs={resolvedFaqTabs} />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 4. Case studies */}
      {page.caseStudyCards?.length > 0 && (
        <CaseStudyCardsSection
          heading={page.caseStudySectionHeading}
          cards={page.caseStudyCards}
        />
      )}

      {/* 5. monday.com PM Capabilities */}
      {page.capabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.capabilitiesEyebrow}
          heading={page.capabilitiesHeading}
          headingAccent={page.capabilitiesHeadingAccent}
          subheading={page.capabilitiesSubheading}
          theme={page.capabilitiesTheme || "light"}
          columns={capabilitiesColumns}
          cards={page.capabilitiesCards}
          ctaLabel={page.capabilitiesCtaLabel}
          ctaUrl={page.capabilitiesCtaUrl}
          ctaSecondaryLabel={page.capabilitiesCtaSecondaryLabel}
          ctaSecondaryUrl={page.capabilitiesCtaSecondaryUrl}
        />
      )}

      {/* 6. Solution cards — "The project management solution for your biggest challenges" */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 7. Implement monday.com for any industry */}
      {page.industryTabs?.length > 0 && (
        <IndustryTabsSection
          heading={page.industryHeading}
          tabs={page.industryTabs}
        />
      )}

      {/* Closing sections (testimonials / discover / stats / banner) — security badge omitted */}
      {!page.hideTestimonialsSection && <TestimonialsGrid caseStudies={caseStudies} />}
      {!page.hideDiscoverSection && (
        <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />
      )}
      {!page.hideJoinStatsSection && page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel}
          ctaUrl={bookingHref(page.joinCtaUrl || calendlyUrl)}
          siteSettings={siteSettings || undefined}
        />
      )}
      {!page.hideTestimonialBanner && (
        <TestimonialCtaBanner
          headingPart1={
            page.testimonialBannerHeadingPart1 ||
            page.joinHeadingPart1 ||
            PM_TB_HEADING_PART1
          }
          headingAccent={
            page.testimonialBannerHeadingAccent ||
            page.joinHeadingAccent ||
            PM_TB_HEADING_ACCENT
          }
          headingPart2={
            page.testimonialBannerHeadingPart2 ||
            page.joinHeadingPart2 ||
            PM_TB_HEADING_PART2
          }
          primaryCtaUrl={calendlyUrl}
          secondaryCtaUrl={calendlyUrl}
          testimonial={featuredTestimonial}
          testimonials={caseStudies}
        />
      )}
    </div>
  )
}

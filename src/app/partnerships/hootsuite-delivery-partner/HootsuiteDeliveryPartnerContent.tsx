"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  JoinStatsSection,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
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

export default function HootsuiteDeliveryPartnerContent({
  page,
  siteSettings,
}: Props) {
  if (!page) return null
  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

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
        primaryCtaLabel={page.primaryCtaLabel || "Book a Consultation"}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
      />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Comparison Tabs (Hootsuite Features / Our Hootsuite Services) */}
      {page.comparisonTabs?.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={page.comparisonTabs}
          theme={page.comparisonTheme || "light"}
          withPurpleCircle={false}
        />
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* YouTube video below tab section */}
      <section className="bg-surface px-4 pt-6 pb-14 md:pb-24">
        <div className="mx-auto w-full max-w-[980px]">
          <div className="rounded-card overflow-hidden aspect-video">
            <YouTubeEmbed
              url={page.bottomVideoUrl || undefined}
              videoId={page.bottomVideoUrl ? undefined : "7zC5uxk0lc8"}
              title={page.bottomVideoTitle || "Hootsuite overview"}
            />
          </div>
        </div>
      </section>

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* Join Stats */}
      {page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel || "BOOK A MEETING"}
          ctaUrl={bookingHref(page.joinCtaUrl || calendlyUrl)}
          siteSettings={siteSettings || undefined}
        />
      )}
    </div>
  )
}

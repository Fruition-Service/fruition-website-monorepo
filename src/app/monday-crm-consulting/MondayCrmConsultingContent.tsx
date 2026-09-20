"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import {
  ClientLogoSection,
  ComparisonTabsSection,
  TestimonialsGrid,
  CalendlySection,
  FaqAccordion,
  CapabilitiesGrid,
  CroSections,
  StickyCtaConfig,
  SolutionSelector,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, FaqTab } from "@/components/sections/types"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface MondayCrmConsultingContentProps {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

function youtubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url
      const v = u.searchParams.get("v")
      return v ? `https://www.youtube.com/embed/${v}` : null
    }
  } catch {
    return null
  }
  return null
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(800).auto("format").url()
  } catch {
    return null
  }
}

export default function MondayCrmConsultingContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: MondayCrmConsultingContentProps) {
  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const heroImageSrc = safeImageUrl(page.heroImage)
  const heroVideoEmbedSrc = youtubeEmbedUrl(page.heroVideoUrl)
  const bottomVideoEmbedSrc = youtubeEmbedUrl(page.bottomVideoUrl)

  const comparisonTabs = page.comparisonTabs ?? []
  const methodologySteps = page.methodologySteps ?? []
  const shouldMergeMethodology =
    comparisonTabs.length >= 3 && methodologySteps.length > 0

  const mergedComparisonTabs = shouldMergeMethodology
    ? comparisonTabs.map((tab: any, idx: number) => {
        const label = tab.label ?? ""
        const isOurApproach =
          label.toLowerCase().includes("our approach") ||
          idx === comparisonTabs.length - 1
        if (!isOurApproach) return tab
        return {
          ...tab,
          items: methodologySteps.map((s: any) => ({
            _key: s._key,
            number: s.number,
            title: s.title,
            description: s.description,
          })),
        }
      })
    : comparisonTabs

  const capabilitiesColumns =
    page.capabilitiesColumns === 2 || page.capabilitiesColumns === 3
      ? page.capabilitiesColumns
      : undefined

  return (
    <div>
      <StickyCtaConfig label={page.croSections?.stickyCtaLabel} mobileLabel={page.croSections?.stickyCtaMobileLabel} href={bookingHref(page.croSections?.stickyCtaUrl || calendlyUrl)} />
      {/* 1. Hero */}
      <section className="bg-surface">
        <div className="mx-auto flex flex-col items-center px-4 md:px-16 lg:px-24 max-w-[1588px] w-full py-14 md:py-20">
          {/* Three certificate badges */}
          {page.certificateBadges?.length > 0 && (
            <div className="flex items-center flex-wrap justify-center gap-[22px]">
              {page.certificateBadges.map(
                (badge: { src?: string; alt?: string; _key?: string }, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || i}
                    src={badge.src}
                    alt={badge.alt}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                  />
                ),
              )}
            </div>
          )}

          {/* Eyebrow */}
          {page.heroEyebrow && (
            <div className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {page.heroEyebrow}
            </div>
          )}

          {/* Heading */}
          <h1
            className={`text-display text-center max-w-[924px] ${page.heroEyebrow ? "mt-4" : "mt-10"}`}
          >
            <span className="text-body">
              {page.heroHeading || page.title || ""}
            </span>
          </h1>

          {/* Subheading */}
          {!page.hideHeroSubheading && page.heroSubheading && (
            <p className="text-body-lead text-center text-body mt-8 max-w-[859px] whitespace-pre-line">
              {page.heroSubheading}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-[680px] gap-5 mt-10">
            {page.primaryCtaLabel && (
              <Link
                href={bookingHref(page.primaryCtaUrl || calendlyUrl)}
                className={`cta-btn ${page.secondaryCtaLabel ? "cta-btn-outline" : "cta-btn-primary"} w-full md:flex-1 md:max-w-[330px]`}
              >
                {page.primaryCtaLabel}
              </Link>
            )}
            {page.secondaryCtaLabel && (
              <Link
                href={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
                className="cta-btn cta-btn-primary w-full md:flex-1 md:max-w-[330px]"
              >
                {page.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {/* Hero image - full height, no cropping */}
          {heroImageSrc && (
            <div className="w-full max-w-[1042px] mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="Hero"
                className="rounded-card w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Logo Cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Video (underneath logo scroll) */}
      {heroVideoEmbedSrc && (
        <section className="bg-surface pb-14 md:pb-20">
          <div className="mx-auto px-4 max-w-[1042px]">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={heroVideoEmbedSrc} title={page.heroVideoTitle || "Video"} />
            </div>
          </div>
        </section>
      )}

      {/* 4. Comparison Tabs (if populated) */}
      {mergedComparisonTabs.length > 0 && (
        <ComparisonTabsSection
          heading={page.comparisonHeading}
          subheading={page.comparisonSubheading}
          tabs={mergedComparisonTabs}
          theme={page.comparisonTheme || "light"}
          withPurpleCircle
        />
      )}

      {/* 4b. Interactive pipeline solution selector */}
      <SolutionSelector
        eyebrow="Find your fix"
        heading="Which pipeline bottleneck is slowing you down?"
        subheading="Pick the one you recognize and see exactly how we configure monday CRM to solve it."
        ctaLabel="Book a Free Discovery Call"
        ctaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        options={[
          {
            key: "lead-routing",
            glyph: "🎯",
            label: "Lead Routing",
            problem: "Leads sit unassigned or land with the wrong rep.",
            configures: [
              "Automated round-robin and rule-based assignment",
              "Instant Slack / email alerts on new leads",
              "SLA timers that escalate stalled leads",
            ],
            outcome: "Every lead reaches the right rep in seconds, not days.",
          },
          {
            key: "forecasting",
            glyph: "📈",
            label: "Forecasting",
            problem: "Forecasts live in stale spreadsheets nobody trusts.",
            configures: [
              "Weighted pipeline stages with automated probability",
              "Real-time executive dashboards by rep and region",
              "Snapshot reporting to track forecast vs actual",
            ],
            outcome: "A live forecast leadership can actually act on.",
          },
          {
            key: "erp-integration",
            glyph: "🔗",
            label: "ERP Integration",
            problem: "Sales and finance data never reconcile.",
            configures: [
              "Two-way sync between monday CRM and your ERP",
              "Automated order and invoice status mirroring",
              "Custom field mapping with zero double entry",
            ],
            outcome: "One source of truth from first touch to paid invoice.",
          },
        ]}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 5. Testimonials (above Calendly) */}
      <TestimonialsGrid caseStudies={caseStudies} />

      {/* 5b. CRO action items */}
      <CroSections
        data={page.croSections}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
      />

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 7. FAQ */}
      {!page.hideFaqSection &&
        (faqTabs && faqTabs.length > 0 ? (
          <FaqAccordion tabs={faqTabs} />
        ) : page.faqTabs?.length > 0 ? (
          <FaqAccordion tabs={page.faqTabs} />
        ) : null)}

      {/* 8. CRM Management Capabilities (bottom section) */}
      {!page.hideCapabilitiesSection && page.capabilitiesCards?.length > 0 && (
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
        />
      )}

      {/* 9. Bottom video (under capabilities) */}
      {bottomVideoEmbedSrc && (
        <section className="bg-surface pb-14 md:pb-20">
          <div className="mx-auto px-4 max-w-[1042px]">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={bottomVideoEmbedSrc} title={page.bottomVideoTitle || "Video"} />
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

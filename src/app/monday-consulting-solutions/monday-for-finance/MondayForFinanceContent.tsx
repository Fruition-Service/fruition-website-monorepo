"use client"

import { bookingHref } from "@/lib/bookingLink"
import { useState } from "react"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import {
  ClientLogoSection,
  CalendlySection,
  FaqAccordion,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, FaqTab, PartnerBadge, SanityImageRef } from "@/components/sections/types"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import FramedMedia from "@/components/common/FramedMedia"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(800).auto("format").url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MondayForFinanceContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const calendlyUrl = bookingHref(rawCalendly)
  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges || []
  const heroImageSrc = safeImageUrl(page.heroImage as SanityImageRef)
  const tabs: FinanceComparisonTab[] = page.comparisonTabs ?? []
  const featureCards: FinanceFeatureCard[] = page.financeFeatureCards ?? []

  return (
    <div>
      {/* 1. Hero — certificates on top, no small image */}
      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1148px] flex-col items-center px-4 py-14 md:py-20">
          {/* Three certificate badges */}
          {partnerBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-[22px]">
              {partnerBadges.map((badge, i) => {
                const src = safeImageUrl(badge.image)
                if (!src) return null
                return (
                  <FramedMedia key={badge._key || `badge-${i}`} className="rounded-[5px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={badge.name || "Partner badge"}
                      width={120}
                      height={44}
                      className="h-[44px] w-auto rounded-[5px]"
                    />
                  </FramedMedia>
                )
              })}
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
            className={`text-display text-center max-w-[924px] ${
              page.heroEyebrow ? "mt-4" : "mt-10"
            }`}
          >
            <span className="text-body">
              {page.heroHeading || page.title || ""}
            </span>
          </h1>

          {/* Subheading */}
          {!page.hideHeroSubheading && page.heroSubheading && (
            <p className="text-body-lead text-center text-muted mt-7 max-w-[859px] whitespace-pre-line">
              {page.heroSubheading}
            </p>
          )}

          {/* CTA buttons */}
          <div className="mt-10 flex w-full max-w-[680px] flex-wrap items-center justify-center gap-5">
            {page.primaryCtaLabel && (
              <Link
                href={bookingHref(page.primaryCtaUrl || rawCalendly)}
                className={`cta-btn ${
                  page.secondaryCtaLabel ? "cta-btn-outline" : "cta-btn-primary"
                }`}
              >
                {page.primaryCtaLabel}
              </Link>
            )}
            {page.secondaryCtaLabel && (
              <Link
                href={bookingHref(page.secondaryCtaUrl || rawCalendly)}
                className="cta-btn cta-btn-primary"
              >
                {page.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {/* Hero image */}
          {heroImageSrc && (
            <div className="mt-10 flex w-full justify-center">
              <FramedMedia className="rounded-card w-full max-w-[1042px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImageSrc}
                  alt={page.heroHeading || "Hero"}
                  className="rounded-card w-full h-auto"
                />
              </FramedMedia>
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
      {page.heroVideoUrl && (
        <section className="bg-surface pb-14 md:pb-20">
          <div className="mx-auto px-4 max-w-[1042px]">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={page.heroVideoUrl} title={page.heroVideoTitle} />
            </div>
          </div>
        </section>
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 4. Tab selector section */}
      <FinanceTabsSection
        tabs={tabs}
        headingPart1={page.comparisonHeading}
        headingAccent={page.comparisonHeadingAccent}
      />

      {/* 5. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 6. FAQ */}
      {(faqTabs ?? []).length > 0 && (
        <FaqAccordion heading={page.faqHeading} tabs={faqTabs ?? []} />
      )}

      {/* 7. Feature cards section */}
      <BottomFeatureSection
        cards={featureCards}
        headingPart1={page.bottomFeatureSectionHeadingPart1}
        headingAccent={page.bottomFeatureSectionHeadingAccent}
        videoUrl={page.bottomVideoUrl}
        videoTitle={page.bottomVideoTitle}
      />

      {/* 8. Join 900+ CTA */}
      <TestimonialCtaBanner
        testimonial={caseStudies?.[0]}
        testimonials={caseStudies}
      />

    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Finance Tabs Section                                               */
/* ------------------------------------------------------------------ */

type FinanceComparisonTab = { label?: string; subheading?: string; items?: Array<{ icon?: string; title?: string; description?: string }> }
type FinanceFeatureCard = { emoji?: string; title?: string; description?: string }

function FinanceTabsSection({
  tabs,
  headingPart1,
  headingAccent,
}: {
  tabs: FinanceComparisonTab[]
  headingPart1?: string
  headingAccent?: string
}) {
  const [activeTab, setActiveTab] = useState(0)
  const active = tabs[activeTab]
  if (tabs.length === 0) return null

  return (
    <section className="px-4 py-14 md:py-24 bg-gradient-to-b from-brand-soft to-surface">
      <div className="mx-auto flex w-full max-w-[959px] flex-col items-center">
        {(headingPart1 || headingAccent) && (
          <h2 className="text-section-h2 text-center text-body max-w-[900px]">
            {headingPart1}
            {headingPart1 && headingAccent ? " " : ""}
            {headingAccent && (
              <span className="text-brand">{headingAccent}</span>
            )}
          </h2>
        )}

        {/* Tab buttons */}
        <div className="mt-10 flex max-w-full flex-wrap justify-center gap-3">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`cursor-pointer transition-all whitespace-nowrap shrink-0 rounded-pill px-8 py-2.5 text-base font-semibold ${
                i === activeTab
                  ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-card border-0"
                  : "bg-surface-raised text-surface-dark-2 border border-ui"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab heading */}
        {active?.subheading && (
          <h3 className="text-card-title text-center text-brand mt-10">
            {active.subheading}
          </h3>
        )}

        {/* Numbered items */}
        <div className="w-full rounded-card border border-ui mt-6 py-3">
          {(active.items ?? []).map((item, i) => (
            <div
              key={item.title || i}
              className="ui-step-row px-5 py-6 md:px-10"
            >
              <span className="ui-step-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="font-bold text-lg text-surface-dark-2">
                  {"icon" in item && (item as { icon?: string }).icon
                    ? `${(item as { icon?: string }).icon} `
                    : ""}
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-[22px] text-muted whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Bottom Feature Cards Section                                       */
/* ------------------------------------------------------------------ */

function BottomFeatureSection({
  cards,
  headingPart1,
  headingAccent,
  videoUrl,
  videoTitle,
}: {
  cards: FinanceFeatureCard[]
  headingPart1?: string
  headingAccent?: string
  videoUrl?: string
  videoTitle?: string
}) {
  if (cards.length === 0 && !videoUrl) return null
  return (
    <section className="py-14 md:py-24 bg-gradient-to-b from-brand-soft to-surface">
      <div className="mx-auto px-4 w-full max-w-[1100px]">
        {/* Title */}
        {(headingPart1 || headingAccent) && (
          <h2 className="text-section-h2 text-center text-surface-dark-2 max-w-[900px] mx-auto">
            {headingPart1}
            {headingPart1 && headingAccent ? " " : ""}
            {headingAccent && (
              <span className="text-brand">{headingAccent}</span>
            )}
          </h2>
        )}

        {/* 3x3 feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {cards.map((card, i) => (
            <div
              key={card.title || i}
              className="flex flex-col items-center text-center bg-surface-raised rounded-card border border-ui shadow-whisper dark:shadow-none p-7"
            >
              <span className="text-4xl leading-none mb-3">
                {card.emoji}
              </span>
              <h4 className="font-bold text-lg text-brand">
                {card.title}
              </h4>
              <p className="mt-2.5 text-sm leading-[22px] text-muted">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* YouTube video below the feature grid */}
        {videoUrl && (
          <div className="w-full rounded-card overflow-hidden mt-14 aspect-video">
            <YouTubeEmbed url={videoUrl} title={videoTitle} />
          </div>
        )}
      </div>
    </section>
  )
}

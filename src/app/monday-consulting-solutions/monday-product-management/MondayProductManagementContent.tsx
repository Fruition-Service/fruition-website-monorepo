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
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  PartnerBadge,
  SanityImageRef,
} from "@/components/sections/types"
import YouTubeEmbed from "@/components/YouTubeEmbed"
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

interface EmojiItem {
  emoji?: string
  text?: string
  _key?: string
}

interface EmojiCard {
  emoji?: string
  title?: string
  description?: string
  _key?: string
}

interface ApproachTab {
  label?: string
  items?: EmojiItem[]
  _key?: string
}

interface NumberedSection {
  number?: string
  title?: string
  bullets?: EmojiItem[]
  _key?: string
}

interface IndustryTab {
  label?: string
  description?: string
  sections?: NumberedSection[]
  _key?: string
}

interface ProductDevTab {
  label?: string
  description?: string
  bullets?: EmojiItem[]
  image?: SanityImageRef
  imageAlt?: string
  _key?: string
}

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

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MondayProductManagementContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const rawCalendly =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const calendlyUrl = bookingHref(rawCalendly)

  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges || []
  const heroVideoEmbedSrc = youtubeEmbedUrl(page.heroVideoUrl)

  const featuredTestimonial =
    caseStudies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies[0]

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-surface">
        <div className="mx-auto flex flex-col items-center px-4 max-w-[1200px] py-14 md:py-24">
          {/* Partner badges */}
          {partnerBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-[22px]">
              {partnerBadges.map((badge, i) => {
                const src = safeImageUrl(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || `badge-${i}`}
                    src={src}
                    alt={badge.name || "Partner badge"}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                  />
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
            className={`text-display text-center max-w-[924px] ${page.heroEyebrow ? "mt-4" : "mt-10"}`}
          >
            <span className="text-body">
              {page.heroHeading || page.title || ""}
            </span>
          </h1>

          {/* Subheading */}
          {!page.hideHeroSubheading && page.heroSubheading && (
            <p className="text-body-lead text-center text-muted mt-8 max-w-[859px] whitespace-pre-line">
              {page.heroSubheading}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-10 w-full max-w-[680px]">
            {page.primaryCtaLabel && (
              <Link
                href={bookingHref(page.primaryCtaUrl || calendlyUrl)}
                className={`cta-btn ${page.secondaryCtaLabel ? "cta-btn-outline" : "cta-btn-primary"}`}
              >
                {page.primaryCtaLabel}
              </Link>
            )}
            {page.secondaryCtaLabel && (
              <Link
                href={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
                className="cta-btn cta-btn-primary"
              >
                {page.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {/* Hero image */}
          {(() => {
            const heroSrc = safeImageUrl(page.heroImage)
            if (!heroSrc) return null
            return (
              <div className="mt-10 w-full max-w-[1042px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroSrc}
                  alt={page.heroHeading || "monday.com product management boards"}
                  className="rounded-card w-full h-auto"
                />
              </div>
            )
          })()}
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
        <section className="bg-surface pb-14 md:pb-24">
          <div className="mx-auto max-w-[1042px] px-4">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={heroVideoEmbedSrc} title={page.heroVideoTitle || "Video"} />
            </div>
          </div>
        </section>
      )}

      {/* 4. Why Product Teams Choose monday.com */}
      <WhyProductTeamsSection
        headingPart1={page.whyProductTeamsHeadingPart1}
        headingAccent={page.whyProductTeamsHeadingAccent}
        subheading={page.whyProductTeamsSubheading}
        cards={page.whyProductTeamsCards}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 5. How to Manage Products — Strategic Approach */}
      <StrategicApproachSection
        headingPart1={page.strategicApproachHeadingPart1}
        headingAccent={page.strategicApproachHeadingAccent}
        subheading={page.strategicApproachSubheading}
        tabs={page.strategicApproachTabs}
      />

      {/* 5b. Local Consultants — Product Development */}
      <ProductDevelopmentSection
        headingPart1={page.productDevelopmentHeadingPart1}
        headingAccent={page.productDevelopmentHeadingAccent}
        headingPart2={page.productDevelopmentHeadingPart2}
        tabs={page.productDevelopmentTabs}
      />

      {/* 6. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 7. Industry-Specific Product Management Solutions */}
      <IndustrySpecificSection
        heading={page.industryProductSolutionsHeading}
        tabs={page.industryProductSolutionsTabs}
      />

      {/* 8. FAQ */}
      {!page.hideFaqSection && (
        <FaqAccordion
          heading="Frequently asked questions"
          tabs={
            faqTabs && faqTabs.length > 0
              ? faqTabs
              : page.faqTabs ?? []
          }
        />
      )}

      {/* 9. How to Manage Products — 3-card strategic approach */}
      <StrategicApproachCardsSection
        headingPart1={page.strategicApproachHeadingPart1}
        headingAccent={page.strategicApproachHeadingAccent}
        subheading={page.strategicApproachSubheading}
        tabs={page.strategicApproachTabs}
      />

      {/* 10. Testimonial CTA Banner */}
      {!page.hideTestimonialBanner && (
        <TestimonialCtaBanner
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          primaryCtaUrl={calendlyUrl}
          secondaryCtaUrl={calendlyUrl}
          testimonial={featuredTestimonial}
          testimonials={caseStudies}
        />
      )}

    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  How to Manage Products — Strategic Approach Cards                  */
/* ------------------------------------------------------------------ */

interface StrategicApproachCardsSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  tabs?: ApproachTab[]
}

function StrategicApproachCardsSection({
  headingPart1,
  headingAccent,
  subheading,
  tabs,
}: StrategicApproachCardsSectionProps) {
  if (!tabs || tabs.length === 0) return null

  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto flex flex-col items-center max-w-[1100px]">
        <h2 className="text-section-h2 text-center text-body max-w-[900px]">
          {headingPart1}
          <span className="text-brand">{headingAccent}</span>
        </h2>
        {subheading && (
          <p className="text-base leading-relaxed text-muted text-center mx-auto max-w-[820px] mt-4">
            {subheading}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-6 mt-12">
          {tabs.map((card, i) => (
            <div
              key={card._key || card.label || `strat-card-${i}`}
              className="flex flex-col bg-brand-soft rounded-card border border-brand/20 p-7"
            >
              <h3 className="text-card-title text-brand mb-4">
                {card.label}
              </h3>
              <ul className="flex flex-col gap-3">
                {(card.items ?? []).map((item, ii) => (
                  <li
                    key={item._key || item.text || `strat-item-${i}-${ii}`}
                    className="flex items-start gap-2.5 text-sm leading-[22px] text-body"
                  >
                    <span className="text-xl leading-[22px] shrink-0">{item.emoji}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Why Product Teams Choose monday.com                                */
/* ------------------------------------------------------------------ */

interface WhyProductTeamsSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  cards?: EmojiCard[]
}

function WhyProductTeamsSection({
  headingPart1,
  headingAccent,
  subheading,
  cards,
}: WhyProductTeamsSectionProps) {
  if (!cards || cards.length === 0) return null

  return (
    <section className="bg-surface-subtle py-14 md:py-24">
      <div className="mx-auto px-4 max-w-[1200px]">
        <h2 className="text-section-h2 text-center text-body mb-4">
          {headingPart1}
          <span className="block text-brand">{headingAccent}</span>
        </h2>
        {subheading && (
          <p className="text-base leading-relaxed text-muted text-center mx-auto max-w-[820px] mb-12">
            {subheading}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div
              key={card._key || card.title || `why-card-${i}`}
              className="flex flex-col items-center text-center bg-surface-raised rounded-card border border-ui ui-hover-card shadow-whisper dark:shadow-none p-7"
            >
              <span className="text-4xl leading-none mb-3">
                {card.emoji}
              </span>
              <h3 className="text-card-title text-brand mb-2.5">
                {card.title}
              </h3>
              <p className="text-sm leading-[22px] text-body">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  How to Manage Products — Strategic Approach Tabs                   */
/* ------------------------------------------------------------------ */

interface StrategicApproachSectionProps {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  tabs?: ApproachTab[]
}

function StrategicApproachSection({
  headingPart1,
  headingAccent,
  subheading,
  tabs,
}: StrategicApproachSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeTab] ?? tabs[0]

  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto flex flex-col items-center max-w-[959px]">
        <h2 className="text-section-h2 text-center text-body max-w-[900px]">
          {headingPart1}
          <span className="text-brand">{headingAccent}</span>
        </h2>
        {subheading && (
          <p className="text-base leading-relaxed text-muted text-center mx-auto max-w-[820px] mt-4 mb-10">
            {subheading}
          </p>
        )}

        {/* Tab buttons */}
        <div className="flex justify-center flex-wrap gap-3">
          {tabs.map((tab, i) => (
            <button
              key={tab._key || tab.label || `approach-tab-${i}`}
              onClick={() => setActiveTab(i)}
              className={`min-h-[44px] max-w-full shrink cursor-pointer rounded-pill px-5 py-2.5 text-[14px] font-semibold transition-all md:shrink-0 md:px-8 md:text-base md:whitespace-nowrap ${
                i === activeTab
                  ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.18)] border border-transparent"
                  : "bg-surface-raised text-body border border-ui"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="w-full rounded-card border border-ui mt-8 p-6 md:px-10 md:py-8">
          <h3 className="text-card-title text-brand mb-6">
            {active?.label}
          </h3>
          <div className="flex flex-col gap-4">
            {(active?.items ?? []).map((item, i) => (
              <div
                key={item._key || `approach-item-${i}`}
                className="flex items-start gap-3"
              >
                <span className="text-xl leading-none shrink-0">
                  {item.emoji}
                </span>
                <p className="text-body">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Industry-Specific Product Management Solutions                     */
/* ------------------------------------------------------------------ */

interface IndustrySpecificSectionProps {
  heading?: string
  tabs?: IndustryTab[]
}

function IndustrySpecificSection({
  heading,
  tabs,
}: IndustrySpecificSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeTab] ?? tabs[0]

  return (
    <section className="bg-gradient-to-br from-surface-dark-2 to-brand py-14 md:py-24">
      <div className="mx-auto px-4 max-w-[1200px]">
        {heading && (
          <h2 className="text-section-h2 text-center text-white mb-10">
            {heading}
          </h2>
        )}

        {/* Tab pills */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTab
            return (
              <button
                key={tab._key || tab.label || `industry-tab-${idx}`}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center justify-center font-bold h-[39px] px-6 rounded-pill text-sm cursor-pointer ${
                  isActive
                    ? "bg-white text-brand shadow-[0px_2px_8px_rgba(128,21,232,0.35)]"
                    : "bg-white/15 text-white border border-white/30"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab description */}
        {active?.description && (
          <p className="text-center mx-auto text-base leading-relaxed text-brand-soft max-w-[800px] mb-8">
            {active.description}
          </p>
        )}

        {/* Numbered sub-sections */}
        <div className="mx-auto max-w-[900px] flex flex-col gap-6">
          {(active?.sections ?? []).map((section, si) => (
            <div
              key={section._key || section.number || `industry-section-${si}`}
              className="rounded-card ui-hover-card bg-white/10 border border-white/20 p-6 md:px-10 md:py-8"
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="text-4xl font-extralight text-brand-light leading-none">
                  {section.number}
                </span>
                <h3 className="text-card-title font-semibold text-white">
                  {section.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(section.bullets ?? []).map((bullet, bi) => (
                  <div
                    key={bullet._key || `industry-bullet-${si}-${bi}`}
                    className="flex items-start gap-2.5"
                  >
                    <span className="text-xl leading-none shrink-0">
                      {bullet.emoji}
                    </span>
                    <span className="text-sm leading-5 text-white">
                      {bullet.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Local Consultants — Product Development                            */
/* ------------------------------------------------------------------ */

interface ProductDevelopmentSectionProps {
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  tabs?: ProductDevTab[]
}

function ProductDevelopmentSection({
  headingPart1,
  headingAccent,
  headingPart2,
  tabs,
}: ProductDevelopmentSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeTab] ?? tabs[0]
  const activeImageSrc =
    typeof active?.image === "string"
      ? active.image
      : safeImageUrl(active?.image as SanityImageRef | undefined)

  return (
    <section className="bg-surface-subtle py-14 md:py-24">
      <div className="mx-auto px-4 max-w-[1200px]">
        <h2 className="text-section-h2 text-center text-body mb-10 max-w-[1000px] mx-auto">
          {headingPart1}
          <span className="text-brand">{headingAccent}</span>
          {headingPart2}
        </h2>

        {/* Tab pills */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          {tabs.map((tab, i) => {
            const isActive = i === activeTab
            return (
              <button
                key={tab._key || tab.label || `prod-dev-tab-${i}`}
                onClick={() => setActiveTab(i)}
                className={`cursor-pointer transition-all font-semibold rounded-pill px-6 py-2.5 text-[15px] ${
                  isActive
                    ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.18)] border border-transparent"
                    : "bg-surface-raised text-body border border-ui"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="w-full rounded-card border border-ui bg-surface-raised dark:shadow-none p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text column */}
            <div>
              <h3 className="text-card-title text-brand mb-4">
                {active?.label}
              </h3>
              <p className="text-body mb-6">
                {active?.description}
              </p>
              <div className="flex flex-col gap-4">
                {(active?.bullets ?? []).map((bullet, i) => (
                  <div
                    key={bullet._key || `prod-dev-bullet-${i}`}
                    className="flex items-start gap-3"
                  >
                    <span className="text-[22px] leading-none shrink-0">
                      {bullet.emoji}
                    </span>
                    <p className="text-body">
                      {bullet.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image column */}
            <div className="rounded-card overflow-hidden border border-brand/20 bg-surface-raised">
              {activeImageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImageSrc}
                  alt={active?.imageAlt || ""}
                  className="w-full h-auto block"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

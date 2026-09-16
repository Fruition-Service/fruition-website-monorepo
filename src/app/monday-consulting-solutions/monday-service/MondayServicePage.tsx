"use client"

import { bookingHref } from "@/lib/bookingLink"
import { useState } from "react"
import Link from "next/link"
import {
  ClientLogoSection,
  CalendlySection,
  JoinStatsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { SiteSettingsData, PartnerBadge, SanityImageRef } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import CtaLabel from "@/components/CtaLabel"
import FramedMedia from "@/components/common/FramedMedia"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface ComparisonItem {
  _key?: string
  number?: string
  title?: string
  description?: string
}
interface ComparisonTab {
  _key?: string
  label?: string
  items?: ComparisonItem[]
}
interface FourCard {
  _key?: string
  image?: SanityImageRef
  title?: string
  description?: string
}
interface FaqFlatItem {
  _key?: string
  question?: string
  answer?: string
}
interface EmojiItem {
  _key?: string
  emoji?: string
  text?: string
}
interface StrategicColumn {
  _key?: string
  title?: string
  items?: EmojiItem[]
}

interface SolutionPageData {
  title?: string
  heroHeading?: string
  heroSubheading?: string
  heroImage?: SanityImageRef
  serviceHeroImage?: SanityImageRef
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string
  comparisonHeading?: string
  comparisonHeadingAccent?: string
  comparisonSubheading?: string
  comparisonEyebrow?: string
  featureTabsIntroSubheading?: string
  comparisonTabs?: ComparisonTab[]
  fourCardsHeadingPart1?: string
  fourCardsHeadingAccent?: string
  fourCardsCtaLabel?: string
  fourCardsCtaUrl?: string
  fourCards?: FourCard[]
  calendlyHeading?: string
  calendlySubheading?: string
  faqHeading?: string
  faqEyebrow?: string
  faqFlatItems?: FaqFlatItem[]
  strategicColumnsHeadingPart1?: string
  strategicColumnsHeadingAccent?: string
  strategicColumnsSubheading?: string
  strategicColumns?: StrategicColumn[]
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinSubheading?: string
  joinStats?: Array<{ _key?: string; value?: string; label?: string }>
  joinCtaLabel?: string
  joinCtaUrl?: string
  testimonialBannerHeadingPart1?: string
  testimonialBannerHeadingAccent?: string
  testimonialBannerHeadingPart2?: string
}

interface Props {
  page: SolutionPageData | null
  siteSettings?: SiteSettingsData | null
}

// Hardcoded fallbacks — used only when Sanity field is empty so the page
// stays visually identical if the doc is not yet migrated.
const MS_CALENDLY_HEADING = "Schedule A 30-Min Consultation"
const MS_CALENDLY_SUBHEADING =
  "Ready to transform your service management process?\n\nOur certified monday.com consultants offer complimentary consultations to help you assess your current IT service management challenges, design custom monday.com workflows, develop an implementation roadmap and identify integration opportunities with existing tools."
const MS_TB_HEADING_PART1 = "Join "
const MS_TB_HEADING_ACCENT = "900+ organisations"
const MS_TB_HEADING_PART2 =
  " that have maximised their workflows with our monday.com expert support"

function safeImageUrl(ref?: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(800).auto("format").url()
  } catch {
    return null
  }
}

export default function MondayServicePage({ page, siteSettings }: Props) {
  const rawCalendly = siteSettings?.calendlyLink || ""
  const calendlyUrl = bookingHref(rawCalendly)
  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges || []

  const heroTitle = page?.heroHeading || page?.title
  const heroSubheading = page?.heroSubheading
  const heroImageSrc = safeImageUrl(page?.serviceHeroImage) || safeImageUrl(page?.heroImage)
  const primaryCtaUrl = page?.primaryCtaUrl || calendlyUrl
  const secondaryCtaUrl = page?.secondaryCtaUrl || calendlyUrl

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-surface">
        {/* The side padding used to be a flat 273px, which on a 390px phone
            left the hero with no room to lay out in and pushed the whole
            block off-screen. It now scales with the breakpoint. */}
        <div
          className="mx-auto flex max-w-[1476px] flex-col items-center px-5 py-14 md:px-16 md:py-20 lg:px-[273px] lg:py-20"
        >
          {partnerBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-[22px]">
              {partnerBadges.map((badge, i) => {
                const src = i === 2 ? "/images/monday-svc-logo.avif" : safeImageUrl(badge.image)
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

          {heroTitle && (
            <h1
              className="text-center font-bold"
              style={{ fontSize: "clamp(32px, 8vw, 48px)", lineHeight: 1.2, marginTop: 42, maxWidth: 924 }}
            >
              <span className="text-body">{heroTitle}</span>
            </h1>
          )}

          {heroSubheading && (
            <p
              style={{
                fontSize: 18,
                lineHeight: "25.2px",
                color: "var(--text-body)",
                marginTop: 31,
                textAlign: "center",
                maxWidth: 859,
                whiteSpace: "pre-line",
              }}
            >
              {heroSubheading}
            </p>
          )}

          {(page?.primaryCtaLabel || page?.secondaryCtaLabel) && (
            <div className="mt-10 flex w-full max-w-[680px] flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center md:gap-5">
              {page?.primaryCtaLabel && (
                <CtaButton
                  href={primaryCtaUrl}
                  label={page.primaryCtaLabel}
                  variant="outline"
                  className="w-full justify-center md:w-[330px]"
                />
              )}
              {page?.secondaryCtaLabel && (
                <CtaButton
                  href={secondaryCtaUrl}
                  label={page.secondaryCtaLabel}
                  variant="primary"
                  className="w-full justify-center md:w-[330px]"
                />
              )}
            </div>
          )}

          {heroImageSrc && (
            <FramedMedia style={{ marginTop: 40 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt={heroTitle || "Hero"}
                width={1042}
                height={312}
                className="rounded-card object-contain bg-surface"
                style={{ width: 1042, height: "auto", maxHeight: 520 }}
              />
            </FramedMedia>
          )}
        </div>
      </section>

      {/* 2. Logo Cloud */}
      {(page?.logoCloudHeadingPart1 || page?.logoCloudHeadingAccent) && (
        <ClientLogoSection
          headingPart1={page?.logoCloudHeadingPart1}
          headingAccent={page?.logoCloudHeadingAccent}
          logos={siteSettings?.carouselLogos || []}
        />
      )}

      {/* 3. Feature Tabs */}
      {page?.comparisonTabs && page.comparisonTabs.length > 0 && (
        <FeatureTabsSection
          headingPart1={page.comparisonHeading}
          headingAccent={page.comparisonHeadingAccent}
          subheading={page.featureTabsIntroSubheading || page.comparisonSubheading}
          eyebrow={page.comparisonEyebrow}
          tabs={page.comparisonTabs}
        />
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 4. Four image cards */}
      {page?.fourCards && page.fourCards.length > 0 && (
        <FourCardSection
          headingPart1={page.fourCardsHeadingPart1}
          headingAccent={page.fourCardsHeadingAccent}
          ctaLabel={page.fourCardsCtaLabel}
          ctaUrl={bookingHref(page.fourCardsCtaUrl || rawCalendly)}
          cards={page.fourCards}
        />
      )}

      {/* 5. Calendly */}
      <CalendlySection
        heading={page?.calendlyHeading || MS_CALENDLY_HEADING}
        subheading={page?.calendlySubheading || MS_CALENDLY_SUBHEADING}
        calendlyUrl={rawCalendly}
      />

      {/* 6. FAQ */}
      {page?.faqFlatItems && page.faqFlatItems.length > 0 && (
        <MondayServiceFaq
          heading={page.faqHeading}
          eyebrow={page.faqEyebrow}
          items={page.faqFlatItems}
        />
      )}

      {/* 7. Strategic columns */}
      {page?.strategicColumns && page.strategicColumns.length > 0 && (
        <StrategicApproachSection
          headingPart1={page.strategicColumnsHeadingPart1}
          headingAccent={page.strategicColumnsHeadingAccent}
          subheading={page.strategicColumnsSubheading}
          columns={page.strategicColumns}
        />
      )}

      {/* 8. Join 900+ Stats */}
      <JoinStatsSection
        headingPart1={page?.joinHeadingPart1}
        headingAccent={page?.joinHeadingAccent}
        headingPart2={page?.joinHeadingPart2}
        subheading={page?.joinSubheading}
        stats={page?.joinStats}
        ctaLabel={page?.joinCtaLabel}
        ctaUrl={bookingHref(page?.joinCtaUrl || rawCalendly)}
        siteSettings={siteSettings || undefined}
      />

      {/* 9. Testimonial CTA banner — Join 900+ organisations */}
      <TestimonialCtaBanner
        headingPart1={page?.testimonialBannerHeadingPart1 || MS_TB_HEADING_PART1}
        headingAccent={page?.testimonialBannerHeadingAccent || MS_TB_HEADING_ACCENT}
        headingPart2={page?.testimonialBannerHeadingPart2 || MS_TB_HEADING_PART2}
        primaryCtaUrl={calendlyUrl}
        secondaryCtaUrl={calendlyUrl}
      />
    </div>
  )
}

/* -------------------------- Custom sections -------------------------- */

function FeatureTabsSection({
  headingPart1,
  headingAccent,
  subheading,
  eyebrow,
  tabs,
}: {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  eyebrow?: string
  tabs: ComparisonTab[]
}) {
  const [tab, setTab] = useState(0)
  const active = tabs[tab]

  return (
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1042 }}>
        {(headingPart1 || headingAccent) && (
          <h2 className="text-section-h2 text-center text-body" style={{ maxWidth: 900 }}>
            {headingPart1 && <span className="text-body">{headingPart1}</span>}
            {headingAccent && <span style={{ color: "#8015e8" }}>{headingAccent}</span>}
          </h2>
        )}
        {subheading && (
          <p
            className="text-center text-body"
            style={{ fontSize: 18, lineHeight: "28px", marginTop: 20, maxWidth: 860 }}
          >
            {subheading}
          </p>
        )}
        {eyebrow && (
          <p className="text-center font-semibold" style={{ fontSize: 22, color: "#8015e8", marginTop: 32 }}>
            {eyebrow}
          </p>
        )}

        {/* Tabs */}
        <div className="flex justify-center flex-wrap" style={{ gap: 12, marginTop: 40, width: "100%" }}>
          {tabs.map((t, i) => (
            <button
              key={t._key || t.label || i}
              onClick={() => setTab(i)}
              className="cursor-pointer transition-all"
              style={{
                padding: "10px 32px",
                borderRadius: 99,
                fontSize: 16,
                fontWeight: 600,
                ...(i === tab
                  ? {
                      background: "linear-gradient(to right, #8015e8, #ba83f0)",
                      color: "white",
                      boxShadow: "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                      border: "none",
                    }
                  : {
                      backgroundColor: "var(--surface-raised)",
                      color: "var(--text-body)",
                      border: "1px solid var(--border-ui)",
                    }),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Feature grid */}
        {active?.items && (
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              marginTop: 40,
            }}
          >
            {active.items.map((item, i) => (
              <div
                key={item._key || item.title || i}
                className="flex flex-col"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: "1px solid var(--border-ui)",
                  backgroundColor: "var(--surface-subtle)",
                }}
              >
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 200,
                    color: "#8015e8",
                    lineHeight: 1,
                  }}
                >
                  {item.number || String(i + 1).padStart(2, "0")}
                </span>
                {item.title && (
                  <p className="font-bold" style={{ fontSize: 18, marginTop: 16, color: "var(--text-body)" }}>
                    {item.title}
                  </p>
                )}
                {item.description && (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: "22px",
                      color: "var(--text-body)",
                      marginTop: 10,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FourCardSection({
  headingPart1,
  headingAccent,
  ctaLabel,
  ctaUrl,
  cards,
}: {
  headingPart1?: string
  headingAccent?: string
  ctaLabel?: string
  ctaUrl?: string
  cards: FourCard[]
}) {
  return (
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1100 }}>
        {(headingPart1 || headingAccent) && (
          <h2
            className="text-center font-bold"
            style={{ fontSize: "clamp(26px, 6.5vw, 40px)", lineHeight: 1.25, color: "var(--text-body)", maxWidth: 900 }}
          >
            {headingPart1 && (
              <>
                {headingPart1}
                {headingAccent && <br />}
              </>
            )}
            {headingAccent && <span style={{ color: "#8015e8" }}>{headingAccent}</span>}
          </h2>
        )}
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="flex items-center justify-center font-bold text-white"
            style={{
              marginTop: 32,
              height: 53,
              width: 260,
              borderRadius: 100,
              background: "linear-gradient(to right, #8015e8, #ba83f0)",
              fontSize: 16,
            }}
          >
            <CtaLabel label={ctaLabel} />
          </Link>
        )}

        <div className="flex flex-col w-full" style={{ gap: 48, marginTop: 56 }}>
          {cards.map((card, i) => {
            const isEven = i % 2 === 0
            const imgSrc = safeImageUrl(card.image)
            return (
              <div
                key={card._key || card.title || i}
                className="flex items-center dark:shadow-none dark:border dark:border-ui"
                style={{
                  flexDirection: isEven ? "row" : "row-reverse",
                  gap: 48,
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 1px 10px rgba(0,0,0,0.06)",
                }}
              >
                {imgSrc && (
                  <FramedMedia style={{ width: "50%", height: 320, flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={card.title || ""}
                      style={{
                        width: "100%",
                        height: 320,
                        objectFit: "cover",
                      }}
                    />
                  </FramedMedia>
                )}
                <div style={{ padding: 40, flex: 1 }}>
                  {card.title && (
                    <p
                      className="font-bold"
                      style={{ fontSize: 24, color: "var(--text-body)", lineHeight: "32px" }}
                    >
                      {card.title}
                    </p>
                  )}
                  {card.description && (
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: "26px",
                        color: "var(--text-body)",
                        marginTop: 16,
                      }}
                    >
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MondayServiceFaq({
  heading,
  eyebrow,
  items,
}: {
  heading?: string
  eyebrow?: string
  items: FaqFlatItem[]
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-surface" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div className="mx-auto flex flex-col px-4" style={{ maxWidth: 959, gap: 24 }}>
        {heading && (
          <h2 className="text-section-h2" style={{ color: "var(--purple-primary)" }}>
            {heading}
          </h2>
        )}
        {eyebrow && (
          <p style={{ fontSize: 18, color: "var(--text-body)", marginTop: -8 }}>{eyebrow}</p>
        )}

        <div className="flex flex-col" style={{ gap: 12, marginTop: 12 }}>
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item._key || item.question || i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                  style={{ minHeight: 30 }}
                >
                  <span style={{ fontSize: 20, lineHeight: "24px", color: "var(--text-body)" }}>
                    {item.question}
                  </span>
                  <div className="shrink-0" style={{ width: 30, height: 30 }}>
                    <svg
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                    >
                      <path
                        d="M8 12L15 19L22 12"
                        stroke="var(--text-body)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {isOpen && item.answer && (
                  <div
                    style={{
                      paddingBottom: 16,
                      paddingTop: 31,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "var(--text-body)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.answer}
                  </div>
                )}
                <div
                  style={{
                    borderBottom: "1px solid var(--border-ui)",
                    marginTop: isOpen ? 0 : 36,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StrategicApproachSection({
  headingPart1,
  headingAccent,
  subheading,
  columns,
}: {
  headingPart1?: string
  headingAccent?: string
  subheading?: string
  columns: StrategicColumn[]
}) {
  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, backgroundColor: "#f5f0ff" }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1200 }}>
        {(headingPart1 || headingAccent) && (
          <h2 className="text-section-h2 text-center text-body" style={{ maxWidth: 900 }}>
            {headingPart1 && <>{headingPart1}{headingAccent ? " " : ""}</>}
            {headingAccent && <span style={{ color: "#8015e8" }}>{headingAccent}</span>}
          </h2>
        )}
        {subheading && (
          <p
            className="text-center"
            style={{ fontSize: 16, lineHeight: "24px", color: "#333", marginTop: 20, maxWidth: 860 }}
          >
            {subheading}
          </p>
        )}

        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 48,
          }}
        >
          {columns.map((col, ci) => (
            <div
              key={col._key || col.title || ci}
              className="flex flex-col"
              style={{
                padding: 32,
                borderRadius: 20,
                backgroundColor: "white",
                boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
              }}
            >
              {col.title && (
                <h3 className="font-bold" style={{ fontSize: 20, lineHeight: "28px", color: "#8015e8" }}>
                  {col.title}
                </h3>
              )}
              {col.items && (
                <div className="flex flex-col" style={{ gap: 20, marginTop: 24 }}>
                  {col.items.map((it, i) => (
                    <div key={it._key || i} className="flex items-start" style={{ gap: 12 }}>
                      {it.emoji && (
                        <span style={{ fontSize: 20, lineHeight: "24px", flexShrink: 0 }}>{it.emoji}</span>
                      )}
                      {it.text && (
                        <p style={{ fontSize: 14, lineHeight: "22px", color: "#333" }}>{it.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

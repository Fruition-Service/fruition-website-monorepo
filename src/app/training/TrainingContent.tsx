"use client"

import { useState, type KeyboardEvent, type ReactNode } from "react"
import Link from "next/link"
import { bookingHref } from "@/lib/bookingLink"
import { urlFor } from "@/sanity/image"
import ClientLogoSection from "@/components/sections/ClientLogoSection"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import BookingSection from "@/components/sections/BookingSection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import DiscoverCtaSection from "@/components/sections/DiscoverCtaSection"
import JoinStatsSection from "@/components/sections/JoinStatsSection"
import SecurityBadgeSection from "@/components/sections/SecurityBadgeSection"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import TrainingRecommender from "@/components/sections/TrainingRecommender"
import CroSections, { type CroSectionsData } from "@/components/sections/CroSections"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import type {
  CarouselLogo,
  CaseStudy,
  FaqTab,
  PartnerBadge,
  SanityImageRef,
  SiteSettingsData,
} from "@/components/sections/types"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import CtaLabel from "@/components/CtaLabel"
import { useSiteCopy } from "@/components/SiteCopyProvider"

/**
 * The Training page (/training), rebuilt from the old bespoke
 * /monday-training layout on the shared page primitives: `.hero-band`,
 * `.site-container`, `.section-y`, left-aligned section heads with a mono
 * eyebrow, and the shared sections wherever one exists. Every string comes
 * from the `mondayTrainingPage` Sanity document; blocks without copy are
 * omitted rather than filled in.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TrainingItem {
  number?: string
  title?: string
  description?: string
  bullets?: string[]
}

interface TrainingTab {
  _key?: string
  label?: string
  items?: TrainingItem[]
}

interface TrainingService {
  _key?: string
  emoji?: string
  title?: string
  subtitle?: string
  description?: string
  image?: SanityImageRef
  ctaLabel?: string
  ctaUrl?: string
}

interface JoinSectionStat {
  _key?: string
  value?: string
  label?: string
}

export interface TrainingPageData {
  title?: string
  seoTitle?: string
  seoDescription?: string
  croSections?: CroSectionsData | null

  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroSubheading?: string
  heroPartnerBadges?: Array<{ _key?: string; image?: SanityImageRef; alt?: string }>
  heroMondayPartnersImage?: SanityImageRef
  heroImage?: SanityImageRef
  heroCertificationBadge?: SanityImageRef
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string

  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string

  videoEmbedUrl?: string
  videoTitle?: string

  trainingIntroHeading?: string
  trainingIntroSubheading?: string

  trainingSectionHeading?: string
  trainingTabs?: TrainingTab[]

  empowerEyebrow?: string
  empowerHeading?: string
  empowerBody?: string
  empowerImage?: SanityImageRef
  empowerCtaLabel?: string
  empowerCtaUrl?: string

  servicesHeading?: string
  trainingServices?: TrainingService[]

  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string

  calendlyHeading?: string
  calendlySubheading?: string
  calendlyUrl?: string

  faqHeading?: string
  faqTabs?: FaqTab[]

  discoverBadge?: SanityImageRef
  discoverHeading?: string
  discoverPrimaryCtaLabel?: string
  discoverPrimaryCtaUrl?: string
  discoverSecondaryCtaLabel?: string
  discoverSecondaryCtaUrl?: string

  joinSectionHeadingPart1?: string
  joinSectionHeadingAccent?: string
  joinSectionHeadingPart2?: string
  joinSectionSubheading?: string
  joinSectionStats?: JoinSectionStat[]
  joinSectionFootnote?: string
  joinSectionBadge?: SanityImageRef

  securityBadge?: SanityImageRef
}

interface TrainingContentProps {
  data?: TrainingPageData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
  siteSettings?: SiteSettingsData | null
  /** Central faqItem tabs; they win over `data.faqTabs` when non-empty. */
  faqTabs?: FaqTab[]
  navbarPartnerBadges?: PartnerBadge[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function imageUrl(ref: SanityImageRef, width = 800): string | null {
  if (!ref || !ref.asset?._ref) return null
  try {
    return urlFor(ref).width(width).auto("format").url()
  } catch {
    return null
  }
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
      {children}
    </p>
  )
}

/** Sanity CTA links: Calendly URLs go to the on-page booking section. */
function CtaLink({
  label,
  url,
  variant,
}: {
  label?: string
  url?: string
  variant: "primary" | "outline"
}) {
  if (!label || !url) return null
  return (
    <Link href={bookingHref(url)} className={`cta-btn cta-btn-${variant}`}>
      <CtaLabel label={label} />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Training tracks: accessible tabs                                   */
/* ------------------------------------------------------------------ */

function TrainingTracks({ tabs }: { tabs: TrainingTab[] }) {
  const [active, setActive] = useState(0)
  const tabId = (i: number) => `training-tab-${i}`
  const panelId = "training-tab-panel"

  // Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1
    let next = -1
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1
    if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1
    if (e.key === "Home") next = 0
    if (e.key === "End") next = last
    if (next < 0) return
    e.preventDefault()
    setActive(next)
    document.getElementById(tabId(next))?.focus()
  }

  const items = tabs[active]?.items ?? []

  return (
    <div className="mt-8 md:mt-10">
      <div role="tablist" className="flex flex-wrap gap-3">
        {tabs.map((tab, i) => {
          const selected = i === active
          return (
            <button
              key={tab._key || i}
              id={tabId(i)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`inline-flex min-h-11 max-w-full items-center rounded-pill border px-5 text-left text-[15px] font-semibold transition-colors ${
                selected
                  ? "border-brand bg-brand text-white"
                  : "border-ui bg-surface-raised text-body hover:border-brand hover:text-brand"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {items.length > 0 && (
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active)}
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {items.map((item, i) => (
            <article
              key={`${item.number}-${i}`}
              className="min-w-0 rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-8"
            >
              {item.number && (
                <p className="mb-4 font-mono text-xs font-semibold text-brand">{item.number}</p>
              )}
              {item.title && <h4 className="text-card-title">{item.title}</h4>}
              {item.description ? (
                <p className="mt-3 text-body-sm text-muted whitespace-pre-line">{item.description}</p>
              ) : (item.bullets?.length ?? 0) > 0 ? (
                <ul className="mt-4 divide-y divide-dashed divide-ui">
                  {item.bullets!.map((b, j) => (
                    <li key={j} className="flex gap-2 py-2 text-body-sm text-muted">
                      <span aria-hidden className="text-brand">&rarr;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TrainingContent({
  data,
  carouselLogos = [],
  caseStudies = [],
  siteSettings = null,
  faqTabs: centralFaqTabs,
  navbarPartnerBadges = [],
}: TrainingContentProps) {
  const t = useSiteCopy()
  if (!data) return null

  const trainingTabs = data.trainingTabs ?? []
  const trainingServices = data.trainingServices ?? []
  const faqTabs = centralFaqTabs?.length ? centralFaqTabs : (data.faqTabs ?? [])

  // Partner badges: the page's own, else the site-wide navbar set.
  const pageBadges = (data.heroPartnerBadges ?? [])
    .map((b, i) => ({ key: b._key || `badge-${i}`, src: imageUrl(b.image, 240), alt: b.alt ?? `Partner badge ${i + 1}` }))
    .filter((b) => b.src)
  const partnerBadges = pageBadges.length
    ? pageBadges
    : navbarPartnerBadges
        .map((b, i) => ({ key: `nav-badge-${i}`, src: imageUrl(b.image, 240), alt: b.name ?? `Partner badge ${i + 1}` }))
        .filter((b) => b.src)

  const certBadgeSrc = imageUrl(data.heroCertificationBadge)
  const mondayPartnersSrc = imageUrl(data.heroMondayPartnersImage, 1068)
  const heroImageSrc = imageUrl(data.heroImage, 1600)
  const empowerImageSrc = imageUrl(data.empowerImage, 980)
  const hasHeroVisual = Boolean(certBadgeSrc || mondayPartnersSrc)

  return (
    <div className="bg-surface text-body">
      <StickyCtaConfig
        label={data.croSections?.stickyCtaLabel}
        mobileLabel={data.croSections?.stickyCtaMobileLabel}
        href={bookingHref(data.croSections?.stickyCtaUrl || data.calendlyUrl)}
      />

      {/* 1. Hero */}
      <section className="hero-band">
        <div className="site-container pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20">
          <div
            className={`grid grid-cols-1 gap-10 lg:items-center lg:gap-16 ${
              hasHeroVisual ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : ""
            }`}
          >
            <div className="min-w-0">
              {partnerBadges.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  {partnerBadges.map((b) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={b.key} src={b.src!} alt={b.alt} height={36} className="h-9 w-auto rounded-badge" />
                  ))}
                </div>
              )}
              <h1 className="text-display">
                {data.heroHeadingPart1}
                {data.heroHeadingAccent && <span className="text-brand">{data.heroHeadingAccent}</span>}
              </h1>
              {data.heroSubheading && (
                <p className="mt-5 max-w-[60ch] text-body-lead text-muted whitespace-pre-line">
                  {data.heroSubheading}
                </p>
              )}
              {(data.heroPrimaryCtaLabel || data.heroSecondaryCtaLabel) && (
                <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
                  <CtaLink label={data.heroPrimaryCtaLabel} url={data.heroPrimaryCtaUrl} variant="primary" />
                  <CtaLink label={data.heroSecondaryCtaLabel} url={data.heroSecondaryCtaUrl} variant="outline" />
                </div>
              )}
            </div>

            {hasHeroVisual && (
              <div className="flex min-w-0 flex-col items-start gap-6">
                {certBadgeSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={certBadgeSrc}
                    alt="Certifications"
                    width={325}
                    height={73}
                    className="h-auto w-full max-w-[325px] object-contain"
                  />
                )}
                {mondayPartnersSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mondayPartnersSrc}
                    alt="Monday.com Partners"
                    width={534}
                    height={133}
                    className="h-auto w-full max-w-[534px] object-contain"
                  />
                )}
              </div>
            )}
          </div>

          {heroImageSrc && (
            <div className="mt-10 md:mt-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="monday.com training dashboards"
                width={1042}
                height={312}
                className="h-auto w-full rounded-card border border-ui bg-surface-raised object-contain"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Client logo cloud */}
      <ClientLogoSection
        headingPart1={data.logoCloudHeadingPart1}
        headingAccent={data.logoCloudHeadingAccent}
        logos={carouselLogos}
      />

      {/* 3. Video */}
      {data.videoEmbedUrl && (
        <section className="border-t border-ui">
          <div className="site-container section-y">
            <div className="aspect-video overflow-hidden rounded-card border border-ui shadow-card">
              <YouTubeEmbed url={data.videoEmbedUrl} title={data.videoTitle} />
            </div>
          </div>
        </section>
      )}

      {/* 4 + 5. Training intro and tracks */}
      {(data.trainingIntroHeading || trainingTabs.length > 0) && (
        <section className="border-y border-ui bg-surface-subtle">
          <div className="site-container section-y">
            <div className="section-head">
              {data.trainingIntroHeading && (
                <h2 className="text-section-h2">{data.trainingIntroHeading}</h2>
              )}
              {data.trainingIntroSubheading && (
                <p className="text-body-lead text-muted">{data.trainingIntroSubheading}</p>
              )}
            </div>
            {data.trainingSectionHeading && (
              <h3 className="mt-10 max-w-[760px] text-section-h3 md:mt-12">{data.trainingSectionHeading}</h3>
            )}
            {trainingTabs.length > 0 && <TrainingTracks tabs={trainingTabs} />}
          </div>
        </section>
      )}

      {/* Shared mid-page conversion banner, recommender and CRO blocks,
          carried over from /monday-training as they were. */}
      <AuditCtaBanner />
      <TrainingRecommender
        eyebrow="Find your track"
        heading="Which training format fits your team?"
        subheading="Set your team size and workflow complexity for an instant recommendation."
        ctaLabel="Book a FREE Training Consultation"
        ctaUrl={bookingHref(data.calendlyUrl)}
      />
      <CroSections
        data={data.croSections}
        primaryCtaLabel={data.heroPrimaryCtaLabel}
        primaryCtaUrl={bookingHref(data.calendlyUrl)}
      />

      {/* 6. Empower / why training */}
      {data.empowerHeading && (
        <section className="border-t border-ui">
          <div className="site-container section-y">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center lg:gap-16">
              <div className="section-head min-w-0">
                {data.empowerEyebrow && <Eyebrow>{data.empowerEyebrow}</Eyebrow>}
                <h2 className="text-section-h2">{data.empowerHeading}</h2>
                {data.empowerBody && (
                  <p className="text-body text-muted whitespace-pre-line">{data.empowerBody}</p>
                )}
                {data.empowerCtaLabel && data.empowerCtaUrl && (
                  <div className="mt-2">
                    <CtaLink label={data.empowerCtaLabel} url={data.empowerCtaUrl} variant="primary" />
                  </div>
                )}
              </div>
              {empowerImageSrc && (
                <div className="min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={empowerImageSrc}
                    alt="monday.com users training"
                    width={490}
                    height={413}
                    className="mx-auto h-auto w-full max-w-[490px]"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7. Training services */}
      {trainingServices.length > 0 && (
        <section className="border-y border-ui bg-surface-subtle">
          <div className="site-container section-y">
            {data.servicesHeading && (
              <div className="section-head mb-8 md:mb-10">
                <h2 className="text-section-h2">{data.servicesHeading}</h2>
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {trainingServices.map((service, i) => {
                const src = imageUrl(service.image, 960)
                return (
                  <article
                    key={service._key || `${service.title}-${i}`}
                    className="flex min-w-0 flex-col overflow-hidden rounded-card border border-ui bg-surface-raised shadow-card"
                  >
                    {src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={service.title ?? ""}
                        width={719}
                        height={515}
                        loading="lazy"
                        className="aspect-[719/515] h-auto w-full border-b border-ui bg-surface-subtle object-contain"
                      />
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
                      {service.title && (
                        <Eyebrow>
                          {service.emoji && <span aria-hidden className="mr-2">{service.emoji}</span>}
                          {service.title}
                        </Eyebrow>
                      )}
                      {service.subtitle && (
                        <h3 className="text-card-title whitespace-pre-line">{service.subtitle}</h3>
                      )}
                      {service.description && (
                        <p className="text-body-sm text-muted whitespace-pre-line">{service.description}</p>
                      )}
                      {service.ctaLabel && service.ctaUrl && (
                        <Link
                          href={bookingHref(service.ctaUrl)}
                          className="mt-auto inline-flex min-h-11 items-center pt-2 font-semibold text-brand hover:text-body"
                        >
                          <CtaLabel label={service.ctaLabel} />
                        </Link>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. Testimonials */}
      <TestimonialsGrid
        heading={data.testimonialsHeading}
        ctaLabel={data.testimonialsCtaLabel}
        ctaUrl={data.testimonialsCtaUrl}
        statCardValue={data.statCardValue}
        statCardSubtitle={data.statCardSubtitle}
        statCardCtaLabel={data.statCardCtaLabel}
        statCardCtaUrl={data.statCardCtaUrl}
        caseStudies={caseStudies}
      />

      {/* 9. Booking band (renders #book, so booking CTAs scroll here) */}
      <BookingSection
        eyebrow={t("booking-training-eyebrow")}
        heading={t("booking-training-heading")}
        sub={t("booking-training-sub")}
        calendlyUrl={data.calendlyUrl}
      />

      {/* 10. FAQ */}
      <FaqAccordion heading={data.faqHeading} tabs={faqTabs} />

      {/* 11. Discover CTA */}
      <DiscoverCtaSection
        badge={data.discoverBadge}
        heading={data.discoverHeading}
        primaryCtaLabel={data.discoverPrimaryCtaLabel}
        primaryCtaUrl={data.discoverPrimaryCtaUrl ? bookingHref(data.discoverPrimaryCtaUrl) : undefined}
        secondaryCtaLabel={data.discoverSecondaryCtaLabel}
        secondaryCtaUrl={data.discoverSecondaryCtaUrl ? bookingHref(data.discoverSecondaryCtaUrl) : undefined}
      />

      {/* 12. Join stats */}
      <JoinStatsSection
        headingPart1={data.joinSectionHeadingPart1}
        headingAccent={data.joinSectionHeadingAccent}
        headingPart2={data.joinSectionHeadingPart2}
        subheading={data.joinSectionSubheading}
        stats={data.joinSectionStats}
        footnote={data.joinSectionFootnote}
        siteSettings={siteSettings ?? undefined}
      />

      {/* 13. Security badge */}
      <SecurityBadgeSection badge={data.securityBadge} />
    </div>
  )
}

"use client"

/**
 * /implementation-packages: the delivery page. It owns what an implementation
 * includes: the phases, who does what in each, scope, prerequisites, timeline
 * and handover (copy in src/data/implementationJourney.ts). It publishes no
 * prices: package prices, the comparison and licence procurement live on
 * /pricing (#packages), and the teaser near the end links there.
 */

import { bookingHref } from "@/lib/bookingLink"
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { urlFor } from "@/sanity/image"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import CalendlySection from "@/components/sections/CalendlySection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import CroSections, { type CroSectionsData } from "@/components/sections/CroSections"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import CtaLabel from "@/components/CtaLabel"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import FramedMedia from "@/components/common/FramedMedia"
import type { FaqTab as SharedFaqTab } from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import {
  DELIVERY_PHASES,
  DELIVERY_TIMELINE,
  PREREQUISITES,
  SCOPE_IN,
  SCOPE_OUT,
} from "@/data/implementationJourney"
import { buildPackageTiers } from "@/data/pricing/packages"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// Sanity image reference (we take `any`-ish shape because the field is
// just `type: 'image'` on the schema)
type SanityImage = {
  asset?: { _ref?: string; _id?: string } | null
} | null | undefined

interface PackageTier {
  _key?: string
  name?: string
  hours?: string
  basePrice?: number
  pricePrefix?: string
  priceLabel?: string
  ctaLabel?: string
  featured?: boolean
  features?: string[]
}

interface FeatureCard {
  _key?: string
  emoji?: string
  title?: string
  description?: string
}

interface FaqPair {
  _key?: string
  question?: string
  answer?: string
}

interface FaqTab {
  _key?: string
  label?: string
  items?: FaqPair[]
}

interface MethodologyStep {
  _key?: string
  number?: string
  title?: string
  description?: string
  bullets?: string[]
  extraText?: string
}

export interface ImplementationPackagesData {
  title?: string
  seoTitle?: string
  seoDescription?: string

  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroHeadingPart2?: string
  heroPartnerBadges?: Array<{ _key?: string; image?: SanityImage; alt?: string }>
  heroMondayPartnersImage?: SanityImage
  heroImage?: SanityImage
  heroCertificationBadge?: SanityImage
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string

  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string

  videoEmbedUrl?: string
  videoTitle?: string

  servicesIntroHeadingPart1?: string
  servicesIntroHeadingAccent?: string
  servicesIntroHeadingPart2?: string
  servicesIntroImage?: SanityImage
  featureCards?: FeatureCard[]

  socialProofBannerHtml?: PortableTextBlock[]
  socialProofCtaLabel?: string
  socialProofCtaUrl?: string

  pricingHeading?: string
  pricingSubheading?: string
  pricingFootnote?: string
  packageTiers?: PackageTier[]

  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string

  calendlyHeading?: string
  calendlyUrl?: string

  faqHeading?: string
  faqTabs?: FaqTab[]

  discoverBadge?: SanityImage
  discoverHeading?: string
  discoverPrimaryCtaLabel?: string
  discoverPrimaryCtaUrl?: string
  discoverSecondaryCtaLabel?: string
  discoverSecondaryCtaUrl?: string

  methodologyHeading?: string
  methodologyHeadingAccent?: string
  methodologySteps?: MethodologyStep[]

  securityBadge?: SanityImage

  croSections?: CroSectionsData
}

interface CarouselLogo {
  alt?: string
  image?: SanityImage
}

interface CaseStudy {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImage
  profilePhoto?: SanityImage
  linkedinUrl?: string
}

interface NavbarPartnerBadge {
  name?: string
  image?: SanityImage
  width?: number
  height?: number
}

interface Props {
  data?: ImplementationPackagesData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
  /**
   * Central faqItem tabs fetched at the page.tsx level. When
   * non-empty, overrides the embedded `data.faqTabs` so FAQ content
   * is managed from the central faqItem document store.
   */
  faqTabs?: FaqTab[]
  navbarPartnerBadges?: NavbarPartnerBadge[]
}


/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function imgSrc(image: SanityImage): string | null {
  if (!image || !image.asset) return null
  try {
    return urlFor(image).width(1200).auto("format").url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ImplementationPackagesContent({
  data,
  carouselLogos,
  caseStudies,
  faqTabs: faqTabsOverride,
  navbarPartnerBadges,
}: Props) {
  // Resolve all fields from Sanity data (no local fallbacks)
  const heroHeadingPart1 = data?.heroHeadingPart1
  const heroHeadingAccent = data?.heroHeadingAccent
  const heroHeadingPart2 = data?.heroHeadingPart2
  const heroImageSrc = imgSrc(data?.heroImage)
  const heroCertBadgeSrc = imgSrc(data?.heroCertificationBadge)
  type ResolvedPartnerBadge = { _key: string | undefined; src: string; alt: string }
  const sanityBadges: ResolvedPartnerBadge[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedPartnerBadge | null => {
      const src = imgSrc(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroPartnerBadges: ResolvedPartnerBadge[] = sanityBadges.length > 0
    ? sanityBadges
    : (navbarPartnerBadges ?? [])
        .map((b, i): ResolvedPartnerBadge | null => {
          const src = imgSrc(b.image)
          if (!src) return null
          return { _key: `nav-badge-${i}`, src, alt: b.name ?? `Partner badge ${i + 1}` }
        })
        .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroPrimaryCtaLabel = data?.heroPrimaryCtaLabel
  const heroPrimaryCtaUrl = data?.heroPrimaryCtaUrl
  const heroSecondaryCtaLabel = data?.heroSecondaryCtaLabel
  const heroSecondaryCtaUrl = data?.heroSecondaryCtaUrl

  const logoCloudHeadingPart1 = data?.logoCloudHeadingPart1
  const logoCloudHeadingAccent = data?.logoCloudHeadingAccent

  const videoEmbedUrl = data?.videoEmbedUrl
  const videoTitle = data?.videoTitle

  const servicesIntroHeadingPart1 = data?.servicesIntroHeadingPart1
  const servicesIntroHeadingAccent = data?.servicesIntroHeadingAccent
  const servicesIntroHeadingPart2 = data?.servicesIntroHeadingPart2

  const socialProofBannerHtml = data?.socialProofBannerHtml
  const socialProofCtaLabel = data?.socialProofCtaLabel
  const socialProofCtaUrl = data?.socialProofCtaUrl

  // Names and hours only: the prices for these tiers are on /pricing.
  const packageTeaserTiers = buildPackageTiers(data?.packageTiers)

  const testimonialsHeading = data?.testimonialsHeading
  const testimonialsCtaLabel = data?.testimonialsCtaLabel
  const testimonialsCtaUrl = data?.testimonialsCtaUrl
  const statCardValue = data?.statCardValue
  const statCardSubtitle = data?.statCardSubtitle
  const statCardCtaLabel = data?.statCardCtaLabel
  const statCardCtaUrl = data?.statCardCtaUrl

  const calendlyHeading = data?.calendlyHeading
  const calendlyUrl = data?.calendlyUrl

  const faqHeading = data?.faqHeading
  const faqTabs: FaqTab[] = faqTabsOverride?.length
    ? faqTabsOverride
    : data?.faqTabs ?? []


  const discoverBadgeSrc = imgSrc(data?.discoverBadge)
  const discoverHeading = data?.discoverHeading
  const discoverPrimaryCtaLabel = data?.discoverPrimaryCtaLabel
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl
  const discoverSecondaryCtaLabel = data?.discoverSecondaryCtaLabel
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl

  const methodologyHeading = data?.methodologyHeading
  const methodologyHeadingAccent = data?.methodologyHeadingAccent

  const securityBadgeSrc = imgSrc(data?.securityBadge)

  /* -------- Logo carousel (from siteSettings.carouselLogos) -------- */
  const resolvedCarouselLogos: { src: string; alt: string }[] =
    (carouselLogos ?? [])
      .map((l, i) => {
        const src = imgSrc(l.image)
        if (!src) return null
        return { src, alt: l.alt ?? `Client ${i + 1}` }
      })
      .filter((x): x is { src: string; alt: string } => x !== null)

  // Duplicate logos for seamless marquee loop
  const duplicatedLogos = [...resolvedCarouselLogos, ...resolvedCarouselLogos]

  return (
    <div>
      <StickyCtaConfig label={data?.croSections?.stickyCtaLabel} mobileLabel={data?.croSections?.stickyCtaMobileLabel} href={bookingHref(data?.croSections?.stickyCtaUrl || calendlyUrl)} />
      {/* ============================================================ */}
      {/* SECTION 1 -- Hero                                            */}
      {/* ============================================================ */}
      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1148px] flex-col items-center px-4 py-14 md:py-24">
          {/* Partner badges */}
          {heroPartnerBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
              {heroPartnerBadges.map((badge) => (
                <FramedMedia key={badge._key ?? badge.src} className="dark:!p-1">
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={120}
                    height={44}
                    className="h-[36px] w-auto rounded-[5px] md:h-[44px]"
                    unoptimized
                  />
                </FramedMedia>
              ))}
            </div>
          )}

          {/* Heading */}
          <h1 className="text-display mt-10 max-w-[924px] text-center">
            <span className="text-body">{heroHeadingPart1}</span>
            <span className="text-brand">{heroHeadingAccent}</span>
            <span className="text-body">{heroHeadingPart2}</span>
          </h1>

          {/* Certification banner (hidden) */}
          {/* <div style={{ marginTop: 40 }}>
            <img
              src={heroCertBadgeSrc}
              alt="Certifications"
              width={534}
              height={133}
              className="h-[133px] w-[534px] object-contain"
            />
          </div> */}

          {/* Dual CTA */}
          {(heroPrimaryCtaUrl || heroSecondaryCtaUrl) && (
            <div className="mt-10 flex w-full max-w-[680px] flex-col items-center justify-center gap-4 md:flex-row md:gap-5">
              {heroPrimaryCtaUrl && (
                <Link
                  href={heroPrimaryCtaUrl}
                  className="cta-btn cta-btn-outline w-full md:flex-1"
                >
                  <CtaLabel label={heroPrimaryCtaLabel} />
                </Link>
              )}
              {heroSecondaryCtaUrl && (
                <Link
                  href={heroSecondaryCtaUrl}
                  className="cta-btn cta-btn-primary w-full md:flex-1"
                >
                  <CtaLabel label={heroSecondaryCtaLabel} />
                </Link>
              )}
            </div>
          )}

          {/* Purpose strip: this page is delivery, prices are on /pricing */}
          <div className="mt-10 w-full max-w-[760px] rounded-card border border-ui bg-surface-subtle p-5 md:p-6 text-left">
            <p className="text-body">
              This page covers delivery: the phases of an implementation, what is in scope, who does
              what and how long it takes. Package prices, comparison and licence procurement are on
              Pricing.
            </p>
            <Link
              href="/pricing#packages"
              className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand underline-offset-4 hover:underline"
            >
              See pricing and packages <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Hero image */}
          {heroImageSrc && (
            <FramedMedia className="mt-10 w-full max-w-[1042px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="monday.com dashboards, project planning and team OKRs"
                width={1042}
                height={312}
                className="rounded-card w-full h-auto object-contain bg-white"
              />
            </FramedMedia>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      {resolvedCarouselLogos.length > 0 && (
        <section className="bg-surface py-14 md:py-24 px-4">
          <div className="flex flex-col gap-8 md:gap-9 items-center w-full max-w-[1348px] mx-auto">
            {/* Heading */}
            <p className="text-section-h3 text-center">
              <span className="text-body">{logoCloudHeadingPart1}</span>
              <span className="text-brand">{logoCloudHeadingAccent}</span>
            </p>

            {/* Horizontal marquee logo strip */}
            <div className="w-full overflow-hidden">
              <div className="flex w-max items-center gap-10 md:gap-[65px] animate-marquee">
                {duplicatedLogos.map((logo, i) => (
                  <FramedMedia
                    key={`logo-${i}`}
                    className="flex items-center justify-center shrink-0 h-[48px] md:h-[65px] dark:!p-1.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      height={65}
                      className="h-full w-auto object-contain"
                    />
                  </FramedMedia>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 3 -- YouTube Video Embed                             */}
      {/* ============================================================ */}
      {videoEmbedUrl && (
        <section className="bg-surface py-14 md:py-24 px-4">
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-[979px] aspect-video rounded-card overflow-hidden">
              <YouTubeEmbed url={videoEmbedUrl} title={videoTitle} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 4 -- Delivery journey: phases and who does what      */}
      {/* ============================================================ */}
      <section id="delivery" className="scroll-mt-24 border-t border-ui bg-surface">
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
            How an implementation runs
          </p>
          <h2 className="text-section-h2 max-w-[820px]">
            {methodologyHeading ? (
              <>
                <span className="text-body">{methodologyHeading}</span>
                {methodologyHeadingAccent && (
                  <>
                    {" "}
                    <span className="text-brand">{methodologyHeadingAccent}</span>
                  </>
                )}
              </>
            ) : (
              "What an implementation actually includes"
            )}
          </h2>

          <ol className="mt-10 md:mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {DELIVERY_PHASES.map((phase) => (
              <li
                key={phase.number}
                className="flex flex-col border-l-2 border-ui pl-5 md:rounded-card md:border md:border-ui md:bg-surface-raised md:p-8 md:shadow-whisper"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {phase.number}
                </p>
                <h3 className="text-card-title mt-2">{phase.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{phase.summary}</p>

                <div className="mt-5 flex flex-col gap-5">
                  {(
                    [
                      ["Fruition does", phase.weDo],
                      ["You do", phase.youDo],
                    ] as const
                  ).map(([label, items]) => (
                    <div key={label}>
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-2">
                        {label}
                      </p>
                      <ul className="flex flex-col gap-1.5 text-sm text-body">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span aria-hidden className="text-muted">·</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-2">
                      You get
                    </p>
                    <ul className="flex flex-col gap-1.5 text-sm text-body">
                      {phase.youGet.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden className="text-brand font-semibold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 -- Timeline and prerequisites                      */}
      {/* ============================================================ */}
      <section className="bg-surface-subtle">
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
              Timeline
            </p>
            <h2 className="text-section-h2">{DELIVERY_TIMELINE.heading}</h2>
            <p className="mt-4 text-body-lead text-muted">{DELIVERY_TIMELINE.body}</p>
            <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted mb-2">
              What moves the date
            </p>
            <ul>
              {DELIVERY_TIMELINE.drivers.map((d) => (
                <li key={d} className="border-t border-dashed border-ui py-3 text-sm font-medium text-body">
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
              What we need from you
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PREREQUISITES.map((p) => (
                <div key={p.title} className="rounded-card border border-ui bg-surface-raised p-6 shadow-whisper">
                  <h3 className="text-card-title">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 -- Scope                                           */}
      {/* ============================================================ */}
      <section className="bg-surface">
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
            Scope
          </p>
          <h2 className="text-section-h2">What is in scope, and what is not</h2>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-card-title mb-4">In scope</h3>
              <ul>
                {SCOPE_IN.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-t border-dashed border-ui py-3 text-sm text-body">
                    <span aria-hidden className="text-brand font-semibold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-card-title mb-4">Not in scope</h3>
              <ul>
                {SCOPE_OUT.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-t border-dashed border-ui py-3 text-sm text-body">
                    <span aria-hidden className="text-muted font-semibold">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 text-xs text-muted">
            Anything outside this list is quoted separately before it starts.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 -- Services Content                                */}
      {/* ============================================================ */}
      <section className="bg-surface-subtle">
        <div className="mx-auto flex flex-col items-center px-4 py-14 md:py-24">
          {/* 4a: Intro heading */}
          <div className="text-section-h2 max-w-[924px] text-center">
            <p>
              <span className="text-body">{servicesIntroHeadingPart1}</span>
              <span className="text-brand">{servicesIntroHeadingAccent}</span>
              <span className="text-body">{servicesIntroHeadingPart2}</span>
            </p>
          </div>

          {/* 4c: Social proof banner */}
          {(socialProofBannerHtml || socialProofCtaUrl) && (
            <div className="mt-10 md:mt-14 flex w-full max-w-[1200px] flex-col items-start gap-6 rounded-card bg-gradient-to-r from-surface-dark to-brand px-6 py-7 md:flex-row md:items-center md:pl-7 md:pr-11">
              {socialProofBannerHtml && (
                <div className="flex-1 text-lg font-medium text-white md:text-xl">
                  <PortableText
                    value={socialProofBannerHtml}
                    components={{
                      block: {
                        normal: ({ children }) => {
                          return (
                            <p>
                              {(Array.isArray(children) ? children : [children]).map((child, i) => {
                                if (typeof child !== "string") return child
                                const highlight = "900+ small-medium sized enterprises"
                                const idx = child.indexOf(highlight)
                                if (idx === -1) return child
                                return (
                                  <span key={i}>
                                    {child.slice(0, idx)}
                                    <span className="text-brand-light">
                                      {highlight}
                                    </span>
                                    {child.slice(idx + highlight.length)}
                                  </span>
                                )
                              })}
                            </p>
                          )
                        },
                      },
                    }}
                  />
                </div>
              )}
              {socialProofCtaUrl && (
                <Link
                  href={socialProofCtaUrl}
                  className="cta-btn cta-btn-on-dark-outline w-full shrink-0 md:w-auto md:min-w-[216px]"
                >
                  <CtaLabel label={socialProofCtaLabel} />
                </Link>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8 -- How to buy this (prices live on /pricing)       */}
      {/* ============================================================ */}
      <section id="packages-on-pricing" className="scroll-mt-24 border-t border-ui bg-surface">
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
          <h2 className="text-section-h2">How to buy this</h2>
          <p className="mt-4 max-w-[640px] text-body-lead text-muted">
            Three packages cover this work. Prices, the comparison and the licence side are on the
            pricing page.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {packageTeaserTiers.map((tier) => (
              <Link
                key={tier.name}
                href="/pricing#packages"
                className="group flex items-start justify-between gap-4 rounded-card border border-ui bg-surface-raised p-6 shadow-whisper transition-colors hover:border-brand"
              >
                <div>
                  <h3 className="text-card-title group-hover:text-brand transition-colors">{tier.name}</h3>
                  {tier.hours && <p className="mt-1 text-sm text-muted">{tier.hours}</p>}
                </div>
                <span aria-hidden className="text-brand text-xl shrink-0">→</span>
              </Link>
            ))}
          </div>
          <Link href="/pricing#packages" className="cta-btn cta-btn-primary mt-8">
            See pricing and packages
          </Link>
        </div>
      </section>

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* ============================================================ */}
      {/* SECTION 9 -- Testimonials (shared carousel component)        */}
      {/* ============================================================ */}
      <TestimonialsGrid
        heading={testimonialsHeading}
        ctaLabel={testimonialsCtaLabel}
        ctaUrl={testimonialsCtaUrl}
        statCardValue={statCardValue}
        statCardSubtitle={statCardSubtitle}
        statCardCtaLabel={statCardCtaLabel}
        statCardCtaUrl={statCardCtaUrl}
        caseStudies={caseStudies as import("@/components/sections/types").CaseStudy[]}
      />

      {/* ============================================================ */}
      {/* SECTION 9b -- CRO action items                               */}
      {/* ============================================================ */}
      <CroSections
        data={data?.croSections}
        primaryCtaLabel={data?.heroPrimaryCtaLabel}
        primaryCtaUrl={bookingHref(data?.heroPrimaryCtaUrl || calendlyUrl)}
      />

      {/* ============================================================ */}
      {/* SECTION 10 -- Calendly Booking                               */}
      {/* ============================================================ */}
      {calendlyUrl && (
        <CalendlySection
          heading={calendlyHeading}
          calendlyUrl={calendlyUrl}
        />
      )}

      {/* ============================================================ */}
      {/* SECTION 11 -- FAQ                                            */}
      {/* ============================================================ */}
      {faqTabs.length > 0 && (
        <FaqAccordion heading={faqHeading} tabs={faqTabs as SharedFaqTab[]} />
      )}

      {/* ============================================================ */}
      {/* SECTION 12 -- Discover CTA                                   */}
      {/* ============================================================ */}
      <section className="bg-surface-subtle py-14 md:py-24">
        <div className="mx-auto flex flex-col items-center px-4">
          {/* Certifications badge */}
          {discoverBadgeSrc && (
            <FramedMedia>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={discoverBadgeSrc}
                alt="Certifications"
                width={325}
                height={73}
                className="h-auto w-full max-w-[325px] object-contain"
              />
            </FramedMedia>
          )}

          {/* Heading */}
          {discoverHeading && (
            <h2 className="text-section-h2 mt-7 w-full max-w-[694px] text-center text-body">
              {discoverHeading}
            </h2>
          )}

          {/* Dual CTA buttons */}
          {(discoverPrimaryCtaUrl || discoverSecondaryCtaUrl) && (
            <div className="mt-8 flex w-full max-w-[694px] flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
              {discoverPrimaryCtaUrl && (
                <Link
                  href={discoverPrimaryCtaUrl}
                  className="cta-btn cta-btn-outline w-full md:flex-1"
                >
                  <CtaLabel label={discoverPrimaryCtaLabel} />
                </Link>
              )}
              {discoverSecondaryCtaUrl && (
                <Link
                  href={discoverSecondaryCtaUrl}
                  className="cta-btn cta-btn-primary w-full md:flex-1"
                >
                  <CtaLabel label={discoverSecondaryCtaLabel} />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 13 -- Security Badge                                 */}
      {/* ============================================================ */}
      {securityBadgeSrc && (
        <section className="bg-surface px-4 pb-14 md:pb-24">
          <FramedMedia className="mx-auto max-w-[976px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={securityBadgeSrc}
              alt="Security certifications"
              width={976}
              height={94}
              className="w-full h-auto"
            />
          </FramedMedia>
        </section>
      )}
    </div>
  )
}

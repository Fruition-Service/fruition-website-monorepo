"use client"

import { bookingHref } from "@/lib/bookingLink"
import { useEffect, useRef, useState } from "react"
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
  const heroMondayPartnersImageSrc = imgSrc(data?.heroMondayPartnersImage)
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
  const servicesIntroImageSrc = imgSrc(data?.servicesIntroImage)
  const featureCards: FeatureCard[] = data?.featureCards ?? []

  const socialProofBannerHtml = data?.socialProofBannerHtml
  const socialProofCtaLabel = data?.socialProofCtaLabel
  const socialProofCtaUrl = data?.socialProofCtaUrl

  const pricingHeading = data?.pricingHeading

  /* ------------- Pricing cards (new) ------------- */
  type CurrencyCode = "USD" | "SGD" | "GBP" | "AUD" | "EUR"
  type RegionCode = "US" | "UK" | "APAC"

  const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; locale: string; label: string }> = {
    USD: { symbol: "$", rate: 1, locale: "en-US", label: "USD" },
    SGD: { symbol: "S$", rate: 1.34, locale: "en-SG", label: "SGD" },
    GBP: { symbol: "£", rate: 0.79, locale: "en-GB", label: "GBP" },
    AUD: { symbol: "A$", rate: 1.52, locale: "en-AU", label: "AUD" },
    EUR: { symbol: "€", rate: 0.92, locale: "de-DE", label: "EUR" },
  }
  const REGIONS: Record<RegionCode, { label: string; multiplier: number }> = {
    US: { label: "US", multiplier: 1.0 },
    UK: { label: "UK", multiplier: 0.95 },
    APAC: { label: "APAC", multiplier: 0.85 },
  }
  type PricingTier = {
    name: string
    hours: string
    basePrice: number
    pricePrefix?: string
    features: string[]
    featured?: boolean
  }
  const PRICING_TIERS: PricingTier[] = (data?.packageTiers ?? [])
    .filter((t): t is PackageTier => !!t && typeof t.name === "string" && typeof t.basePrice === "number")
    .map((t) => ({
      name: t.name as string,
      hours: t.hours ?? "",
      basePrice: t.basePrice as number,
      pricePrefix: t.pricePrefix,
      features: (t.features ?? []).filter((f): f is string => typeof f === "string"),
      featured: !!t.featured,
    }))
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [region, setRegion] = useState<RegionCode>("US")
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [hoveredTier, setHoveredTier] = useState<string | null>(null)
  const [currencyHover, setCurrencyHover] = useState(false)
  const [regionHover, setRegionHover] = useState(false)
  const currencyRef = useRef<HTMLDivElement | null>(null)
  const regionRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node
      if (currencyRef.current && !currencyRef.current.contains(t)) setCurrencyOpen(false)
      if (regionRef.current && !regionRef.current.contains(t)) setRegionOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const formatPrice = (base: number): string => {
    const { rate, locale, symbol } = CURRENCIES[currency]
    const adjusted = base * REGIONS[region].multiplier * rate
    const rounded = Math.round(adjusted / 100) * 100
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(rounded)
    return `${symbol}${formatted}`
  }

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
  const methodologySteps: MethodologyStep[] = data?.methodologySteps ?? []

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

          {/* Monday Partners image */}
          <FramedMedia className="mt-10 w-full max-w-[924px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/monday-partners.avif"
              alt="Monday.com Partners"
              width={924}
              height={0}
              className="w-full max-w-[924px] h-auto object-contain"
            />
          </FramedMedia>

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
      {/* SECTION 4 -- Services Content (bg-[#f0ecfe])                 */}
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

          {/* 4b: Two feature cards */}
          {featureCards.length > 0 && (
          <div className="mt-10 md:mt-14 grid w-full max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
            {featureCards.map((card, i) => (
              <div
                key={card._key ?? i}
                className="dark:shadow-none rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 md:p-7"
              >
                <div className="flex items-start gap-5 md:gap-7">
                  <span className="text-5xl leading-none md:text-6xl">{card.emoji}</span>
                  <h3 className="text-card-title text-body font-medium">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-5 text-body">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          )}

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
                                const highlight = "500+ small-medium sized enterprises"
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
      {/* SECTION 4.5 -- Pricing Packages                              */}
      {/* ============================================================ */}
      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col px-4 py-14 md:py-24">
          {/* Header row: heading left, dropdowns right */}
          <div className="flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-[640px] flex-col text-left">
              <h2 className="text-section-h2 text-body">
                {pricingHeading || "Pricing Packages"}
              </h2>
              <p className="mt-3.5 text-body-lead text-muted">
                {data?.pricingSubheading || "Hit the ground running and drive lasting impact with hands-on support"}
              </p>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Currency dropdown */}
              <div ref={currencyRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyOpen((o) => !o)
                    setRegionOpen(false)
                  }}
                  onMouseEnter={() => setCurrencyHover(true)}
                  onMouseLeave={() => setCurrencyHover(false)}
                  className="flex h-11 cursor-pointer items-center gap-2.5 rounded-pill border bg-surface-raised pl-[18px] pr-3.5 text-sm font-semibold text-body transition-[border-color,box-shadow,transform] duration-150 ease-out"
                  style={{
                    borderColor: currencyHover || currencyOpen ? "var(--purple-primary)" : "var(--border-ui)",
                    boxShadow: currencyHover
                      ? "0px 4px 12px rgba(128,21,232,0.12)"
                      : "0px 1px 2px rgba(43,7,77,0.04)",
                    transform: currencyHover ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-brand">
                    CURRENCY
                  </span>
                  <span>{CURRENCIES[currency].symbol} {CURRENCIES[currency].label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-brand transition-transform duration-150" style={{ transform: currencyOpen ? "rotate(180deg)" : "none" }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {currencyOpen && (
                  <div className="dark:shadow-none absolute left-0 top-[calc(100%+8px)] z-20 min-w-[180px] rounded-2xl border border-ui bg-surface-raised p-1.5 shadow-[0px_12px_32px_rgba(43,7,77,0.12)]">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                      const active = code === currency
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setCurrency(code)
                            setCurrencyOpen(false)
                          }}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-[10px] px-3.5 py-2.5 text-left text-sm ${
                            active ? "bg-brand/[0.08] font-semibold text-brand" : "bg-transparent font-medium text-body"
                          }`}
                        >
                          <span>{CURRENCIES[code].label}</span>
                          <span className="font-normal text-muted">{CURRENCIES[code].symbol}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Region dropdown */}
              <div ref={regionRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setRegionOpen((o) => !o)
                    setCurrencyOpen(false)
                  }}
                  onMouseEnter={() => setRegionHover(true)}
                  onMouseLeave={() => setRegionHover(false)}
                  className="flex h-11 cursor-pointer items-center gap-2.5 rounded-pill border bg-surface-raised pl-[18px] pr-3.5 text-sm font-semibold text-body transition-[border-color,box-shadow,transform] duration-150 ease-out"
                  style={{
                    borderColor: regionHover || regionOpen ? "var(--purple-primary)" : "var(--border-ui)",
                    boxShadow: regionHover
                      ? "0px 4px 12px rgba(128,21,232,0.12)"
                      : "0px 1px 2px rgba(43,7,77,0.04)",
                    transform: regionHover ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-brand">
                    TEAM
                  </span>
                  <span>{REGIONS[region].label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-brand transition-transform duration-150" style={{ transform: regionOpen ? "rotate(180deg)" : "none" }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {regionOpen && (
                  <div className="dark:shadow-none absolute left-0 top-[calc(100%+8px)] z-20 min-w-[180px] rounded-2xl border border-ui bg-surface-raised p-1.5 shadow-[0px_12px_32px_rgba(43,7,77,0.12)]">
                    {(Object.keys(REGIONS) as RegionCode[]).map((code) => {
                      const active = code === region
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setRegion(code)
                            setRegionOpen(false)
                          }}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-[10px] px-3.5 py-2.5 text-left text-sm ${
                            active ? "bg-brand/[0.08] font-semibold text-brand" : "bg-transparent font-medium text-body"
                          }`}
                        >
                          <span>{REGIONS[code].label}</span>
                          <span className="text-xs font-normal text-muted">
                            {code === "US" ? "Americas" : code === "UK" ? "EMEA" : "Asia-Pacific"}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Cards */}
            <div className="mt-11 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
              {PRICING_TIERS.map((tier) => {
                const featured = !!tier.featured
                const hovered = hoveredTier === tier.name
                const hoverLift = hovered ? -4 : 0
                return (
                  <div
                    key={tier.name}
                    className={`relative flex flex-col rounded-[28px] p-6 transition-[transform,box-shadow] duration-200 ease-out md:p-8 ${
                      featured
                        ? "bg-gradient-to-br from-brand to-brand-dark text-white md:-translate-y-3"
                        : "dark:shadow-none border border-ui bg-surface-raised text-body"
                    }`}
                    onMouseEnter={() => setHoveredTier(tier.name)}
                    onMouseLeave={() => setHoveredTier(null)}
                    style={{
                      transform: `translateY(${hoverLift}px)`,
                      boxShadow: featured
                        ? hovered
                          ? "0px 32px 72px rgba(125,20,227,0.45), 0px 0px 0px 1px rgba(125,20,227,0.4)"
                          : "0px 24px 60px rgba(125,20,227,0.35), 0px 0px 0px 1px rgba(125,20,227,0.4)"
                        : hovered
                          ? "0px 16px 36px rgba(43,7,77,0.12)"
                          : "0px 8px 24px rgba(43,7,77,0.06)",
                    }}
                  >
                    {/* Name */}
                    <h3 className={`text-card-title ${featured ? "text-white" : "text-body"}`}>
                      {tier.name}
                    </h3>

                    {/* Hours */}
                    <p className={`mt-1 text-sm font-medium ${featured ? "text-white/[0.78]" : "text-muted"}`}>
                      {tier.hours}
                    </p>

                    {/* Price */}
                    <div className="mt-[18px] flex flex-wrap items-baseline gap-1.5">
                      {tier.pricePrefix && (
                        <span className={`text-lg font-medium ${featured ? "text-white/[0.85]" : "text-muted"}`}>
                          {tier.pricePrefix}
                        </span>
                      )}
                      <span
                        className={`text-[32px] font-semibold leading-none tracking-[-0.02em] md:text-[40px] ${
                          featured ? "text-white" : "text-body"
                        }`}
                      >
                        {formatPrice(tier.basePrice)}
                      </span>
                    </div>
                    <p className={`mt-1.5 text-xs ${featured ? "text-white/70" : "text-muted"}`}>
                      {CURRENCIES[currency].label} · {REGIONS[region].label} team rate
                    </p>

                    {/* Divider */}
                    <div className={`mb-5 mt-6 h-px ${featured ? "bg-white/[0.18]" : "bg-ui"}`} />

                    {/* Features */}
                    <ul className="flex flex-col gap-3">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm leading-normal">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 11 11"
                            fill="none"
                            className={`mt-1 shrink-0 ${featured ? "text-white" : "text-brand"}`}
                          >
                            <path
                              d="M1.5 5.6l2.6 2.6L9.5 2.8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className={featured ? "text-white/95" : "text-body"}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href={heroPrimaryCtaUrl || "#"}
                      className={`mt-7 flex h-12 items-center justify-center rounded-pill text-sm font-bold ${
                        featured
                          ? "bg-white text-brand"
                          : "bg-gradient-to-r from-brand to-brand-light text-white"
                      }`}
                    >
                      Get started
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Footnote */}
            <p className="mt-7 text-center text-xs italic text-muted">
              {data?.pricingFootnote || "*Please note: you must purchase one package per product. Prices shown are estimates and may vary by scope."}
            </p>
          </div>

      </section>

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* ============================================================ */}
      {/* SECTION 5 -- Testimonials (shared carousel component)        */}
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
      {/* SECTION 5b -- CRO action items                               */}
      {/* ============================================================ */}
      <CroSections
        data={data?.croSections}
        primaryCtaLabel={data?.heroPrimaryCtaLabel}
        primaryCtaUrl={bookingHref(data?.heroPrimaryCtaUrl || calendlyUrl)}
      />

      {/* ============================================================ */}
      {/* SECTION 6 -- Calendly Booking                                */}
      {/* ============================================================ */}
      {calendlyUrl && (
        <CalendlySection
          heading={calendlyHeading}
          calendlyUrl={calendlyUrl}
        />
      )}

      {/* ============================================================ */}
      {/* SECTION 7 -- FAQ                                             */}
      {/* ============================================================ */}
      {faqTabs.length > 0 && (
        <FaqAccordion heading={faqHeading} tabs={faqTabs as SharedFaqTab[]} />
      )}

      {/* ============================================================ */}
      {/* SECTION 8 -- Discover CTA                                    */}
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
      {/* SECTION 9 -- Implementation Methodology                     */}
      {/* ============================================================ */}
      {methodologySteps.length > 0 && (
      <section className="bg-surface py-14 md:py-24">
        <div className="mx-auto flex w-full max-w-[1040px] flex-col items-center gap-10 px-4 md:px-6 md:gap-14 lg:px-8">
          {/* Heading */}
          <h2 className="text-section-h2 text-center">
            <span className="text-body">{methodologyHeading}</span>
            <br />
            <span className="text-brand">{methodologyHeadingAccent}</span>
          </h2>

          {/* Steps grid — 2 columns on md+, 1 column on mobile */}
          <div className="grid w-full grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
            {methodologySteps.map((step, si) => (
              <div
                key={step._key ?? step.number ?? si}
                className="flex flex-col items-start"
              >
                {/* Number */}
                <p className="mb-4 text-[44px] font-extralight leading-none text-brand md:text-[56px]">
                  {step.number}
                </p>
                {/* Content */}
                <h3 className="mb-2 text-lg font-bold leading-snug text-body">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-body-sm text-muted">
                    {step.description}
                  </p>
                )}
                {step.bullets && step.bullets.length > 0 && (
                  <ul className="mt-4 list-disc pl-5 text-body-sm text-muted">
                    {step.bullets.map((b, bi) => (
                      <li key={bi} className="mb-1">{b}</li>
                    ))}
                  </ul>
                )}
                {step.extraText && (
                  <p className="mt-4 text-body-sm text-muted">
                    {step.extraText}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 10 -- Security Badge                                 */}
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

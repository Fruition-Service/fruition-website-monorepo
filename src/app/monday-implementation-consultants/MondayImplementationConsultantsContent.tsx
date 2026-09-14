"use client"

import { bookingHref } from "@/lib/bookingLink"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import CalendlySection from "@/components/sections/CalendlySection"
import StatsBlockView from "@/components/sections/StatsBlockView"
import ComparisonTabsSection from "@/components/sections/ComparisonTabsSection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import CroSections, { type CroSectionsData } from "@/components/sections/CroSections"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import CtaLabel from "@/components/CtaLabel"
import type { ComparisonTab as SharedComparisonTab, FaqTab as SharedFaqTab } from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

interface PortableTextChild {
  _type?: string
  text?: string
}
interface PortableTextBlock {
  _type?: string
  _key?: string
  style?: string
  children?: PortableTextChild[]
}

interface Bullet {
  _key?: string
  emoji?: string
  text?: string
}
interface ComparisonItem {
  _key?: string
  number?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}
interface ComparisonTab {
  _key?: string
  label?: string
  items?: ComparisonItem[]
}

interface MethodologyStep {
  _key?: string
  number?: string
  title?: string
  description?: string
}

interface SolutionCard {
  _key?: string
  eyebrow?: string
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: SanityImageRef
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

interface Stat {
  _key?: string
  value?: string
  label?: string
}

interface CarouselLogo {
  _key?: string
  alt?: string
  image?: SanityImageRef
}

interface CaseStudy {
  _id?: string
  clientName?: string
  clientRole?: string
  clientCompany?: string
  quote?: string
  logo?: SanityImageRef
  linkedinUrl?: string
}

export interface MicPageData {
  title?: string
  seoTitle?: string
  seoDescription?: string
  croSections?: CroSectionsData | null

  heroEyebrow?: string
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroHeadingPart2?: string
  heroSubheading?: string
  heroPartnerBadges?: Array<{ _key?: string; image?: SanityImageRef; alt?: string }>
  heroMondayPartnersImage?: SanityImageRef
  heroProductImages?: Array<{ _key?: string; image?: SanityImageRef; alt?: string }>
  heroCertificationBadge?: SanityImageRef
  heroImage?: SanityImageRef
  videoEmbedUrl?: string
  videoTitle?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string

  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string

  teamsTransformedHeading?: string
  teamsTransformedBody?: PortableTextBlock[]

  comparisonSectionHeading?: string
  comparisonTabs?: ComparisonTab[]

  methodologyHeading?: string
  methodologySteps?: MethodologyStep[]

  solutionsHeadingPart1?: string
  solutionsHeadingAccent?: string
  solutionsHeadingPart2?: string
  solutionsIntro?: string
  solutionCards?: SolutionCard[]

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
  joinSectionStats?: Stat[]
  joinSectionFootnote?: string
  joinSectionBadge?: SanityImageRef

  securityBadge?: SanityImageRef
}

interface Props {
  data: MicPageData | null
  carouselLogos: CarouselLogo[]
  caseStudies: CaseStudy[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings?: any
  /** Central faqItem tabs — overrides `data.faqTabs` when non-empty. */
  faqTabs?: FaqTab[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function imageUrl(ref: SanityImageRef): string | null {
  if (!ref || !ref.asset?._ref) return null
  try {
    return urlFor(ref).width(800).height(600).fit("crop").auto("format").url()
  } catch {
    return null
  }
}

function portableTextToString(blocks?: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return ""
  return blocks
    .map((block) =>
      (block.children || [])
        .map((child) => child.text || "")
        .join("")
    )
    .filter(Boolean)
    .join("\n\n")
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MondayImplementationConsultantsContent({
  data,
  carouselLogos = [],
  caseStudies = [],
  siteSettings,
  faqTabs: faqTabsOverride,
}: Props) {
  const comparisonTabs = data?.comparisonTabs ?? []
  const methodologySteps = data?.methodologySteps ?? []
  const solutionCards = data?.solutionCards ?? []
  const faqTabs = faqTabsOverride?.length ? faqTabsOverride : (data?.faqTabs ?? [])
  const stats = data?.joinSectionStats ?? []

  // Carousel logos — duplicate for the marquee loop
  const normalizedLogos = carouselLogos
    .map((logo, i) => ({
      key: logo._key || `logo-${i}`,
      src: imageUrl(logo.image),
      alt: logo.alt || `Client ${i + 1}`,
    }))
    .filter((l) => l.src)
  const duplicatedLogos = [...normalizedLogos, ...normalizedLogos]

  const heroEyebrow = data?.heroEyebrow
  const heroHeadingPart1 = data?.heroHeadingPart1
  const heroHeadingAccent = data?.heroHeadingAccent
  const heroHeadingPart2 = data?.heroHeadingPart2
  const heroSubheading = data?.heroSubheading

  const heroCertBadgeSrc = imageUrl(data?.heroCertificationBadge) || imageUrl(siteSettings?.badgeCertifications)
  const discoverBadgeSrc = imageUrl(data?.discoverBadge)
  const securityBadgeSrc = imageUrl(data?.securityBadge)
  const joinBadgeSrc = imageUrl(data?.joinSectionBadge)

  type ResolvedImage = { _key: string | undefined; src: string; alt: string }
  const sanityPartnerBadges: ResolvedImage[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedImage => x !== null)
  const navPartnerBadges: ResolvedImage[] = (siteSettings?.navbarPartnerBadges ?? [])
    .map((b: { _key?: string; name?: string; image?: SanityImageRef }, i: number): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key ?? `nav-badge-${i}`, src, alt: b.name ?? `Partner badge ${i + 1}` }
    })
    .filter((x: ResolvedImage | null): x is ResolvedImage => x !== null)
  const heroPartnerBadges = sanityPartnerBadges.length > 0 ? sanityPartnerBadges : navPartnerBadges
  const heroMondayPartnersImageSrc = imageUrl(data?.heroMondayPartnersImage)
  const heroDashboardImageSrc = imageUrl(data?.heroImage) || "/images/hero-monday-dashboards.avif"
  const heroProductImages: ResolvedImage[] = (data?.heroProductImages ?? [])
    .map((b, i): ResolvedImage | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Product ${i + 1}` }
    })
    .filter((x): x is ResolvedImage => x !== null)
  const videoEmbedUrl = data?.videoEmbedUrl || "https://www.youtube.com/embed/7vtrtlfC1Zg"
  const videoTitle = data?.videoTitle

  const heroPrimaryCtaLabel = data?.heroPrimaryCtaLabel
  const heroPrimaryCtaUrl = data?.heroPrimaryCtaUrl
  const heroSecondaryCtaLabel = data?.heroSecondaryCtaLabel
  const heroSecondaryCtaUrl = data?.heroSecondaryCtaUrl

  const logoCloudPart1 = data?.logoCloudHeadingPart1
  const logoCloudAccent = data?.logoCloudHeadingAccent

  const teamsHeading = data?.teamsTransformedHeading
  const teamsBody = portableTextToString(data?.teamsTransformedBody)

  const comparisonHeading = data?.comparisonSectionHeading

  const methodologyHeading = data?.methodologyHeading

  // Build the resolved tab list. The third tab ("Our Approach") has stale items in
  // the CMS, so we override it with methodologySteps which contain the correct
  // Process Discovery → ... Change Readiness content. We also attach per-tab
  // section headings so they swap with the active tab.
  const resolvedComparisonTabs = comparisonTabs.map((tab, idx) => {
    const label = tab.label ?? ""
    const isOurApproach =
      label.toLowerCase().includes("our approach") ||
      (idx === comparisonTabs.length - 1 && comparisonTabs.length >= 3)

    if (isOurApproach && methodologySteps.length > 0) {
      return {
        ...tab,
        heading: methodologyHeading,
        items: methodologySteps.map((s) => ({
          _key: s._key,
          number: s.number,
          title: s.title,
          description: s.description,
        })) as ComparisonItem[],
      }
    }

    if (idx === 0) {
      return { ...tab, heading: comparisonHeading }
    }

    return { ...tab, heading: undefined as string | undefined }
  })

  const solutionsPart1 = data?.solutionsHeadingPart1
  const solutionsAccent = data?.solutionsHeadingAccent
  const solutionsPart2 = data?.solutionsHeadingPart2
  const solutionsIntro = data?.solutionsIntro

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

  const discoverHeading = data?.discoverHeading
  const discoverPrimaryCtaLabel = data?.discoverPrimaryCtaLabel
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl
  const discoverSecondaryCtaLabel = data?.discoverSecondaryCtaLabel
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl

  const joinPart1 = data?.joinSectionHeadingPart1
  const joinAccent = data?.joinSectionHeadingAccent
  const joinPart2 = data?.joinSectionHeadingPart2
  const joinSubheading = data?.joinSectionSubheading
  const joinFootnote = data?.joinSectionFootnote

  return (
    <div>
      <StickyCtaConfig label={data?.croSections?.stickyCtaLabel} mobileLabel={data?.croSections?.stickyCtaMobileLabel} href={bookingHref(data?.croSections?.stickyCtaUrl || calendlyUrl)} />
      {/* ============================================================ */}
      {/* SECTION 1 — Hero                                             */}
      {/* ============================================================ */}
      <section className="bg-surface">
        <div className="mx-auto flex flex-col items-center px-4 lg:px-[120px] py-14 md:py-20 w-full max-w-[1600px]">
          {/* Partner badges */}
          {heroPartnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center gap-[22px]">
              {heroPartnerBadges.map((badge) => (
                <Image
                  key={badge._key ?? badge.src}
                  src={badge.src}
                  alt={badge.alt}
                  width={120}
                  height={44}
                  className="h-[44px] w-auto rounded-[5px]"
                  unoptimized
                />
              ))}
            </div>
          )}

          {/* Heading */}
          <h1 className="text-display text-center mt-4 max-w-[924px] whitespace-pre-line">
            {heroHeadingPart1 && <span className="text-body">{heroHeadingPart1}</span>}
            <span className="text-brand">{heroHeadingAccent}</span>
            {heroHeadingPart2 && <span className="text-body">{heroHeadingPart2}</span>}
          </h1>

          {/* Subheading */}
          {heroSubheading && (
            <p className="text-body-lead text-muted text-center mt-8 max-w-[859px] whitespace-pre-line">
              {heroSubheading}
            </p>
          )}

          {/* Certification badge */}
          {heroCertBadgeSrc && (
            <div className="mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCertBadgeSrc}
                alt="monday.com Certifications"
                className="w-full max-w-[534px] h-auto object-contain"
              />
            </div>
          )}

          {/* Monday Partners image */}
          <div className="mt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/39b8ef_abd15c5dcf7c4d16a392b5693a6f7923~mv2.png/v1/fill/w_534,h_133,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MONDAY%20PARTNERS.png"
              alt="Monday.com Partners"
              width={534}
              height={133}
              className="w-full max-w-[415px] h-auto object-contain"
            />
          </div>

          {/* Dual CTA */}
          {(heroPrimaryCtaUrl || heroSecondaryCtaUrl) && (
            <div className="flex flex-col md:flex-row items-center justify-center flex-wrap w-full max-w-[680px] gap-5 mt-10">
              {heroPrimaryCtaUrl && (
                <Link
                  href={heroPrimaryCtaUrl}
                  className="cta-btn cta-btn-outline w-full md:flex-1 md:max-w-[330px]"
                >
                  <CtaLabel label={heroPrimaryCtaLabel} />
                </Link>
              )}
              {heroSecondaryCtaUrl && (
                <Link
                  href={heroSecondaryCtaUrl}
                  className="cta-btn cta-btn-primary w-full md:flex-1 md:max-w-[330px]"
                >
                  <CtaLabel label={heroSecondaryCtaLabel} />
                </Link>
              )}
            </div>
          )}

          {/* Hero dashboard image */}
          {heroDashboardImageSrc && (
            <div className="w-full max-w-[1042px] mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroDashboardImageSrc}
                alt="monday.com dashboards"
                width={1042}
                height={312}
                className="rounded-card object-contain bg-surface-raised w-full h-auto aspect-[1042/312]"
              />
            </div>
          )}

          {/* Product images row */}
          {heroProductImages.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {heroProductImages.map((img) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={img._key ?? img.src}
                  src={img.src}
                  alt={img.alt}
                  className="h-auto object-contain w-full max-w-[220px]"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 1b — monday product logos strip                       */}
      {/* ============================================================ */}
      <section className="px-4 py-10 bg-gradient-to-b from-surface to-brand-soft">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-x-[56px] gap-y-6 max-w-[1100px]">
          {[
            { src: "/images/monday-crm-logo.avif", alt: "monday CRM" },
            { src: "/images/monday-wm-logo.avif", alt: "monday work management" },
            { src: "/images/monday-svc-logo.avif", alt: "monday service" },
            { src: "/images/monday-dev-logo.avif", alt: "monday dev" },
          ].map((logo) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              className="h-[40px] w-auto object-contain"
            />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — Logo cloud marquee                               */}
      {/* ============================================================ */}
      <section className="bg-surface py-14 md:py-20 px-4">
        <div className="flex flex-col gap-[35px] items-center w-full max-w-[1348px] mx-auto">
          <p className="text-section-h3 text-center">
            <span className="text-body">{logoCloudPart1}</span>
            <span className="text-brand">{logoCloudAccent}</span>
          </p>
          {duplicatedLogos.length > 0 && (
            <div className="w-full overflow-hidden">
              <div className="flex items-center gap-[65px] animate-marquee w-max">
                {duplicatedLogos.map((logo, i) => (
                  <div
                    key={`logo-${i}`}
                    className="flex items-center justify-center shrink-0 h-[65px] overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src!}
                      alt={logo.alt}
                      height={65}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2b — Video Embed                                     */}
      {/* ============================================================ */}
      {videoEmbedUrl && (
        <section className="bg-surface pb-14 md:pb-20">
          <div className="mx-auto px-4 max-w-[1042px]">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={videoEmbedUrl} title={videoTitle} />
            </div>
          </div>
        </section>
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* ============================================================ */}
      {/* SECTION 4 — Comparison tabs (DIY / Benefits / Our Approach)  */}
      {/* ============================================================ */}
      <ComparisonTabsSection
        heading={teamsHeading}
        subheading={teamsBody}
        tabs={resolvedComparisonTabs as SharedComparisonTab[]}
      />

      {/* CRO action items */}
      <CroSections data={data?.croSections} primaryCtaLabel={data?.heroPrimaryCtaLabel} primaryCtaUrl={calendlyUrl} />

      {/* ============================================================ */}
      {/* SECTION 5 — Calendly                                         */}
      {/* ============================================================ */}
      {calendlyUrl && (
        <CalendlySection
          heading={calendlyHeading}
          calendlyUrl={calendlyUrl}
        />
      )}

      {/* ============================================================ */}
      {/* SECTION 7 — FAQ                                              */}
      {/* ============================================================ */}
      <FaqAccordion heading={faqHeading} tabs={faqTabs as SharedFaqTab[]} />

      {/* ============================================================ */}
      {/* SECTION 8 — Solution cards                                   */}
      {/* ============================================================ */}
      <section className="bg-surface py-14 md:py-20">
        <div className="mx-auto px-4 max-w-[1200px]">
          {/* Solution cards — alternating sides.
              Re-map source data to match design: synthesize CRM card from
              section heading/intro + first card's eyebrow-as-CTA, then
              shift remaining cards down one slot. */}
          {(() => {
            const crmHeading = `${solutionsPart1 ?? ""}${solutionsAccent ?? ""}${solutionsPart2 ?? ""}`.trim()
            const crmCard: SolutionCard = {
              _key: "synthesized-crm",
              heading: crmHeading,
              body: solutionsIntro,
              ctaLabel: solutionCards[0]?.eyebrow,
              ctaUrl: "/monday-crm-consulting",
              image: solutionCards[3]?.image ?? solutionCards[0]?.image,
            }
            const rollupCard: SolutionCard | null = solutionCards[0]
              ? {
                  _key: solutionCards[0]._key ?? "rollup",
                  eyebrow: undefined,
                  heading: solutionCards[0].heading,
                  body: solutionCards[0].body,
                  ctaLabel: solutionCards[0].ctaLabel,
                  ctaUrl: solutionCards[0].ctaUrl,
                  image: solutionCards[0].image,
                }
              : null
            const orderedCards: SolutionCard[] = [
              crmCard,
              ...(rollupCard ? [rollupCard] : []),
              ...(solutionCards[1] ? [solutionCards[1]] : []),
              ...(solutionCards[2] ? [solutionCards[2]] : []),
            ]

            return (
              <div className="flex flex-col gap-10">
                {orderedCards.map((card, i) => {
                  const imgSrc = imageUrl(card.image)
                  const reverse = i % 2 === 0
              return (
                <div
                  key={card._key || i}
                  className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center overflow-hidden`}
                >
                  {/* Text column */}
                  <div className="flex-1 w-full p-6 md:p-10">
                    {card.eyebrow && (
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                        {card.eyebrow}
                      </p>
                    )}
                    <h3 className="text-section-h3 text-surface-dark-2 mt-3">
                      {card.heading}
                    </h3>
                    {card.body && (
                      <p className="text-body-sm text-muted mt-4 whitespace-pre-line">
                        {card.body}
                      </p>
                    )}
                    {card.ctaLabel && card.ctaUrl && (
                      <Link href={card.ctaUrl} className="cta-btn cta-btn-primary mt-6">
                        <CtaLabel label={card.ctaLabel} />
                      </Link>
                    )}
                  </div>

                  {/* Image column */}
                  <div className="flex-1 w-full min-h-[240px] md:min-h-[320px] bg-surface-raised">
                    {imgSrc && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imgSrc}
                        alt={card.heading ?? ""}
                        className="w-full h-full object-contain min-h-[240px] md:min-h-[320px]"
                      />
                    )}
                  </div>
                </div>
              )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9 — Testimonials (shared carousel component)         */}
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

      {/* Discover CTA removed from this page */}

      {/* ============================================================ */}
      {/* SECTION 11 — Join 900+ stats (shared StatsBlockView)         */}
      {/* ============================================================ */}
      <StatsBlockView
        heading={`${joinPart1 ?? ""}${joinAccent ?? ""}${joinPart2 ?? ""}`}
        subheading={joinSubheading}
        stats={stats.map((s) => ({ _key: s._key, value: s.value, label: s.label }))}
        footnote={joinFootnote}
        siteSettings={siteSettings || undefined}
        showMondayPartnersBadge={false}
      />

      {/* ============================================================ */}
      {/* SECTION 12 — Security badge                                   */}
      {/* ============================================================ */}
      <section className="bg-surface px-4 pt-10 pb-14 md:pb-20">
        <div className="mx-auto max-w-[976px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://static.wixstatic.com/media/d6e205_dd894a9db73241b2a6b8e6bdb4ee7585~mv2.png/v1/fill/w_976,h_94,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Security.png"
            alt="Security partners"
            width={976}
            height={94}
            className="w-full h-auto"
          />
        </div>
      </section>
    </div>
  )
}

"use client"

import { bookingHref } from "@/lib/bookingLink"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import StatsBlockView from "@/components/sections/StatsBlockView"
import TestimonialsGrid from "@/components/sections/TestimonialsGrid"
import BookingSection from "@/components/sections/BookingSection"
import PaperPlaneIcon from "@/components/common/icons/PaperPlaneIcon"
import FaqAccordion from "@/components/sections/FaqAccordion"
import LeftRightSection from "@/components/sections/LeftRightSection"
import CroSections, { type CroSectionsData } from "@/components/sections/CroSections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import TrainingRecommender from "@/components/sections/TrainingRecommender"
import type { FaqTab as SharedFaqTab } from "@/components/sections/types"
import type { SiteSettings } from "@/types/siteSettings"
import CtaLabel from "@/components/CtaLabel"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SanityImageRef = { asset?: { _ref?: string } } | null | undefined

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

interface FaqPair {
  question?: string
  answer?: string
}

interface FaqTab {
  _key?: string
  label?: string
  items?: FaqPair[]
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

interface MondayTrainingData {
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

interface NavbarPartnerBadge {
  name?: string
  image?: SanityImageRef
  width?: number
  height?: number
}

interface MondayTrainingContentProps {
  data?: MondayTrainingData | null
  carouselLogos?: CarouselLogo[]
  caseStudies?: CaseStudy[]
  siteSettings?: SiteSettings | null
  /** Central faqItem tabs — overrides `data.faqTabs` when non-empty. */
  faqTabs?: FaqTab[]
  navbarPartnerBadges?: NavbarPartnerBadge[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function imageUrl(ref: SanityImageRef): string | null {
  if (!ref || !ref.asset?._ref) return null
  try {
    return urlFor(ref).width(800).auto("format").url()
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MondayTrainingContent({
  data,
  carouselLogos = [],
  caseStudies = [],
  siteSettings = null,
  faqTabs: faqTabsOverride,
  navbarPartnerBadges,
}: MondayTrainingContentProps) {
  const trainingTabs = data?.trainingTabs ?? []
  const faqTabs = faqTabsOverride?.length ? faqTabsOverride : (data?.faqTabs ?? [])
  const trainingServices = data?.trainingServices ?? []

  const [activeTrainingTab, setActiveTrainingTab] = useState<number>(0)

  // Carousel logos — duplicate for the marquee effect
  const normalizedLogos = carouselLogos
    .map((logo, i) => ({
      key: logo._key || `logo-${i}`,
      src: imageUrl(logo.image),
      alt: logo.alt || `Client ${i + 1}`,
    }))
    .filter((l) => l.src)
  const duplicatedLogos = [...normalizedLogos, ...normalizedLogos]

  const heroImageSrc = imageUrl(data?.heroImage)
  const heroCertBadgeSrc = imageUrl(data?.heroCertificationBadge)
  const discoverBadgeSrc = imageUrl(data?.discoverBadge)
  const securityBadgeSrc = imageUrl(data?.securityBadge)

  type ResolvedPartnerBadge = { _key: string | undefined; src: string; alt: string }
  const sanityBadges: ResolvedPartnerBadge[] = (data?.heroPartnerBadges ?? [])
    .map((b, i): ResolvedPartnerBadge | null => {
      const src = imageUrl(b.image)
      if (!src) return null
      return { _key: b._key, src, alt: b.alt ?? `Partner badge ${i + 1}` }
    })
    .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroPartnerBadges: ResolvedPartnerBadge[] = sanityBadges.length > 0
    ? sanityBadges
    : (navbarPartnerBadges ?? [])
        .map((b, i): ResolvedPartnerBadge | null => {
          const src = imageUrl(b.image)
          if (!src) return null
          return { _key: `nav-badge-${i}`, src, alt: b.name ?? `Partner badge ${i + 1}` }
        })
        .filter((x): x is ResolvedPartnerBadge => x !== null)
  const heroMondayPartnersImageSrc = imageUrl(data?.heroMondayPartnersImage)
  const empowerImageSrc = imageUrl(data?.empowerImage)

  const heroHeadingPart1 = data?.heroHeadingPart1
  const heroHeadingAccent = data?.heroHeadingAccent
  const heroSubheading = data?.heroSubheading

  const primaryCtaLabel = data?.heroPrimaryCtaLabel
  const primaryCtaUrl = data?.heroPrimaryCtaUrl
  // Secondary CTA is optional — only render when both label and URL are set
  const showSecondaryCta = Boolean(data?.heroSecondaryCtaLabel && data?.heroSecondaryCtaUrl)
  const secondaryCtaLabel = data?.heroSecondaryCtaLabel
  const secondaryCtaUrl = data?.heroSecondaryCtaUrl

  const logoCloudPart1 = data?.logoCloudHeadingPart1
  const logoCloudAccent = data?.logoCloudHeadingAccent

  const videoEmbedUrl = data?.videoEmbedUrl
  const videoTitle = data?.videoTitle

  const trainingIntroHeading = data?.trainingIntroHeading
  const trainingIntroSubheading = data?.trainingIntroSubheading
  const trainingSectionHeading = data?.trainingSectionHeading

  const empowerEyebrow = data?.empowerEyebrow
  const empowerHeading = data?.empowerHeading
  const empowerBody = data?.empowerBody

  const testimonialsHeading = data?.testimonialsHeading
  const testimonialsCtaLabel = data?.testimonialsCtaLabel
  const testimonialsCtaUrl = data?.testimonialsCtaUrl
  const statCardValue = data?.statCardValue
  const statCardSubtitle = data?.statCardSubtitle
  const statCardCtaLabel = data?.statCardCtaLabel
  const statCardCtaUrl = data?.statCardCtaUrl

  const calendlyUrl = data?.calendlyUrl

  const joinSectionHeadingPart1 = data?.joinSectionHeadingPart1
  const joinSectionHeadingAccent = data?.joinSectionHeadingAccent
  const joinSectionHeadingPart2 = data?.joinSectionHeadingPart2
  const joinSectionSubheading = data?.joinSectionSubheading
  const joinSectionStats = data?.joinSectionStats ?? []
  const joinSectionFootnote = data?.joinSectionFootnote
  const joinSectionBadgeSrc = imageUrl(data?.joinSectionBadge)

  const faqHeading = data?.faqHeading

  const discoverHeading = data?.discoverHeading
  const discoverPrimaryCtaLabel = data?.discoverPrimaryCtaLabel
  const discoverPrimaryCtaUrl = data?.discoverPrimaryCtaUrl
  const discoverSecondaryCtaLabel = data?.discoverSecondaryCtaLabel
  const discoverSecondaryCtaUrl = data?.discoverSecondaryCtaUrl

  const currentTrainingItems =
    trainingTabs[activeTrainingTab]?.items ?? []

  return (
    <div>
      <StickyCtaConfig label={data?.croSections?.stickyCtaLabel} mobileLabel={data?.croSections?.stickyCtaMobileLabel} href={bookingHref(data?.croSections?.stickyCtaUrl || calendlyUrl)} />
      {/* ============================================================ */}
      {/* SECTION 1 -- Hero                                            */}
      {/* ============================================================ */}
      <section className="bg-surface">
        <div className="mx-auto flex flex-col items-center px-4 py-14 md:py-24 max-w-[1200px]">
          {/* Partner badges */}
          {heroPartnerBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-[22px]">
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
          <h1 className="text-display text-center mt-10 max-w-[924px]">
            <span className="text-body">{heroHeadingPart1}</span>
            <span className="text-brand">{heroHeadingAccent}</span>
          </h1>

          {/* Subheading */}
          <p className="text-body-lead text-muted text-center mt-8 max-w-[859px] whitespace-pre-line">
            {heroSubheading}
          </p>

          {/* Certification badge */}
          {heroCertBadgeSrc && (
            <div className="mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCertBadgeSrc}
                alt="Certifications"
                width={534}
                height={133}
                className="w-full max-w-[534px] h-auto object-contain"
              />
            </div>
          )}

          {/* Monday Partners image */}
          {heroMondayPartnersImageSrc && (
            <div className="mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroMondayPartnersImageSrc}
                alt="Monday.com Partners"
                width={924}
                height={0}
                className="w-full max-w-[924px] h-auto object-contain"
              />
            </div>
          )}

          {/* CTA(s) — secondary is optional */}
          {(primaryCtaUrl || showSecondaryCta) && (
            <div className="flex items-center justify-center flex-wrap gap-5 mt-10">
              {primaryCtaUrl && (
                <Link href={primaryCtaUrl} className="cta-btn cta-btn-primary">
                  <CtaLabel label={primaryCtaLabel} />
                </Link>
              )}
              {showSecondaryCta && secondaryCtaUrl && (
                <Link href={secondaryCtaUrl} className="cta-btn cta-btn-outline">
                  <CtaLabel label={secondaryCtaLabel} />
                </Link>
              )}
            </div>
          )}

          {/* Hero image */}
          {heroImageSrc && (
            <div className="mt-10 w-full max-w-[1042px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt="monday.com training dashboards"
                width={1042}
                height={312}
                className="rounded-card object-contain bg-surface-raised w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 -- Logo Cloud with Marquee Scroll                  */}
      {/* ============================================================ */}
      <section className="bg-surface py-14 md:py-24 px-4">
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
      {/* SECTION 2b -- Video Embed                                    */}
      {/* ============================================================ */}
      {videoEmbedUrl && (
        <section className="bg-surface pb-14 md:pb-24">
          <div className="mx-auto max-w-[1042px] px-4">
            <div className="rounded-card overflow-hidden aspect-video">
              <YouTubeEmbed url={videoEmbedUrl} title={videoTitle} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 3 -- Training Intro + Tabbed Content                 */}
      {/* ============================================================ */}
      <section className="relative overflow-visible bg-brand-soft">
        {/* Decorative purple circle bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] max-w-none bg-[url(/images/purple-circle-background.avif)] bg-contain bg-no-repeat bg-center"
        />
        <div className="relative mx-auto flex flex-col items-center px-4 py-14 md:py-24">
          {/* Intro heading (above tabs) */}
          <p className="text-section-h2 text-center max-w-[924px]">
            <span className="text-body">{trainingIntroHeading}</span>
          </p>

          <p className="text-body text-center mt-5 max-w-[924px]">
            {trainingIntroSubheading}
          </p>

          {/* Training Tabs */}
          {trainingTabs.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              {trainingTabs.map((tab, idx) => {
                const isActive = idx === activeTrainingTab
                return (
                  <button
                    key={tab._key || idx}
                    onClick={() => setActiveTrainingTab(idx)}
                    className={`flex items-center justify-center font-bold h-[39px] px-7 rounded-pill text-base cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[0px_2px_8px_rgba(128,21,232,0.35)]"
                        : "bg-surface-raised border border-ui text-body"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Tab content card */}
          {currentTrainingItems.length > 0 && (
            <div className="w-full max-w-[816px] bg-surface-raised border border-ui rounded-card p-5 md:p-7 mt-7">
              {currentTrainingItems.map((item, i) => (
                <div key={`${item.number}-${i}`} className="flex items-start gap-4 md:gap-5 mb-7">
                  {/* Number */}
                  <p className="font-extralight shrink-0 text-4xl md:text-[48px] text-brand leading-normal w-10 md:w-[60px] text-center">
                    {item.number}
                  </p>
                  {/* Content */}
                  <div className="flex-1">
                    <p className="font-bold text-base text-surface-dark-2 leading-[22.4px]">
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="mt-2 text-sm text-surface-dark-2 leading-[22.4px] whitespace-pre-line">
                        {item.description}
                      </p>
                    ) : (
                      <ul className="list-disc pl-[18px] mt-2 text-sm text-surface-dark-2 leading-[22.4px]">
                        {(item.bullets ?? []).map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Interactive training recommender */}
      <TrainingRecommender
        eyebrow="Find your track"
        heading="Which training format fits your team?"
        subheading="Set your team size and workflow complexity for an instant recommendation."
        ctaLabel="Book a FREE Training Consultation"
        ctaUrl={bookingHref(calendlyUrl)}
      />

      {/* CRO action items */}
      <CroSections data={data?.croSections} primaryCtaLabel={data?.heroPrimaryCtaLabel} primaryCtaUrl={bookingHref(calendlyUrl)} />

      {/* ============================================================ */}
      {/* SECTION 4 -- Testimonials (shared carousel component)        */}
      {/* ============================================================ */}
      <TestimonialsGrid
        heading={testimonialsHeading}
        ctaLabel={testimonialsCtaLabel}
        ctaUrl={testimonialsCtaUrl}
        statCardValue={statCardValue}
        statCardSubtitle={statCardSubtitle}
        statCardCtaLabel={statCardCtaLabel}
        statCardCtaUrl={statCardCtaUrl}
        caseStudies={caseStudies}
      />

      {/* ============================================================ */}
      {/* SECTION 5 -- Empower (image left, text right)                */}
      {/* Reuses homepage LeftRightSection layout shell.               */}
      {/* ============================================================ */}
      <LeftRightSection
        imageOnLeft
        image={
          empowerImageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={empowerImageSrc}
              alt="monday.com users training"
              width={490}
              className="w-full h-auto"
            />
          ) : null
        }
      >
        {empowerEyebrow && (
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {empowerEyebrow}
          </p>
        )}
        <h2 className="text-section-h3 text-brand">
          {empowerHeading}
        </h2>
        <div className="text-body whitespace-pre-line">
          {empowerBody}
        </div>
        {data?.empowerCtaLabel && data?.empowerCtaUrl && (
          <Link
            href={data.empowerCtaUrl}
            className="group flex items-center justify-center gap-2 h-[53px] w-full max-w-[326px] rounded-pill bg-gradient-to-r from-brand to-brand-light hover:bg-brand-dark hover:bg-none text-white text-base font-bold tracking-[0.32px] transition-colors"
          >
            <PaperPlaneIcon />
            <CtaLabel label={data.empowerCtaLabel} />
          </Link>
        )}
      </LeftRightSection>

      {/* ============================================================ */}
      {/* SECTION 5b -- First training service (text left, image right) */}
      {/* ============================================================ */}
      {trainingServices.length > 0 && (() => {
        const service = trainingServices[0]
        const serviceImageSrc = imageUrl(service.image)
        return (
          <LeftRightSection
            image={
              serviceImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={serviceImageSrc}
                  alt={service.title ?? ""}
                  width={490}
                  className="w-full h-auto"
                />
              ) : null
            }
          >
            {service.title && (
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand flex items-center gap-2">
                {service.emoji && <span>{service.emoji}</span>}
                {service.title}
              </p>
            )}
            {service.subtitle && (
              <h2 className="text-section-h3 text-body whitespace-pre-line">
                {service.subtitle}
              </h2>
            )}
            <p className="text-body whitespace-pre-line">
              {service.description}
            </p>
            {service.ctaLabel && service.ctaUrl && (
              <Link
                href={service.ctaUrl}
                className="inline-flex items-center font-semibold text-base text-brand"
              >
                <CtaLabel label={service.ctaLabel} />
              </Link>
            )}
          </LeftRightSection>
        )
      })()}

      {/* ============================================================ */}
      {/* SECTION 9 -- Calendly Booking                                */}
      {/* ============================================================ */}
      <BookingSection
        eyebrow="monday.com training"
        heading="Book a FREE Training Consultation"
        sub="Tell us about your team and the workflows you want to master, we’ll tailor the session live on the call."
      />

      {/* ============================================================ */}
      {/* SECTION 10 -- FAQ                                            */}
      {/* ============================================================ */}
      <FaqAccordion heading={faqHeading} tabs={faqTabs as SharedFaqTab[]} />

      {/* ============================================================ */}
      {/* SECTION 11 -- Discover CTA                                   */}
      {/* ============================================================ */}
      <section className="bg-brand-soft py-14 md:py-24">
        <div className="mx-auto flex flex-col items-center px-4">
          {discoverBadgeSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={discoverBadgeSrc}
              alt="Certifications"
              width={325}
              height={73}
              className="w-full max-w-[325px] h-auto object-contain"
            />
          )}
          <h2 className="text-section-h2 text-center text-body mt-7 w-full max-w-[694px]">
            {discoverHeading}
          </h2>
          {(discoverPrimaryCtaUrl || discoverSecondaryCtaUrl) && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-8 w-full max-w-[694px]">
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
      {/* SECTION 6 -- Remaining Training Services (left-right)         */}
      {/* (Bird's-Eye View, IT Support, Handover Documentation)         */}
      {/* ============================================================ */}
      {trainingServices.length > 1 && (
        <section className="bg-surface py-14 md:py-24">
          <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-[1200px]">
            <div className="flex flex-col gap-14 md:gap-20">
              {trainingServices.slice(1).map((service, i) => {
                const serviceImageSrc = imageUrl(service.image)
                const isEven = i % 2 === 0
                return (
                  <div
                    key={service._key || `${service.title}-${i + 1}`}
                    className={`flex flex-col items-center gap-[60px] md:items-center md:justify-center ${isEven ? "md:flex-row-reverse" : "md:flex-row"}`}
                  >
                    <div className="w-full max-w-[490px] flex flex-col gap-[23px] items-start">
                      <span className="inline-flex items-center gap-2 px-4 h-8 rounded-pill bg-brand-soft text-brand text-sm font-semibold">
                        {service.emoji && <span className="text-base">{service.emoji}</span>}
                        {service.title}
                      </span>
                      {service.subtitle && (
                        <h2 className="text-section-h3 text-body whitespace-pre-line">
                          {service.subtitle}
                        </h2>
                      )}
                      <p className="text-body whitespace-pre-line">
                        {service.description}
                      </p>
                      {service.ctaLabel && service.ctaUrl && (
                        <Link
                          href={service.ctaUrl}
                          className="inline-flex items-center font-semibold text-base text-brand"
                        >
                          <CtaLabel label={service.ctaLabel} />
                        </Link>
                      )}
                    </div>
                    {serviceImageSrc && (
                      <div className="w-full max-w-[490px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={serviceImageSrc}
                          alt={service.title ?? ""}
                          width={540}
                          height={380}
                          className="rounded-card object-cover w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SECTION 11c -- Join 500+ Stats (shared StatsBlockView)       */}
      {/* ============================================================ */}
      <StatsBlockView
        heading={`${joinSectionHeadingPart1 ?? ""}${joinSectionHeadingAccent ?? ""}${joinSectionHeadingPart2 ?? ""}`}
        subheading={joinSectionSubheading}
        stats={joinSectionStats.map((s) => ({ _key: s._key, value: s.value, label: s.label }))}
        footnote={joinSectionFootnote}
        siteSettings={siteSettings || undefined}
        showMondayPartnersBadge={false}
      />

      {/* Security badge removed */}
    </div>
  )
}

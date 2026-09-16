"use client"

import { bookingHref } from "@/lib/bookingLink"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Link2,
  Zap,
  Lock,
  TrendingUp,
  Bot,
  Hand,
  Target,
  Rocket,
  RefreshCw,
  BarChart3,
  Construction,
  Ruler,
  Hammer,
  Wrench,
  Brain,
  Settings,
  Shield,
  Building2,
  Cloud,
  Briefcase,
  GraduationCap,
  Handshake,
  Lightbulb,
  LifeBuoy,
  Sparkles,
  ClipboardList,
  Palette,
  Plug,
} from "lucide-react"
import {
  ClientLogoSection,
  CalendlySection,
  JoinStatsSection,
  CroSections,
  StickyCtaConfig,
  WorkflowConnector,
  EcosystemGrid,
} from "@/components/sections"
import FramedMedia from "@/components/common/FramedMedia"
import type { CaseStudy, SiteSettingsData, ComparisonTab } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

/* ------------------------------------------------------------------ */
/*  Make Feature Tabs — hardcoded content                              */
/* ------------------------------------------------------------------ */

type MakeFeatureGroup = {
  number: string
  title?: string
  bullets: { icon?: LucideIcon; emoji?: string; text: string }[]
}

type MakeFeatureTab = {
  key: string
  label: string
  heading: string
  intro?: string
  groups: MakeFeatureGroup[]
  outro?: string
}

const MAKE_FEATURE_TABS: MakeFeatureTab[] = [
  {
    key: "features",
    label: "make.com Features",
    heading: "Transform Your Business with make Automations",
    groups: [
      {
        number: "01",
        title: "As a Gold Partner, we leverage make's features to transform your operations:",
        bullets: [
          { icon: Link2, text: "Unlimited Integration Possibilities: Connect seamlessly with 1000+ apps and services" },
          { icon: Zap, text: "Real-Time Execution: Experience immediate process automation that responds instantly to triggers" },
          { icon: Lock, text: "Enterprise-Grade Security: Trust in our SOC 2 Type II certified platform for maximum protection" },
          { icon: TrendingUp, text: "Scalable Architecture: Effortlessly handle millions of operations as your business grows" },
        ],
      },
      {
        number: "02",
        title: "Streamline operations and eliminate workflow friction:",
        bullets: [
          { icon: Bot, text: "Automate repetitive tasks that drain your team's productivity and consume valuable working hours" },
          { icon: Hand, text: "Reduce manual data entry errors while saving time and improving overall operational accuracy" },
          { icon: Target, text: "Enhance process accuracy with consistent, reliable automation that delivers predictable results every time" },
          { icon: Rocket, text: "Accelerate workflow execution across all departments to boost team performance and output" },
        ],
      },
      {
        number: "03",
        title: "Improve efficiency and maximise your operational potential:",
        bullets: [
          { icon: RefreshCw, text: "Connect disparate systems into one cohesive ecosystem that works harmoniously across platforms" },
          { icon: BarChart3, text: "Synchronise data in real-time across all platforms to ensure information consistency and accessibility" },
          { icon: Construction, text: "Eliminate process bottlenecks that slow down your business and create operational inefficiencies" },
          { icon: Ruler, text: "Scale operations seamlessly without adding complexity or requiring additional manual oversight" },
        ],
      },
      {
        number: "04",
        title: "Drive innovation and stay ahead of the competition:",
        bullets: [
          { icon: Hammer, text: "Create custom automation solutions tailored to your unique business needs and specific requirements" },
          { icon: Wrench, text: "Implement advanced integrations that unlock new possibilities and enhance your existing systems" },
          { icon: Brain, text: "Deploy intelligent workflows that adapt to your business requirements and evolving operational demands" },
          { icon: Settings, text: "Optimise business processes for maximum efficiency, growth, and long-term competitive advantage" },
        ],
      },
    ],
  },
  {
    key: "why-fruition",
    label: "Why Choose Fruition?",
    heading: "Why Partner with Fruition for make Automations?",
    groups: [
      {
        number: "01",
        title: "Our Gold Partner status demonstrates our expertise in:",
        bullets: [
          { icon: Wrench, text: "Advanced automation capabilities to handle complex business requirements" },
          { icon: Target, text: "Complex multi-step workflow design for sophisticated process automation" },
          { icon: RefreshCw, text: "Real-time data synchronisation across all your connected systems" },
          { icon: Shield, text: "Error handling and monitoring systems for reliable operation" },
          { icon: Link2, text: "Custom API integration development tailored to your needs" },
        ],
      },
      {
        number: "02",
        title: "Enterprise integration solutions that connect your entire business ecosystem:",
        bullets: [
          { icon: BarChart3, text: "Cross-platform data management for seamless information flow" },
          { icon: Building2, text: "Legacy system connectivity to modernise existing infrastructure" },
          { icon: Cloud, text: "Cloud service orchestration for optimal performance" },
          { icon: Lock, text: "Secure data transfer protocols ensuring complete protection" },
          { icon: Settings, text: "Scalable architecture design that grows with your business" },
        ],
      },
      {
        number: "03",
        title: "Professional services that guide you from concept to completion:",
        bullets: [
          { icon: Briefcase, text: "Expert implementation guidance throughout your automation journey" },
          { icon: Hammer, text: "Custom scenario development aligned with your business goals" },
          { icon: GraduationCap, text: "Team training and enablement for long-term success" },
          { icon: Handshake, text: "Ongoing support and optimisation for continuous improvement" },
          { icon: TrendingUp, text: "Strategic consulting to maximize your automation ROI" },
        ],
      },
      {
        number: "04",
        title: "Drive Innovation and transform your operational capabilities:",
        bullets: [
          { icon: Lightbulb, text: "Create custom automation solutions that solve unique challenges" },
          { icon: Wrench, text: "Implement advanced integrations for enhanced functionality" },
          { icon: Brain, text: "Deploy intelligent workflows that adapt to changing needs" },
          { icon: Settings, text: "Optimise business processes for maximum efficiency" },
          { icon: Rocket, text: "Future-proof your operations with cutting-edge technology" },
        ],
      },
      {
        number: "05",
        title: "Partner-Led Implementation Advantages that ensure your success:",
        bullets: [
          { icon: Target, text: "Expert scenario development from certified make specialists" },
          { icon: ClipboardList, text: "Best practices implementation based on proven methodologies" },
          { icon: Zap, text: "Performance optimisation for maximum speed and reliability" },
          { icon: LifeBuoy, text: "Comprehensive support throughout implementation and beyond" },
          { icon: Sparkles, text: "Future-proof solutions designed to evolve with your business" },
        ],
      },
    ],
  },
  {
    key: "how-we-help",
    label: "How We Can Help",
    heading: "Transform your business operations with Fruition's make Gold Partner expertise.",
    groups: [
      {
        number: "01",
        title: "Our certified team will guide you through:",
        bullets: [
          { icon: ClipboardList, text: "Automation strategy development" },
          { icon: Palette, text: "Workflow design and implementation" },
          { icon: Link2, text: "System integration and testing" },
          { icon: Wrench, text: "Ongoing optimisation and support" },
        ],
      },
      {
        number: "02",
        title: "As your dedicated make Gold Partner, we specialise in:",
        bullets: [
          { icon: Settings, text: "Advanced Workflow Design" },
          { icon: Plug, text: "System Integration Development" },
          { icon: Hammer, text: "Custom Automation Solutions" },
          { icon: TrendingUp, text: "Enterprise Scaling Support" },
        ],
      },
    ],
    outro:
      "Contact Fruition's Make automation experts to begin your digital transformation journey. As a certified Gold Partner, we deliver enterprise-grade automation solutions that drive efficiency and growth. Transform your business operations and bring your workflows to Fruition.",
  },
]

function MakeFeatureTabsSection({ tabs }: { tabs: MakeFeatureTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-section-h2 text-body text-center mb-8">
          {active.heading}
        </h2>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveIdx(i)}
              className={`min-h-[44px] max-w-full cursor-pointer rounded-pill px-4 py-2.5 text-[13px] font-semibold transition-all md:px-[26px] md:text-sm md:whitespace-nowrap ${
                i === activeIdx
                  ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[0_10px_22px_-12px_rgba(128,21,232,0.55)]"
                  : "bg-surface-raised text-body ring-1 ring-ui"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {active.groups.map((g: MakeFeatureGroup) => (
            <div
              key={g.number}
              className="dark:shadow-none rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 flex flex-col gap-3.5"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-chip bg-gradient-to-br from-brand to-brand-light font-mono text-xs font-semibold text-white">
                  {g.number}
                </span>
                {g.title && (
                  <p className="text-body-sm font-bold text-body">
                    {g.title}
                  </p>
                )}
              </div>
              <ul className="flex flex-col gap-2.5">
                {g.bullets.map((b: { icon?: LucideIcon; emoji?: string; text: string }, bi: number) => {
                  // Hardcoded fallback bullets carry a LucideIcon component;
                  // Sanity-driven bullets carry an `emoji` string (no icon).
                  // Default to Sparkles so a missing icon never renders `undefined`.
                  const Icon = typeof b.icon === "function" ? b.icon : null
                  return (
                    <li key={b.text || bi} className="flex items-start gap-2.5">
                      {Icon ? (
                        <Icon size={18} aria-hidden className="shrink-0 mt-px text-brand" />
                      ) : b.emoji ? (
                        <span aria-hidden className="shrink-0 mt-px text-base leading-5">{b.emoji}</span>
                      ) : (
                        <Sparkles size={18} aria-hidden className="shrink-0 mt-px text-brand" />
                      )}
                      <span className="text-sm text-muted leading-relaxed">{b.text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {active.outro && (
          <p className="text-center mx-auto text-sm text-muted leading-relaxed max-w-[880px] mt-9">
            {active.outro}
          </p>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageRef = any

interface ShowcaseCard {
  heading?: string
  body?: string
  imageRight?: boolean
  mediaType?: "image" | "video"
  image?: SanityImageRef
  videoUrl?: string
}

interface FeatureListItem {
  _key?: string
  emoji?: string
  text?: string
}

interface MakePartnersPageData {
  seoTitle?: string
  seoDescription?: string
  croSections?: import("@/components/sections/CroSections").CroSectionsData | null
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroSubheading?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string
  heroImage?: SanityImageRef
  announcementHeading?: string
  announcementBody?: string
  announcementImage?: SanityImageRef
  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string
  comparisonHeading?: string
  comparisonTabs?: ComparisonTab[]
  featureListsHeading?: string
  featureListsSubheading?: string
  featureListsRightEyebrow?: string
  featureListsFooter?: string
  featureListLeft?: FeatureListItem[]
  featureListRight?: FeatureListItem[]
  showcaseHeading?: string
  showcaseSubheading?: string
  showcaseCards?: ShowcaseCard[]
  calendlyHeading?: string
  calendlySubheading?: string
  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinStats?: Array<{ _key?: string; value?: string; label?: string }>
  joinCtaLabel?: string
  joinCtaUrl?: string
  testimonialBannerHeadingPart1?: string
  testimonialBannerHeadingAccent?: string
  testimonialBannerHeadingPart2?: string
  testimonialBannerPrimaryCtaLabel?: string
  testimonialBannerPrimaryCtaUrl?: string
  testimonialBannerSecondaryCtaLabel?: string
  testimonialBannerSecondaryCtaUrl?: string
  discoverHeading?: string
  makeFeatureTabs?: MakeFeatureTab[]
  // Sanity stores this as an array of `{ key, mediaType, mediaSrc }` objects
  // (Sanity attribute names can't contain spaces, and the keys are
  // showcase headings). The FE normalises this back to a Record before
  // merging with the hardcoded fallback. A plain Record is also accepted.
  showcaseOverrides?:
    | Record<string, { mediaType: "video" | "image"; mediaSrc: string }>
    | Array<{ _key?: string; key?: string; mediaType?: "video" | "image"; mediaSrc?: string }>
}

interface Props {
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  pageData?: MakePartnersPageData | null
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function safeSrc(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).width(800).auto("format").url() } catch { return null }
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function MakePartnersContent({
  siteSettings,
  caseStudies = [],
  pageData,
}: Props) {
  const rawCalendly = siteSettings?.calendlyLink || ""
  const calendlyUrl = bookingHref(rawCalendly)
  const partnerBadges = siteSettings?.navbarPartnerBadges || []

  void caseStudies

  const heroImageSrc = safeSrc(pageData?.heroImage)
  const announcementImageSrc = safeSrc(pageData?.announcementImage)

  type ResolvedCard = {
    heading: string
    body: string
    imageRight: boolean
    mediaType: "video" | "image"
    mediaSrc: string
  }

  const SHOWCASE_OVERRIDES: Record<string, { mediaType: "video" | "image"; mediaSrc: string }> = {
    "solve finance complexities": { mediaType: "image", mediaSrc: "/images/make-finance.avif" },
    "automation you can see, flex, and scale": { mediaType: "video", mediaSrc: "/videos/make-automation.mp4" },
  }

  // Normalise Sanity's array shape (or Record shape) into a Record keyed by
  // the lowercased heading, then merge with the hardcoded fallback so
  // Sanity-supplied keys win and untouched keys fall back.
  const sanityOverrides = pageData?.showcaseOverrides
  const sanityOverridesAsRecord: Record<string, { mediaType: "video" | "image"; mediaSrc: string }> =
    Array.isArray(sanityOverrides)
      ? sanityOverrides.reduce<Record<string, { mediaType: "video" | "image"; mediaSrc: string }>>(
          (acc, item) => {
            if (item?.key && item.mediaSrc) {
              acc[item.key.toLowerCase().trim()] = {
                mediaType: item.mediaType ?? "image",
                mediaSrc: item.mediaSrc,
              }
            }
            return acc
          },
          {}
        )
      : (sanityOverrides ?? {})
  const mergedShowcaseOverrides: Record<string, { mediaType: "video" | "image"; mediaSrc: string }> = {
    ...SHOWCASE_OVERRIDES,
    ...sanityOverridesAsRecord,
  }

  const resolvedShowcaseCards: ResolvedCard[] = (pageData?.showcaseCards ?? [])
    .map((card): ResolvedCard | null => {
      const heading = card.heading ?? ""
      const body = card.body ?? ""
      const imageRight = card.imageRight ?? true
      const override = mergedShowcaseOverrides[heading.toLowerCase().trim()]
      const mediaType = override?.mediaType ?? card.mediaType ?? "image"
      let mediaSrc = ""
      if (override) {
        mediaSrc = override.mediaSrc
      } else if (mediaType === "video") {
        mediaSrc = card.videoUrl ?? ""
      } else {
        mediaSrc = safeSrc(card.image) ?? ""
      }
      if (!mediaSrc) return null
      return { heading, body, imageRight, mediaType, mediaSrc }
    })
    .filter((c): c is ResolvedCard => c !== null)

  return (
    <div>
      <StickyCtaConfig label={pageData?.croSections?.stickyCtaLabel} mobileLabel={pageData?.croSections?.stickyCtaMobileLabel} href={bookingHref(pageData?.croSections?.stickyCtaUrl || rawCalendly)} />
      {/* 1. Hero */}
      <section className="bg-surface">
        <div className="mx-auto flex flex-col items-center px-6 md:px-16 lg:px-[273px] py-14 md:py-20">
          {partnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center gap-5">
              {partnerBadges.map((badge, i) => {
                const src = safeSrc(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    key={(badge as any)._key || `badge-${i}`}
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

          {(pageData?.heroHeadingPart1 || pageData?.heroHeadingAccent) && (
            <h1 className="text-display text-center mt-10 max-w-[924px]">
              {pageData?.heroHeadingPart1 && <span className="text-body">{pageData.heroHeadingPart1}</span>}
              {pageData?.heroHeadingAccent && <span className="text-brand">{pageData.heroHeadingAccent}</span>}
            </h1>
          )}

          {pageData?.heroSubheading && (
            <p className="text-body-lead text-muted text-center mt-8 max-w-[859px] whitespace-pre-line">
              {pageData.heroSubheading}
            </p>
          )}

          {(pageData?.heroPrimaryCtaLabel || pageData?.heroSecondaryCtaLabel) && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-5 mt-10 w-full">
              {pageData?.heroPrimaryCtaLabel && (pageData.heroPrimaryCtaUrl || calendlyUrl) && (
                <CtaButton
                  href={bookingHref(pageData.heroPrimaryCtaUrl || rawCalendly)}
                  label={pageData.heroPrimaryCtaLabel}
                  variant="outline"
                  className="w-full max-w-[330px]"
                />
              )}
              {pageData?.heroSecondaryCtaLabel && (pageData.heroSecondaryCtaUrl || calendlyUrl) && (
                <CtaButton
                  href={bookingHref(pageData.heroSecondaryCtaUrl || rawCalendly)}
                  label={pageData.heroSecondaryCtaLabel}
                  variant="primary"
                  className="w-full max-w-[330px]"
                />
              )}
            </div>
          )}

          {heroImageSrc && (
            <FramedMedia className="mt-10 w-full max-w-[1042px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt={pageData?.heroHeadingAccent || "Hero"}
                className="w-full h-auto"
              />
            </FramedMedia>
          )}
        </div>
      </section>

      {/* 2. Partnership Announcement */}
      {(pageData?.announcementHeading || pageData?.announcementBody || announcementImageSrc) && (
        <section className="bg-surface-subtle py-14 md:py-24 px-4">
          <div className="mx-auto flex flex-col md:flex-row items-center justify-center gap-12 max-w-[1100px]">
            <div className="flex-1 max-w-[650px]">
              {pageData?.announcementHeading && (
                <h2 className="text-section-h2 text-body mb-5">
                  {pageData.announcementHeading}
                </h2>
              )}
              {pageData?.announcementBody && (
                <p className="text-body-lead text-muted">
                  {pageData.announcementBody}
                </p>
              )}
            </div>
            {announcementImageSrc && (
              <FramedMedia className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={announcementImageSrc}
                  alt={pageData?.announcementHeading || "Partnership"}
                  width={233}
                  height={233}
                  className="rounded-[16px]"
                />
              </FramedMedia>
            )}
          </div>
        </section>
      )}

      {/* 3. Logo Cloud */}
      {(pageData?.logoCloudHeadingPart1 || pageData?.logoCloudHeadingAccent) && (
        <ClientLogoSection
          headingPart1={pageData?.logoCloudHeadingPart1}
          headingAccent={pageData?.logoCloudHeadingAccent}
          logos={siteSettings?.carouselLogos || []}
        />
      )}

      {/* 4. Make Feature Tabs — Sanity-driven with hardcoded fallback */}
      <MakeFeatureTabsSection
        tabs={(pageData?.makeFeatureTabs && pageData.makeFeatureTabs.length > 0) ? pageData.makeFeatureTabs : MAKE_FEATURE_TABS}
      />


      {/* Make scenario — the branching pipeline we build */}
      <WorkflowConnector
        eyebrow="A Make scenario, visualized"
        heading="What a custom Make.com build actually looks like"
        subheading="One inbound trigger, routed and reshaped, lands in monday.com without a single manual copy-paste."
        theme="dark"
        steps={[
          { glyph: "📥", label: "Inbound CRM lead", sublabel: "New signed contract" },
          { glyph: "🔀", label: "Router", sublabel: "Branch by deal type" },
          { glyph: "🧩", label: "Format & enrich", sublabel: "Parse, map, validate" },
          { glyph: "📊", label: "monday.com board", sublabel: "Created & team alerted", tone: "hub" },
        ]}
        footnote="Make.com bundles actions into scenarios, billing full runs instead of every step."
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Ecosystem connector grid — apps orbiting monday.com */}
      <EcosystemGrid
        eyebrow="One connected ecosystem"
        heading="Every tool you run, synced into monday.com"
        subheading="We wire your finance, sales, comms and storage apps into a single Work OS through Make."
        countLabel="2,000+ apps connectable via Make"
        apps={[
          { glyph: "📒", label: "Xero" },
          { glyph: "💰", label: "QuickBooks" },
          { glyph: "🟠", label: "HubSpot" },
          { glyph: "☁️", label: "Salesforce" },
          { glyph: "📧", label: "Gmail" },
          { glyph: "💬", label: "Slack" },
          { glyph: "🗄️", label: "Google Drive" },
          { glyph: "🏢", label: "ERP systems" },
        ]}
      />

      {/* CRO action items */}
      <CroSections
        data={pageData?.croSections}
        primaryCtaLabel={pageData?.heroPrimaryCtaLabel}
        primaryCtaUrl={bookingHref(pageData?.heroPrimaryCtaUrl || rawCalendly)}
      />

      {/* 6. Calendly */}
      {(pageData?.calendlyHeading || pageData?.calendlySubheading) && (
        <CalendlySection
          heading={pageData?.calendlyHeading}
          subheading={pageData?.calendlySubheading}
          calendlyUrl={rawCalendly}
        />
      )}

      {/* 7. Showcase */}
      {resolvedShowcaseCards.length > 0 && (
        <section className="bg-surface py-14 md:py-24">
          <div className="mx-auto px-4 max-w-[1200px]">
            <div className="flex flex-col items-center text-center mb-10 md:mb-14">
              {pageData?.showcaseHeading && (
                <h2 className="text-section-h2 text-body max-w-[900px]">
                  {pageData.showcaseHeading}
                </h2>
              )}
              {pageData?.showcaseSubheading && (
                <p className="text-body-lead text-muted mt-3 max-w-[760px]">
                  {pageData.showcaseSubheading}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-10 md:gap-14">
              {resolvedShowcaseCards.map((card, i) => (
                <div
                  key={`showcase-${i}`}
                  className={`flex flex-col items-center gap-10 ${card.imageRight ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1">
                    <h3 className="text-section-h3 text-body">
                      {card.heading}
                    </h3>
                    <p className="text-body mt-5">
                      {card.body}
                    </p>
                  </div>
                  <FramedMedia className="rounded-card overflow-hidden w-full flex-1 aspect-[16/10]">
                    {card.mediaType === "video" ? (
                      <video
                        src={card.mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.mediaSrc}
                        alt={card.heading}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </FramedMedia>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Join Stats */}
      <JoinStatsSection
        headingPart1={pageData?.joinHeadingPart1}
        headingAccent={pageData?.joinHeadingAccent}
        headingPart2={pageData?.joinHeadingPart2}
        stats={pageData?.joinStats}
        ctaLabel={pageData?.joinCtaLabel}
        ctaUrl={bookingHref(pageData?.joinCtaUrl || rawCalendly)}
        siteSettings={siteSettings || undefined}
      />

    </div>
  )
}

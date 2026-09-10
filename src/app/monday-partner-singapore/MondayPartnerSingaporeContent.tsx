"use client"

import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import { Rocket, Play } from "lucide-react"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
} from "@/components/sections"
import TeamGridSection, { type TeamMember } from "@/components/TeamGridSection"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  ComparisonTab,
} from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
  teamMembers: TeamMember[]
}


type FeatureBlock = { title?: string; body?: string; ctaLabel?: string; ctaUrl?: string; image?: string }
type RoiStat = { value?: string; label?: string }

function FeatureBlocksSection({ blocks }: { blocks: FeatureBlock[] }) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-col gap-10 md:gap-14">
          {blocks.map((b, i) => (
            <div
              key={b.title}
              className={`flex flex-col items-center gap-8 md:gap-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="w-full min-w-0 md:flex-1">
                <h3 className="text-section-h3 mb-3">{b.title}</h3>
                <p className="text-body-sm whitespace-pre-line">{b.body}</p>
                <Link
                  href={b.ctaUrl || "#"}
                  className="inline-flex items-center font-semibold mt-4 text-sm text-brand"
                >
                  {b.ctaLabel} →
                </Link>
              </div>
              <div className="w-full min-w-0 md:flex-1 aspect-[16/10] rounded-card overflow-hidden bg-surface-raised ring-1 ring-ui shadow-whisper dark:shadow-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerSectionCta({ calendlyUrl, mondayUrl }: { calendlyUrl: string; mondayUrl: string }) {
  return (
    <section className="bg-surface px-4 pt-6 pb-14 md:pb-24">
      <div className="mx-auto text-center w-full max-w-[920px]">
        <h2 className="text-section-h2 mb-6">
          Work with a certified <span className="text-brand">monday.com partner</span> today
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={calendlyUrl} className="cta-btn cta-btn-primary">
            <Rocket size={16} aria-hidden /> Schedule a 30-minute Consultation
          </Link>
          <Link href={mondayUrl} className="cta-btn cta-btn-outline">
            <Play size={16} aria-hidden /> Get Started with monday.com
          </Link>
        </div>
      </div>
    </section>
  )
}

function CrmTutorialCta({ calendlyUrl, mondayUrl }: { calendlyUrl: string; mondayUrl: string }) {
  return (
    <section className="px-4 py-10 md:py-16 bg-gradient-to-b from-brand-soft/30 to-brand-soft">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="text-center">
          <h2 className="text-section-h2 mb-4">
            Everything You Need to Know to Get Started with <span className="text-brand">monday CRM</span>
          </h2>
          <p className="text-body-sm text-muted w-full max-w-[720px] mx-auto">
            Our tutorial walks you through the entire process, from managing leads and pipeline tracking, to sending emails, automations, dashboards, and integrations.
          </p>
          <div className="flex justify-center mt-6">
            <Link href={calendlyUrl} className="cta-btn cta-btn-primary">
              <Rocket size={16} aria-hidden /> Book a Time
            </Link>
          </div>
        </div>
        <div className="mx-auto rounded-card overflow-hidden mt-8 aspect-video w-full max-w-[980px]">
          <YouTubeEmbed videoId="eoOCR6OjJhI" title="Everything you need to know to get started with monday CRM" />
        </div>
      </div>
    </section>
  )
}

function EconomicImpactSection({ stats }: { stats: RoiStat[] }) {
  return (
    <section className="px-4 py-14 md:py-24 bg-gradient-to-b from-surface-dark-2 to-surface-dark">
      <div className="mx-auto text-center w-full max-w-[1100px]">
        <h2 className="text-section-h2 text-white w-full max-w-[820px] mx-auto mb-3">
          As <span className="text-brand-light">monday partners</span>, we help you discover how efficient your team could be
        </h2>
        <p className="text-body-sm text-white/70 mb-9">The economic impact of</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div key={s.label || i}>
              <p className="text-3xl md:text-4xl font-bold leading-none text-white">{s.value}</p>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/80 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MondayPartnerSingaporeContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
  teamMembers,
}: Props) {
  if (!page) return null
  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const calendlyUrl = bookingHref(rawCalendly)
  // The region's monday.com referral link, so partner UTM attribution stays
  // editable in Sanity rather than hardcoded per page.
  const mondayUrl = page.secondaryCtaUrl || "https://monday.com"

  const resolvedFaqTabs = faqTabs ?? []
  const partnerCaseStudies = caseStudies
  const resolvedComparisonTabs: ComparisonTab[] = page.comparisonTabs ?? []
  const resolvedFeatureBlocks: FeatureBlock[] = page.featureBlocks ?? []
  const resolvedRoiStats: RoiStat[] = page.roiStats ?? []

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading}
        headingAccent=""
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || rawCalendly)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl}
      />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Customer testimonials — social proof sits directly below the fold */}
      <TestimonialsGrid
        heading={page.testimonialsGridHeading}
        ctaLabel={page.testimonialsGridCtaLabel}
        ctaUrl={calendlyUrl}
        statCardValue={page.testimonialsGridStatValue}
        statCardSubtitle={page.testimonialsGridStatSubtitle}
        statCardCtaLabel={page.testimonialsGridStatCtaLabel}
        statCardCtaUrl={page.testimonialsGridStatCtaUrl}
        caseStudies={partnerCaseStudies}
      />

      {/* Calendly — booking CTA follows immediately on the proof that earns it */}
      <CalendlySection
        bookingRegion="SEA"
        heading={page.calendlyHeading || "Schedule a 30 minute Call With One of Our monday.com Consultants Today"}
        subheading={
          page.calendlySubheading ||
          "From initial process discovery to full system adoption, our proven methodology ensures seamless digital transformation that empowers your team and drives sustainable operational efficiency."
        }
        calendlyUrl={rawCalendly}
      />

      {/* 3-tab comparison */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={resolvedComparisonTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Meet the team — SG region */}
      <TeamGridSection
        heading={page.teamGridHeading}
        subheading={page.teamGridSubheading}
        ctaLabel={page.teamGridCtaLabel}
        ctaUrl={page.teamGridCtaUrl}
        members={teamMembers}
        region="APAC"
      />

      {/* FAQ */}
      <FaqAccordion heading={page.faqHeading} tabs={resolvedFaqTabs} />

      {/* Feature blocks */}
      <FeatureBlocksSection blocks={resolvedFeatureBlocks} />

      {/* Work with partner CTA */}
      <PartnerSectionCta calendlyUrl={calendlyUrl} mondayUrl={mondayUrl} />

      {/* CRM tutorial + video */}
      <CrmTutorialCta calendlyUrl={calendlyUrl} mondayUrl={mondayUrl} />

      {/* Economic impact */}
      <EconomicImpactSection stats={resolvedRoiStats} />
    </div>
  )
}

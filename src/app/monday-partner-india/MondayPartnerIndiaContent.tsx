"use client"

import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import { Rocket, Play } from "lucide-react"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  TestimonialsGrid,
  FaqAccordion,
} from "@/components/sections"
import TeamGridSection, { type TeamMember } from "@/components/TeamGridSection"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import ClosingCtaSection, { type ClosingCtaCopy } from "@/components/sections/ClosingCtaSection"
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
  closingCta?: ClosingCtaCopy | null
}


function TeamsTransformedStrip() {
  return (
    <section className="bg-surface px-4 pt-6 pb-8">
      <div className="mx-auto text-center w-full max-w-[920px]">
        <p className="text-body font-bold mb-2">Teams Transformed with Proven Efficiency Gains.</p>
        <p className="text-sm text-muted leading-relaxed">
          Authorised <span className="font-bold text-brand">monday.com</span> consulting, implementation and integration partner consultant in <span className="font-bold text-brand">India</span>.
        </p>
      </div>
    </section>
  )
}

type FeatureBlock = { title?: string; body?: string; ctaLabel?: string; ctaUrl?: string; image?: string }

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
                <p className="text-body-sm text-muted whitespace-pre-line">{b.body}</p>
                <Link
                  href={b.ctaUrl || "#"}
                  className="inline-flex items-center font-semibold mt-4 text-sm text-brand"
                >
                  {b.ctaLabel} →
                </Link>
              </div>
              <div className="w-full min-w-0 md:flex-1 aspect-[16/10] rounded-card overflow-hidden bg-surface ring-1 ring-ui shadow-whisper">
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
          Work with a certified <span className="text-brand">monday.com partner consultant</span> today
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={calendlyUrl} className="cta-btn cta-btn-primary">
            <Rocket size={16} aria-hidden /> Schedule a Consultation
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

export default function MondayPartnerIndiaContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
  teamMembers,
  closingCta,
}: Props) {
  if (!page) return null
  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const calendlyUrl = bookingHref(rawCalendly)
  // The region's monday.com referral link, so partner UTM attribution stays
  // editable in Sanity rather than hardcoded per page.
  const mondayUrl = page.secondaryCtaUrl || "https://monday.com"

  const partnerCaseStudies = caseStudies
  const resolvedFaqTabs = faqTabs ?? []
  const resolvedComparisonTabs: ComparisonTab[] = page.comparisonTabs ?? []
  const resolvedFeatureBlocks: FeatureBlock[] = page.featureBlocks ?? []
  const indiaTeamNames: string[] = page.teamMemberNames ?? []
  const indiaTeamMembers = indiaTeamNames
    .map((name) => teamMembers.find((m) => m.name === name))
    .filter((m): m is TeamMember => !!m)

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

      {/* "Teams Transformed" small caption */}
      <TeamsTransformedStrip />

      {/* Customer testimonials — social proof sits directly below the fold */}
      <TestimonialsGrid
        heading="What our customers say about us"
        ctaLabel="Start Your Transformation"
        ctaUrl={calendlyUrl}
        statCardSubtitle="have maximised their workflows with our monday.com expert support"
        statCardCtaLabel="Read our case studies"
        statCardCtaUrl="/customer-testimonials"
        caseStudies={partnerCaseStudies}
      />

      {/* Calendly — booking CTA follows immediately on the proof that earns it */}
      <CalendlySection
        region="IND"
        heading={page.calendlyHeading || "Schedule A 30-Min Consultation With One of Our monday.com Implementation Consultants"}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* 3-tab comparison */}
      <ComparisonTabsSection
        heading={page.comparisonHeading || "Streamline Operations & Maximise Efficiency with Our monday.com Consultants"}
        subheading="Our expert consultants empower you to adopt workflow automation & AI systems"
        tabs={resolvedComparisonTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Meet the team — India members (filtered by name, no "IN" region tag in Sanity) */}
      <TeamGridSection
        heading="Meet the Fruition India team"
        subheading="Our monday.com consultants have expertise across various industries. As a certified monday.com partner, we guarantee the delivery of the right solution and training to optimise your team's efficiency."
        ctaLabel="Learn More About Us"
        ctaUrl="/fruition-team"
        members={indiaTeamMembers}
      />

      {/* FAQ */}
      <FaqAccordion heading={page.faqHeading || "Frequently asked questions"} tabs={resolvedFaqTabs} />

      {/* Feature blocks */}
      <FeatureBlocksSection blocks={resolvedFeatureBlocks} />

      {/* Work with partner CTA */}
      <PartnerSectionCta calendlyUrl={calendlyUrl} mondayUrl={mondayUrl} />

      {/* CRM tutorial + video */}
      <CrmTutorialCta calendlyUrl={calendlyUrl} mondayUrl={mondayUrl} />

      {/* Closing CTA — shared site-wide banner; Sanity copy wins, the previous
          hardcoded economic-impact banner copy is the verbatim fallback */}
      <ClosingCtaSection
        cta={closingCta}
        fallback={{
          heading: "Join 500+ businesses that have leveraged our monday.com expert consultants.",
          headingAccent: "500+ businesses",
          primaryLabel: "Book a Time",
          primaryUrl: calendlyUrl,
        }}
        stats={page.roiStats ?? []}
        statsCaption="The economic impact of"
      />
    </div>
  )
}

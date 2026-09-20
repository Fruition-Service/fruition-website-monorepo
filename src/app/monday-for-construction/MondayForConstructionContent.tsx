"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import { useState } from "react"
import {
  HeroBanner,
  ClientLogoSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
  CroSections,
  StickyCtaConfig,
  CapabilityBlocksSection,
  BenefitLedgerSection,
} from "@/components/sections"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
  ComparisonTab,
} from "@/components/sections/types"
import { resolveIndustryLogos } from "@/sanity/industryLogos"
import type { CarouselLogo } from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import { getIndustrySections } from "@/data/industrySections"

interface Props {
  /** This page's own logo wall; falls back to the global carousel. */
  industryLogos?: CarouselLogo[] | null
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

/* ----------------- Sections ----------------- */

function ConstructionIntroStrip() {
  return (
    <section className="bg-surface px-4 py-8">
      <div className="mx-auto text-center w-full max-w-[920px]">
        <p className="text-body">
          With monday.com <span className="font-bold text-brand">CRM</span> and{" "}
          <span className="font-bold text-brand">Work Management</span> as your Construction software, your teams will experience simplified and streamlined communication with mobile access and improved automated workflow efficiency.
        </p>
      </div>
    </section>
  )
}

type LifecycleStage = { n?: string; title?: string; body?: string }
type ConstructionTestimonial = { title?: string; quote?: string; name?: string; role?: string; image?: string }

function LifecycleSection({ stages }: { stages: LifecycleStage[] }) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 mb-10">
          Support Each Stage of Your Project Life Cycle with a <span className="text-brand">monday.com Expert</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {stages.map((s, i) => (
            <div key={s.n || i} className="flex flex-col gap-2.5 p-6 rounded-card ring-1 ring-ui bg-surface-raised shadow-whisper dark:shadow-none">
              <p className="text-4xl font-light leading-none text-brand">{s.n}</p>
              <p className="font-bold text-lg text-body">{s.title}</p>
              <p className="text-sm text-body leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ConstructionTestimonialsSection({ testimonials }: { testimonials: ConstructionTestimonial[] }) {
  return (
    <section className="px-4 py-14 md:py-24 bg-gradient-to-b from-brand-soft/30 to-brand-soft">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 mb-10">
          Construction <span className="text-brand">Testimonials</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <figure key={t.title || i} className="bg-surface-raised overflow-hidden flex flex-col rounded-card ring-1 ring-ui shadow-whisper">
              <div className="aspect-[16/10] overflow-hidden bg-brand-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3.5">{t.title}</p>
                <blockquote className="text-body-sm text-body">“{t.quote}”</blockquote>
                <figcaption className="mt-4">
                  <p className="font-bold text-sm text-body">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Custom split tabs: first 3 tabs use "Why Construction Leaders Choose" header; second tab swaps to "Key Construction Management Features" header. */
function ConstructionTabs({ tabs }: { tabs: ComparisonTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  const heading =
    activeIdx === 0
      ? "Why Construction Leaders Choose monday.com"
      : activeIdx === 1
        ? "Key Construction Management Features"
        : "Our expert consultants empower you to adopt workflow automation & AI systems"

  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab, i) => (
            <button
              key={tab._key}
              onClick={() => setActiveIdx(i)}
              className={`px-6 py-2.5 rounded-pill text-sm font-semibold cursor-pointer transition-colors ${
                i === activeIdx
                  ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[0_10px_22px_-12px_rgba(128,21,232,0.55)]"
                  : "bg-surface-raised text-body ring-1 ring-ui"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Heading swaps with active tab */}
        <h2 className="text-center text-section-h2 mb-8">
          {heading}
        </h2>
        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {active.items?.map((it) => (
            <div key={it._key} className="bg-surface-raised rounded-card ring-1 ring-ui shadow-whisper dark:shadow-none flex flex-col gap-3 p-6">
              <div className="flex items-center gap-3.5">
                <span className="flex items-center justify-center font-bold w-9 h-9 rounded-chip bg-gradient-to-br from-brand to-brand-light text-white text-[13px]">
                  {it.number}
                </span>
                <p className="font-bold text-[15px] leading-snug text-body">{it.title}</p>
              </div>
              <p className="text-[13px] leading-tight whitespace-pre-line text-body">{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function MondayForConstructionContent({
  industryLogos,
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null
  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const resolvedFaqTabs = faqTabs ?? []
  const resolvedComparisonTabs: ComparisonTab[] = page.comparisonTabs ?? []
  const resolvedLifecycleStages: LifecycleStage[] = page.lifecycleStages ?? []
  const resolvedConstructionTestimonials: ConstructionTestimonial[] = page.industryTestimonials ?? []
  const partnerCaseStudies = caseStudies
  const { capabilityBlocks, benefitLedger } = getIndustrySections("monday-for-construction")

  return (
    <div>
      <StickyCtaConfig label={page.croSections?.stickyCtaLabel} mobileLabel={page.croSections?.stickyCtaMobileLabel} href={bookingHref(page.croSections?.stickyCtaUrl || calendlyUrl)} />
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
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl}
      />

      {/* Intro strip */}
      <ConstructionIntroStrip />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={resolveIndustryLogos(industryLogos, siteSettings?.carouselLogos)}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Tab section — heading rotates with active tab */}
      <ConstructionTabs tabs={resolvedComparisonTabs} />

      {/* How the platform closes the site-to-office gap */}
      {capabilityBlocks && (
        <CapabilityBlocksSection
          eyebrow={capabilityBlocks.eyebrow}
          heading={capabilityBlocks.heading}
          headingAccent={capabilityBlocks.headingAccent}
          lead={capabilityBlocks.lead}
          columns={capabilityBlocks.columns}
          blocks={capabilityBlocks.blocks}
          theme="tint"
        />
      )}

      {/* CRO action items */}
      <CroSections
        data={page.croSections}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
      />

      {/* monday CRM benefits ledger */}
      {benefitLedger && (
        <BenefitLedgerSection
          eyebrow={benefitLedger.eyebrow}
          heading={benefitLedger.heading}
          headingAccent={benefitLedger.headingAccent}
          intro={benefitLedger.intro}
          items={benefitLedger.items}
          footnote={benefitLedger.footnote}
          theme="tint"
        />
      )}

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* FAQ */}
      <FaqAccordion heading={page.faqHeading} tabs={resolvedFaqTabs} />

      {/* Project Life Cycle stages */}
      <LifecycleSection stages={resolvedLifecycleStages} />

      {/* Construction-specific testimonials */}
      <ConstructionTestimonialsSection testimonials={resolvedConstructionTestimonials} />

      {/* General customers say testimonials */}
      <TestimonialsGrid
        heading="What our customers say about us"
        ctaLabel="Start Your Transformation"
        ctaUrl={calendlyUrl}
        statCardSubtitle="have maximised their workflows with our monday.com expert support"
        statCardCtaLabel="Read our case studies"
        statCardCtaUrl="/customer-testimonials"
        caseStudies={partnerCaseStudies}
      />
    </div>
  )
}

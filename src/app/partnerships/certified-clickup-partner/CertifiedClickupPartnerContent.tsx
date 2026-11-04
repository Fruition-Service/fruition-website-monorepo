"use client"

import { bookingHref } from "@/lib/bookingLink"
import { useState } from "react"
import {
  HeroBanner,
  ClientLogoSection,
  CalendlySection,
  FaqAccordion,
} from "@/components/sections"
import type {
  CaseStudy,
  SiteSettingsData,
  FaqTab,
} from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

type FeatureGroup = { number: string; title: string; bullets: { emoji: string; text: string }[] }
type FeatureTab = { key?: string; label: string; heading?: string; groups: FeatureGroup[] }
type IndustryTab = { label: string; description: string; features: { emoji: string; text: string }[] }
type EverythingAppCard = { emoji?: string; title?: string; body?: string }
type ProvenStat = { emoji?: string; value?: string; body?: string }
type EverythingAppFeature = { number?: string; title?: string; body?: string }

/* ----------------- Sections ----------------- */

function PartnershipIntroSection() {
  return (
    <section className="bg-surface px-4 py-10 md:py-16">
      <div className="mx-auto text-center w-full max-w-[880px]">
        <p className="text-body text-muted">
          Fruition certifies partnership with ClickUp, an all-in-one productivity platform that brings work together in one place.
        </p>
        <p className="text-body text-muted mt-3.5">
          As a certified ClickUp Implementation Partners, we deliver comprehensive workspace solutions that transform how teams collaborate, eliminate app-switching, and save organisations a day of work every week.
        </p>
      </div>
    </section>
  )
}

function EverythingAppSection({ cards }: { cards: EverythingAppCard[] }) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="text-center mb-10">
          <h2 className="text-section-h2 text-body mb-4">
            Transform Your Business with ClickUp&apos;s <span className="text-brand">Everything App for Work</span>
          </h2>
          <p className="mx-auto text-body text-muted max-w-[820px]">
            ClickUp replaces multiple tools with one unified platform, eliminating the app-switching that fragments work, steals time, and kills productivity.
          </p>
          <p className="mx-auto text-body text-muted max-w-[820px] mt-3">
            As your certified ClickUp implementation partner, we help organisations across Australia, US, and UK unlock ClickUp&apos;s full potential through expert configuration, seamless migration, and comprehensive training.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((c, i) => (
            <div key={c.title || i} className="dark:shadow-none rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 flex flex-col gap-2.5">
              <span className="text-[28px]">{c.emoji}</span>
              <p className="font-bold text-lg">{c.title}</p>
              <p className="text-sm text-muted leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesTabsSection({ tabs }: { tabs: FeatureTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab, i) => (
            <button
              key={tab.key || tab.label || i}
              onClick={() => setActiveIdx(i)}
              className={`px-6 py-2.5 rounded-pill text-sm font-semibold cursor-pointer ${
                i === activeIdx
                  ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[0_10px_22px_-12px_rgba(128,21,232,0.55)]"
                  : "bg-surface-raised text-body ring-1 ring-ui"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {active.heading && (
          <h2 className="text-center text-section-h2 text-body mb-8">
            {active.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(active.groups || []).map((g: FeatureGroup, gi: number) => (
            <div key={g.number || gi} className="dark:shadow-none rounded-card shadow-whisper ring-1 ring-brand/10 bg-surface-raised p-6 flex flex-col gap-3.5">
              <div className="flex items-center gap-3.5">
                <span className="flex items-center justify-center font-bold w-[38px] h-[38px] shrink-0 rounded-chip bg-gradient-to-br from-brand to-brand-light text-white text-[13px]">
                  {g.number}
                </span>
                <p className="font-bold text-body-sm leading-snug">{g.title}</p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {(g.bullets || []).map((b: { emoji: string; text: string }, bi: number) => (
                  <li key={b.text || bi} className="flex items-start gap-2.5">
                    <span className="text-lg leading-[22px] shrink-0">{b.emoji}</span>
                    <span className="text-sm text-muted leading-relaxed">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IndustryTabsSection({ tabs }: { tabs: IndustryTab[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  if (!active) return null
  return (
    <section className="px-4 py-14 md:py-24 bg-gradient-to-b from-brand-soft/50 to-brand-light/30">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 text-surface-dark mb-8">
          Implement ClickUp for <span className="text-brand">any team</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab, i) => (
            <button
              key={tab.label || i}
              onClick={() => setActiveIdx(i)}
              className={`px-5 py-2.5 rounded-pill text-sm font-semibold cursor-pointer ${
                i === activeIdx
                  ? "bg-gradient-to-r from-brand to-brand-light text-white"
                  : "bg-white text-surface-dark-2 ring-1 ring-ui"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-card ring-1 ring-brand/10 shadow-card p-6 md:p-8">
          <h3 className="text-card-title text-surface-dark mb-2.5">{active.label}</h3>
          <p className="text-body-sm text-muted mb-5">{active.description}</p>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">Key Features</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(active.features || []).map((f: { emoji: string; text: string }, fi: number) => (
              <li key={f.text || fi} className="flex items-start gap-2.5">
                <span className="text-lg leading-[22px] shrink-0">{f.emoji}</span>
                <span className="text-sm text-muted leading-relaxed">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 text-body mb-10">
          Proven <span className="text-brand">ClickUp</span> Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div key={s.value || i} className="text-center p-7 rounded-card ring-1 ring-brand/10 shadow-whisper bg-gradient-to-b from-brand-soft to-brand-light/30 flex flex-col items-center gap-3">
              <span className="flex items-center justify-center w-[52px] h-[52px] rounded-pill bg-white text-[22px] shadow-micro">{s.emoji}</span>
              <p className="font-bold text-brand text-[22px] leading-tight">{s.value}</p>
              <p className="text-sm text-muted leading-relaxed max-w-[220px]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EverythingAppFeaturesSection({ features }: { features: EverythingAppFeature[] }) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 text-body mb-10">
          The Everything App for Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={f.number || i} className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 flex items-start gap-4">
              <span className="flex items-center justify-center font-bold w-10 h-10 shrink-0 rounded-chip bg-gradient-to-br from-brand to-brand-light text-white text-[13px]">
                {f.number}
              </span>
              <div>
                <p className="font-bold text-base mb-1.5">{f.title}</p>
                <p className="text-sm text-muted leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function CertifiedClickupPartnerContent({ page, siteSettings, faqTabs }: Props) {
  if (!page) return null
  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const calendlyUrl = bookingHref(rawCalendly)

  const resolvedFaqTabs = faqTabs ?? []
  const everythingAppCards: EverythingAppCard[] = page.everythingAppCards ?? []
  const servicesTabs: FeatureTab[] = page.servicesTabs ?? []
  const industryTabs: IndustryTab[] = page.industryTabsPartnership ?? []
  const provenStats: ProvenStat[] = page.provenStats ?? []
  const everythingAppFeatures: EverythingAppFeature[] = page.everythingAppFeatures ?? []

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
        partnerBadges={page.heroPartnerBadges ?? []}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || rawCalendly)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || rawCalendly)}
      />

      <PartnershipIntroSection />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      <EverythingAppSection cards={everythingAppCards} />
      <ServicesTabsSection tabs={servicesTabs} />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      <IndustryTabsSection tabs={industryTabs} />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      <FaqAccordion heading={page.faqHeading || "Frequently asked questions"} tabs={resolvedFaqTabs} />

      <ProvenResultsSection stats={provenStats} />
      <EverythingAppFeaturesSection features={everythingAppFeatures} />
    </div>
  )
}

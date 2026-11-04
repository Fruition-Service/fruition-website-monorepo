"use client"

import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import { Rocket, Check } from "lucide-react"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
} from "@/components/sections"
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
}

/* ----------------- Sections ----------------- */

type ProvenStat = { _key?: string; emoji?: string; value?: string; body?: string }
type ServiceCard = { _key?: string; emoji?: string; title?: string; body?: string; bullets?: string[] }
type ExpertCard = { _key?: string; title?: string; body?: string; image?: string }

function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  if (!stats || stats.length === 0) return null
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 text-body mb-10">
          Proven <span className="text-brand">Atlassian Cloud</span> Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((s: ProvenStat, i: number) => (
            <div key={s._key || s.value || i} className="text-center p-6 md:p-8 rounded-card ring-1 ring-brand/10 shadow-whisper bg-gradient-to-b from-brand-soft to-brand-light/30 flex flex-col items-center gap-3.5">
              <span className="flex items-center justify-center w-14 h-14 rounded-pill bg-white text-[26px] shadow-micro">{s.emoji}</span>
              <p className="font-bold text-brand text-3xl leading-none">{s.value}</p>
              <p className="text-sm text-muted leading-relaxed max-w-[240px]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComprehensiveServicesSection({ cards }: { cards: ServiceCard[] }) {
  if (!cards || cards.length === 0) return null
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 text-body mb-10">
          Our Comprehensive <span className="text-brand">Atlassian</span> Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c: ServiceCard, i: number) => (
            <div key={c._key || c.title || i} className="dark:shadow-none rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 flex flex-col gap-3">
              <span className="text-[28px]">{c.emoji}</span>
              <p className="font-bold text-base">{c.title}</p>
              <p className="text-sm text-muted leading-relaxed">{c.body}</p>
              {c.bullets && c.bullets.length > 0 && (
                <ul className="flex flex-col gap-1.5 mt-1">
                  {c.bullets.map((b: string, j: number) => (
                    <li key={b || j} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                      <Check size={16} className="text-brand shrink-0" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AtlassianExpertsSection({ calendlyUrl, cards }: { calendlyUrl: string; cards: ExpertCard[] }) {
  if (!cards || cards.length === 0) return null
  return (
    <section className="px-4 py-14 md:py-24 bg-gradient-to-b from-brand-soft/50 to-brand-light/30">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-col items-center text-center mb-14">
          <h2 className="text-section-h2 text-surface-dark mb-5">
            Your <span className="text-brand">Atlassian</span> Experts
          </h2>
          <Link href={calendlyUrl} className="cta-btn cta-btn-primary">
            <Rocket size={16} aria-hidden /> Book a Meeting
          </Link>
        </div>

        <div className="flex flex-col gap-14 md:gap-16">
          {cards.map((c: ExpertCard, i: number) => (
            <div
              key={c._key || c.title || i}
              className={`flex flex-col items-center gap-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="w-full min-w-0 md:flex-1">
                <p className="text-section-h3 text-surface-dark mb-3.5">
                  {c.title}
                </p>
                <p className="text-body-sm text-muted">{c.body}</p>
              </div>
              <div className="rounded-card overflow-hidden bg-white w-full md:flex-1 aspect-[16/10] ring-1 ring-brand/10 shadow-card">
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function CertifiedAtlassianPartnerContent({ page, siteSettings, faqTabs }: Props) {
  if (!page) return null
  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const calendlyUrl = bookingHref(rawCalendly)

  const resolvedFaqTabs = faqTabs ?? []
  const atlassianTabs: ComparisonTab[] = page.atlassianTabs ?? []
  const provenStats: ProvenStat[] = page.provenStats ?? []
  const serviceCards: ServiceCard[] = page.serviceCards ?? []
  const expertCards: ExpertCard[] = page.expertCards ?? []

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
        primaryCtaUrl={page.primaryCtaUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl}
      />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Tab section */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={atlassianTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* FAQ */}
      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Proven Atlassian Cloud Results */}
      <ProvenResultsSection stats={provenStats} />

      {/* Our Comprehensive Atlassian Services */}
      <div id="atlassian-process" />
      <ComprehensiveServicesSection cards={serviceCards} />

      {/* Your Atlassian Experts */}
      <AtlassianExpertsSection calendlyUrl={calendlyUrl} cards={expertCards} />
    </div>
  )
}

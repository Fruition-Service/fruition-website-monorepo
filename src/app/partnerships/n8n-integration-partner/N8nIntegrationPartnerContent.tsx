"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  ServicesCardsGrid,
  CroSections,
  StickyCtaConfig,
  WorkflowConnector,
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

type ProvenStat = { emoji?: string; value?: string; body?: string }

function ProvenResultsSection({ stats }: { stats: ProvenStat[] }) {
  if (!stats || stats.length === 0) return null
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-center text-section-h2 text-body mb-10">
          Proven <span className="text-brand">n8n Automation</span> Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <div
              key={s.value || i}
              className="text-center p-6 md:p-8 rounded-card ring-1 ring-brand/10 shadow-whisper bg-gradient-to-b from-brand-soft to-brand-light/30 flex flex-col items-center gap-3.5"
            >
              <span className="flex items-center justify-center w-14 h-14 rounded-pill bg-white text-[26px] shadow-micro">
                {s.emoji}
              </span>
              <p className="font-bold text-brand text-4xl leading-none">{s.value}</p>
              <p className="text-sm text-muted leading-relaxed max-w-[220px]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function N8nIntegrationPartnerContent({
  page,
  siteSettings,
  faqTabs,
}: Props) {
  if (!page) return null
  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const provenStats: ProvenStat[] = page.provenStats ?? []
  const comparisonTabs: ComparisonTab[] = page.comparisonTabs ?? []
  const resolvedFaqTabs: FaqTab[] =
    (faqTabs && faqTabs.length > 0 ? faqTabs : page.faqTabs) ?? []

  return (
    <div>
      <StickyCtaConfig label={page.croSections?.stickyCtaLabel} mobileLabel={page.croSections?.stickyCtaMobileLabel} href={bookingHref(page.croSections?.stickyCtaUrl || calendlyUrl)} />
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || page.title || ""}
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
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
      />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Tech stack connector — apps orchestrated through n8n into monday.com */}
      <WorkflowConnector
        eyebrow="Tech stack connector"
        heading="Orchestrate your entire stack through one Work OS"
        subheading="We route data across your existing apps with custom n8n workflows, syncing everything into monday.com in real time."
        theme="dark"
        steps={[
          { glyph: "🗂️", label: "CRM & ERP", sublabel: "Leads, orders, invoices" },
          { glyph: "💬", label: "Slack & Email", sublabel: "Alerts & approvals" },
          { glyph: "⚙️", label: "n8n", sublabel: "Webhooks · JSON transforms · branching" },
          { glyph: "📊", label: "monday.com", sublabel: "Single source of truth", tone: "hub" },
        ]}
        footnote="Cloud or self-hosted. n8n charges per full workflow execution, not per step."
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Our Comprehensive n8n Services */}
      {page.servicesCards?.length > 0 && (
        <ServicesCardsGrid
          heading={page.servicesHeading}
          headingAccent={page.servicesHeadingAccent}
          subheading={page.servicesSubheading}
          theme={page.servicesTheme || "dark"}
          cards={page.servicesCards}
        />
      )}

      {/* CRO action items */}
      <CroSections
        data={page.croSections}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
      />

      {/* Calendly under services */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* FAQ */}
      {!page.hideFaqSection && resolvedFaqTabs.length > 0 && (
        <FaqAccordion heading={page.faqHeading} tabs={resolvedFaqTabs} />
      )}

      {/* Proven Results */}
      <ProvenResultsSection stats={provenStats} />

      {/* Two-tab comparison: Top Challenges / n8n Solutions */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={comparisonTabs}
        theme="light"
        withPurpleCircle={false}
      />
    </div>
  )
}

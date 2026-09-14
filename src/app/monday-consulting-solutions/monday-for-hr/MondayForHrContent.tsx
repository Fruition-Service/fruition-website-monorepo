"use client"

import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  FileText,
  Check,
  Users,
  Mail,
  AlertTriangle,
  Wallet,
  ClipboardList,
  Umbrella,
  Calendar,
  Building2,
} from "lucide-react"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
  DiscoverCtaSection,
  JoinStatsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import FramedMedia from "@/components/common/FramedMedia"
import type { CaseStudy, SiteSettingsData, FaqTab } from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface Props {
  page: any
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  faqTabs?: FaqTab[]
}

const HR_HIRING_ITEMS: Array<{ icon: LucideIcon; text: string }> = [
  { icon: FileText, text: "ATS recruitment workflows including Forms" },
  { icon: Check, text: "Onboarding checklists" },
  { icon: FileText, text: "Contracting document creation" },
  { icon: Users, text: "Talent Pool / Contractor Management" },
]

const HR_OPERATIONS_ITEMS: Array<{ icon: LucideIcon; text: string }> = [
  { icon: Mail, text: "Email/inbox ticketing" },
  { icon: AlertTriangle, text: "OHS Policy and Operations" },
  { icon: Wallet, text: "Budgeting & Headcount Planning" },
  { icon: ClipboardList, text: "HR Project Management" },
  { icon: Umbrella, text: "Leave Management" },
  { icon: Calendar, text: "Scheduling" },
  { icon: Building2, text: "Organisational Charts" },
]

function HrLifecycleSection({ stages: resolvedLifecycleStages }: { stages: { n?: string; title?: string; body?: string }[] }) {
  return (
    <section className="bg-surface px-4 relative overflow-hidden py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-section-h2 text-center text-body mb-10 md:mb-14">
          Supporting Each Stage of Your HR Life Cycle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-14">
          {resolvedLifecycleStages.map((stage: { n?: string; title?: string; body?: string }, i: number) => (
            <div key={stage.n || i} className="flex flex-col gap-3">
              <p className="text-brand text-4xl font-light leading-none">{stage.n}</p>
              <p className="text-lg font-bold">{stage.title}</p>
              <p className="text-sm leading-[22px]">{stage.body}</p>
              {stage.n === "04" && (
                <FramedMedia className="rounded-card overflow-hidden mt-2 w-full max-w-[460px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hr-lifecycle-stage-04.gif"
                    alt="System rollout"
                    className="w-full h-auto"
                  />
                </FramedMedia>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HrExpertiseSection() {
  return (
    <section className="px-4 py-14 md:py-24 bg-brand-soft">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="text-section-h2 text-center text-surface-dark mb-4">
          Our monday CRM consulting expertise
        </h2>
        <p className="text-center mx-auto text-body-sm text-muted max-w-[820px] mb-12">
          Streamline your HR operations and strategic management systems with monday.com,
          through intelligent automation and data tracking; you can enhance your entire
          employee lifecycle from strategic recruitment workflow planning through to
          comprehensive HR project management. From hiring, engagement surveys, and
          collaboration portals. Seamlessly connect strategy to execution by managing
          company projects, contract administration, and performance initiatives across
          all phases of your employee&apos;s journey from hire to retire.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-card p-7 ring-1 ring-ui bg-surface-raised shadow-whisper">
            <h3 className="text-card-title text-brand mb-4">
              Hiring
            </h3>
            <ul className="flex flex-col gap-2.5">
              {HR_HIRING_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.text}
                    className="flex items-start gap-2.5 text-sm leading-[22px] text-muted"
                  >
                    <Icon size={18} aria-hidden className="shrink-0 mt-0.5 text-brand" />
                    <span>{item.text}</span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="rounded-card p-7 ring-1 ring-ui bg-surface-raised shadow-whisper">
            <h3 className="text-card-title text-brand mb-4">
              HR Operations
            </h3>
            <ul className="flex flex-col gap-2.5">
              {HR_OPERATIONS_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.text}
                    className="flex items-start gap-2.5 text-sm leading-[22px] text-muted"
                  >
                    <Icon size={18} aria-hidden className="shrink-0 mt-0.5 text-brand" />
                    <span>{item.text}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function HrFitSection({ calendlyUrl, reasons: resolvedFitReasons }: { calendlyUrl: string; reasons: { title?: string; body?: string }[] }) {
  return (
    <section className="px-4 relative overflow-hidden py-14 md:py-24 bg-brand-soft">
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="absolute pointer-events-none -top-[120px] -right-[120px] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(128,21,232,0.18),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute pointer-events-none -bottom-[120px] -left-[120px] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(186,131,240,0.22),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[1100px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
            Built for People &amp; Culture
          </span>
          <h2 className="text-section-h2 text-surface-dark max-w-[820px]">
            Why monday.com is the perfect fit for People and Culture Teams
          </h2>
          <Link
            href={calendlyUrl}
            className="cta-btn cta-btn-primary mt-7"
          >
            Schedule a Meeting
            <svg width="10" height="14" viewBox="0 0 8 14" fill="none" className="ml-2.5">
              <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resolvedFitReasons.map((r: { title?: string; body?: string }, i: number) => (
            <div
              key={r.title || i}
              className="relative rounded-card px-6 py-6 ring-1 ring-ui bg-surface-raised shadow-whisper dark:shadow-none transition-transform hover:-translate-y-[2px]"
            >
              <div className="flex items-center gap-3.5 mb-2.5">
                <span className="flex items-center justify-center shrink-0 w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-brand to-brand-light text-white font-mono text-xs font-semibold tracking-[0.04em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-bold text-surface-dark text-[17px] leading-[22px]">
                  {r.title}
                </p>
              </div>
              <p className="text-sm leading-[22px] text-muted pl-[52px]">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HrVideoSection() {
  return (
    <section className="px-4 pt-10 pb-14 md:pb-20 bg-brand-soft">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="rounded-card overflow-hidden aspect-video">
          <YouTubeEmbed videoId="g83dt0bCG4I" title="Improve your HR processes" />
        </div>
      </div>
    </section>
  )
}

export default function MondayForHrContent({
  page,
  siteSettings,
  caseStudies = [],
  faqTabs,
}: Props) {
  if (!page) return null

  const rawCalendly = siteSettings?.calendlyLink ?? ""
  const calendlyUrl = bookingHref(rawCalendly)

  const featuredTestimonial = caseStudies[0]

  return (
    <div>
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
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || rawCalendly)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || rawCalendly)}
      />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 3-tab section */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        subheading={page.comparisonSubheading}
        tabs={page.comparisonTabs ?? []}
        theme={page.comparisonTheme || "light"}
        withPurpleCircle={page.comparisonWithPurpleCircle ?? true}
      />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={rawCalendly}
      />

      {/* FAQ */}
      {!page.hideFaqSection && ((faqTabs && faqTabs.length > 0) ? (
        <FaqAccordion heading="Frequently asked questions" tabs={faqTabs} />
      ) : page.faqTabs?.length > 0 ? (
        <FaqAccordion heading="Frequently asked questions" tabs={page.faqTabs} />
      ) : null)}

      {/* Sections below FAQ (per screenshot) */}
      <HrLifecycleSection stages={page.lifecycleStages ?? []} />
      <HrExpertiseSection />
      <HrFitSection calendlyUrl={calendlyUrl} reasons={page.fitReasons ?? []} />
      <HrVideoSection />

      {/* Closing sections */}
      {!page.hideTestimonialsSection && <TestimonialsGrid caseStudies={caseStudies} />}
      {!page.hideDiscoverSection && (
        <DiscoverCtaSection badge={siteSettings?.badgeCertifications} />
      )}
      {!page.hideJoinStatsSection && page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel}
          ctaUrl={bookingHref(page.joinCtaUrl || rawCalendly)}
          siteSettings={siteSettings || undefined}
        />
      )}
      <TestimonialCtaBanner
        headingPart1="Join "
        headingAccent="900+ organisations"
        headingPart2=" that have maximised their workflows with our monday.com expert support"
        primaryCtaUrl={calendlyUrl}
        secondaryCtaUrl={calendlyUrl}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />
    </div>
  )
}

"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import Link from "next/link"
import { Rocket, Play, Check } from "lucide-react"
import {
  HeroBanner,
  ClientLogoSection,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  TestimonialsGrid,
  CroSections,
  StickyCtaConfig,
} from "@/components/sections"
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
}

// Content scraped from
// https://www.fruitionservices.io/partnerships/monday-consulting-partner

const LEADERSHIP_CHALLENGES: ComparisonTab = {
  _key: "leadership",
  label: "Top Leadership Challenges",
  items: [
    {
      _key: "lc1",
      number: "01",
      title: "Market volatility and uncertainty",
      description:
        "Demand real-time project visibility and reporting capabilities that enable quick pivots in strategy and resource allocation, helping organisations make data-driven decisions to maintain competitive advantage and adapt to changing conditions.",
    },
    {
      _key: "lc2",
      number: "02",
      title: "AI and automation in project management",
      description:
        "Requires careful implementation to boost team efficiency while managing change resistance, focusing on streamlined workflows, automated routine tasks, and AI-powered insights for better decision making.",
    },
    {
      _key: "lc3",
      number: "03",
      title: "Hybrid work models challenge project leaders",
      description:
        "To balance in-office and remote team dynamics, requiring robust digital collaboration tools, clear communication protocols, and standardised processes to maintain productivity across distributed teams.",
    },
    {
      _key: "lc4",
      number: "04",
      title: "Talent retention in project management",
      description:
        "Hinges on creating engaging work environments with clear growth paths, balanced workloads, and opportunities for skill development, while ensuring knowledge transfer and team cohesion amid turnover.",
    },
    {
      _key: "lc5",
      number: "05",
      title: "Cybersecurity and digital risk management",
      description:
        "Must be integrated into project workflows through secure access controls, compliant data handling, and protected collaboration tools, without compromising team efficiency or communication effectiveness.",
    },
  ],
}

const TEAM_CHALLENGES: ComparisonTab = {
  _key: "team",
  label: "Top Team Challenges",
  items: [
    {
      _key: "tc1",
      number: "01",
      title: "Hybrid Collaboration",
      description: "Adopting the right tools to maintain effective teamwork, communication, and workload capacity.",
    },
    {
      _key: "tc2",
      number: "02",
      title: "Digital Adaptation",
      description: "Get expert training support to rapidly learn new tools and technologies while maintaining productivity.",
    },
    {
      _key: "tc3",
      number: "03",
      title: "Work-Life Integration",
      description: "Giving team members time back with an automated system that cuts out manual work.",
    },
    {
      _key: "tc4",
      number: "04",
      title: "Personal Development",
      description: "Develop team members to learn how to optimise processes with better systems.",
    },
    {
      _key: "tc5",
      number: "05",
      title: "Team Cohesion",
      description: "Unify the team with communication and work management systems.",
    },
  ],
}

const HOW_WE_HELP: ComparisonTab = {
  _key: "how",
  label: "How We Can Help",
  items: [
    {
      _key: "hh1",
      number: "01",
      title: "Process Discovery → Business Process Audit",
      description:
        "We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.",
    },
    {
      _key: "hh2",
      number: "02",
      title: "Technical Architecture → System Integration Scope",
      description:
        "Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.",
    },
    {
      _key: "hh3",
      number: "03",
      title: "Solution Design → Implementation",
      description:
        "Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.",
    },
    {
      _key: "hh4",
      number: "04",
      title: "Efficiency Impact → ROI Opportunity Analysis",
      description:
        "By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.",
    },
    {
      _key: "hh5",
      number: "05",
      title: "Change Readiness → Adoption & Training Strategies",
      description:
        "Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.",
    },
  ],
}

type WhyFruitionItem = string
type TestimonialItem = { name: string; role: string; quote: string; photo?: string }
type ImplementationServiceItem = { emoji: string; title: string; body: string }
type IconLabelItem = { emoji: string; label: string }
type FruitionAdvantageItem = string

function CertifiedExcellenceSection({ calendlyUrl }: { calendlyUrl: string }) {
  return (
    <section className="px-4 py-14 md:py-24 bg-gradient-to-b from-surface-dark-2 to-surface-dark">
      <div className="mx-auto text-center max-w-[920px]">
        <h2 className="text-section-h2 text-white mb-4">
          Certified monday.com Partners Delivering Global Excellence
        </h2>
        <p className="text-base leading-relaxed text-white/80 mb-8">
          Transform your business operations with Fruition. As trusted monday.com Partners, our certified consultants help organisations worldwide harness the full power of monday.com.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={calendlyUrl} className="cta-btn cta-btn-on-dark-primary">
            <Rocket size={16} aria-hidden /> Book a Consultation
          </Link>
          <Link href="https://monday.com" className="cta-btn cta-btn-on-dark-outline">
            <Play size={16} aria-hidden /> Get Started with monday.com
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhyFruitionSection({ items }: { items: WhyFruitionItem[] }) {
  return (
    <section className="bg-surface px-4 py-10 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-section-h2 text-body text-center mb-8">
          Why Choose Fruition for <span className="text-brand">monday.com?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {items.map((reason: WhyFruitionItem, i: number) => (
            <div
              key={reason || i}
              className="flex items-center gap-3 rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-5"
            >
              <Check size={22} aria-hidden className="shrink-0 text-brand" />
              <p className="font-semibold text-sm text-body">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ImplementationServicesSection({ items }: { items: ImplementationServiceItem[] }) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto max-w-[1000px]">
        <h2 className="text-section-h2 text-body text-center mb-8">
          Our monday.com Expert <span className="text-brand">Implementation Services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((s: ImplementationServiceItem, i: number) => (
            <div
              key={s.title || i}
              className="dark:shadow-none rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 flex flex-col gap-2.5"
            >
              <span className="text-[28px] leading-none">{s.emoji}</span>
              <p className="text-lg font-semibold text-body">{s.title}</p>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Combined section: CRM eyebrow + Industry & Global 2-col + Fruition Advantage banner */
function PartnerWrapUpSection({
  calendlyUrl,
  industrySolutions,
  countries,
  fruitionAdvantages,
}: {
  calendlyUrl: string
  industrySolutions: IconLabelItem[]
  countries: IconLabelItem[]
  fruitionAdvantages: FruitionAdvantageItem[]
}) {
  return (
    <section className="px-4 py-14 md:py-24 bg-gradient-to-b from-surface to-brand-soft">
      <div className="mx-auto max-w-[1000px]">
        {/* CRM Expertise eyebrow header */}
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-section-h2 text-body mb-3">
            <span className="text-brand">monday CRM</span> Consulting Expertise
          </h2>
          <p className="text-body-sm text-muted max-w-[640px]">
            Streamline your customer relationships with custom CRM implementations tailored to your business needs.
          </p>
        </div>

        {/* Industry Solutions + Global Reach side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-9">
          {/* Industry Solutions card */}
          <div className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
            <p className="text-base font-bold text-brand mb-3.5">
              Industry Solutions
            </p>
            <ul className="flex flex-col gap-2.5">
              {industrySolutions.map((s: IconLabelItem, i: number) => (
                <li key={s.label || i} className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{s.emoji}</span>
                  <span className="text-sm text-body">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Reach card */}
          <div className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
            <p className="text-base font-bold text-brand mb-1">
              Global Reach, Local Expertise
            </p>
            <p className="text-xs text-muted mb-3.5">Serving clients across:</p>
            <ul className="flex flex-col gap-2.5">
              {countries.map((c: IconLabelItem, i: number) => (
                <li key={c.label || i} className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{c.emoji}</span>
                  <span className="text-sm text-body">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fruition Advantage purple banner */}
        <div className="overflow-hidden relative rounded-card p-7 bg-gradient-to-br from-surface-dark-2 via-brand-dark to-brand shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div>
              <p className="text-lg font-bold text-white mb-3.5">The Fruition Advantage</p>
              <ul className="flex flex-col gap-2.5">
                {fruitionAdvantages.map((adv: FruitionAdvantageItem, i: number) => (
                  <li key={adv || i} className="flex items-start gap-2.5 text-white/90">
                    <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white/20 font-mono text-[11px] font-semibold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-5">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start md:items-end justify-between gap-5">
              <p className="text-sm leading-relaxed text-white text-left md:text-right max-w-[280px]">
                Learn about how monday.com is the right fit for you
              </p>
              <Link href={calendlyUrl} className="cta-btn cta-btn-on-dark-primary">
                <Rocket size={16} aria-hidden /> Schedule a Meeting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function MondayConsultingPartnerContent({ page, siteSettings, caseStudies = [], faqTabs }: Props) {
  if (!page) return null
  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const partnerTabs: ComparisonTab[] = [LEADERSHIP_CHALLENGES, TEAM_CHALLENGES, HOW_WE_HELP]
  const resolvedFaqTabs = faqTabs ?? []

  // Sanity-driven content (populated via scripts/sanity-migrate/monday-consulting-partner.ts).
  const resolvedWhyFruition: WhyFruitionItem[] = page.whyFruition ?? []
  const resolvedPartnerTestimonials: TestimonialItem[] = page.partnerTestimonials ?? []
  const resolvedImplementationServices: ImplementationServiceItem[] = page.implementationServices ?? []
  const resolvedIndustrySolutions: IconLabelItem[] = page.industrySolutions ?? []
  const resolvedCountries: IconLabelItem[] = page.countries ?? []
  const resolvedFruitionAdvantages: FruitionAdvantageItem[] = page.fruitionAdvantages ?? []

  // Build CaseStudy[] from resolved partner testimonials; fall back to Sanity
  // caseStudies when none are present.
  const partnerCaseStudies: CaseStudy[] = resolvedPartnerTestimonials.length > 0
    ? resolvedPartnerTestimonials.map((t: TestimonialItem, i: number) => ({
        _id: `partner-${i}`,
        clientName: t.name,
        clientRole: t.role.split(",")[0]?.trim() ?? t.role,
        clientCompany: t.role.split(",").slice(1).join(",").trim() || undefined,
        quote: t.quote,
      }))
    : caseStudies

  return (
    <div>
      <StickyCtaConfig label={page.croSections?.stickyCtaLabel} mobileLabel={page.croSections?.stickyCtaMobileLabel} href={bookingHref(page.croSections?.stickyCtaUrl || calendlyUrl)} />
      {/* 1. Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow || "monday.com Expert Consultants"}
        headingPart1={page.heroHeading || "Top monday.com Expert Consultants"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading || "Platinum monday.com Partner in Australia, UK and US"
        }
        heroImage={page.heroImage}
        heroImageUrl="/images/partner-hero.avif"
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "Book a Consultation"}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel || "Get Started with monday.com"}
        secondaryCtaUrl={page.secondaryCtaUrl || "https://monday.com"}
      />

      {/* 2. Logo Cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. 3-tab section */}
      <ComparisonTabsSection
        heading="Streamline Operations & Maximise Efficiency with Our monday.com Consultants"
        subheading="We streamline disconnected business processes into integrated, automated workflows that boost team collaboration and drive measurable ROI across your organization. Our expert consultants empower you to adopt workflow automation & AI systems."
        tabs={partnerTabs}
        theme="light"
        withPurpleCircle={false}
      />

      {/* 4. Certified Excellence dark banner */}
      <CertifiedExcellenceSection calendlyUrl={rawCalendly} />

      {/* 5. Why Choose Fruition */}
      <WhyFruitionSection items={resolvedWhyFruition} />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* 5b. CRO action items */}
      <CroSections
        data={page.croSections}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
      />

      {/* 6. FAQ */}
      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* 6b. Video below FAQ */}
      <section className="bg-surface px-4 pt-6 pb-14 md:pb-24">
        <div className="mx-auto max-w-[980px]">
          <div className="rounded-card overflow-hidden aspect-video">
            <YouTubeEmbed videoId="_0MhMjicbIM" title="monday.com consulting partner overview" />
          </div>
        </div>
      </section>

      {/* 7. Testimonials — use shared TestimonialsGrid */}
      <TestimonialsGrid
        heading="What our customers say about us"
        ctaLabel="Start Your Transformation"
        ctaUrl={calendlyUrl}
        statCardValue="900+"
        statCardSubtitle="have maximised their workflows with our monday.com expert support"
        statCardCtaLabel="Read our case studies"
        statCardCtaUrl="/customer-testimonials"
        caseStudies={partnerCaseStudies}
      />

      {/* 8. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule Your Personalised Demo With monday.com Expert Consultant"}
        subheading={
          page.calendlySubheading ||
          "Schedule a demo with our monday.com consultants to discover how monday.com can be customised for your business, and get a free 4-week extended trial to experience its full potential."
        }
        calendlyUrl={rawCalendly}
      />

      {/* 9. Implementation Services (2×2) */}
      <ImplementationServicesSection items={resolvedImplementationServices} />

      {/* 10. Combined: CRM expertise + Industry/Global cards + Fruition Advantage banner */}
      <PartnerWrapUpSection
        calendlyUrl={rawCalendly}
        industrySolutions={resolvedIndustrySolutions}
        countries={resolvedCountries}
        fruitionAdvantages={resolvedFruitionAdvantages}
      />
    </div>
  )
}

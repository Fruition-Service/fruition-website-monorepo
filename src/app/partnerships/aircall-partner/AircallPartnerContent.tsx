"use client"

import { bookingHref } from "@/lib/bookingLink"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import Link from "next/link"
import { useState } from "react"
import { Rocket, Check } from "lucide-react"
import FramedMedia from "@/components/common/FramedMedia"
import {
  HeroBanner,
  ClientLogoSection,
  CalendlySection,
  FaqAccordion,
  JoinStatsSection,
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

/* ----------------- Hardcoded content ----------------- */

type Item = { number: string; title: string; description?: string; bullets?: string[] }
type Tab = { key: string; label: string; items: Item[] }

const AIRCALL_TABS: Tab[] = [
  {
    key: "challenges",
    label: "Top Challenges",
    items: [
      {
        number: "01",
        title: "Call Abandonment Rate",
        description:
          "occurs when customers hang up before speaking to an agent, often due to long wait times or frustration. Aircall's smart call routing and call-back features ensure customers never feel stuck on hold. With real-time analytics and call volume insights, teams can forecast busy periods, optimise staffing, and deliver faster responses.",
      },
      {
        number: "02",
        title: "Repetitive Tasks",
        description:
          "can be automated so your team can save time on call reviews with Aircall's advanced AI features like call transcription, tags and summaries, and Call Scoring. Free up pre- and post-call admin time so your teams are free to focus on building and maintaining customer relationships.",
      },
      {
        number: "03",
        title: "Low First Call Resolution Rate",
        description:
          "can be improved by Aircall's call recordings, in-call coaching, and whispering, to help managers tackle challenging calls faster, with less disruption to your team and the customer. Make data-driven decisions with in-depth analytics. View key data like missed call rates and response time and use custom tags to track almost any metric.",
      },
      {
        number: "04",
        title: "Disconnected tech stack",
        description:
          "Deliver smarter, more personalised experiences as your CRM and Helpdesk data flows effortlessly into every customer interaction. Easily add new users, obtain local area code phone numbers, and even international numbers as your teams expand and your business grows.",
      },
    ],
  },
  {
    key: "why-aircall",
    label: "Why Choose Aircall",
    items: [
      {
        number: "01",
        title: "Advanced Communication Features",
        bullets: [
          "Real-time call monitoring and recording capabilities",
          "Advanced call analytics and reporting dashboards",
          "Smart call distribution and routing",
          "International number support across 100+ countries",
        ],
      },
      {
        number: "02",
        title: "Seamless Integration Capabilities",
        bullets: [
          "Native CRM platform connections",
          "Custom API integration options",
          "Workflow automation tools",
          "Help desk software compatibility",
        ],
      },
      {
        number: "03",
        title: "On-Premise Deployment and Security",
        bullets: [
          "End-to-end call encryption",
          "GDPR and HIPAA compliance",
          "24/7 security monitoring",
          "Secure data storage protocols",
        ],
      },
    ],
  },
  {
    key: "how-help",
    label: "How We Can Help",
    items: [
      {
        number: "01",
        title: "As your dedicated Aircall integration partner, we provide:",
        bullets: [
          "Complete CRM integration services: seamless connection of Aircall with leading platforms like Salesforce, HubSpot, and Zendesk",
          "Custom contact center solutions: end-to-end implementation for support teams and call centres",
          "Sales operations enhancement: advanced call routing, analytics, and performance monitoring tools",
          "Expert implementation support: dedicated technical assistance throughout your Aircall deployment",
        ],
      },
      {
        number: "02",
        title: "Working with Fruition as your Aircall partner ensures:",
        bullets: [
          "Rapid deployment and setup",
          "Custom integration development",
          "Comprehensive team training",
          "Ongoing technical support",
          "Performance optimisation services",
        ],
      },
      {
        number: "03",
        title: "Scale your communications infrastructure with our Aircall partnership:",
        bullets: [
          "Deploy cloud communications rapidly",
          "Reduce operational costs significantly",
          "Improve customer service metrics",
          "Enable remote team collaboration",
          "Access advanced analytics tools",
        ],
      },
    ],
  },
]


/* ----------------- Sections ----------------- */

function IntroSection() {
  return (
    <section className="bg-surface px-4 py-10 md:py-16">
      <div className="mx-auto text-center w-full max-w-[920px]">
        <p className="text-body text-muted">
          Fruition is an <span className="font-bold text-brand">official Aircall Partner</span> specialising in
          <span className="font-bold text-brand"> enterprise-grade cloud phone system implementations</span>. Our certified team delivers comprehensive Aircall integration services, connecting your business communications with CRM platforms, contact centre operations, and sales workflows.
        </p>
      </div>
    </section>
  )
}

type AircallTabShape = { _key?: string; key?: string; label?: string; items?: Array<{ _key?: string; number?: string; title?: string; description?: string; bullets?: string[] }> }

function AircallTabsSection({ tabs }: { tabs: AircallTabShape[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx]
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-section-h2 text-body max-w-[860px] mb-4">
            Streamline Operations & Maximize Efficiency on monday.com with n8n Solutions
          </h2>
          <p className="text-body text-muted max-w-[820px]">
            We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organization.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(active.items ?? []).map((g, idx) => (
            <div key={g.number || idx} className="dark:shadow-none rounded-card shadow-whisper ring-1 ring-brand/10 bg-surface-raised p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3.5">
                <span className="flex items-center justify-center font-bold w-[38px] h-[38px] shrink-0 rounded-chip bg-gradient-to-br from-brand to-brand-light text-white text-[13px]">
                  {g.number}
                </span>
                <p className="font-bold text-body-sm leading-snug">{g.title}</p>
              </div>
              {g.description && (
                <p className="text-sm text-muted leading-relaxed">{g.description}</p>
              )}
              {g.bullets && (
                <ul className="flex flex-col gap-2">
                  {g.bullets.map((b: string) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                      <Check size={16} className="text-brand shrink-0 mt-0.5" aria-hidden />
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

type AircallFeature = { title?: string; body?: string; image?: string; imageRight?: boolean }
const AIRCALL_FEATURES_FALLBACK: AircallFeature[] = [
  {
    title: "Set up in seconds",
    body: "Easily claim numbers, set up integrations, and manage your phone system with just a few clicks. Enhance every customer interaction with AI Voice Agents, instant insights, WhatsApp Messaging, and more.",
    image: "/images/aircall-reporting.avif",
    imageRight: true,
  },
  {
    title: "For Sales and Customer Support",
    body: "Achieve better resolution rates. Powerful shared inbox features keep cross-channel conversations under control, all in one place. Agents know exactly what to do next instead of asking customers to repeat themselves.",
    image: "/images/aircall-mobile-app.avif",
    imageRight: false,
  },
]

function AIConversationsSection({ calendlyUrl, features }: { calendlyUrl: string; features: AircallFeature[] }) {
  return (
    <section className="bg-surface px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-section-h2 text-body mb-6">
            AI-powered customer conversations made easy
          </h2>
          <Link href={calendlyUrl} className="cta-btn cta-btn-primary">
            <Rocket size={16} aria-hidden /> Book a Meeting
          </Link>
        </div>

        <div className="flex flex-col gap-14 md:gap-16">
          {features.map((f, i) => (
            <div
              key={f.title || i}
              className={`flex flex-col items-center gap-10 ${f.imageRight ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="w-full min-w-0 md:flex-1">
                <p className="text-section-h3 text-body mb-3.5">
                  {f.title}
                </p>
                <p className="text-body-sm text-muted">{f.body}</p>
              </div>
              <FramedMedia className="rounded-card overflow-hidden w-full md:flex-1 aspect-[16/10] ring-1 ring-ui shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
              </FramedMedia>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------- Page ----------------- */

export default function AircallPartnerContent({ page, siteSettings, faqTabs }: Props) {
  if (!page) return null
  const rawCalendly =
    siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const calendlyUrl = bookingHref(rawCalendly)

  const resolvedFaqTabs = faqTabs ?? []
  const resolvedAircallFeatures: AircallFeature[] = (page.aircallFeatures && page.aircallFeatures.length > 0) ? page.aircallFeatures : AIRCALL_FEATURES_FALLBACK

  return (
    <div>
      {/* Hero */}
      <HeroBanner
        eyebrow={page.heroEyebrow}
        headingPart1={page.heroHeading || "Aircall Certified Partner"}
        headingAccent=""
        subheading={
          page.hideHeroSubheading
            ? undefined
            : page.heroSubheading ||
              "Fruition's certified Aircall integration partner solutions. Telephone integration services for business communications."
        }
        heroImage={page.heroImage}
        heroVideoSrc={page.heroLocalVideoSrc}
        certificationBadge={siteSettings?.badgeCertifications}
        partnerBadges={
          page.heroPartnerBadges?.length > 0
            ? page.heroPartnerBadges
            : siteSettings?.navbarPartnerBadges || []
        }
        primaryCtaLabel={page.primaryCtaLabel || "Book a Consultation"}
        primaryCtaUrl={bookingHref(page.primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={bookingHref(page.secondaryCtaUrl || calendlyUrl)}
      />

      <IntroSection />

      {/* Logo cloud */}
      <ClientLogoSection
        headingPart1={page.logoCloudHeadingPart1 || "Clients who have used our "}
        headingAccent={page.logoCloudHeadingAccent ?? "monday.com consulting services"}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      <AircallTabsSection tabs={(page.aircallTabs && page.aircallTabs.length > 0) ? page.aircallTabs : AIRCALL_TABS} />

      {/* Calendly */}
      <CalendlySection
        heading={page.calendlyHeading || "Schedule A 30-Min Consultation"}
        subheading={page.calendlySubheading || "AI-powered customer conversations made easy."}
        calendlyUrl={rawCalendly}
      />

      <AIConversationsSection calendlyUrl={rawCalendly} features={resolvedAircallFeatures} />

      <FaqAccordion heading="Frequently asked questions" tabs={resolvedFaqTabs} />

      {/* Stats */}
      {page.joinStats?.length > 0 && (
        <JoinStatsSection
          headingPart1={page.joinHeadingPart1}
          headingAccent={page.joinHeadingAccent}
          headingPart2={page.joinHeadingPart2}
          subheading={page.joinSubheading}
          stats={page.joinStats}
          footnote={page.joinFootnote}
          ctaLabel={page.joinCtaLabel || "BOOK A MEETING"}
          ctaUrl={bookingHref(page.joinCtaUrl || calendlyUrl)}
          siteSettings={siteSettings || undefined}
        />
      )}
    </div>
  )
}

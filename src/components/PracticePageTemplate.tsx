import Link from 'next/link'
import {
  DISCOVERY_CALL_URL,
  GEO_REGIONS,
  PRACTICE_LEADER,
  type PracticePage,
} from '@/data/practicePages/types'
import FaqAccordion from '@/components/sections/FaqAccordion'
import ClosingCtaSection from '@/components/sections/ClosingCtaSection'
import { getFaqItemsForPageStrict, getClosingCtaForPage } from '@/sanity/queries'
import { getIndustryLogos, INDUSTRY_LOGO_KEYS } from '@/sanity/industryLogos'
import ClientLogoSection from '@/components/sections/ClientLogoSection'
import { groupFaqsIntoTabs } from '@/sanity/groupFaqs'
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import CalendlySection from '@/components/sections/CalendlySection'

/**
 * Shared renderer for the Site Architecture v2.1 practice clusters
 * (/atlassian-consulting, /hubspot-consulting, /ai-consulting, /integrations,
 * /monday-products). Sections mirror Josh's approved mockups: hero, numbered
 * approach, services, child pages, geographic coverage, practice leader,
 * FAQ (with FAQPage JSON-LD), closing CTA. The BreadcrumbList JSON-LD
 * renders site-wide via SiteFrame > Breadcrumbs.
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
      {children}
    </p>
  )
}

function CtaButtons({
  compact = false,
  label = 'Book a discovery call',
}: {
  compact?: boolean
  label?: string
}) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${compact ? '' : 'mt-8'}`}>
      {/* Same tab on purpose: a `target` opts the link out of the in-page
          scroll to #book (see inPageBooking.ts). */}
      <a href={DISCOVERY_CALL_URL} className="cta-btn cta-btn-primary">
        {label} →
      </a>
      {!compact && (
        <a href="#faq" className="cta-btn cta-btn-outline">
          Common questions
        </a>
      )}
    </div>
  )
}

export default async function PracticePageTemplate({ page }: { page: PracticePage }) {
  // Central Sanity FAQs for this route (tagged with the page key in faqItem.pages).
  // Fall back to the page's hardcoded faqs until the migration has seeded them.
  // FAQPage JSON-LD is emitted by FaqAccordion itself.
  const pageKey = page.path.replace(/^\//, '')
  // Only the industry practice pages have a logo wall; the rest of the cluster
  // (atlassian, hubspot, ai-consulting, …) resolves to undefined and renders none.
  const industryKey = INDUSTRY_LOGO_KEYS[page.path as keyof typeof INDUSTRY_LOGO_KEYS]
  const [centralFaqs, closingCta, industryLogos] = await Promise.all([
    getFaqItemsForPageStrict(pageKey),
    getClosingCtaForPage(pageKey),
    industryKey ? getIndustryLogos(industryKey) : Promise.resolve(null),
  ])
  // Central Sanity FAQs win by default. A page that sets `preferPageFaqs` keeps
  // its own list in front of them, so a rewritten page never renders (and never
  // emits JSON-LD for) questions left behind by the copy it replaced.
  const pageFaqTab = [
    { label: 'General Questions', items: page.faqs.map((f) => ({ question: f.q, answer: f.a })) },
  ]
  const faqTabs =
    !page.preferPageFaqs && centralFaqs?.length ? groupFaqsIntoTabs(centralFaqs) : pageFaqTab
  return (
    // <div>, not <main> — SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">

      {/* Hero: condensed copy and CTAs left; on desktop the practice's
          services run down the right as a plain list, so the first screen
          says what Fruition does here before any scrolling. */}
      <section className="hero-band">
        <div className="site-container pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-16 lg:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full bg-brand-soft text-brand font-mono text-xs font-semibold uppercase tracking-[0.14em] px-3 py-1 mb-5">
                {page.eyebrow}
              </span>
              <h1 className="text-display">
                {page.heading}
                <span className="text-brand">.</span>
              </h1>
              <p className="mt-5 text-body-lead text-muted max-w-[60ch]">{page.lead}</p>
              <CtaButtons label={page.primaryCtaLabel} />
            </div>
            {page.services.length > 0 && (
              <nav
                aria-label={page.servicesEyebrow ?? 'Services'}
                className="hidden lg:block rounded-card ring-1 ring-ui bg-surface-raised shadow-whisper p-6"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-2">
                  {page.servicesEyebrow ?? 'Services'}
                </p>
                <ul className="divide-y divide-dashed divide-ui">
                  {page.services.map((s) => (
                    <li key={s.title}>
                      <Link
                        href={s.href ?? '#services'}
                        className="flex min-h-11 items-center justify-between gap-4 py-2.5 text-[15px] font-medium text-body hover:text-brand transition-colors"
                      >
                        {s.title}
                        <span aria-hidden className="text-brand">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </section>

      {industryLogos?.length ? <ClientLogoSection logos={industryLogos} /> : null}

      {/* Approach */}
      <section className="border-b border-ui">
        <div className="site-container section-y">
          <Eyebrow>{page.approachEyebrow ?? 'Our approach'}</Eyebrow>
          <h2 className="text-section-h2 mb-8 md:mb-10">{page.approachHeading}</h2>
          {/* Four steps read as a 2x2 on tablet and one row on desktop;
              everything else keeps the three-column grid. */}
          <div
            className={`grid gap-6 ${
              page.approach.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'
            }`}
          >
            {page.approach.map((a, i) => (
              <div key={a.title} className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
                <div className="font-mono text-xs font-semibold text-brand mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-card-title mb-2">{a.title}</h3>
                <p className="text-body-sm text-muted">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-b border-ui bg-surface-subtle scroll-mt-24">
        <div className="site-container section-y">
          <Eyebrow>{page.servicesEyebrow ?? 'Services'}</Eyebrow>
          <h2 className="text-section-h2 mb-8 md:mb-10">{page.servicesHeading}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {page.services.map((s) =>
              s.href ? (
                <Link
                  key={s.title}
                  href={s.href}
                  className="group rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 flex items-start justify-between gap-4 hover:ring-brand transition-colors"
                >
                  <div>
                    <h3 className="text-card-title mb-2 group-hover:text-brand transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-body-sm text-muted">{s.body}</p>
                  </div>
                  <span aria-hidden className="text-brand text-xl shrink-0 mt-0.5">→</span>
                </Link>
              ) : (
                <div key={s.title} className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
                  <h3 className="text-card-title mb-2">{s.title}</h3>
                  <p className="text-body-sm text-muted">{s.body}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Child pages */}
      {page.children && page.children.length > 0 && (
        <section className="border-b border-ui">
          <div className="site-container section-y">
            <Eyebrow>{page.childrenEyebrow ?? 'Explore'}</Eyebrow>
            <h2 className="text-section-h2 mb-8 md:mb-10">
              {page.childrenHeading ?? 'Go deeper.'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {page.children.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6 flex items-start justify-between gap-4 hover:ring-brand transition-colors"
                >
                  <div>
                    <h3 className="text-card-title mb-1 group-hover:text-brand transition-colors">
                      {c.label}
                    </h3>
                    {c.description && (
                      <p className="text-body-sm text-muted">{c.description}</p>
                    )}
                  </div>
                  <span aria-hidden className="text-brand text-xl shrink-0 mt-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      {/* Geographic coverage */}
      <section className="border-b border-ui">
        <div className="site-container section-y">
          <Eyebrow>Geographic coverage</Eyebrow>
          <h2 className="text-section-h2 mb-8 md:mb-10">
            Delivered locally across three regions.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GEO_REGIONS.map((g) => (
              <div key={g.region} className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
                <div className="text-2xl mb-3" aria-hidden>{g.flag}</div>
                <h3 className="text-card-title">{g.region}</h3>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mt-1 mb-3">
                  {g.cities}
                </p>
                <p className="text-body-sm text-muted">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice leader */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="site-container section-y">
          <Eyebrow>Who leads it</Eyebrow>
          <div className="grid md:grid-cols-[1fr_1.6fr] gap-10 items-start">
            <div>
              <h2 className="text-section-h2">{PRACTICE_LEADER.heading}</h2>
            </div>
            <div>
              <p className="text-base font-semibold">
                {PRACTICE_LEADER.name}
                <span className="text-muted font-normal"> · {PRACTICE_LEADER.title}</span>
              </p>
              <p className="mt-3 text-body-sm text-muted">{PRACTICE_LEADER.bio}</p>
              <p className="mt-4 text-base font-medium text-body">{PRACTICE_LEADER.pull}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {PRACTICE_LEADER.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full ring-1 ring-ui bg-surface-raised text-xs font-medium px-3 py-1"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking — gives the page its own #book, so every "book a call" CTA
          scrolls here instead of sending the visitor to /contact-us. */}
      <CalendlySection
        heading="Let's design the way your business should run."
        subheading="30 minutes. No obligation. Speak to a consultant, not a salesperson."
      />

      {/* FAQ — shared site-wide accordion (renders its own FAQPage JSON-LD + #faq anchor) */}
      <div className="border-b border-ui">
        <FaqAccordion heading="Frequently asked questions" tabs={faqTabs} />
      </div>

      {/* Closing CTA — shared site-wide banner; Sanity copy wins, previous
          hardcoded copy is the verbatim fallback */}
      <ClosingCtaSection
        cta={closingCta}
        fallback={{
          heading: 'Ready to talk?',
          lead: "Book a 30-minute discovery call. We'll give you a frank read on scope, fit, and cost.",
          primaryLabel: 'Book a discovery call →',
          primaryUrl: DISCOVERY_CALL_URL,
        }}
      />
    </div>
  )
}

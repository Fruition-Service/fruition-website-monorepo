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

/**
 * Shared renderer for the Site Architecture v2.1 practice clusters
 * (/atlassian-consulting, /hubspot-consulting, /ai-consulting, /integrations,
 * /monday-products). Sections mirror Josh's approved mockups: hero, numbered
 * approach, services, child pages, geographic coverage, practice leader,
 * FAQ (with FAQPage JSON-LD), closing CTA. The breadcrumb bar and its
 * BreadcrumbList JSON-LD render site-wide via SiteFrame > Breadcrumbs.
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
      {children}
    </p>
  )
}

function CtaButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${compact ? '' : 'mt-8'}`}>
      <a
        href={DISCOVERY_CALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-btn cta-btn-primary"
      >
        Book a discovery call →
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

      {/* Hero */}
      <section className="border-b border-ui">
        {/* Breadcrumb trail renders site-wide via SiteFrame > Breadcrumbs */}
        <div className="max-w-[1148px] mx-auto px-4 pt-10 pb-16 md:pb-20">
          <span className="inline-flex items-center rounded-full bg-brand-soft text-brand font-mono text-xs font-semibold uppercase tracking-[0.14em] px-3 py-1 mb-5">
            {page.eyebrow}
          </span>
          <h1 className="text-display max-w-[820px]">
            {page.heading}
            <span className="text-brand">.</span>
          </h1>
          <p className="mt-6 text-body-lead text-muted max-w-[680px]">{page.lead}</p>
          <CtaButtons />
        </div>
      </section>

      {industryLogos?.length ? <ClientLogoSection logos={industryLogos} /> : null}

      {/* Approach */}
      <section className="border-b border-ui">
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
          <Eyebrow>{page.approachEyebrow ?? 'Our approach'}</Eyebrow>
          <h2 className="text-section-h2 mb-10">{page.approachHeading}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {page.approach.map((a, i) => (
              <div key={a.title} className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
                <div className="font-mono text-xs font-semibold text-brand mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
          <Eyebrow>{page.servicesEyebrow ?? 'Services'}</Eyebrow>
          <h2 className="text-section-h2 mb-10">{page.servicesHeading}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {page.services.map((s) => (
              <div key={s.title} className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Child pages */}
      {page.children && page.children.length > 0 && (
        <section className="border-b border-ui">
          <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
            <Eyebrow>{page.childrenEyebrow ?? 'Explore'}</Eyebrow>
            <h2 className="text-section-h2 mb-10">
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
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-brand transition-colors">
                      {c.label}
                    </h3>
                    {c.description && (
                      <p className="text-sm text-muted leading-relaxed">{c.description}</p>
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
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
          <Eyebrow>Geographic coverage</Eyebrow>
          <h2 className="text-section-h2 mb-10">
            Delivered locally across three regions.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GEO_REGIONS.map((g) => (
              <div key={g.region} className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6">
                <div className="text-2xl mb-3" aria-hidden>{g.flag}</div>
                <h3 className="text-lg font-semibold">{g.region}</h3>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mt-1 mb-3">
                  {g.cities}
                </p>
                <p className="text-sm text-muted leading-relaxed">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice leader */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
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
              <p className="mt-3 text-sm text-muted leading-relaxed">{PRACTICE_LEADER.bio}</p>
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

import Link from 'next/link'
import {
  DISCOVERY_CALL_URL,
  withPracticeSharedCopy,
  withPracticeTemplateCopy,
  type PracticePage,
} from '@/data/practicePages/types'
import { ATLASSIAN_DEEP_DIVES, ATLASSIAN_SERVICE_ANCHORS } from '@/data/practicePages/atlassianDeepDives'
import FaqAccordion from '@/components/sections/FaqAccordion'
import PartnerBadgeRow from '@/components/sections/PartnerBadgeRow'
import ClosingCtaSection from '@/components/sections/ClosingCtaSection'
import AuditCtaBanner from '@/components/sections/AuditCtaBanner'
import CalendlySection from '@/components/sections/CalendlySection'
import { getFaqItemsForPageStrict, getClosingCtaForPage } from '@/sanity/queries'
import { groupFaqsIntoTabs } from '@/sanity/groupFaqs'
import { atlassianFaqTabs } from './faqTabs'

/**
 * /atlassian-consulting after the Atlassian merge (monday 2899845035): the hub
 * plus the four retired leaf pages as in-page deep dives. Same building blocks
 * as PracticePageTemplate (which the other practice routes keep), laid out as
 * the Claude Design spec draws it: 14 sections, white and Cool Paper
 * alternating, the service cards jumping to #jira, #confluence, #jsm and
 * #migration.
 */

const CARD = 'rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised p-6'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
      {children}
    </p>
  )
}

function NumberedCards({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((a, i) => (
        <div key={a.title} className={CARD}>
          <div className="font-mono text-xs font-semibold text-brand mb-3">
            {String(i + 1).padStart(2, '0')}
          </div>
          <h3 className="text-card-title mb-2">{a.title}</h3>
          <p className="text-body-sm text-muted">{a.body}</p>
        </div>
      ))}
    </div>
  )
}

export default async function AtlassianConsultingPage({ page: content }: { page: PracticePage }) {
  const page = withPracticeTemplateCopy(withPracticeSharedCopy(content))
  const pageKey = page.path.replace(/^\//, '')
  const [centralFaqs, closingCta] = await Promise.all([
    getFaqItemsForPageStrict(pageKey),
    getClosingCtaForPage(pageKey),
  ])
  const faqTabs = atlassianFaqTabs(page, centralFaqs, groupFaqsIntoTabs)
  // Each service card jumps to its deep dive, whatever href the document holds.
  const services = page.services.map((s, i) => ({ ...s, href: ATLASSIAN_SERVICE_ANCHORS[i] ?? s.href }))

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      {/* 1. Hero: copy left, the service list right on desktop only */}
      <section className="hero-band border-b border-ui">
        <div className="site-container pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-16 lg:items-center">
            <div className="min-w-0">
              <PartnerBadgeRow explicitOnly className="mb-6" />
              <h1 className="text-display">
                {page.heading}
                <span className="text-brand">.</span>
              </h1>
              <p className="mt-5 text-body-lead text-muted max-w-[60ch]">{page.lead}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Same tab on purpose: a `target` opts the link out of the
                    in-page scroll to #book (see inPageBooking.ts). */}
                <a href={DISCOVERY_CALL_URL} className="cta-btn cta-btn-primary">
                  {page.primaryCtaLabel} →
                </a>
                <a href="#faq" className="cta-btn cta-btn-outline">
                  Common questions
                </a>
              </div>
            </div>
            {services.length > 0 && (
              <nav
                aria-label={page.servicesEyebrow}
                className={`hidden lg:block ${CARD}`}
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-2">
                  {page.servicesEyebrow}
                </p>
                <ul className="divide-y divide-dashed divide-ui">
                  {services.map((s) => (
                    <li key={s.title}>
                      <a
                        href={s.href ?? '#services'}
                        className="flex min-h-11 items-center justify-between gap-4 py-2.5 text-[15px] font-medium text-body hover:text-brand transition-colors"
                      >
                        {s.title}
                        <span aria-hidden className="text-brand">&rarr;</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* 2. Approach */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="site-container section-y">
          <Eyebrow>{page.approachEyebrow}</Eyebrow>
          <h2 className="text-section-h2 mb-8 md:mb-10">{page.approachHeading}</h2>
          <NumberedCards items={page.approach} />
        </div>
      </section>

      {/* 3. Services: each card jumps to its deep dive below */}
      <section id="services" className="border-b border-ui scroll-mt-24">
        <div className="site-container section-y">
          <Eyebrow>{page.servicesEyebrow}</Eyebrow>
          <h2 className="text-section-h2 mb-8 md:mb-10">{page.servicesHeading}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <a
                key={s.title}
                href={s.href ?? '#services'}
                className={`group ${CARD} flex items-start justify-between gap-4 hover:ring-brand transition-colors`}
              >
                <div>
                  <h3 className="text-card-title mb-2 group-hover:text-brand transition-colors">{s.title}</h3>
                  <p className="text-body-sm text-muted">{s.body}</p>
                </div>
                <span aria-hidden className="text-brand text-xl shrink-0 mt-0.5">&darr;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4 to 7. The four deep dives, one per retired leaf page */}
      {ATLASSIAN_DEEP_DIVES.map((d, i) => (
        <section
          key={d.id}
          id={d.id}
          className={`border-b border-ui scroll-mt-24 ${i % 2 === 0 ? 'bg-surface-subtle' : ''}`}
        >
          <div className="site-container section-y">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2 className="text-section-h2 max-w-[28ch]">{d.heading}</h2>
            <p className="mt-5 text-body-lead text-muted max-w-[60ch]">{d.lead}</p>

            <h3 className="text-card-title md:text-2xl mt-10 mb-6 md:mt-12">{d.stepsHeading}</h3>
            <NumberedCards items={d.steps} />

            <h3 className="text-card-title md:text-2xl mt-10 mb-6 md:mt-12">{d.cardsHeading}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {d.cards.map((c) => (
                <div key={c.title} className={CARD}>
                  <h4 className="text-card-title mb-2">{c.title}</h4>
                  <p className="text-body-sm text-muted">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* 8. Go deeper: the partner page and the packages */}
      {page.children && page.children.length > 0 && (
        <section className="border-b border-ui bg-surface-subtle">
          <div className="site-container section-y">
            <Eyebrow>{page.childrenEyebrow}</Eyebrow>
            <h2 className="text-section-h2 mb-8 md:mb-10">{page.childrenHeading}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {page.children.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className={`group ${CARD} flex items-start justify-between gap-4 hover:ring-brand transition-colors`}
                >
                  <div>
                    <h3 className="text-card-title mb-1 group-hover:text-brand transition-colors">{c.label}</h3>
                    {c.description && <p className="text-body-sm text-muted">{c.description}</p>}
                  </div>
                  <span aria-hidden className="text-brand text-xl shrink-0 mt-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Mid-page conversion banner, shared site-wide */}
      <AuditCtaBanner />

      {/* 10. Geographic coverage */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="site-container section-y">
          <Eyebrow>{page.coverageEyebrow}</Eyebrow>
          <h2 className="text-section-h2 mb-8 md:mb-10">{page.coverageHeading}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {page.coverageRegions.map((g) => (
              <div key={g.region} className={CARD}>
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

      {/* 11. Practice leader */}
      <section className="border-b border-ui">
        <div className="site-container section-y">
          <Eyebrow>{page.leaderEyebrow}</Eyebrow>
          <div className="grid md:grid-cols-[1fr_1.6fr] gap-10 items-start">
            <h2 className="text-section-h2">{page.leaderHeading}</h2>
            <div>
              <p className="text-base font-semibold">
                {page.leaderName}
                <span className="text-muted font-normal"> · {page.leaderTitle}</span>
              </p>
              <p className="mt-3 text-body-sm text-muted">{page.leaderBio}</p>
              <p className="mt-4 text-base font-medium text-body">{page.leaderPull}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {page.leaderBadges.map((b) => (
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

      {/* 12. Booking: gives the page its own #book */}
      <CalendlySection heading={page.bookingHeading} subheading={page.bookingSubheading} />

      {/* 13. FAQ: one consolidated list (FaqAccordion emits the FAQPage JSON-LD and #faq) */}
      <div className="border-b border-ui">
        <FaqAccordion heading={page.faqHeading} contactLead={page.faqContactLead} tabs={faqTabs} />
      </div>

      {/* 14. Closing CTA: Sanity copy wins, the previous hardcoded copy is the fallback */}
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

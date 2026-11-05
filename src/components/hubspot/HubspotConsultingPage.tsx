import {
  DISCOVERY_CALL_URL,
  withPracticeSharedCopy,
  withPracticeTemplateCopy,
  type PracticePage,
} from '@/data/practicePages/types'
import { HUBSPOT_DEEP_DIVES, HUBSPOT_SERVICE_ANCHORS } from '@/data/practicePages/hubspotDeepDives'
import FaqAccordion from '@/components/sections/FaqAccordion'
import PartnerBadgeRow from '@/components/sections/PartnerBadgeRow'
import ClosingCtaSection from '@/components/sections/ClosingCtaSection'
import AuditCtaBanner from '@/components/sections/AuditCtaBanner'
import CalendlySection from '@/components/sections/CalendlySection'
import CardRail from '@/components/common/CardRail'
import { getFaqItemsForPageStrict, getClosingCtaForPage } from '@/sanity/queries'
import { HUBSPOT_FAQ_PAGE_KEYS, hubspotFaqTabs } from './faqTabs'

/**
 * /hubspot-consulting after the HubSpot merge (monday 2900266080): the hub
 * plus the four retired leaf pages as in-page sections, laid out as the
 * Claude Design spec draws it. Hero, approach, the service line (each card
 * jumps to #implementation, #breeze-ai, #integration or #migration), the four
 * sections alternating white and Cool Paper, audit banner, coverage, practice
 * leader, booking, one 29 question FAQ and the closing CTA.
 * PracticePageTemplate is unchanged for the other practice routes.
 */

const PANEL = 'min-w-0 rounded-tile ring-1 ring-ui bg-surface-raised p-6'
const CARD = `${PANEL} h-full`
const GRID_GAP = 'gap-4 lg:gap-[22px]'

/** The spec's audit banner copy: the shared default with a hyphen for the dash. */
const AUDIT_BODY =
  'Book a complimentary 30-minute audit with a Fruition consultant - we will map your workflows, spot the automation wins and show you what the build looks like.'

function Eyebrow({ children, className = 'mb-3' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand ${className}`}>
      {children}
    </p>
  )
}

function CardNumber({ n }: { n: number }) {
  return <div className="font-mono text-xs font-medium text-brand mb-3">{String(n + 1).padStart(2, '0')}</div>
}

function NumberedCards({
  items,
  columns,
  Heading,
}: {
  items: { title: string; body: string }[]
  columns: string
  Heading: 'h3' | 'h4'
}) {
  return (
    <div className={`grid ${GRID_GAP} ${columns}`}>
      {items.map((a, i) => (
        <div key={a.title} className={CARD}>
          <CardNumber n={i} />
          <Heading className="text-card-title mb-2">{a.title}</Heading>
          <p className="text-body-sm text-muted">{a.body}</p>
        </div>
      ))}
    </div>
  )
}

export default async function HubspotConsultingPage({ page: content }: { page: PracticePage }) {
  const page = withPracticeTemplateCopy(withPracticeSharedCopy(content))
  const [closingCta, ...centralFaqs] = await Promise.all([
    getClosingCtaForPage('hubspot-consulting'),
    ...HUBSPOT_FAQ_PAGE_KEYS.map((key) => getFaqItemsForPageStrict(key)),
  ])
  const faqTabs = hubspotFaqTabs(page, centralFaqs)
  // Each service card jumps to its section, whatever href the document holds.
  const services = page.services.map((s, i) => ({ ...s, href: HUBSPOT_SERVICE_ANCHORS[i] ?? s.href ?? '#services' }))

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      {/* 1. Hero: copy left, the service list right on desktop only */}
      <section className="hero-band">
        <div className="site-container pt-6 pb-14 md:pt-14 md:pb-18 lg:pb-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
            <div className="min-w-0">
              <PartnerBadgeRow explicitOnly className="mb-6" />
              <h1 className="text-display md:max-w-[682px]">
                {page.heading}
                <span className="text-brand">.</span>
              </h1>
              <p className="mt-7 text-body-lead text-muted max-w-[58ch]">{page.lead}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
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
              <nav aria-label={page.servicesEyebrow} className={`hidden lg:block ${PANEL}`}>
                <Eyebrow className="mb-1.5">{page.servicesEyebrow}</Eyebrow>
                <ul className="divide-y divide-dashed divide-ui">
                  {services.map((s) => (
                    <li key={s.title}>
                      <a
                        href={s.href}
                        className="flex min-h-11 items-center justify-between gap-4 text-[15px] font-medium text-body hover:text-brand transition-colors"
                      >
                        {s.title}
                        <span aria-hidden className="text-brand text-lg">&rarr;</span>
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
      <section className="border-b border-ui">
        <div className="site-container section-y">
          <Eyebrow>{page.approachEyebrow}</Eyebrow>
          <h2 className="text-section-h2 mb-6 md:mb-8 lg:mb-10">{page.approachHeading}</h2>
          <NumberedCards items={page.approach} columns="md:grid-cols-3" Heading="h3" />
        </div>
      </section>

      {/* 3. The service line: each card jumps to its section below */}
      <section id="services" className="border-b border-ui bg-surface-subtle scroll-mt-24">
        <div className="site-container section-y">
          <Eyebrow>{page.servicesEyebrow}</Eyebrow>
          <h2 className="text-section-h2 mb-6 md:mb-8 lg:mb-10">{page.servicesHeading}</h2>
          <CardRail
            label={page.servicesHeading}
            count={services.length}
            className={`md:grid-cols-2 ${GRID_GAP}`}
            stackedClassName={`grid md:grid-cols-2 ${GRID_GAP}`}
          >
            {services.map((s, i) => (
              <a
                key={s.title}
                href={s.href}
                className={`group ${CARD} flex flex-col hover:ring-brand transition-colors`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-brand">{String(i + 1).padStart(2, '0')}</span>
                  <span aria-hidden className="text-brand text-xl leading-none">&darr;</span>
                </div>
                <h3 className="text-card-title mb-2 group-hover:text-brand transition-colors">{s.title}</h3>
                <p className="text-body-sm text-muted">{s.body}</p>
              </a>
            ))}
          </CardRail>
        </div>
      </section>

      {/* 4 to 7. The four retired leaf pages, white and Cool Paper alternating */}
      {HUBSPOT_DEEP_DIVES.map((d, i) => (
        <section
          key={d.id}
          id={d.id}
          className={`border-b border-ui scroll-mt-24 ${i % 2 === 1 ? 'bg-surface-subtle' : ''}`}
        >
          <div className="site-container section-y">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2 className="text-section-h2 max-w-[18em]">{d.heading}</h2>
            <p className="mt-5 text-body-lead text-muted max-w-[62ch]">{d.lead}</p>

            <h3 className="text-card-title lg:text-2xl mt-10 mb-6 md:mt-12 lg:mt-14">{d.stepsHeading}</h3>
            <NumberedCards items={d.steps} columns="md:grid-cols-3" Heading="h4" />

            <Eyebrow className="mt-10 mb-3 md:mt-12 lg:mt-14">{d.cardsEyebrow}</Eyebrow>
            <h3 className="text-card-title lg:text-2xl mb-6">{d.cardsHeading}</h3>
            <NumberedCards items={d.cards} columns="md:grid-cols-2 lg:grid-cols-4" Heading="h4" />
          </div>
        </section>
      ))}

      {/* 8. Mid-page conversion banner, shared site-wide */}
      <AuditCtaBanner body={AUDIT_BODY} />

      {/* 9. Geographic coverage */}
      <section className="border-y border-ui bg-surface-subtle">
        <div className="site-container section-y">
          <Eyebrow>{page.coverageEyebrow}</Eyebrow>
          <h2 className="text-section-h2 mb-6 md:mb-8 lg:mb-10">{page.coverageHeading}</h2>
          <div className={`grid ${GRID_GAP} md:grid-cols-3`}>
            {page.coverageRegions.map((g) => (
              <div key={g.region} className={CARD}>
                <div className="text-xl leading-none mb-5" aria-hidden>{g.flag}</div>
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

      {/* 10. Practice leader */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="site-container section-y">
          <div className="grid items-start gap-5 md:gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
            <div className="min-w-0">
              <Eyebrow>{page.leaderEyebrow}</Eyebrow>
              <h2 className="text-section-h2 md:max-w-[14em] lg:max-w-[10em]">{page.leaderHeading}</h2>
            </div>
            <div className="min-w-0 lg:pt-5">
              <p className="text-base font-semibold">
                {page.leaderName}
                <span className="text-muted font-normal"> · {page.leaderTitle}</span>
              </p>
              <p className="mt-3.5 text-body-sm text-muted">{page.leaderBio}</p>
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

      {/* 11. Booking: the real scheduler, which gives the page its own #book */}
      <CalendlySection heading={page.bookingHeading} subheading={page.bookingSubheading} />

      {/* 12. FAQ: one merged list (FaqAccordion emits the FAQPage JSON-LD and #faq) */}
      <div className="border-b border-ui">
        <FaqAccordion heading={page.faqHeading} contactLead={page.faqContactLead} tabs={faqTabs} />
      </div>

      {/* 13. Closing CTA: Sanity copy wins, the previous hardcoded copy is the fallback */}
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

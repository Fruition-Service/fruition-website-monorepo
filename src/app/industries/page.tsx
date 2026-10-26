import type { Metadata } from 'next'
import Link from 'next/link'
import { HubCardGrid, HubChips, HubHero, HubSection } from '@/components/hubs/HubSections'
import FaqAccordion from '@/components/sections/FaqAccordion'
import CalendlySection from '@/components/sections/CalendlySection'
import ClosingCtaSection from '@/components/sections/ClosingCtaSection'
import { INDUSTRIES_HUB as hub } from '@/data/hubs/industries'
import { INDUSTRIES_PAGES } from '@/data/practicePages/industries'
import { DISCOVERY_CALL_URL } from '@/data/practicePages/types'
import { getClosingCtaForPage, getFaqItemsForPageStrict } from '@/sanity/queries'
import { groupFaqsIntoTabs } from '@/sanity/groupFaqs'
import { buildOgMetadata } from '@/lib/metadata'
import { collectionPageJsonLd, jsonLdScript } from '@/lib/collectionSchema'

export const metadata: Metadata = {
  title: hub.seoTitle,
  description: hub.seoDescription,
  alternates: { canonical: hub.path },
  ...buildOgMetadata({ title: hub.seoTitle, description: hub.seoDescription, path: hub.path }),
}

export default async function IndustriesHubPage() {
  const [centralFaqs, closingCta] = await Promise.all([
    getFaqItemsForPageStrict(hub.pageKey),
    getClosingCtaForPage(hub.pageKey),
  ])
  // Central Sanity FAQs win; the previous hub's own list is the fallback.
  const faqTabs = centralFaqs?.length
    ? groupFaqsIntoTabs(centralFaqs)
    : [
        {
          label: 'General Questions',
          items: INDUSTRIES_PAGES.hub.faqs.map((f) => ({ question: f.q, answer: f.a })),
        },
      ]

  const jsonLd = collectionPageJsonLd({
    path: hub.path,
    name: 'Industries',
    description: hub.seoDescription,
    items: [...hub.sectors.map((s) => ({ name: s.title, href: s.href })), ...hub.also.map((a) => ({ name: a.label, href: a.href }))],
  })

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      <HubHero eyebrow={hub.eyebrow} heading={hub.heading} accent={hub.accent} lead={hub.lead} facts={hub.facts} />

      <HubSection eyebrow="Sectors" heading={hub.sectorsHeading} subtle>
        <HubCardGrid cards={hub.sectors} columns={3} />
        <p className="mt-8 text-muted">
          Also:{' '}
          {hub.also.map((a, i) => (
            <span key={a.href}>
              {i > 0 && ' · '}
              <Link href={a.href} className="font-semibold text-brand hover:text-brand-dark">
                {a.label}
              </Link>
            </span>
          ))}
        </p>
      </HubSection>

      <HubSection eyebrow="Use case hub" heading={hub.useCasesHeading} lede={hub.useCasesLede}>
        <HubChips chips={hub.useCases} />
      </HubSection>

      {/* Gives the page its own #book, so the booking CTAs scroll here. */}
      <CalendlySection
        heading="Let's design the way your business should run."
        subheading="30 minutes. No obligation. Speak to a consultant, not a salesperson."
      />

      {/* Renders its own FAQPage JSON-LD and #faq anchor */}
      <div className="border-b border-ui">
        <FaqAccordion heading="Frequently asked questions" tabs={faqTabs} />
      </div>

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

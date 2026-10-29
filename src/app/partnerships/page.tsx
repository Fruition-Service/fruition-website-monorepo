import type { Metadata } from 'next'
import { HubCardGrid, HubChips, HubHero, HubPickPanel, HubSection } from '@/components/hubs/HubSections'
import FaqAccordion from '@/components/sections/FaqAccordion'
import CalendlySection from '@/components/sections/CalendlySection'
import { PARTNERS_HUB as page } from '@/data/hubs/partners'
import { buildOgMetadata } from '@/lib/metadata'
import { collectionPageJsonLd, jsonLdScript } from '@/lib/collectionSchema'

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.seoDescription,
  alternates: { canonical: page.path },
  ...buildOgMetadata({ title: page.seoTitle, description: page.seoDescription, path: page.path }),
}

export default function PartnershipsHubPage() {
  const jsonLd = collectionPageJsonLd({
    path: page.path,
    name: 'Technology partners',
    description: page.seoDescription,
    items: page.core.map((c) => ({ name: c.title, href: c.href })),
  })

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      <HubHero eyebrow={page.eyebrow} heading={page.heading} accent={page.accent} lead={page.lead} facts={page.facts} />

      <HubSection eyebrow="Core partners" heading={page.coreHeading} lede={page.coreLede} subtle>
        <HubCardGrid cards={page.core} columns={3} label="Core partners" />
      </HubSection>

      <HubPickPanel {...page.pick} />

      <HubSection eyebrow="Also delivered" heading={page.othersHeading} lede={page.othersLede} subtle>
        <HubChips chips={page.others} />
      </HubSection>

      {/* Gives the page its own #book, so the booking CTAs scroll here. */}
      <CalendlySection
        heading="Let's design the way your business should run."
        subheading="30 minutes. No obligation. Speak to a consultant, not a salesperson."
      />

      {/* Renders its own FAQPage JSON-LD and #faq anchor */}
      <div className="border-b border-ui">
        <FaqAccordion heading="Partner FAQs" tabs={[{ label: 'Partners', items: page.faqs }]} />
      </div>
    </div>
  )
}

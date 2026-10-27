import type { Metadata } from 'next'
import { HubHero, HubSection } from '@/components/hubs/HubSections'
import ClosingCtaSection from '@/components/sections/ClosingCtaSection'
import { SERVICES_CARDS, SERVICES_HUB as hub } from '@/data/hubs/services'
import { DISCOVERY_CALL_URL } from '@/data/practicePages/types'
import { getClosingCtaForPage } from '@/sanity/queries'
import { buildOgMetadata } from '@/lib/metadata'
import { collectionPageJsonLd, jsonLdScript } from '@/lib/collectionSchema'
import MethodBand from './MethodBand'
import ServiceCards from './ServiceCards'

export const metadata: Metadata = {
  title: hub.seoTitle,
  description: hub.seoDescription,
  alternates: { canonical: hub.path },
  ...buildOgMetadata({ title: hub.seoTitle, description: hub.seoDescription, path: hub.path }),
}

export default async function WhatWeDoPage() {
  const closingCta = await getClosingCtaForPage(hub.pageKey)

  const jsonLd = collectionPageJsonLd({
    path: hub.path,
    name: 'What we do',
    description: hub.seoDescription,
    items: SERVICES_CARDS.map((card) => ({ name: card.title, href: card.href })),
  })

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      <HubHero eyebrow={hub.eyebrow} heading={hub.heading} lead={hub.lead} facts={hub.facts} />

      <HubSection eyebrow="Capabilities" heading={hub.servicesHeading} subtle>
        <ServiceCards />
      </HubSection>

      <HubSection eyebrow="The Fruition method" heading="Process before platform.">
        <MethodBand />
      </HubSection>

      <ClosingCtaSection
        cta={closingCta}
        fallback={{ ...hub.closingFallback, primaryUrl: DISCOVERY_CALL_URL }}
      />
    </div>
  )
}

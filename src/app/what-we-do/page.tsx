import type { Metadata } from 'next'
import CtaButton from '@/components/CtaButton'
import CapabilityBlocksSection from '@/components/sections/CapabilityBlocksSection'
import ClosingCtaSection from '@/components/sections/ClosingCtaSection'
import StatMetricBanner from '@/components/sections/StatMetricBanner'
import { STATS } from '@/components/home/data'
import { SERVICE_PRACTICES, SERVICES_HUB as hub } from '@/data/hubs/services'
import { DISCOVERY_CALL_URL } from '@/data/practicePages/types'
import { getClosingCtaForPage } from '@/sanity/queries'
import { buildOgMetadata } from '@/lib/metadata'
import { collectionPageJsonLd, jsonLdScript } from '@/lib/collectionSchema'

export const metadata: Metadata = {
  title: hub.seoTitle,
  description: hub.seoDescription,
  alternates: { canonical: hub.path },
  ...buildOgMetadata({ title: hub.seoTitle, description: hub.seoDescription, path: hub.path }),
}

const STAT_METRICS = STATS.map((stat) => ({ value: stat.value, text: stat.label }))

/**
 * The services hub: all six practices in one place, in the order the home page
 * presents them, each linking to the page that covers it in depth.
 */
export default async function WhatWeDoPage() {
  const closingCta = await getClosingCtaForPage(hub.pageKey)

  const jsonLd = collectionPageJsonLd({
    path: hub.path,
    name: 'What we do',
    description: hub.seoDescription,
    items: SERVICE_PRACTICES.map((practice) => ({
      name: practice.title,
      href: practice.href,
    })),
  })

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      {/* Hero, on the same treatment as /ai-capability-assessment: mono eyebrow,
          one display heading, a lead and the CTA pair on a paper gradient. */}
      <section className="border-b border-ui bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-subtle)_100%)]">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-10 pb-14 md:pb-20 lg:pb-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {hub.eyebrow}
          </p>
          <h1 className="text-display mt-4 max-w-[900px] text-balance">
            {hub.heading} <span className="text-brand">{hub.headingAccent}</span>
          </h1>
          <p className="text-body-lead mt-6 max-w-[60ch] text-muted">{hub.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            <CtaButton href={DISCOVERY_CALL_URL} label="Book a discovery call" variant="primary" />
            <CtaButton href="/contact-us" label="Talk to us" variant="outline" />
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {hub.facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-ui bg-surface-raised px-3.5 py-1.5 text-[13px] font-semibold text-body"
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CapabilityBlocksSection
        eyebrow={hub.practicesEyebrow}
        heading={hub.practicesHeading}
        lead={hub.practicesLead}
        blocks={SERVICE_PRACTICES.slice(0, 3)}
        columns={3}
        theme="light"
      />

      <StatMetricBanner statement={hub.statsStatement} metrics={STAT_METRICS} />

      <CapabilityBlocksSection
        eyebrow={hub.runEyebrow}
        heading={hub.runHeading}
        lead={hub.runLead}
        blocks={SERVICE_PRACTICES.slice(3)}
        columns={3}
        theme="tint"
      />

      <ClosingCtaSection
        cta={closingCta}
        fallback={{ ...hub.closingFallback, primaryUrl: DISCOVERY_CALL_URL }}
      />
    </div>
  )
}

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { getSiteSettings } from "@/sanity/queries"
import { getIndustryLogos, resolveIndustryLogos } from "@/sanity/industryLogos"
import { bookingHref } from "@/lib/bookingLink"
import { buildOgMetadata } from "@/lib/metadata"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import { getIndustryUseCases, getUseCaseIndex } from "@/features/ai-use-cases/data"
import { landingPagesFor } from "@/features/ai-use-cases/featured"
import { industryHref, caseAnchorHref, USE_CASES_PATH } from "@/features/ai-use-cases/types"
import UseCasesHero from "@/components/ai-use-cases/UseCasesHero"
import IndustryGrid from "@/components/ai-use-cases/IndustryGrid"
import UseCaseExplorer from "@/components/ai-use-cases/UseCaseExplorer"
import JsonLd, { SITE_URL } from "@/components/ai-use-cases/JsonLd"
import SectionIntro from "@/components/sections/SectionIntro"
import ClientLogoSection from "@/components/sections/ClientLogoSection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import ClosingCtaSection from "@/components/sections/ClosingCtaSection"
import CalendlySection from "@/components/sections/CalendlySection"

/**
 * /ai-use-cases/<industry>: every use case in one industry, each with its
 * build (process, boards, automations, integrations) server-rendered into a
 * dialog. Copy is the catalogue draft's, verbatim.
 */

// Not `dynamicParams = false`: on OpenNext a cold incremental cache then
// throws NoFallbackError and 404s even the prerendered industries. Unknown
// slugs 404 through notFound() below instead.

/** Industry logo sets (src/sanity/industryLogos.ts) for the catalogue industries that have one. */
const LOGO_KEYS: Record<string, string> = {
  construction: "construction",
  manufacturing: "manufacturing",
  government: "government",
  healthcare: "healthcare",
  "real-estate": "real-estate",
  "professional-services": "professional-services",
  "financial-services": "financial-services",
  "education-nonprofit": "education",
  "retail-ecommerce": "retail",
}

type Params = Promise<{ industry: string }>

export async function generateStaticParams() {
  const index = await getUseCaseIndex()
  return index.industries.map((i) => ({ industry: i.slug }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { industry } = await params
  const data = await getIndustryUseCases(industry)
  if (!data) return {}
  const path = industryHref(data.slug)
  return {
    alternates: { canonical: path },
    title: data.seoTitle,
    description: data.seoDescription,
    ...buildOgMetadata({ title: data.seoTitle, description: data.seoDescription, path }),
  }
}

/** The timeframe given most often, or undefined when none is recorded. */
function commonTimeframe(timeframes: (string | undefined)[]): string | undefined {
  const counts = new Map<string, number>()
  for (const t of timeframes) if (t) counts.set(t, (counts.get(t) ?? 0) + 1)
  let best: string | undefined
  for (const [t, n] of counts) if (!best || n > (counts.get(best) ?? 0)) best = t
  return best
}

export default async function Page({ params }: { params: Params }) {
  const { industry } = await params
  const [data, index, siteSettings, industryLogos] = await Promise.all([
    getIndustryUseCases(industry),
    getUseCaseIndex(),
    getSiteSettings(),
    LOGO_KEYS[industry] ? getIndustryLogos(LOGO_KEYS[industry]) : Promise.resolve(null),
  ])
  if (!data) notFound()

  const rawCalendly = siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const booking = bookingHref(rawCalendly)
  const timeframe = commonTimeframe(data.useCases.map((u) => u.timeframe))
  const landingPages = landingPagesFor(data.slug)
  const others = index.industries.filter((i) => i.slug !== data.slug)
  const pageUrl = `${SITE_URL}${industryHref(data.slug)}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: data.seoTitle,
    isPartOf: { "@id": `${SITE_URL}${USE_CASES_PATH}#page` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.useCases.length,
      itemListElement: data.useCases.map((u, n) => ({
        "@type": "ListItem",
        position: n + 1,
        url: `${SITE_URL}${caseAnchorHref(data.slug, u.id)}`,
        name: `${u.title}: ${data.name}`,
        description: u.summary,
      })),
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <UseCasesHero
        eyebrow="AI use cases"
        heading={data.heading}
        lead={data.intro}
        primary={{ label: "Book a discovery call", href: booking }}
        secondary={{ label: "All industries", href: `${USE_CASES_PATH}#industries` }}
        stats={[
          { value: String(data.count), label: "use cases" },
          { value: String(data.aiCount), label: "with an AI step" },
          ...(timeframe ? [{ value: timeframe, label: "most common timeframe" }] : []),
        ]}
      />

      <section id="explore" className="scroll-mt-24 bg-surface-subtle px-4 py-14 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Use case catalogue
          </p>
          <UseCaseExplorer
            details={data.useCases}
            industries={index.industries}
            departments={index.departments}
            solutionTypes={index.solutionTypes}
            bookingHref={booking}
          />
          {landingPages.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-3">
              {landingPages.map((p) => (
                <li key={p.path}>
                  <Link
                    href={p.path}
                    className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-surface-raised px-5 text-[15px] font-semibold text-body ring-1 ring-ui transition-colors hover:text-brand hover:ring-brand-light"
                  >
                    {p.label}
                    <ArrowRight size={16} aria-hidden className="text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <ClientLogoSection logos={resolveIndustryLogos(industryLogos, siteSettings?.carouselLogos)} />

      {data.faq.length > 0 && (
        <FaqAccordion
          heading={`${data.name}: common questions`}
          tabs={[{ label: data.name, items: data.faq }]}
        />
      )}

      <section className="bg-surface-subtle px-4 py-14 md:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionIntro eyebrow="Industries" heading="Other industries" align="left" />
          <div className="mt-10">
            <IndustryGrid industries={others} />
          </div>
        </div>
      </section>

      <ClosingCtaSection
        fallback={{
          heading: "Ready to scale your workflows?",
          lead: "Tell us the process you want to fix. If it isn't here yet, it's likely our next build.",
          primaryLabel: "Book a Free Consultation",
          primaryUrl: booking,
        }}
      />

      <CalendlySection calendlyUrl={rawCalendly} />
    </>
  )
}

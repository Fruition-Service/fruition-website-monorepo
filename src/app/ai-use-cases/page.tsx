import { getSiteSettings } from "@/sanity/queries"
import { bookingHref } from "@/lib/bookingLink"
import { buildOgMetadata } from "@/lib/metadata"
import { FALLBACK_BOOKING_URL } from "@/lib/regionBooking"
import { getAllUseCases, getUseCaseIndex } from "@/features/ai-use-cases/data"
import { industryHref, toTile, USE_CASES_PATH } from "@/features/ai-use-cases/types"
import UseCasesHero from "@/components/ai-use-cases/UseCasesHero"
import IndustryGrid from "@/components/ai-use-cases/IndustryGrid"
import UseCaseExplorer, { UseCaseFilterLink } from "@/components/ai-use-cases/UseCaseExplorer"
import JsonLd, { SITE_URL } from "@/components/ai-use-cases/JsonLd"
import SectionIntro from "@/components/sections/SectionIntro"
import ClientLogoSection from "@/components/sections/ClientLogoSection"
import NumberedStepList from "@/components/common/NumberedStepList"
import FaqAccordion from "@/components/sections/FaqAccordion"
import ClosingCtaSection from "@/components/sections/ClosingCtaSection"
import CalendlySection from "@/components/sections/CalendlySection"

/**
 * /ai-use-cases: the catalogue of real Fruition builds, filterable by
 * industry, department and solution type. Copy is Josh's catalogue draft
 * (v4), verbatim; counts are computed from the imported data so they cannot
 * drift from it. Data: public/data/ai-use-cases (scripts/import-ai-use-cases.mjs).
 */

const TITLE = "Fruition AI & Software Solutions by Industry | Use Cases"

export async function generateMetadata() {
  const index = await getUseCaseIndex()
  const description = `${index.total} AI and monday.com use cases across ${index.industries.length} industries. Filter by industry and team, and see the process, boards, automations and integrations behind each.`
  return {
    alternates: { canonical: USE_CASES_PATH },
    title: TITLE,
    description,
    ...buildOgMetadata({ title: TITLE, description, path: USE_CASES_PATH }),
  }
}

const BADGES = [
  "monday.com Platinum Partner",
  "Atlassian Platinum Partner",
  "HubSpot Partner",
  "OpenAI Partner",
  "Anthropic Partner",
  "Australian AI Awards Finalist 2026",
]

const METHOD = [
  { title: "Discovery", description: "Stakeholder interviews, current-state map and solution fit." },
  { title: "Design", description: "Boards, automations, AI steps and integrations agreed in writing." },
  { title: "Build", description: "Boards, dashboards, agents and connectors configured against the signed design." },
  { title: "Enablement", description: "Role-based training, runbooks and admin certification." },
  { title: "Hypercare", description: "Adoption monitoring, tuning and a clean hand-off to support." },
]

export default async function Page() {
  const [index, useCases, siteSettings] = await Promise.all([
    getUseCaseIndex(),
    getAllUseCases(),
    getSiteSettings(),
  ])
  const rawCalendly = siteSettings?.calendlyLink || FALLBACK_BOOKING_URL
  const booking = bookingHref(rawCalendly)
  const departmentCount = Object.keys(index.departments).length

  const faq = [
    {
      question: "What AI and monday.com use cases does Fruition build?",
      answer: `This catalogue holds ${index.total} use cases across ${index.industries.length} industries: CRM, project portfolios, service desks, operations systems, integrations and AI steps such as document extraction, ticket classification and meeting-to-action agents.`,
    },
    {
      question: "Are these real client use cases?",
      answer:
        "Yes. Every use case comes from a real Fruition client engagement between October 2024 and October 2026. Client names are withheld and each client is described by the kind of organisation it is.",
    },
    {
      question: "What does a Fruition build include?",
      answer:
        "Each use case shows the future-state process, the monday.com boards and modules, the automations and AI steps, the systems it connects to, and the typical timeframe for the complete build.",
    },
    {
      question: "Does Fruition use these solutions itself?",
      answer: `Yes. ${index.ownCount} of the use cases are builds that run inside Fruition, from an AI marketing agent and a discovery-call-to-proposal generator to automated contractor payroll and a Google Ads agent. We test patterns on our own business before we take them to clients.`,
    },
    {
      question: "Which AI platforms does Fruition use?",
      answer:
        "Fruition is a monday.com Platinum Partner and a partner of both Anthropic and OpenAI. Builds combine monday.com AI, Claude and OpenAI models, and orchestration tools such as n8n and Make, with monday.com as the system of record.",
    },
    {
      question: "Where does Fruition work?",
      answer:
        "Fruition works with teams across Australia, India, the Philippines, Singapore, the UK and the US, and is an approved Advanced-level supplier on the NSW Government ICT Services Scheme.",
    },
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}${USE_CASES_PATH}#page`,
    url: `${SITE_URL}${USE_CASES_PATH}`,
    name: TITLE,
    about: "AI and monday.com use cases by industry",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: index.industries.length,
      itemListElement: index.industries.map((i, n) => ({
        "@type": "ListItem",
        position: n + 1,
        url: `${SITE_URL}${industryHref(i.slug)}`,
        name: i.name,
      })),
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <UseCasesHero
        badges={BADGES}
        heading="Fruition AI and software solutions, by industry."
        headingAccent="by industry"
        lead={`A catalogue of ${index.total} real Fruition builds across ${index.industries.length} industries, ${index.aiCount} with AI steps. Filter by industry, team and solution, then select "See the build" for the process, boards, automations and integrations behind each one.`}
        primary={{ label: "Explore use cases", href: "#explore" }}
        secondary={{ label: "Book a discovery call", href: booking }}
        stats={[
          { value: String(index.total), label: "use cases" },
          { value: String(index.industries.length), label: "industries" },
          { value: String(index.aiCount), label: "with an AI step" },
          { value: String(departmentCount), label: "departments covered" },
        ]}
      />

      <ClientLogoSection logos={siteSettings?.carouselLogos ?? []} />

      <section id="industries" className="scroll-mt-24 bg-surface-subtle px-4 py-14 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionIntro
            eyebrow="Industries"
            heading="Browse by industry"
            lead="Each industry has its own page with every use case, the integrations that come up most and typical timeframes."
          />
          <div className="mt-12">
            <IndustryGrid industries={index.industries} />
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 pt-14 md:pt-20 lg:pt-24">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 rounded-card bg-tint p-6 ring-1 ring-lilac md:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[62ch]">
            <p className="mb-[18px] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              Built for ourselves first
            </p>
            <h2 className="text-section-h3 text-body text-balance">
              {index.ownCount} AI and automation builds running inside Fruition
            </h2>
            <p className="mt-4 text-body text-muted">
              Before we build it for clients, we run it on our own business: an AI marketing agent, a
              discovery-call-to-proposal generator, meeting-to-action automation, automated contractor payroll, a
              Google Ads agent, our headless website and more.
            </p>
          </div>
          <UseCaseFilterLink
            params={{ own: "1" }}
            targetId="explore"
            className="cta-btn cta-btn-primary shrink-0 self-start lg:self-center"
          >
            <span className="cta-btn-label">See our own builds</span>
          </UseCaseFilterLink>
        </div>
      </section>

      <section id="explore" className="scroll-mt-24 bg-surface px-4 py-14 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionIntro
            eyebrow="Use case catalogue"
            heading="Find a use case like yours"
            lead={`Client names are withheld. Select "See the build" on any tile for the full detail.`}
          />
          <div className="mt-12">
            <UseCaseExplorer
              tiles={useCases.map(toTile)}
              industries={index.industries}
              departments={index.departments}
              solutionTypes={index.solutionTypes}
              industryFilter
              bookingHref={booking}
            />
          </div>
        </div>
      </section>

      <section id="method" className="bg-surface-subtle px-4 py-14 md:py-20 lg:py-24">
        <div className="mx-auto flex w-full max-w-[959px] flex-col items-center gap-10">
          <SectionIntro
            eyebrow="Our method"
            heading="How a Fruition build ships"
            lead="Process before platform. Every build follows the same five phases."
          />
          <NumberedStepList items={METHOD} />
        </div>
      </section>

      <FaqAccordion heading="Questions about these use cases" tabs={[{ label: "Use cases", items: faq }]} />

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

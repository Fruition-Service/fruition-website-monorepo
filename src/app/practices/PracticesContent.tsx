import Link from "next/link"
import { Check, Minus } from "lucide-react"
import CtaButton from "@/components/CtaButton"
import ClientLogoSection from "@/components/sections/ClientLogoSection"
import ClosingCtaSection from "@/components/sections/ClosingCtaSection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import type { CarouselLogo, FaqTab } from "@/components/sections/types"
import { METHOD_STEPS, SERVICES } from "@/components/home/data"

/**
 * /practices: the six practices and the one operating model.
 *
 * The six practices are the site's own service set: the same `SERVICES` array
 * that renders the home page grid, so the two surfaces can never drift into
 * competing taxonomies. The operating model is the home page's four delivery
 * phases (`METHOD_STEPS`), given the lead copy they need on a full page.
 */
const EYEBROW = "font-mono text-[12px] font-semibold tracking-[0.14em] text-brand uppercase"

const STATS = [
  { value: "900+", label: "implementations delivered" },
  { value: "6", label: "markets covered" },
  { value: "12 weeks", label: "typical first build" },
  { value: "2026", label: "Rising Star winner" },
]

/** Body copy for each delivery phase, keyed by the phase title in METHOD_STEPS. */
const PHASE_COPY: Record<string, { body: string; produces: string }> = {
  Discover: {
    body: "Map how work runs today, where it breaks, and what the business needs the system to do. We talk to the people doing the work, not only the people who bought the tool.",
    produces: "Process map, data model, success measures.",
  },
  Design: {
    body: "Blueprint the process, the data and the integrations before anything is configured. Decisions get written down while they are still cheap to change.",
    produces: "Solution design, integration map, build plan.",
  },
  Deliver: {
    body: "Build and migrate in two-week sprints. Each sprint is reviewed against the design, so scope changes show up as a conversation rather than a surprise invoice.",
    produces: "Configured platform, migrated data, tested automations.",
  },
  Adopt: {
    body: "Train the people who will use it, run the change comms, and measure adoption after go-live. This phase is why implementations stick.",
    produces: "Trained team, adoption dashboard, handover pack.",
  },
}

const PLATFORM_FIRST = [
  "The tool is chosen in the first meeting.",
  "The process gets bent to fit a template.",
  "Integrations are discovered late, after the build.",
  "Adoption rests on one internal champion.",
]

const MODEL_FIRST = [
  "The process is mapped before a tool is named.",
  "Configuration follows the work, not a template.",
  "Integrations are scoped during design.",
  "Adoption has named owners from week one.",
]

const FAQ_TABS: FaqTab[] = [
  {
    _key: "practices",
    label: "Six practices and the operating model",
    items: [
      {
        _key: "what-are-the-six",
        question: "What are Fruition's six practices?",
        answer:
          "Platform implementation, integrations and automation, AI advisory and implementation, change management and adoption, software licence procurement, and FDE and managed services. Each one has its own page with the detail, examples and pricing.",
      },
      {
        _key: "what-is-the-operating-model",
        question: "What is the operating model?",
        answer:
          "It is the four phases every engagement runs through: discover, design, deliver and adopt, across a typical twelve week first build. The phases decide what gets built. The practices decide who builds it.",
      },
      {
        _key: "do-i-need-all-six",
        question: "Do I have to use all six practices?",
        answer:
          "No. Most clients start with one or two, usually platform implementation plus integrations or adoption. The model is the same either way, and the other practices come in when the work calls for them.",
      },
      {
        _key: "how-long",
        question: "How long does an implementation take?",
        answer:
          "A typical first build runs twelve weeks from discovery to adoption. Scope, data volume and the number of systems involved move that number, so the build plan you get in design is the one we hold ourselves to.",
      },
      {
        _key: "platforms",
        question: "Which platforms do you work with?",
        answer:
          "monday.com, Atlassian (Jira, Jira Service Management and Confluence) and HubSpot, AI implementation on Anthropic Claude, OpenAI and Microsoft Copilot, and automation on n8n. Licence procurement covers Microsoft, Google, Adobe, Atlassian and monday.com.",
      },
      {
        _key: "where",
        question: "Where do you deliver?",
        answer:
          "From Sydney, London and New York, covering Australia, the UK, the US, Singapore, India and the Philippines. Delivery follows your time zone, not ours.",
      },
    ],
  },
]

interface PracticesContentProps {
  logos?: CarouselLogo[]
}

export default function PracticesContent({ logos = [] }: PracticesContentProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pt-14 pb-14 md:pt-20 md:pb-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <div>
              <p className={EYEBROW}>What we do</p>
              <h1 className="text-display mt-5 text-ink">
                Six practices, <span className="text-brand">one operating model.</span>
              </h1>
              <p className="text-body-lead mt-6 max-w-[560px] text-muted">
                Designed to make platforms fit your business. We map how work should run before
                a tool is named, then build the platform around it.
              </p>
              <p className="text-body mt-4 max-w-[560px] text-muted">
                Fruition is a monday.com Platinum Partner with more than 900 implementations
                behind it, across Australia, the UK, the US, Singapore, India and the
                Philippines.
              </p>
              <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
                <CtaButton
                  href="/contact-us#book"
                  label="Book a 30-minute audit"
                  variant="primary"
                  className="w-full md:w-auto"
                />
                <CtaButton
                  href="#operating-model"
                  label="See the operating model"
                  variant="outline"
                  className="w-full md:w-auto"
                />
              </div>
            </div>

            {/* The model, at a glance. Detail and copy live in the section below. */}
            <div className="rounded-card border border-ui bg-surface-subtle p-5 md:p-7">
              <div className="flex items-baseline justify-between gap-4 border-b border-ui pb-4">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                  The operating model
                </p>
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  12 weeks
                </p>
              </div>
              <ol className="flex flex-col">
                {METHOD_STEPS.map((step) => (
                  <li
                    key={step.num}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-ui py-3.5 last:border-b-0"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[12px] font-semibold text-brand">
                        {step.num}
                      </span>
                      <span className="text-body font-semibold text-ink">{step.title}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Wk {step.from} to {step.to}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-ui pt-4 text-body text-muted">
                Four phases on every engagement, whichever of the six practices leads.
              </p>
            </div>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 border-t border-ui md:mt-16 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-b border-dashed border-ui py-5 pr-2 md:py-6">
                <dd className="text-[26px] font-semibold leading-none text-ink md:text-[32px]">
                  {stat.value}
                </dd>
                <dt className="mt-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The six practices */}
      <section id="practices" className="scroll-mt-24 bg-surface-subtle">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:py-24">
          <p className={EYEBROW}>The six practices</p>
          <h2 className="text-section-h2 mt-4 max-w-[760px] text-ink">
            What we do, <span className="text-brand">practice by practice.</span>
          </h2>
          <p className="text-body-lead mt-5 max-w-[640px] text-muted">
            Each practice stands alone, and most engagements draw on two or three. The detail,
            the examples and the pricing for each one live on its own page.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Link
                key={service.title}
                href={service.href}
                className="group flex h-full flex-col rounded-card border border-ui bg-surface p-6 shadow-whisper transition-colors hover:border-brand md:p-8"
              >
                <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[20px] font-semibold leading-snug text-ink md:text-[22px]">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-body text-muted">{service.body}</p>
                <span className="mt-6 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                  Explore{" "}
                  <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* One operating model */}
      <section id="operating-model" className="scroll-mt-24 bg-surface">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 py-14 md:py-24 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className={EYEBROW}>One operating model</p>
            <h2 className="text-section-h2 mt-4 text-balance text-ink">
              The same four phases, <span className="text-brand">whichever practice leads.</span>
            </h2>
            <p className="text-body mt-5 text-muted">
              A platform implementation, an AI build and a licence review all run through the
              same four phases. The phases decide what gets built. The practices decide who
              builds it and how deep the work goes.
            </p>
            <p className="text-body mt-4 text-muted">
              The model does not change by country or industry. What changes is the depth:
              regulated work adds governance and audit trails at design, and a smaller team can
              start with one practice and add the others as the system grows.
            </p>
          </div>

          <ol className="flex flex-col">
            {METHOD_STEPS.map((step) => {
              const copy = PHASE_COPY[step.title]
              return (
                <li
                  key={step.num}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-dashed border-ui py-6 last:border-b-0 md:gap-6 md:py-8"
                >
                  <span className="pt-1 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                    {step.num}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-[20px] font-semibold text-ink md:text-[22px]">
                        {step.title}
                      </h3>
                      <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                        Weeks {step.from} to {step.to}
                      </span>
                    </div>
                    <p className="mt-3 text-body text-muted">{copy?.body}</p>
                    <p className="mt-3 text-body text-ink">
                      <span className="font-semibold text-brand">What you leave with: </span>
                      {copy?.produces}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Platform first vs operating model first */}
      <section className="bg-surface-subtle">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:py-24">
          <p className={EYEBROW}>Why the model comes first</p>
          <h2 className="text-section-h2 mt-4 max-w-[760px] text-balance text-ink">
            Platform first, or <span className="text-brand">operating model first.</span>
          </h2>
          <p className="text-body-lead mt-5 max-w-[640px] text-muted">
            Both paths end with software in place. Only one ends with a system people keep using.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
            <div className="rounded-card border border-ui bg-surface p-6 md:p-8">
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Platform first
              </p>
              <ul className="mt-4 flex flex-col">
                {PLATFORM_FIRST.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-b border-dashed border-ui py-4 text-body text-muted last:border-b-0 last:pb-0"
                  >
                    <Minus size={16} className="mt-1.5 shrink-0 text-muted" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-card border border-brand bg-surface p-6 shadow-whisper md:p-8">
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                Operating model first
              </p>
              <ul className="mt-4 flex flex-col">
                {MODEL_FIRST.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-b border-dashed border-ui py-4 text-body text-ink last:border-b-0 last:pb-0"
                  >
                    <Check size={16} className="mt-1.5 shrink-0 text-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <div className="border-t border-ui bg-surface">
        <ClientLogoSection
          headingPart1="Teams who run on "
          headingAccent="systems we built."
          description="A sample of the organisations we have implemented monday.com, Atlassian, HubSpot and AI systems for."
          logos={logos}
        />
      </div>

      {/* FAQ */}
      <FaqAccordion heading="What people ask before scoping." tabs={FAQ_TABS} />

      <ClosingCtaSection
        fallback={{
          eyebrow: "Start here",
          heading: "Start with the operating model, not the tool.",
          headingAccent: "not the tool.",
          lead: "A 30-minute audit maps your current workflows and tells you which of the six practices you need first. No slide deck, no obligation.",
          primaryLabel: "Book a 30-minute audit",
          primaryUrl: "/contact-us#book",
          secondaryLabel: "See how we price work",
          secondaryUrl: "/pricing",
        }}
      />
    </>
  )
}

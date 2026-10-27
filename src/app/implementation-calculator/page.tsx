import type { Metadata } from "next"
import { buildOgMetadata } from "@/lib/metadata"
import { bookingHref } from "@/lib/bookingLink"
import { getClosingCtaForPage } from "@/sanity/queries"
import ClosingCtaSection from "@/components/sections/ClosingCtaSection"
import ImplementationCalculator from "./ImplementationCalculator"

const TITLE = "Implementation Calculator | monday.com Cost and Timeline Estimate | Fruition"
const DESCRIPTION =
  "Estimate the cost, hours and timeline of a monday.com implementation in minutes. Answer four questions and get an indicative range and a recommended Fruition package, then book a scoping call to confirm it."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/implementation-calculator" },
  ...buildOgMetadata({ title: TITLE, description: DESCRIPTION, path: "/implementation-calculator" }),
}

const EYEBROW = "font-mono text-[12px] font-semibold tracking-[0.14em] text-brand uppercase"

const FACTS = ["Indicative range in minutes", "No sign-up", "A consultant confirms it"]

const STEPS = [
  [
    "Scope from the workstreams you pick",
    "Each workstream carries an indicative low and high hour range. A fixed 16 hours covers discovery and delivery management, added once per project.",
  ],
  [
    "Adjusted for your situation",
    "Team size, whether you are starting fresh, replacing a tool or extending monday.com, and the pace you want each scale the hours up or down.",
  ],
  [
    "Priced at the team rate",
    "Hours are priced at the US team rate of $250 an hour, the same rate as our implementation packages, and rounded to the nearest $500.",
  ],
  [
    "Scheduled for a two-person team",
    "Delivery weeks assume two consultants at 25 billable hours each a week, with a two-week minimum. The scoping call turns all of this into a real plan.",
  ],
]

export default async function ImplementationCalculatorPage() {
  const closingCta = await getClosingCtaForPage("implementation-calculator")

  return (
    // <div>, not <main>: SiteFrame already wraps marketing pages in <main>
    <div className="bg-surface text-ink">
      {/* Hero */}
      <section className="border-b border-ui">
        <div className="mx-auto max-w-[1200px] px-4 pt-14 pb-12 md:pt-20 md:pb-16">
          <p className={EYEBROW}>{"// Implementation Calculator"}</p>
          <h1 className="text-display mt-5 max-w-[820px] text-ink">
            What will your monday.com implementation <span className="text-brand">cost?</span>
          </h1>
          <p className="text-body-lead mt-6 max-w-[640px] text-muted">
            Answer four questions about where you are starting, how many people will use it and what you
            need built. You get an indicative range for hours, investment and delivery weeks, plus the
            package we would usually recommend.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {FACTS.map((fact) => (
              <li
                key={fact}
                className="flex items-center gap-2 font-mono text-[12px] font-semibold tracking-[0.14em] text-muted uppercase"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-brand" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Calculator */}
      <section className="border-b border-ui bg-surface-subtle">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:py-20">
          <ImplementationCalculator />
        </div>
      </section>

      {/* How the estimate is built */}
      <section className="border-b border-ui">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:py-24">
          <p className={EYEBROW}>How the estimate is built</p>
          <h2 className="text-section-h2 mt-4 max-w-[720px] text-ink">
            Plain arithmetic, <span className="text-brand">no black box.</span>
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="border-t border-ui py-6">
                <span className="font-mono text-[12px] font-semibold text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[18px] leading-snug font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCtaSection
        cta={closingCta}
        fallback={{
          eyebrow: "Next step",
          heading: "Turn the range into a real plan.",
          headingAccent: "a real plan.",
          lead: "A scoping call with a Fruition consultant confirms the scope, the price and the timeline for your team.",
          primaryLabel: "Book a scoping call",
          primaryUrl: bookingHref(),
        }}
      />
    </div>
  )
}

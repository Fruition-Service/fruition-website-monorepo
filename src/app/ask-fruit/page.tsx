import type { Metadata } from "next"
import { Check, Minus } from "lucide-react"
import CtaButton from "@/components/CtaButton"
import HeroPrompt from "@/components/ask-fruit/HeroPrompt"
import { buildOgMetadata } from "@/lib/metadata"

const TITLE = "Ask Fruit | Find the Right monday.com, CRM or AI Solution | Fruition"
const DESCRIPTION =
  "Describe what you are trying to fix. Ask Fruit, Fruition's AI assistant, recommends the right monday.com, CRM, integration or AI solution, scores it against your requirements and writes a brief you can share."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ask-fruit" },
  ...buildOgMetadata({ title: TITLE, description: DESCRIPTION, path: "/ask-fruit" }),
}

const EYEBROW = "font-mono text-[12px] font-semibold tracking-[0.14em] text-brand uppercase"

const STEPS = [
  ["Describe the problem", "In your own words: what you run on today, who is involved and what keeps breaking."],
  ["Fruit asks what matters", "One or two sharp questions, never a questionnaire. It records what you say as requirements you can see."],
  ["Matched to real solutions", "Recommendations come only from Fruition's documented solutions, services and packages, each scored against your requirements."],
  ["A brief to take further", "Shortlist the options, then ask for a comparison or an implementation brief to share with your team."],
]

const BRIEF_PARTS = [
  ["Requirements fit", "Every requirement you gave, checked against each option: meets, partly meets or gap, with the reasoning."],
  ["Strengths and watch-outs", "What each option does well and where it would need care in your situation."],
  ["A clear recommendation", "Which option Fruit would choose for you, and why, in one paragraph."],
  ["Delivery plan", "Objectives, phases, owners and risks for the recommended option, ready for a stakeholder conversation."],
]

const DOES = [
  "Recommends from Fruition's own solutions catalog, services and implementation packages",
  "Quotes documented package prices exactly, with their terms",
  "Tells you when a smaller engagement, or none, would do",
  "Keeps your conversations in this browser so you can come back to them",
]

const DOES_NOT = [
  "Invent prices, timelines or client results that are not documented",
  "Recommend products Fruition does not implement",
  "Replace a scoping call: a consultant confirms scope, price and timeline",
  "Ask for contact details before it helps you",
]

export default function AskFruitPage() {
  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 pt-14 pb-16 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-24">
          <div>
            <p className={EYEBROW}>{"// Ask Fruit"}</p>
            <h1 className="text-display mt-5 text-body">
              Describe the problem. <span className="text-brand">Get a plan.</span>
            </h1>
            <p className="text-body-lead mt-6 max-w-[560px] text-muted">
              Fruit is Fruition&apos;s AI assistant. Tell it what you are trying to fix and it recommends the monday.com, CRM,
              integration or AI solution that fits, scores it against your requirements, and writes a brief you can share.
            </p>
          </div>
          <div className="rounded-card border border-ui bg-surface-subtle p-5 md:p-7">
            <p className="mb-3 text-[14px] font-semibold text-body">What are you trying to make happen?</p>
            <HeroPrompt />
            <p className="mt-4 text-[12px] leading-snug text-muted">
              Free, no sign-up. Fruit can be wrong; a consultant confirms scope, pricing and timelines.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-subtle">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:py-24">
          <p className={EYEBROW}>How it works</p>
          <h2 className="text-section-h2 mt-4 max-w-[720px] text-body">
            A consultant&apos;s first conversation, <span className="text-brand">on demand.</span>
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="rounded-card border border-ui bg-surface p-6 shadow-whisper">
                <span className="font-mono text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[18px] leading-snug font-semibold text-body">{title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 py-14 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className={EYEBROW}>What&apos;s in a brief</p>
            <h2 className="text-section-h2 mt-4 text-body">
              Something you can <span className="text-brand">take to the room.</span>
            </h2>
            <p className="text-body-lead mt-5 text-muted">
              When you are weighing options or planning a rollout, ask Fruit for a comparison brief or an implementation
              brief. Print it or save it as a PDF.
            </p>
          </div>
          <dl className="flex flex-col">
            {BRIEF_PARTS.map(([term, detail]) => (
              <div key={term} className="grid grid-cols-1 gap-1 border-t border-dashed border-ui py-5 md:grid-cols-[200px_1fr] md:gap-6">
                <dt className="text-[15px] font-semibold text-body">{term}</dt>
                <dd className="text-[14.5px] leading-relaxed text-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-surface-subtle">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:py-24">
          <p className={EYEBROW}>Where Fruit stops</p>
          <h2 className="text-section-h2 mt-4 max-w-[720px] text-body">Honest about what it knows.</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-card border border-ui bg-surface p-6">
              <h3 className="text-[18px] font-semibold text-body">Fruit does</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {DOES.map((item) => (
                  <li key={item} className="flex gap-3 text-[14.5px] leading-snug text-body">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-ui bg-surface p-6">
              <h3 className="text-[18px] font-semibold text-body">Fruit does not</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {DOES_NOT.map((item) => (
                  <li key={item} className="flex gap-3 text-[14.5px] leading-snug text-muted">
                    <Minus size={16} className="mt-0.5 shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-dark">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-4 py-14 md:py-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-section-h2 text-white">Start with Fruit, finish with a consultant.</h2>
            <p className="text-body-lead mt-4 max-w-[600px] text-white/75">
              Fruit gets you to a shortlist and a plan in minutes. When you are ready, a Fruition consultant scopes and
              quotes it properly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaButton href="/ask-fruit/workspace" label="Open Ask Fruit" variant="onDarkPrimary" />
            <CtaButton href="/contact-us#book" label="Book a call" variant="onDarkOutline" />
          </div>
        </div>
      </section>
    </>
  )
}

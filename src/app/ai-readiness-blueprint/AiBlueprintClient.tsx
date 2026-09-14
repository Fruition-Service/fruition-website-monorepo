"use client"

import { BOOKING_ANCHOR } from "@/lib/bookingLink"
import { useEffect, useState } from "react"
import CtaButton from "@/components/CtaButton"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

/* ------------------------------------------------------------------ */
/*  Data — questions, scoring and report logic are the source-of-truth */
/*  from Josh's approved interactive mockup (monday item 2790599256).  */
/* ------------------------------------------------------------------ */

const CALENDLY = BOOKING_ANCHOR
const PAID_ASSESSMENT = "/ai-capability-assessment"

const DIMS = [
  ["data", "Data Foundations"],
  ["process", "Process Clarity"],
  ["tooling", "Tooling & Platforms"],
  ["team", "Team Capability"],
  ["gov", "Governance & Risk"],
  ["change", "Change Readiness"],
  ["comm", "Commercial Case"],
  ["strat", "Strategic Alignment"],
] as const

type DimKey = (typeof DIMS)[number][0]

interface Option {
  label: string
  hint: string
  value: number
}

interface Question {
  dim: DimKey | null
  title: string
  help: string
  opts: Option[]
}

const opt = (label: string, hint: string, value: number): Option => ({ label, hint, value })

const QUESTIONS: Question[] = [
  { dim: null, title: "How many people work in your organisation?", help: "Sets scale for build effort and licensing.", opts: [
    opt("1–25", "Small team", 0), opt("26–100", "Mid-market", 1), opt("101–500", "Established", 2), opt("500+", "Enterprise", 3)] },
  { dim: null, title: "Where are you primarily based?", help: "Determines currency and compliance overlays.", opts: [
    opt("Australia / NZ", "AUD pricing · Privacy Act", 0), opt("United Kingdom / EU", "GBP pricing · UK GDPR", 1), opt("United States / Canada", "USD pricing · SOC 2 aware", 2), opt("Asia / Other", "AUD pricing · PDPA aware", 0)] },
  { dim: null, title: "Which best describes your industry?", help: "We benchmark you against comparable organisations.", opts: [
    opt("Construction / Trades", "", 0), opt("Manufacturing / Logistics", "", 1), opt("Professional Services", "", 2), opt("Government / NFP / Health", "", 3)] },
  { dim: null, title: "What's the number one outcome you want?", help: "This anchors the core platform recommendation.", opts: [
    opt("Project & portfolio delivery", "Visibility, intake, governance", 0), opt("Sales & CRM", "Pipeline, quoting, handover to delivery", 1), opt("Service / field operations", "Jobs, tickets, dispatch, SLAs", 2), opt("Executive visibility & reporting", "One dashboard, board reporting", 3)] },
  { dim: "tooling", title: "How does work get managed today?", help: "Tooling & Platforms", opts: [
    opt("Spreadsheets and email", "No shared system", 15), opt("A mix of point tools", "Some tools, poorly connected", 40), opt("One main platform, underused", "e.g. monday, Asana, Jira", 65), opt("Well-adopted connected platform", "Integrated and governed", 90)] },
  { dim: "data", title: "Where does your operational data live?", help: "Data Foundations", opts: [
    opt("Scattered files & inboxes", "Hard to find the truth", 15), opt("Departmental systems, no links", "Finance here, ops there", 40), opt("Central systems, some gaps", "Mostly connected", 70), opt("Clean, connected, reportable", "Single source of truth", 92)] },
  { dim: "process", title: "If a new hire asked ‘how do we do X here’, what would happen?", help: "Process Clarity", opts: [
    opt("They'd ask around", "Nothing written down", 15), opt("Some docs exist, mostly stale", "Tribal knowledge", 40), opt("Key processes documented", "Core workflows mapped", 70), opt("Documented and followed", "Living SOPs", 92)] },
  { dim: "team", title: "How is your team using AI today?", help: "Team Capability", opts: [
    opt("Not at all / banned", "", 10), opt("Individuals experiment quietly", "ChatGPT in pockets", 38), opt("Sanctioned tools, some training", "Copilot / Claude rolled out", 68), opt("AI in daily workflows", "Prompting is a core skill", 92)] },
  { dim: "gov", title: "Do you have rules for how AI and data can be used?", help: "Governance & Risk", opts: [
    opt("No policy at all", "", 12), opt("Informal guidance only", "", 38), opt("Written policy, not enforced", "", 65), opt("Policy, training & controls", "", 90)] },
  { dim: "change", title: "When you last rolled out a new system, what happened?", help: "Change Readiness", opts: [
    opt("It flopped, people went back to old ways", "", 15), opt("Partial adoption after a struggle", "", 42), opt("Adopted with strong pushing", "", 68), opt("Adopted well, we're good at change", "", 90)] },
  { dim: "comm", title: "Could you tie an AI investment to a measurable business number?", help: "Commercial Case", opts: [
    opt("Not really, it's a feeling", "", 15), opt("Roughly, we know where the pain is", "", 45), opt("Yes, we track cost/time per process", "", 72), opt("Yes, with baselines and targets", "", 92)] },
  { dim: "strat", title: "What's your AI ambition over the next 12 months?", help: "Strategic Alignment, this shapes your roadmap the most.", opts: [
    opt("Explore safely", "Understand what's real vs hype", 35), opt("Augment the team", "AI assistants inside daily work", 60), opt("Automate workflows", "Connected automations across systems", 78), opt("Agentic operations", "AI agents running whole processes", 90)] },
]

/** Currency/pricing by region option value. */
const CURRENCIES = [
  { sym: "AUD $", rate: 250, tax: "+ GST", seat: 38 },
  { sym: "GBP £", rate: 145, tax: "+ VAT", seat: 22 },
  { sym: "USD $", rate: 195, tax: "", seat: 26 },
]

const SIZE_MULT = [0.7, 1, 1.5, 2.1]
const SIZE_SEATS = [15, 45, 140, 320]

const DEMO_SCORES = [62, 48, 55, 70, 40, 66, 58, 74]

const fmt = (n: number) => n.toLocaleString("en-AU")

function tierFor(avg: number): string {
  return avg >= 70 ? "Advanced" : avg >= 45 ? "Developing" : "Emerging"
}

/* ------------------------------------------------------------------ */
/*  Report derivation (pure)                                           */
/* ------------------------------------------------------------------ */

interface Blueprint {
  date: string
  title: string
  sub: string
  landscape: string
  avg: number
  tier: string
  scores: Record<DimKey, number>
  weakest: [string, string]
  stack: { tag: string; name: string; body: string }[]
  phases: { window: string; hours: number; name: string; body: string }[]
  invest: { item: string; estimate: string; note: string }[]
  summaryForLead: string
}

function buildBlueprint(answers: number[]): Blueprint {
  const scores = {} as Record<DimKey, number>
  QUESTIONS.forEach((q, i) => {
    if (q.dim) scores[q.dim] = q.opts[answers[i]].value
  })

  const size = answers[0]
  const region = QUESTIONS[1].opts[answers[1]].value
  const industry = QUESTIONS[2].opts[answers[2]].label
  const obj = answers[3]
  const amb = answers[11]
  const c = CURRENCIES[region]
  const mult = SIZE_MULT[size]
  const seats = SIZE_SEATS[size]
  const avg = Math.round(DIMS.reduce((a, d) => a + scores[d[0]], 0) / DIMS.length)
  const tier = tierFor(avg)

  const objTxt = [
    "establish structured project and portfolio delivery with intake, governance, and real-time visibility",
    "implement a connected CRM covering pipeline, quoting, and a clean handover into delivery",
    "run service and field operations (jobs, tickets, dispatch and SLA tracking) from one platform",
    "give the executive team one live command centre for KPIs, initiative status, and board reporting",
  ][obj]
  const ambTxt = [
    "a safe, structured exploration of AI with guardrails in place",
    "AI assistants embedded in the team's daily work",
    "connected automations across your core systems",
    "agentic workflows where AI runs defined processes end-to-end",
  ][amb]

  const weakestDims = [...DIMS].sort((a, b) => scores[a[0]] - scores[b[0]]).slice(0, 2)
  const weakest: [string, string] = [weakestDims[0][1], weakestDims[1][1]]

  const core = [
    { name: "monday.com Work Management", body: "Portfolio, intake and governance structure: the operating layer for delivery." },
    { name: "monday CRM", body: "Pipeline, quoting and automated handover from sale to delivery." },
    { name: "monday.com Work Management + Service", body: "Job and ticket management with SLA tracking and dispatch boards." },
    { name: "monday.com Work Management", body: "Executive command centre: KPI roll-up, initiative tracking, board reporting." },
  ][obj]
  const stack: Blueprint["stack"] = [{ tag: "Core platform", ...core }]
  if (amb >= 1) stack.push({ tag: "AI layer", name: "Claude for Work + monday AI", body: "AI assistants and document/summary automation inside daily workflows, with governed access." })
  if (amb >= 2 || scores.tooling < 70) stack.push({ tag: "Integration", name: "n8n automation", body: "Connects your existing systems (finance, email, forms) so data flows without rekeying." })
  if (scores.data < 45) stack.push({ tag: "Foundation", name: "Data clean-up workstream", body: "Consolidate scattered records into structured boards before automation is layered on." })
  if (scores.gov < 45) stack.push({ tag: "Governance", name: "AI use policy & guardrails", body: "A practical AI policy, access controls, and training so adoption is safe and defensible." })

  const phaseBase: [number, string, string, string][] = [
    [16, "Discovery & Process Design", "Weeks 1–2", `Stakeholder workshops, process mapping, and solution design, with focus on your lowest-scoring dimensions (${weakest.join(", ")}).`],
    [26, "Core Platform Build", "Weeks 2–5", `Configure the ${core.name} foundation: structure, workflows, dashboards and permissions matched to how your team actually works.`],
    [20, "Automation & AI Layer", "Weeks 5–7", amb >= 2 ? "Cross-system automations and AI-assisted workflows, sequenced behind the platform foundation." : "Targeted automations and AI assistants embedded where they remove the most manual effort."],
    [12, "Training, Go-Live & Hypercare", "Weeks 7–8", "Role-based training, go-live support, and a hypercare period so adoption sticks."],
  ]
  const phases = phaseBase.map(([h, name, window, body]) => ({
    window,
    name,
    body,
    hours: Math.round((h * mult) / 2) * 2,
  }))

  const totalH = phases.reduce((a, p) => a + p.hours, 0)
  const impl = totalH * c.rate
  const lic = seats * c.seat * 12
  const aiSetup = amb >= 1 ? Math.round((impl * 0.15) / 100) * 100 : 0
  const invest: Blueprint["invest"] = [
    { item: `Implementation services (${totalH} hours @ ${c.sym}${c.rate}/hr)`, estimate: `${c.sym}${fmt(impl)} ${c.tax}`.trim(), note: "Fixed-fee once scoped" },
    { item: `Platform licensing (~${seats} seats, annual, list)`, estimate: `${c.sym}${fmt(lic)}`, note: "Billed by vendor · partner pricing available" },
  ]
  if (aiSetup) invest.push({ item: "AI layer setup & enablement", estimate: `${c.sym}${fmt(aiSetup)}`, note: "Included in phase hours above where possible" })
  invest.push({ item: "Indicative first-year total", estimate: `${c.sym}${fmt(impl + lic + aiSetup)}`, note: "Refined on scoping call" })

  const date = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
  return {
    date,
    title: `AI & Work Platform Blueprint: ${industry.split(" /")[0]}`,
    sub: `${QUESTIONS[0].opts[size].label} staff · ${QUESTIONS[1].opts[answers[1]].label} · Overall readiness ${avg}/100 (${tier})`,
    landscape: `Based on your answers, the primary objective is to ${objTxt}, building toward ${ambTxt}. Your overall readiness score of ${avg}/100 places you in the ${tier} band against comparable ${industry.toLowerCase()} organisations we have assessed. The plan below sequences the work so that foundational gaps are closed before AI capability is layered on top.`,
    avg,
    tier,
    scores,
    weakest,
    stack: stack.slice(0, 6),
    phases,
    invest,
    summaryForLead: `Readiness ${avg}/100 (${tier}) · ${QUESTIONS[0].opts[size].label} staff · ${QUESTIONS[1].opts[answers[1]].label} · ${industry} · Objective: ${QUESTIONS[3].opts[obj].label} · Ambition: ${QUESTIONS[11].opts[amb].label} · Weakest: ${weakest.join(", ")} · Indicative first-year: ${invest[invest.length - 1].estimate}`,
  }
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function SpineRows({ values }: { values: Partial<Record<DimKey, number | null>> }) {
  return (
    <div className="flex flex-col gap-2.5">
      {DIMS.map(([key, name]) => {
        const v = values[key]
        return (
          <div key={key} className="grid grid-cols-[110px_1fr_30px] items-center gap-3">
            <span className="text-[11.5px] leading-tight text-white/80">{name}</span>
            <span className="h-[7px] overflow-hidden rounded-pill bg-white/15">
              <i
                className="block h-full rounded-pill bg-[linear-gradient(90deg,var(--purple-light),var(--purple-primary))] transition-[width] duration-700 motion-reduce:transition-none"
                style={{ width: `${v ?? 0}%` }}
              />
            </span>
            <span className="text-right font-mono text-micro text-white">{v ?? ", "}</span>
          </div>
        )
      })}
    </div>
  )
}

const EYEBROW = "font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand"

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AiBlueprintClient() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(QUESTIONS.length).fill(null))
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [heroDemo, setHeroDemo] = useState(false)
  const [email, setEmail] = useState("")
  const [leadState, setLeadState] = useState<"idle" | "sending" | "done" | "error">("idle")

  useEffect(() => {
    const t = setTimeout(() => setHeroDemo(true), 400)
    return () => clearTimeout(t)
  }, [])

  const liveScores: Partial<Record<DimKey, number | null>> = {}
  QUESTIONS.forEach((q, i) => {
    if (q.dim && answers[i] != null) liveScores[q.dim] = q.opts[answers[i]!].value
  })
  const answeredDims = Object.values(liveScores) as number[]
  const liveAvg = answeredDims.length
    ? Math.round(answeredDims.reduce((a, b) => a + b, 0) / answeredDims.length)
    : null

  const heroDemoScores: Partial<Record<DimKey, number | null>> = {}
  DIMS.forEach(([key], i) => { heroDemoScores[key] = heroDemo ? DEMO_SCORES[i] : null })

  const q = QUESTIONS[step]
  const canNext = answers[step] != null
  const isLast = step === QUESTIONS.length - 1

  function pick(i: number) {
    setAnswers((prev) => { const next = [...prev]; next[step] = i; return next })
  }

  function next() {
    if (!canNext) return
    if (isLast) {
      setBlueprint(buildBlueprint(answers as number[]))
      requestAnimationFrame(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }))
    } else {
      setStep((s) => s + 1)
    }
  }

  function restart() {
    setStep(0)
    setAnswers(new Array(QUESTIONS.length).fill(null))
    setBlueprint(null)
    setLeadState("idle")
    requestAnimationFrame(() => document.getElementById("assess")?.scrollIntoView({ behavior: "smooth" }))
  }

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!blueprint || leadState === "sending" || leadState === "done") return
    setLeadState("sending")
    try {
      const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? ""
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0] || "Blueprint lead",
          email,
          source: "ai-readiness-blueprint",
          website: honeypot,
          fields: { blueprint: blueprint.summaryForLead },
        }),
      })
      const j = (await r.json()) as { ok?: boolean }
      if (!j.ok) throw new Error("lead failed")
      setLeadState("done")
    } catch {
      setLeadState("error")
    }
  }

  return (
    <main className="bg-surface">
      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-10">
          <div>
            <div className={`${EYEBROW} mb-4`}>{"// free · 3 minutes · 12 questions"}</div>
            <h1 className="text-display text-body max-w-[640px]">
              Get your AI &amp; work-platform blueprint <span className="text-brand">before you spend a dollar.</span>
            </h1>
            <p className="text-body-lead text-muted mt-6 max-w-[540px]">
              Answer 12 questions about your operation. We score your readiness across eight
              dimensions and generate a tailored blueprint — recommended platforms, a phased
              build plan, and an indicative investment — instantly.
            </p>
            <div className="mt-8 flex flex-col gap-4 md:flex-row">
              <CtaButton href="#assess" label="Build my blueprint" variant="primary" />
              <CtaButton href={PAID_ASSESSMENT} label="Or book the full 4-week assessment" variant="outline" />
            </div>
            <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
              {[["8", "dimensions scored"], ["900+", "orgs benchmarked"], ["~3 min", "to complete"], ["$0", "obligation"]].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block text-xl font-semibold text-body">{n}</span>
                    <span className="font-mono text-micro uppercase tracking-[0.1em] text-muted">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="hidden rounded-card bg-surface-dark p-7 shadow-card lg:block" aria-hidden="true">
            <div className="mb-5 font-mono text-micro uppercase tracking-[0.14em] text-brand-light">
              {"// your blueprint builds live"}
            </div>
            <SpineRows values={heroDemoScores} />
          </aside>
        </div>
      </section>

      {/* How it works strip */}
      <section className="border-y border-ui bg-surface-subtle">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-9 md:grid-cols-3 md:gap-0 md:px-8 lg:px-10">
          {[
            ["01: ANSWER", "12 questions, no jargon", "Size, systems, data, ambition. If you run the business, you can answer them."],
            ["02: SCORE", "Readiness across 8 dimensions", "Benchmarked against 900+ organisations we've assessed across APAC, UK and US."],
            ["03: BLUEPRINT", "Products, phases, quote", "A recommended stack, a phased build plan, and an indicative investment: instantly."],
          ].map(([num, h, p], i) => (
            <div key={num} className={`md:px-7 ${i > 0 ? "md:border-l md:border-ui" : "md:pl-0"}`}>
              <div className="mb-1.5 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-brand">{num}</div>
              <h2 className="text-card-title text-body">{h}</h2>
              <p className="text-body-sm text-muted mt-1">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Assessment */}
      {!blueprint && (
        <section id="assess" className="scroll-mt-24 bg-surface py-14 md:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8 lg:px-10">
            <div className="mb-10 max-w-[640px]">
              <div className={`${EYEBROW} mb-3`}>The self-assessment</div>
              <h2 className="text-section-h2 text-body">Twelve questions. One blueprint.</h2>
              <p className="text-body-lead text-muted mt-3">
                Your answers score the same eight dimensions we measure in the full 4-week
                Capability Assessment — just faster, and free.
              </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr] lg:gap-11">
              {/* Live spine */}
              <aside className="rounded-card bg-surface-dark p-6 lg:sticky lg:top-24" aria-label="Live readiness score">
                <div className="font-mono text-micro uppercase tracking-[0.14em] text-brand-light">{"// readiness, live"}</div>
                <div className="mt-2 text-4xl font-bold text-white">{liveAvg ?? ", "}</div>
                <div className="mb-5 mt-1 min-h-4 font-mono text-micro uppercase tracking-[0.08em] text-brand-light">
                  {liveAvg != null
                    ? liveAvg >= 70 ? "advanced · ready to build" : liveAvg >= 45 ? "developing · foundations first" : "emerging · start with basics"
                    : "answer to begin scoring"}
                </div>
                <SpineRows values={liveScores} />
                <p className="mt-4 text-[11.5px] leading-normal text-white/60">
                  Scores update as you answer. Your final blueprint benchmarks each dimension
                  against organisations of your size and industry.
                </p>
              </aside>

              {/* Question card */}
              <div className="flex min-h-[430px] flex-col rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-10">
                <div className="mb-6 flex items-center gap-3.5">
                  <div className="h-[5px] flex-1 overflow-hidden rounded-pill bg-surface-subtle">
                    <i
                      className="block h-full bg-brand transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <span className="whitespace-nowrap font-mono text-micro text-muted">{step + 1} / {QUESTIONS.length}</span>
                </div>

                <div className="mb-2 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-brand">
                  {String(step + 1).padStart(2, "0")} · {q.dim ? DIMS.find((d) => d[0] === q.dim)![1] : "Your organisation"}
                </div>
                <h3 className="text-card-title text-body">{q.title}</h3>
                <p className="text-body-sm text-muted mb-6 mt-1.5">{q.help}</p>

                <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label={q.title}>
                  {q.opts.map((o, i) => {
                    const sel = answers[step] === i
                    return (
                      <button
                        key={o.label}
                        type="button"
                        role="radio"
                        aria-checked={sel}
                        onClick={() => pick(i)}
                        className={`flex items-start gap-3 rounded-chip border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                          sel ? "border-brand bg-brand-soft" : "border-ui bg-surface-raised hover:border-brand-light hover:bg-surface-subtle"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`mt-0.5 h-4 w-4 flex-none rounded-pill border-2 transition-colors ${
                            sel ? "border-brand bg-brand shadow-[inset_0_0_0_3px_var(--surface)]" : "border-ui"
                          }`}
                        />
                        <span>
                          <b className="block font-semibold text-body">{o.label}</b>
                          {o.hint && <small className="text-body-sm text-muted">{o.hint}</small>}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-auto flex items-center justify-between pt-7">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className={`px-1 py-2 text-sm text-muted transition-colors hover:text-brand ${step === 0 ? "invisible" : ""}`}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canNext}
                    className="cta-btn cta-btn-primary disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span className="cta-btn-label">{isLast ? "Generate my blueprint →" : "Next →"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Report */}
      {blueprint && (
        <section id="report" className="scroll-mt-24 bg-surface py-14 md:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-4 md:px-8">
            <div className="overflow-hidden rounded-card border border-ui bg-surface-raised shadow-card">
              {/* Cover */}
              <div className="bg-[linear-gradient(150deg,var(--navy-900),var(--navy-700))] p-8 text-white md:p-12">
                <div className="font-mono text-micro uppercase tracking-[0.14em] text-brand-light">
                  AI Readiness Blueprint · generated {blueprint.date}
                </div>
                <h2 className="mt-3 max-w-[560px] text-section-h2 text-white">{blueprint.title}</h2>
                <div className="mt-3 text-body-sm text-white/80">{blueprint.sub}</div>
              </div>

              <div className="p-6 md:p-12">
                <div className="mb-10">
                  <h3 className="text-card-title text-brand">Landscape &amp; objective</h3>
                  <p className="text-body-sm text-body mt-3 max-w-[760px]">{blueprint.landscape}</p>
                </div>

                <div className="mb-10">
                  <h3 className="text-card-title text-brand">Readiness scorecard</h3>
                  <p className="text-body-sm text-body mt-3 max-w-[760px]">
                    Strongest leverage comes from addressing your two lowest dimensions first:{" "}
                    {blueprint.weakest[0]} and {blueprint.weakest[1]}. These are weighted into Phase 1.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
                    {DIMS.map(([key, name]) => {
                      const s = blueprint.scores[key]
                      return (
                        <div key={key} className="rounded-chip bg-surface-subtle p-4">
                          <div className="text-2xl font-bold text-body">{s}</div>
                          <div className="text-micro text-muted mt-0.5">{name}</div>
                          <div className="mt-2.5 h-[5px] overflow-hidden rounded-pill bg-ui/70">
                            <i className={`block h-full ${s < 45 ? "bg-brand-light" : "bg-brand"}`} style={{ width: `${s}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-card-title text-brand">Recommended stack</h3>
                  <p className="text-body-sm text-body mt-3 max-w-[760px]">
                    Vendor recommendations are indicative and refined during discovery. Everything
                    below is something we implement ourselves — no handoffs.
                  </p>
                  <div className="mt-5 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
                    {blueprint.stack.map((s) => (
                      <div key={s.name} className="rounded-chip border border-ui p-5">
                        <div className="mb-2 font-mono text-micro font-semibold uppercase tracking-[0.1em] text-brand">{s.tag}</div>
                        <h4 className="font-semibold text-body">{s.name}</h4>
                        <p className="text-body-sm text-muted mt-1">{s.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-card-title text-brand">Phased implementation plan</h3>
                  <div className="mt-2">
                    {blueprint.phases.map((p, i) => (
                      <div key={p.name} className={`grid gap-2 py-5 md:grid-cols-[160px_1fr] md:gap-6 ${i > 0 ? "border-t border-dashed border-ui" : ""}`}>
                        <div>
                          <div className="font-mono text-micro text-brand md:whitespace-nowrap">PHASE {i + 1} · {p.window}</div>
                          <div className="text-xl font-bold text-body">{p.hours}h</div>
                          <div className="text-micro text-muted">estimated</div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-body">{p.name}</h4>
                          <p className="text-body-sm text-muted mt-1 max-w-[640px]">{p.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-card-title text-brand">Indicative investment</h3>
                  <div className="mt-4">
                    {blueprint.invest.map((row, i) => {
                      const isTotal = i === blueprint.invest.length - 1
                      return (
                        <div
                          key={row.item}
                          className={`flex flex-col gap-1 py-3.5 md:flex-row md:items-baseline md:justify-between md:gap-6 ${
                            i > 0 ? "border-t border-dashed border-ui" : ""
                          } ${isTotal ? "rounded-chip bg-brand-soft px-4" : ""}`}
                        >
                          <div className="min-w-0">
                            <span className={`text-body-sm ${isTotal ? "font-semibold text-body" : "font-medium text-body"}`}>{row.item}</span>
                            <span className="text-micro text-muted block md:hidden">{row.note}</span>
                          </div>
                          <div className="flex items-baseline gap-6">
                            <span className="text-micro text-muted hidden text-right md:block">{row.note}</span>
                            <span className={`whitespace-nowrap font-mono text-sm ${isTotal ? "font-semibold text-brand-dark" : "text-body"}`}>{row.estimate}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-micro text-muted mt-3">
                    Indicative only, based on self-reported answers. A fixed quote follows a scoping
                    call. Licence costs billed by the vendor and estimated at list pricing.
                  </p>
                </div>
              </div>

              {/* CTA band */}
              <div className="flex flex-col gap-7 bg-surface-dark p-8 text-white md:p-12 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-[520px]">
                  <h3 className="text-card-title text-white">Turn this into a fixed-fee proposal.</h3>
                  <p className="text-body-sm mt-1.5 text-white/70">
                    Email yourself the blueprint, or book a 30-minute scoping call with Josh
                    Jebathilak and get a formal proposal within 48 hours.
                  </p>
                  {leadState === "done" ? (
                    <p className="text-body-sm mt-4 font-medium text-brand-light">
                      ✓ Done — your blueprint is on its way. We&apos;ll follow up within one business day.
                    </p>
                  ) : (
                    <form onSubmit={submitLead} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden
                        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        aria-label="Email address"
                        className="min-w-0 flex-1 rounded-chip border border-white/30 bg-white/10 px-3.5 py-3 text-sm text-white placeholder:text-white/50 focus:border-brand-light focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={leadState === "sending"}
                        className="cta-btn cta-btn-on-dark-primary disabled:pointer-events-none disabled:opacity-60"
                      >
                        <span className="cta-btn-label">{leadState === "sending" ? "Sending…" : "Email my blueprint"}</span>
                      </button>
                    </form>
                  )}
                  {leadState === "error" && (
                    <p className="text-body-sm mt-2 text-white/80">
                      Something went wrong — please try again or email us directly at hello@fruitionservices.io.
                    </p>
                  )}
                </div>
                <div className="flex-none">
                  <CtaButton href={CALENDLY} label="Book a scoping call" variant="onDarkOutline" />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button type="button" onClick={restart} className="text-sm text-brand underline hover:no-underline">
                Start over with different answers
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Conversion banner — after the assessment funnel, never mid-flow */}
      <AuditCtaBanner />
    </main>
  )
}

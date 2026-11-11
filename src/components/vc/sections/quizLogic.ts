/**
 * Scoring and blueprint generation for the AI readiness quiz. Pure functions:
 * the same logic the /ai-readiness-blueprint page has always run (scores per
 * dimension from the chosen options, indicative hours and investment from size,
 * region and ambition). The questions and option wording come from the page
 * document; the numbers behind each option travel with it as `value`.
 */

export const DIM_KEYS = ["data", "process", "tooling", "team", "gov", "change", "comm", "strat"] as const
export type DimKey = (typeof DIM_KEYS)[number]

export interface QuizOption { label: string; hint?: string; value: number }
export interface QuizQuestion { dim: DimKey | null; options: QuizOption[] }

const CURRENCIES = [
  { sym: "AUD $", rate: 250, tax: "+ GST", seat: 38 },
  { sym: "GBP £", rate: 145, tax: "+ VAT", seat: 22 },
  { sym: "USD $", rate: 195, tax: "", seat: 26 },
]
const SIZE_MULT = [0.7, 1, 1.5, 2.1]
const SIZE_SEATS = [15, 45, 140, 320]
const fmt = (n: number) => n.toLocaleString("en-AU")

export const tierFor = (avg: number) => (avg >= 70 ? "Advanced" : avg >= 45 ? "Developing" : "Emerging")

export interface Blueprint {
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

export function buildBlueprint(qs: QuizQuestion[], dimNames: string[], answers: number[]): Blueprint {
  const scores = {} as Record<DimKey, number>
  qs.forEach((q, i) => {
    if (q.dim) scores[q.dim] = q.options[answers[i]].value
  })
  const size = answers[0]
  const region = qs[1].options[answers[1]].value
  const industry = qs[2].options[answers[2]].label
  const obj = answers[3]
  const amb = answers[11]
  const c = CURRENCIES[region]
  const mult = SIZE_MULT[size]
  const seats = SIZE_SEATS[size]
  const avg = Math.round(DIM_KEYS.reduce((a, k) => a + scores[k], 0) / DIM_KEYS.length)
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

  const ranked = DIM_KEYS.map((k, i) => ({ k, name: dimNames[i] ?? k })).sort((a, b) => scores[a.k] - scores[b.k])
  const weakest: [string, string] = [ranked[0].name, ranked[1].name]

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
    [16, "Discovery & Process Design", "Weeks 1 to 2", `Stakeholder workshops, process mapping, and solution design, with focus on your lowest-scoring dimensions (${weakest.join(", ")}).`],
    [26, "Core Platform Build", "Weeks 2 to 5", `Configure the ${core.name} foundation: structure, workflows, dashboards and permissions matched to how your team actually works.`],
    [20, "Automation & AI Layer", "Weeks 5 to 7", amb >= 2 ? "Cross-system automations and AI-assisted workflows, sequenced behind the platform foundation." : "Targeted automations and AI assistants embedded where they remove the most manual effort."],
    [12, "Training, Go-Live & Hypercare", "Weeks 7 to 8", "Role-based training, go-live support, and a hypercare period so adoption sticks."],
  ]
  const phases = phaseBase.map(([h, name, window, body]) => ({ window, name, body, hours: Math.round((h * mult) / 2) * 2 }))

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

  const sizeLabel = qs[0].options[size].label
  const regionLabel = qs[1].options[answers[1]].label
  return {
    date: new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }),
    title: `AI & Work Platform Blueprint: ${industry.split(" /")[0]}`,
    sub: `${sizeLabel} staff · ${regionLabel} · Overall readiness ${avg}/100 (${tier})`,
    landscape: `Based on your answers, the primary objective is to ${objTxt}, building toward ${ambTxt}. Your overall readiness score of ${avg}/100 places you in the ${tier} band against comparable ${industry.toLowerCase()} organisations we have assessed. The plan below sequences the work so that foundational gaps are closed before AI capability is layered on top.`,
    avg,
    tier,
    scores,
    weakest,
    stack: stack.slice(0, 6),
    phases,
    invest,
    summaryForLead: `Readiness ${avg}/100 (${tier}) · ${sizeLabel} staff · ${regionLabel} · ${industry} · Objective: ${qs[3].options[obj].label} · Ambition: ${qs[11].options[amb].label} · Weakest: ${weakest.join(", ")} · Indicative first-year: ${invest[invest.length - 1].estimate}`,
  }
}

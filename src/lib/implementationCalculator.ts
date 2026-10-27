/**
 * Implementation Calculator: the pure estimator behind /implementation-calculator.
 *
 * No React, no DOM, no network. The page renders the option lists exported
 * here and calls `estimateImplementation()` on every change, so the controls,
 * the recommendation copy and the arithmetic cannot drift apart.
 */

export type StartingPoint = "new" | "replacing" | "extending"
export type TeamSize = "1-10" | "11-25" | "26-50" | "51-150" | "150+"
export type Module =
  | "core"
  | "crm"
  | "automation"
  | "migration"
  | "reporting"
  | "ai"
  | "training"
export type Timeline = "standard" | "accelerated" | "phased"
export type PackageTier = "Training & Optimisation" | "Lock-Step" | "Managed Services"

export interface CalculatorInput {
  startingPoint: StartingPoint
  teamSize: TeamSize
  modules: readonly Module[]
  timeline: Timeline
}

export interface Range {
  low: number
  high: number
}

export interface CalculatorEstimate {
  hours: Range
  price: Range
  weeks: Range
  tier: PackageTier
  /** The modules actually priced, after the empty-selection fallback and de-duplication. */
  modules: Module[]
}

/*
 * Indicative scoping assumptions. These are the hour ranges Fruition consultants
 * typically scope for each workstream on a monday.com implementation; they are
 * a starting point for a conversation, not a quote. The scoping call replaces
 * them with a real plan.
 */

/** Discovery, project management and delivery overhead, added once per project. */
export const BASE_OVERHEAD_HOURS = 16

/** Hours per module, as [low, high]. */
export const MODULE_HOURS: Record<Module, readonly [number, number]> = {
  core: [24, 40],
  crm: [32, 56],
  automation: [16, 40],
  migration: [16, 48],
  reporting: [12, 24],
  ai: [40, 80],
  training: [8, 24],
}

/** More people means more roles, permissions, edge cases and training sessions. */
export const TEAM_SIZE_MULTIPLIER: Record<TeamSize, number> = {
  "1-10": 1.0,
  "11-25": 1.15,
  "26-50": 1.3,
  "51-150": 1.5,
  "150+": 1.75,
}

/** Replacing a tool adds mapping and cutover; extending reuses what already runs. */
export const STARTING_POINT_MULTIPLIER: Record<StartingPoint, number> = {
  new: 1.0,
  replacing: 1.15,
  extending: 0.85,
}

/** Accelerated delivery needs parallel work; phased adds a little hand-off cost. */
export const TIMELINE_MULTIPLIER: Record<Timeline, number> = {
  standard: 1.0,
  accelerated: 1.25,
  phased: 1.05,
}

/** US team rate, matching /implementation-packages ($2,500 for 10 hours). */
export const RATE_USD_PER_HOUR = 250

/** Price bounds are rounded to the nearest multiple of this. */
export const PRICE_ROUNDING_USD = 500

/** Two consultants at 25 billable hours each per week. */
export const HOURS_PER_WEEK = 50

/** No engagement is scheduled shorter than this. */
export const MIN_WEEKS = 2

/** Tier thresholds, applied to the midpoint of the hours range. */
export const TIER_LOCK_STEP_MIN_HOURS = 20
export const TIER_MANAGED_SERVICES_ABOVE_HOURS = 60

/** Selected by default in the UI, and priced when nothing is selected. */
export const DEFAULT_MODULES: readonly Module[] = ["core"]

export interface Option<T extends string> {
  value: T
  label: string
  description: string
}

export const STARTING_POINT_OPTIONS: readonly Option<StartingPoint>[] = [
  {
    value: "new",
    label: "Starting fresh",
    description: "New to monday.com, or starting a clean account.",
  },
  {
    value: "replacing",
    label: "Replacing a tool",
    description: "Moving off spreadsheets, Asana, Salesforce or similar.",
  },
  {
    value: "extending",
    label: "Extending monday.com",
    description: "You already run monday.com and want more from it.",
  },
]

export const TEAM_SIZE_OPTIONS: readonly Option<TeamSize>[] = [
  { value: "1-10", label: "1 to 10", description: "people using monday.com" },
  { value: "11-25", label: "11 to 25", description: "people using monday.com" },
  { value: "26-50", label: "26 to 50", description: "people using monday.com" },
  { value: "51-150", label: "51 to 150", description: "people using monday.com" },
  { value: "150+", label: "150+", description: "people using monday.com" },
]

export const MODULE_OPTIONS: readonly Option<Module>[] = [
  {
    value: "core",
    label: "Core build",
    description: "Boards, workflows and permissions.",
  },
  {
    value: "crm",
    label: "CRM",
    description: "Pipeline, sales process and monday CRM.",
  },
  {
    value: "automation",
    label: "Automation and integrations",
    description: "Automations, integrations, API, n8n or Make.",
  },
  {
    value: "migration",
    label: "Data migration",
    description: "Data migration, cleanup and cutover.",
  },
  {
    value: "reporting",
    label: "Reporting",
    description: "Dashboards, reporting and portfolio views.",
  },
  {
    value: "ai",
    label: "AI agents",
    description: "AI agents, RAG and agentic workflows.",
  },
  {
    value: "training",
    label: "Training",
    description: "Training, enablement and handover.",
  },
]

export const TIMELINE_OPTIONS: readonly Option<Timeline>[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Steady delivery at a normal pace.",
  },
  {
    value: "accelerated",
    label: "Accelerated",
    description: "Live as soon as possible, with work run in parallel.",
  },
  {
    value: "phased",
    label: "Phased",
    description: "Roll out team by team over a longer period.",
  },
]

/** One line per package, shown under the recommendation. */
export const TIER_SUMMARY: Record<PackageTier, string> = {
  "Training & Optimisation":
    "A short engagement to tune what you have and train the team on it.",
  "Lock-Step":
    "A fixed block of consultant hours, worked through with your team step by step.",
  "Managed Services":
    "A phased rollout with a forward deployed engineer embedded in your team.",
}

export const DEFAULT_INPUT: CalculatorInput = {
  startingPoint: "new",
  teamSize: "11-25",
  modules: DEFAULT_MODULES,
  timeline: "standard",
}

/**
 * The modules to price. An empty selection is treated as core only, the
 * smallest real implementation, so the result is never a zero-hour estimate.
 * Duplicates are dropped and the order follows MODULE_OPTIONS.
 */
export function normaliseModules(modules: readonly Module[]): Module[] {
  const picked = new Set(modules.length > 0 ? modules : DEFAULT_MODULES)
  return MODULE_OPTIONS.map((o) => o.value).filter((m) => picked.has(m))
}

export function tierForHours(hours: number): PackageTier {
  if (hours < TIER_LOCK_STEP_MIN_HOURS) return "Training & Optimisation"
  if (hours <= TIER_MANAGED_SERVICES_ABOVE_HOURS) return "Lock-Step"
  return "Managed Services"
}

function roundPrice(usd: number): number {
  return Math.round(usd / PRICE_ROUNDING_USD) * PRICE_ROUNDING_USD
}

function weeksFor(hours: number): number {
  return Math.max(MIN_WEEKS, Math.ceil(hours / HOURS_PER_WEEK))
}

export function estimateImplementation(input: CalculatorInput): CalculatorEstimate {
  const modules = normaliseModules(input.modules)

  let low = BASE_OVERHEAD_HOURS
  let high = BASE_OVERHEAD_HOURS
  for (const m of modules) {
    low += MODULE_HOURS[m][0]
    high += MODULE_HOURS[m][1]
  }

  const multiplier =
    TEAM_SIZE_MULTIPLIER[input.teamSize] *
    STARTING_POINT_MULTIPLIER[input.startingPoint] *
    TIMELINE_MULTIPLIER[input.timeline]

  const hours = {
    low: Math.round(low * multiplier),
    high: Math.round(high * multiplier),
  }

  return {
    hours,
    price: {
      low: roundPrice(hours.low * RATE_USD_PER_HOUR),
      high: roundPrice(hours.high * RATE_USD_PER_HOUR),
    },
    weeks: { low: weeksFor(hours.low), high: weeksFor(hours.high) },
    tier: tierForHours((hours.low + hours.high) / 2),
    modules,
  }
}

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

/** `$12,500`: US dollars, thousands separators, no decimals. */
export function formatUsd(value: number): string {
  return USD.format(Math.round(value))
}

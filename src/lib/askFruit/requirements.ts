/**
 * Requirement rows, coverage and the "add context" prompts.
 *
 * Ported from Proploy's requirements.ts and requirement-prompts.ts. Sam split
 * rows into catalog-scored and judgement-scored; Fruition sells services rather
 * than a software catalog, so every row is judged by the agent against the
 * knowledge base and the split is carried on each verdict instead (FitSource).
 */
import { REQUIREMENT_KEYS, type RequirementKey, type Requirements } from "./types"

export interface RequirementDefinition {
  key: RequirementKey
  label: string
  /** Composer starter used by the gap chips, e.g. "Our team is ". */
  prompt: string
  /** Rows the panel hides until answered, because few buyers know them up front. */
  optional?: boolean
}

export const REQUIREMENT_DEFINITIONS: Record<RequirementKey, RequirementDefinition> = {
  goals: { key: "goals", label: "Goals", prompt: "What we want to achieve is " },
  pain_points: { key: "pain_points", label: "Pain points", prompt: "What slows us down today is " },
  current_tools: { key: "current_tools", label: "Current tools", prompt: "Today we run on " },
  integrations: { key: "integrations", label: "Integrations", prompt: "It has to connect to " },
  team_size: { key: "team_size", label: "Team size", prompt: "The team that would use it is " },
  industry: { key: "industry", label: "Industry", prompt: "We work in " },
  region: { key: "region", label: "Region", prompt: "We are based in " },
  timeline: { key: "timeline", label: "Timeline", prompt: "We need this live by ", optional: true },
  budget: { key: "budget", label: "Budget", prompt: "Our budget is around ", optional: true },
  success_criteria: { key: "success_criteria", label: "Success criteria", prompt: "We will know it worked when " },
}

export interface RequirementRow {
  key: RequirementKey
  label: string
  values: string[]
  known: boolean
}

export function requirementRows(requirements: Requirements): RequirementRow[] {
  return REQUIREMENT_KEYS.map((key) => {
    const values = (requirements[key] ?? []).filter((v) => v.trim())
    return { key, label: REQUIREMENT_DEFINITIONS[key].label, values, known: values.length > 0 }
  }).filter((row) => row.known || !REQUIREMENT_DEFINITIONS[row.key].optional)
}

export type CoverageVerdict = "empty" | "thin" | "workable" | "strong"

export const VERDICT_COPY: Record<CoverageVerdict, string> = {
  empty: "Tell Fruit what you are trying to fix and it will take it from there.",
  thin: "Enough to start. A few more details will sharpen the recommendation.",
  workable: "Enough for a solid shortlist. The gaps below would firm it up.",
  strong: "Fruit has what it needs for a confident recommendation.",
}

export interface Coverage {
  known: number
  total: number
  percent: number
  verdict: CoverageVerdict
  /** Unanswered rows, the agent's open questions first. */
  gaps: RequirementDefinition[]
}

export function requirementCoverage(requirements: Requirements, openQuestions: RequirementKey[] = []): Coverage {
  const rows = requirementRows(requirements)
  const known = rows.filter((r) => r.known).length
  const total = rows.length
  const percent = total ? Math.round((known / total) * 100) : 0
  const verdict: CoverageVerdict = known === 0 ? "empty" : percent < 34 ? "thin" : percent < 67 ? "workable" : "strong"

  const unanswered = rows.filter((r) => !r.known).map((r) => r.key)
  const priority = [...openQuestions.filter((k) => unanswered.includes(k)), ...unanswered.filter((k) => !openQuestions.includes(k))]
  return { known, total, percent, verdict, gaps: priority.map((k) => REQUIREMENT_DEFINITIONS[k]) }
}

/**
 * Merge a requirements update from the agent. A key the agent sends replaces the
 * stored list; an empty list clears it; keys it leaves out are untouched.
 */
export function mergeRequirements(current: Requirements, update: Record<string, unknown>): Requirements {
  const next: Requirements = { ...current }
  for (const key of REQUIREMENT_KEYS) {
    if (!(key in update)) continue
    const raw = update[key]
    const list = (Array.isArray(raw) ? raw : raw == null ? [] : [raw])
      .map((v) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : ""))
      .map((v) => v.replace(/\s+/g, " ").trim().slice(0, 240))
      .filter(Boolean)
    const deduped = [...new Map(list.map((v) => [v.toLowerCase(), v])).values()].slice(0, 8)
    if (deduped.length) next[key] = deduped
    else delete next[key]
  }
  return next
}

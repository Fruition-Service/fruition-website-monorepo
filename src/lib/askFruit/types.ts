/**
 * Ask Fruit: the shared contract between the agent route and the browser.
 *
 * Ported from Proploy's "Ask Sam" evaluation workspace. The shapes keep Sam's
 * vocabulary (evaluation, matches, shortlist, requirement fit, briefs) so the
 * UI logic carried over intact, but everything the model decides now arrives
 * through typed tool calls instead of Sam's `SELECTED_PRODUCT_IDS` text marker.
 *
 * Browser-safe: no server imports.
 */

export type FitStatus = "yes" | "partial" | "no" | "unknown"

/** Where a verdict came from: a documented fact about the offering, or the agent's read. */
export type FitSource = "documented" | "judgement"

export interface FitCell {
  status: FitStatus
  source: FitSource
  note?: string
}

/** The requirement rows Ask Fruit captures, in the order the panel shows them. */
export const REQUIREMENT_KEYS = [
  "goals",
  "pain_points",
  "current_tools",
  "integrations",
  "team_size",
  "industry",
  "region",
  "timeline",
  "budget",
  "success_criteria",
] as const
export type RequirementKey = (typeof REQUIREMENT_KEYS)[number]

export function isRequirementKey(value: string): value is RequirementKey {
  return (REQUIREMENT_KEYS as readonly string[]).includes(value)
}

/** Every value is a list so goals and single facts share one shape. */
export type Requirements = Partial<Record<RequirementKey, string[]>>

export interface Offering {
  /** Knowledge record id, e.g. `solution:c-commercial-ppm`. */
  offering_id: string
  title: string
  kind: string
  url: string
  summary?: string
  rank?: number
  /** 0-100. */
  match_score?: number | null
  match_strength?: string
  best_for?: string
  reasons?: string[]
  considerations?: string[]
  requirement_fit?: Partial<Record<RequirementKey, FitCell>> | null
  /** Price, hours, timeline and the like, straight from the knowledge record. */
  facts?: Record<string, string | string[]>
}

export interface ComparisonBrief {
  title: string
  buyer_context?: string
  offerings: Offering[]
  requirements: Array<{
    requirement: string
    why_it_matters?: string
    fit: Record<string, { status: FitStatus; note?: string }>
  }>
  strengths: Record<string, string[]>
  watch_outs: Record<string, string[]>
  recommendation: { offering_id: string; reason?: string }
  next_steps: string[]
}

export interface ImplementationBrief {
  title: string
  recommended: Offering
  executive_summary?: string
  business_objectives: string[]
  key_requirements: string[]
  success_criteria: string[]
  phases: Array<{ phase: string; duration?: string; owner?: string; activities: string[] }>
  risks: Array<{ risk: string; mitigation?: string }>
  considered: Offering[]
  next_steps: string[]
}

export type BriefDocument =
  | { doc_id: string; doc_type: "comparison_brief"; title: string; created_at: string; data: ComparisonBrief }
  | { doc_id: string; doc_type: "implementation_brief"; title: string; created_at: string; data: ImplementationBrief }

export interface EvaluationMessage {
  id: string
  role: "user" | "assistant"
  markdown: string
  status?: "complete" | "streaming" | "failed"
  created_at?: string
}

export type EvaluationStage = "discovery" | "recommending" | "comparing" | "planning"

export interface EvaluationSummary {
  evaluation_id: string
  title: string
  stage: EvaluationStage
  match_count: number
  shortlist_count: number
  updated_at: string
}

export interface EvaluationDetail extends EvaluationSummary {
  requirements: Requirements
  /** Requirement keys the agent flagged as the most useful thing to learn next. */
  open_questions: RequirementKey[]
  matches: Offering[]
  shortlist: string[]
  documents: BriefDocument[]
  messages: EvaluationMessage[]
}

/** Server-sent events, in the order a turn emits them. */
export type AskFruitEvent =
  | { type: "session"; data: { evaluation_id: string; title: string } }
  | { type: "status"; data: { label: string } }
  | { type: "tool_call"; data: { id: string; name: string; label: string; status: "started" | "completed" | "failed" } }
  | { type: "message_delta"; data: { delta: string } }
  | { type: "requirements"; data: { requirements: Requirements; open_questions: RequirementKey[]; title?: string } }
  | { type: "recommendations"; data: { items: Offering[] } }
  | { type: "shortlist"; data: { items: string[] } }
  | { type: "document_ready"; data: { document: BriefDocument } }
  | { type: "message_final"; data: { content: string } }
  | { type: "error"; data: { code: string; message: string; retryable: boolean } }
  | { type: "done"; data: { evaluation: EvaluationDetail } }

export type AskFruitEventType = AskFruitEvent["type"]

export const EVENT_TYPES: readonly AskFruitEventType[] = [
  "session",
  "status",
  "tool_call",
  "message_delta",
  "requirements",
  "recommendations",
  "shortlist",
  "document_ready",
  "message_final",
  "error",
  "done",
]

export interface ChatRequest {
  message: string
  evaluation_id?: string | null
}

/** Limits enforced by the route, mirrored in the composer. */
export const MAX_MESSAGE_CHARS = 4000

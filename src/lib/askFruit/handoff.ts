/**
 * The hand-off from the Implementation Calculator to the Fruition team: what
 * "Send to our team" puts on the lead. Browser-safe and pure.
 */
import { quoteText, type RoughQuote } from "./quote"
import type { EvaluationDetail } from "./types"

/** The `source` the lead pipeline files these under. */
export const HANDOFF_SOURCE = "ask-fruit-implementation-calculator"

/** What the visitor is trying to do, in their words or as the agent recorded it. */
export function handoffGoal(evaluation: Pick<EvaluationDetail, "requirements" | "messages" | "title">): string {
  const goals = evaluation.requirements.goals ?? []
  if (goals.length) return goals.join("; ")
  const first = evaluation.messages.find((m) => m.role === "user")?.markdown.trim()
  return (first || evaluation.title).slice(0, 600)
}

/** Free-form fields for /api/leads: goal, matches, the quote and how to find the conversation. */
export function handoffFields(
  evaluation: Pick<EvaluationDetail, "evaluation_id" | "title" | "requirements" | "messages" | "matches" | "shortlist">,
  quote: RoughQuote | null,
): Record<string, string> {
  const kept = new Set(evaluation.shortlist)
  const matches = evaluation.matches
    .map((m) => `${m.title}${kept.has(m.offering_id) ? " (shortlisted)" : ""}${m.match_score != null ? `, ${m.match_score}% match` : ""}`)
    .join("\n")
  return {
    Goal: handoffGoal(evaluation),
    "Matched offerings": matches || "None yet",
    "Rough quote": quoteText(quote),
    Conversation: `${evaluation.title} (${evaluation.evaluation_id})`,
  }
}

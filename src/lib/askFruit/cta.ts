/**
 * Where the in-chat booking card sits. Browser-safe and pure.
 */
import type { EvaluationDetail } from "./types"

/**
 * Index of the assistant message the booking card follows, or null when there
 * is no result yet.
 *
 * The card belongs to the first finished reply whose turn produced matches
 * (`produced_result`, set by the chat route). Conversations saved before that
 * flag existed fall back to the latest finished reply, which is still after the
 * first result, never before it.
 */
export function ctaTurnIndex(evaluation: Pick<EvaluationDetail, "matches" | "messages">): number | null {
  if (!evaluation.matches.length) return null
  const finished = evaluation.messages
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => m.role === "assistant" && m.status !== "streaming" && m.status !== "failed")
  if (!finished.length) return null
  const flagged = finished.find(({ m }) => m.produced_result)
  return (flagged ?? finished[finished.length - 1]).i
}

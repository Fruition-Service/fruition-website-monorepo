import type { EvaluationMessage } from "./types"

/**
 * Index of the message the booking CTA follows: the first assistant reply of
 * the conversation, once it has finished. A reply that is still streaming,
 * failed or empty does not count yet, and later replies never move the CTA.
 * Returns -1 when there is no such message.
 */
export function firstCompletedAssistantIndex(messages: readonly EvaluationMessage[]): number {
  const i = messages.findIndex((m) => m.role === "assistant")
  if (i < 0) return -1
  const m = messages[i]
  if (!m.markdown.trim() || m.status === "streaming" || m.status === "failed") return -1
  return i
}

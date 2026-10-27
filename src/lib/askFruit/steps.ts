/**
 * The Implementation Calculator's visible progress list while a turn runs.
 *
 * Built only from events the chat route really streams (see agent.ts): a
 * `status` at the start of every model step, a `tool_call` started / completed /
 * failed pair for each tool, and `message_delta` once the answer is being
 * written. Nothing here is timed or guessed; a step is ticked when the stream
 * says it finished, and the current step is the first one that has not.
 *
 * Browser-safe and pure, so the mapping is unit tested.
 */

/** The slice of a stream event the progress list needs. */
export type ProgressEvent =
  | { type: "status"; label: string }
  | { type: "tool_call"; id: string; name: string; label: string; status: "started" | "completed" | "failed" }
  | { type: "message_delta" }

export type WorkStepState = "done" | "failed" | "current" | "pending"

export interface WorkStep {
  key: string
  label: string
  state: WorkStepState
}

/** Shown for the stretch of the turn where the answer itself is streaming. */
export const WRITING_LABEL = "Writing your answer"

interface Draft {
  key: string
  label: string
  kind: "status" | "tool" | "writing"
  /** Tool steps only: what the stream last said about the call. */
  outcome?: "started" | "completed" | "failed"
}

/** Ordered steps for one turn, oldest first. */
export function buildSteps(events: readonly ProgressEvent[]): WorkStep[] {
  const drafts: Draft[] = []
  const tools = new Map<string, Draft>()

  for (const event of events) {
    const last = drafts[drafts.length - 1]
    if (event.type === "status") {
      // The client shows "Thinking it through" the moment the visitor sends,
      // and the server opens with the same label: one row, not two.
      if (last?.kind === "status" && last.label === event.label) continue
      drafts.push({ key: `status-${drafts.length}`, label: event.label, kind: "status" })
    } else if (event.type === "message_delta") {
      if (last?.kind === "writing") continue
      drafts.push({ key: `writing-${drafts.length}`, label: WRITING_LABEL, kind: "writing" })
    } else {
      const known = tools.get(event.id)
      if (known) {
        known.outcome = event.status
        continue
      }
      const draft: Draft = { key: `tool-${event.id}`, label: event.label, kind: "tool", outcome: event.status }
      tools.set(event.id, draft)
      drafts.push(draft)
    }
  }

  // A status or writing row is finished as soon as anything comes after it; a
  // tool row only when its call reports back.
  const finished = drafts.map((d, i) => (d.kind === "tool" ? d.outcome !== "started" : i < drafts.length - 1))
  const current = finished.indexOf(false)

  return drafts.map((d, i) => ({
    key: d.key,
    label: d.label,
    state: finished[i] ? (d.outcome === "failed" ? "failed" : "done") : i === current ? "current" : "pending",
  }))
}

/** Whole seconds since the turn started, as the counter shows them. */
export function elapsedLabel(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`
}

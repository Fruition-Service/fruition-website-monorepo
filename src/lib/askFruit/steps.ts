/**
 * The processing steps shown while a turn runs, built only from real wire
 * events. A step appears when its event arrives and is never marked done
 * before its own boundary: status and writing steps end at the next boundary,
 * tool steps end only on their own `tool_call` completed or failed.
 *
 * Browser-safe and pure, so the reducer is tested without a network.
 */
import type { AskFruitEvent } from "./types"

export type StepState = "active" | "done" | "failed"
export type StepKind = "send" | "status" | "tool" | "write"

export interface ProcessingStep {
  id: string
  label: string
  kind: StepKind
  state: StepState
}

export const SEND_LABEL = "Sending your question"
export const WRITE_LABEL = "Writing the answer"

/** The one step known before the server answers: it ends on `session`. */
export function initialSteps(): ProcessingStep[] {
  return [{ id: "send", label: SEND_LABEL, kind: "send", state: "active" }]
}

/** Close every active non-tool step. Tool steps wait for their own completion event. */
function endPhases(steps: ProcessingStep[]): ProcessingStep[] {
  return steps.map((s) => (s.kind !== "tool" && s.state === "active" ? { ...s, state: "done" } : s))
}

/**
 * Apply one stream event. Returns the same array when nothing changed, so a
 * stream of token deltas does not re-render the list or re-announce a step.
 */
export function applyStepEvent(steps: ProcessingStep[], event: AskFruitEvent): ProcessingStep[] {
  switch (event.type) {
    case "session":
      return steps.some((s) => s.kind !== "tool" && s.state === "active") ? endPhases(steps) : steps
    case "status":
      return [...endPhases(steps), { id: `status-${steps.length}`, label: event.data.label, kind: "status", state: "active" }]
    case "tool_call": {
      const id = `tool-${event.data.id}`
      const existing = steps.find((s) => s.id === id)
      if (event.data.status === "started") {
        if (existing) return steps
        return [...endPhases(steps), { id, label: event.data.label, kind: "tool", state: "active" }]
      }
      const state: StepState = event.data.status === "completed" ? "done" : "failed"
      if (!existing) return [...steps, { id, label: event.data.label, kind: "tool", state }]
      return steps.map((s) => (s.id === id ? { ...s, state } : s))
    }
    case "message_delta":
      if (steps.some((s) => s.kind === "write" && s.state === "active")) return steps
      return [...endPhases(steps), { id: `write-${steps.length}`, label: WRITE_LABEL, kind: "write", state: "active" }]
    case "message_final":
    case "done":
      return steps.some((s) => s.kind !== "tool" && s.state === "active") ? endPhases(steps) : steps
    case "error":
      return steps.map((s) => (s.state === "active" ? { ...s, state: "failed" } : s))
    default:
      return steps
  }
}

/** The step to announce: the most recent one still running. */
export function currentStep(steps: ProcessingStep[]): ProcessingStep | null {
  for (let i = steps.length - 1; i >= 0; i--) if (steps[i].state === "active") return steps[i]
  return null
}

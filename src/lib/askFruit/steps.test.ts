import { describe, expect, it } from "vitest"
import { applyStepEvent, currentStep, initialSteps, SEND_LABEL, WRITE_LABEL, type ProcessingStep } from "./steps"
import type { AskFruitEvent, EvaluationDetail } from "./types"

const session: AskFruitEvent = { type: "session", data: { evaluation_id: "e1", title: "t" } }
const status = (label: string): AskFruitEvent => ({ type: "status", data: { label } })
const tool = (id: string, s: "started" | "completed" | "failed"): AskFruitEvent => ({
  type: "tool_call",
  data: { id, name: "search_knowledge", label: "Searching Fruition's solutions", status: s },
})
const delta = (d: string): AskFruitEvent => ({ type: "message_delta", data: { delta: d } })

function run(events: AskFruitEvent[], from = initialSteps()): ProcessingStep[] {
  return events.reduce(applyStepEvent, from)
}

const view = (steps: ProcessingStep[]) => steps.map((s) => `${s.label}:${s.state}`)

describe("processing steps", () => {
  it("starts with only the send step, completed by session", () => {
    expect(view(initialSteps())).toEqual([`${SEND_LABEL}:active`])
    expect(view(run([session]))).toEqual([`${SEND_LABEL}:done`])
  })

  it("never adds a step before its event arrives", () => {
    const steps = run([session, status("Thinking it through")])
    expect(view(steps)).toEqual([`${SEND_LABEL}:done`, "Thinking it through:active"])
  })

  it("ends a status step at the next boundary and keeps a tool active until its own completion", () => {
    let steps = run([session, status("Thinking it through"), tool("c1", "started")])
    expect(view(steps)).toEqual([`${SEND_LABEL}:done`, "Thinking it through:done", "Searching Fruition's solutions:active"])
    steps = run([status("Putting it together")], steps)
    // A new status does not complete the tool: only its own event does.
    expect(steps[2].state).toBe("active")
    steps = run([tool("c1", "completed")], steps)
    expect(steps[2].state).toBe("done")
    expect(currentStep(steps)?.label).toBe("Putting it together")
  })

  it("marks a failed tool as failed", () => {
    const steps = run([session, status("Thinking it through"), tool("c1", "started"), tool("c1", "failed")])
    expect(steps[2].state).toBe("failed")
  })

  it("tolerates think, tool, text, tool, text", () => {
    const steps = run([
      session,
      status("Thinking it through"),
      delta("Let me look."),
      tool("c1", "started"),
      tool("c1", "completed"),
      status("Putting it together"),
      delta("Here is "),
      delta("the answer."),
      { type: "message_final", data: { content: "Here is the answer." } },
    ])
    expect(view(steps)).toEqual([
      `${SEND_LABEL}:done`,
      "Thinking it through:done",
      `${WRITE_LABEL}:done`,
      "Searching Fruition's solutions:done",
      "Putting it together:done",
      `${WRITE_LABEL}:done`,
    ])
    expect(currentStep(steps)).toBeNull()
  })

  it("returns the same array for repeat token deltas, so nothing re-announces", () => {
    const writing = run([session, status("Thinking it through"), delta("a")])
    expect(applyStepEvent(writing, delta("b"))).toBe(writing)
  })

  it("ignores a duplicate tool start and events that carry no step", () => {
    const steps = run([session, tool("c1", "started")])
    expect(applyStepEvent(steps, tool("c1", "started"))).toBe(steps)
    expect(applyStepEvent(steps, { type: "shortlist", data: { items: [] } })).toBe(steps)
  })

  it("fails whatever is still running on error", () => {
    const steps = run([session, status("Thinking it through"), tool("c1", "started")])
    const failed = applyStepEvent(steps, { type: "error", data: { code: "X", message: "x", retryable: true } })
    expect(view(failed)).toEqual([`${SEND_LABEL}:done`, "Thinking it through:done", "Searching Fruition's solutions:failed"])
  })

  it("completes the active step on done", () => {
    const steps = run([session, status("Thinking it through")])
    const done = applyStepEvent(steps, { type: "done", data: { evaluation: {} as EvaluationDetail } })
    expect(currentStep(done)).toBeNull()
  })
})

import { describe, expect, it } from "vitest"
import { buildSteps, elapsedLabel, WRITING_LABEL, type ProgressEvent } from "./steps"

const think: ProgressEvent = { type: "status", label: "Thinking it through" }
const tool = (id: string, status: "started" | "completed" | "failed", label = "Searching Fruition's solutions"): ProgressEvent => ({
  type: "tool_call",
  id,
  name: "search_knowledge",
  label,
  status,
})

describe("buildSteps", () => {
  it("has nothing to show before the turn starts", () => {
    expect(buildSteps([])).toEqual([])
  })

  it("merges the client's opening status with the server's identical one", () => {
    expect(buildSteps([think, think])).toEqual([{ key: "status-0", label: "Thinking it through", state: "current" }])
  })

  it("ticks finished steps and highlights the running tool", () => {
    const steps = buildSteps([think, tool("a", "started")])
    expect(steps.map((s) => [s.label, s.state])).toEqual([
      ["Thinking it through", "done"],
      ["Searching Fruition's solutions", "current"],
    ])
  })

  it("keeps a second queued tool pending until the first reports back", () => {
    const steps = buildSteps([think, tool("a", "started"), tool("b", "started", "Reading the details")])
    expect(steps.map((s) => s.state)).toEqual(["done", "current", "pending"])
    const next = buildSteps([think, tool("a", "started"), tool("b", "started", "Reading the details"), tool("a", "completed")])
    expect(next.map((s) => s.state)).toEqual(["done", "done", "current"])
  })

  it("follows a full turn through to writing the answer", () => {
    const steps = buildSteps([
      think,
      tool("a", "started"),
      tool("a", "completed"),
      tool("b", "started", "Updating your recommendations"),
      tool("b", "failed", "Updating your recommendations"),
      { type: "status", label: "Putting it together" },
      { type: "message_delta" },
      { type: "message_delta" },
    ])
    expect(steps.map((s) => [s.label, s.state])).toEqual([
      ["Thinking it through", "done"],
      ["Searching Fruition's solutions", "done"],
      ["Updating your recommendations", "failed"],
      ["Putting it together", "done"],
      [WRITING_LABEL, "current"],
    ])
  })

  it("closes the writing row when the model goes back to a tool", () => {
    const steps = buildSteps([think, { type: "message_delta" }, tool("a", "started")])
    expect(steps.map((s) => [s.label, s.state])).toEqual([
      ["Thinking it through", "done"],
      [WRITING_LABEL, "done"],
      ["Searching Fruition's solutions", "current"],
    ])
  })
})

describe("elapsedLabel", () => {
  it("counts whole seconds, then minutes", () => {
    expect(elapsedLabel(-5)).toBe("0s")
    expect(elapsedLabel(4900)).toBe("4s")
    expect(elapsedLabel(65_000)).toBe("1m 05s")
  })
})

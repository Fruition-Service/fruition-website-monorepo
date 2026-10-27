import { describe, expect, it } from "vitest"
import { firstCompletedAssistantIndex } from "./cta"
import type { EvaluationMessage } from "./types"

const user = (id: string): EvaluationMessage => ({ id, role: "user", markdown: "We run projects in spreadsheets." })
const reply = (id: string, extra: Partial<EvaluationMessage> = {}): EvaluationMessage => ({
  id,
  role: "assistant",
  markdown: "A monday.com work management setup fits.",
  ...extra,
})

describe("firstCompletedAssistantIndex", () => {
  it("is -1 with no messages", () => {
    expect(firstCompletedAssistantIndex([])).toBe(-1)
  })

  it("is -1 with only user messages", () => {
    expect(firstCompletedAssistantIndex([user("u1"), user("u2")])).toBe(-1)
  })

  it("is -1 while the first answer is streaming", () => {
    expect(firstCompletedAssistantIndex([user("u1"), reply("a1", { status: "streaming" })])).toBe(-1)
  })

  it("is -1 when the first answer failed", () => {
    expect(firstCompletedAssistantIndex([user("u1"), reply("a1", { status: "failed" })])).toBe(-1)
  })

  it("is -1 when the first answer is empty", () => {
    expect(firstCompletedAssistantIndex([user("u1"), reply("a1", { markdown: "  " })])).toBe(-1)
  })

  it("points at a completed first answer, with or without a status", () => {
    expect(firstCompletedAssistantIndex([user("u1"), reply("a1", { status: "complete" })])).toBe(1)
    expect(firstCompletedAssistantIndex([user("u1"), reply("a1")])).toBe(1)
  })

  it("stays on the first answer when later answers arrive", () => {
    const messages = [user("u1"), reply("a1"), user("u2"), reply("a2", { status: "streaming" })]
    expect(firstCompletedAssistantIndex(messages)).toBe(1)
    expect(firstCompletedAssistantIndex([...messages.slice(0, 3), reply("a2")])).toBe(1)
  })
})

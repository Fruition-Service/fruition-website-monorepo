import { describe, expect, it } from "vitest"
import { applyEvent, emptyEvaluation } from "./client"
import { ctaTurnIndex } from "./cta"
import type { EvaluationMessage, Offering } from "./types"

const offering = (id: string): Offering => ({ offering_id: id, title: `Offering ${id}`, kind: "package", url: "/implementation-packages" })

describe("ctaTurnIndex", () => {
  const msg = (role: "user" | "assistant", extra: Partial<EvaluationMessage> = {}): EvaluationMessage => ({
    id: Math.random().toString(36),
    role,
    markdown: "x",
    status: "complete",
    ...extra,
  })

  it("never shows before there is a result", () => {
    expect(ctaTurnIndex({ matches: [], messages: [msg("user"), msg("assistant")] })).toBeNull()
    expect(ctaTurnIndex({ matches: [offering("a")], messages: [msg("user"), msg("assistant", { status: "streaming" })] })).toBeNull()
  })

  it("follows the first reply that produced a result, once", () => {
    const messages = [msg("user"), msg("assistant"), msg("user"), msg("assistant", { produced_result: true }), msg("user"), msg("assistant", { produced_result: true })]
    expect(ctaTurnIndex({ matches: [offering("a")], messages })).toBe(3)
  })

  it("falls back to the latest finished reply for older conversations", () => {
    const messages = [msg("user"), msg("assistant"), msg("user"), msg("assistant"), msg("user"), msg("assistant", { status: "failed" })]
    expect(ctaTurnIndex({ matches: [offering("a")], messages })).toBe(3)
  })
})

describe("applyEvent marks the turn that produced a result", () => {
  it("flags the streaming reply when recommendations arrive, and only then", () => {
    const base = {
      ...emptyEvaluation("ev", "t"),
      messages: [
        { id: "u", role: "user" as const, markdown: "hi", status: "complete" as const },
        { id: "a", role: "assistant" as const, markdown: "", status: "streaming" as const },
      ],
    }
    const empty = applyEvent(base, { type: "recommendations", data: { items: [] } })
    expect(empty.messages[1].produced_result).toBeUndefined()
    const next = applyEvent(base, { type: "recommendations", data: { items: [offering("a")] } })
    expect(next.messages[1].produced_result).toBe(true)
    expect(next.matches).toHaveLength(1)
  })
})

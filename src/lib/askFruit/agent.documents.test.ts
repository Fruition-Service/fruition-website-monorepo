import { describe, expect, it, vi } from "vitest"

vi.mock("@/sanity/client", () => ({ client: { fetch: vi.fn(async () => []) } }))

import { historyMessages } from "./agent"
import { HISTORY_DOCUMENT_CHARS } from "./documents"
import { newEvaluation } from "./store"
import type { EvaluationMessage } from "./types"

function turn(i: number, doc?: string): EvaluationMessage[] {
  return [
    {
      id: `u${i}`,
      role: "user",
      markdown: `question ${i}`,
      status: "complete",
      ...(doc ? { attachment: { name: `brief${i}.pdf`, text: doc, truncated: false } } : {}),
    },
    { id: `a${i}`, role: "assistant", markdown: `answer ${i}`, status: "complete" },
  ]
}

describe("historyMessages with uploaded documents", () => {
  it("replays the document with the user message that carried it", () => {
    const ev = newEvaluation("t")
    ev.messages = [...turn(1, "SCOPE: migrate Salesforce to monday"), ...turn(2)]
    const out = historyMessages(ev)
    expect(out[0].content).toContain("question 1")
    expect(out[0].content).toContain('<uploaded_document name="brief1.pdf">')
    expect(out[0].content).toContain("SCOPE: migrate Salesforce to monday")
    expect(out[2].content).toBe("question 2")
  })

  it("keeps the newest documents within the budget and drops older ones", () => {
    const big = "x".repeat(Math.floor(HISTORY_DOCUMENT_CHARS * 0.6))
    const ev = newEvaluation("t")
    ev.messages = [...turn(1, big), ...turn(2, big)]
    const out = historyMessages(ev)
    expect(out[0].content).not.toContain("<uploaded_document")
    expect(out[2].content).toContain("<uploaded_document")
  })
})

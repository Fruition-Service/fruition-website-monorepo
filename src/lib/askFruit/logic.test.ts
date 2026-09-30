import { describe, expect, it } from "vitest"
import { applyEvent, emptyEvaluation, parseFrame } from "./client"
import { buildFitMatrix, fitCounts } from "./fit"
import { parseBlocks, safeHref } from "./markdown"
import { mergeRequirements, requirementCoverage } from "./requirements"
import { limitBreach } from "./server"
import type { Offering } from "./types"

describe("mergeRequirements", () => {
  it("replaces sent keys, clears empty lists and leaves the rest", () => {
    const next = mergeRequirements(
      { goals: ["Old goal"], team_size: ["10"] },
      { goals: ["Move sales to monday CRM", "move sales to monday crm"], team_size: [], region: "Sydney", bogus: ["x"] },
    )
    expect(next).toEqual({ goals: ["move sales to monday crm"], region: ["Sydney"] })
  })
})

describe("requirementCoverage", () => {
  it("hides optional rows until answered and puts open questions first", () => {
    const c = requirementCoverage({ goals: ["CRM"] }, ["integrations"])
    expect(c.total).toBe(8) // timeline and budget are optional
    expect(c.known).toBe(1)
    expect(c.verdict).toBe("thin")
    expect(c.gaps[0].key).toBe("integrations")
  })
})

describe("fit", () => {
  it("counts partial as half and ignores unknown cells", () => {
    expect(fitCounts(["yes", "partial", "no", "unknown"])).toMatchObject({ met: 1, partial: 1, missing: 1, percent: 50 })
    expect(fitCounts(["unknown"]).percent).toBeNull()
  })

  const offering = (id: string, fit: Offering["requirement_fit"]): Offering => ({
    offering_id: id,
    title: id,
    kind: "solution",
    url: "/x",
    requirement_fit: fit,
  })

  it("builds a matrix only once it would say something", () => {
    const reqs = { goals: ["a"], integrations: ["b"] }
    const a = offering("a", { goals: { status: "yes", source: "judgement" }, integrations: { status: "no", source: "documented" } })
    const b = offering("b", { goals: { status: "partial", source: "judgement" } })
    expect(buildFitMatrix([a], reqs)).toBeNull() // one offering
    expect(buildFitMatrix([a, b], { goals: ["a"] })).toBeNull() // one row
    const m = buildFitMatrix([a, b], reqs)
    expect(m?.columns.map((c) => c.counts.met)).toEqual([1, 0])
    expect(buildFitMatrix([offering("c", { goals: { status: "unknown", source: "judgement" } }), offering("d", {})], reqs)).toBeNull()
  })
})

describe("parseBlocks", () => {
  it("parses paragraphs, lists, headings and tables", () => {
    const blocks = parseBlocks(
      ["## Verdict", "Go with **Solar CRM**.", "", "- one", "- two", "  continued", "", "1. first", "2. second", "", "| A | B |", "|---|---|", "| 1 | 2 |"].join("\n"),
    )
    expect(blocks).toEqual([
      { type: "heading", text: "Verdict" },
      { type: "paragraph", text: "Go with **Solar CRM**." },
      { type: "list", ordered: false, items: ["one", "two continued"] },
      { type: "list", ordered: true, items: ["first", "second"] },
      { type: "table", header: ["A", "B"], rows: [["1", "2"]] },
    ])
  })

  it("drops bold around links, which the inline tokenizer cannot render", () => {
    expect(parseBlocks("**[Dream CRM](/monday-consulting-solutions/catalog)** fits.")).toEqual([
      { type: "paragraph", text: "[Dream CRM](/monday-consulting-solutions/catalog) fits." },
    ])
  })

  it("only renders safe links", () => {
    expect(safeHref("/pricing")).toBe("/pricing")
    expect(safeHref("https://monday.com")).toBe("https://monday.com")
    expect(safeHref("javascript:alert(1)")).toBeNull()
    expect(safeHref("//evil.example")).toBeNull()
    expect(safeHref("http://insecure.example")).toBeNull()
  })
})

describe("parseFrame", () => {
  it("reads known events and ignores comments and unknown ones", () => {
    expect(parseFrame('event: message_delta\ndata: {"delta":"Hi"}')).toEqual({ type: "message_delta", data: { delta: "Hi" } })
    expect(parseFrame(": ping")).toBeNull()
    expect(parseFrame('event: nonsense\ndata: {}')).toBeNull()
    expect(parseFrame("event: done\ndata: not json")).toBeNull()
  })
})

describe("applyEvent", () => {
  const withTurn = () => {
    const ev = emptyEvaluation("draft", "t")
    ev.messages = [
      { id: "u", role: "user", markdown: "hi", status: "complete" },
      { id: "a", role: "assistant", markdown: "", status: "streaming" },
    ]
    return ev
  }

  it("streams text into the last assistant message and finalises it", () => {
    let ev = applyEvent(withTurn(), { type: "message_delta", data: { delta: "Hel" } })
    ev = applyEvent(ev, { type: "message_delta", data: { delta: "lo" } })
    expect(ev.messages[1]).toMatchObject({ markdown: "Hello", status: "streaming" })
    ev = applyEvent(ev, { type: "message_final", data: { content: "Hello." } })
    expect(ev.messages[1]).toMatchObject({ markdown: "Hello.", status: "complete" })
  })

  it("marks the reply failed on error and keeps partial text", () => {
    let ev = applyEvent(withTurn(), { type: "message_delta", data: { delta: "Part" } })
    ev = applyEvent(ev, { type: "error", data: { code: "X", message: "m", retryable: true } })
    expect(ev.messages[1]).toMatchObject({ markdown: "Part", status: "failed" })
  })

  it("does not add the same brief twice", () => {
    const document = {
      doc_id: "d1",
      doc_type: "implementation_brief" as const,
      title: "Plan",
      created_at: "2026-09-30T00:00:00Z",
      data: {} as never,
    }
    let ev = applyEvent(withTurn(), { type: "document_ready", data: { document } })
    ev = applyEvent(ev, { type: "document_ready", data: { document } })
    expect(ev.documents).toHaveLength(1)
  })
})

describe("limitBreach", () => {
  const l = { visitorHour: 20, visitorDay: 60, ipDay: 150, dailyBudgetUsd: 40 }
  it("checks the daily budget before per-visitor limits", () => {
    expect(limitBreach({ visitor_hour: 0, visitor_day: 0, ip_day: 0, cost_day: 40 }, l)?.code).toBe("DAILY_CAPACITY")
    expect(limitBreach({ visitor_hour: 20, visitor_day: 20, ip_day: 20, cost_day: 1 }, l)?.code).toBe("RATE_LIMITED")
    expect(limitBreach({ visitor_hour: 1, visitor_day: 1, ip_day: 150, cost_day: 1 }, l)?.code).toBe("RATE_LIMITED")
    expect(limitBreach({ visitor_hour: 1, visitor_day: 1, ip_day: 1, cost_day: 1 }, l)).toBeNull()
  })
})

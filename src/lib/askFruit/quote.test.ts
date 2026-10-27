import { describe, expect, it } from "vitest"
import { handoffFields, handoffGoal } from "./handoff"
import { buildRoughQuote, formatMoney, parsePrice, quoteText, totalLine, UNPRICED_COPY } from "./quote"
import type { Offering } from "./types"

const offering = (id: string, facts?: Offering["facts"]): Offering => ({
  offering_id: id,
  title: `Offering ${id}`,
  kind: "package",
  url: "/implementation-packages",
  facts,
})

describe("parsePrice", () => {
  it("reads the formats the knowledge records write", () => {
    expect(parsePrice("USD 2,500")).toEqual({ currency: "USD", amount: 2500, prefix: "" })
    expect(parsePrice("From USD 12,000")).toEqual({ currency: "USD", amount: 12000, prefix: "From" })
    expect(parsePrice("AUD 950.50")).toEqual({ currency: "AUD", amount: 950.5, prefix: "" })
  })

  it("refuses anything that is not a documented figure", () => {
    expect(parsePrice(UNPRICED_COPY)).toBeNull()
    expect(parsePrice("USD 0")).toBeNull()
    expect(parsePrice("$2,500")).toBeNull()
    expect(parsePrice("USD 2,50")).toBeNull()
    expect(parsePrice(undefined)).toBeNull()
    expect(parsePrice(["USD 2,500"])).toBeNull()
  })
})

describe("formatMoney", () => {
  it("matches the record format and keeps cents only when there are some", () => {
    expect(formatMoney("USD", 7500)).toBe("USD 7,500")
    expect(formatMoney("USD", 1200.5)).toBe("USD 1,200.50")
  })
})

describe("buildRoughQuote", () => {
  const matches = [
    offering("a", { price: "USD 2,500", hours: "10 hrs" }),
    offering("b", { price: "From USD 5,000", hours: "25 hrs" }),
    offering("c", { price: UNPRICED_COPY, hours: "40+ hrs" }),
    offering("d"),
  ]

  it("says nothing when no offering has a documented price", () => {
    expect(buildRoughQuote({ matches: [offering("x"), offering("y", { price: UNPRICED_COPY })], shortlist: [] })).toBeNull()
  })

  it("totals documented prices, lists hours verbatim and names unpriced work", () => {
    const quote = buildRoughQuote({ matches, shortlist: [] })!
    expect(quote.basis).toBe("matches")
    expect(quote.totals).toEqual([{ currency: "USD", amount: 7500 }])
    expect(quote.unpriced).toBe(2)
    expect(quote.lines.map((l) => [l.price, l.hours, l.priced])).toEqual([
      ["USD 2,500", "10 hrs", true],
      ["From USD 5,000", "25 hrs", true],
      [UNPRICED_COPY, "40+ hrs", false],
      [UNPRICED_COPY, null, false],
    ])
    expect(totalLine(quote)).toBe("From USD 7,500, plus 2 items scoped and quoted by the Fruition team")
  })

  it("covers the shortlist once the visitor has one", () => {
    const quote = buildRoughQuote({ matches, shortlist: ["a"] })!
    expect(quote.basis).toBe("shortlist")
    expect(quote.lines.map((l) => l.offering_id)).toEqual(["a"])
    expect(totalLine(quote)).toBe("USD 2,500")
  })

  it("never converts between currencies", () => {
    const quote = buildRoughQuote({ matches: [offering("a", { price: "USD 1,000" }), offering("b", { price: "AUD 2,000" })], shortlist: [] })!
    expect(totalLine(quote)).toBe("USD 1,000 + AUD 2,000")
  })

  it("writes a plain-text copy for the lead", () => {
    expect(quoteText(buildRoughQuote({ matches: [matches[0]], shortlist: [] }))).toBe("Offering a: USD 2,500 (10 hrs)\nTotal: USD 2,500")
    expect(quoteText(null)).toBe("No documented package price matched.")
  })
})

describe("handoff fields", () => {
  it("prefers recorded goals, then the visitor's first message", () => {
    expect(handoffGoal({ requirements: { goals: ["Move sales to monday CRM", "Automate quotes"] }, messages: [], title: "t" })).toBe(
      "Move sales to monday CRM; Automate quotes",
    )
    expect(handoffGoal({ requirements: {}, messages: [{ id: "1", role: "user", markdown: " Fix our onboarding " }], title: "t" })).toBe(
      "Fix our onboarding",
    )
  })

  it("carries the goal, matches, quote and conversation id", () => {
    const matches = [{ ...offering("a", { price: "USD 2,500" }), match_score: 82 }, offering("b")]
    const fields = handoffFields(
      { evaluation_id: "ev1", title: "CRM move", requirements: { goals: ["CRM"] }, messages: [], matches, shortlist: ["a"] },
      buildRoughQuote({ matches, shortlist: [] }),
    )
    expect(fields).toEqual({
      Goal: "CRM",
      "Matched offerings": "Offering a (shortlisted), 82% match\nOffering b",
      "Rough quote": `Offering a: USD 2,500\nOffering b: ${UNPRICED_COPY}\nTotal: USD 2,500, plus 1 item scoped and quoted by the Fruition team`,
      Conversation: "CRM move (ev1)",
    })
  })
})

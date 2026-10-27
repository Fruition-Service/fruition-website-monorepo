import { describe, expect, it } from "vitest"
import { buildRoughQuote, parsePriceFact, QUOTE_DRIVERS, quoteRangeLabel } from "./quote"
import type { KnowledgeRecord } from "./knowledge/types"

function pkg(id: string, price: string, extra: KnowledgeRecord["facts"] = {}): KnowledgeRecord {
  return {
    id: `package:${id}`,
    kind: "package",
    title: `${id} implementation package`,
    url: "/implementation-packages",
    summary: "",
    text: "",
    tags: [],
    facts: { price, ...extra },
  }
}

const TRAINING = pkg("training-optimisation", "USD 2,500", { hours: "Starting from 10 hrs", terms: "Prices exclude licences." })
const LOCK_STEP = pkg("lock-step", "Scoped and quoted by the Fruition team", { hours: "40 hrs" })

describe("parsePriceFact", () => {
  it("reads a documented price with or without a prefix", () => {
    expect(parsePriceFact({ price: "USD 2,500" })).toEqual({ currency: "USD", amount: 2500 })
    expect(parsePriceFact({ price: "From USD 2,500" })).toEqual({ currency: "USD", amount: 2500 })
    expect(parsePriceFact({ price: "from usd 12,500.50" })).toEqual({ currency: "USD", amount: 12500.5 })
  })

  it("never guesses", () => {
    expect(parsePriceFact({ price: "Scoped and quoted by the Fruition team" })).toBeNull()
    expect(parsePriceFact({ price: "" })).toBeNull()
    expect(parsePriceFact({})).toBeNull()
    expect(parsePriceFact({ price: ["USD 2,500"] })).toBeNull()
  })
})

describe("buildRoughQuote", () => {
  it("gives a from price for one priced package", () => {
    const q = buildRoughQuote([TRAINING])
    expect(q).toMatchObject({ kind: "from", currency: "USD", low: 2500, high: null, terms: "Prices exclude licences." })
    expect(q.packages).toEqual([
      {
        offering_id: "package:training-optimisation",
        title: "training-optimisation implementation package",
        price: "USD 2,500",
        hours: "Starting from 10 hrs",
        currency: "USD",
        amount: 2500,
      },
    ])
  })

  it("gives a range across two priced packages", () => {
    const q = buildRoughQuote([pkg("big", "From USD 9,000"), TRAINING, LOCK_STEP])
    expect(q).toMatchObject({ kind: "range", currency: "USD", low: 2500, high: 9000 })
    expect(q.packages.map((p) => p.offering_id)).toEqual(["package:big", "package:training-optimisation", "package:lock-step"])
  })

  it("is confirmed on the call when nothing is priced", () => {
    const q = buildRoughQuote([LOCK_STEP])
    expect(q).toMatchObject({ kind: "on_call", currency: null, low: null, high: null })
    expect(q.packages[0]).toEqual({
      offering_id: "package:lock-step",
      title: "lock-step implementation package",
      price: "Scoped and quoted by the Fruition team",
      hours: "40 hrs",
    })
  })

  it("is confirmed on the call with no packages at all", () => {
    const q = buildRoughQuote([])
    expect(q).toMatchObject({ kind: "on_call", currency: null, low: null, high: null, packages: [] })
  })
})

describe("quoteRangeLabel", () => {
  it("renders the three cases", () => {
    expect(quoteRangeLabel(buildRoughQuote([TRAINING]))).toBe("From USD 2,500")
    expect(quoteRangeLabel(buildRoughQuote([TRAINING, pkg("big", "USD 9,000")]))).toBe("USD 2,500 to USD 9,000")
    expect(quoteRangeLabel(buildRoughQuote([LOCK_STEP]))).toBe("Range confirmed on the call")
  })
})

describe("QUOTE_DRIVERS", () => {
  it("explains the range without numbers", () => {
    expect(QUOTE_DRIVERS.length).toBeGreaterThan(0)
    for (const d of QUOTE_DRIVERS) expect(d).not.toMatch(/\d/)
  })
})

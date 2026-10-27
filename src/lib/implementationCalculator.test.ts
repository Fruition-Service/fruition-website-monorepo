import { describe, expect, it } from "vitest"
import {
  BASE_OVERHEAD_HOURS,
  MODULE_HOURS,
  MODULE_OPTIONS,
  RATE_USD_PER_HOUR,
  STARTING_POINT_OPTIONS,
  TEAM_SIZE_OPTIONS,
  TIMELINE_OPTIONS,
  estimateImplementation,
  formatUsd,
  normaliseModules,
  tierForHours,
  type CalculatorInput,
  type Module,
} from "./implementationCalculator"

/** New project, smallest team, standard pace: every multiplier is 1. */
const NEUTRAL: CalculatorInput = {
  startingPoint: "new",
  teamSize: "1-10",
  modules: ["core"],
  timeline: "standard",
}

const ALL_MODULES = MODULE_OPTIONS.map((o) => o.value)

describe("estimateImplementation", () => {
  it("adds the fixed overhead to one module at neutral multipliers", () => {
    const e = estimateImplementation(NEUTRAL)
    expect(e.hours).toEqual({
      low: BASE_OVERHEAD_HOURS + MODULE_HOURS.core[0],
      high: BASE_OVERHEAD_HOURS + MODULE_HOURS.core[1],
    })
    expect(e.hours).toEqual({ low: 40, high: 56 })
    expect(e.price).toEqual({ low: 40 * RATE_USD_PER_HOUR, high: 56 * RATE_USD_PER_HOUR })
    expect(e.price).toEqual({ low: 10000, high: 14000 })
    expect(e.modules).toEqual(["core"])
  })

  it("adds the overhead once, however many modules are picked", () => {
    const e = estimateImplementation({ ...NEUTRAL, modules: ["core", "crm"] })
    expect(e.hours).toEqual({ low: 16 + 24 + 32, high: 16 + 40 + 56 })
  })

  it("prices an accelerated timeline above standard, and phased in between", () => {
    const standard = estimateImplementation(NEUTRAL)
    const phased = estimateImplementation({ ...NEUTRAL, timeline: "phased" })
    const accelerated = estimateImplementation({ ...NEUTRAL, timeline: "accelerated" })
    expect(accelerated.hours.low).toBeGreaterThan(phased.hours.low)
    expect(phased.hours.low).toBeGreaterThan(standard.hours.low)
    expect(accelerated.price.high).toBeGreaterThan(standard.price.high)
  })

  it("prices extending monday.com below starting fresh, and replacing above it", () => {
    const fresh = estimateImplementation(NEUTRAL)
    const extending = estimateImplementation({ ...NEUTRAL, startingPoint: "extending" })
    const replacing = estimateImplementation({ ...NEUTRAL, startingPoint: "replacing" })
    expect(extending.hours.high).toBeLessThan(fresh.hours.high)
    expect(replacing.hours.high).toBeGreaterThan(fresh.hours.high)
    expect(extending.price.low).toBeLessThan(fresh.price.low)
  })

  it("prices team sizes in ascending order, 150+ above 1-10", () => {
    const highs = TEAM_SIZE_OPTIONS.map(
      (o) => estimateImplementation({ ...NEUTRAL, teamSize: o.value }).hours.high,
    )
    for (let i = 1; i < highs.length; i++) expect(highs[i]).toBeGreaterThan(highs[i - 1])
    const small = estimateImplementation(NEUTRAL)
    const large = estimateImplementation({ ...NEUTRAL, teamSize: "150+" })
    expect(large.price.high).toBeGreaterThan(small.price.high)
  })

  it("rounds hours to whole numbers and price bounds to the nearest 500", () => {
    // 26-50 people: 40 x 1.3 = 52 and 56 x 1.3 = 72.8, so 73 hours = $18,250, which rounds to $18,500.
    const e = estimateImplementation({ ...NEUTRAL, teamSize: "26-50" })
    expect(e.hours).toEqual({ low: 52, high: 73 })
    expect(e.price).toEqual({ low: 13000, high: 18500 })

    for (const teamSize of TEAM_SIZE_OPTIONS.map((o) => o.value)) {
      for (const startingPoint of STARTING_POINT_OPTIONS.map((o) => o.value)) {
        for (const timeline of TIMELINE_OPTIONS.map((o) => o.value)) {
          const r = estimateImplementation({ teamSize, startingPoint, timeline, modules: ALL_MODULES })
          expect(Number.isInteger(r.hours.low)).toBe(true)
          expect(Number.isInteger(r.hours.high)).toBe(true)
          expect(r.price.low % 500).toBe(0)
          expect(r.price.high % 500).toBe(0)
          expect(Math.abs(r.price.high - r.hours.high * RATE_USD_PER_HOUR)).toBeLessThanOrEqual(250)
        }
      }
    }
  })

  it("never schedules fewer than two weeks", () => {
    // 40 to 56 hours at 50 hours a week would be one or two weeks.
    const small = estimateImplementation({ ...NEUTRAL, startingPoint: "extending" })
    expect(small.weeks).toEqual({ low: 2, high: 2 })
  })

  it("rounds weeks up at 50 hours a week once past the minimum", () => {
    const big = estimateImplementation({
      startingPoint: "replacing",
      teamSize: "150+",
      modules: ALL_MODULES,
      timeline: "accelerated",
    })
    expect(big.weeks.low).toBe(Math.ceil(big.hours.low / 50))
    expect(big.weeks.high).toBe(Math.ceil(big.hours.high / 50))
    expect(big.weeks.high).toBeGreaterThan(big.weeks.low)
  })

  it("recommends a package from the hours", () => {
    expect(estimateImplementation(NEUTRAL).tier).toBe("Lock-Step")
    expect(estimateImplementation({ ...NEUTRAL, modules: ALL_MODULES }).tier).toBe("Managed Services")
  })

  it("treats an empty module selection as core only", () => {
    const empty = estimateImplementation({ ...NEUTRAL, modules: [] })
    expect(empty.modules).toEqual(["core"])
    expect(empty).toEqual(estimateImplementation(NEUTRAL))
    expect(empty.hours.low).toBeGreaterThan(0)
  })

  it("ignores duplicate modules", () => {
    const dup = estimateImplementation({ ...NEUTRAL, modules: ["core", "core"] as Module[] })
    expect(dup).toEqual(estimateImplementation(NEUTRAL))
  })
})

describe("tierForHours", () => {
  it("puts anything under 20 hours in Training & Optimisation", () => {
    expect(tierForHours(0)).toBe("Training & Optimisation")
    expect(tierForHours(19)).toBe("Training & Optimisation")
    expect(tierForHours(19.9)).toBe("Training & Optimisation")
  })

  it("puts 20 to 60 hours, inclusive, in Lock-Step", () => {
    expect(tierForHours(20)).toBe("Lock-Step")
    expect(tierForHours(40)).toBe("Lock-Step")
    expect(tierForHours(60)).toBe("Lock-Step")
  })

  it("puts anything over 60 hours in Managed Services", () => {
    expect(tierForHours(60.5)).toBe("Managed Services")
    expect(tierForHours(61)).toBe("Managed Services")
    expect(tierForHours(500)).toBe("Managed Services")
  })
})

describe("normaliseModules", () => {
  it("keeps the option order regardless of selection order", () => {
    expect(normaliseModules(["training", "core", "ai"])).toEqual(["core", "ai", "training"])
  })

  it("falls back to core when nothing is selected", () => {
    expect(normaliseModules([])).toEqual(["core"])
  })
})

describe("option lists", () => {
  it("offers every module the hours table prices, with a label and description", () => {
    expect([...ALL_MODULES].sort()).toEqual(Object.keys(MODULE_HOURS).sort())
    for (const list of [STARTING_POINT_OPTIONS, TEAM_SIZE_OPTIONS, MODULE_OPTIONS, TIMELINE_OPTIONS]) {
      for (const o of list) {
        expect(o.label.length).toBeGreaterThan(0)
        expect(o.description.length).toBeGreaterThan(0)
      }
    }
  })
})

describe("formatUsd", () => {
  it("formats whole US dollars with thousands separators and no decimals", () => {
    expect(formatUsd(12500)).toBe("$12,500")
    expect(formatUsd(500)).toBe("$500")
    expect(formatUsd(0)).toBe("$0")
    expect(formatUsd(1250000)).toBe("$1,250,000")
  })

  it("rounds fractional input to the dollar", () => {
    expect(formatUsd(999.6)).toBe("$1,000")
    expect(formatUsd(10000.4)).toBe("$10,000")
  })
})

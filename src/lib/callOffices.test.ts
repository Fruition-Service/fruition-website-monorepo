import { describe, expect, it } from "vitest"
import { callRows, nearestFlag, orderForVisitor, toE164, type CallOffice } from "./callOffices"

const OFFICES: CallOffice[] = [
  { flag: "🇺🇸", city: "New York, US Office", phone: "+1 302 330 2496", phoneTel: "+13023302496" },
  { flag: "🇦🇺", city: "Sydney, Australia", phone: "+61 483 955 931", phoneTel: "+61483955931" },
  { flag: "🇵🇭", city: "Manila, Philippines", phone: "+63 947 230 4274", phoneTel: "+639472304274" },
  { flag: "🇬🇧", city: "London, UK", phone: "+44 7822 019548", phoneTel: "+447822019548" },
  { flag: "🇮🇳", city: "New Delhi, India", phone: "+91 7503735930", phoneTel: "+917503735930" },
  { flag: "🇸🇬", city: "Singapore", phone: "+65 3158 6808", phoneTel: "+6531586808" },
]

describe("toE164", () => {
  it("strips formatting and keeps the plus", () => {
    expect(toE164("+61 483 955 931")).toBe("+61483955931")
    expect(toE164("+1 (302) 330-2496")).toBe("+13023302496")
  })
  it("rejects anything that is not a full international number", () => {
    expect(toE164("0483 955 931")).toBeNull()
    expect(toE164("")).toBeNull()
    expect(toE164(undefined)).toBeNull()
    expect(toE164("+12")).toBeNull()
  })
})

describe("callRows", () => {
  it("orders west to east from Sydney and builds tel links from the CMS number", () => {
    const rows = callRows(OFFICES)
    expect(rows.map((r) => r.country)).toEqual([
      "Australia",
      "Singapore",
      "Philippines",
      "India",
      "United Kingdom",
      "United States",
    ])
    expect(rows[0]).toMatchObject({ city: "Sydney", phone: "+61 483 955 931", tel: "+61483955931" })
  })
  it("omits offices without a usable number rather than inventing one", () => {
    const rows = callRows([
      { flag: "🇦🇺", city: "Sydney", phone: "+61 483 955 931" },
      { flag: "🇸🇬", city: "Singapore" },
      { flag: "🇮🇳", city: "Delhi", phone: "07503 735930" },
      { flag: "🇫🇷", city: "Paris", phone: "+33 1 23 45 67 89" },
    ])
    expect(rows.map((r) => r.country)).toEqual(["Australia"])
    expect(rows[0].tel).toBe("+61483955931")
  })
  it("handles missing input", () => {
    expect(callRows(undefined)).toEqual([])
    expect(callRows([])).toEqual([])
  })
})

describe("nearestFlag", () => {
  it("prefers the visitor's own country when it has an office", () => {
    expect(nearestFlag("SEA", "PH")).toBe("🇵🇭")
    expect(nearestFlag("SEA", "SG")).toBe("🇸🇬")
    expect(nearestFlag("NA", "CA")).toBe("🇺🇸")
    expect(nearestFlag("IND", "AE")).toBe("🇮🇳")
  })
  it("falls back to the booking region's desk", () => {
    expect(nearestFlag("SEA", "TH")).toBe("🇸🇬")
    expect(nearestFlag("UK", "DE")).toBe("🇬🇧")
    expect(nearestFlag("APAC", null)).toBe("🇦🇺")
    expect(nearestFlag("NA", undefined)).toBe("🇺🇸")
  })
  it("is null when nothing is known", () => {
    expect(nearestFlag(undefined, undefined)).toBeNull()
    expect(nearestFlag("MARS", "ZZ")).toBeNull()
  })
})

describe("orderForVisitor", () => {
  const rows = callRows(OFFICES)
  it("puts the visitor's office first and keeps the rest in order", () => {
    const out = orderForVisitor(rows, "🇬🇧")
    expect(out.nearest).toBe(true)
    expect(out.rows.map((r) => r.flag)).toEqual(["🇬🇧", "🇦🇺", "🇸🇬", "🇵🇭", "🇮🇳", "🇺🇸"])
  })
  it("leaves the order alone with no match, and never loses a row", () => {
    expect(orderForVisitor(rows, null)).toEqual({ rows, nearest: false })
    expect(orderForVisitor(rows, "🇫🇷")).toEqual({ rows, nearest: false })
    expect(orderForVisitor(rows.slice(0, 1), "🇬🇧").rows).toHaveLength(1)
  })
})

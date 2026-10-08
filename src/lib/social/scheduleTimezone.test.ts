import { describe, expect, it } from "vitest"
import { formatScheduled, isSameDayIn, todayIn, wallClockToUtc, zoneAbbreviation } from "./scheduleTimezone"

describe("wallClockToUtc", () => {
  it("reads the picker value as Sydney time, in daylight saving (AEDT, UTC+11)", () => {
    expect(wallClockToUtc("2026-10-09T09:00", "Australia/Sydney")?.toISOString()).toBe("2026-10-08T22:00:00.000Z")
  })

  it("reads the picker value as Sydney time, in winter (AEST, UTC+10)", () => {
    expect(wallClockToUtc("2026-07-01T09:00", "Australia/Sydney")?.toISOString()).toBe("2026-06-30T23:00:00.000Z")
  })

  it("settles the offset on the day daylight saving starts", () => {
    // Sydney springs forward at 02:00 on 4 Oct 2026; 09:00 that day is AEDT.
    expect(wallClockToUtc("2026-10-04T09:00", "Australia/Sydney")?.toISOString()).toBe("2026-10-03T22:00:00.000Z")
    // 01:00 the same day is still AEST.
    expect(wallClockToUtc("2026-10-04T01:00", "Australia/Sydney")?.toISOString()).toBe("2026-10-03T15:00:00.000Z")
  })

  it("handles zones without daylight saving", () => {
    expect(wallClockToUtc("2026-10-09T09:00", "Australia/Perth")?.toISOString()).toBe("2026-10-09T01:00:00.000Z")
    expect(wallClockToUtc("2026-10-09T09:00", "Asia/Singapore")?.toISOString()).toBe("2026-10-09T01:00:00.000Z")
  })

  it("rejects malformed values", () => {
    expect(wallClockToUtc("", "Australia/Sydney")).toBeNull()
    expect(wallClockToUtc("2026-10-09", "Australia/Sydney")).toBeNull()
  })
})

describe("display helpers", () => {
  it("names the Sydney zone and prints the Sydney wall clock", () => {
    expect(zoneAbbreviation("Australia/Sydney", new Date("2026-10-08T22:00:00Z"))).toBe("AEDT")
    expect(formatScheduled("2026-10-08T22:00:00Z", "Australia/Sydney")).toMatch(/9 Oct.*9:00.*AEDT$/)
  })

  it("works out today's date in the target zone, not the browser's", () => {
    // 15:00 UTC on 8 Oct is already 9 Oct in Sydney.
    const t = todayIn("Australia/Sydney", new Date("2026-10-08T15:00:00Z"))
    expect([t.getFullYear(), t.getMonth() + 1, t.getDate()]).toEqual([2026, 10, 9])
    expect(isSameDayIn(new Date("2026-10-08T15:00:00Z"), new Date("2026-10-09T10:00:00Z"), "Australia/Sydney")).toBe(true)
  })
})

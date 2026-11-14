import { describe, expect, it } from "vitest"
import { zoneAbbr } from "./meetingTime"

describe("zoneAbbr", () => {
  const nov = new Date("2026-11-18T03:00:00Z")
  const jun = new Date("2026-06-18T03:00:00Z")

  it("names the summer and winter zones for the date given", () => {
    expect(zoneAbbr(nov, "Australia/Sydney")).toBe("AEDT")
    expect(zoneAbbr(jun, "Australia/Sydney")).toBe("AEST")
    expect(zoneAbbr(nov, "Europe/London")).toBe("GMT")
    expect(zoneAbbr(jun, "Europe/London")).toBe("BST")
    expect(zoneAbbr(nov, "America/New_York")).toBe("EST")
    expect(zoneAbbr(jun, "America/New_York")).toBe("EDT")
    expect(zoneAbbr(nov, "America/Los_Angeles")).toBe("PST")
    expect(zoneAbbr(jun, "America/Los_Angeles")).toBe("PDT")
  })

  it("keeps zones without daylight saving steady", () => {
    expect(zoneAbbr(nov, "Asia/Singapore")).toBe("SGT")
    expect(zoneAbbr(jun, "Asia/Kolkata")).toBe("IST")
  })

  it("never throws on an unknown zone", () => {
    expect(zoneAbbr(nov, "Not/AZone")).toBe("")
  })
})

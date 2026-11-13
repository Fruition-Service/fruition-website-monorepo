import { beforeEach, describe, expect, it, vi } from "vitest"
import { BOOKING_DESKS, deskFor } from "@/lib/bookingDesks"
import { buildBookingUrl } from "@/lib/consultants"

const slots = vi.fn()
vi.mock("@/lib/calendlyClient", () => ({
  getAvailableSlots: (...args: unknown[]) => slots(...args),
}))
vi.mock("@/sanity/queries", () => ({
  getTeamMemberByName: async () => ({ photoUrl: "https://cdn.sanity.io/x.jpg", role: "Principal AI Consultant" }),
}))

describe("fixed booking desks", () => {
  it("only resolves known desk keys", () => {
    expect(deskFor("thana")?.consultant.name).toBe("Thana Witchawut")
    expect(deskFor("josh")).toBeUndefined()
    expect(deskFor("")).toBeUndefined()
    expect(deskFor(undefined)).toBeUndefined()
    expect(deskFor(["thana"])).toBeUndefined()
  })

  it("books Thana's own event type, with the context in her one question", () => {
    const d = BOOKING_DESKS.thana
    expect(d.booking.eventTypeUuid).toBe(d.consultant.eventTypeUuid)
    const u = buildBookingUrl(d.booking, {
      name: "Alex Morgan", email: "alex@acme.com", message: "HubSpot — migrate from Salesforce",
      startUtc: "2026-12-01T03:00:00Z", viewerTimezone: "Asia/Bangkok",
    })
    expect(u.startsWith("https://calendly.com/thana-fruitionservices/30min/2026-12-01T10:00:00+07:00")).toBe(true)
    expect(new URLSearchParams(u.split("?")[1]).get("a1")).toContain("Salesforce")
  })
})

describe("availability route on a fixed desk", () => {
  beforeEach(() => {
    slots.mockReset()
    slots.mockResolvedValue([{ start: "2026-12-01T03:00:00Z", url: "x" }])
  })

  it("ignores the visitor's country and region and returns Thana's slots", async () => {
    const { GET } = await import("@/app/api/scheduling/availability/route")
    const r = await GET(
      new Request("https://x.test/api/scheduling/availability?tz=America/New_York&region=NA&desk=thana", {
        headers: { "cf-ipcountry": "US" },
      }),
    )
    const body = (await r.json()) as {
      region: string; desk?: string; bookingUrl: string
      consultants: { key: string; name: string }[]; slots: { host: string }[]
    }
    expect(body.desk).toBe("thana")
    expect(body.consultants.map((c) => c.name)).toEqual(["Thana Witchawut"])
    expect(body.bookingUrl).toBe("https://calendly.com/thana-fruitionservices/30min")
    expect(body.slots[0].host).toBe("thana")
    expect(slots).toHaveBeenCalledWith("SEA", "4c6c527e-6057-4054-97c0-355ca492c4a6")
  })

  it("still detects the region when no desk is given", async () => {
    const { GET } = await import("@/app/api/scheduling/availability/route")
    const r = await GET(
      new Request("https://x.test/api/scheduling/availability?tz=America/New_York", {
        headers: { "cf-ipcountry": "US" },
      }),
    )
    const body = (await r.json()) as { region: string; desk?: string }
    expect(body.region).toBe("NA")
    expect(body.desk).toBeUndefined()
    expect(slots).toHaveBeenCalledWith("NA", undefined)
  })
})

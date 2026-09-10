import { describe, expect, it } from "vitest"
import { buildBookingUrl } from "@/lib/consultants"
import { REGION_BOOKING, SERVICE_CHOICES } from "@/lib/regionBooking"

describe("regional booking links", () => {
  it("deep-links UK to the slot in the visitor's zone with answers in the right boxes", () => {
    const u = buildBookingUrl(REGION_BOOKING.UK, {
      name: "Alex Morgan",
      email: "alex@acme.co.uk",
      company: "Acme Ltd",
      phone: "+44 7700 900123",
      message: "Title: Ops Lead — monday.com — Need CRM help",
      service: "monday.com",
      startUtc: "2026-09-10T09:00:00Z",
      viewerTimezone: "Europe/London",
      sourcePage: "/monday-crm-consulting",
    })
    const [path, query] = u.split("?")
    // 10:00 London on the 10th, written as Calendly's own path segment
    expect(path).toBe(
      "https://calendly.com/global-calendar-fruitionservices/30-minute-consultation/2026-09-10T10:00:00+01:00",
    )
    const q = new URLSearchParams(query)
    expect(q.get("a1")).toBe("Acme Ltd")            // Company
    expect(q.get("a2")).toBe("+44 7700 900123")     // Mobile (required)
    expect(q.get("a3")).toBeNull()                  // monday URL — visitor fills
    expect(q.get("a4")).toContain("Ops Lead")       // context (required)
    expect(q.get("a5")).toBe("monday.com")          // service choice
    expect(q.get("utm_source")).toBe("fruition-leadfirst")
    expect(q.get("utm_content")).toBe("/monday-crm-consulting")
    expect(u).not.toContain("+Morgan")              // spaces stay %20
  })

  it("sends India to its own event type, not South-East Asia", () => {
    expect(REGION_BOOKING.IND.eventTypeUuid).not.toBe(REGION_BOOKING.SEA.eventTypeUuid)
    const u = buildBookingUrl(REGION_BOOKING.IND, {
      name: "Priya R", email: "priya@acme.in", message: "Need help",
      startUtc: "2026-09-10T09:00:00Z", viewerTimezone: "Asia/Calcutta",
    })
    expect(u).toContain("/india-uae-30-minute-consultation/2026-09-10T14:30:00+05:30")
    expect(new URLSearchParams(u.split("?")[1]).get("a1")).toBe("Need help")
  })

  it("every region points at the shared account", () => {
    for (const b of Object.values(REGION_BOOKING)) {
      expect(b.calendlyUrl).toContain("/global-calendar-fruitionservices/")
    }
  })

  it("only offers service answers Calendly actually accepts", () => {
    expect(SERVICE_CHOICES.has("Other")).toBe(false)
    expect(SERVICE_CHOICES.has("monday.com")).toBe(true)
  })
})

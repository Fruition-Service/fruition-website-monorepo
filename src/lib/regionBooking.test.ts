import { describe, expect, it } from "vitest"
import { buildBookingUrl } from "@/lib/consultants"
import { FALLBACK_BOOKING_URL, REGION_BOOKING, SERVICE_CHOICES } from "@/lib/regionBooking"

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
      name: "Priya R", email: "priya@acme.in", phone: "+91 98765 43210", message: "Need help",
      startUtc: "2026-09-10T09:00:00Z", viewerTimezone: "Asia/Calcutta",
    })
    expect(u).toContain("/india-uae-30-minute-consultation/2026-09-10T14:30:00+05:30")
    // Nikhil's link asks Mobile first, then industry/use case — not the shared
    // account's Company/Mobile/context/service order.
    const q = new URLSearchParams(u.split("?")[1])
    expect(q.get("a1")).toBe("+91 98765 43210")
    expect(q.get("a2")).toBe("Need help")
  })

  /*
   * SEA and IND moved off the shared account on 2026-09-20. Its event types are
   * hosted by the global-calendar placeholder, so the consultant was never a
   * host and never received the calendar invite — a booking on 21 Sep reached
   * the CRM and nobody's diary. These two now point at links Nikki and Nikhil
   * host themselves. ANZ, UK and NA are still on the shared account and still
   * have the bug.
   */
  it("books SEA and India against the consultant's own link", () => {
    expect(REGION_BOOKING.SEA.calendlyUrl).toContain("calendly.com/d/")
    expect(REGION_BOOKING.IND.calendlyUrl).toContain("calendly.com/d/")
  })

  it("never lets two regions share one event type", () => {
    const uuids = Object.values(REGION_BOOKING).map((b) => b.eventTypeUuid)
    expect(new Set(uuids).size).toBe(uuids.length)
  })

  it("falls back to the Australia desk, not the account's root page", () => {
    expect(FALLBACK_BOOKING_URL).toBe(REGION_BOOKING.APAC.calendlyUrl)
    // The root lists every region at once and makes the visitor choose.
    expect(FALLBACK_BOOKING_URL).not.toMatch(/global-calendar-fruitionservices\/?$/)
  })

  it("only offers service answers Calendly actually accepts", () => {
    expect(SERVICE_CHOICES.has("Other")).toBe(false)
    expect(SERVICE_CHOICES.has("monday.com")).toBe(true)
  })
})

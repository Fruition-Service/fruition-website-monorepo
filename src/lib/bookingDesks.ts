import type { Consultant } from "@/lib/consultants"
import type { LeadRegion } from "@/lib/leadNotify"
import type { RegionBooking } from "@/lib/regionBooking"

/**
 * Fixed booking desks: a page that always books with one named consultant, no
 * matter where the visitor is.
 *
 * Every other booking card resolves a *region* desk from cf-ipcountry (see
 * REGION_BOOKING and REGION_CONSULTANTS). A desk here skips that entirely: the
 * slots, the Calendly event type, the face on the card and the monday owner are
 * all this one person's, and the card hides its region switch because there is
 * nothing to switch.
 *
 * Which page uses which desk is content, not code: `vcBooking.desk` in Sanity
 * (Version C pages). As of 13 Nov 2026 /hubspot-consulting and
 * /partnerships/certified-clickup-partner use "thana" (Edward's request: those
 * two always route to Thana, whatever the region).
 *
 * Unlike the region desks, these book the consultant's own event type, which
 * they host, so the meeting lands on their real calendar and the slots offered
 * are their real free time (the same reasoning as SEA and IND in
 * regionBooking.ts).
 */

export const BOOKING_DESK_KEYS = ["thana"] as const
export type BookingDeskKey = (typeof BOOKING_DESK_KEYS)[number]

export interface BookingDesk {
  key: BookingDeskKey
  /** Who takes the call and owns the lead. */
  consultant: Consultant
  /** The event type booked against: availability, deep link and prefill. */
  booking: RegionBooking
  /**
   * The Region recorded on the monday lead. Pinned to the consultant's own
   * desk so Region and Owner agree, as they do for every other booking.
   */
  region: LeadRegion
}

export const BOOKING_DESKS: Record<BookingDeskKey, BookingDesk> = {
  thana: {
    key: "thana",
    consultant: {
      key: "thana",
      name: "Thana Witchawut",
      firstName: "Thana",
      calendlyUrl: "https://calendly.com/thana-fruitionservices/30min",
      eventTypeUuid: "4c6c527e-6057-4054-97c0-355ca492c4a6",
      availabilityTimezone: "Asia/Bangkok",
      mondayUserId: 95135535,
      prefill: { message: 1 },
      companyRequired: false,
    },
    // "30 Minute Meeting", hosted by Thana (verified against the Calendly API
    // 2026-11-13). One optional free-text question, so everything we collect
    // rides in a1.
    booking: {
      eventTypeUuid: "4c6c527e-6057-4054-97c0-355ca492c4a6",
      calendlyUrl: "https://calendly.com/thana-fruitionservices/30min",
      availabilityTimezone: "Asia/Bangkok",
      prefill: { message: 1 },
      companyRequired: false,
    },
    region: "SEA",
  },
}

/** The desk a request or a CMS value names, or undefined for "detect the region". */
export function deskFor(key: unknown): BookingDesk | undefined {
  return typeof key === "string" && (BOOKING_DESK_KEYS as readonly string[]).includes(key)
    ? BOOKING_DESKS[key as BookingDeskKey]
    : undefined
}

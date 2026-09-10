import type { LeadRegion } from "@/lib/leadNotify"

/**
 * The regional consultants: who covers each region, and their own 30-minute
 * Calendly links.
 *
 * Bookings no longer go to these personal links. The site briefly routed each
 * region to the consultant's own event type — that gave real, conflict-checked
 * availability, but it put website leads on private calendars the team can't
 * see, which is what Josh asked to have reverted. Booking now targets the
 * shared account's regional event types (see REGION_BOOKING in regionBooking).
 *
 * What this map still decides is *who the lead belongs to*: the monday owner,
 * and the name and face on the booking card. `calendlyUrl` survives as the
 * last-resort fallback if the shared calendar can't be reached at all.
 *
 * Verified against Calendly on 2026-07-31; Kevin's Europe/London zone
 * re-confirmed against the API 2026-09-02 (his monday profile says Zurich and
 * is the stale record).
 */

/**
 * Which Calendly `a<N>` answer slot each piece of our form maps to, 1-indexed
 * by the question's position on that consultant's booking page. Two pieces may
 * share a slot — Josh asks for company name and context in one box — in which
 * case the values are joined rather than one overwriting the other.
 */
export interface ConsultantPrefill {
  company?: number
  title?: number
  phone?: number
  message?: number
  /** A multi-select "which service?" question, answered with one choice. */
  service?: number
}

/**
 * Anything a booking link can be built against: a consultant's own event type,
 * or one of the shared account's regional ones (see REGION_BOOKING). Only these
 * three fields decide the URL, so both shapes go through buildBookingUrl.
 */
export interface BookingTarget {
  calendlyUrl: string
  availabilityTimezone: string
  prefill: ConsultantPrefill
}

export interface Consultant {
  /**
   * Stable id, used to say *which* consultant a slot belongs to once a region
   * pools more than one calendar. Sent back with the booking so the lead is
   * owned by whoever is actually on the call.
   */
  key: string
  /** Full name — must match the Sanity teamMember record, which supplies the photo. */
  name: string
  /** Used in visitor-facing copy: "You're booking with Josh". */
  firstName: string
  /** Public 30-minute event type. */
  calendlyUrl: string
  /** For the API-booking phase; needs a token that owns this event type. */
  eventTypeUuid: string
  /**
   * The event type's own availability timezone. Slots are requested in it and
   * the slot deep-link is rendered in it, because Calendly's booking page
   * matches the datetime path segment against the event's local time.
   */
  availabilityTimezone: string
  /** monday user id — must match REGION_OWNER_IDS in leadNotify. */
  mondayUserId: number
  prefill: ConsultantPrefill
  /**
   * Calendly rejects the booking without this answer, so the form must collect
   * a company name before handing off to Josh's or Zach's page.
   */
  companyRequired: boolean
}

/**
 * Who covers each region, in order of preference.
 *
 * Most regions have one consultant. Where there are several, their calendars
 * are pooled: the union of everyone's free slots is offered, and a time that
 * more than one of them has free is assigned to whoever comes first in this
 * list. So the first choice fills up before the next person is offered at all,
 * but the region never looks fully booked while someone is still free.
 */
/**
 * The consultant a monday user id belongs to, across every region.
 *
 * Used to render a booking in the timezone of the person actually taking the
 * call: `availabilityTimezone` is the zone their Calendly offers slots in, so
 * it is their working day by definition.
 */
export function consultantByMondayUserId(id: number | undefined): Consultant | undefined {
  if (id === undefined) return undefined
  for (const list of Object.values(REGION_CONSULTANTS)) {
    const hit = list.find((c) => c.mondayUserId === id)
    if (hit) return hit
  }
  return TEST_CONSULTANT.mondayUserId === id ? TEST_CONSULTANT : undefined
}

export const REGION_CONSULTANTS: Record<LeadRegion, Consultant[]> = {
  APAC: [
    {
      key: "josh",
      name: "Josh Jebathilak",
      firstName: "Josh",
      calendlyUrl: "https://calendly.com/fruitionservices/30-min-call-with-josh",
      eventTypeUuid: "a899de9b-33fa-44a4-bf78-8eca1dfffc66",
      availabilityTimezone: "Australia/Sydney",
      mondayUserId: 42426115,
      // One required box asking for company name *and* context — both go in it.
      prefill: { company: 1, message: 1 },
      companyRequired: true,
    },
  ],
  // Nikki alone. Thana was here as overflow while each region booked a personal
  // calendar and Nikki's own week could fill up; bookings now land on the shared
  // regional event type, so the pool only decides who owns the lead.
  SEA: [
    {
      key: "nikki",
      name: "Nikki Glucksman",
      firstName: "Nikki",
      calendlyUrl: "https://calendly.com/nikki-fruitionservices/30min",
      eventTypeUuid: "ef3e72ac-bf64-48ec-ac4b-04f2333463f8",
      availabilityTimezone: "Asia/Bangkok",
      mondayUserId: 74789722,
      prefill: { message: 1 },
      companyRequired: false,
    },
  ],
  IND: [
    {
      key: "nikhil",
      name: "Nikhil Tiwari",
      firstName: "Nikhil",
      calendlyUrl: "https://calendly.com/nikhil-fruitionservices/30min",
      eventTypeUuid: "860bb4cc-9bdc-4139-a775-e782144d2b60",
      availabilityTimezone: "Asia/Calcutta",
      mondayUserId: 65603104,
      prefill: { message: 1 },
      companyRequired: false,
    },
  ],
  UK: [
    {
      key: "kevin",
      name: "Kevin Zhao",
      firstName: "Kevin",
      calendlyUrl: "https://calendly.com/kevin-fruitionservices/30-minute-consultation-call",
      eventTypeUuid: "a59373f3-63ae-4399-b0e8-91c97d7f6ca8",
      availabilityTimezone: "Europe/London",
      mondayUserId: 62091155,
      prefill: { company: 1, title: 2, phone: 3, message: 4 },
      companyRequired: false,
    },
  ],
  NA: [
    {
      key: "zach",
      name: "Zach Weller",
      firstName: "Zach",
      calendlyUrl: "https://calendly.com/zach-fruition/30-minute-consultation-experts",
      eventTypeUuid: "a233e074-8eec-41cf-9c43-744a937aedbb",
      availabilityTimezone: "America/New_York",
      mondayUserId: 51981029,
      prefill: { company: 1, message: 2 },
      companyRequired: false,
    },
  ],
}

/**
 * Test-mode stand-in. With SCHEDULER_TEST_MODE=1 every region resolves to this
 * one calendar instead of the real pools, so a full end-to-end booking can be
 * run — including actually pressing Schedule on Calendly — without putting a
 * fake meeting on a consultant's calendar or notifying them.
 *
 * Deliberately env-gated rather than a code edit: the flag lives in
 * .env.local, which is gitignored, so this cannot reach production by being
 * forgotten in a commit. `name` must match the Sanity teamMember record or the
 * card falls back to initials.
 */
const TEST_CONSULTANT: Consultant = {
  key: "edward",
  name: "Edward Zehua Zhang",
  firstName: "Edward",
  calendlyUrl: "https://calendly.com/edward-fruitionservices/30min",
  eventTypeUuid: "30f608aa-27cd-45c0-b45d-77fb872f5e8f",
  availabilityTimezone: "Asia/Bangkok",
  mondayUserId: 100668573,
  prefill: { message: 1 },
  companyRequired: false,
}

/** True only when explicitly switched on for local testing. */
export function schedulerTestMode(): boolean {
  return process.env.SCHEDULER_TEST_MODE === "1"
}

/** Everyone covering a region — or the test calendar when test mode is on. */
export function poolFor(region: LeadRegion): Consultant[] {
  return schedulerTestMode() ? [TEST_CONSULTANT] : REGION_CONSULTANTS[region]
}

/**
 * The consultant a booking belongs to: the one whose slot was picked, or the
 * region's first choice when no specific host is known (an unknown key means a
 * stale client, so fall back rather than fail the booking).
 */
export function consultantFor(region: LeadRegion, key?: string): Consultant {
  const pool = poolFor(region)
  return pool.find((c) => c.key === key) ?? pool[0]
}

/**
 * Marks a booking that began with our on-site form, so the invitee.created
 * webhook promotes the lead we already created instead of adding a second item.
 * Distinct from "fruition-scheduler" (API-booked, already recorded, skip
 * entirely) and "fruition-fallback" (never recorded, create fresh).
 */
export const LEAD_FIRST_UTM_SOURCE = "fruition-leadfirst"

export interface BookingPrefill {
  name: string
  email: string
  company?: string
  title?: string
  phone?: string
  message?: string
  /** One of the event type's own service choices, or omitted. */
  service?: string
  /** Site path the visitor started from — carried as utm_content. */
  sourcePage?: string
  /** UTC ISO start of the slot the visitor picked on our own calendar. */
  startUtc?: string
  /**
   * The visitor's own timezone. Calendly's booking page renders in the
   * viewer's timezone, and the datetime in the link has to be expressed in
   * that same zone — see buildBookingUrl.
   */
  viewerTimezone?: string
}

/**
 * Wall-clock time in a timezone as an ISO string with its UTC offset, e.g.
 * "2026-08-03T10:00:00+01:00" — the shape Calendly expects in the datetime
 * path segment of a booking link.
 */
function isoInZone(utcIso: string, tz: string): string | null {
  const d = new Date(utcIso)
  if (Number.isNaN(d.getTime())) return null
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00"
  const local = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`
  // Reading the local wall-clock back as if it were UTC gives the offset.
  const offsetMin = Math.round((Date.parse(`${local}Z`) - d.getTime()) / 60000)
  const sign = offsetMin < 0 ? "-" : "+"
  const abs = Math.abs(offsetMin)
  const hh = String(Math.floor(abs / 60)).padStart(2, "0")
  const mm = String(abs % 60).padStart(2, "0")
  return `${local}${sign}${hh}:${mm}`
}

/**
 * The consultant's Calendly URL with the visitor's details filled in, and —
 * when they already picked a slot here — deep-linked straight to that time, so
 * confirming is one click rather than choosing all over again.
 */
export function buildBookingUrl(c: BookingTarget, lead: BookingPrefill): string {
  const params = new URLSearchParams({
    name: lead.name,
    email: lead.email,
    utm_source: LEAD_FIRST_UTM_SOURCE,
    utm_medium: "website",
  })
  if (lead.sourcePage) params.set("utm_content", lead.sourcePage)

  /*
   * The datetime must be the visitor's wall-clock, not the consultant's.
   * Calendly's booking page renders in the viewer's timezone and matches the
   * path segment against what it is displaying — hand it the event's zone
   * instead and it rejects the slot with "Sorry, that time is no longer
   * available", even though the time is free.
   *
   * month/date are belt-and-braces: if the path segment is ever ignored, the
   * visitor still lands on the right day rather than today.
   */
  const zone = lead.viewerTimezone || c.availabilityTimezone
  const localIso = lead.startUtc ? isoInZone(lead.startUtc, zone) : null
  if (localIso) {
    params.set("month", localIso.slice(0, 7))
    params.set("date", localIso.slice(0, 10))
  }

  // Collect per-slot so two answers sharing one box are joined, not clobbered.
  const slots = new Map<number, string[]>()
  const put = (slot: number | undefined, value?: string) => {
    const v = value?.trim()
    if (!slot || !v) return
    const list = slots.get(slot)
    if (list) list.push(v)
    else slots.set(slot, [v])
  }
  put(c.prefill.company, lead.company)
  put(c.prefill.title, lead.title)
  put(c.prefill.phone, lead.phone)
  put(c.prefill.message, lead.message)
  put(c.prefill.service, lead.service)
  for (const [slot, parts] of slots) params.set(`a${slot}`, parts.join("\n\n"))

  // URLSearchParams writes spaces as "+", and Calendly's widget re-encodes the
  // URL it is handed — turning that separator into a literal %2B, so "Alex
  // Morgan" prefills as "Alex+Morgan". Percent-encode spaces instead. Any real
  // "+" in a value (a phone number) is already %2B by this point, so only
  // separators are rewritten.
  const query = params.toString().replace(/\+/g, "%20")
  // Emitted verbatim, matching the links Calendly's own picker produces:
  // ".../2026-08-12T11:30:00+08:00?...". Percent-encoding it (%3A / %2B) makes
  // the page fail to resolve the slot. Both ":" and "+" are legal in a path
  // segment, and "+" only means space in a query string, so this is safe — the
  // value is generated by isoInZone, never user input, but assert the shape
  // anyway so nothing unexpected can reach the path.
  const safe = localIso && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(localIso)
  return safe
    ? `${c.calendlyUrl}/${localIso}?${query}`
    : `${c.calendlyUrl}?${query}`
}

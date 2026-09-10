import type { LeadRegion } from "@/lib/leadNotify"
import { REGION_BOOKING } from "@/lib/regionBooking"

/**
 * Thin server-side wrapper around the Calendly v2 API for the custom
 * scheduling component. The PAT lives in CALENDLY_API_TOKEN — never expose
 * it (or these calls) client-side.
 */

const CALENDLY_API = "https://api.calendly.com"

const EVENT_TYPE = (uuid: string) => `https://api.calendly.com/event_types/${uuid}`

/**
 * The shared account's regional event types, as full API URIs. Kept as a
 * derived view of REGION_BOOKING so the uuid used for availability can never
 * drift from the scheduling page the visitor is sent to.
 */
export const REGION_EVENT_TYPES: Record<LeadRegion, string> = Object.fromEntries(
  (Object.entries(REGION_BOOKING) as [LeadRegion, { eventTypeUuid: string }][]).map(
    ([region, b]) => [region, EVENT_TYPE(b.eventTypeUuid)],
  ),
) as Record<LeadRegion, string>

function getToken(): string {
  const t = process.env.CALENDLY_API_TOKEN
  if (!t) throw new Error("CALENDLY_API_TOKEN missing")
  return t
}

async function calendly<T>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${CALENDLY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  })
  const text = await r.text()
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    throw new Error(`calendly non-JSON ${r.status}: ${text.slice(0, 200)}`)
  }
  if (!r.ok) {
    const detail = (body as { message?: string; title?: string })?.message || (body as { title?: string })?.title || `HTTP ${r.status}`
    throw new Error(`calendly ${path.split("?")[0]} failed: ${detail}`)
  }
  return body as T
}

export interface CalendlySlot {
  /** UTC ISO start time */
  start: string
  /** Calendly's per-slot booking page (fallback when API booking fails) */
  url: string
}

/** Calendly caps `event_type_available_times` at a 7-day span per request. */
const WINDOW_DAYS = 7
/**
 * How far ahead to offer slots. Six windows ≈ 42 days, so the picker always
 * covers the rest of the current month plus all of the next one — a 14-day
 * horizon left the second half of the visible month looking fully booked even
 * though Calendly's own page offered those days.
 */
const HORIZON_WINDOWS = 6

/**
 * Available slots for a region's consultation event type, fetched as
 * consecutive 7-day windows in parallel and flattened.
 */
export async function getAvailableSlots(region: LeadRegion): Promise<CalendlySlot[]> {
  const eventType = REGION_EVENT_TYPES[region]
  // Start an hour out so we never offer a slot that expires mid-booking.
  const from = new Date(Date.now() + 60 * 60 * 1000)
  const span = WINDOW_DAYS * 86400_000
  const windows: [Date, Date][] = Array.from({ length: HORIZON_WINDOWS }, (_, i) => [
    new Date(from.getTime() + i * span),
    new Date(from.getTime() + (i + 1) * span),
  ])
  const results = await Promise.all(
    windows.map(async ([s, e]) => {
      try {
        const data = await calendly<{ collection: { start_time: string; scheduling_url: string; status: string }[] }>(
          `/event_type_available_times?event_type=${encodeURIComponent(eventType)}&start_time=${s.toISOString()}&end_time=${e.toISOString()}`,
        )
        return data.collection
      } catch (err) {
        console.warn("[scheduling] availability window failed:", err instanceof Error ? err.message : String(err))
        return []
      }
    }),
  )
  return results
    .flat()
    .filter((s) => s.status === "available")
    .map((s) => ({ start: s.start_time, url: s.scheduling_url }))
}

export interface BookingRequest {
  region: LeadRegion
  /** UTC ISO start time, must come from getAvailableSlots */
  start: string
  name: string
  email: string
  timezone: string
  phone?: string
  /** Site path the booking started from — carried as utm_content. */
  sourcePage?: string
}

/**
 * Book the slot via Calendly's create-invitee API. Marked with
 * utm_source=fruition-scheduler so the invitee.created webhook can tell
 * API-created bookings apart from ones made on calendly.com directly.
 * Throws when the API rejects (caller falls back to the slot URL).
 */
export async function createBooking(req: BookingRequest): Promise<{ inviteeUri: string }> {
  const data = await calendly<{ resource: { uri: string } }>("/invitees", {
    method: "POST",
    body: JSON.stringify({
      event_type: REGION_EVENT_TYPES[req.region],
      start_time: req.start,
      invitee: {
        name: req.name,
        email: req.email,
        timezone: req.timezone,
        ...(req.phone ? { text_reminder_number: req.phone } : {}),
      },
      tracking: {
        utm_source: "fruition-scheduler",
        utm_campaign: null,
        utm_medium: "website",
        utm_content: req.sourcePage ?? null,
        utm_term: null,
        salesforce_uuid: null,
      },
    }),
  })
  return { inviteeUri: data.resource.uri }
}

import { NextResponse } from "next/server"
import { createBooking } from "@/lib/calendlyClient"
import { detectRegion, pushMeetingToMonday, type LeadRegion } from "@/lib/leadNotify"
import { deskFor } from "@/lib/bookingDesks"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Books a consultation slot via the Calendly API and records the lead on the
 * ILE board with status "Meeting Booked". When Calendly rejects the API
 * booking (plan/eligibility edge cases), the client falls back to opening the
 * slot's own Calendly booking page — `fallbackUrl` — with details prefilled.
 */

interface BookRequest {
  start?: string
  slotUrl?: string
  firstName?: string
  lastName?: string
  /** Legacy single-field name — kept for back-compat with older clients */
  name?: string
  email?: string
  company?: string
  phone?: string
  /** "What can we help with?" selection — ILE Service Interest dropdown */
  service?: string
  notes?: string
  /** "How many people would use monday?" — extra line in the Message column */
  teamSize?: string
  /** "Which office should take this?" — extra line in the Message column */
  office?: string
  timezone?: string
  /** Site path the visitor booked from, e.g. "/monday-crm-consulting" */
  sourcePage?: string
  region?: LeadRegion
  /** A fixed desk (bookingDesks.ts key): one consultant, whatever the region. */
  desk?: string
  /** Spam honeypot — must be empty */
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let p: BookRequest
  try {
    p = (await req.json()) as BookRequest
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 })
  }
  if (p.website && p.website.trim()) return NextResponse.json({ ok: true })

  const firstName = (p.firstName ?? "").trim()
  const lastName = (p.lastName ?? "").trim()
  const name = [firstName, lastName].filter(Boolean).join(" ").trim() || (p.name ?? "").trim()
  const email = (p.email ?? "").trim()
  const start = (p.start ?? "").trim()
  const timezone = (p.timezone ?? "").trim() || "UTC"
  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
  if (!start || Number.isNaN(Date.parse(start))) {
    return NextResponse.json({ ok: false, error: "Pick a time slot first." }, { status: 400 })
  }

  const country = req.headers.get("cf-ipcountry") ?? undefined
  const desk = deskFor(p.desk)
  const region = desk ? desk.region : p.region ?? detectRegion({ country, timezone })
  // Only a same-origin path is accepted — this value is stored and echoed
  // back into Calendly tracking.
  const raw = (p.sourcePage ?? "").trim()
  const sourcePage = raw.startsWith("/") && !raw.startsWith("//") && raw.length <= 200 ? raw : undefined

  const fields: Record<string, string> = {
  }
  if (p.phone?.trim()) fields["Phone"] = p.phone.trim()
  if (p.service?.trim()) fields["Service"] = p.service.trim()
  if (p.notes?.trim()) fields["Message"] = p.notes.trim()
  if (p.teamSize?.trim()) fields["Team size"] = p.teamSize.trim()
  if (p.office?.trim()) fields["Preferred office"] = p.office.trim()

  let booked = false
  try {
    await createBooking({ region, eventTypeUuid: desk?.booking.eventTypeUuid, start, name, email, timezone, phone: p.phone?.trim(), sourcePage })
    booked = true
  } catch (err) {
    console.warn("[scheduling] api booking failed:", err instanceof Error ? err.message : String(err))
  }

  if (!booked) {
    // Client opens the Calendly slot page with details prefilled; the
    // invitee.created webhook will record the lead once they confirm there.
    // utm_source marks it as ours without matching the webhook's dedupe tag —
    // this booking was NOT recorded here, so the webhook must record it.
    const params = new URLSearchParams({ name, email, utm_source: "fruition-fallback" })
    if (sourcePage) params.set("utm_content", sourcePage)
    const fallbackUrl = p.slotUrl
      ? `${p.slotUrl}${p.slotUrl.includes("?") ? "&" : "?"}${params.toString()}`
      : null
    return NextResponse.json({ ok: false, fallbackUrl, error: "booking_api_failed" }, { status: 502 })
  }

  // Best-effort lead record — the meeting exists in Calendly regardless.
  const mondayId = await pushMeetingToMonday({
    meetingStart: start,
    meetingTz: timezone,
    name,
    email,
    company: p.company?.trim() || undefined,
    source: sourcePage ?? "scheduler",
    country,
    timezone,
    fields,
  })

  return NextResponse.json({ ok: true, mondayId: mondayId ?? undefined })
}

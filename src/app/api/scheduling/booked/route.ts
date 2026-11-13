import { NextResponse } from "next/server"
import { consultantFor } from "@/lib/consultants"
import { detectRegion, promoteLeadToBooked, type LeadRegion } from "@/lib/leadNotify"
import { deskFor } from "@/lib/bookingDesks"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Moves a lead to "Meeting Booked" when the visitor completes the booking
 * inside our embedded Calendly.
 *
 * Why this exists rather than relying on the invitee.created webhook: the
 * subscription is scope=user and belongs to the shared global-calendar account,
 * so it only fires for bookings on *that* calendar. Every booking in this flow
 * lands on a consultant's own Calendly account, which the webhook never sees —
 * the lead would sit in New Leads forever. An organization-scoped subscription
 * would cover all of them, but creating one needs a Calendly admin or owner
 * (this token is role `user` and gets 403), so it can't be done from here.
 *
 * The browser tells us instead: Calendly's embed emits a `calendly.event_scheduled`
 * postMessage on completion, and the client relays it here.
 *
 * Trust model: this request is unauthenticated and its claim is unverifiable —
 * reading the invitee back from Calendly needs access to the consultant's
 * account, which this token doesn't have. So it is deliberately limited to
 * advancing the status of a lead that already exists, and cannot create one.
 * The blast radius of a forged call is a lead marked "Meeting Booked" early;
 * no data is exposed and nothing is created. The webhook remains the
 * authoritative path once an admin can scope it to the organization — and it is
 * idempotent with this one, since both promote the same item.
 */

interface BookedRequest {
  email?: string
  /** UTC ISO start of the booked slot */
  start?: string
  timezone?: string
  region?: LeadRegion
  /** Consultant.key of whoever's calendar was booked */
  host?: string
  /** A fixed desk (bookingDesks.ts key): one consultant, whatever the region. */
  desk?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REGIONS: LeadRegion[] = ["APAC", "SEA", "IND", "NA", "UK"]

export async function POST(req: Request) {
  let p: BookedRequest
  try {
    p = (await req.json()) as BookedRequest
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 })
  }

  const email = (p.email ?? "").trim()
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
  }

  const country = req.headers.get("cf-ipcountry") ?? undefined
  const timezone = (p.timezone ?? "").trim() || "UTC"
  const desk = deskFor(p.desk)
  const region = desk
    ? desk.region
    : p.region && REGIONS.includes(p.region) ? p.region : detectRegion({ country, timezone, email })
  const consultant = desk ? desk.consultant : consultantFor(region, p.host)

  const fields: Record<string, string> = {}
  const startMs = p.start ? Date.parse(p.start) : NaN
  // Raw instant only — leadNotify renders it once it knows the owning desk.
  const meetingStart = Number.isNaN(startMs) ? undefined : new Date(startMs).toISOString()
  fields["Event"] = `30 Minute Meeting with ${consultant.name}`

  const mondayId = await promoteLeadToBooked(
    { email, timezone, region, ownerId: consultant.mondayUserId, meetingStart, meetingTz: timezone, fields },
    { createIfMissing: false },
  )

  // A miss is normal, not an error: the lead may have been screened elsewhere,
  // or the visitor booked with an address they didn't type into our form.
  return NextResponse.json({ ok: true, promoted: Boolean(mondayId), mondayId: mondayId ?? undefined })
}

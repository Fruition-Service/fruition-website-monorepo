import { after, NextResponse } from "next/server"
import { buildBookingUrl, consultantFor } from "@/lib/consultants"
import { REGION_BOOKING, SERVICE_CHOICES } from "@/lib/regionBooking"
import { detectRegion, pushSchedulerLead, type LeadRegion } from "@/lib/leadNotify"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Records a consultation enquiry *before* the visitor picks a slot, then hands
 * back the regional consultant's Calendly link with their details prefilled.
 *
 * The ordering is the point. With Calendly's embed alone a lead only exists if
 * the visitor completes a booking — everyone who opens the calendar and leaves
 * is invisible. Capturing here means the CRM sees every enquiry, and the
 * invitee.created webhook later promotes the ones that convert to
 * "Meeting Booked" (see promoteLeadToBooked) rather than creating a duplicate.
 *
 * The booking itself goes to the shared account's regional event type, so it
 * lands on the calendar the whole team can see. Which consultant owns the lead
 * is still decided here, by region — they are on the call, they just aren't the
 * calendar it sits on.
 */

interface LeadRequest {
  /** Full name — the form asks for one field */
  name?: string
  /** Split form of the same thing, kept so older clients keep working */
  firstName?: string
  lastName?: string
  email?: string
  company?: string
  /** Job title — ILE Title column, and prefilled where Calendly asks for it */
  title?: string
  phone?: string
  /** "What should we prepare for?" — ILE Service Interest dropdown */
  service?: string
  notes?: string
  /** "How many people would use it?" — extra line in the Message column */
  teamSize?: string
  timezone?: string
  /** UTC ISO start of the slot picked on our own calendar */
  start?: string
  /**
   * The region the slots were fetched for. Deriving it again here from
   * different inputs is how the old flow offered APAC slots and then booked
   * against SEA, so the client pins it.
   */
  region?: LeadRegion
  /**
   * Which consultant in the region's pool owns the chosen slot (Consultant.key).
   * Regions with one consultant ignore it; SEA pools two, so without it an
   * overflow slot would be booked against the wrong calendar.
   */
  host?: string
  /** Site path the visitor started from, e.g. "/monday-crm-consulting" */
  sourcePage?: string
  /** Spam honeypot — must be empty */
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REGIONS: LeadRegion[] = ["APAC", "SEA", "IND", "NA", "UK"]

export async function POST(req: Request) {
  let p: LeadRequest
  try {
    p = (await req.json()) as LeadRequest
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 })
  }
  // Honeypot: answer as though it worked, record nothing.
  if (p.website && p.website.trim()) {
    return NextResponse.json({ ok: true, bookingUrl: consultantFor("APAC").calendlyUrl })
  }

  const name =
    (p.name ?? "").trim() ||
    [(p.firstName ?? "").trim(), (p.lastName ?? "").trim()].filter(Boolean).join(" ")
  const email = (p.email ?? "").trim()
  const company = (p.company ?? "").trim()
  const timezone = (p.timezone ?? "").trim() || "UTC"
  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 })
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 })
  }

  const country = req.headers.get("cf-ipcountry") ?? undefined
  const region = p.region && REGIONS.includes(p.region) ? p.region : detectRegion({ country, timezone, email })
  const consultant = consultantFor(region, p.host)
  const target = REGION_BOOKING[region]
  // Only a slot we could plausibly have offered — a stale or bogus value would
  // deep-link Calendly to a time that isn't bookable.
  const startMs = p.start ? Date.parse(p.start) : NaN
  const startUtc = !Number.isNaN(startMs) && startMs > Date.now() ? new Date(startMs).toISOString() : undefined
  // Some event types reject a booking without a company name, so don't send
  // anyone to them empty-handed — the form asks for it either way.
  if (target.companyRequired && !company) {
    return NextResponse.json({ ok: false, error: "Company is required." }, { status: 400 })
  }

  // Only a same-origin path is accepted — this value is stored and echoed back
  // into Calendly tracking.
  const raw = (p.sourcePage ?? "").trim()
  const sourcePage = raw.startsWith("/") && !raw.startsWith("//") && raw.length <= 200 ? raw : undefined

  const title = (p.title ?? "").trim()
  const fields: Record<string, string> = {}
  if (p.phone?.trim()) fields["Phone"] = p.phone.trim()
  if (title) fields["Title"] = title
  if (p.service?.trim()) fields["Service"] = p.service.trim()
  if (p.notes?.trim()) fields["Message"] = p.notes.trim()
  if (p.teamSize?.trim()) fields["Team size"] = p.teamSize.trim()

  fields["Booking with"] = consultant.name

  // Straight onto the CRM — the booking flow is not screened by the lead
  // classifier, so nothing here is diverted to Website Enquiries.
  //
  // Still deferred with after(): the monday write is a couple of round trips,
  // and that delay would land squarely between the visitor pressing Continue
  // and the calendar appearing. The lead is recorded just as reliably a moment
  // later. Best-effort throughout — a CRM failure must never cost the visitor
  // their booking.
  after(async () => {
    try {
      await pushSchedulerLead({
        name,
        email,
        company: company || undefined,
        source: sourcePage ?? "scheduler",
        country,
        timezone,
        // Pin the desk *and* the person to whoever's calendar they booked
        // against, so Region and Owner name whoever will be on the call — in a
        // pooled region that is not always the region's first choice.
        region,
        ownerId: consultant.mondayUserId,
        meetingStart: startUtc || undefined,
        meetingTz: timezone,
        fields,
      })
    } catch (err) {
      console.warn("[scheduling] lead capture failed:", err instanceof Error ? err.message : String(err))
    }
  })

  // The regional event types have no "job title" question, so the title rides
  // along in the free-text box rather than being dropped.
  const service = p.service?.trim()
  const bookingUrl = buildBookingUrl(target, {
    name,
    email,
    company,
    title,
    phone: p.phone?.trim(),
    message: [title ? `Title: ${title}` : "", service, p.notes?.trim()].filter(Boolean).join(" — "),
    // Only an exact choice — Calendly rejects a multi-select answer that isn't
    // one of its own options, and our picker also offers "Other".
    service: service && SERVICE_CHOICES.has(service) ? service : undefined,
    sourcePage,
    startUtc,
    // The visitor's timezone decides how the slot is written into the link.
    viewerTimezone: timezone,
  })

  return NextResponse.json({
    ok: true,
    region,
    consultant: { key: consultant.key, name: consultant.name, firstName: consultant.firstName },
    bookingUrl,
  })
}

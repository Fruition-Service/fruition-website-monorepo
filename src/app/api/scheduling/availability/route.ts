import { NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/calendlyClient"
import { poolFor } from "@/lib/consultants"
import { REGION_BOOKING } from "@/lib/regionBooking"
import { detectRegion, type LeadRegion } from "@/lib/leadNotify"
import { getTeamMemberByName } from "@/sanity/queries"

export const runtime = "nodejs"
export const maxDuration = 30

const REGIONS: LeadRegion[] = ["APAC", "SEA", "IND", "NA", "UK"]

/**
 * Live consultation slots for the visitor's region, read from the shared
 * account's regional event type (see REGION_BOOKING). Region comes from
 * Cloudflare's cf-ipcountry, or the `region` query param when the visitor has
 * corrected it on the form; slots are UTC and the client renders them in the
 * visitor's timezone.
 *
 * Availability is the shared calendar's, so every slot in a region belongs to
 * the same booking page. The consultant is still returned with photo and role —
 * they are who takes the call and who owns the lead — and every slot is tagged
 * with them so the card has a face without a second round trip.
 *
 * The region is echoed back so the booking step targets the same event type the
 * slots came from — deriving it twice from different inputs is how the old flow
 * ended up offering APAC slots and then booking against SEA.
 */
export async function GET(req: Request) {
  const country = req.headers.get("cf-ipcountry") ?? undefined
  // The browser's own timezone, as a fallback for when cf-ipcountry is absent:
  // local dev, VPNs, and the "XX"/"T1" placeholders Cloudflare sends for some
  // networks. Without it a Singapore visitor with no geo header falls all the
  // way through to the APAC default and is shown the wrong consultant.
  // detectRegion still prefers the country header when it has one, so a real
  // geo signal always beats a client-supplied string.
  const url = new URL(req.url)
  const tz = (url.searchParams.get("tz") ?? "").slice(0, 64)
  // An explicit choice from the form's region switch beats any detection: a
  // visitor who says they are in the UK is the authority on that.
  const asked = url.searchParams.get("region") as LeadRegion | null
  const region =
    asked && REGIONS.includes(asked) ? asked : detectRegion({ country, timezone: tz || undefined })
  const pool = poolFor(region)

  // Photos and roles come from the same Sanity records as /fruition-team, so
  // the face on the booking card is the one the visitor sees elsewhere on the
  // site. Best-effort per person: a missing photo falls back to initials in the
  // UI, and never costs the visitor their slots.
  const consultants = await Promise.all(
    pool.map(async (c) => {
      let photoUrl: string | null = null
      let role: string | null = null
      try {
        const member = (await getTeamMemberByName(c.name)) as
          | { photoUrl?: string | null; role?: string | null }
          | null
        photoUrl = member?.photoUrl ?? null
        role = member?.role ?? null
      } catch (err) {
        console.warn(
          `[scheduling] consultant profile failed (${c.key}):`,
          err instanceof Error ? err.message : String(err),
        )
      }
      return { key: c.key, name: c.name, firstName: c.firstName, calendlyUrl: c.calendlyUrl, photoUrl, role }
    }),
  )

  // The region's own page, so a fallback lands on the same desk the visitor was
  // being shown rather than the site-wide generic link.
  const payload = { region, consultants, bookingUrl: REGION_BOOKING[region].calendlyUrl }
  // The booking embed only needs to know whose calendar to show. Computing
  // slots as well would mean five live Calendly round trips per page view for
  // data nothing renders.
  if (url.searchParams.get("host") === "1") {
    return NextResponse.json(payload, { headers: { "Cache-Control": "private, max-age=300" } })
  }
  try {
    // One shared calendar per region, so every slot carries the same host — the
    // consultant whose name and face the card shows.
    const host = pool[0]?.key ?? ""
    const slots = (await getAvailableSlots(region)).map((s) => ({ start: s.start, host }))
    return NextResponse.json(
      { ...payload, slots },
      { headers: { "Cache-Control": "private, max-age=120" } },
    )
  } catch (err) {
    console.error("[scheduling] availability failed:", err instanceof Error ? err.message : String(err))
    return NextResponse.json({ ...payload, slots: [], error: "unavailable" }, { status: 502 })
  }
}

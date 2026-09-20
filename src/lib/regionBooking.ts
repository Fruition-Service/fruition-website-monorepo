import type { ConsultantPrefill } from "@/lib/consultants"
import type { LeadRegion } from "@/lib/leadNotify"

/**
 * The regional consultations published on the shared
 * `global-calendar-fruitionservices` account — the calendar the team actually
 * runs on, and the one bookings are expected to land in.
 *
 * The site briefly booked each consultant's *personal* event type instead. That
 * gave genuinely conflict-checked availability, but it put website leads on
 * private calendars the rest of the team can't see, mixed in with everything
 * else those generic links are used for. That's the setup Josh asked to have
 * reverted, so booking targets these five again.
 *
 * The trade-off is inherent to a shared calendar and worth stating: these event
 * types carry the placeholder account's availability, not any one consultant's,
 * so a visitor can book over a real meeting. Region detection and the override
 * on the form stop people landing on the *wrong* desk; they don't stop a clash.
 * Adding the consultants as round-robin hosts is the fix, and has to be done in
 * the Calendly UI — the API can't set pooling.
 *
 * `prefill` maps our form fields onto each event type's own custom questions,
 * 1-indexed by their position on that booking page. The four original regions
 * were verified against the API on 2026-09-02; India & UAE was created the same
 * day and starts with only the default question.
 */
export interface RegionBooking {
  /** Event type UUID — used for availability and API booking. */
  eventTypeUuid: string
  /** Public scheduling page, deep-linked to the chosen slot. */
  calendlyUrl: string
  /** Fallback zone for the deep link; the visitor's own zone wins. */
  availabilityTimezone: string
  prefill: ConsultantPrefill
  /** The event type refuses a booking without a company name. */
  companyRequired: boolean
}

const BASE = "https://calendly.com/global-calendar-fruitionservices"

export const REGION_BOOKING: Record<LeadRegion, RegionBooking> = {
  // [Australia & New Zealand] — Company, Mobile, context (req), service (req)
  APAC: {
    eventTypeUuid: "50ec7db3-e50d-43e4-b9d2-5a3c0eecea9b",
    calendlyUrl: `${BASE}/apac-30-minute-consultation-clone-1`,
    availabilityTimezone: "Australia/Sydney",
    prefill: { company: 1, phone: 2, message: 3, service: 4 },
    companyRequired: false,
  },
  /*
   * [South-East Asia] — Nikki's own link, not the shared account's.
   *
   * The shared account's event types are all hosted by the global-calendar
   * placeholder, so the consultant was never a host and never got the calendar
   * invite: a booking on 21 Sep reached the CRM and nobody's diary. This one
   * has Nikki as the host, so the meeting lands on her real calendar and the
   * slots offered are her real free time.
   *
   * Questions differ from the shared account's: Mobile then industry/use case,
   * with no Company and no service picker, hence the shorter prefill map.
   */
  SEA: {
    eventTypeUuid: "d1e11e61-73f7-44a2-a6a3-0370fd9341cf",
    calendlyUrl: "https://calendly.com/d/d2br-mqx-p6n/south-east-asia-30-minute-consultation",
    availabilityTimezone: "Asia/Bangkok",
    prefill: { phone: 1, message: 2 },
    companyRequired: false,
  },
  /*
   * [India & UAE] — Nikhil's own link. Same reasoning as SEA above, and this
   * is the region where the missed booking actually happened.
   *
   * Replaces the solo event type created on 2026-09-02, which was hosted by
   * the placeholder and is now unused by the site.
   */
  IND: {
    eventTypeUuid: "4e0670e8-e9ba-4b07-833d-9230a6820082",
    calendlyUrl: "https://calendly.com/d/dtrs-m4y-hpc/india-uae-30-minute-consultation",
    availabilityTimezone: "Asia/Calcutta",
    prefill: { phone: 1, message: 2 },
    companyRequired: false,
  },
  /*
   * [UK & Europe] — Company, Mobile (req), monday.com URL (req), context (req),
   * service. We don't ask for a monday URL, so a3 is left for the visitor to
   * fill on Calendly; everything else arrives prefilled.
   */
  UK: {
    eventTypeUuid: "24539274-650a-47ec-994b-a19bc1026437",
    calendlyUrl: `${BASE}/30-minute-consultation`,
    availabilityTimezone: "Australia/Sydney",
    prefill: { company: 1, phone: 2, message: 4, service: 5 },
    companyRequired: false,
  },
  // [US & Canada] — Company, Mobile, industry/use case (req), service (req)
  NA: {
    eventTypeUuid: "e5644214-e726-4cc7-865b-6fcc9f992139",
    calendlyUrl: `${BASE}/30-minute-consultation-apac-clone-1`,
    availabilityTimezone: "Australia/Sydney",
    prefill: { company: 1, phone: 2, message: 3, service: 4 },
    companyRequired: false,
  },
}

/**
 * The service picker's options, which are also the answer choices on the
 * regional event types. A value outside this set (our "Other") is dropped
 * rather than sent, because Calendly rejects a multi-select answer that isn't
 * one of its own choices.
 */
export const SERVICE_CHOICES = new Set(["monday.com", "HubSpot", "ClickUp", "Make", "n8n", "Aircall"])

/**
 * Where a visitor goes when everything else fails: live availability is down,
 * or the region never resolved.
 *
 * Deliberately the Australia desk rather than the shared account's root page.
 * That root lists every event type at once and makes the visitor pick a region
 * themselves, which is both a worse experience and the thing that sent a US
 * lead to the ANZ desk. Region detection already defaults to APAC, so this
 * keeps the fallback link consistent with the fallback region.
 */
export const FALLBACK_BOOKING_URL = REGION_BOOKING.APAC.calendlyUrl

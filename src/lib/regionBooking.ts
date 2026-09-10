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
  // [South-East Asia] — Company, Mobile, industry/use case (req), service (req)
  SEA: {
    eventTypeUuid: "b46e38ae-b292-47f1-a348-45274bb7e64d",
    calendlyUrl: `${BASE}/30min`,
    availabilityTimezone: "Australia/Sydney",
    prefill: { company: 1, phone: 2, message: 3, service: 4 },
    companyRequired: false,
  },
  /*
   * [India & UAE] — created 2026-09-02 so IND stops riding on South-East Asia.
   * The API can't set custom questions, so this one still has only Calendly's
   * default free-text box; add Company / Mobile / service in the UI to match
   * the others and the prefill map below needs updating with it.
   */
  IND: {
    eventTypeUuid: "f348d4a5-8334-482d-bf6e-96d96ec97f4e",
    calendlyUrl: `${BASE}/india-uae-30-minute-consultation`,
    availabilityTimezone: "Australia/Sydney",
    prefill: { message: 1 },
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

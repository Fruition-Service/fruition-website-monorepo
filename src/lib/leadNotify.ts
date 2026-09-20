import { classifyLead, type EnquiryCategory } from "@/lib/leadClassify"
import { changeColumnValues, createItem, createUpdate, findItemByColumnValue, moveItemToGroup, moveItemToGroupTop } from "@/lib/mondayClient"
import { consultantByMondayUserId } from "@/lib/consultants"
import { formatMeetingTime } from "@/lib/meetingTime"

/**
 * Shared lead-notification sinks used by the intake forms.
 *
 * Every submission is first screened by an LLM classifier (leadClassify):
 * vendor pitches and other non-leads land on the Website Enquiries board
 * instead of a CRM, grouped by category with the classifier's reason. The
 * classifier fails open — when it errors, the submission is treated as a lead.
 *
 * monday.com is the primary sink: leads land as structured items on Fruition
 * CRM (ILE) — the Inbound Lead Engine board, counterpart to Fruition CRM
 * (OLE) — with Region (APAC/NA/UK) and Country as columns. Bookings go to the
 * "Meeting Booked" group with that status; the plain-lead path uses New Leads.
 * Region detection: Cloudflare's cf-ipcountry header, then the invitee
 * timezone, then the phone country code, then the email TLD, else APAC.
 *
 * Each answer lands in its own column — phone, company, service, meeting
 * logistics — so the notes column holds only what the visitor actually wrote.
 *
 * Failure ladder — a lead is never lost:
 *   ILE board → env-configured fallback board (Website Enquiries) →
 *   Slack (#website-leads-rb2b; routes post there only when monday failed).
 *
 * Env:
 *   SLACK_BOT_TOKEN          — bot with chat:write to the channel
 *   SLACK_LEADS_CHANNEL_ID   — fallback channel
 *   MONDAY_LEADS_BOARD_ID    (optional) — fallback board id (Website Enquiries)
 *   MONDAY_LEADS_GROUP_ID    (optional) — fallback group, default "Other Enquiries"
 *   MONDAY_LEADS_EMAIL_COLUMN(optional) — fallback email column, default "lead_email"
 *   MONDAY_LEADS_NOTES_COLUMN(optional) — fallback long_text column, default "long_text66rcx0qu"
 *   MONDAY_LEADS_COMPANY_COLUMN(optional) — fallback text column, default "company_name"
 */
export interface LeadPayload {
  name?: string
  email?: string
  company?: string
  /** Which form/page the lead came from */
  source?: string
  /** ISO 3166-1 alpha-2 visitor country (from Cloudflare's cf-ipcountry) */
  country?: string
  /** IANA timezone (e.g. a Calendly invitee's) — used when there's no geo header */
  timezone?: string
  /**
   * The desk this lead is already committed to. Set it when the caller has
   * *acted* on a region — the scheduler shows one consultant's calendar and
   * hands off to that consultant, so re-deriving here from timezone would
   * assign the lead to someone who isn't on the call. Omitted means detect.
   */
  region?: LeadRegion
  /**
   * monday user id to own this lead, when the caller knows the specific person
   * rather than just the desk — a pooled region can hand a booking to someone
   * other than its first-choice consultant. Falls back to REGION_OWNER_IDS.
   */
  ownerId?: number
  /**
   * A booking's UTC instant, straight from Calendly. Pass this rather than a
   * pre-formatted string: only this module knows which consultant ends up
   * owning the lead, and the board renders the time in *their* zone.
   */
  meetingStart?: string
  /** The invitee's IANA zone, shown as a second line when it differs. */
  meetingTz?: string
  /** Free-form additional answers keyed by label */
  fields?: Record<string, string>
}

export type LeadRegion = "APAC" | "SEA" | "IND" | "NA" | "UK"

/**
 * A booking rendered for the board, in the timezone of the consultant who owns
 * it. Falls back to any pre-formatted "Meeting time" a caller still supplies.
 */
function meetingTimeFor(p: LeadPayload, ownerId: number | undefined): string | undefined {
  if (!p.meetingStart) return p.fields?.["Meeting time"]
  const hostTz = consultantByMondayUserId(ownerId)?.availabilityTimezone
  return formatMeetingTime(p.meetingStart, p.meetingTz ?? p.timezone, hostTz)
}

interface LeadBoard {
  boardId: number
  groupId: string
  /**
   * Column ids on that board. Omitted keys mean the board has no such column;
   * anything that can't land in a column is posted as an item update instead.
   */
  cols: {
    email: string
    contactName?: string
    /** People column — gets the regional owner */
    owner?: string
    phone?: string
    company?: string
    /** Text column for the contact's job title */
    title?: string
    status?: string
    /** Status column — gets the label "Website" */
    source?: string
    /** Status column — gets the detected APAC/NA/UK region label */
    region?: string
    utmSource?: string
    /** Link column — the source page as a clickable absolute URL */
    pageLink?: string
    creationDate?: string
    /** Country-type column — gets {countryCode, countryName} */
    country?: string
    /** Long-text column for meeting logistics (time, event name) */
    nextSteps?: string
    /** Dropdown column receiving the form's "What can we help with?" selection */
    serviceInterest?: string
    notes?: string
  }
}

/**
 * Fruition CRM (ILE) — the Inbound Lead Engine board, sibling of Fruition
 * CRM (OLE). Every website lead lands here (item name = person, company in
 * text3 per the OLE convention). Column ids verified 2026-07-29.
 */
const ILE_BOARD: LeadBoard = {
  boardId: 5030276917,
  groupId: "topics",
  cols: {
    email: "lead_email",
    owner: "people",
    phone: "lead_phone",
    company: "text3",
    title: "text_mm2wbjym",
    status: "lead_status",
    source: "color_mm2wasnj",
    region: "region",
    utmSource: "short_textqfwxowxd",
    pageLink: "link_mm43mwnz",
    creationDate: "mirror4",
    country: "country_mm345qer",
    serviceInterest: "dropdown_mm5qr1ha",
    nextSteps: "long_text_mm2wddv8",
    notes: "message",
  },
}

/**
 * Bookings are created straight into "Meeting Booked" rather than New Leads.
 * A board automation fires on item-creation in the New Leads group and resets
 * Status to "New Lead", overwriting our write a second later; creating in the
 * destination group means that trigger never fires.
 */
export const ILE_BOOKING_GROUP = "new_group__1"

/**
 * Source marker for a booking made on calendly.com with no page attribution.
 * The webhook sets it; pushToBoard turns it into the "Calendly (direct)" label
 * so these never count as website-driven.
 */
export const CALENDLY_DIRECT_SOURCE = "calendly"

/** Absolute base for the Link column — monday needs a full URL, not a path. */
const SITE_ORIGIN = "https://fruitionservices.io"

/**
 * Website Enquiries board (5030270944) — where non-lead submissions land,
 * grouped by classifier category. Same lead-shaped column ids as the CRMs so
 * a misclassified enquiry moves back to a CRM cleanly.
 */
const ENQUIRIES_BOARD: LeadBoard = {
  boardId: 5030270944,
  groupId: "group_mm5qewhh",
  cols: {
    email: "lead_email",
    contactName: "text3",
    phone: "lead_phone",
    company: "company_name",
    utmSource: "short_textqfwxowxd",
    creationDate: "mirror4",
    notes: "long_text66rcx0qu",
  },
}

const ENQUIRY_GROUPS: Record<Exclude<EnquiryCategory, "lead">, { groupId: string; label: string }> = {
  vendor_pitch: { groupId: "group_mm5q3z6d", label: "Vendor Pitch" },
  spam: { groupId: "group_mm5q36a1", label: "Spam / Fake" },
  job_application: { groupId: "group_mm5qewhh", label: "Job Application" },
  other: { groupId: "group_mm5qewhh", label: "Other" },
}

/**
 * Regional desks. Each region maps to the consultant who owns its leads, the
 * Region column label, and the Calendly calendar whose availability is shown.
 * "IND" covers India + UAE — the board label is "I&UAE".
 */
export const REGION_OWNER_IDS: Record<LeadRegion, number> = {
  APAC: 42426115, // Josh Jebathilak
  // SEA and IND used to fall to Josh because the shared calendar had no event
  // type for either. Both now book into their own consultant's Calendly (see
  // REGION_CONSULTANTS), so the person on the call owns the lead again.
  SEA: 74789722, // Nikki Glucksman
  IND: 65603104, // Nikhil Kumar Tiwari
  UK: 62091155, // Kevin Zhao
  NA: 51981029, // Zach Weller
}

/** Region column labels — only IND differs from the region key. */
const REGION_LABELS: Record<LeadRegion, string> = {
  APAC: "APAC",
  SEA: "SEA",
  IND: "I&UAE",
  UK: "UK",
  NA: "NA",
}

// Country → desk. Sets are disjoint; anything unlisted falls through to APAC
// (Australia/NZ and the rest of Asia-Pacific, the HQ desk).
const IND_COUNTRIES = new Set("IN AE".split(" "))
const SEA_COUNTRIES = new Set("SG MY PH ID TH VN MM KH LA BN TL".split(" "))
const NA_COUNTRIES = new Set(
  "US CA MX BR AR CL CO PE VE EC UY PY BO CR PA GT HN SV NI DO CU JM TT BS BB HT GY SR BZ PR".split(" "),
)
const UK_COUNTRIES = new Set(
  (
    "GB IE FR DE ES IT PT NL BE LU CH AT SE NO DK FI IS PL CZ SK HU RO BG GR HR SI RS BA MK ME AL EE LV LT UA MD XK CY MT AD MC SM LI " +
    "SA QA KW BH OM IL JO LB IQ TR EG MA DZ TN LY ZA NG KE GH ET TZ UG ZW ZM MZ BW SN CI CM CD AO RW MW MU MG"
  ).split(" "),
)

// International dial prefixes unambiguous enough to route on.
const IND_PHONE_PREFIXES = ["+91", "+971"]
const SEA_PHONE_PREFIXES = ["+65", "+60", "+63", "+62", "+66", "+84", "+95", "+855", "+856", "+673"]
const UK_PHONE_PREFIXES = [
  "+44", "+353", "+33", "+49", "+34", "+39", "+31", "+32", "+41", "+43", "+46", "+47", "+45",
  "+358", "+48", "+351", "+30", "+90", "+966", "+972", "+974", "+965", "+973", "+968",
  "+27", "+20", "+212", "+234", "+254",
]

const NA_TLDS = new Set(["us", "ca", "mx", "br", "ar", "cl", "co"])
const IND_TLDS = new Set(["in", "ae"])
const SEA_TLDS = new Set(["sg", "my", "ph", "id", "th", "vn"])
const UK_TLDS = new Set([
  "uk", "ie", "fr", "de", "es", "it", "nl", "be", "ch", "at", "se", "no", "dk", "fi", "pl",
  "pt", "gr", "tr", "sa", "il", "za", "eg", "ng", "ke",
])

function regionFromPhone(phone: string): LeadRegion | null {
  const digits = phone.replace(/[^\d+]/g, "")
  // National formats (leading 0) are ambiguous — only route on +country codes.
  if (!digits.startsWith("+")) return null
  if (digits.startsWith("+1")) return "NA"
  if (IND_PHONE_PREFIXES.some((p) => digits.startsWith(p))) return "IND"
  if (SEA_PHONE_PREFIXES.some((p) => digits.startsWith(p))) return "SEA"
  if (UK_PHONE_PREFIXES.some((p) => digits.startsWith(p))) return "UK"
  return null
}

const IND_TIMEZONES = new Set("Asia/Kolkata Asia/Calcutta Asia/Dubai".split(" "))
const SEA_TIMEZONES = new Set(
  ("Asia/Singapore Asia/Kuala_Lumpur Asia/Manila Asia/Jakarta Asia/Bangkok Asia/Ho_Chi_Minh " +
    "Asia/Saigon Asia/Yangon Asia/Phnom_Penh Asia/Vientiane Asia/Brunei Asia/Makassar").split(" "),
)
// Middle-East zones the UK desk covers; UAE belongs to the India desk above.
const UK_TIMEZONES = new Set(
  ("Asia/Jerusalem Asia/Tel_Aviv Asia/Riyadh Asia/Qatar Asia/Kuwait Asia/Bahrain " +
    "Asia/Muscat Asia/Beirut Asia/Amman Asia/Baghdad Asia/Istanbul Europe/Istanbul").split(" "),
)

/** Region from an IANA timezone — the fallback when there's no geo header. */
function regionFromTimezone(tz?: string): LeadRegion | null {
  if (!tz) return null
  if (IND_TIMEZONES.has(tz)) return "IND"
  if (SEA_TIMEZONES.has(tz)) return "SEA"
  if (/^America\//.test(tz)) return "NA"
  if (/^(Europe|Africa)\//.test(tz)) return "UK"
  if (UK_TIMEZONES.has(tz)) return "UK"
  return null
}

/**
 * ISO-3166 country for the common IANA zones. Bookings made on Calendly
 * arrive server-to-server with no cf-ipcountry, but always carry the
 * invitee's timezone. Unknown zones return undefined rather than a guess.
 */
const TIMEZONE_COUNTRY: Record<string, string> = {
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US",
  "America/Detroit": "US", "America/Indiana/Indianapolis": "US", "Pacific/Honolulu": "US",
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA",
  "America/Winnipeg": "CA", "America/Halifax": "CA",
  "America/Mexico_City": "MX", "America/Sao_Paulo": "BR", "America/Bogota": "CO",
  "America/Buenos_Aires": "AR", "America/Santiago": "CL",
  "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Paris": "FR", "Europe/Berlin": "DE",
  "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Amsterdam": "NL", "Europe/Brussels": "BE",
  "Europe/Zurich": "CH", "Europe/Vienna": "AT", "Europe/Stockholm": "SE", "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK", "Europe/Helsinki": "FI", "Europe/Warsaw": "PL", "Europe/Prague": "CZ",
  "Europe/Lisbon": "PT", "Europe/Athens": "GR", "Europe/Istanbul": "TR",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
  "Australia/Perth": "AU", "Australia/Adelaide": "AU", "Australia/Hobart": "AU",
  "Australia/Canberra": "AU", "Australia/Darwin": "AU",
  "Pacific/Auckland": "NZ", "Asia/Singapore": "SG", "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  "Asia/Manila": "PH", "Asia/Tokyo": "JP", "Asia/Hong_Kong": "HK", "Asia/Shanghai": "CN",
  "Asia/Dubai": "AE", "Asia/Jakarta": "ID", "Asia/Bangkok": "TH", "Asia/Kuala_Lumpur": "MY",
  "Asia/Seoul": "KR", "Asia/Jerusalem": "IL", "Africa/Johannesburg": "ZA", "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE", "Africa/Cairo": "EG",
}

export function countryFromTimezone(tz?: string): string | undefined {
  return tz ? TIMEZONE_COUNTRY[tz.trim()] : undefined
}

export function detectRegion(p: LeadPayload): LeadRegion {
  const country = p.country?.trim().toUpperCase()
  if (country && /^[A-Z]{2}$/.test(country) && country !== "XX" && country !== "T1") {
    if (IND_COUNTRIES.has(country)) return "IND"
    if (SEA_COUNTRIES.has(country)) return "SEA"
    if (NA_COUNTRIES.has(country)) return "NA"
    if (UK_COUNTRIES.has(country)) return "UK"
    return "APAC"
  }
  const byTz = regionFromTimezone(p.timezone)
  if (byTz) return byTz
  const phone = p.fields?.["Phone"]
  if (phone) {
    const byPhone = regionFromPhone(phone)
    if (byPhone) return byPhone
  }
  const tld = p.email?.split(".").pop()?.toLowerCase()
  if (tld) {
    if (IND_TLDS.has(tld)) return "IND"
    if (SEA_TLDS.has(tld)) return "SEA"
    if (NA_TLDS.has(tld)) return "NA"
    if (UK_TLDS.has(tld)) return "UK"
  }
  return "APAC"
}

export function fmtDetails(p: LeadPayload): string {
  const lines: string[] = []
  if (p.company) lines.push(`Company: ${p.company}`)
  if (p.source) lines.push(`Source: ${p.source}`)
  if (p.country) lines.push(`Country: ${p.country}`)
  for (const [k, v] of Object.entries(p.fields ?? {})) {
    if (v && String(v).trim()) lines.push(`${k}: ${v}`)
  }
  return lines.join("\n")
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

/** "US" → "United States"; falls back to the code if ICU data is missing. */
function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code
  } catch {
    return code
  }
}

export async function notifySlack(p: LeadPayload): Promise<boolean> {
  const token = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_LEADS_CHANNEL_ID
  if (!token || !channel) {
    console.warn("[leads] SLACK_BOT_TOKEN or SLACK_LEADS_CHANNEL_ID missing, skipping Slack")
    return false
  }
  const detail = fmtDetails(p)
  const text = `:tada: *New lead${p.source ? ` — ${p.source}` : ""}*\n*${p.name}* <${p.email}>${detail ? `\n${detail}` : ""}`
  try {
    const r = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channel, text }),
    })
    const body = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!body.ok) console.warn(`[leads] slack not ok: ${body.error ?? "unknown"} http=${r.status}`)
    return !!body.ok
  } catch (err) {
    console.warn("[leads] slack threw:", errMsg(err))
    return false
  }
}

/**
 * monday fails an entire change_multiple_column_values call when any single
 * value is malformed — a phone number with spaces once cost us the status,
 * region, company and meeting details on a real booking. The error names the
 * offending column, so drop that one and retry rather than losing everything.
 * Returns false only if nothing could be written.
 */
async function writeColumnsDroppingRejects(
  boardId: number,
  itemId: string,
  cols: Record<string, unknown>,
  label: string,
): Promise<boolean> {
  const remaining = { ...cols }
  // Bounded: each pass removes one column, so this can't spin.
  for (let attempt = 0; attempt < 5; attempt++) {
    if (Object.keys(remaining).length === 0) return false
    try {
      // createLabelsIfMissing: a novel Service or Source label must never
      // reject the whole write.
      await changeColumnValues(boardId, itemId, remaining, { createLabelsIfMissing: true })
      return true
    } catch (err) {
      const rejected = /"column_id":\s*"([^"]+)"/.exec(errMsg(err))?.[1]
      if (!rejected || !(rejected in remaining)) {
        console.warn(`[leads] monday ${label} write failed:`, errMsg(err))
        return false
      }
      console.warn(`[leads] monday ${label} rejected column ${rejected}, retrying without it`)
      delete remaining[rejected]
    }
  }
  return false
}

async function pushToBoard(
  p: LeadPayload,
  rb: LeadBoard,
  label: string,
  statusLabel = "New Lead",
): Promise<string | null> {
  let itemId: string
  try {
    itemId = await createItem(rb.boardId, rb.groupId, p.name || p.email || "New lead")
  } catch (err) {
    console.warn(`[leads] monday ${label} create failed:`, errMsg(err))
    return null
  }

  // create_item appends to the bottom of the group; surface the lead at the
  // top instead. Position is cosmetic — never fail the lead over it.
  try {
    await moveItemToGroupTop(itemId, rb.groupId)
  } catch (err) {
    console.warn(`[leads] monday ${label} reposition failed:`, errMsg(err))
  }

  const c = rb.cols
  const cols: Record<string, unknown> = {}
  if (p.email) cols[c.email] = { email: p.email, text: p.email }
  if (p.name && c.contactName) cols[c.contactName] = p.name
  // monday's phone column rejects spaces and punctuation outright, and one
  // rejected value fails the WHOLE write — so normalise to +digits here.
  const phone = p.fields?.["Phone"]?.replace(/[^\d+]/g, "")
  if (phone && c.phone) cols[c.phone] = { phone }
  const company = p.company?.trim() || p.fields?.["Company"]?.trim()
  if (company && c.company) cols[c.company] = company
  const jobTitle = p.fields?.["Title"]?.trim()
  if (jobTitle && c.title) cols[c.title] = jobTitle
  if (c.status) cols[c.status] = { label: statusLabel }
  // "calendly" is the marker the webhook uses when a booking carries no page
  // attribution — i.e. it was made straight on calendly.com, not on the site.
  // Labelling those "Website" would inflate the website's measured impact.
  const fromSite = p.source !== CALENDLY_DIRECT_SOURCE
  if (c.source) cols[c.source] = { label: fromSite ? "Website" : "Calendly (direct)" }
  if (p.source && c.utmSource) cols[c.utmSource] = p.source
  /*
   * The same page, as something you can actually click. utm_source holds a bare
   * path ("/monday-partner-australia"), which monday renders as inert text, so
   * nobody could get from a lead to the page that produced it. Older rows have
   * the path without its leading slash, hence the normalising.
   *
   * Only a real site path becomes a link: "scheduler" and "calendly" are
   * markers, not pages.
   */
  const pagePath = p.source?.trim()
  if (pagePath && c.pageLink && pagePath !== CALENDLY_DIRECT_SOURCE && pagePath !== "scheduler") {
    const path = pagePath.startsWith("/") ? pagePath : `/${pagePath}`
    if (!path.startsWith("//")) {
      cols[c.pageLink] = { url: `${SITE_ORIGIN}${path}`, text: path }
    }
  }
  if (c.creationDate) cols[c.creationDate] = { date: new Date().toISOString().slice(0, 10) }
  const region = p.region ?? detectRegion(p)
  if (c.region) cols[c.region] = { label: REGION_LABELS[region] }
  // Route to whoever owns this lead — the specific consultant when the caller
  // named one, otherwise the region's desk — so nothing sits unassigned.
  const ownerId = p.ownerId ?? REGION_OWNER_IDS[region]
  if (c.owner) cols[c.owner] = { personsAndTeams: [{ id: ownerId, kind: "person" }] }
  const headerCc = p.country?.trim().toUpperCase()
  const cc = headerCc && /^[A-Z]{2}$/.test(headerCc) ? headerCc : countryFromTimezone(p.timezone)
  if (cc && c.country) {
    cols[c.country] = { countryCode: cc, countryName: countryName(cc) }
  }
  const service = p.fields?.["Service"]?.trim()
  if (service && c.serviceInterest) cols[c.serviceInterest] = { labels: [service] }
  // Now that the owner is known, the meeting can be written in their own
  // wall-clock time — see meetingTime.ts for why a raw instant is never enough.
  const meetingLine = meetingTimeFor(p, ownerId)
  const fields = meetingLine ? { ...p.fields, "Meeting time": meetingLine } : p.fields
  // Meeting logistics belong with the next action, not in the visitor's message.
  const logistics = [meetingLine, fields?.["Event"]]
    .map((v) => v?.trim())
    .filter(Boolean)
  if (logistics.length > 0 && c.nextSteps) cols[c.nextSteps] = { text: logistics.join("\n") }
  const detail = fmtDetails({ ...p, fields })
  // The notes column carries only the visitor's actual message plus any
  // unmapped extra fields — Phone/Service/Message are excluded because they
  // land in their own columns. The item update below keeps the full dump.
  const message = (p.fields?.["Message"] ?? "").trim()
  // Keys that have their own column — never duplicated into the notes blob.
  // "Meeting time"/"Event" stay here only when the board has no Next Steps
  // column (the Enquiries fallback), so the detail isn't silently lost.
  const reserved = ["Message", "Phone", "Service", "Company", "Title"]
  if (c.nextSteps) reserved.push("Meeting time", "Event")
  const extras = Object.entries(fields ?? {})
    .filter(([k, v]) => !reserved.includes(k) && v && String(v).trim())
    .map(([k, v]) => `${k}: ${v}`)
  let notesValue = [message, extras.join("\n")].filter(Boolean).join("\n\n")
  // Some notes columns are single-line text — cap the column value and rely
  // on the item update below for the full text.
  if (notesValue.length > 1900) notesValue = `${notesValue.slice(0, 1900)}…`
  if (notesValue && c.notes) cols[c.notes] = { text: notesValue }

  const wrote = await writeColumnsDroppingRejects(rb.boardId, itemId, cols, label)
  if (!wrote) {
    // Nothing landed — fall back to the two fields that matter most so the
    // lead is still actionable.
    console.warn(`[leads] monday ${label} columns failed, retrying minimal`)
    const minimal: Record<string, unknown> = {}
    if (p.email) minimal[c.email] = { email: p.email, text: p.email }
    if (notesValue && c.notes) minimal[c.notes] = { text: notesValue }
    try {
      await changeColumnValues(rb.boardId, itemId, minimal)
    } catch {
      // Item already exists with its name — better a bare item than no lead.
    }
  }

  // Post the full payload as an item update when the board has no notes
  // column, or when the message is long enough that a text column clips it —
  // the update remains the complete audit record of the submission.
  if (detail && (!c.notes || detail.length > 500)) {
    try {
      await createUpdate(itemId, `Website form submission\n${detail}`)
    } catch (err) {
      console.warn(`[leads] monday ${label} update failed:`, errMsg(err))
    }
  }
  return itemId
}

function fallbackBoard(): LeadBoard | null {
  const boardId = Number(process.env.MONDAY_LEADS_BOARD_ID)
  if (!boardId) return null
  return {
    boardId,
    groupId: process.env.MONDAY_LEADS_GROUP_ID || "group_mm5qewhh",
    cols: {
      email: process.env.MONDAY_LEADS_EMAIL_COLUMN || "lead_email",
      contactName: "text3",
      phone: "lead_phone",
      company: process.env.MONDAY_LEADS_COMPANY_COLUMN || "company_name",
      status: "lead_status",
      source: "source",
      utmSource: "short_textqfwxowxd",
      creationDate: "mirror4",
      notes: process.env.MONDAY_LEADS_NOTES_COLUMN || "long_text66rcx0qu",
    },
  }
}

/**
 * A confirmed consultation booking from the website scheduler. Skips the
 * classifier (a booked meeting is a lead by definition) and lands on the ILE
 * board with status "Meeting Booked".
 */
export async function pushMeetingToMonday(p: LeadPayload): Promise<string | null> {
  const viaIle = await pushToBoard(
    p,
    { ...ILE_BOARD, groupId: ILE_BOOKING_GROUP },
    "ILE:booking",
    "Meeting Booked",
  )
  if (viaIle) return viaIle
  const fallback = fallbackBoard()
  if (!fallback) return null
  return pushToBoard(p, fallback, "fallback:booking")
}

/**
 * Promote the lead a visitor created on our own form to "Meeting Booked" once
 * they finish on Calendly.
 *
 * The form records the lead *before* the calendar step — that's the point of
 * the flow, it captures the people who never pick a slot — so by the time
 * invitee.created arrives the item already exists. Creating another one here
 * would give every completed booking a duplicate in the CRM.
 *
 * Falls back to creating when no lead matches: the booking is real either way,
 * and a stray extra item beats a lost meeting.
 */
export async function promoteLeadToBooked(
  p: LeadPayload,
  opts: { createIfMissing?: boolean } = {},
): Promise<string | null> {
  const { createIfMissing = true } = opts
  const email = p.email?.trim()
  if (!email) return createIfMissing ? pushMeetingToMonday(p) : null

  let existing: Awaited<ReturnType<typeof findItemByColumnValue>> = null
  try {
    existing = await findItemByColumnValue(ILE_BOARD.boardId, ILE_BOARD.cols.email, email)
  } catch (err) {
    console.warn("[leads] monday ILE:promote lookup failed:", errMsg(err))
  }
  // createIfMissing is off for the browser-reported path: that request is not
  // authenticated, so it may only advance a lead that already exists — never
  // conjure a new CRM item from an arbitrary email.
  if (!existing) return createIfMissing ? pushMeetingToMonday(p) : null

  const c = ILE_BOARD.cols
  const cols: Record<string, unknown> = {}
  if (c.status) cols[c.status] = { label: "Meeting Booked" }
  // Meeting logistics arrive only now — the form had no slot to report.
  const promoteOwner = p.ownerId ?? REGION_OWNER_IDS[p.region ?? detectRegion(p)]
  const logistics = [meetingTimeFor(p, promoteOwner), p.fields?.["Event"]]
    .map((v) => v?.trim())
    .filter(Boolean)
  if (logistics.length > 0 && c.nextSteps) cols[c.nextSteps] = { text: logistics.join("\n") }
  // Calendly may have collected a phone the form didn't ask for. Same
  // normalisation as pushToBoard — spaces fail the whole write.
  const phone = p.fields?.["Phone"]?.replace(/[^\d+]/g, "")
  if (phone && c.phone) cols[c.phone] = { phone }

  const wrote = await writeColumnsDroppingRejects(ILE_BOARD.boardId, existing.id, cols, "ILE:promote")
  if (!wrote) console.warn("[leads] monday ILE:promote wrote no columns")
  // A promoted lead must actually land in "Meeting Booked" — that group is
  // what the sales view filters on, so this is more than cosmetic.
  try {
    await moveItemToGroup(existing.id, ILE_BOOKING_GROUP)
  } catch (err) {
    console.warn("[leads] monday ILE:promote regroup failed:", errMsg(err))
  }
  return existing.id
}

/**
 * A scheduler enquiry, straight onto the ILE board — no classifier, so nothing
 * from the booking flow is ever diverted to Website Enquiries.
 *
 * The screening that `pushToMonday` does is right for an open contact form,
 * where most non-leads arrive. It is the wrong trade here: someone who picked a
 * slot and is being handed to a calendar has already shown booking intent, and
 * a false "vendor_pitch" on that path files a real meeting where nobody looks.
 * A stray junk row in the CRM is cheap; a lost booking is not. The honeypot in
 * the route still stops naive bots before this is reached.
 *
 * To restore screening, call pushToMonday from the scheduler route instead.
 */
export async function pushSchedulerLead(p: LeadPayload): Promise<string | null> {
  const viaIle = await pushToBoard(p, ILE_BOARD, "ILE:scheduler")
  if (viaIle) return viaIle
  // ILE unreachable — land it on the fallback intake board rather than lose it.
  const fallback = fallbackBoard()
  if (!fallback) return null
  return pushToBoard(p, fallback, "fallback:scheduler")
}

export async function pushToMonday(p: LeadPayload): Promise<string | null> {
  // Screen first: vendor pitches / spam / other non-leads go to the Website
  // Enquiries board, not a CRM. Fails open to "lead".
  const verdict = await classifyLead(p)
  if (verdict.category !== "lead") {
    const dest = ENQUIRY_GROUPS[verdict.category]
    const enquiryId = await pushToBoard(
      p,
      { ...ENQUIRIES_BOARD, groupId: dest.groupId },
      `enquiries:${verdict.category}`,
    )
    if (enquiryId) {
      try {
        await changeColumnValues(ENQUIRIES_BOARD.boardId, enquiryId, {
          enquiry_type: { label: dest.label },
          ai_reason: verdict.reason,
        })
      } catch (err) {
        console.warn("[leads] enquiry labeling failed:", errMsg(err))
      }
      return enquiryId
    }
    // Enquiries board unreachable — fall through to the lead path so the
    // submission still lands somewhere visible.
    console.warn("[leads] enquiries push failed, falling back to lead path")
  }

  const viaIle = await pushToBoard(p, ILE_BOARD, "ILE")
  if (viaIle) return viaIle

  // ILE board unreachable — land the lead on the fallback intake board.
  const fallback = fallbackBoard()
  if (!fallback) return null
  return pushToBoard(p, fallback, "fallback")
}

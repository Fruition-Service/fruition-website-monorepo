/**
 * Human-readable meeting times for the CRM boards.
 *
 * Calendly reports every booking as a UTC instant. Writing that instant into
 * monday next to the invitee's timezone name — `2026-08-24T09:30:00.000Z
 * (Australia/Sydney)` — reads as though 09:30 were Sydney local time when it
 * is really 19:30 there and 17:30 in Singapore. Consultants missed calls over
 * it, so nothing may put a raw ISO instant on a board again: render through
 * `formatMeetingTime` instead.
 *
 * The consultant taking the call sees their OWN local time first — a board
 * that renders every booking in one head-office zone is just as useless to a
 * Sydney or New York desk as a raw UTC instant. The invitee's own time follows
 * on a second line so the consultant knows what to quote them. Both carry an
 * explicit UTC offset, so neither side has to convert anything.
 */

/**
 * Abbreviations ICU declines to give — it renders most of our regions as a
 * bare "GMT+8". Keyed by `${timeZone}|${offsetMinutes}` so the summer and
 * winter names of one zone stay distinct.
 */
const ABBR: Record<string, string> = {
  "Asia/Singapore|480": "SGT",
  "Asia/Bangkok|420": "ICT",
  "Asia/Kuala_Lumpur|480": "MYT",
  "Asia/Jakarta|420": "WIB",
  "Asia/Manila|480": "PHT",
  "Asia/Hong_Kong|480": "HKT",
  "Asia/Shanghai|480": "CST",
  "Asia/Tokyo|540": "JST",
  "Asia/Seoul|540": "KST",
  "Asia/Kolkata|330": "IST",
  "Asia/Calcutta|330": "IST",
  "Asia/Dubai|240": "GST",
  "Australia/Sydney|600": "AEST",
  "Australia/Sydney|660": "AEDT",
  "Australia/Melbourne|600": "AEST",
  "Australia/Melbourne|660": "AEDT",
  "Australia/Brisbane|600": "AEST",
  "Australia/Perth|480": "AWST",
  "Australia/Adelaide|570": "ACST",
  "Australia/Adelaide|630": "ACDT",
  "Pacific/Auckland|720": "NZST",
  "Pacific/Auckland|780": "NZDT",
  "America/New_York|-240": "EDT",
  "America/New_York|-300": "EST",
  "America/Toronto|-240": "EDT",
  "America/Toronto|-300": "EST",
  "America/Chicago|-300": "CDT",
  "America/Chicago|-360": "CST",
  "America/Denver|-360": "MDT",
  "America/Denver|-420": "MST",
  "America/Phoenix|-420": "MST",
  "America/Los_Angeles|-420": "PDT",
  "America/Los_Angeles|-480": "PST",
  "America/Vancouver|-420": "PDT",
  "America/Vancouver|-480": "PST",
}

/** Minutes east of UTC for `tz` at `d` — the basis for the offset suffix. */
function offsetMinutes(d: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d)
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  // Hour 24 is how ICU spells midnight under hour12:false in some builds.
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"), g("second"))
  return Math.round((asUtc - Math.floor(d.getTime() / 1000) * 1000) / 60000)
}

/** "UTC+8", "UTC-4", "UTC+5:30" */
function offsetLabel(mins: number): string {
  const sign = mins < 0 ? "-" : "+"
  const a = Math.abs(mins)
  const h = Math.floor(a / 60)
  const m = a % 60
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`
}

/** "SGT (UTC+8)" — curated abbreviation when we have one, else ICU's. */
function zoneLabel(d: Date, tz: string): string {
  const mins = offsetMinutes(d, tz)
  const offset = offsetLabel(mins)
  const curated = ABBR[`${tz}|${mins}`]
  if (curated) return `${curated} (${offset})`
  const icu = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "short" })
    .formatToParts(d)
    .find((p) => p.type === "timeZoneName")?.value
  // ICU falls back to "GMT+8", which duplicates the offset we already print.
  return icu && !/^(GMT|UTC)/.test(icu) ? `${icu} (${offset})` : offset
}

/**
 * The zone's short name at instant `d`: "AEDT", "GMT", "PST", or "UTC+8" when
 * neither our list nor ICU has a proper abbreviation. Summer and winter names
 * differ, so always pass the moment being described, never a fixed season.
 */
export function zoneAbbr(d: Date, tz: string): string {
  try {
    const mins = offsetMinutes(d, tz)
    const curated = ABBR[`${tz}|${mins}`]
    if (curated) return curated
    const icu = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "short" })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value
    return icu && !/^(GMT|UTC)[+-]/.test(icu) ? icu : offsetLabel(mins)
  } catch {
    return ""
  }
}

/** "Mon 24 Aug 2026, 5:30 PM" */
function wallClock(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .replace(/\s?(am|pm)/i, (m) => ` ${m.trim().toUpperCase()}`)
}

/**
 * The board-facing rendering of a booking.
 *
 * @param startIso UTC instant from Calendly (`scheduled_event.start_time`)
 * @param inviteeTz the invitee's IANA zone, when Calendly reported one
 * @param hostTz the consultant's own IANA zone — the headline time. Falls back
 *   to the invitee's zone, so a booking with no known owner still reads as a
 *   real wall-clock time rather than a UTC instant.
 * @returns one or two lines, or the raw input if `startIso` is unparseable —
 *   a booking is never dropped just because it could not be formatted.
 */
export function formatMeetingTime(startIso: string, inviteeTz?: string, hostTz?: string): string {
  const d = new Date(startIso)
  if (Number.isNaN(d.getTime())) return inviteeTz ? `${startIso} (${inviteeTz})` : startIso

  const client = inviteeTz?.trim()
  const host = hostTz?.trim() || client || "UTC"
  try {
    const lines = [`${wallClock(d, host)} ${zoneLabel(d, host)}`]
    // Second line only earns its space when the invitee is somewhere else.
    if (client && client !== host && offsetMinutes(d, client) !== offsetMinutes(d, host)) {
      lines.push(`Client's time: ${wallClock(d, client)} ${zoneLabel(d, client)} — ${client}`)
    }
    return lines.join("\n")
  } catch {
    // An unknown IANA zone must not cost us the booking record.
    return inviteeTz ? `${startIso} (${inviteeTz})` : startIso
  }
}

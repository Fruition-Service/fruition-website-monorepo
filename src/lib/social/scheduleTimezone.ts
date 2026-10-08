/**
 * Which clock a scheduled social post is written in.
 *
 * Fruition's audience and team are mostly in Australia, so the composer
 * schedules in Sydney time by default, whatever zone the browser happens to be
 * in. Before this the picker meant "the laptop's local time", so a post set for
 * 9:00 from Singapore went out at 11:00 (or 12:00 in daylight saving) in Sydney.
 *
 * The picker's value stays a zone-less `YYYY-MM-DDTHH:mm` wall-clock string;
 * `wallClockToUtc` turns it into the real instant for the chosen zone.
 */

export const DEFAULT_SCHEDULE_TIMEZONE = "Australia/Sydney"

export const SCHEDULE_TIMEZONES: Array<{ value: string; label: string }> = [
  { value: "Australia/Sydney", label: "Sydney / Melbourne" },
  { value: "Australia/Brisbane", label: "Brisbane" },
  { value: "Australia/Adelaide", label: "Adelaide" },
  { value: "Australia/Perth", label: "Perth" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Europe/London", label: "London" },
  { value: "America/New_York", label: "New York" },
]

/** Wall-clock fields of `d` as seen in `tz`. */
function partsIn(d: Date, tz: string) {
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
  return { year: g("year"), month: g("month"), day: g("day"), hour: g("hour") % 24, minute: g("minute"), second: g("second") }
}

/** Minutes east of UTC for `tz` at instant `d`. */
function offsetMinutes(d: Date, tz: string): number {
  const p = partsIn(d, tz)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - Math.floor(d.getTime() / 1000) * 1000) / 60000)
}

/**
 * "2026-10-09T09:00" in `tz` → the UTC instant. Returns null for a malformed
 * value. A time that falls in a spring-forward gap lands an hour later, which
 * is what every calendar app does.
 */
export function wallClockToUtc(value: string, tz: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!m) return null
  const [y, mo, d, h, mi] = m.slice(1).map(Number)
  const naive = Date.UTC(y, mo - 1, d, h, mi)
  // Two passes settle the offset across a DST boundary.
  let guess = naive - offsetMinutes(new Date(naive), tz) * 60000
  guess = naive - offsetMinutes(new Date(guess), tz) * 60000
  return new Date(guess)
}

/** Today's calendar date in `tz`, as a local-midnight Date for the day picker. */
export function todayIn(tz: string, now = new Date()): Date {
  const p = partsIn(now, tz)
  return new Date(p.year, p.month - 1, p.day)
}

/** "AEDT", "AWST", "SGT"... falling back to "UTC+8" when ICU has no name. */
export function zoneAbbreviation(tz: string, at = new Date()): string {
  const name = new Intl.DateTimeFormat("en-AU", { timeZone: tz, timeZoneName: "short" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value
  if (name && !/^(GMT|UTC)/.test(name)) return name
  const mins = offsetMinutes(at, tz)
  const a = Math.abs(mins)
  return `UTC${mins < 0 ? "-" : "+"}${Math.floor(a / 60)}${a % 60 ? `:${String(a % 60).padStart(2, "0")}` : ""}`
}

/** "Fri 9 Oct, 9:00 am AEDT" */
export function formatScheduled(iso: string | Date, tz: string = DEFAULT_SCHEDULE_TIMEZONE): string {
  const at = typeof iso === "string" ? new Date(iso) : iso
  const text = new Intl.DateTimeFormat("en-AU", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(at)
  return `${text} ${zoneAbbreviation(tz, at)}`
}

/** Same-day test in `tz`, for "Today 9:00" style labels. */
export function isSameDayIn(a: Date, b: Date, tz: string): boolean {
  const x = partsIn(a, tz)
  const y = partsIn(b, tz)
  return x.year === y.year && x.month === y.month && x.day === y.day
}

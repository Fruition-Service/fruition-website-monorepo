/**
 * Regional call numbers, one shared reading of `siteSettings.offices`.
 *
 * The nav phone popover and the booking band's "call us" block both list the
 * offices that have a phone number, so the mapping lives here once. The numbers
 * themselves are never restated in code: they come from Site Settings > Offices
 * (`phone` for display, `phoneTel` for the `tel:` link).
 */
import type { LeadRegion } from "@/lib/leadNotify"

export interface CallOffice {
  _key?: string
  flag?: string
  city?: string
  label?: string
  phone?: string
  phoneTel?: string
}

/** Display country per flag, `siteSettings.offices` has no country field.
 *  Mirrors the map in `components/home/WhereWeWork.tsx`. */
export const CALL_COUNTRY: Record<string, string> = {
  "🇦🇺": "Australia",
  "🇸🇬": "Singapore",
  "🇵🇭": "Philippines",
  "🇮🇳": "India",
  "🇬🇧": "United Kingdom",
  "🇺🇸": "United States",
}

/** West-to-east from the Sydney HQ, matching the "Where we work" row. */
export const CALL_ORDER = ["🇦🇺", "🇸🇬", "🇵🇭", "🇮🇳", "🇬🇧", "🇺🇸"]

export interface CallRow {
  key: string
  flag: string
  country: string
  city: string
  /** As written in the CMS, for display. */
  phone: string
  /** E.164, for the `tel:` link. */
  tel: string
}

/** "+61 483 955 931" or "+61483955931" to "+61483955931"; null when it is not a full international number. */
export function toE164(raw: string | undefined | null): string | null {
  const cleaned = (raw ?? "").replace(/[^\d+]/g, "")
  return /^\+[1-9]\d{6,14}$/.test(cleaned) ? cleaned : null
}

/**
 * The offices that can be called, in display order. An office without a usable
 * number, an unknown flag or a non-international number is omitted rather than
 * shown as a dead row.
 */
export function callRows(offices: CallOffice[] | null | undefined): CallRow[] {
  const rows: CallRow[] = []
  for (const o of offices ?? []) {
    if (!o.flag || !CALL_COUNTRY[o.flag]) continue
    const tel = toE164(o.phoneTel) ?? toE164(o.phone)
    if (!tel) continue
    rows.push({
      key: o._key ?? o.flag,
      flag: o.flag,
      country: CALL_COUNTRY[o.flag],
      city: (o.city ?? "").split(",")[0].trim(),
      phone: o.phone || o.phoneTel || tel,
      tel,
    })
  }
  return rows.sort((a, b) => CALL_ORDER.indexOf(a.flag) - CALL_ORDER.indexOf(b.flag))
}

/** Offices whose own country wins over the wider booking region (SEA covers both Singapore and Manila). */
const COUNTRY_FLAG: Record<string, string> = {
  AU: "🇦🇺",
  NZ: "🇦🇺",
  SG: "🇸🇬",
  PH: "🇵🇭",
  IN: "🇮🇳",
  AE: "🇮🇳",
  GB: "🇬🇧",
  US: "🇺🇸",
  CA: "🇺🇸",
}

const REGION_FLAG: Record<LeadRegion, string> = {
  APAC: "🇦🇺",
  SEA: "🇸🇬",
  IND: "🇮🇳",
  UK: "🇬🇧",
  NA: "🇺🇸",
}

/**
 * The office flag nearest a visitor: their own country when it has an office,
 * otherwise the desk their booking region maps to (`/api/visitor-region`, the
 * same resolver the booking card uses). Null when neither is known.
 */
export function nearestFlag(region?: string | null, country?: string | null): string | null {
  const cc = country?.trim().toUpperCase()
  if (cc && COUNTRY_FLAG[cc]) return COUNTRY_FLAG[cc]
  return region && region in REGION_FLAG ? REGION_FLAG[region as LeadRegion] : null
}

/**
 * Rows with the visitor's own office first, everything else kept in CALL_ORDER.
 * `nearest` is true only when a row was actually promoted for them.
 */
export function orderForVisitor(rows: CallRow[], flag: string | null): { rows: CallRow[]; nearest: boolean } {
  const i = flag ? rows.findIndex((r) => r.flag === flag) : -1
  if (i < 0) return { rows, nearest: false }
  return { rows: [rows[i], ...rows.slice(0, i), ...rows.slice(i + 1)], nearest: true }
}

/**
 * The currency a visitor's prices open in on /implementation-packages.
 *
 * The country comes from Cloudflare's `cf-ipcountry` via /api/visitor-region;
 * the browser's timezone covers local dev and the "XX"/"T1" placeholders
 * Cloudflare sends for some networks. Anyone it cannot place sees USD, the
 * currency the prices are set in. The dropdown still lets the visitor switch.
 */
export type CurrencyCode = "USD" | "SGD" | "GBP" | "AUD" | "EUR"

// Euro members (Bulgaria from 2026-01-01) and the microstates that use the euro.
const EUR_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV",
  "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES", "AD", "MC", "SM", "VA", "ME", "XK",
])
const GBP_COUNTRIES = new Set(["GB", "IM", "JE", "GG"])
const AUD_COUNTRIES = new Set(["AU", "CX", "CC", "NF", "NR", "KI", "TV"])
const SGD_COUNTRIES = new Set(["SG"])

const EUR_TIMEZONES = new Set([
  "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Berlin", "Europe/Bratislava",
  "Europe/Brussels", "Europe/Busingen", "Europe/Dublin", "Europe/Helsinki", "Europe/Lisbon",
  "Europe/Ljubljana", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Monaco",
  "Europe/Nicosia", "Asia/Nicosia", "Asia/Famagusta", "Europe/Paris", "Europe/Podgorica",
  "Europe/Riga", "Europe/Rome", "Europe/San_Marino", "Europe/Sofia", "Europe/Tallinn",
  "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Zagreb", "Europe/Mariehamn",
  "Atlantic/Azores", "Atlantic/Madeira", "Atlantic/Canary", "Africa/Ceuta",
])
const GBP_TIMEZONES = new Set(["Europe/London", "Europe/Jersey", "Europe/Guernsey", "Europe/Isle_of_Man"])

function fromCountry(country: string | undefined): CurrencyCode | null {
  const c = country?.trim().toUpperCase()
  if (!c || !/^[A-Z]{2}$/.test(c) || c === "XX" || c === "T1") return null
  if (SGD_COUNTRIES.has(c)) return "SGD"
  if (GBP_COUNTRIES.has(c)) return "GBP"
  if (AUD_COUNTRIES.has(c)) return "AUD"
  if (EUR_COUNTRIES.has(c)) return "EUR"
  return "USD"
}

function fromTimezone(tz: string | undefined): CurrencyCode | null {
  if (!tz) return null
  if (tz === "Asia/Singapore") return "SGD"
  if (tz.startsWith("Australia/")) return "AUD"
  if (GBP_TIMEZONES.has(tz)) return "GBP"
  if (EUR_TIMEZONES.has(tz)) return "EUR"
  return null
}

export function currencyForVisitor(country?: string, timezone?: string): CurrencyCode {
  return fromCountry(country) ?? fromTimezone(timezone) ?? "USD"
}

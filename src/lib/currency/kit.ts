/*
 * Site-wide display currency: the one place that knows rates, symbols, rounding
 * and how to read a price out of copy.
 *
 * `createCurrencyKit` is deliberately SELF-CONTAINED (no imports, no references
 * to anything outside its own body, plain ES2018). The Google Ads landing pages
 * are raw HTML route handlers with no React, so they get this exact function as
 * an inline script via `String(createCurrencyKit)` (see ./inline.ts). Keep it
 * that way: one implementation for the React site and the ad pages.
 *
 * Rates are a fixed, checked-in table (never a live FX call at request time).
 * Update RATES_PER_USD and RATES_AS_OF together, by hand, from any public
 * mid-market source. Canonical prices stay in their base currency everywhere
 * they are stored (Sanity, content.ts, JSON-LD); only the visible figure is
 * converted, in the browser.
 */

export type CurrencyCode = "AUD" | "USD" | "GBP" | "SGD" | "NZD" | "EUR" | "INR" | "AED" | "CAD"

export interface CurrencyInfo {
  code: CurrencyCode
  /** Prefix as it renders before the number: "A$", "US$", "£", "AED ". */
  prefix: string
  /** Name for the switcher. */
  name: string
}

export interface CurrencyKit {
  CODES: CurrencyCode[]
  CURRENCIES: Record<CurrencyCode, CurrencyInfo>
  RATES_PER_USD: Record<CurrencyCode, number>
  RATES_AS_OF: string
  FALLBACK: CurrencyCode
  isCode(v: unknown): v is CurrencyCode
  /** Exact conversion, no rounding. */
  convert(amount: number, from: CurrencyCode, to: CurrencyCode): number
  /** Rounds UP to a clean marketing step (never quotes below the real price). */
  roundMarketing(amount: number): number
  /** "A$18,000", "₹1,95,000", "AED 9,200". */
  format(amount: number, code: CurrencyCode): string
  /** Converted, rounded and formatted. Same currency returns the exact amount. */
  display(amount: number, from: CurrencyCode, to: CurrencyCode): string
  /** "A$18,000" -> { amount: 18000, currency: "AUD" }; bare "$" uses `fallback`. */
  parse(text: string, fallback?: CurrencyCode | null): { amount: number; currency: CurrencyCode } | null
  /**
   * Rewrites every price in a run of copy into `to`. Returns null when nothing
   * in the text is a convertible price (or when it lists three or more
   * currencies, which is a regional price list and must stay as written).
   * Bare "$" is read as `base`; with no base it is left alone.
   */
  convertText(text: string, to: CurrencyCode, base?: CurrencyCode | null): string | null
  /** True when the text holds at least one convertible price. */
  hasPrice(text: string, base?: CurrencyCode | null): boolean
  forCountry(country?: string | null): CurrencyCode | null
  forTimezone(tz?: string | null): CurrencyCode | null
}

export function createCurrencyKit(): CurrencyKit {
  const CODES: CurrencyCode[] = ["AUD", "USD", "GBP", "EUR", "SGD", "NZD", "INR", "AED", "CAD"]
  const CURRENCIES = {
    AUD: { code: "AUD", prefix: "A$", name: "Australian dollar" },
    USD: { code: "USD", prefix: "US$", name: "US dollar" },
    GBP: { code: "GBP", prefix: "£", name: "British pound" },
    EUR: { code: "EUR", prefix: "€", name: "Euro" },
    SGD: { code: "SGD", prefix: "S$", name: "Singapore dollar" },
    NZD: { code: "NZD", prefix: "NZ$", name: "New Zealand dollar" },
    INR: { code: "INR", prefix: "₹", name: "Indian rupee" },
    AED: { code: "AED", prefix: "AED ", name: "UAE dirham" },
    CAD: { code: "CAD", prefix: "C$", name: "Canadian dollar" },
  } as Record<CurrencyCode, CurrencyInfo>
  // Units of each currency per 1 USD. Mid-market, open.er-api.com, 13 Nov 2026.
  const RATES_PER_USD: Record<CurrencyCode, number> = {
    USD: 1,
    AUD: 1.4683,
    GBP: 0.7551,
    EUR: 0.9035,
    SGD: 1.2863,
    NZD: 1.8027,
    INR: 94.086,
    AED: 3.6725,
    CAD: 1.4256,
  }
  const RATES_AS_OF = "2026-11-13"
  const FALLBACK: CurrencyCode = "USD"

  const EURO = "AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SK SI AD MC SM VA ME XK".split(" ")
  const BY_COUNTRY: Record<string, CurrencyCode> = { AU: "AUD", NZ: "NZD", GB: "GBP", IM: "GBP", JE: "GBP", GG: "GBP", US: "USD", SG: "SGD", IN: "INR", AE: "AED", CA: "CAD" }
  for (let e = 0; e < EURO.length; e++) BY_COUNTRY[EURO[e]] = "EUR"

  // Symbol (or code) as written in copy -> currency. Longest first.
  const SYMBOLS: Array<[string, CurrencyCode | null]> = [
    ["AU$", "AUD"], ["US$", "USD"], ["NZ$", "NZD"], ["SG$", "SGD"], ["CA$", "CAD"],
    ["A$", "AUD"], ["S$", "SGD"], ["C$", "CAD"], ["£", "GBP"], ["€", "EUR"], ["₹", "INR"], ["$", null],
  ]
  const SYM_RE = "AU\\$|US\\$|NZ\\$|SG\\$|CA\\$|A\\$|S\\$|C\\$|£|€|₹|\\$"
  const CODE_RE = "AUD|USD|GBP|SGD|NZD|EUR|INR|AED|CAD"
  // [1] lead char, [2] code, [3] symbol, [4] amount, [5] trailing char
  const TOKEN = new RegExp(
    "(^|[^A-Za-z0-9$£€₹])(?:(" + CODE_RE + ")\\s?)?(" + SYM_RE + ")?(\\d{1,3}(?:,\\d{3})+(?:\\.\\d{1,2})?|\\d+(?:\\.\\d{1,2})?)(?=([^0-9]|$))",
    "g",
  )
  // A bare "$" straight after a range word inherits the previous figure's currency.
  const RANGE_GAP = /^\s*(?:–|—|-|to|and)\s*$/

  function isCode(v: unknown): v is CurrencyCode {
    return typeof v === "string" && Object.prototype.hasOwnProperty.call(CURRENCIES, v)
  }
  function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return amount
    return (amount / RATES_PER_USD[from]) * RATES_PER_USD[to]
  }
  function roundMarketing(x: number): number {
    const step = x < 100 ? 1 : x < 1000 ? 10 : x < 10000 ? 100 : x < 100000 ? 500 : x < 1000000 ? 5000 : 10000
    return Math.ceil(x / step - 1e-9) * step
  }
  function format(amount: number, code: CurrencyCode): string {
    const whole = Math.round(amount) === amount
    const n = amount.toLocaleString(code === "INR" ? "en-IN" : "en-US", {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: whole ? 0 : 2,
    })
    return CURRENCIES[code].prefix + n
  }
  function display(amount: number, from: CurrencyCode, to: CurrencyCode): string {
    if (from === to) return format(amount, to)
    return format(roundMarketing(convert(amount, from, to)), to)
  }
  function symbolCurrency(sym: string | undefined): CurrencyCode | null | undefined {
    if (!sym) return undefined
    for (let i = 0; i < SYMBOLS.length; i++) if (SYMBOLS[i][0] === sym) return SYMBOLS[i][1]
    return undefined
  }

  interface Tok { start: number; end: number; lead: string; currency: CurrencyCode; amount: number; explicit: boolean }

  function tokens(text: string, base: CurrencyCode | null | undefined): Tok[] {
    const out: Tok[] = []
    let m: RegExpExecArray | null
    TOKEN.lastIndex = 0
    while ((m = TOKEN.exec(text))) {
      const code = m[2] as CurrencyCode | undefined
      const sym = m[3]
      if (!code && !sym) { if (m[0].length === 0) TOKEN.lastIndex++; continue }
      // "AUD 130k", "$2.4M", "£400K": outcome figures and rough sizes, never a quoted price.
      const after = text.charAt(m.index + m[0].length)
      if (/[kKmMbB]/.test(after) && !/[A-Za-z]/.test(text.charAt(m.index + m[0].length + 1))) continue
      if (/[A-Za-z]/.test(after)) continue
      const amount = Number(m[4].replace(/,/g, ""))
      if (!isFinite(amount) || amount <= 0) continue
      let cur: CurrencyCode | null | undefined = code || symbolCurrency(sym)
      const explicit = !!cur
      if (!cur) {
        const prev = out[out.length - 1]
        const gap = prev ? text.slice(prev.end, m.index + m[1].length) : ""
        cur = prev && prev.explicit && RANGE_GAP.test(gap) ? prev.currency : base || null
      }
      if (!cur) continue
      out.push({ start: m.index + m[1].length, end: m.index + m[0].length, lead: m[1], currency: cur, amount: amount, explicit: explicit })
    }
    return out
  }

  function convertText(text: string, to: CurrencyCode, base?: CurrencyCode | null): string | null {
    if (!text || !/\d/.test(text)) return null
    const toks = tokens(text, base)
    if (!toks.length) return null
    const seen: Record<string, boolean> = {}
    let distinct = 0
    for (let i = 0; i < toks.length; i++) if (toks[i].explicit && !seen[toks[i].currency]) { seen[toks[i].currency] = true; distinct++ }
    if (distinct >= 3) return null
    let res = ""
    let at = 0
    for (let j = 0; j < toks.length; j++) {
      const t = toks[j]
      res += text.slice(at, t.start)
      res += t.currency === to ? text.slice(t.start, t.end) : display(t.amount, t.currency, to)
      at = t.end
    }
    return res + text.slice(at)
  }

  function hasPrice(text: string, base?: CurrencyCode | null): boolean {
    return !!text && /\d/.test(text) && tokens(text, base).length > 0
  }

  function parse(text: string, fallback?: CurrencyCode | null) {
    const toks = tokens(String(text || ""), fallback)
    return toks.length ? { amount: toks[0].amount, currency: toks[0].currency } : null
  }

  function forCountry(country?: string | null): CurrencyCode | null {
    const c = String(country || "").trim().toUpperCase()
    return BY_COUNTRY[c] || null
  }

  function forTimezone(tz?: string | null): CurrencyCode | null {
    const z = String(tz || "")
    if (!z) return null
    if (/^Australia\//.test(z)) return "AUD"
    if (/^Pacific\/(Auckland|Chatham)$/.test(z) || z === "NZ") return "NZD"
    if (/^Europe\/(London|Belfast|Guernsey|Jersey|Isle_of_Man)$/.test(z) || z === "GB") return "GBP"
    if (/^Asia\/Singapore$/.test(z) || z === "Singapore") return "SGD"
    if (/^Asia\/(Kolkata|Calcutta)$/.test(z)) return "INR"
    if (/^Asia\/Dubai$/.test(z)) return "AED"
    if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Moncton|Whitehorse|Yellowknife|Iqaluit)$/.test(z)) return "CAD"
    if (/^(America\/|US\/)/.test(z)) return "USD"
    if (/^Europe\/(Paris|Berlin|Madrid|Rome|Amsterdam|Brussels|Vienna|Dublin|Lisbon|Helsinki|Athens|Luxembourg|Bratislava|Ljubljana|Tallinn|Riga|Vilnius|Valletta|Zagreb|Monaco|Andorra|San_Marino|Vatican|Podgorica)$/.test(z)) return "EUR"
    return null
  }

  return {
    CODES: CODES,
    CURRENCIES: CURRENCIES,
    RATES_PER_USD: RATES_PER_USD,
    RATES_AS_OF: RATES_AS_OF,
    FALLBACK: FALLBACK,
    isCode: isCode,
    convert: convert,
    roundMarketing: roundMarketing,
    format: format,
    display: display,
    parse: parse,
    convertText: convertText,
    hasPrice: hasPrice,
    forCountry: forCountry,
    forTimezone: forTimezone,
  }
}

/** The kit for TypeScript callers (server and client). */
export const currency = createCurrencyKit()

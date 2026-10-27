/**
 * The rough quote: documented package prices, totalled, and nothing else.
 *
 * Every number comes from a knowledge record's `facts.price` (for packages,
 * `USD 2,500` or `From USD 2,500`, see knowledge/sanity.ts) and every hours
 * figure from `facts.hours`, quoted verbatim. Nothing is converted, discounted
 * or estimated: currencies are totalled separately, hours are listed rather
 * than summed (they read like "40+ hrs"), and an offering without a numeric
 * price is counted as scoped and quoted by the Fruition team.
 *
 * Browser-safe and pure, so the money handling is unit tested.
 */
import type { EvaluationDetail, Offering } from "./types"

export const UNPRICED_COPY = "Scoped and quoted by the Fruition team"

export interface ParsedPrice {
  /** ISO 4217 code as written in the record, e.g. USD. */
  currency: string
  amount: number
  /** Whatever the record wrote before the currency, e.g. "From". */
  prefix: string
}

const PRICE_RE = /^(?:(.*?)\s+)?([A-Z]{3})\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,2}))?$/

/** A documented price as a number, or null when the record has no figure. */
export function parsePrice(value: unknown): ParsedPrice | null {
  if (typeof value !== "string") return null
  const m = value.trim().match(PRICE_RE)
  if (!m) return null
  const amount = Number(`${m[3].replace(/,/g, "")}${m[4] ? `.${m[4]}` : ""}`)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return { currency: m[2], amount, prefix: (m[1] ?? "").trim() }
}

/** The same shape the records use: `USD 2,500`. */
export function formatMoney(currency: string, amount: number): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`
}

export interface QuoteLine {
  offering_id: string
  title: string
  /** The record's price text, verbatim, or UNPRICED_COPY. */
  price: string
  priced: boolean
  hours: string | null
}

export interface RoughQuote {
  /** Which offerings the quote covers. */
  basis: "shortlist" | "matches"
  lines: QuoteLine[]
  /** One per currency, in the order they first appear. */
  totals: Array<{ currency: string; amount: number }>
  /** Prefixes such as "From" that qualify any of the totalled prices. */
  qualifiers: string[]
  unpriced: number
}

function factText(offering: Offering, key: string): string | null {
  const value = offering.facts?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : null
}

/**
 * The quote for the visitor's shortlist, or for every match when nothing is
 * shortlisted yet. Null when none of those offerings has a documented price:
 * there is nothing to total, and the panel says nothing rather than guess.
 */
export function buildRoughQuote(evaluation: Pick<EvaluationDetail, "matches" | "shortlist">): RoughQuote | null {
  const kept = evaluation.matches.filter((m) => evaluation.shortlist.includes(m.offering_id))
  const basis = kept.length ? "shortlist" : "matches"
  const offerings = kept.length ? kept : evaluation.matches
  const totals: RoughQuote["totals"] = []
  const qualifiers: string[] = []
  let unpriced = 0

  const lines = offerings.map((o): QuoteLine => {
    const text = factText(o, "price")
    const parsed = parsePrice(text)
    if (parsed) {
      const row = totals.find((t) => t.currency === parsed.currency)
      if (row) row.amount += parsed.amount
      else totals.push({ currency: parsed.currency, amount: parsed.amount })
      if (parsed.prefix && !qualifiers.includes(parsed.prefix)) qualifiers.push(parsed.prefix)
    } else {
      unpriced++
    }
    return {
      offering_id: o.offering_id,
      title: o.title,
      price: parsed ? text! : (text ?? UNPRICED_COPY),
      priced: Boolean(parsed),
      hours: factText(o, "hours"),
    }
  })

  if (!totals.length) return null
  return { basis, lines, totals, qualifiers, unpriced }
}

/** The total line: documented prices only, unpriced work named as such. */
export function totalLine(quote: RoughQuote): string {
  const money = quote.totals.map((t) => formatMoney(t.currency, t.amount)).join(" + ")
  const lead = quote.qualifiers.length ? `${quote.qualifiers[0]} ${money}` : money
  if (!quote.unpriced) return lead
  const rest = quote.unpriced === 1 ? "1 item" : `${quote.unpriced} items`
  return `${lead}, plus ${rest} ${UNPRICED_COPY.charAt(0).toLowerCase()}${UNPRICED_COPY.slice(1)}`
}

/** Plain text of the quote for the lead record the team receives. */
export function quoteText(quote: RoughQuote | null): string {
  if (!quote) return "No documented package price matched."
  const lines = quote.lines.map((l) => `${l.title}: ${l.price}${l.hours ? ` (${l.hours})` : ""}`)
  return [...lines, `Total: ${totalLine(quote)}`].join("\n")
}

/**
 * The rough quote: built only from implementation package prices that are
 * published in the knowledge base (package records, from
 * implementationPackagesPage.packageTiers in Sanity). Nothing here estimates.
 * A package whose price is not a plain "USD 2,500" style figure is listed with
 * its documented wording and adds nothing to the range.
 *
 * Browser-safe: no server imports.
 */
import type { KnowledgeRecord } from "./knowledge/types"
import type { QuotePackage, RoughQuote } from "./types"

/** What moves the range. Fixed copy, never a number. */
export const QUOTE_DRIVERS: string[] = [
  "The scope of the first phase",
  "How many boards, pipelines and workflows are involved",
  "Integrations with the tools you already run",
  "Data migration and the state of your data",
  "How many training sessions, and how many people are trained",
]

/** "USD 2,500", "From USD 2,500", "Starting from USD 2,500.00". Anything else is not a price. */
const PRICE_RE = /^(?:(?:starting\s+)?from\s+|starting\s+at\s+)?([a-z]{3})\s*(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?$/i

export function parsePriceFact(facts: KnowledgeRecord["facts"]): { currency: string; amount: number } | null {
  const raw = facts?.price
  if (typeof raw !== "string") return null
  const match = PRICE_RE.exec(raw.trim())
  if (!match) return null
  const amount = Number(`${match[2].replace(/,/g, "")}${match[3] ? `.${match[3]}` : ""}`)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return { currency: match[1].toUpperCase(), amount }
}

function fact(facts: KnowledgeRecord["facts"], key: string): string | undefined {
  const value = facts?.[key]
  const text = Array.isArray(value) ? value.join(", ") : value
  return text?.trim() || undefined
}

export function buildRoughQuote(records: KnowledgeRecord[]): RoughQuote {
  const packages: QuotePackage[] = records
    .filter((r) => r.kind === "package")
    .map((r) => {
      const parsed = parsePriceFact(r.facts)
      const hours = fact(r.facts, "hours")
      return {
        offering_id: r.id,
        title: r.title,
        price: fact(r.facts, "price") ?? "Scoped and quoted by the Fruition team",
        ...(hours ? { hours } : {}),
        ...(parsed ? { currency: parsed.currency, amount: parsed.amount } : {}),
      }
    })
  const terms = records.filter((r) => r.kind === "package").map((r) => fact(r.facts, "terms")).find(Boolean)

  // One currency per range: the first priced package sets it, so a mixed
  // catalogue can never produce a sum of unlike numbers.
  const currency = packages.find((p) => p.amount != null)?.currency ?? null
  const amounts = packages.filter((p) => p.amount != null && p.currency === currency).map((p) => p.amount as number)

  const base = { packages, drivers: [...QUOTE_DRIVERS], ...(terms ? { terms } : {}) }
  if (!currency || !amounts.length) return { kind: "on_call", currency: null, low: null, high: null, ...base }
  const low = Math.min(...amounts)
  const high = Math.max(...amounts)
  if (amounts.length === 1 || low === high) return { kind: "from", currency, low, high: null, ...base }
  return { kind: "range", currency, low, high, ...base }
}

function money(currency: string, amount: number): string {
  return `${currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
}

export function quoteRangeLabel(quote: RoughQuote): string {
  if (quote.kind === "on_call" || !quote.currency || quote.low == null) return "Range confirmed on the call"
  if (quote.kind === "range" && quote.high != null) return `${money(quote.currency, quote.low)} to ${money(quote.currency, quote.high)}`
  return `From ${money(quote.currency, quote.low)}`
}

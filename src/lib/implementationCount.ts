/**
 * Fruition's implementation count, the one place it is set.
 *
 * To change the number everywhere on the site:
 *   1. Edit IMPLEMENTATION_COUNT_NUMBER below.
 *   2. Add the old value (with its "+") to PREVIOUS_IMPLEMENTATION_COUNTS, so
 *      Sanity text that still holds it keeps syncing.
 *   3. Update the one static file the build cannot reach, public/index.md
 *      (implementationCount.test.ts fails until you do).
 *
 * Code reads the constants directly: home copy, section defaults, region and
 * practice pages, nav, the ad landing pages and the og-card worker.
 *
 * Sanity text needs no edit. Every CMS read goes through
 * syncImplementationCountIn() (src/sanity/client.ts), which replaces
 *   - the token {{implementations}}, the form editors should type, and
 *   - any previous count ("900+", "700+", "1000+"), and prose such as
 *     "over 900 implementations",
 * with the current value. Anything that is not Fruition's count is left
 * alone: a larger number (1,900+), a price ($900+) or another product's
 * figure (700+ integrations).
 *
 * Keep this file dependency-free: the og-card worker imports it too.
 */

/** The number on its own, for prose such as "over 1,000 implementations". */
export const IMPLEMENTATION_COUNT_NUMBER = "1,000"

/** The figure as shown on the site, e.g. "1,000+ implementations". */
export const IMPLEMENTATION_COUNT = `${IMPLEMENTATION_COUNT_NUMBER}+`

/** What editors type in Sanity to show the current count. */
export const IMPLEMENTATION_COUNT_TOKEN = "{{implementations}}"

/** Every count the site has shown before. Sanity text holding one is synced. */
export const PREVIOUS_IMPLEMENTATION_COUNTS = ["700+", "900+", "1000+"]

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const countsToSync = [...new Set([...PREVIOUS_IMPLEMENTATION_COUNTS, IMPLEMENTATION_COUNT])]
  .filter((c) => c !== IMPLEMENTATION_COUNT)
  .sort((a, b) => b.length - a.length)

/** A previous count, never one inside a larger number (1,900+, 11,000+). */
const PLUS_RE = countsToSync.length
  ? new RegExp(`(?<![\\d,.])(?:${countsToSync.map(escape).join("|")})(?![\\d,])`, "g")
  : null

const previousNumbers = countsToSync.map((c) => c.replace(/\+$/, ""))

/** "over 900 implementations", "more than 900 small and mid-sized organisations". */
const PROSE_RE = previousNumbers.length
  ? new RegExp(
      `\\b(over|more than) (?:${previousNumbers.map(escape).join("|")})(?![\\d,+])` +
        `(?=\\s+(?:[\\w-]+\\s+){0,3}(?:implementations|organisations|organizations|clients|businesses|projects|systems|customers)\\b)`,
      "gi",
    )
  : null

/** Words right after a figure that make it another product's number (700+ integrations). */
const NOT_OURS_AFTER =
  /^\s*(native\s+)?(integrations|apps|hubs|applications|templates|connectors|employees|staff|seats|users|people|members|downloads)\b/i
/** A price right before the figure ($900+, USD 900+). */
const NOT_OURS_BEFORE = /(\$|USD)\s*$/i

function replaceOurs(value: string, re: RegExp | null, to: (m: RegExpMatchArray) => string): string {
  if (!re) return value
  let out = ""
  let last = 0
  for (const m of value.matchAll(re)) {
    const i = m.index!
    const end = i + m[0].length
    const notOurs =
      NOT_OURS_AFTER.test(value.slice(end, end + 30)) || NOT_OURS_BEFORE.test(value.slice(Math.max(0, i - 6), i))
    out += value.slice(last, i) + (notOurs ? m[0] : to(m))
    last = end
  }
  return out + value.slice(last)
}

/** Any count the site has shown, current one included (for tokenising CMS text). */
const ANY_PLUS_RE = new RegExp(
  `(?<![\\d,.])(?:${[...new Set([...PREVIOUS_IMPLEMENTATION_COUNTS, IMPLEMENTATION_COUNT])]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join("|")})(?![\\d,])`,
  "g",
)

/**
 * One string, with every Fruition count ("900+", "1,000+", ...) replaced by
 * the {{implementations}} token. Used by scripts/raise-implementation-count.ts
 * to make Studio text show the token instead of a hard-coded figure.
 */
export function tokeniseImplementationCount(value: string): string {
  return replaceOurs(value, ANY_PLUS_RE, () => IMPLEMENTATION_COUNT_TOKEN)
}

/** One string, with every Fruition count brought up to date. */
export function syncImplementationCount(value: string): string {
  if (!value) return value
  let out = value.split(IMPLEMENTATION_COUNT_TOKEN).join(IMPLEMENTATION_COUNT)
  out = replaceOurs(out, PLUS_RE, () => IMPLEMENTATION_COUNT)
  out = replaceOurs(out, PROSE_RE, (m) => `${m[1]} ${IMPLEMENTATION_COUNT_NUMBER}`)
  return out
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** A whole CMS payload, every string at every depth. Keys starting with "_" are untouched. */
export function syncImplementationCountIn<T>(value: T): T {
  if (typeof value === "string") return syncImplementationCount(value) as T
  if (Array.isArray(value)) return value.map((v) => syncImplementationCountIn(v)) as T
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = k.startsWith("_") ? v : syncImplementationCountIn(v)
    return out as T
  }
  return value
}

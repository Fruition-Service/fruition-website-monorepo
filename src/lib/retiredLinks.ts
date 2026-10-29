/**
 * Retired /monday-consulting-solutions URLs (October 2026 SEO review).
 *
 * The hub and six suffix-numbered duplicates under it were thin copies from
 * the early Wix import that competed with the real service pages. The
 * redirects live in next.config.ts; this module keeps the CMS from linking to
 * them and the routes from rendering them.
 */
export const RETIRED_HUB_PATH = "/monday-consulting-solutions"

/** Where links to the retired hub are sent instead. */
export const RETIRED_HUB_DESTINATION = "/monday-implementation-consultants"

/**
 * Solution page slugs whose Sanity documents still exist but must never be
 * served. Shared by the [slug] route guard and the sitemap so the two cannot
 * drift.
 */
export const RETIRED_SOLUTION_SLUGS: ReadonlySet<string> = new Set([
  "monday-service-1",
  "monday-product-management-5",
  "monday-for-hr-2",
  "monday-project-management-0",
  "monday-for-finance-4",
  "solar-crm-solution-6",
])

/**
 * Matches a string that IS the retired hub URL (relative or absolute, with an
 * optional trailing slash, query or hash). Anchored, so subpaths such as
 * /monday-consulting-solutions/catalog and prose that merely mentions the URL
 * are left alone.
 */
const RETIRED_HUB_RE =
  /^\s*(?:https?:\/\/(?:www\.)?fruitionservices\.io)?\/monday-consulting-solutions\/?(?:[?#]\S*)?\s*$/i

/** The canonical destination when `url` is the retired hub, otherwise `url`. */
export function retiredLinkHref(url: string): string {
  return RETIRED_HUB_RE.test(url) ? RETIRED_HUB_DESTINATION : url
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Deep-rewrites links to the retired hub in a CMS payload. Applied to every
 * Sanity read (see sanity/client.ts) next to rewriteBookingLinks, so a nav
 * item or CTA saved with the old URL resolves to the canonical page without a
 * CMS edit. Only arrays and plain objects are walked; every other value
 * (numbers, booleans, null, Dates) passes through as is.
 */
export function rewriteRetiredLinks<T>(value: T): T {
  if (typeof value === "string") return retiredLinkHref(value) as T
  if (Array.isArray(value)) return value.map((v) => rewriteRetiredLinks(v)) as T
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = rewriteRetiredLinks(v)
    return out as T
  }
  return value
}

function isRetiredHubEntry(value: unknown): boolean {
  return isPlainObject(value) && typeof value.href === "string" && RETIRED_HUB_RE.test(value.href)
}

function pruneRetiredHubEntries(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.filter((v) => !isRetiredHubEntry(v)).map((v) => pruneRetiredHubEntries(v))
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = pruneRetiredHubEntries(v)
    return out
  }
  return value
}

/**
 * Removes nav entries that link to the retired hub, at every depth (sections,
 * items, columns, children, whatever the key). A CMS nav item saved with the
 * hub URL would be rewritten into a second link to
 * /monday-implementation-consultants beside the existing "Implementation
 * consultants" one, so the nav drops it rather than duplicating it. Groups
 * left empty stay in place with an empty array, and subpaths of the hub are
 * kept. Applied only to siteSettings.navigation (see sanity/client.ts);
 * everywhere else the hub is rewritten by rewriteRetiredLinks, not removed.
 */
export function dropRetiredHubNavLinks<T>(navigation: T[]): T[] {
  return pruneRetiredHubEntries(navigation) as T[]
}

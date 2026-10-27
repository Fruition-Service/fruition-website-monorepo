/**
 * On-site booking anchor — the BookingSection on the contact page.
 * bookingHref routes any legacy Calendly link (hardcoded or from Sanity)
 * there instead, so every "book a call" CTA lands on our own scheduler.
 * Non-Calendly URLs pass through untouched. Keep raw Calendly URLs only
 * for BookingSection's own availability-failure escape hatch.
 */
export const BOOKING_ANCHOR = "/contact-us#book"

export function bookingHref(url?: string | null): string {
  if (!url || /calendly\.com/i.test(url)) return BOOKING_ANCHOR
  return url
}

/**
 * Paths that render the booking section themselves: the six /monday-partner-*
 * location pages (see `src/components/RegionPageTemplate.tsx`). A pattern
 * rather than a slug list, so client chrome can recognise one without
 * importing the region copy into the browser bundle.
 */
const REGION_PAGE_PATH_RE = /^\/monday-partner-[a-z]+$/

export function isRegionPagePath(pathname?: string | null): boolean {
  if (!pathname) return false
  return REGION_PAGE_PATH_RE.test(pathname.replace(/\/+$/, ""))
}

/**
 * The booking section on this page's own URL: `/monday-partner-uk#book`.
 *
 * The location pages render <BookingSection id="book"> in place, so a CTA
 * carrying `/contact-us#book` reads as a cross-page link while behaving as a
 * same-page one. Writing the page's own path plus #book makes the href say
 * what the click does, which is what search engines and anyone who copies the
 * link see.
 */
export function pageBookingHref(pathname: string): string {
  const path = pathname.trim().split(/[?#]/)[0].replace(/\/+$/, "")
  return path ? `${path}#book` : "#book"
}

/** Every spelling of the cross-page booking anchor that reaches an href. */
const BOOKING_ANCHOR_RE =
  /^(?:https?:\/\/(?:www\.)?fruitionservices\.io)?(?:\/contact-us)?\/?#book$/i

/**
 * `url` resolved for `pathname`. On a location page a booking anchor becomes
 * that page's own #book; every other destination (a custom CTA URL, a live
 * Calendly link) and every other page is left exactly as it was.
 */
export function bookingHrefForPath(
  url?: string | null,
  pathname?: string | null,
): string {
  const href = bookingHref(url)
  const path = (pathname ?? "").replace(/\/+$/, "")
  if (!isRegionPagePath(path)) return href
  return BOOKING_ANCHOR_RE.test(href.trim()) ? pageBookingHref(path) : href
}

/**
 * The one Sanity field that must keep its raw Calendly URL: BookingSection
 * falls back to it when live availability can't load, and pointing that at
 * ourselves would strand the visitor.
 */
const RAW_LINK_KEYS = new Set(["calendlyLink"])

/**
 * Matches a string that IS a Calendly URL, not prose that merely mentions
 * calendly.com — rewriting body copy would destroy the sentence around it.
 */
const CALENDLY_URL_RE = /^\s*https?:\/\/(www\.)?calendly\.com\b\S*\s*$/i

/**
 * Deep-rewrites Calendly URLs in a CMS payload. Applied to every Sanity read
 * (see sanity/client.ts) so a Calendly link saved in any field — hero CTA,
 * sticky bar, page-builder block, a link inside a blog body — resolves to the
 * booking section. Editors don't have to know, and new CMS content can't
 * reintroduce a raw Calendly link.
 */
export function rewriteBookingLinks<T>(value: T): T {
  if (typeof value === "string") {
    return (CALENDLY_URL_RE.test(value) ? BOOKING_ANCHOR : value) as T
  }
  if (Array.isArray(value)) {
    return value.map((v) => rewriteBookingLinks(v)) as T
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = RAW_LINK_KEYS.has(k) ? v : rewriteBookingLinks(v)
    }
    return out as T
  }
  return value
}

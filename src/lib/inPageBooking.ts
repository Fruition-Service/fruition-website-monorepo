/**
 * In-page booking links.
 *
 * Every "book a call" CTA on the site resolves to the booking anchor
 * (`/contact-us#book` — see `bookingLink.ts`). Most pages that show one of
 * those CTAs also render <BookingSection> themselves, so sending the visitor
 * to another page to reach the same form costs a navigation for nothing.
 *
 * When the current page already owns `#book`, the CTA scrolls to it instead.
 * The `href` stays the cross-page URL, so this is pure enhancement: without
 * JavaScript, or on a modified click, the link still navigates to /contact-us.
 *
 * Capture is delegated (see `InPageBookingLinks`) for the same reason CTA
 * tracking is: most of the site's CTAs are raw `<a>` in individual sections or
 * come out of Sanity, and wiring them one by one would miss every CTA added
 * later.
 */

/** The id <BookingSection> renders on itself. */
export const BOOKING_SECTION_ID = "book"

/**
 * Matches the booking anchor in every spelling that reaches the DOM: the
 * cross-page form `bookingHref()` produces, the same-page `#book` the home page
 * passes down, and the absolute form Sanity content occasionally carries.
 */
const BOOKING_HREF_RE = /^(?:https?:\/\/[^/]+)?(?:\/contact-us\/?)?#book$/i

export function isBookingHref(href: string | null | undefined): boolean {
  return !!href && BOOKING_HREF_RE.test(href.trim())
}

/**
 * Whether a click on `anchor` should be turned into an in-page scroll.
 *
 * Everything that would make the browser do something other than a plain
 * same-tab navigation is left alone: modified and middle clicks open
 * /contact-us in a new tab, `target` opts out, and a handler that already
 * called preventDefault owns the event.
 */
export function shouldScrollToBooking(
  anchor: HTMLAnchorElement,
  event: Pick<MouseEvent, "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "defaultPrevented">,
): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (anchor.target && anchor.target !== "_self") return false
  if (anchor.hasAttribute("download")) return false
  return isBookingHref(anchor.getAttribute("href"))
}

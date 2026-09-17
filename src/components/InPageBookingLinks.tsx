"use client"

import { useEffect } from "react"
import { BOOKING_SECTION_ID, shouldScrollToBooking } from "@/lib/inPageBooking"

/**
 * Turns every booking CTA into a scroll when the page it's on already has the
 * booking section. See `src/lib/inPageBooking.ts` for the why.
 *
 * Renders nothing. Mounted once in the root layout, beside CtaClickTracker.
 */
export default function InPageBookingLinks() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target
      if (!(target instanceof Element)) return
      const anchor = target.closest("a")
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!shouldScrollToBooking(anchor, e)) return

      // Resolved at click time, not on mount: client-side navigation swaps the
      // page under this listener, so a page without its own booking section
      // must still fall through to /contact-us.
      const section = document.getElementById(BOOKING_SECTION_ID)
      if (!section) return

      e.preventDefault()
      section.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      })

      // Leave the URL looking like a real anchor link so the visitor can copy
      // it. history.state is passed through untouched — the App Router keeps
      // its routing data there, and dropping it breaks the back button.
      try {
        window.history.replaceState(window.history.state, "", `#${BOOKING_SECTION_ID}`)
      } catch {
        // A URL we can't rewrite is cosmetic; the scroll already happened.
      }
    }

    // Capture phase: most of these CTAs are Next <Link>s, whose own handler
    // calls preventDefault() and routes — in the bubble phase the click is
    // already spoken for. Next bails when the event is prevented, so claiming
    // it here is what stops the navigation. CtaClickTracker also listens in
    // capture, registers first (it is mounted first) and this never stops
    // propagation, so the click is still recorded.
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}

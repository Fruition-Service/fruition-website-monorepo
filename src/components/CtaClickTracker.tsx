"use client"

import { useEffect } from "react"
import { CTA_SELECTOR, ctaEventFromAnchor, trackCtaClick } from "@/lib/ctaTracking"

/**
 * Records every CTA click on the site as a `cta_click` dataLayer event.
 *
 * One delegated listener rather than an onClick per component: the site renders
 * CTAs from ~20 different sections, most as raw `<a class="cta-btn">`, and
 * wiring each one would both miss CTAs added later and risk a component-by-
 * component drift in what gets reported.
 *
 * Renders nothing. Mounted once in the root layout.
 */
export default function CtaClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target
      if (!(target instanceof Element)) return
      const anchor = target.closest(CTA_SELECTOR)
      if (!(anchor instanceof HTMLAnchorElement)) return
      trackCtaClick(ctaEventFromAnchor(anchor))
    }

    // Capture phase: the event is recorded even if a section's own handler
    // stops propagation before it reaches the document.
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}

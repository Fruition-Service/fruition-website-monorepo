/**
 * CTA click tracking.
 *
 * Pushes a `cta_click` event onto the GTM dataLayer (container GTM-PF6XWTL6,
 * mounted in `src/app/layout.tsx`). A GTM Custom Event trigger on `cta_click`
 * forwards it to GA4, where the portal reads it back per page via the GA4 Data
 * API — see `getCtaClicksByPath()` in `src/lib/googleAnalytics.ts`.
 *
 * Capture is delegated (see `CtaClickTracker`) rather than wired per component:
 * only a handful of the site's ~55 CTAs render through `CtaButton`; the rest are
 * raw `<a class="cta-btn">` in individual sections. One document-level listener
 * covers all of them, and every CTA added later, with no per-component work.
 *
 * Nothing here talks to the network, and every path is guarded — a CTA must
 * never fail to navigate because analytics is unavailable.
 */

export interface CtaClickEvent {
  /** Visible button text. */
  label: string
  /** Destination href as authored (may be relative or a #anchor). */
  href: string
  /** Visual variant, so primary vs outline performance is separable. */
  variant: string
  /** Where on the page the CTA lives — "inline" for body CTAs, "sticky" for the bar. */
  location: "inline" | "sticky"
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** The class every CTA on the site carries, whatever renders it. */
export const CTA_SELECTOR = "a.cta-btn"

/**
 * Build the event for a clicked CTA anchor. Pure, so the payload shape the GA4
 * report depends on can be tested without a DOM event.
 */
export function ctaEventFromAnchor(anchor: HTMLAnchorElement): CtaClickEvent {
  const variant =
    Array.from(anchor.classList)
      .find((c) => c.startsWith("cta-btn-") && c !== "cta-btn-label" && c !== "cta-btn-icon")
      ?.replace("cta-btn-", "") ?? ""

  // The label span exists on CtaButton output; raw anchors put text directly in.
  const labelEl = anchor.querySelector(".cta-btn-label")
  const label = (labelEl?.textContent ?? anchor.textContent ?? "").trim().replace(/\s+/g, " ")

  return {
    label,
    // getAttribute, not .href: keep the authored value rather than the absolute URL.
    href: anchor.getAttribute("href") ?? "",
    variant,
    location: anchor.closest('[data-cta-location="sticky"]') ? "sticky" : "inline",
  }
}

export function trackCtaClick(event: CtaClickEvent): void {
  if (typeof window === "undefined") return
  try {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({
      event: "cta_click",
      cta_label: event.label,
      cta_destination: event.href,
      cta_variant: event.variant,
      cta_location: event.location,
      // Read at click time rather than captured on mount: the sticky bar outlives
      // client-side navigations, so a stored pathname would go stale.
      page_path: window.location.pathname,
    })
  } catch {
    // Never let analytics break navigation.
  }
}

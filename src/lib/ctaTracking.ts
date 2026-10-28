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
    /** Injected by the Umami script when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set. */
    umami?: { track: (event: string, data?: Record<string, unknown>) => void }
    /** PostHog stub/SDK from the consent-gated loader in src/app/layout.tsx. */
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void }
  }
}

/** The class every CTA on the site carries, whatever renders it. */
export const CTA_SELECTOR = "a.cta-btn"

/**
 * Build the event for a clicked CTA anchor. Pure, so the payload shape the GA4
 * report depends on can be tested without a DOM event.
 */
/**
 * An element is hidden if it has no layout boxes (the reliable browser signal)
 * and its computed style says so. The second half matters for jsdom, which
 * reports no client rects for anything.
 */
function isHidden(el: HTMLElement): boolean {
  if (el.getClientRects().length > 0) return false
  const style = el.ownerDocument.defaultView?.getComputedStyle(el)
  if (!style) return false
  return style.display === "none" || style.visibility === "hidden"
}

/**
 * The visible text of a CTA.
 *
 * CtaButton renders a mobile and a desktop label side by side and hides one with
 * a breakpoint class, so `textContent` yields both concatenated — GA4 was seeing
 * labels like "Schedule a callBook a Free Consultation". Read only what is
 * actually on screen at click time.
 */
function readLabel(anchor: HTMLAnchorElement): string {
  const labelEl = anchor.querySelector(".cta-btn-label")
  const clean = (text: string) => text.trim().replace(/\s+/g, " ")
  if (!labelEl) return clean(anchor.textContent ?? "")

  const spans = Array.from(labelEl.children).filter(
    (c): c is HTMLElement => c instanceof HTMLElement,
  )
  if (spans.length === 0) return clean(labelEl.textContent ?? "")

  const visible = spans.filter((s) => !isHidden(s))
  const chosen = visible.length > 0 ? visible : spans
  return clean(chosen.map((s) => s.textContent ?? "").join(" "))
}

export function ctaEventFromAnchor(anchor: HTMLAnchorElement): CtaClickEvent {
  const variant =
    Array.from(anchor.classList)
      .find((c) => c.startsWith("cta-btn-") && c !== "cta-btn-label" && c !== "cta-btn-icon")
      ?.replace("cta-btn-", "") ?? ""

  const label = readLabel(anchor)

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

  // Umami records the same click as a custom event. Unlike GA4 this needs no
  // container configuration, so CTA numbers appear as soon as the script is
  // live rather than waiting on the GTM trigger.
  try {
    window.umami?.track("cta_click", {
      label: event.label,
      destination: event.href,
      variant: event.variant,
      location: event.location,
      page_path: window.location.pathname,
    })
  } catch {
    // Analytics must never break navigation.
  }

  // PostHog gets it too, so CTA clicks sit in the same funnels as pageviews and
  // replays. Absent when the visitor declined or on excluded paths.
  try {
    window.posthog?.capture("cta_click", {
      label: event.label,
      destination: event.href,
      variant: event.variant,
      location: event.location,
    })
  } catch {
    // Analytics must never break navigation.
  }

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

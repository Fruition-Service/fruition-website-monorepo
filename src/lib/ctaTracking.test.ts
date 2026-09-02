import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { trackCtaClick, ctaEventFromAnchor } from "./ctaTracking"
import { normalisePath } from "./googleAnalytics"

describe("trackCtaClick", () => {
  beforeEach(() => {
    window.dataLayer = []
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/post/ai-adoption-framework",
    } as Location)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete window.dataLayer
  })

  /**
   * The GA4 report reads `eventName == "cta_click"` and groups by `pagePath`.
   * If either the event name or the page path drifts, the portal's CTA columns
   * go quietly to zero rather than erroring — so pin the contract.
   */
  it("pushes a cta_click event carrying the page path", () => {
    trackCtaClick({
      label: "Book a consultation",
      href: "/contact-us#book",
      variant: "primary",
      location: "inline",
    })

    expect(window.dataLayer).toHaveLength(1)
    expect(window.dataLayer?.[0]).toEqual({
      event: "cta_click",
      cta_label: "Book a consultation",
      cta_destination: "/contact-us#book",
      cta_variant: "primary",
      cta_location: "inline",
      page_path: "/post/ai-adoption-framework",
    })
  })

  it("creates the dataLayer when GTM has not loaded yet", () => {
    delete window.dataLayer
    trackCtaClick({ label: "Talk to us", href: "/contact-us", variant: "", location: "inline" })
    expect(window.dataLayer).toHaveLength(1)
  })
})

describe("ctaEventFromAnchor", () => {
  function anchor(html: string): HTMLAnchorElement {
    const host = document.createElement("div")
    host.innerHTML = html
    return host.querySelector("a") as HTMLAnchorElement
  }

  // Most of the site's CTAs are plain anchors written inline in a section.
  it("reads a raw anchor CTA", () => {
    const el = anchor('<a href="/contact-us" class="cta-btn cta-btn-primary">Get started</a>')
    expect(ctaEventFromAnchor(el)).toEqual({
      label: "Get started",
      href: "/contact-us",
      variant: "primary",
      location: "inline",
    })
  })

  // CtaButton wraps its text in .cta-btn-label next to an icon span; taking the
  // whole textContent would pull the icon's text in with it.
  it("prefers the label span over the icon text in CtaButton output", () => {
    const el = anchor(
      '<a href="/contact-us#book" class="cta-btn cta-btn-outline">' +
        '<span class="cta-btn-icon">icon</span><span class="cta-btn-label">Book a call</span></a>',
    )
    const event = ctaEventFromAnchor(el)
    expect(event.label).toBe("Book a call")
    expect(event.variant).toBe("outline")
  })

  it("marks clicks inside the sticky bar so they stay separable", () => {
    const host = document.createElement("div")
    host.innerHTML =
      '<div data-cta-location="sticky"><a href="/contact-us" class="cta-btn cta-btn-on-dark-primary">Book</a></div>'
    const el = host.querySelector("a") as HTMLAnchorElement
    const event = ctaEventFromAnchor(el)
    expect(event.location).toBe("sticky")
    expect(event.variant).toBe("on-dark-primary")
  })

  it("keeps the authored href rather than resolving it to an absolute URL", () => {
    const el = anchor('<a href="#book" class="cta-btn cta-btn-primary">Book</a>')
    expect(ctaEventFromAnchor(el).href).toBe("#book")
  })
})

describe("normalisePath", () => {
  // GA4 reports "/post/foo", GSC reports "https://…/post/foo/". Both must land
  // on the same key or a post's traffic and search data split across two rows.
  it("collapses the variants GA4 and GSC disagree on", () => {
    expect(normalisePath("/post/foo/")).toBe("/post/foo")
    expect(normalisePath("/post/foo")).toBe("/post/foo")
    expect(normalisePath("/post/foo?utm_source=x")).toBe("/post/foo")
    expect(normalisePath("/post/foo#section")).toBe("/post/foo")
  })

  it("keeps the site root addressable", () => {
    expect(normalisePath("/")).toBe("/")
  })

  it("returns empty for empty input so callers can skip the row", () => {
    expect(normalisePath("")).toBe("")
  })
})

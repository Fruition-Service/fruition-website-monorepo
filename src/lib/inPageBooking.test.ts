import { describe, it, expect } from "vitest"
import { isBookingHref, shouldScrollToBooking } from "./inPageBooking"

/** A plain left click, the only kind that should ever be intercepted. */
const plainClick = {
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: false,
}

function anchor(html: string): HTMLAnchorElement {
  const host = document.createElement("div")
  host.innerHTML = html
  return host.firstElementChild as HTMLAnchorElement
}

describe("isBookingHref", () => {
  it("matches every spelling of the booking anchor that reaches the DOM", () => {
    // What bookingHref() produces, what the home page passes down, and the
    // absolute/trailing-slash forms Sanity content carries.
    expect(isBookingHref("/contact-us#book")).toBe(true)
    expect(isBookingHref("#book")).toBe(true)
    expect(isBookingHref("/contact-us/#book")).toBe(true)
    expect(isBookingHref("https://www.fruitionservices.io/contact-us#book")).toBe(true)
    expect(isBookingHref("  /contact-us#book  ")).toBe(true)
  })

  /**
   * The contact page itself, and any other anchor, must still navigate — only
   * the booking section is rendered in place on other pages.
   */
  it("leaves every other link alone", () => {
    expect(isBookingHref("/contact-us")).toBe(false)
    expect(isBookingHref("/contact-us#form")).toBe(false)
    expect(isBookingHref("#booking")).toBe(false)
    expect(isBookingHref("https://calendly.com/fruition")).toBe(false)
    expect(isBookingHref(null)).toBe(false)
    expect(isBookingHref("")).toBe(false)
  })
})

describe("shouldScrollToBooking", () => {
  it("intercepts a plain left click on a booking CTA", () => {
    const el = anchor('<a href="/contact-us#book" class="cta-btn">Book a call</a>')
    expect(shouldScrollToBooking(el, plainClick)).toBe(true)
  })

  /**
   * A modified or middle click means "open /contact-us somewhere else" —
   * hijacking it into a scroll would silently drop the visitor's intent.
   */
  it("lets the browser handle clicks that open a new tab or window", () => {
    const el = anchor('<a href="/contact-us#book">Book</a>')
    expect(shouldScrollToBooking(el, { ...plainClick, metaKey: true })).toBe(false)
    expect(shouldScrollToBooking(el, { ...plainClick, ctrlKey: true })).toBe(false)
    expect(shouldScrollToBooking(el, { ...plainClick, shiftKey: true })).toBe(false)
    expect(shouldScrollToBooking(el, { ...plainClick, altKey: true })).toBe(false)
    expect(shouldScrollToBooking(el, { ...plainClick, button: 1 })).toBe(false)
  })

  it("defers to a target, a download, and to any handler that already acted", () => {
    expect(
      shouldScrollToBooking(anchor('<a href="#book" target="_blank">Book</a>'), plainClick),
    ).toBe(false)
    expect(
      shouldScrollToBooking(anchor('<a href="#book" download>Book</a>'), plainClick),
    ).toBe(false)
    expect(
      shouldScrollToBooking(anchor('<a href="#book">Book</a>'), {
        ...plainClick,
        defaultPrevented: true,
      }),
    ).toBe(false)
  })

  it("passes a target of _self through", () => {
    const el = anchor('<a href="/contact-us#book" target="_self">Book</a>')
    expect(shouldScrollToBooking(el, plainClick)).toBe(true)
  })
})

import { describe, expect, it } from "vitest"
import { REGION_PAGES } from "@/data/regionPages"
import {
  BOOKING_ANCHOR,
  bookingHrefForPath,
  isRegionPagePath,
  pageBookingHref,
} from "./bookingLink"

describe("pageBookingHref", () => {
  it("writes the page's own URL plus the booking anchor", () => {
    expect(pageBookingHref("/monday-partner-australia")).toBe("/monday-partner-australia#book")
    expect(pageBookingHref("/monday-partner-uk")).toBe("/monday-partner-uk#book")
  })

  it("normalises a trailing slash and any existing query or hash", () => {
    expect(pageBookingHref("/monday-partner-singapore/")).toBe("/monday-partner-singapore#book")
    expect(pageBookingHref("/monday-partner-us?utm=x#book")).toBe("/monday-partner-us#book")
  })

  it("keeps the bare anchor for the root path", () => {
    expect(pageBookingHref("/")).toBe("#book")
  })
})

describe("isRegionPagePath", () => {
  it("recognises every location page the site ships", () => {
    const slugs = Object.keys(REGION_PAGES)
    expect(slugs.length).toBe(6)
    for (const slug of slugs) {
      expect(isRegionPagePath(`/${slug}`)).toBe(true)
    }
  })

  it("leaves every other route alone", () => {
    expect(isRegionPagePath("/contact-us")).toBe(false)
    expect(isRegionPagePath("/monday-partner-australia/services")).toBe(false)
    expect(isRegionPagePath("/")).toBe(false)
    expect(isRegionPagePath("")).toBe(false)
    expect(isRegionPagePath(null)).toBe(false)
    expect(isRegionPagePath(undefined)).toBe(false)
  })
})

describe("bookingHrefForPath", () => {
  it("points a location page's booking CTAs at that page's own #book", () => {
    // The stored link is the cross-page anchor; the page-local one wins.
    expect(bookingHrefForPath("/contact-us#book", "/monday-partner-australia")).toBe(
      "/monday-partner-australia#book",
    )
    // A Calendly URL, and the absolute anchor Sanity content sometimes carries.
    expect(bookingHrefForPath("https://calendly.com/fruition/30min", "/monday-partner-uk")).toBe(
      "/monday-partner-uk#book",
    )
    expect(
      bookingHrefForPath("https://www.fruitionservices.io/contact-us#book", "/monday-partner-us"),
    ).toBe("/monday-partner-us#book")
    // No stored link at all.
    expect(bookingHrefForPath(undefined, "/monday-partner-india")).toBe(
      "/monday-partner-india#book",
    )
  })

  it("never overrides a custom destination", () => {
    expect(bookingHrefForPath("https://example.com/webinar", "/monday-partner-uk")).toBe(
      "https://example.com/webinar",
    )
  })

  it("keeps the cross-page anchor everywhere else", () => {
    expect(bookingHrefForPath("/contact-us#book", "/pricing")).toBe(BOOKING_ANCHOR)
    expect(bookingHrefForPath(undefined, "/monday-crm-consulting")).toBe(BOOKING_ANCHOR)
    expect(bookingHrefForPath("https://calendly.com/fruition/30min", "/")).toBe(BOOKING_ANCHOR)
  })
})

import { describe, expect, it } from "vitest"
import { imageLinkHref, lightboxSize, sanityImageSize } from "./sanityImageSize"

describe("sanityImageSize", () => {
  it("reads the size from an asset ref", () => {
    expect(sanityImageSize("image-abc123-2400x1350-png")).toEqual({ width: 2400, height: 1350 })
  })
  it("returns null for anything else", () => {
    expect(sanityImageSize(undefined)).toBeNull()
    expect(sanityImageSize("file-abc-pdf")).toBeNull()
  })
})

describe("lightboxSize", () => {
  it("caps wide images at the lightbox width, keeping the ratio", () => {
    expect(lightboxSize({ width: 3200, height: 1800 })).toEqual({ width: 1600, height: 900 })
  })
  it("never upscales", () => {
    expect(lightboxSize({ width: 800, height: 600 })).toEqual({ width: 800, height: 600 })
    expect(lightboxSize(null)).toBeNull()
  })
})

describe("imageLinkHref", () => {
  it("finds an editor-supplied link", () => {
    expect(imageLinkHref({ href: "https://example.com" })).toBe("https://example.com")
    expect(imageLinkHref({ link: { href: "/contact-us" } })).toBe("/contact-us")
  })
  it("returns null for a plain image", () => {
    expect(imageLinkHref({ asset: { _ref: "image-a-1x1-png" }, alt: "x" })).toBeNull()
    expect(imageLinkHref(null)).toBeNull()
  })
})

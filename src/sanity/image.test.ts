import { describe, expect, it } from "vitest"
import { logoImageUrl, sanityImageDimensions } from "@/sanity/image"

describe("sanityImageDimensions", () => {
  it("reads width and height from an asset ref", () => {
    expect(sanityImageDimensions("image-03be2a79c89269f475b6f4547e27b58476084359-1873x500-png")).toEqual({
      width: 1873,
      height: 500,
    })
  })

  it("returns null for refs without dimensions", () => {
    expect(sanityImageDimensions(undefined)).toBeNull()
    expect(sanityImageDimensions("image-abc")).toBeNull()
    expect(sanityImageDimensions("image-abc-0x500-png")).toBeNull()
  })
})

describe("logoImageUrl", () => {
  it("requests logos by height, never upscaled, in an auto format", () => {
    const url = logoImageUrl({ asset: { _ref: "image-03be2a79c89269f475b6f4547e27b58476084359-1873x500-png" } })
    expect(url).toContain("h=130")
    expect(url).toContain("fit=max")
    expect(url).toContain("auto=format")
    expect(url).not.toContain("w=")
  })
})

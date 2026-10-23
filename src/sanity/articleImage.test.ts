import { describe, expect, it } from "vitest"
import { ARTICLE_IMAGE_WIDTH, articleImageProps, imageDimensions } from "./image"

/** A Sanity image value as it appears in a portable-text body. */
const img = (ref: string) => ({ _type: "image", asset: { _type: "reference", _ref: ref } })

// Real references pulled from the production dataset.
const PLACEHOLDER = "image-2c23664a25be2830c55411a2bad67b0a36fb4669-147x83-jpg"
const COVER = "image-cd931c72e90f9ab11de540fbfc545aeb3c8e0a07-1200x675-jpg"
const NARROW_COVER = "image-1c9b3307033f4605a1c1effc485dc189aaaaaaaa-595x323-png"
const WIDE = "image-bd7f73fc264f2b88c909a0a8e157cd2f0c2782af-2424x1080-png"

describe("imageDimensions", () => {
  it("reads the size off an asset reference", () => {
    expect(imageDimensions(img(COVER))).toEqual({ width: 1200, height: 675 })
  })

  it("accepts a bare reference string and a { _ref } object", () => {
    expect(imageDimensions(COVER)).toEqual({ width: 1200, height: 675 })
    expect(imageDimensions({ _ref: PLACEHOLDER })).toEqual({ width: 147, height: 83 })
  })

  it("returns null when there is no size to read", () => {
    expect(imageDimensions(undefined)).toBeNull()
    expect(imageDimensions({ asset: {} })).toBeNull()
    expect(imageDimensions("image-abc-jpg")).toBeNull()
  })
})

describe("articleImageProps", () => {
  it("fills the column when the asset is wide enough", () => {
    const p = articleImageProps(img(COVER))
    expect(p.fillsColumn).toBe(true)
    expect(p.width).toBe(ARTICLE_IMAGE_WIDTH)
    // 1200x675 is 16:9, so the reserved box keeps that ratio.
    expect(p.height).toBe(Math.round((ARTICLE_IMAGE_WIDTH / 1200) * 675))
  })

  it("never stretches a placeholder scrape across the column", () => {
    const p = articleImageProps(img(PLACEHOLDER))
    expect(p.fillsColumn).toBe(false)
    expect(p.width).toBe(147)
    expect(p.height).toBe(83)
  })

  it("never asks the CDN for more pixels than the asset holds", () => {
    // A 147px asset requested at 1480px is exactly the upscale that looks blurry.
    expect(articleImageProps(img(PLACEHOLDER)).src).toContain("w=147")
    expect(articleImageProps(img(NARROW_COVER)).src).toContain("w=595")
    // Wide enough to fill the column, but still short of 2x — ask for what it has.
    expect(articleImageProps(img(COVER)).src).toContain("w=1200")
  })

  it("caps a very large asset at 2x the column instead of shipping the original", () => {
    expect(articleImageProps(img(WIDE)).src).toContain(`w=${ARTICLE_IMAGE_WIDTH * 2}`)
  })

  it("hands the browser a sizes hint matching the laid-out width", () => {
    expect(articleImageProps(img(PLACEHOLDER)).sizes).toBe("147px")
    expect(articleImageProps(img(COVER)).sizes).toContain(`${ARTICLE_IMAGE_WIDTH}px`)
  })

})

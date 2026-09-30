import { describe, expect, it } from "vitest"

import { mediaItemsFor, platformSpec } from "@/lib/social/zernio"
import { problemsFor } from "@/lib/social/validate"

/**
 * Several images on one channel have to arrive as several images.
 *
 * The regression this guards: a post carrying four slides published as a
 * swipeable carousel on LinkedIn and Facebook, and as a single picture on
 * Instagram, because only the first image was ever sent.
 */

const SLIDES = [
  "https://cdn.sanity.io/images/p/production/aaa-1080x1350.png",
  "https://cdn.sanity.io/images/p/production/bbb-1080x1350.png",
  "https://cdn.sanity.io/images/p/production/ccc-1080x1350.png",
  "https://cdn.sanity.io/images/p/production/ddd-1080x1350.png",
]

describe("mediaItemsFor", () => {
  it("sends every image to Instagram, in the order given", () => {
    const items = mediaItemsFor(platformSpec("instagram"), { imageUrls: SLIDES })
    expect(items).toHaveLength(4)
    expect(items!.map((i) => i.type)).toEqual(["image", "image", "image", "image"])
    // 1080x1350 is 4:5, inside Instagram's range, so only the size cap applies.
    expect(items!.map((i) => i.url)).toEqual(SLIDES.map((u) => `${u.replace(/\?.*$/, "")}?w=1080&fit=max&fm=jpg`))
  })

  it("titles the post once, not every slide", () => {
    const items = mediaItemsFor(platformSpec("instagram"), { imageUrls: SLIDES }, "Best monday CRM Templates")
    expect(items!.filter((i) => i.title)).toHaveLength(1)
    expect(items![0].title).toBe("Best monday CRM Templates")
  })

  it("cuts from the end on a channel that takes one image", () => {
    const items = mediaItemsFor(platformSpec("gbp-au"), { imageUrls: SLIDES })
    expect(items).toHaveLength(1)
    expect(items![0].url).toBe(SLIDES[0])
  })

  it("lets a LinkedIn PDF displace the images entirely", () => {
    const items = mediaItemsFor(platformSpec("linkedin"), {
      imageUrls: SLIDES,
      documentUrl: "https://example.com/carousel.pdf",
      documentName: "carousel.pdf",
    })
    expect(items).toEqual([{ type: "document", url: "https://example.com/carousel.pdf", title: "carousel.pdf" }])
  })

  it("attaches nothing when there are no images", () => {
    expect(mediaItemsFor(platformSpec("instagram"), { imageUrls: [] })).toBeUndefined()
    expect(mediaItemsFor(platformSpec("instagram"), {})).toBeUndefined()
  })

  it("attaches nothing on a text-only channel", () => {
    expect(mediaItemsFor(platformSpec("reddit"), { imageUrls: SLIDES })).toBeUndefined()
  })
})

describe("problemsFor, carousel rules", () => {
  const instagram = { label: "Instagram", limit: 2200, needsMedia: true, supportsMedia: true, maxMedia: 10 }

  it("accepts a four-slide Instagram carousel", () => {
    expect(problemsFor(instagram, { content: "hi", mediaUrls: SLIDES })).toEqual([])
  })

  it("still blocks Instagram with no image", () => {
    expect(problemsFor(instagram, { content: "hi", mediaUrls: [] })).toEqual([
      "Instagram: an image or a video is required.",
    ])
  })

  it("says so rather than silently trimming past the cap", () => {
    const gbp = { label: "Google Business", limit: 1500, needsMedia: false, supportsMedia: true, maxMedia: 1 }
    expect(problemsFor(gbp, { content: "hi", mediaUrls: SLIDES })).toEqual([
      "Google Business: 4 images, and it takes 1. Remove 3.",
    ])
  })
})

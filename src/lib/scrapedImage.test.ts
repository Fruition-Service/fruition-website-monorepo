/**
 * Unit tests for choosing the real image URL out of scraped markup.
 */
import { describe, expect, it } from "vitest"
import { bestScrapedImageUrl, widestSrcsetUrl } from "@/lib/scrapedImage"

describe("widestSrcsetUrl", () => {
  it("picks the widest `w` candidate regardless of order", () => {
    expect(widestSrcsetUrl("/s.jpg 320w, /xl.jpg 1600w, /m.jpg 740w")).toBe("/xl.jpg")
  })

  it("picks the highest density among `x` candidates", () => {
    expect(widestSrcsetUrl("/one.jpg 1x, /two.jpg 2x")).toBe("/two.jpg")
  })

  it("prefers any density over a bare candidate", () => {
    expect(widestSrcsetUrl("/bare.jpg, /retina.jpg 2x")).toBe("/retina.jpg")
  })

  it("falls back to the first candidate when none carry a descriptor", () => {
    expect(widestSrcsetUrl("/only.jpg")).toBe("/only.jpg")
  })

  it("keeps a URL that contains commas — Wix transforms are full of them", () => {
    const base = "https://static.wixstatic.com/media/d2622f_abc~mv2.png"
    const small = `${base}/v1/fit/w_320,h_180/d2622f_abc~mv2.png`
    const large = `${base}/v1/fit/w_1600,h_900/d2622f_abc~mv2.png`
    expect(widestSrcsetUrl(`${small} 320w, ${large} 1600w`)).toBe(large)
  })

  it("treats a trailing comma as the end of a candidate", () => {
    expect(widestSrcsetUrl("/bare.jpg, /wide.jpg 1200w")).toBe("/wide.jpg")
  })

  it("returns null for nothing usable", () => {
    expect(widestSrcsetUrl("")).toBeNull()
    expect(widestSrcsetUrl(null)).toBeNull()
    expect(widestSrcsetUrl("   ,  ")).toBeNull()
  })
})

describe("bestScrapedImageUrl", () => {
  const MEDIA = "d2622f_c18f925f3e474aa49b1953278e694433~mv2.png"
  const ORIGINAL = `https://static.wixstatic.com/media/${MEDIA}`

  it("takes the first usable candidate", () => {
    expect(bestScrapedImageUrl([null, "  ", "/real.jpg", "/later.jpg"])).toBe("/real.jpg")
  })

  it("skips inline data URIs — those are the blur-up placeholder", () => {
    expect(bestScrapedImageUrl(["data:image/png;base64,AAAA", "/real.jpg"])).toBe("/real.jpg")
  })

  it("normalises a Wix placeholder to its full-resolution original", () => {
    expect(bestScrapedImageUrl([`${ORIGINAL}/v1/fill/w_147,h_83,blur_2/${MEDIA}`])).toBe(ORIGINAL)
  })

  it("returns null when every candidate is unusable", () => {
    expect(bestScrapedImageUrl([undefined, "", "data:image/gif;base64,R0lGOD"])).toBeNull()
  })
})

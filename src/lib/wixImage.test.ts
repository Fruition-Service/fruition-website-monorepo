/**
 * Unit tests for the Wix media URL helpers.
 *
 * The URLs here are real shapes taken from the migrated content: the stored
 * `coverImageUrl` on migrated posts, and the lazy-load placeholders that the
 * blog scrapers uploaded by mistake.
 */
import { describe, expect, it } from "vitest"
import { isLowResWixUrl, parseWixMediaUrl, wixOriginalUrl } from "@/lib/wixImage"

const MEDIA = "d2622f_c18f925f3e474aa49b1953278e694433~mv2.png"
const ORIGINAL = `https://static.wixstatic.com/media/${MEDIA}`

describe("parseWixMediaUrl", () => {
  it("strips a fill transform back to the original", () => {
    const parsed = parseWixMediaUrl(`${ORIGINAL}/v1/fill/w_1069,h_544,al_c/${MEDIA}`)
    expect(parsed).toEqual({ original: ORIGINAL, transformWidth: 1069, blurred: false })
  })

  it("recognises a blurred lazy-load placeholder", () => {
    const parsed = parseWixMediaUrl(
      `${ORIGINAL}/v1/fill/w_49,h_25,al_c,q_80,usm_0.66_1.00_0.01,blur_2/${MEDIA}`,
    )
    expect(parsed).toEqual({ original: ORIGINAL, transformWidth: 49, blurred: true })
  })

  it("handles fit and crop transforms, not just fill", () => {
    expect(parseWixMediaUrl(`${ORIGINAL}/v1/fit/w_147,h_83,q_90/${MEDIA}`)?.original).toBe(ORIGINAL)
    expect(
      parseWixMediaUrl(`${ORIGINAL}/v1/crop/x_0,y_12,w_800,h_450,q_85/${MEDIA}`)?.transformWidth,
    ).toBe(800)
  })

  it("accepts a protocol-relative URL", () => {
    expect(parseWixMediaUrl(`//static.wixstatic.com/media/${MEDIA}/v1/fill/w_49,h_25/${MEDIA}`))
      .toMatchObject({ original: ORIGINAL })
  })

  it("leaves an untransformed media URL alone", () => {
    expect(parseWixMediaUrl(ORIGINAL)).toEqual({
      original: ORIGINAL,
      transformWidth: null,
      blurred: false,
    })
  })

  it("returns null for anything that is not Wix media", () => {
    expect(parseWixMediaUrl("https://cdn.sanity.io/images/bt6nb58h/production/abc-147x83.jpg")).toBeNull()
    expect(parseWixMediaUrl("https://static.wixstatic.com/shapes/abc123.svg")).toBeNull()
    expect(parseWixMediaUrl("/relative/path.png")).toBeNull()
    expect(parseWixMediaUrl("")).toBeNull()
  })

  it("does not mistake a lookalike host for Wix", () => {
    expect(parseWixMediaUrl("https://static.wixstatic.com.evil.test/media/x.png")).toBeNull()
  })
})

describe("wixOriginalUrl", () => {
  it("rewrites a placeholder to its full-resolution original", () => {
    expect(wixOriginalUrl(`${ORIGINAL}/v1/fill/w_147,h_83,blur_2/${MEDIA}`)).toBe(ORIGINAL)
  })

  it("passes non-Wix URLs straight through", () => {
    const other = "https://cdn.sanity.io/images/bt6nb58h/production/abc-1200x800.png"
    expect(wixOriginalUrl(other)).toBe(other)
  })
})

describe("isLowResWixUrl", () => {
  it("flags blurred placeholders whatever their width", () => {
    expect(isLowResWixUrl(`${ORIGINAL}/v1/fill/w_1200,h_800,blur_2/${MEDIA}`)).toBe(true)
  })

  it("flags a transform narrower than the slot it fills", () => {
    expect(isLowResWixUrl(`${ORIGINAL}/v1/fill/w_147,h_83/${MEDIA}`)).toBe(true)
    expect(isLowResWixUrl(`${ORIGINAL}/v1/fill/w_700,h_400/${MEDIA}`, 740)).toBe(true)
  })

  it("passes a transform wide enough for the slot", () => {
    expect(isLowResWixUrl(`${ORIGINAL}/v1/fill/w_1200,h_675,al_c/${MEDIA}`)).toBe(false)
  })

  it("passes an untransformed original — Wix serves the full upload", () => {
    expect(isLowResWixUrl(ORIGINAL)).toBe(false)
  })

  it("ignores non-Wix URLs", () => {
    expect(isLowResWixUrl("https://cdn.sanity.io/images/x/y-49x25.jpg")).toBe(false)
  })
})

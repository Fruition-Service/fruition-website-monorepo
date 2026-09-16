import { describe, expect, it } from "vitest"
import { matchArchivedImage, normaliseAlt, type ArchivedImage } from "./archivedImageMatch"

const img = (n: number, alt: string): ArchivedImage => ({ src: `https://wix/img${n}.png`, alt })
const src = (n: number) => `https://wix/img${n}.png`

describe("normaliseAlt", () => {
  it("ignores case and whitespace noise", () => {
    expect(normaliseAlt("  Fathom   Pricing  Plans ")).toBe("fathom pricing plans")
    expect(normaliseAlt(null)).toBe("")
  })
})

describe("matchArchivedImage", () => {
  it("prefers alt text over position", () => {
    const body = [img(1, "Otter.ai"), img(2, "Fathom Pricing Plans")]
    expect(matchArchivedImage({ index: 1, alt: "Fathom Pricing Plans" }, body, new Set())).toBe(src(2))
  })

  it("falls back to the scrape position when alt does not match", () => {
    const body = [img(1, "a"), img(2, "b"), img(3, "c")]
    expect(matchArchivedImage({ index: 3, alt: "nothing like this" }, body, new Set())).toBe(src(3))
  })

  /**
   * The ai-call-recording-apps regression: `-body-9` sat at array position 7,
   * so it and the position-9 slot both claimed source #9. Previously one of
   * them came back empty and stayed at 147px.
   */
  it("does not leave a slot empty when two claim the same numbered source", () => {
    const body = [img(1, "one"), img(2, "two"), img(3, "three"), img(4, "four")]
    const taken = new Set<string>()

    const first = matchArchivedImage({ index: 3, alt: "" }, body, taken)
    expect(first).toBe(src(3))
    taken.add(first!)

    // Same numbered position, already claimed — must still get something.
    const second = matchArchivedImage({ index: 3, alt: "" }, body, taken)
    expect(second).not.toBeNull()
    expect(second).not.toBe(first)
    expect(second).toBe(src(4)) // the next free image after its position
  })

  it("never hands the same source to two slots", () => {
    const body = [img(1, "dup"), img(2, "dup"), img(3, "dup")]
    const taken = new Set<string>()
    const got = [1, 1, 1].map((index) => {
      const hit = matchArchivedImage({ index, alt: "dup" }, body, taken)
      if (hit) taken.add(hit)
      return hit
    })
    expect(new Set(got).size).toBe(3)
    expect(got).not.toContain(null)
  })

  it("wraps back to an earlier free image when the tail is exhausted", () => {
    const body = [img(1, "a"), img(2, "b")]
    const taken = new Set([src(2)])
    expect(matchArchivedImage({ index: 2, alt: "" }, body, taken)).toBe(src(1))
  })

  it("returns null only when every source is claimed", () => {
    const body = [img(1, "a")]
    expect(matchArchivedImage({ index: 1, alt: "a" }, body, new Set([src(1)]))).toBeNull()
    expect(matchArchivedImage({ index: 1, alt: "a" }, [], new Set())).toBeNull()
  })

  it("will not reuse an alt-matched source that is already claimed", () => {
    const body = [img(1, "same"), img(2, "other")]
    // Alt matches image 1, but it is taken — fall through rather than duplicate.
    expect(matchArchivedImage({ index: 2, alt: "same" }, body, new Set([src(1)]))).toBe(src(2))
  })
})

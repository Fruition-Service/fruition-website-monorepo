import { describe, expect, it } from "vitest"
import { MID_CTA_MIN_BLOCKS, midArticleSplitIndex, midCtaCopyFor, splitBodyForMidCta } from "./blogMidCta"

type Node = { _key: string; _type: string; style?: string; listItem?: string }
const p = (k: string): Node => ({ _key: k, _type: "block", style: "normal" })
const h2 = (k: string): Node => ({ _key: k, _type: "block", style: "h2" })
const li = (k: string, listItem = "bullet"): Node => ({ _key: k, _type: "block", style: "normal", listItem })
const img = (k: string): Node => ({ _key: k, _type: "image" })

describe("midArticleSplitIndex", () => {
  it("skips short posts", () => {
    expect(midArticleSplitIndex(undefined)).toBe(-1)
    expect(midArticleSplitIndex([])).toBe(-1)
    const short = Array.from({ length: MID_CTA_MIN_BLOCKS - 1 }, (_, i) => p(`b${i}`))
    expect(midArticleSplitIndex(short)).toBe(-1)
  })

  it("splits a plain post at the middle", () => {
    const body = Array.from({ length: 10 }, (_, i) => p(`b${i}`))
    expect(midArticleSplitIndex(body)).toBe(5)
  })

  it("prefers a section heading near the middle", () => {
    const body = [p("a"), p("b"), p("c"), p("d"), p("e"), p("f"), h2("g"), p("h"), p("i"), p("j")]
    expect(midArticleSplitIndex(body)).toBe(6)
  })

  it("never splits inside a list", () => {
    const body = [p("a"), p("b"), p("c"), li("d"), li("e"), li("f"), li("g"), p("h"), p("i"), p("j")]
    const i = midArticleSplitIndex(body)
    expect(i).toBeGreaterThan(0)
    expect(body[i - 1].listItem && body[i].listItem).toBeFalsy()
    expect([3, 7]).toContain(i)
  })

  it("never splits straight after a heading", () => {
    const body = [p("a"), p("b"), p("c"), p("d"), h2("e"), p("f"), p("g"), p("h"), p("i"), p("j")]
    const i = midArticleSplitIndex(body)
    expect(body[i - 1].style).not.toBe("h2")
    expect(i).toBe(4)
  })

  it("can split before or after an image block", () => {
    const body = [p("a"), p("b"), p("c"), p("d"), img("e"), p("f"), p("g"), p("h"), p("i"), p("j")]
    expect(midArticleSplitIndex(body)).toBe(5)
  })

  it("returns -1 when the whole middle is one list", () => {
    const body = [p("a"), ...Array.from({ length: 10 }, (_, i) => li(`l${i}`, "number")), p("z")]
    expect(midArticleSplitIndex(body)).toBe(-1)
  })
})

describe("splitBodyForMidCta", () => {
  it("keeps every block, in order", () => {
    const body = Array.from({ length: 12 }, (_, i) => p(`b${i}`))
    const { before, after, hasMidCta } = splitBodyForMidCta(body)
    expect(hasMidCta).toBe(true)
    expect([...before, ...after]).toEqual(body)
    expect(before.length).toBe(6)
  })

  it("returns the whole body with no banner for short posts", () => {
    const body = [p("a"), p("b")]
    expect(splitBodyForMidCta(body)).toEqual({ before: body, after: [], hasMidCta: false })
    expect(splitBodyForMidCta(undefined)).toEqual({ before: [], after: [], hasMidCta: false })
  })
})

describe("midCtaCopyFor", () => {
  it("uses AI adoption readiness copy for AI adoption posts", () => {
    const copy = midCtaCopyFor({ title: "The AI Adoption Framework: a step by step guide" })
    expect(copy?.body).toMatch(/AI adoption readiness audit/)
  })

  it("matches AI adoption from a category slug", () => {
    const copy = midCtaCopyFor({ title: "Where to start", categories: [{ title: "Guides", slug: "ai-adoption" }] })
    expect(copy?.body).toMatch(/AI adoption readiness audit/)
  })

  it("uses monday.com copy for monday posts, even AI pricing ones", () => {
    expect(midCtaCopyFor({ title: "monday.com and WhatsApp Integration" })?.ctaLabel).toMatch(/monday\.com/)
    expect(midCtaCopyFor({ title: "monday AI Pricing Model 2026" })?.ctaLabel).toMatch(/monday\.com/)
  })

  it("uses general AI copy for other AI posts", () => {
    expect(midCtaCopyFor({ title: "ChatGPT vs Claude for sales teams" })?.ctaLabel).toMatch(/AI audit/)
  })

  it("falls back to the default banner copy", () => {
    expect(midCtaCopyFor({ title: "Hiring your first operations manager" })).toBeNull()
    expect(midCtaCopyFor({})).toBeNull()
  })

  it("never uses dashes in copy", () => {
    for (const title of ["AI adoption", "monday.com", "ChatGPT"]) {
      const c = midCtaCopyFor({ title })
      expect(JSON.stringify(c)).not.toMatch(/[–—]/)
    }
  })
})

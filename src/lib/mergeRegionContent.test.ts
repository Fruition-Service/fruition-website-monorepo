import { describe, expect, it } from "vitest"
import { REGION_PAGES, type RegionSlug } from "@/data/regionPages"
import { mergeRegionContent, toSanityRegionContent } from "./mergeRegionContent"

const SLUGS = Object.keys(REGION_PAGES) as RegionSlug[]

describe("mergeRegionContent", () => {
  it.each(SLUGS)(
    "%s round-trips through Sanity unchanged",
    (slug) => {
      const shipped = REGION_PAGES[slug]
      // Seeding writes toSanityRegionContent(shipped); the page reads it back
      // through mergeRegionContent. If those aren't inverses, seeding moves
      // words on a live page.
      expect(mergeRegionContent(shipped, toSanityRegionContent(shipped))).toEqual(shipped)
    },
  )

  it("falls back to shipped copy for a missing document", () => {
    const shipped = REGION_PAGES["monday-partner-australia"]
    expect(mergeRegionContent(shipped, null)).toEqual(shipped)
  })

  it("keeps shipped copy for blank strings and empty arrays", () => {
    const shipped = REGION_PAGES["monday-partner-uk"]
    const merged = mergeRegionContent(shipped, {
      hero: { heading: "   ", subheading: "" },
      faq: { items: [] },
      numbers: { stats: [] },
    })
    expect(merged.hero.heading).toBe(shipped.hero.heading)
    expect(merged.hero.subheading).toBe(shipped.hero.subheading)
    expect(merged.faq.items).toEqual(shipped.faq.items)
    expect(merged.numbers.stats).toEqual(shipped.numbers.stats)
  })

  it("overrides only the fields an editor filled in", () => {
    const shipped = REGION_PAGES["monday-partner-singapore"]
    const merged = mergeRegionContent(shipped, {
      hero: { heading: "Edited in Sanity" },
      faq: { items: [{ _key: "a", question: "Only question?", answer: "Only answer." }] },
    })
    expect(merged.hero.heading).toBe("Edited in Sanity")
    expect(merged.hero.headingAccent).toBe(shipped.hero.headingAccent)
    expect(merged.hero.subheading).toBe(shipped.hero.subheading)
    expect(merged.faq.items).toEqual([{ question: "Only question?", answer: "Only answer." }])
    expect(merged.faq.heading).toBe(shipped.faq.heading)
  })

  it("never lets Sanity override structural fields", () => {
    const shipped = REGION_PAGES["monday-partner-us"]
    const merged = mergeRegionContent(shipped, {
      // @ts-expect-error — these are intentionally absent from RegionSanityContent
      slug: "hijacked",
      teamRegion: "APAC",
      bookingRegion: "APAC",
    })
    expect(merged.slug).toBe(shipped.slug)
    expect(merged.teamRegion).toBe(shipped.teamRegion)
    expect(merged.bookingRegion).toBe(shipped.bookingRegion)
  })
})

import { describe, expect, it } from "vitest"
import { buildJsonLd, DEFAULT_CONTENT } from "./content"
import { mergeContent, toSanityFields } from "./contentMerge"

describe("implementation-packages Sanity content", () => {
  it("falls back to the defaults when there is no document", () => {
    expect(mergeContent(null)).toEqual(DEFAULT_CONTENT)
  })

  it("round-trips the seed: a freshly seeded document renders today's page exactly", () => {
    const doc = JSON.parse(JSON.stringify(toSanityFields()))
    expect(mergeContent(doc)).toEqual(DEFAULT_CONTENT)
  })

  it("gives every seeded list item a _key and _type", () => {
    const doc = toSanityFields()
    const items = [
      ...(doc.packages as object[]),
      ...(doc.faqs as object[]),
      ...(doc.compareRows as object[]),
      ...((doc.servicePrices as Array<{ items: object[] }>)[0].items),
    ]
    for (const item of items) {
      expect(item).toHaveProperty("_key")
      expect(item).toHaveProperty("_type")
    }
  })

  it("uses the Sanity meta title and description, in the page and in the JSON-LD", () => {
    const c = mergeContent({ seoTitle: "New title | Fruition", seoDescription: "New description." })
    expect(c.seo).toEqual({ title: "New title | Fruition", description: "New description." })
    const page = buildJsonLd(c)["@graph"][0] as { name: string; description: string }
    expect(page.name).toBe("New title | Fruition")
    expect(page.description).toBe("New description.")
  })

  it("shows the default for blank fields", () => {
    const c = mergeContent({ seoTitle: "  ", hero: { h1Accent: "", lead: "Edited lead" } })
    expect(c.seo.title).toBe(DEFAULT_CONTENT.seo.title)
    expect(c.hero.h1Accent).toBe(DEFAULT_CONTENT.hero.h1Accent)
    expect(c.hero.lead).toBe("Edited lead")
  })

  it("matches packages to their defaults by id", () => {
    const c = mergeContent({ packages: [{ id: "lockstep", name: "", basePriceUsd: 6000 }] })
    expect(c.packages).toHaveLength(1)
    expect(c.packages[0]).toMatchObject({ id: "lockstep", name: "Lock-Step", basePriceUsd: 6000, cadence: "one-time" })
  })

  it("replaces the FAQ list as a whole, so editors can drop questions", () => {
    const c = mergeContent({ faqs: [{ q: "Only question?", a: "Only answer." }] })
    expect(c.faqs).toEqual([{ q: "Only question?", a: "Only answer." }])
    expect(buildJsonLd(c)["@graph"].find((n) => n["@type"] === "FAQPage")).toMatchObject({
      mainEntity: [{ name: "Only question?", acceptedAnswer: { text: "Only answer." } }],
    })
  })

  it("treats an empty comparison cell as Not included", () => {
    const c = mergeContent({ compareRows: [{ label: "Training", training: "2 sessions", lockstep: "", deployed: "✓ Ongoing" }] })
    expect(c.compareRows).toEqual([{ label: "Training", cells: ["2 sessions", null, "✓ Ongoing"] }])
  })

  it("never lets a stray billing value through", () => {
    const c = mergeContent({ packages: [{ id: "deployed", cadence: "weekly" }] })
    expect(c.packages[0].cadence).toBe("per month")
  })
})

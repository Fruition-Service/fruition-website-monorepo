import { describe, expect, it } from "vitest"
import { DEFAULT_SECTIONS } from "./content"
import { mergeSections, toSanitySections } from "./contentMerge"

const fresh = <T>(v: T): T => JSON.parse(JSON.stringify(v))

describe("monday-for-government Sanity sections", () => {
  it("falls back to the defaults when there is no document", () => {
    expect(mergeSections(null)).toEqual(DEFAULT_SECTIONS)
    expect(mergeSections({})).toEqual(DEFAULT_SECTIONS)
  })

  it("comes with the sections the page renders today", () => {
    expect(DEFAULT_SECTIONS.capabilityBlocks?.blocks).toHaveLength(3)
    expect(DEFAULT_SECTIONS.benefitLedger?.items).toHaveLength(5)
  })

  it("round-trips the seed: a freshly seeded document renders today's page exactly", () => {
    expect(mergeSections({ sections: fresh(toSanitySections()) })).toEqual(DEFAULT_SECTIONS)
    expect(mergeSections(fresh(toSanitySections()))).toEqual(DEFAULT_SECTIONS)
  })

  it("gives every seeded list item a _key and _type", () => {
    const doc = toSanitySections()
    const sections = doc as {
      capabilityBlocks: { blocks: Array<{ points: object[] }> }
      benefitLedger: { items: object[] }
    }
    const items = [
      ...sections.capabilityBlocks.blocks,
      ...sections.capabilityBlocks.blocks.flatMap((b) => b.points),
      ...sections.benefitLedger.items,
    ]
    for (const item of items) {
      expect(item).toHaveProperty("_key")
      expect(item).toHaveProperty("_type")
    }
  })

  it("shows the default for a blank field", () => {
    const c = mergeSections({ sections: { benefitLedger: { heading: "  ", eyebrow: "// Edited" } } })
    expect(c.benefitLedger?.heading).toBe(DEFAULT_SECTIONS.benefitLedger?.heading)
    expect(c.benefitLedger?.eyebrow).toBe("// Edited")
  })

  it("takes an edited paragraph, title and point text", () => {
    const c = mergeSections({
      sections: {
        capabilityBlocks: {
          heading: "Edited heading",
          blocks: [{ _key: "blocks-0", _type: "capabilityBlock", title: "Edited title" }],
        },
        benefitLedger: { items: [{ _key: "items-1", _type: "benefitLedgerItem", text: "Edited text" }] },
      },
    })
    expect(c.capabilityBlocks?.heading).toBe("Edited heading")
    expect(c.capabilityBlocks?.blocks[0].title).toBe("Edited title")
    // The rest of the seeded item keeps its own default.
    expect(c.capabilityBlocks?.blocks[0].lead).toBe(DEFAULT_SECTIONS.capabilityBlocks?.blocks[0].lead)
    expect(c.benefitLedger?.items).toHaveLength(1)
    expect(c.benefitLedger?.items[0]).toEqual({
      text: "Edited text",
      label: DEFAULT_SECTIONS.benefitLedger?.items[0].label,
    })
  })

  it("keeps the default list when Sanity leaves it empty", () => {
    const c = mergeSections({ sections: { capabilityBlocks: { blocks: [] } } })
    expect(c.capabilityBlocks?.blocks).toEqual(DEFAULT_SECTIONS.capabilityBlocks?.blocks)
  })

  it("starts a block Sanity adds beyond the defaults blank", () => {
    const seeded = toSanitySections() as { capabilityBlocks: { blocks: object[] } }
    const c = mergeSections({
      sections: {
        capabilityBlocks: {
          blocks: [
            ...seeded.capabilityBlocks.blocks,
            { _key: "blocks-3", _type: "capabilityBlock", title: "A fourth block" },
          ],
        },
      },
    })
    expect(c.capabilityBlocks?.blocks).toHaveLength(4)
    expect(c.capabilityBlocks?.blocks[3]).toMatchObject({ title: "A fourth block", lead: "", points: [] })
  })

  it("drops Sanity's list bookkeeping from the rendered copy", () => {
    const c = mergeSections({ sections: toSanitySections() })
    expect(JSON.stringify(c)).not.toContain("_key")
    expect(JSON.stringify(c)).not.toContain("_type")
  })
})

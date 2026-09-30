import { describe, expect, it } from "vitest"
import { buildIndex, searchIndex, tokenize } from "./search"
import { flattenSanity, sanityRecords, type SanityDoc } from "./sanity"
import { staticRecords } from "./static"
import type { KnowledgeRecord } from "./types"

function record(id: string, kind: KnowledgeRecord["kind"], title: string, text = ""): KnowledgeRecord {
  return { id, kind, title, url: "/x", summary: "", text, tags: [], facts: {} }
}

describe("tokenize", () => {
  it("drops stopwords and folds plurals", () => {
    expect(tokenize("We need help with our CRM migrations")).toEqual(["crm", "migration"])
  })
  it("keeps dotted and plus-signed product names", () => {
    expect(tokenize("monday.com and C++")).toEqual(["monday.com", "c++"])
  })
})

describe("searchIndex", () => {
  const index = buildIndex([
    record("solution:a", "solution", "Construction project management", "RFIs, change orders"),
    record("faq:b", "faq", "Does monday.com have construction templates?"),
    record("solution:c", "solution", "Solar CRM", "Leads to grid connection"),
  ])

  it("ranks title matches first", () => {
    const hits = searchIndex(index, "construction project")
    expect(hits[0].record.id).toBe("solution:a")
  })

  it("filters by kind", () => {
    const hits = searchIndex(index, "construction", { kinds: ["faq"] })
    expect(hits.map((h) => h.record.id)).toEqual(["faq:b"])
  })

  it("returns nothing for a query of stopwords", () => {
    expect(searchIndex(index, "what is the")).toEqual([])
  })
})

describe("flattenSanity", () => {
  it("joins portable text spans into lines and skips plumbing", () => {
    const lines = flattenSanity({
      heroHeading: "Move to monday CRM",
      heroImage: { asset: { _ref: "image-abc" } },
      primaryCtaUrl: "https://calendly.com/x",
      accentColor: "#8015e8",
      body: [
        { _type: "block", children: [{ text: "First " }, { text: "line." }] },
        { _type: "block", children: [{ text: "Second line." }] },
      ],
    })
    expect(lines).toEqual(["Move to monday CRM", "First line.", "Second line."])
  })
})

describe("sanityRecords", () => {
  it("maps each type to its live URL and kind", () => {
    const docs: SanityDoc[] = [
      { _id: "1", _type: "partnershipPage", slug: { current: "n8n-integration-partner" }, partnerName: "n8n" },
      { _id: "2", _type: "aiPartnerPage", slug: { current: "ai-capability-assessment" }, brandName: "Assessment" },
      { _id: "3", _type: "aiPartnerPage", slug: { current: "openai-chatgpt-partner" }, brandName: "OpenAI" },
      { _id: "4", _type: "servicePage", slug: { current: "integrations-whatsapp" }, title: "WhatsApp" },
      { _id: "5", _type: "industryPage", slug: { current: "monday-for-retail" }, industryName: "Retail" },
    ]
    expect(sanityRecords(docs).map((r) => [r.url, r.kind])).toEqual([
      ["/partnerships/n8n-integration-partner", "platform"],
      ["/ai-capability-assessment", "platform"],
      ["/partnerships/openai-chatgpt-partner", "platform"],
      ["/integrations/whatsapp", "service"],
      ["/monday-for-retail", "page"],
    ])
  })

  it("turns package tiers into priced offerings and keeps unpriced tiers honest", () => {
    const records = sanityRecords([
      {
        _id: "p",
        _type: "implementationPackagesPage",
        pricingFootnote: "One package per product.",
        packageTiers: [
          { name: "Training & Optimisation", hours: "10 hrs", basePrice: 2500, features: ["Team training"] },
          { name: "Bespoke", hours: "40+ hrs", features: ["Custom build"] },
        ],
      },
    ])
    expect(records.map((r) => [r.id, r.kind, r.facts.price])).toEqual([
      ["package:training-optimisation", "package", "USD 2,500"],
      ["package:bespoke", "package", "Scoped and quoted by the Fruition team"],
    ])
    expect(records[0].facts.terms).toBe("One package per product.")
  })

  it("indexes a FAQ question filed against several pages once", () => {
    const faq = (id: string): SanityDoc => ({
      _id: id,
      _type: "faqItem",
      question: "Is monday.com HIPAA compliant?",
      answer: [{ _type: "block", children: [{ text: "On Enterprise." }] }],
    })
    expect(sanityRecords([faq("a"), faq("b")])).toHaveLength(1)
  })
})

describe("staticRecords", () => {
  const records = staticRecords()

  it("includes the whole solutions catalog as recommendable offerings", () => {
    expect(records.filter((r) => r.id.startsWith("solution:")).length).toBeGreaterThanOrEqual(45)
  })

  it("has unique ids and site-relative URLs", () => {
    expect(new Set(records.map((r) => r.id)).size).toBe(records.length)
    for (const r of records) expect(r.url).toMatch(/^\/[a-z0-9/-]*$/)
  })

  it("names practice pages by their breadcrumb, not their headline", () => {
    const hubspot = records.find((r) => r.url === "/hubspot-consulting/monday-hubspot-integration")
    expect(hubspot?.title).toBe("HubSpot Consulting: monday ↔ HubSpot Integration")
  })

  it("skips practice pages that redirect elsewhere", () => {
    expect(records.some((r) => r.url === "/integrations/aircall" || r.url === "/integrations/make")).toBe(false)
  })
})

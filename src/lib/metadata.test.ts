import { describe, expect, it } from "vitest"
import { buildOgMetadata, ogCardTitle, ogCardUrl } from "./metadata"

const ogImage = (meta: ReturnType<typeof buildOgMetadata>) =>
  (meta.openGraph.images as { url: string }[])[0].url

describe("ogCardTitle", () => {
  it("keeps the headline and drops the brand tail", () => {
    expect(ogCardTitle("AI Agent Development | Fruition: Production Agents on Claude, Copilot, Vertex, Bedrock")).toBe("AI Agent Development")
    expect(ogCardTitle("monday.com Platinum Consulting Partner in the UK | Fruition Services")).toBe(
      "monday.com Platinum Consulting Partner in the UK",
    )
    expect(ogCardTitle("Ishani Dhar Chowdhury: Fruition Blog")).toBe("Ishani Dhar Chowdhury")
    expect(ogCardTitle("monday.com Platinum Partner UK \u2014 Fixed-Fee Implementation | Fruition")).toBe(
      "monday.com Platinum Partner UK",
    )
    expect(ogCardTitle("Fixed-Fee Implementation")).toBe("Fixed-Fee Implementation")
    expect(ogCardTitle("Fruition | monday.com Consulting, Automation & Transformation")).toBe(
      "monday.com Consulting, Automation & Transformation",
    )
  })
})

describe("buildOgMetadata images", () => {
  it("gives a page without an image its own card, labelled by section", () => {
    const url = new URL(ogImage(buildOgMetadata({ title: "Certified Aircall Partner | Fruition", path: "/partnerships/aircall-partner" })))
    expect(url.pathname).toBe("/og-card")
    expect(url.searchParams.get("title")).toBe("Certified Aircall Partner")
    expect(url.searchParams.get("eyebrow")).toBe("Partnerships")
    expect(url.searchParams.get("v")).toBeTruthy()
  })

  it("labels regional partner pages with the country", () => {
    expect(new URL(ogCardUrl("x", "/monday-partner-uk")).searchParams.get("eyebrow")).toBe("monday.com Partner · UK")
  })

  it("keeps the badge artwork on the homepage and explicit images elsewhere", () => {
    expect(ogImage(buildOgMetadata({ title: "Home", path: "/" }))).toMatch(/\/opengraph-image\.png$/)
    expect(ogImage(buildOgMetadata({ title: "x", path: "/x", image: "https://example.com/a.png" }))).toBe("https://example.com/a.png")
  })

  it("serves Sanity covers as JPEG so GIF/WebP covers still preview", () => {
    const url = ogImage(
      buildOgMetadata({
        title: "Post",
        path: "/post/x",
        ogImageSource: { asset: { _ref: "image-0d10b154fa5ffa16cd0e7b8a20b5ea05ae4bc873-800x600-gif" } },
      }),
    )
    expect(url).toContain("fm=jpg")
    expect(url).toContain("w=1200")
  })
})

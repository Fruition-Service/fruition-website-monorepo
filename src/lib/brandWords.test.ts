import { describe, expect, it } from "vitest"
import { splitBrandWords, withBrandH1 } from "./brandWords"

describe("splitBrandWords", () => {
  it("marks Atlassian and HubSpot and keeps the wording", () => {
    const parts = splitBrandWords("monday.com, Atlassian and HubSpot.")
    expect(parts).toEqual([
      { text: "monday.com, " },
      { text: "Atlassian", brand: "atlassian" },
      { text: " and " },
      { text: "HubSpot", brand: "hubspot" },
      { text: "." },
    ])
    expect(parts.map((p) => p.text).join("")).toBe("monday.com, Atlassian and HubSpot.")
  })

  it("leaves other text untouched", () => {
    expect(splitBrandWords("Elite monday.com partner")).toEqual([{ text: "Elite monday.com partner" }])
    expect(splitBrandWords("")).toEqual([{ text: "" }])
  })
})

describe("withBrandH1", () => {
  it("colours vendor names inside the h1 only", () => {
    const html =
      '<h1>HubSpot consultants: <em>CRM &amp; Atlassian</em></h1><p>HubSpot</p><h2>Atlassian</h2>'
    expect(withBrandH1(html)).toBe(
      '<h1><span class="brand-hubspot">HubSpot</span> consultants: <em>CRM &amp; <span class="brand-atlassian">Atlassian</span></em></h1><p>HubSpot</p><h2>Atlassian</h2>',
    )
  })

  it("never rewrites attributes", () => {
    const html = '<h1 data-x="HubSpot">Hi</h1>'
    expect(withBrandH1(html)).toBe(html)
  })
})

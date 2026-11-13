import { describe, expect, it, vi } from "vitest"

vi.mock("@/sanity/vcQueries", () => ({ getVcPage: vi.fn() }))

import { buildFeedRows } from "./route"
import type { VcPageData } from "@/components/vc/types"

const REQUIRED = ["item_id", "title", "description", "url", "brand", "seller_name", "image_url", "availability", "price"]

const page = {
  sections: [
    {
      _type: "vcPriceCards",
      anchor: "packages",
      items: [
        { title: "Training & Optimisation", price: "$2,500", unit: "one-time", meta: "1 team", best: "teams on monday.com." },
        { title: "Deployed Engineer", price: "$2,500", unit: "per month" },
        { title: "Custom", price: "", unit: "" },
      ],
    },
    {
      _type: "vcServices",
      tabs: [
        { label: "monday.com", rows: [{ name: "Dup", price: "$2,500", href: "/x" }] },
        { label: "Atlassian", body: "Platinum Partner practice.", rows: [{ name: "Jira", note: "Initial phase, from", price: "A$12,000", href: "/atlassian-consulting#jira" }] },
      ],
    },
  ],
} as unknown as VcPageData

describe("ChatGPT product feed", () => {
  const rows = buildFeedRows(page)

  it("emits one row per priced package and skips unpriced and monday.com service rows", () => {
    expect(rows.map((r) => r.item_id)).toEqual(["monday-training-optimisation", "monday-deployed-engineer", "atlassian-jira"])
  })

  it("fills every required OpenAI feed field", () => {
    for (const r of rows) for (const k of REQUIRED) expect((r as Record<string, unknown>)[k], `${r.item_id}.${k}`).toBeTruthy()
  })

  it("prices everything in USD with two decimals, converting AUD", () => {
    expect(rows[0].price).toBe("2500.00 USD")
    expect(rows[1].title).toMatch(/monthly/)
    expect(rows[2].price).toMatch(/^\d+\.00 USD$/)
    expect(rows[2].url).toBe("https://www.fruitionservices.io/atlassian-consulting#jira")
    expect(rows[2].title).toBe("Jira (initial phase)")
  })
})

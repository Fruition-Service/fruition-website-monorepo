import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import NeedsYou, { type NeedsYouItem } from "@/components/internal/NeedsYou"
import { SectionCards, type SectionMetric } from "@/components/section-cards"

/**
 * The dashboard's promise is that a metric with no working source is never
 * drawn as a zero, and that the band above the numbers only appears when
 * something genuinely wants a person. Both are easy to regress silently.
 */

const LIVE: SectionMetric = {
  label: "Visitors",
  value: "2,485",
  caption: "GA4 · 2,831 sessions, last 28 days",
}

const IDLE: SectionMetric = {
  label: "CTA clicks",
  caption: "no cta_click trigger in GTM",
  idle: true,
}

describe("SectionCards", () => {
  it("renders a real number as itself", () => {
    const html = renderToStaticMarkup(<SectionCards metrics={[LIVE]} />)
    expect(html).toContain("2,485")
    expect(html).toContain("GA4 · 2,831 sessions, last 28 days")
  })

  it("renders a dead feed as an em dash, never a zero", () => {
    const html = renderToStaticMarkup(<SectionCards metrics={[IDLE]} />)
    expect(html).toContain("—")
    expect(html).not.toContain(">0<")
    expect(html).toContain("no cta_click trigger in GTM")
  })

  it("renders a missing value as an em dash rather than the old placeholder", () => {
    const html = renderToStaticMarkup(
      <SectionCards metrics={[{ label: "Page views", caption: "Connect GA4 to populate" }]} />
    )
    expect(html).toContain("—")
    // The previous default was the literal string ", ", which shipped to staff
    // as a stray comma sitting where the number should be.
    expect(html).not.toContain(", <")
  })
})

describe("NeedsYou", () => {
  const SCHEDULE: NeedsYouItem = {
    kind: "schedule",
    title: "3 social posts still to go out",
    lines: [{ label: "Today 19:30", detail: "Agent Directory" }],
    href: "/internal/social",
    action: "Open the queue",
  }

  it("renders nothing when nothing needs a person", () => {
    expect(renderToStaticMarkup(<NeedsYou items={[]} />)).toBe("")
  })

  it("shows each item with its own link", () => {
    const html = renderToStaticMarkup(<NeedsYou items={[SCHEDULE]} />)
    expect(html).toContain("3 social posts still to go out")
    expect(html).toContain("Today 19:30")
    expect(html).toContain("Agent Directory")
    expect(html).toContain('href="/internal/social"')
  })

  it("marks a broken feed differently from a backlog", () => {
    const broken: NeedsYouItem = {
      kind: "broken",
      title: "2 feeds are reporting nothing",
      lines: [{ label: "CTA clicks", detail: "no cta_click trigger in GTM" }],
      href: "/internal/blog?view=performance",
      action: "See what is missing",
    }
    const html = renderToStaticMarkup(<NeedsYou items={[broken]} />)
    expect(html).toContain("--danger-strong")
    expect(renderToStaticMarkup(<NeedsYou items={[SCHEDULE]} />)).not.toContain("--danger-strong")
  })
})

describe("DashboardDetail", () => {
  it("renders the tab panels the dashboard depends on", async () => {
    const { default: DashboardDetail } = await import("@/components/internal/DashboardDetail")
    const html = renderToStaticMarkup(
      <DashboardDetail
        posts={[
          {
            slug: "ai-adoption-framework",
            path: "/post/ai-adoption-framework",
            views: 102,
            sessions: 101,
            users: 86,
            ctaClicks: 0,
            ctaRate: 0,
            search: { clicks: 33, impressions: 12986, ctr: 0.0025, position: 14.1 },
          },
        ]}
        titles={new Map([["ai-adoption-framework", "5 AI Adoption Frameworks"]])}
        ctaTrackingIdle
        aeo={{
          citationRate: 10.4,
          totalRuns: 48,
          totalCitations: 5,
          competitors: [{ name: "Work Perfect", mentions: 7 }],
        }}
        countries={[{ country: "Singapore", users: 578 }]}
      />
    )
    expect(html).toContain("Top posts")
    expect(html).toContain("AI answer visibility")
    expect(html).toContain("Where readers are")
    expect(html).toContain("5 AI Adoption Frameworks")
  })
})

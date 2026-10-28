import { describe, expect, it } from "vitest"
import { withLandingPageTracking } from "./landingPage"
import { REGION_BOOKING } from "./regionBooking"
import { html as legal } from "@/app/au/monday-for-legal-teams/content"
import { html as aiConsulting } from "@/app/au/ai-business-consulting-services/content"

const opts = { source: "adwords-lp-au-test", region: "APAC" as const }

describe("withLandingPageTracking", () => {
  it("loads the site's GTM container in head and body", () => {
    const out = withLandingPageTracking(legal, opts)
    expect(out).toMatch(/<head[^>]*>\n<script>\(function\(w,d,s,l,i\)/)
    expect(out).toContain("'dataLayer','GTM-PF6XWTL6'")
    expect(out).toContain("googletagmanager.com/ns.html?id=GTM-PF6XWTL6")
  })

  it("replaces the Calendly placeholder with the region's calendar", () => {
    const out = withLandingPageTracking(legal, opts)
    expect(out).not.toContain('class="calendly-box"')
    expect(out).toContain(`data-url="${REGION_BOOKING.APAC.calendlyUrl}?hide_gdpr_banner=1&hide_event_type_details=1"`)
  })

  it("wires #-posting forms to /api/leads and pushes generate_lead", () => {
    const out = withLandingPageTracking(legal, opts)
    expect(out).toContain("fetch('/api/leads'")
    expect(out).toContain("event:'generate_lead'")
    expect(out).toContain('var SOURCE="adwords-lp-au-test"')
  })

  it("leaves pages with their own /api/leads handler alone", () => {
    const out = withLandingPageTracking(aiConsulting, opts)
    expect(out).not.toContain("fetch('/api/leads'")
    expect(out.match(/generate_lead/g)).toHaveLength(1)
    expect(out).toContain("GTM-PF6XWTL6")
  })

  it("adds social preview tags built from the page's own title", () => {
    const out = withLandingPageTracking(legal, opts)
    const image = out.match(/<meta property="og:image" content="([^"]+)">/)?.[1]
    expect(image).toBeDefined()
    const url = new URL(image!.replace(/&amp;/g, "&"))
    expect(url.pathname).toBe("/og-card")
    expect(url.searchParams.get("eyebrow")).toBe("monday.com Partner · Australia")
    expect(url.searchParams.get("title")).not.toMatch(/Fruition$/)
    expect(out).toContain('<meta name="twitter:card" content="summary_large_image">')
    expect(out.indexOf('property="og:title"')).toBeLessThan(out.indexOf("</head>"))
  })

  it("links the site favicon in head", () => {
    const out = withLandingPageTracking(legal, opts)
    const head = out.slice(0, out.indexOf("</head>"))
    expect(head).toContain('<link rel="icon" href="/favicon.ico" sizes="any">')
    expect(head).toContain('<link rel="icon" href="/icon.png" type="image/png" sizes="512x512">')
    expect(head).toContain('<link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180">')
  })
})

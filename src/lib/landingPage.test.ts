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
    expect(out).toContain(`data-url="${REGION_BOOKING.APAC.calendlyUrl}?hide_gdpr_banner=1"`)
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
})

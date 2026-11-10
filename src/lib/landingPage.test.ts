import { describe, expect, it } from "vitest"
import { withLandingPageTracking } from "./landingPage"
import { REGION_BOOKING } from "./regionBooking"
import { RYZE_PIXEL_URL } from "./ryzePixel"
import { html as legal } from "@/app/au/monday-for-legal-teams/content"
import { html as aiConsulting } from "@/app/au/ai-business-consulting-services/content"
import { html as monday } from "@/app/au/monday-consulting-services/content"

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

  it("fires the guarded Clarity enquiry event only after the lead is accepted", () => {
    const out = withLandingPageTracking(legal, opts)
    const guarded =
      "try{if(window.clarity){clarity('event','enquiry_submitted');clarity('set','form_source',SOURCE);}}catch(_){}"
    expect(out.split(guarded)).toHaveLength(2)
    const okCheck = out.indexOf("if(!j.ok)throw")
    expect(okCheck).toBeGreaterThan(-1)
    expect(out.indexOf(guarded)).toBeGreaterThan(okCheck)
    expect(out.indexOf(guarded)).toBeLessThan(out.indexOf(".catch(function(){", okCheck))
    expect(out).not.toContain("clarity.ms/tag")
  })

  it("hand-written lead handlers fire the guarded Clarity event after j.ok", () => {
    for (const page of [aiConsulting, monday]) {
      const out = withLandingPageTracking(page, opts)
      const guarded = 'try { if (window.clarity) { clarity("event", "enquiry_submitted"); clarity("set", "form_source", SOURCE); } } catch (_) {}'
      expect(out.split(guarded)).toHaveLength(2)
      expect(out.indexOf(guarded)).toBeGreaterThan(out.indexOf("if (!j.ok) throw"))
    }
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

  it("loads the Ryze pixel once in head, behind the consent gate", () => {
    const out = withLandingPageTracking(legal, opts)
    const head = out.slice(0, out.indexOf("</head>"))
    expect(RYZE_PIXEL_URL).toBe("https://px.get-ryze.ai/px.js?key=rz_pk_7654460176d69d2f0bcdc138eca3264f")
    expect(out.split(RYZE_PIXEL_URL)).toHaveLength(2)
    expect(head).toContain(RYZE_PIXEL_URL)
    expect(head).toContain("window.ryzeq=window.ryzeq||[]")
    expect(head).toContain('"fruition-visitor-consent")==="declined"')
    expect(head).toContain("s.async=true")
  })

  it("sends a Calendly booking to Ryze as a lead", () => {
    const out = withLandingPageTracking(legal, opts)
    expect(out).toContain('e.origin!=="https://calendly.com"')
    expect(out).toContain('e.data.event!=="calendly.event_scheduled"')
    expect(out).toContain('window.ryzeq.push(["track","lead"])')
  })
})

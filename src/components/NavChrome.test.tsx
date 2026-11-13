import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("next/navigation", () => ({ usePathname: () => "/ai-consulting" }))

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AwardBanner from "@/components/home/AwardBanner"

const logo = { _type: "image", asset: { _type: "reference", _ref: "image-0123456789abcdef0123456789abcdef01234567-24x24-svg" } }

const settings = {
  calendlyLink: "https://calendly.com/example",
  navbarCtaLabel: "Book a Time",
  footerCtaLabel: "Book a Meeting",
  contactEmail: "hello@example.com",
  phone: "+61 483 955 931",
  navigation: [
    {
      label: "AI",
      footerNote: "Note line",
      footerLinks: [{ label: "All AI services", href: "/ai-consulting" }],
      sections: [
        {
          heading: "Build",
          columns: 2,
          grow: 2,
          items: [
            { label: "AI consulting", href: "/ai-consulting", description: "The practice", logo },
            { label: "monday.com", href: "/partnerships/monday-consulting-partner", description: "Partner", tier: "Platinum" },
          ],
        },
      ],
      feature: { kicker: "Use case hub", quote: "279 real builds.", plain: true, label: "Browse", href: "/ai-use-cases" },
    },
    { label: "Contact", href: "/contact-us" },
  ],
  offices: [{ flag: "🇦🇺", city: "Sydney, Australia", phone: "+61 483 955 931", phoneTel: "+61483955931" }],
  socialLinks: [
    { label: "LinkedIn", href: "https://linkedin.com/company/x", icon: logo, row: 1 },
    { label: "Email", href: "mailto:hello@example.com", icon: logo, row: 2 },
  ],
  footerTagline: "Tagline here",
  footerBadges: ["Chip one"],
  footerColumns: [{ heading: "Services", links: [{ label: "Training", href: "/training" }] }],
  footerLegalLinks: [{ label: "Data Privacy", href: "/data-privacy" }],
  footerCopyrightText: "(c) 2026 Fruition",
}

describe("Version C header", () => {
  const html = renderToStaticMarkup(<Navbar siteSettings={settings} />)

  it("renders every dropdown link into the HTML, for crawlers without JavaScript", () => {
    expect(html).toContain('href="/ai-consulting"')
    expect(html).toContain('href="/partnerships/monday-consulting-partner"')
    expect(html).toContain('href="/ai-use-cases"')
  })

  it("renders Sanity text as plain text nodes (the inline editor needs them)", () => {
    expect(html).toContain(">AI consulting<")
    expect(html).toContain(">Platinum<")
    expect(html).toContain(">Note line<")
    expect(html).toContain(">279 real builds.<")
  })

  it("uses the Sanity logo as the item mark", () => {
    expect(html).toContain("cdn.sanity.io/images/test-project/test/0123456789abcdef0123456789abcdef01234567-24x24.svg")
  })

  it("keeps the booking CTA a same-tab link to the booking section", () => {
    const cta = html.match(/<a href="([^"]*)"[^>]*class="btn sm"/)
    expect(cta?.[1]).toBe("/contact-us#book")
    expect(html).not.toContain("target=")
  })

  it("wires the disclosure attributes", () => {
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('aria-controls="nav-panel-ai"')
    expect(html).toContain('id="nav-panel-ai"')
    expect(html).toContain('aria-current="page"')
  })

  it("is scoped under .vcn so its CSS cannot leak", () => {
    expect(html).toContain('<header class="vcn"')
  })
})

describe("Version C footer and banner", () => {
  const html = renderToStaticMarkup(<Footer siteSettings={settings} />)

  it("renders columns, chips, the bottom socials + currency row and the copyright from Sanity", () => {
    expect(html.startsWith('<footer class="vcf"')).toBe(true)
    expect(html).toContain(">Services<")
    expect(html).toContain('href="/training"')
    expect(html).toContain(">Chip one<")
    // Socials and the currency control share one row above the copyright.
    expect(html).toMatch(/<div class="base-top"><div class="soc">/)
    expect(html).toContain('class="cur"')
    expect(html).toContain("(c) 2026 Fruition")
    expect(html).toContain('href="tel:+61483955931"')
  })

  it("opens social networks in a new tab but not mailto", () => {
    expect(html).toMatch(/href="https:\/\/linkedin\.com\/company\/x" target="_blank"/)
    expect(html).not.toMatch(/href="mailto:hello@example\.com" target=/)
  })

  it("marks the footer booking CTA as a tracked, same-tab link", () => {
    expect(html).toMatch(/<a href="\/contact-us#book" data-cta-variant="primary" class="btn inverse sm">/)
  })

  it("takes the banner text and link from props", () => {
    const banner = renderToStaticMarkup(<AwardBanner copy={{ "award-text": "Big news" }} href="/post/x" />)
    expect(banner).toContain(">Big news<")
    expect(banner).toContain('href="/post/x"')
    expect(banner.startsWith('<div class="vcn-ann"')).toBe(true)
  })
})

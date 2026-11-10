import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { NAV_VC, navVcHrefs, navVcIconKeys } from './nav-vc'
import { FOOTER_VC_COLUMNS, FOOTER_VC_SOCIALS, footerVcHrefs } from './footer-vc'
import { PARTNERS_HUB } from './hubs/partners'
import { INDUSTRIES_HUB } from './hubs/industries'

const APP = path.join(__dirname, '..', 'app')
const ICONS = path.join(__dirname, '..', '..', 'scripts', 'nav-icons')

/**
 * Pages served by a dynamic route from a Sanity doc, so they have no page file
 * of their own. Unknown /partnerships/<slug> paths return a 200 empty shell,
 * not a 404 (see CLAUDE.md), so each one here was checked by hand.
 */
const SANITY_BACKED = new Set(['/partnerships/certified-hubspot-partner'])

function hasPage(href: string): boolean {
  const route = href.split('#')[0].replace(/\/$/, '')
  if (SANITY_BACKED.has(route)) return true
  const dir = path.join(APP, route)
  return ['page.tsx', 'page.ts', 'route.ts'].some((f) => fs.existsSync(path.join(dir, f)))
}

const hubHrefs = [
  ...PARTNERS_HUB.core.flatMap((c) => [c.href, ...(c.links ?? []).map((l) => l.href)]),
  ...PARTNERS_HUB.others.map((o) => o.href),
  PARTNERS_HUB.pick.secondary.href,
  ...INDUSTRIES_HUB.sectors.map((s) => s.href),
  ...INDUSTRIES_HUB.also.map((a) => a.href),
  ...INDUSTRIES_HUB.useCases.map((u) => u.href),
]

describe('Version C menu and footer data', () => {
  it.each([...new Set(hubHrefs)])('hub link %s has a page', (href) => {
    expect(hasPage(href)).toBe(true)
  })

  it.each([...new Set([...navVcHrefs(), ...footerVcHrefs()])])('%s has a page', (href) => {
    expect(hasPage(href)).toBe(true)
  })

  it('has the five tabs and the Contact link, in the approved order', () => {
    expect(NAV_VC.map((i) => i.label)).toEqual(['AI', 'Platforms', 'Industries', 'Pricing', 'Company', 'Contact'])
    expect(NAV_VC.at(-1)?.href).toBe('/contact-us')
  })

  it('describes every dropdown item, for the hover line and the mobile sheet', () => {
    const bare = NAV_VC.flatMap((i) => i.sections ?? []).flatMap((s) => s.items).filter((l) => !l.description)
    expect(bare.map((l) => l.label)).toEqual([])
  })

  it('has an icon file for every menu link and social link', () => {
    const missing = [...navVcIconKeys(), ...FOOTER_VC_SOCIALS.map((s) => s.icon)].filter(
      (k) => !fs.existsSync(path.join(ICONS, `${k}.svg`)),
    )
    expect(missing).toEqual([])
  })

  it('keeps every icon file free of script and external references', () => {
    for (const f of fs.readdirSync(ICONS)) {
      const svg = fs.readFileSync(path.join(ICONS, f), 'utf8')
      expect(svg, f).not.toMatch(/<script|onload=|xlink:href="http|href="http/i)
    }
  })

  it('keeps the footer to the five approved columns', () => {
    expect(FOOTER_VC_COLUMNS.map((c) => c.heading)).toEqual(['Services', 'Platforms', 'Industries', 'Locations', 'Company'])
    expect(FOOTER_VC_SOCIALS.map((s) => s.row)).toEqual([1, 1, 1, 1, 1, 1, 1, 2, 2])
  })

  it('uses no em or en dashes anywhere in the copy', () => {
    const all = JSON.stringify([NAV_VC, FOOTER_VC_COLUMNS, FOOTER_VC_SOCIALS])
    expect(all).not.toMatch(/[\u2013\u2014]/)
  })

  it('leaves Lovable and Base44 out until their partner status is confirmed', () => {
    const all = [...navVcHrefs(), ...footerVcHrefs(), ...hubHrefs].join(' ')
    expect(all).not.toMatch(/lovable|base44/i)
  })
})

import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { NAV_V3, navV3Hrefs } from './nav-v3'
import { footerV3Hrefs } from './footer-v3'
import { PARTNERS_HUB } from './hubs/partners'
import { INDUSTRIES_HUB } from './hubs/industries'

const APP = path.join(__dirname, '..', 'app')

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

describe('v3 menu, footer and hub links', () => {
  it.each([...new Set([...navV3Hrefs(), ...footerV3Hrefs(), ...hubHrefs])])('%s has a page', (href) => {
    expect(hasPage(href)).toBe(true)
  })

  it('keeps the menu to six top-level tabs', () => {
    expect(NAV_V3.map((i) => i.label)).toEqual(['Partners', 'Industries', 'Customers', 'AI Use Cases', 'Blog', 'Contact'])
  })

  it('carries no per-item descriptions (removed 26 Oct 2026)', () => {
    const described = NAV_V3.flatMap((i) => i.sections ?? []).flatMap((s) => s.items).filter((l) => l.description)
    expect(described.map((l) => l.label)).toEqual([])
  })

  it('leaves Lovable and Base44 out until their partner status is confirmed', () => {
    const all = [...navV3Hrefs(), ...footerV3Hrefs(), ...hubHrefs].join(' ')
    expect(all).not.toMatch(/lovable|base44/i)
  })
})

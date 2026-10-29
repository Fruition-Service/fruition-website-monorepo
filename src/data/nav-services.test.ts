import { describe, expect, it } from 'vitest'
import { SERVICES_NAV, servicesNavHrefs, withServicesNav } from './nav-services'

describe('Services nav item', () => {
  it('is a dropdown with three headed sections and no descriptions', () => {
    expect(SERVICES_NAV.label).toBe('Services')
    expect(SERVICES_NAV.layout).toBe('columns')
    expect(SERVICES_NAV.sections).toHaveLength(3)
    const links = SERVICES_NAV.sections?.flatMap((s) => s.items) ?? []
    expect(links.map((l) => l.label)).toEqual([
      'AI capability assessment',
      'AI consulting',
      'Agent development',
      'RAG & knowledge systems',
      'Governance & compliance',
      'AI readiness blueprint',
      'monday CRM consulting',
      'Implementation consultants',
      'monday training',
      'Atlassian consulting',
      'HubSpot consulting',
      'Implementation packages',
      'Licence procurement',
      'Integrations',
    ])
    expect(links.filter((l) => 'description' in l)).toEqual([])
  })

  it('uses only internal, region-free routes', () => {
    for (const href of servicesNavHrefs()) {
      expect(href.startsWith('/')).toBe(true)
      expect(href).not.toMatch(/^\/(au|uk|us|sea)\b/)
    }
  })

  it('links each page once', () => {
    const hrefs = (SERVICES_NAV.sections ?? []).flatMap((s) => s.items.map((l) => l.href))
    expect(new Set(hrefs).size).toBe(hrefs.length)
    expect(new Set(servicesNavHrefs()).size).toBe(servicesNavHrefs().length)
  })

  it('keeps the anchor page first', () => {
    expect(SERVICES_NAV.sections?.[0].items[0].href).toBe('/ai-capability-assessment')
  })
})

describe('withServicesNav', () => {
  const cms = [{ label: 'Partners', sections: [] }, { label: 'Contact', href: '/contact-us' }]

  it('puts Services ahead of the Sanity navigation', () => {
    const nav = withServicesNav(cms)
    expect(nav.map((i) => i.label)).toEqual(['Services', 'Partners', 'Contact'])
    expect(nav[0]).toBe(SERVICES_NAV)
  })

  it('does not mutate the incoming list', () => {
    withServicesNav(cms)
    expect(cms.map((i) => i.label)).toEqual(['Partners', 'Contact'])
  })

  it('leaves a Sanity-managed Services tab alone (Studio wins)', () => {
    const withCms = [{ label: 'Services', href: '/ai-consulting' }, ...cms]
    expect(withServicesNav(withCms)).toBe(withCms)

    const loose: { label: string }[] = [{ label: ' services ' }, ...cms]
    expect(withServicesNav(loose)[0]).toEqual({ label: ' services ' })
  })

  it('works on an empty navigation document', () => {
    const empty: { label?: string }[] = []
    expect(withServicesNav(empty).map((i) => i.label)).toEqual(['Services'])
  })
})

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { HUBSPOT_FAQS, HUBSPOT_PAGES } from '@/data/practicePages/hubspot'
import { HUBSPOT_DEEP_DIVES, HUBSPOT_SERVICE_ANCHORS } from '@/data/practicePages/hubspotDeepDives'
import type { CentralFaqItem } from '@/sanity/groupFaqs'
import { HUBSPOT_FAQ_PAGE_KEYS, hubspotFaqTabs } from './faqTabs'

/** The HubSpot merge (monday 2900266080): one page, four sections, 29 FAQs. */

const RETIRED: [path: string, anchor: string][] = [
  ['/hubspot-consulting/implementation', '#implementation'],
  ['/hubspot-consulting/breeze-ai', '#breeze-ai'],
  ['/hubspot-consulting/monday-hubspot-integration', '#integration'],
  ['/hubspot-consulting/hubspot-to-monday-migration', '#migration'],
]

const hub = HUBSPOT_PAGES['hub']

function central(key: string, questions: string[]): CentralFaqItem[] {
  return questions
    .map((question, order) => ({
      _id: `${key}-${order}`,
      question,
      answer: [{ _type: 'block', _key: 'b', children: [{ _type: 'span', _key: 's', text: `A ${question}` }] }],
      order,
    }))
    .reverse()
}

describe('/hubspot-consulting merged page', () => {
  it('carries the four sections in order', () => {
    expect(HUBSPOT_DEEP_DIVES.map((d) => d.id)).toEqual(['implementation', 'breeze-ai', 'integration', 'migration'])
  })

  it.each(HUBSPOT_DEEP_DIVES.map((d) => [d.id, d] as const))(
    'gives the %s section an eyebrow, heading, lead, three steps and four cards',
    (_, d) => {
      for (const s of [d.eyebrow, d.heading, d.lead, d.stepsHeading, d.cardsEyebrow, d.cardsHeading]) {
        expect(s.trim()).not.toBe('')
      }
      expect(d.steps).toHaveLength(3)
      expect(d.cards).toHaveLength(4)
    },
  )

  it('points each of the four service cards at its section', () => {
    expect(hub.services).toHaveLength(4)
    expect(HUBSPOT_SERVICE_ANCHORS).toEqual(['#implementation', '#breeze-ai', '#integration', '#migration'])
  })

  it('drops the retired pages from Go deeper', () => {
    expect(hub.children ?? []).toEqual([])
  })

  it('ships the 29 merged questions, each once', () => {
    expect(HUBSPOT_FAQS).toHaveLength(29)
    expect(new Set(HUBSPOT_FAQS.map((f) => f.q)).size).toBe(29)
    expect(hub.faqs).toBe(HUBSPOT_FAQS)
  })

  it('merges the central FAQs of all five keys into one list, hub first, repeats once', () => {
    expect(HUBSPOT_FAQ_PAGE_KEYS[0]).toBe('hubspot-consulting')
    const tabs = hubspotFaqTabs(hub, [
      central('hub', ['Hub one', 'Shared']),
      central('implementation', ['Impl one', 'Shared']),
      null,
      [],
      central('migration', ['Mig one']),
    ])
    expect(tabs).toHaveLength(1)
    expect(tabs[0].items?.map((i) => i.question)).toEqual(['Hub one', 'Shared', 'Impl one', 'Mig one'])
    expect(tabs[0].items?.[0].answer).toBe('A Hub one')
  })

  it('falls back to the shipped list when Sanity has none, or the page prefers its own', () => {
    const empty = hubspotFaqTabs(hub, [[], [], [], [], []])
    expect(empty[0].items?.map((i) => i.question)).toEqual(HUBSPOT_FAQS.map((f) => f.q))
    const preferred = hubspotFaqTabs({ ...hub, preferPageFaqs: true }, [central('hub', ['Hub one'])])
    expect(preferred[0].items).toHaveLength(29)
  })

  it.each(RETIRED)('retires %s with a 301 to the hub section %s', (path, anchor) => {
    const config = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8')
    const sitemap = readFileSync(join(process.cwd(), 'src/app/sitemap.ts'), 'utf8')
    expect(existsSync(join(process.cwd(), 'src/app', path, 'page.tsx'))).toBe(false)
    expect(config).toContain(`{ source: "${path}", destination: "/hubspot-consulting${anchor}", statusCode: 301 }`)
    expect(sitemap).not.toContain(`"${path}"`)
  })

  it('renders every redirect anchor as a section id on the page', () => {
    const ids = new Set(HUBSPOT_DEEP_DIVES.map((d) => `#${d.id}`))
    for (const [, anchor] of RETIRED) expect(ids.has(anchor), anchor).toBe(true)
  })

  it('keeps the hub in the sitemap', () => {
    const sitemap = readFileSync(join(process.cwd(), 'src/app/sitemap.ts'), 'utf8')
    expect(sitemap).toContain('"/hubspot-consulting"')
  })

  it('links to no retired leaf from the site source or the published text files', () => {
    const files = execFileSync('git', ['ls-files', 'src', 'public'], { encoding: 'utf8' })
      .split('\n')
      .filter(
        (f) =>
          /\.(tsx?|json|md|txt)$/.test(f) &&
          !f.endsWith('.test.ts') &&
          f !== 'src/redirects.ts' &&
          // Sanity select values, still read by the hub (HUBSPOT_FAQ_PAGE_KEYS).
          f !== 'src/sanity/schemas/faqItem.ts' &&
          f !== 'src/components/hubspot/faqTabs.ts',
      )
    const leaf = /\/hubspot-consulting\/(implementation|breeze-ai|monday-hubspot-integration|hubspot-to-monday-migration)\b/
    const offenders = files.filter((f) => existsSync(f) && leaf.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})

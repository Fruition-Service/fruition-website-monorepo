import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ATLASSIAN_FAQS, ATLASSIAN_PAGES } from '@/data/practicePages/atlassian'
import { ATLASSIAN_DEEP_DIVES, ATLASSIAN_SERVICE_ANCHORS } from '@/data/practicePages/atlassianDeepDives'
import { groupFaqsIntoTabs, type CentralFaqItem } from '@/sanity/groupFaqs'
import { atlassianFaqTabs } from './faqTabs'

/** The Atlassian merge (monday 2899845035): one page, four deep dives, 15 FAQs. */

const RETIRED = [
  '/atlassian-consulting/jira',
  '/atlassian-consulting/confluence',
  '/atlassian-consulting/jira-service-management',
  '/atlassian-consulting/jira-to-monday-migration',
]

const FAQ_ORDER = [
  'What does an Atlassian consultant do?',
  'Can Fruition help with a messy Jira instance?',
  'Should we use Jira or monday.com?',
  'Our Jira is a mess, rebuild or restructure?',
  'Why does our Confluence become unusable over time?',
  'Jira Service Management vs monday Service, which should we choose?',
  'Why do teams migrate from Jira to monday.com?',
  'Can Jira history and attachments migrate to monday.com?',
  'How long does a Jira to monday migration take?',
  'What did the Givergy migration achieve?',
  'How long does a typical Atlassian engagement take?',
  'Why choose Fruition over a Big-4 consulting firm?',
  'How much does Atlassian consulting cost with Fruition?',
  'Which regions does Fruition deliver Atlassian services in?',
  'Can Fruition deliver this remotely?',
]

const hub = ATLASSIAN_PAGES['hub']

describe('/atlassian-consulting merged page', () => {
  it('carries the four deep dives in order', () => {
    expect(ATLASSIAN_DEEP_DIVES.map((d) => d.id)).toEqual(['jira', 'confluence', 'jsm', 'migration'])
  })

  it.each(ATLASSIAN_DEEP_DIVES.map((d) => [d.id, d] as const))(
    'gives the %s deep dive a heading, lead, three steps and four cards',
    (_, d) => {
      expect(d.heading.trim()).not.toBe('')
      expect(d.lead.trim()).not.toBe('')
      expect(d.steps).toHaveLength(3)
      expect(d.cards).toHaveLength(4)
    },
  )

  it('points each of the four service cards at its deep dive', () => {
    expect(hub.services).toHaveLength(4)
    expect(ATLASSIAN_SERVICE_ANCHORS).toEqual(['#jira', '#confluence', '#jsm', '#migration'])
  })

  it('links exactly two pages that exist from Go deeper', () => {
    expect(hub.children?.map((c) => c.href)).toEqual([
      '/partnerships/certified-atlassian-partner',
      '/implementation-packages',
    ])
    for (const c of hub.children ?? []) {
      expect(existsSync(join(process.cwd(), 'src/app', c.href, 'page.tsx')), c.href).toBe(true)
    }
  })

  it('ships the 15 consolidated questions in order', () => {
    expect(ATLASSIAN_FAQS.map((f) => f.q)).toEqual(FAQ_ORDER)
    expect(hub.faqs).toBe(ATLASSIAN_FAQS)
  })

  it('renders the central FAQ as one list when Sanity has it, else the shipped list', () => {
    const central: CentralFaqItem[] = FAQ_ORDER.map((question, order) => ({
      _id: `faq-${order}`,
      question,
      answer: [],
      category: 'Atlassian Consulting',
      order,
    })).reverse()
    const tabs = atlassianFaqTabs(hub, central, groupFaqsIntoTabs)
    expect(tabs).toHaveLength(1)
    expect(tabs[0].items?.map((i) => i.question)).toEqual(FAQ_ORDER)

    const fallback = atlassianFaqTabs(hub, [], groupFaqsIntoTabs)
    expect(fallback[0].items?.map((i) => i.question)).toEqual(FAQ_ORDER)
  })

  it.each(RETIRED)('retires %s with a 301 to the hub and keeps it out of the sitemap', (path) => {
    const config = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8')
    const sitemap = readFileSync(join(process.cwd(), 'src/app/sitemap.ts'), 'utf8')
    expect(existsSync(join(process.cwd(), 'src/app', path, 'page.tsx'))).toBe(false)
    expect(config).toContain(`{ source: "${path}", destination: "/atlassian-consulting", statusCode: 301 }`)
    expect(sitemap).not.toContain(`"${path}"`)
  })

  it('keeps the hub and the partner page in the sitemap', () => {
    const sitemap = readFileSync(join(process.cwd(), 'src/app/sitemap.ts'), 'utf8')
    expect(sitemap).toContain('"/atlassian-consulting"')
    expect(sitemap).toContain('"/partnerships/certified-atlassian-partner"')
  })

  it('links to no retired leaf from the site source or the published text files', () => {
    const files = execFileSync('git', ['ls-files', 'src', 'public'], { encoding: 'utf8' })
      .split('\n')
      .filter((f) => /\.(tsx?|json|md|txt)$/.test(f) && !f.endsWith('.test.ts') && f !== 'src/redirects.ts')
    const leaf = /\/atlassian-consulting\/(jira|confluence|jira-service-management|jira-to-monday-migration)\b/
    const offenders = files.filter((f) => existsSync(f) && leaf.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})

import { describe, expect, it } from 'vitest'
import { mergePracticePage } from './practicePage'
import { ATLASSIAN_PAGES } from '@/data/practicePages/atlassian'
import { INDUSTRIES_PAGES } from '@/data/practicePages/industries'
import {
  EDITABLE_PRACTICE_PAGES,
  practicePageDocId,
  toPracticePageFields,
} from '@/data/practicePages/editable'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const fallback = ATLASSIAN_PAGES['hub']

describe('mergePracticePage', () => {
  it('returns the shipped copy when the document does not exist yet', () => {
    expect(mergePracticePage(fallback, null)).toBe(fallback)
    expect(mergePracticePage(fallback, undefined)).toBe(fallback)
  })

  it('renders exactly as shipped from a document seeded with the shipped copy', () => {
    const merged = mergePracticePage(fallback, toPracticePageFields(fallback))
    expect(merged).toEqual(fallback)
  })

  it('keeps the shipped copy for fields the editor has not filled in', () => {
    const merged = mergePracticePage(fallback, { heading: 'Atlassian, sorted' })
    expect(merged.heading).toBe('Atlassian, sorted')
    expect(merged.lead).toBe(fallback.lead)
    expect(merged.seoTitle).toBe(fallback.seoTitle)
    expect(merged.approach).toEqual(fallback.approach)
    expect(merged.services).toEqual(fallback.services)
    expect(merged.children).toEqual(fallback.children)
    expect(merged.faqs).toEqual(fallback.faqs)
  })

  it('never takes the path or breadcrumb from the document', () => {
    const merged = mergePracticePage(fallback, {
      path: '/somewhere-else',
      breadcrumb: [{ label: 'Nope', href: '/' }],
    } as never)
    expect(merged.path).toBe(fallback.path)
    expect(merged.breadcrumb).toBe(fallback.breadcrumb)
  })

  it('treats a whitespace-only field as unset', () => {
    const merged = mergePracticePage(fallback, {
      seoTitle: '   ',
      heading: '\n',
      primaryCtaLabel: ' ',
    })
    expect(merged.seoTitle).toBe(fallback.seoTitle)
    expect(merged.heading).toBe(fallback.heading)
    expect(merged.primaryCtaLabel).toBe(fallback.primaryCtaLabel)
  })

  it('trims filled fields', () => {
    expect(mergePracticePage(fallback, { lead: '  A new lead.  ' }).lead).toBe('A new lead.')
  })

  it('replaces a list once the editor supplies usable rows', () => {
    const merged = mergePracticePage(fallback, {
      services: [{ title: 'Jira', body: 'Configured properly.' }],
      faqs: [{ q: 'Why us?', a: 'Because.' }],
    })
    expect(merged.services).toEqual([{ title: 'Jira', body: 'Configured properly.' }])
    expect(merged.faqs).toEqual([{ q: 'Why us?', a: 'Because.' }])
  })

  it('does not let an emptied or half-filled list blank a section', () => {
    expect(mergePracticePage(fallback, { approach: [] }).approach).toEqual(fallback.approach)
    expect(mergePracticePage(fallback, { services: [{ title: 'Half a card' }] }).services).toEqual(
      fallback.services,
    )
    expect(mergePracticePage(fallback, { faqs: [{ q: 'No answer yet' }] }).faqs).toEqual(
      fallback.faqs,
    )
    expect(mergePracticePage(fallback, { childLinks: [{ label: 'No path' }] }).children).toEqual(
      fallback.children,
    )
  })

  it('drops unusable rows from an otherwise usable list', () => {
    const merged = mergePracticePage(fallback, {
      approach: [{ title: 'Kept', body: 'Has a body.' }, { title: 'Dropped', body: '  ' }],
    })
    expect(merged.approach).toEqual([{ title: 'Kept', body: 'Has a body.' }])
  })

  it('maps hrefs as trimmed machine values and omits blank ones', () => {
    const merged = mergePracticePage(fallback, {
      services: [
        { title: 'Linked', body: 'Card.', href: '  /industries/healthcare ' },
        { title: 'Plain', body: 'Card.', href: '   ' },
      ],
      childLinks: [
        { label: 'Jira', href: ' /atlassian-consulting/jira ' },
        { label: 'Confluence', href: '/atlassian-consulting/confluence', description: ' Docs. ' },
        { label: 'Blank description', href: '/x', description: '  ' },
      ],
    })
    expect(merged.services).toEqual([
      { title: 'Linked', body: 'Card.', href: '/industries/healthcare' },
      { title: 'Plain', body: 'Card.' },
    ])
    expect(merged.services[1]).not.toHaveProperty('href')
    expect(merged.children).toEqual([
      { label: 'Jira', href: '/atlassian-consulting/jira' },
      { label: 'Confluence', href: '/atlassian-consulting/confluence', description: 'Docs.' },
      { label: 'Blank description', href: '/x' },
    ])
    expect(merged.children?.[2]).not.toHaveProperty('description')
  })

  it('keeps a page without child links childless when the document has none', () => {
    const leaf = INDUSTRIES_PAGES['healthcare']
    expect(mergePracticePage(leaf, { heading: 'Healthcare' }).children).toEqual(leaf.children)
  })
})

describe('EDITABLE_PRACTICE_PAGES', () => {
  it.each(EDITABLE_PRACTICE_PAGES.map((p) => [p.path, p] as const))(
    '%s renders exactly as shipped from its seeded document',
    (_path, page) => {
      expect(mergePracticePage(page, toPracticePageFields(page))).toEqual(page)
    },
  )

  it('lists 27 routes, each with a page file that reads its document', () => {
    expect(EDITABLE_PRACTICE_PAGES).toHaveLength(27)
    for (const page of EDITABLE_PRACTICE_PAGES) {
      const file = join(process.cwd(), 'src/app', page.path, 'page.tsx')
      expect(existsSync(file), file).toBe(true)
      expect(readFileSync(file, 'utf8'), file).toContain('getPracticePageContent(')
    }
  })

  it('gives every route a unique deterministic document id', () => {
    expect(practicePageDocId('/atlassian-consulting/jira')).toBe('practicePage-atlassian-consulting-jira')
    expect(practicePageDocId('/ai-consulting')).toBe('practicePage-ai-consulting')
    const ids = EDITABLE_PRACTICE_PAGES.map((p) => practicePageDocId(p.path))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('covers every route that reads a practicePage document', () => {
    const routes = execFileSync('git', ['grep', '-l', 'getPracticePageContent(', '--', 'src/app'], {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .map((f) => f.replace(/^src\/app/, '').replace(/\/page\.tsx$/, ''))
      .sort()
    expect(routes).toEqual(EDITABLE_PRACTICE_PAGES.map((p) => p.path).sort())
  })
})

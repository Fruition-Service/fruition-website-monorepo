import { describe, expect, it } from 'vitest'
import { mergePracticePage } from './practicePage'
import { ATLASSIAN_PAGES } from '@/data/practicePages/atlassian'
import { INDUSTRIES_PAGES } from '@/data/practicePages/industries'
import {
  EDITABLE_PRACTICE_PAGES,
  practicePageDocId,
  renderedFallbackFields,
  renderedSharedFields,
  rendersThroughIndustryTemplate,
  toPracticePageFields,
} from '@/data/practicePages/editable'
import {
  GEO_REGIONS,
  PRACTICE_LEADER,
  PRACTICE_SHARED_COPY,
  PRACTICE_TEMPLATE_FALLBACKS,
  withPracticeSharedCopy,
  withPracticeTemplateCopy,
  type PracticePage,
  type PracticeSharedField,
} from '@/data/practicePages/types'
import { practiceToIndustryPage } from '@/data/practicePages/toIndustryPage'
import { DEFAULT_CONTACT_LEAD } from '@/components/sections/FaqAccordion'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const fallback = ATLASSIAN_PAGES['hub']

/** A practice page as PracticePageTemplate renders it: shared blocks and template fallbacks resolved. */
const asRendered = (page: PracticePage) => withPracticeTemplateCopy(withPracticeSharedCopy(page))

describe('mergePracticePage', () => {
  it('returns the shipped copy when the document does not exist yet', () => {
    expect(mergePracticePage(fallback, null)).toBe(fallback)
    expect(mergePracticePage(fallback, undefined)).toBe(fallback)
  })

  it('renders exactly as shipped from a document seeded with the shipped copy', () => {
    const merged = mergePracticePage(fallback, toPracticePageFields(fallback))
    expect(asRendered(merged)).toEqual(asRendered(fallback))
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
        { label: 'Partner', href: ' /partnerships/certified-atlassian-partner ' },
        { label: 'Packages', href: '/implementation-packages', description: ' Docs. ' },
        { label: 'Blank description', href: '/x', description: '  ' },
      ],
    })
    expect(merged.services).toEqual([
      { title: 'Linked', body: 'Card.', href: '/industries/healthcare' },
      { title: 'Plain', body: 'Card.' },
    ])
    expect(merged.services[1]).not.toHaveProperty('href')
    expect(merged.children).toEqual([
      { label: 'Partner', href: '/partnerships/certified-atlassian-partner' },
      { label: 'Packages', href: '/implementation-packages', description: 'Docs.' },
      { label: 'Blank description', href: '/x' },
    ])
    expect(merged.children?.[2]).not.toHaveProperty('description')
  })

  it('keeps a page without child links childless when the document has none', () => {
    const leaf = INDUSTRIES_PAGES['healthcare']
    expect(mergePracticePage(leaf, { heading: 'Healthcare' }).children).toEqual(leaf.children)
  })
})

describe('mergePracticePage shared blocks', () => {
  it('leaves them unset, so the template renders the shared copy, until the document fills them', () => {
    const merged = withPracticeSharedCopy(mergePracticePage(fallback, { heading: 'Atlassian, sorted' }))
    expect(merged.coverageEyebrow).toBe('Geographic coverage')
    expect(merged.coverageHeading).toBe('Delivered locally across three regions.')
    expect(merged.coverageRegions).toEqual(GEO_REGIONS.map((g) => ({ ...g })))
    expect(merged.leaderEyebrow).toBe('Who leads it')
    expect(merged.leaderHeading).toBe(PRACTICE_LEADER.heading)
    expect(merged.leaderName).toBe(PRACTICE_LEADER.name)
    expect(merged.leaderTitle).toBe(PRACTICE_LEADER.title)
    expect(merged.leaderBio).toBe(PRACTICE_LEADER.bio)
    expect(merged.leaderPull).toBe(PRACTICE_LEADER.pull)
    expect(merged.leaderBadges).toEqual([...PRACTICE_LEADER.badges])
    expect(merged.bookingHeading).toBe("Let's design the way your business should run.")
    expect(merged.bookingSubheading).toBe(
      '30 minutes. No obligation. Speak to a consultant, not a salesperson.',
    )
    expect(merged.faqHeading).toBe('Frequently asked questions')
    expect(merged.faqContactLead).toBe(DEFAULT_CONTACT_LEAD)
    expect(merged.logoHeading).toBe('Clients who have used our ')
    expect(merged.logoHeadingAccent).toBe('monday.com consulting services')
  })

  it('uses filled values and ignores blank ones', () => {
    const merged = withPracticeSharedCopy(
      mergePracticePage(fallback, {
        coverageEyebrow: ' Where we work ',
        coverageHeading: '   ',
        leaderName: 'A. Person',
        leaderPull: '',
        bookingHeading: 'Talk to us.',
        bookingSubheading: '\n',
        faqHeading: 'Questions',
      }),
    )
    expect(merged.coverageEyebrow).toBe('Where we work')
    expect(merged.coverageHeading).toBe(PRACTICE_SHARED_COPY.coverageHeading)
    expect(merged.leaderName).toBe('A. Person')
    expect(merged.leaderPull).toBe(PRACTICE_LEADER.pull)
    expect(merged.bookingHeading).toBe('Talk to us.')
    expect(merged.bookingSubheading).toBe(PRACTICE_SHARED_COPY.bookingSubheading)
    expect(merged.faqHeading).toBe('Questions')
  })

  it('keeps the logo heading as stored, trailing space included', () => {
    const merged = mergePracticePage(fallback, {
      logoHeading: 'Teams that run on our ',
      logoHeadingAccent: ' monday.com work ',
    })
    expect(merged.logoHeading).toBe('Teams that run on our ')
    expect(merged.logoHeadingAccent).toBe('monday.com work')
    expect(withPracticeSharedCopy(mergePracticePage(fallback, { logoHeading: '  ' })).logoHeading).toBe(
      'Clients who have used our ',
    )
  })

  it('replaces the regions and badges only with usable rows', () => {
    const regions = [{ flag: ' 🇸🇬 ', region: 'SEA', cities: 'Singapore', body: 'Local team.' }]
    expect(mergePracticePage(fallback, { coverageRegions: regions }).coverageRegions).toEqual([
      { flag: '🇸🇬', region: 'SEA', cities: 'Singapore', body: 'Local team.' },
    ])
    expect(
      mergePracticePage(fallback, { coverageRegions: [{ region: 'SEA', cities: 'Singapore', body: 'x' }] })
        .coverageRegions,
    ).toEqual([{ flag: '', region: 'SEA', cities: 'Singapore', body: 'x' }])
    const blank = withPracticeSharedCopy(
      mergePracticePage(fallback, {
        coverageRegions: [{ region: 'Half a card' }],
        leaderBadges: ['  ', null],
      }),
    )
    expect(blank.coverageRegions).toEqual(PRACTICE_SHARED_COPY.coverageRegions)
    expect(blank.leaderBadges).toEqual(PRACTICE_SHARED_COPY.leaderBadges)
    expect(mergePracticePage(fallback, { leaderBadges: [' One ', '', 'Two'] }).leaderBadges).toEqual([
      'One',
      'Two',
    ])
    expect(withPracticeSharedCopy(mergePracticePage(fallback, { coverageRegions: [] })).coverageRegions).toEqual(
      PRACTICE_SHARED_COPY.coverageRegions,
    )
  })

  it('passes the logo heading to the /industries pages, which keep the standard line when it is unset', () => {
    const leaf = INDUSTRIES_PAGES['healthcare']
    expect(practiceToIndustryPage(leaf).logoCloudHeadingPart1).toBeUndefined()
    const merged = mergePracticePage(leaf, { logoHeading: 'Hospitals using our ', logoHeadingAccent: 'work' })
    expect(practiceToIndustryPage(merged)).toMatchObject({
      logoCloudHeadingPart1: 'Hospitals using our ',
      logoCloudHeadingAccent: 'work',
    })
  })
})

describe('practice FAQ contact line and template fallbacks', () => {
  it('keeps the FAQ contact line in step with FaqAccordion', () => {
    expect(PRACTICE_SHARED_COPY.faqContactLead).toBe(DEFAULT_CONTACT_LEAD)
  })

  it('lets a filled contact line win, trimmed, and ignores a blank one', () => {
    expect(mergePracticePage(fallback, { faqContactLead: ' Ask us anything. ' }).faqContactLead).toBe(
      'Ask us anything.',
    )
    expect(asRendered(mergePracticePage(fallback, { faqContactLead: '  ' })).faqContactLead).toBe(
      DEFAULT_CONTACT_LEAD,
    )
  })

  it('passes the FAQ heading and contact line to the /industries pages', () => {
    const leaf = INDUSTRIES_PAGES['healthcare']
    expect(practiceToIndustryPage(leaf)).toMatchObject({
      faqHeading: 'Frequently asked questions',
      faqContactLead: DEFAULT_CONTACT_LEAD,
      primaryCtaLabel: 'Book a discovery call',
      capabilitiesEyebrow: leaf.approachEyebrow ?? 'Our approach',
    })
    const merged = mergePracticePage(leaf, {
      faqHeading: 'Healthcare questions',
      faqContactLead: 'Talk to our health team.',
      primaryCtaLabel: 'Talk to us',
      approachEyebrow: 'How we work',
    })
    expect(practiceToIndustryPage(merged)).toMatchObject({
      faqHeading: 'Healthcare questions',
      faqContactLead: 'Talk to our health team.',
      primaryCtaLabel: 'Talk to us',
      capabilitiesEyebrow: 'How we work',
    })
  })

  it('renders the template fallbacks until the document fills them, then the filled words', () => {
    const bare = { ...fallback, approachEyebrow: undefined, servicesEyebrow: undefined }
    expect(asRendered(mergePracticePage(bare, { approachEyebrow: '  ' }))).toMatchObject({
      primaryCtaLabel: PRACTICE_TEMPLATE_FALLBACKS.primaryCtaLabel,
      approachEyebrow: PRACTICE_TEMPLATE_FALLBACKS.approachEyebrow,
      servicesEyebrow: PRACTICE_TEMPLATE_FALLBACKS.servicesEyebrow,
    })
    expect(
      asRendered(mergePracticePage(bare, { approachEyebrow: ' Our method ', servicesEyebrow: 'What we do' })),
    ).toMatchObject({ approachEyebrow: 'Our method', servicesEyebrow: 'What we do' })
  })

  it('seeds every template fallback a route renders with the words it renders today', () => {
    const ai = EDITABLE_PRACTICE_PAGES.find((p) => p.path === '/ai-consulting')
    expect(ai).toBeDefined()
    const fields = toPracticePageFields(ai!)
    expect(fields.approachEyebrow).toBe(ai!.approachEyebrow ?? 'Our approach')
    expect(fields.servicesEyebrow).toBe(ai!.servicesEyebrow ?? 'Services')
    expect(fields.primaryCtaLabel).toBe('Book a discovery call')
    for (const page of EDITABLE_PRACTICE_PAGES) {
      const seeded = renderedFallbackFields(page)
      expect(Object.keys(seeded).includes('childrenEyebrow'), page.path).toBe(
        !rendersThroughIndustryTemplate(page) && !!page.children?.length,
      )
      for (const value of Object.values(seeded)) expect(value.trim(), page.path).not.toBe('')
      expect(toPracticePageFields(page), page.path).toMatchObject(seeded)
    }
  })
})

describe('EDITABLE_PRACTICE_PAGES', () => {
  it.each(EDITABLE_PRACTICE_PAGES.map((p) => [p.path, p] as const))(
    '%s renders exactly as shipped from its seeded document',
    (_path, page) => {
      const merged = mergePracticePage(page, toPracticePageFields(page))
      expect(asRendered(merged)).toEqual(asRendered(page))
      expect(practiceToIndustryPage(merged)).toEqual({
        ...practiceToIndustryPage(page),
        ...(rendersThroughIndustryTemplate(page)
          ? {
              logoCloudHeadingPart1: 'Clients who have used our ',
              logoCloudHeadingAccent: 'monday.com consulting services',
            }
          : {}),
      })
    },
  )

  it('seeds the shared blocks each route renders, and only those', () => {
    for (const page of EDITABLE_PRACTICE_PAGES) {
      const fields = toPracticePageFields(page)
      const seeded = (Object.keys(PRACTICE_SHARED_COPY) as PracticeSharedField[]).filter((k) => k in fields)
      expect(seeded, page.path).toEqual(renderedSharedFields(page))
      const file = readFileSync(join(process.cwd(), 'src/app', page.path, 'page.tsx'), 'utf8')
      expect(file.includes('UniversalPageTemplate'), page.path).toBe(rendersThroughIndustryTemplate(page))
    }
  })

  // 23 to 19 when the four HubSpot leaves became sections of the hub (monday 2900266080).
  // 19 to 14 when the five /industries leaves moved to Version C vcPage documents.
  it('lists 14 routes, each with a page file that reads its document', () => {
    expect(EDITABLE_PRACTICE_PAGES).toHaveLength(14)
    for (const page of EDITABLE_PRACTICE_PAGES) {
      const file = join(process.cwd(), 'src/app', page.path, 'page.tsx')
      expect(existsSync(file), file).toBe(true)
      expect(readFileSync(file, 'utf8'), file).toContain('getPracticePageContent(')
    }
  })

  it('gives every route a unique deterministic document id', () => {
    expect(practicePageDocId('/ai-consulting/agent-development')).toBe('practicePage-ai-consulting-agent-development')
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

import { describe, expect, it } from 'vitest'
import { buildTestimonialCards, testimonialFilterTags, toIndustry, toPlatform, type TestimonialDoc } from './testimonials'

const GIVERGY = 'Fruition helped us roll out monday dev across the delivery team in weeks.'

// Shaped like the live caseStudy docs: the same quote copied per page, with tags that disagree.
const DOCS: TestimonialDoc[] = [
  { _id: 'casestudy-1', clientName: 'Mairhead McKinley', clientRole: 'Delivery Manager', clientCompany: 'Givergy', quote: GIVERGY, pages: [] },
  {
    _id: 'caseStudy-migrated-solar',
    clientName: 'Mairhead McKinley',
    clientRole: 'Delivery Manager',
    clientCompany: 'Givergy',
    quote: GIVERGY,
    industry: 'Solar & Renewables',
    pages: ['monday-consulting-solutions/solar-crm-solution'],
  },
  {
    _id: 'caseStudy-migrated-partner',
    clientName: 'Mairhead McKinley',
    clientRole: 'Delivery Manager, Givergy',
    quote: GIVERGY,
    pages: ['partnerships/monday-consulting-partner'],
  },
  {
    _id: 'caseStudy-migrated-monday-for-construction-0',
    clientName: 'Jason Doan',
    clientRole: 'VP of Heavy Rental & Sales, HOLT CAT',
    quote: 'Our field and office teams finally work from one board.',
    industry: 'monday.com Construction\nImplementation Partner',
    pages: ['monday-for-construction'],
  },
  {
    _id: 'caseStudy-migrated-tourism',
    clientName: 'Emily Hill',
    clientRole: 'International Markets Manager, Tourism Northern Territory',
    clientCompany: 'Tourism Northern Territory',
    quote: 'Approvals that took weeks now take days.',
    pages: [],
  },
  { _id: 'casestudy-7', clientName: 'Brad Cannon', clientRole: 'Senior Account Executive', clientCompany: 'monday.com', quote: 'No hesitation recommending Josh.' },
  { _id: 'no-quote', clientName: 'Nobody', quote: '' },
]

const CARDS = [
  { title: 'Givergy Case Study', product: 'monday Dev' },
  { title: 'Tourism NT Case Study', product: 'monday.com Work Management' },
  { title: 'Risk 2 Solution Case Study', product: 'monday CRM & Project Management' },
]

describe('buildTestimonialCards', () => {
  const cards = buildTestimonialCards(DOCS, CARDS)
  const byName = Object.fromEntries(cards.map((c) => [c.name, c]))

  it('collapses copies of the same quote into one card and drops quoteless docs', () => {
    expect(cards.map((c) => c.name)).toEqual(['Mairhead McKinley', 'Jason Doan', 'Emily Hill', 'Brad Cannon'])
  })

  it('ignores a tag the copies disagree on (the solar-page copy of the Givergy quote)', () => {
    expect(byName['Mairhead McKinley'].industry).toBeUndefined()
  })

  it('takes the platform from the client’s case study card', () => {
    expect(byName['Mairhead McKinley'].platform).toBe('monday Dev')
    expect(byName['Emily Hill'].platform).toBe('monday Work Management')
  })

  it('takes the industry from the industry page a copy sits on, ignoring a non-industry tag', () => {
    expect(byName['Jason Doan'].industry).toBe('Construction')
  })

  it('leaves a quote with no evidence untagged', () => {
    expect(byName['Brad Cannon'].industry).toBeUndefined()
    expect(byName['Brad Cannon'].platform).toBeUndefined()
  })

  it('writes one byline without repeating the company', () => {
    expect(byName['Mairhead McKinley'].byline).toBe('Delivery Manager, Givergy')
    expect(byName['Jason Doan'].byline).toBe('VP of Heavy Rental & Sales, HOLT CAT')
    expect(byName['Emily Hill'].byline).toBe('International Markets Manager, Tourism Northern Territory')
  })

  it('offers chips only for tags a card carries, industries first', () => {
    expect(testimonialFilterTags(cards)).toEqual(['Construction', 'monday Dev', 'monday Work Management'])
  })
})

describe('tag normalisers', () => {
  it('maps free text to canonical names or nothing', () => {
    expect(toIndustry('solar & renewables')).toBe('Solar & renewables')
    expect(toIndustry('monday.com Construction Implementation Partner')).toBeUndefined()
    expect(toPlatform('monday CRM & Project Management')).toBe('monday CRM')
    expect(toPlatform('Jira Service Management')).toBe('Atlassian')
    expect(toPlatform('Spreadsheets')).toBeUndefined()
  })
})

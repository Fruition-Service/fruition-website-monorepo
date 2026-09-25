import { describe, expect, it } from 'vitest'
import { mergeLicensingPage } from './licensingPage'
import { LICENSING_PAGES } from '@/data/practicePages/licensing'

const fallback = LICENSING_PAGES.pricing

describe('mergeLicensingPage', () => {
  it('returns the shipped copy when the document does not exist yet', () => {
    expect(mergeLicensingPage(fallback, null)).toBe(fallback)
  })

  it('keeps the shipped copy for fields the editor has not filled in', () => {
    const merged = mergeLicensingPage(fallback, { heading: 'Licences, sorted' })
    expect(merged.heading).toBe('Licences, sorted')
    expect(merged.lead).toBe(fallback.lead)
    expect(merged.services).toEqual(fallback.services)
    expect(merged.faqs).toEqual(fallback.faqs)
  })

  it('treats a whitespace-only field as unset', () => {
    const merged = mergeLicensingPage(fallback, { seoTitle: '   ', eyebrow: '\n' })
    expect(merged.seoTitle).toBe(fallback.seoTitle)
    expect(merged.eyebrow).toBe(fallback.eyebrow)
  })

  it('replaces a list once the editor supplies usable rows', () => {
    const merged = mergeLicensingPage(fallback, {
      services: [{ title: 'monday.com licences', body: 'Quoted, bought and renewed.' }],
    })
    expect(merged.services).toEqual([
      { title: 'monday.com licences', body: 'Quoted, bought and renewed.' },
    ])
  })

  it('does not let an emptied or half-filled list blank a section', () => {
    expect(mergeLicensingPage(fallback, { approach: [] }).approach).toEqual(fallback.approach)
    expect(
      mergeLicensingPage(fallback, { services: [{ title: 'Half a card' }] }).services,
    ).toEqual(fallback.services)
    expect(mergeLicensingPage(fallback, { faqs: [{ q: 'No answer yet' }] }).faqs).toEqual(
      fallback.faqs,
    )
  })

  it('keeps child links optional-description shaped', () => {
    const merged = mergeLicensingPage(fallback, {
      childLinks: [
        { label: 'monday.com implementation', href: '/monday-implementation-consultants' },
        { label: 'Training', href: '/monday-training', description: 'Workshops.' },
      ],
    })
    expect(merged.children).toEqual([
      { label: 'monday.com implementation', href: '/monday-implementation-consultants' },
      { label: 'Training', href: '/monday-training', description: 'Workshops.' },
    ])
  })

  it('leaves the route owning its own FAQs', () => {
    // The central faqItem docs tagged "pricing" still hold the retired
    // fixed-fee questions. PracticePageTemplate only ignores them because the
    // page says so.
    expect(fallback.preferPageFaqs).toBe(true)
  })
})

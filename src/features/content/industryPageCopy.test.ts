import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  CONSTRUCTION_TESTIMONIALS_COPY,
  TESTIMONIALS_DEFAULTS,
  USE_CASE_CATALOGUE_DEFAULTS,
  filledText,
  resolveCatalogueCopy,
  testimonialsCopy,
  catalogueCopy,
} from './industryPageCopy'

const industry = { name: 'Government & public sector', count: 12 }

describe('filledText', () => {
  it('trims filled strings and treats missing, blank and non-string values as unset', () => {
    expect(filledText('  Hello ')).toBe('Hello')
    expect(filledText('')).toBeUndefined()
    expect(filledText(' \n ')).toBeUndefined()
    expect(filledText(null)).toBeUndefined()
    expect(filledText(undefined)).toBeUndefined()
    expect(filledText(42)).toBeUndefined()
  })
})

describe('use case catalogue copy', () => {
  it('renders the code copy when the page has no document or leaves the fields blank', () => {
    const code = {
      eyebrow: 'Use case catalogue',
      heading: 'Government & public sector use cases',
      lead: "Every use case comes from a real Fruition client engagement, with the client's name withheld.",
      ctaLabel: 'See all 12 use cases',
      browseLabel: 'Browse every industry',
    }
    expect(resolveCatalogueCopy(catalogueCopy(null), industry)).toEqual(code)
    expect(
      resolveCatalogueCopy(
        catalogueCopy({
          useCaseCatalogueEyebrow: '  ',
          useCaseCatalogueHeading: null,
          useCaseCatalogueLead: '',
          useCaseCatalogueCtaLabel: '\n',
        }),
        industry,
      ),
    ).toEqual(code)
  })

  it('renders exactly the code copy from a document seeded with it', () => {
    const seeded = catalogueCopy({
      useCaseCatalogueEyebrow: USE_CASE_CATALOGUE_DEFAULTS.eyebrow,
      useCaseCatalogueHeading: 'Government & public sector use cases',
      useCaseCatalogueLead: USE_CASE_CATALOGUE_DEFAULTS.lead,
      useCaseCatalogueCtaLabel: USE_CASE_CATALOGUE_DEFAULTS.ctaLabel,
      useCaseCatalogueBrowseLabel: USE_CASE_CATALOGUE_DEFAULTS.browseLabel,
    })
    expect(resolveCatalogueCopy(seeded, industry)).toEqual(resolveCatalogueCopy({}, industry))
  })

  it('lets filled fields win, trimmed, and keeps the count live in the button label', () => {
    const copy = catalogueCopy({
      useCaseCatalogueEyebrow: ' From the catalogue ',
      useCaseCatalogueHeading: 'Public sector builds',
      useCaseCatalogueCtaLabel: 'Browse all {count} builds ({count})',
      useCaseCatalogueBrowseLabel: 'Every sector',
    })
    expect(resolveCatalogueCopy(copy, industry)).toEqual({
      eyebrow: 'From the catalogue',
      heading: 'Public sector builds',
      lead: USE_CASE_CATALOGUE_DEFAULTS.lead,
      ctaLabel: 'Browse all 12 builds (12)',
      browseLabel: 'Every sector',
    })
    expect(resolveCatalogueCopy(copy, { ...industry, count: 13 }).ctaLabel).toBe('Browse all 13 builds (13)')
  })

  it('keeps a fixed button label as written', () => {
    const copy = catalogueCopy({ useCaseCatalogueCtaLabel: 'See the catalogue' })
    expect(resolveCatalogueCopy(copy, industry).ctaLabel).toBe('See the catalogue')
  })

  it("prefers the document's heading over the code's own heading, which beats the standard one", () => {
    expect(resolveCatalogueCopy({}, industry, 'Solar, battery and energy use cases').heading).toBe(
      'Solar, battery and energy use cases',
    )
    expect(
      resolveCatalogueCopy({ heading: 'Energy builds' }, industry, 'Solar, battery and energy use cases')
        .heading,
    ).toBe('Energy builds')
  })
})

describe('testimonials copy', () => {
  it('leaves every field out when the document has none, so the component defaults render', () => {
    expect(testimonialsCopy(null)).toEqual({})
    expect(
      testimonialsCopy({ testimonialsEyebrow: ' ', testimonialsHeading: null, testimonialsCtaLabel: '' }),
    ).toEqual({})
  })

  it('passes filled fields through, trimmed', () => {
    expect(
      testimonialsCopy({
        testimonialsEyebrow: 'Proof',
        testimonialsHeading: ' What clients say ',
        testimonialsIntro: 'In their words.',
        testimonialsCtaLabel: 'Talk to us',
      }),
    ).toEqual({ eyebrow: 'Proof', heading: 'What clients say', intro: 'In their words.', ctaLabel: 'Talk to us' })
  })

  it('keeps the code defaults the live pages render today', () => {
    expect(TESTIMONIALS_DEFAULTS).toEqual({
      eyebrow: 'Client proof',
      heading: 'What our customers say about us 🙌',
      intro: 'Operations and IT leaders on what changed after we mapped the process first.',
      ctaLabel: 'Start Your Transformation',
    })
    expect(CONSTRUCTION_TESTIMONIALS_COPY).toEqual({
      heading: 'What our customers say about us',
      ctaLabel: 'Start Your Transformation',
    })
  })
})

describe('monday-for-* pages', () => {
  const pages = readdirSync(join(process.cwd(), 'src/app'))
    .filter((d) => d.startsWith('monday-for-'))
    .map((d) => {
      const dir = join(process.cwd(), 'src/app', d)
      const source = readdirSync(dir)
        .filter((f) => f.endsWith('.tsx'))
        .map((f) => readFileSync(join(dir, f), 'utf8'))
        .join('\n')
      return [d, source] as const
    })

  it('finds all seven pages', () => {
    expect(pages).toHaveLength(7)
  })

  it.each(pages)('%s passes its document copy to the catalogue and FAQ blocks', (_dir, source) => {
    const catalogues = source.match(/<FeaturedUseCasesSection\b[^>]*>/g) ?? []
    for (const tag of catalogues) expect(tag).toContain('copy={catalogueCopy(page)}')
    const faqs = source.match(/<FaqAccordion\b[\s\S]*?\/>/g) ?? []
    for (const tag of faqs) expect(tag).toContain('contactLead={filledText(page.faqContactLead)}')
    if (source.includes('<TestimonialsGrid')) expect(source).toContain('{...testimonialsCopy(page)}')
  })
})

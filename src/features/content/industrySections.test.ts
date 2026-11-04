import { describe, expect, it } from 'vitest'
import { mergeIndustrySections } from './industrySections'
import { INDUSTRY_SECTIONS, getIndustrySections } from '@/data/industrySections'

const government = getIndustrySections('monday-for-government')

describe('mergeIndustrySections', () => {
  it('keeps the code sections when the page has no Sanity objects', () => {
    expect(mergeIndustrySections(government, null)).toBe(government)
    expect(
      mergeIndustrySections(government, { capabilityBlocks: null, benefitLedger: null, templateSpec: null }),
    ).toStrictEqual(government)
  })

  it.each(Object.entries(INDUSTRY_SECTIONS))(
    'renders %s exactly as shipped from a document seeded with the code copy',
    (_slug, sections) => {
      expect(mergeIndustrySections(sections, sections)).toStrictEqual(sections)
    },
  )

  it('lets a filled field win and keeps the rest of the code section', () => {
    const code = government.capabilityBlocks ?? government.templateSpec
    expect(code).toBeDefined()
    const merged = mergeIndustrySections(government, {
      capabilityBlocks: { heading: '  New heading ' },
      templateSpec: { heading: 'Spec heading' },
    })
    if (government.capabilityBlocks) {
      expect(merged.capabilityBlocks?.heading).toBe('New heading')
      expect(merged.capabilityBlocks?.blocks).toEqual(government.capabilityBlocks.blocks)
      expect(merged.capabilityBlocks?.eyebrow).toBe(government.capabilityBlocks.eyebrow)
    }
    if (government.templateSpec) {
      expect(merged.templateSpec?.heading).toBe('Spec heading')
      expect(merged.templateSpec?.panels).toEqual(government.templateSpec.panels)
    }
  })

  it('treats blank strings, emptied lists and unusable rows as unset', () => {
    const code = INDUSTRY_SECTIONS['monday-for-construction']
    const merged = mergeIndustrySections(code, {
      capabilityBlocks: { eyebrow: '  ', heading: '', blocks: [] },
      benefitLedger: { items: [{ label: 'No text' }, null] },
      templateSpec: { panels: [{ lead: 'No title' }] },
    })
    expect(merged).toStrictEqual(code)
  })

  it('replaces a list as a whole and keeps optional fields absent', () => {
    const code = INDUSTRY_SECTIONS['monday-for-construction']
    const merged = mergeIndustrySections(code, {
      capabilityBlocks: {
        columns: 2,
        blocks: [
          { title: 'One', points: [{ text: 'A point' }, { label: 'Lead', text: 'B point' }, { label: 'Empty' }] },
          { title: '  ', lead: 'Dropped: no title' },
        ],
      },
    })
    expect(merged.capabilityBlocks?.columns).toBe(2)
    expect(merged.capabilityBlocks?.blocks).toStrictEqual([
      { title: 'One', points: [{ text: 'A point' }, { label: 'Lead', text: 'B point' }] },
    ])
  })

  it('ignores a column count the layout cannot render', () => {
    const code = INDUSTRY_SECTIONS['monday-for-construction']
    const merged = mergeIndustrySections(code, { capabilityBlocks: { columns: 5 } })
    expect(merged.capabilityBlocks?.columns).toBe(code.capabilityBlocks?.columns)
  })

  it('cleans spec panel bullets, chips and groups', () => {
    const merged = mergeIndustrySections({}, {
      templateSpec: {
        eyebrow: '// Spec',
        heading: 'Board template',
        panels: [
          {
            title: 'Panel',
            bullets: ['One', '  ', null],
            chips: ['  '],
            groups: [{ label: 'Group', bullets: ['x'] }, { label: 'Empty group', bullets: [] }],
          },
        ],
      },
    })
    expect(merged.templateSpec?.panels).toStrictEqual([
      { title: 'Panel', bullets: ['One'], groups: [{ label: 'Group', bullets: ['x'] }] },
    ])
  })

  it('only builds a section with no code copy once it is complete', () => {
    expect(
      mergeIndustrySections({}, { benefitLedger: { heading: 'Why', items: [{ text: 'Because' }] } }),
    ).toStrictEqual({})
    expect(
      mergeIndustrySections({}, {
        benefitLedger: { eyebrow: '// Why', heading: 'Why', items: [{ text: 'Because' }] },
      }).benefitLedger,
    ).toStrictEqual({ eyebrow: '// Why', heading: 'Why', items: [{ text: 'Because' }] })
  })
})

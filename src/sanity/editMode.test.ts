import { describe, expect, it } from 'vitest'
import { stegaFilter } from './editMode'

const run = (value: string, sourcePath: (string | number | { _key: string })[] = ['eyebrow']) =>
  stegaFilter({ value, sourcePath, filterDefault: () => true } as unknown as Parameters<typeof stegaFilter>[0])

describe('stegaFilter', () => {
  it('marks a house-style eyebrow that starts with two slashes', () => {
    expect(run('// Public sector security')).toBe(true)
    expect(run('// Public sector security', ['benefitLedger', 'eyebrow'])).toBe(true)
  })

  it('still skips paths and URLs', () => {
    expect(run('/blog/post')).toBe(false)
    expect(run('/')).toBe(false)
    expect(run('https://x.com')).toBe(false)
    expect(run('http://x.com/a b')).toBe(false)
    expect(run('#faq')).toBe(false)
    expect(run('mailto:hello@example.com')).toBe(false)
    expect(run('tel:+61 2 0000 0000')).toBe(false)
  })

  it('marks a lowercase single word in a text field', () => {
    expect(run('monday.com', ['heading'])).toBe(true)
  })

  it('skips machine keys whatever the value looks like', () => {
    expect(run('Dark', ['variant'])).toBe(false)
    expect(run('dark', ['variant'])).toBe(false)
    expect(run('au', ['region'])).toBe(false)
  })

  it('marks the coverage card region, which is a visible title', () => {
    expect(run('APAC', ['coverageRegions', { _key: 'region-0' }, 'region'])).toBe(true)
    expect(run('UK & Europe', ['coverageRegions', { _key: 'region-1' }, 'region'])).toBe(true)
  })
})

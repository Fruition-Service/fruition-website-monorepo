import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { PAGE_SPECIFIC_KEY_PREFIX, VC_PAGE_SPECIFIC_SECTIONS } from './vcPageSpecificSections'

const ROOT = path.resolve(__dirname, '..', '..')
/** Section types VcPage.tsx can render (read from its switch, so the schema's Sanity imports stay out of vitest). */
const RENDERED_TYPES = [...fs.readFileSync(path.join(ROOT, 'src/components/vc/VcPage.tsx'), 'utf8').matchAll(/case "(vc\w+)":/g)].map((m) => m[1])

describe('page-specific Version C sections registry', () => {
  it('every key starts with the page-specific prefix and is unique', () => {
    const keys = VC_PAGE_SPECIFIC_SECTIONS.map((s) => s.key)
    for (const key of keys) expect(key.startsWith(PAGE_SPECIFIC_KEY_PREFIX), key).toBe(true)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('every entry names a real section type, a dated reason and its source', () => {
    for (const s of VC_PAGE_SPECIFIC_SECTIONS) {
      expect(RENDERED_TYPES, s.key).toContain(s.type)
      expect(s.reason.length, s.key).toBeGreaterThan(20)
      expect(s.added, s.key).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(s.source.length, s.key).toBeGreaterThan(0)
    }
  })

  it('every path is a Version C route in this repo', () => {
    for (const s of VC_PAGE_SPECIFIC_SECTIONS) {
      const file = path.join(ROOT, 'src', 'app', ...s.path.split('/').filter(Boolean), 'page.tsx')
      expect(fs.existsSync(file), `${s.path} has no page.tsx`).toBe(true)
      expect(fs.readFileSync(file, 'utf8'), `${s.path} is not a Version C route`).toContain('VcPage')
    }
  })

  it('a script named as the source exists', () => {
    for (const s of VC_PAGE_SPECIFIC_SECTIONS) {
      if (s.source.startsWith('scripts/')) expect(fs.existsSync(path.join(ROOT, s.source)), s.source).toBe(true)
    }
  })
})

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Read as text: importing the schema pulls in the whole Studio runtime, which
// does not load under the test environment.
const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8')

describe('licensingPage schema', () => {
  it('lets the Studio create the singleton on first edit', () => {
    // The document has never been seeded. Without 'create' the Studio opens
    // /licence-procurement read-only and nobody can edit the page.
    const src = read('src/sanity/schemas/documents/licensingPage.ts')
    expect(src).toMatch(/__experimental_actions:\s*\[[^\]]*'create'[^\]]*\]/)
  })

  it('is treated as a singleton in the Studio config', () => {
    expect(read('src/sanity/config.ts')).toMatch(/SINGLETON_TYPES[\s\S]*'licensingPage'/)
  })
})

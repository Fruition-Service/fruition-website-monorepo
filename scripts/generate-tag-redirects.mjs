/**
 * Generates src/tagRedirects.ts — the legacy-tag-URL → blog-post redirect map.
 *
 * Background: the old Wix blog had per-tag archive pages at
 * /consulting-blog/tags/<tag>. This site has no tag concept (blogPost has
 * categories, not tags), so those URLs have nowhere of their own to land.
 * src/redirects.ts parks 690 of them on /consulting-blog, but that list was
 * enumerated from the Wix export, so it both misses tags the export didn't
 * carry and sends tags that name a real article to the blog index instead of
 * to the article.
 *
 * This map is derived from the posts themselves rather than from the export,
 * so it covers a tag URL whether or not the export knew about it. For each
 * published post it claims two tag spellings:
 *
 *   /consulting-blog/tags/<post-slug>              → /post/<post-slug>
 *   /consulting-blog/tags/<post-slug minus -YYYY>  → /post/<post-slug>
 *
 * The year-stripped form is what actually fixes the reported case:
 * /consulting-blog/tags/monday-ai-pricing-model is the tag for the post
 * monday-ai-pricing-model-2026.
 *
 * Only these two exact spellings are claimed. Looser matching was tried and
 * rejected — it guesses wrong on broad topic tags (a tag "ai" is not the post
 * "ai-in-monday-crm", and "change-management" is not
 * "change-management-for-software-new-tool-fatigue"). Anything not claimed
 * here still falls through to the /consulting-blog catch-all in next.config.ts.
 *
 * Regenerate with: node scripts/generate-tag-redirects.mjs --write
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { writeFileSync } from 'node:fs'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

// Published posts only: a draft has no live /post/<slug> to redirect to.
const posts = await client.fetch(
  `*[_type=="blogPost" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current }`
)

const slugs = [...new Set(posts.map((p) => p.slug).filter(Boolean))].sort()
const YEAR = /-20\d\d$/

// source tag slug → set of post slugs claiming it. A source claimed by more
// than one post is ambiguous and gets dropped rather than guessed at.
const claims = new Map()
const claim = (source, slug) => {
  if (!claims.has(source)) claims.set(source, new Set())
  claims.get(source).add(slug)
}

for (const slug of slugs) {
  claim(slug, slug)
  const bare = slug.replace(YEAR, '')
  if (bare !== slug && bare) claim(bare, slug)
}

const entries = []
const dropped = []
for (const [source, owners] of [...claims].sort(([a], [b]) => a.localeCompare(b))) {
  // A tag spelled exactly like a post slug belongs to that post, even when a
  // dated sibling (…-2025) also claims the undated spelling.
  let destination
  if (owners.has(source)) {
    destination = source
  } else if (owners.size === 1) {
    destination = [...owners][0]
  } else {
    dropped.push(`${source} (claimed by ${[...owners].join(', ')})`)
    continue
  }
  entries.push({ source: `/consulting-blog/tags/${source}`, destination: `/post/${destination}`, permanent: true })
}

const file = `// Auto-generated — legacy Wix blog tag URLs that name a real article.
// Regenerate with: node scripts/generate-tag-redirects.mjs --write
// Do not hand-edit individual entries — re-run the generator instead.
//
// Derived from published blogPost slugs in Sanity, not from the Wix export, so
// a tag URL resolves whether or not the export happened to carry it. Tags not
// listed here fall through to the /consulting-blog catch-all in next.config.ts.

import type { Redirect } from "next/dist/lib/load-custom-routes";

export const tagPostRedirects: Redirect[] = ${JSON.stringify(entries, null, 2)};
`

console.log(`published posts : ${slugs.length}`)
console.log(`tag redirects   : ${entries.length}`)
console.log(`dropped (ambiguous): ${dropped.length}`)
for (const d of dropped) console.log(`  - ${d}`)

const probe = entries.find((e) => e.source === '/consulting-blog/tags/monday-ai-pricing-model')
console.log(`\nreported case: ${probe ? `${probe.source} -> ${probe.destination}` : 'NOT COVERED'}`)

if (process.argv.includes('--write')) {
  writeFileSync('src/tagRedirects.ts', file)
  console.log('\nwrote src/tagRedirects.ts')
} else {
  console.log('\n(dry run — pass --write to emit src/tagRedirects.ts)')
}

/**
 * One-off: copy the blog posts that were only ever written in Framer for
 * oglabs.io into the Fruition blog (Sanity `blogPost`, id `blog-oglabs-<slug>`).
 *
 * The other oglabs.io posts live in HubSpot and arrive through the HubSpot
 * sync (docs/hubspot-blog-sync.md). The OG Labs launch announcement is left
 * out on purpose: it is about OG Labs, not a topic post.
 *
 *   npx tsx --env-file=.env.local scripts/port-oglabs-legacy-posts.ts <oglabs posts dir>          # dry run
 *   npx tsx --env-file=.env.local scripts/port-oglabs-legacy-posts.ts <oglabs posts dir> --apply  # write
 *
 * <oglabs posts dir> is oglabs-website-monorepo/nextjs/src/content/posts.
 * Re-running is safe: upsertBlogPost patches in place.
 */

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { htmlToMarkdown, toFruitionBrand } from "../src/lib/hubspotBlog/htmlToMarkdown"
import { categoriesFor, industryFor } from "../src/lib/hubspotBlog/categories"
import { upsertBlogPost, uploadImageAsset, sideloadBodyImages } from "../src/lib/sanityWriteClient"
import { fetchRemoteImage } from "../src/lib/remoteImage"

const SLUGS = [
  "how-automation-aligns-sales-operations-and-finance",
  "how-hubspot-and-clickup-help-teams-work-smarter-not-harder",
  "let-ai-agents-handle-the-busywork-your-team-hates",
  "reclaiming-time-how-process-automation-frees-smb-teams",
  "why-apac-revenue-teams-are-standardising-on-hubspot",
  "why-integrated-systems-beat-disconnected-tool-stacks",
]

/** Pull one string field out of the generated post module without executing it. */
function field(src: string, name: string): string {
  const m = new RegExp(`\\n  ${name}: ("(?:[^"\\\\]|\\\\.)*")`).exec(src)
  return m ? (JSON.parse(m[1]) as string) : ""
}

async function main() {
  const [dir, flag] = process.argv.slice(2)
  if (!dir) throw new Error("usage: port-oglabs-legacy-posts.ts <oglabs posts dir> [--apply]")
  const apply = flag === "--apply"

  for (const slug of SLUGS) {
    const src = readFileSync(join(dir, `${slug}.ts`), "utf8")
    const title = toFruitionBrand(field(src, "title"))
    const excerpt = toFruitionBrand(field(src, "description"))
    const body = toFruitionBrand(htmlToMarkdown(field(src, "html")))
    const cover = field(src, "cover")
    const post = {
      docId: `blog-oglabs-${slug}`,
      title,
      slug,
      excerpt,
      body,
      // The Framer originals say Edward Zhang; on Fruition these are Thana's (Edward, 13 Nov 2026).
      author: "Thana Witchawut",
      publishedAt: field(src, "publishedAt") || undefined,
      categoryIds: categoriesFor({ title, excerpt, body }),
      industry: industryFor({ title, excerpt }),
    }
    console.log(`\n== ${post.docId}\n   ${title} | ${post.author} | ${post.publishedAt}\n   ${post.categoryIds.join(", ")} | industry ${post.industry ?? "-"}`)
    if (/OG\s?Labs|oglabs/i.test(body + title + excerpt)) throw new Error(`${slug} still mentions OG Labs`)
    if (!apply) {
      console.log(body.split("\n").slice(0, 6).join("\n").replace(/^/gm, "   | "))
      continue
    }
    let coverImageAssetId: string | undefined
    if (cover) {
      const img = await fetchRemoteImage(cover.startsWith("http") ? cover : `https://oglabs.io${cover}`)
      coverImageAssetId = await uploadImageAsset(img.bytes, img.mime, `blog-${slug}`)
    }
    const side = await sideloadBodyImages(post.body)
    if (side.warnings.length) console.warn(side.warnings)
    const res = await upsertBlogPost({ ...post, body: side.body, coverImageAssetId })
    console.log(`   ${res.created ? "created" : "updated"} /post/${res.slug}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

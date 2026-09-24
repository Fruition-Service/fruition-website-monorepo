import { NextResponse } from "next/server"
import { getPortalApiUser, bylineFor } from "@/lib/portalAuth"
import {
  upsertBlogPost,
  uploadImageAsset,
  deleteDocument,
  getBlogPostCacheKeys,
  sideloadBodyImages,
} from "@/lib/sanityWriteClient"
import { revalidateBlogPaths } from "@/lib/revalidateSite"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

// Mirror of the `industry` enum in src/sanity/schemas/blogPost.ts.
const ALLOWED_INDUSTRIES = new Set([
  "ai",
  "construction",
  "hr",
  "real-estate",
  "marketing",
  "saas",
  "professional-services",
  "manufacturing",
  "product",
])

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90) || "post"
  )
}

/**
 * Publish/update a blog post from the internal portal.
 *
 * Auth: the portal Supabase/Google session (see src/lib/portalAuth.ts),
 * domain-locked to @fruitionservices.io. Defence-in-depth — the portal pages
 * also gate server-side.
 *
 * All Sanity writes go through the single SANITY_WRITE_TOKEN (inside
 * upsertBlogPost), so no writer needs a paid Sanity seat.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const title = String(form.get("title") ?? "").trim()
  const body = String(form.get("body") ?? "").trim()
  const slugInput = String(form.get("slug") ?? "").trim()
  const excerpt = String(form.get("excerpt") ?? "").trim()
  const industry = String(form.get("industry") ?? "").trim()
  const author = String(form.get("author") ?? "").trim()
  const seoKeyword = String(form.get("seoKeyword") ?? "").trim()
  const seoTitle = String(form.get("seoTitle") ?? "").trim()
  const seoDescription = String(form.get("seoDescription") ?? "").trim()
  const publishedAt = String(form.get("publishedAt") ?? "").trim()
  // Editing an existing post: pass its docId so the write updates in place.
  const docIdInput = String(form.get("docId") ?? "").trim()
  // categoryIds may arrive as repeated fields or a comma-separated string.
  const categoryIds = [
    ...form.getAll("categoryIds").map((v) => String(v)),
    ...String(form.get("categoryIds") ?? "").split(","),
  ]
    .map((s) => s.trim())
    .filter(Boolean)
  const cover = form.get("coverImage")

  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 })
  if (!body) return NextResponse.json({ error: "Body is required." }, { status: 400 })
  if (industry && !ALLOWED_INDUSTRIES.has(industry)) {
    return NextResponse.json({ error: "Invalid industry." }, { status: 400 })
  }
  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) {
    return NextResponse.json({ error: "Invalid publish date." }, { status: 400 })
  }

  const slug = slugInput ? slugify(slugInput) : slugify(title)

  /* Optional cover image.
   *
   * Two sources, and a file always wins. The second one matters for a
   * generated draft: the pipeline lifts a lead image from the source story and
   * uploads it to Sanity at draft time, so by the time anybody opens the
   * editor the cover already exists as an asset and there is no file to
   * re-upload. Without this, publishing a generated post from the portal
   * dropped its cover on the floor — the Slack approve path kept it, so the
   * same post published two ways came out differently. */
  let coverImageAssetId: string | undefined
  const existingAssetId = String(form.get("coverImageAssetId") ?? "").trim()
  if (/^image-[A-Za-z0-9]+-\d+x\d+-[a-z0-9]+$/.test(existingAssetId)) {
    coverImageAssetId = existingAssetId
  }
  if (cover instanceof File && cover.size > 0) {
    if (!cover.type.startsWith("image/")) {
      return NextResponse.json({ error: "Cover image must be an image." }, { status: 400 })
    }
    if (cover.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Cover image exceeds 8 MB limit." }, { status: 413 })
    }
    try {
      const bytes = Buffer.from(await cover.arrayBuffer())
      coverImageAssetId = await uploadImageAsset(bytes, cover.type, `blog-${slug}`)
    } catch (err) {
      return NextResponse.json(
        { error: `Cover image upload failed: ${err instanceof Error ? err.message : String(err)}` },
        { status: 502 },
      )
    }
  }

  // Stable, slug-derived id so re-publishing the same post updates in place.
  const docId = docIdInput || `blog-portal-${slug}`
  // Byline: an explicit form value wins, otherwise the signed-in author's profile.
  const byline = author || (await bylineFor(user))

  // Pull any image hosted elsewhere into Sanity first. Without this a remote
  // `![alt](url)` line publishes as a stray `!` plus a link instead of an
  // image — the bug on monday item 2836162069.
  let imageWarnings: string[] = []
  let publishBody = body
  try {
    const sideloaded = await sideloadBodyImages(body)
    publishBody = sideloaded.body
    imageWarnings = sideloaded.warnings
  } catch (err) {
    // Never block a publish on the image pass; the body still goes out.
    imageWarnings = [`Image side-loading failed: ${err instanceof Error ? err.message : String(err)}`]
  }

  try {
    const result = await upsertBlogPost({
      docId,
      title,
      body: publishBody,
      slug,
      excerpt: excerpt || undefined,
      industry: industry || undefined,
      author: byline,
      seoKeyword: seoKeyword || undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      coverImageAssetId,
      publishedAt: publishedAt || undefined,
    })

    // Sanity is updated — now flush the cached pages, or the live site keeps
    // serving the pre-edit render (see src/lib/revalidateSite.ts).
    const { failed } = revalidateBlogPaths({
      slug: result.slug,
      previousSlug: result.previousSlug,
      author: byline,
    })

    return NextResponse.json({
      ok: true,
      id: result.id,
      slug: result.slug,
      created: result.created,
      // The body as actually stored, so the editor and the draft copy stay in
      // step with the live document — side-loading rewrites remote image URLs
      // to Sanity ones, so this is publishBody, not what was submitted.
      body: publishBody,
      ...(imageWarnings.length ? { imageWarnings } : {}),
      ...(failed.length
        ? {
            cacheWarning: `Saved to Sanity, but the cached page(s) ${failed.join(", ")} could not be refreshed — they may take up to an hour to update.`,
          }
        : {}),
    })
  } catch (err) {
    return NextResponse.json(
      { error: `Publish failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}

/**
 * Delete (unpublish) a blog post from Sanity by document id. Removes the post
 * from the live site — the portal shows a confirm dialog before calling this.
 */
export async function DELETE(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const docId = new URL(req.url).searchParams.get("docId")
  if (!docId) return NextResponse.json({ error: "Missing docId." }, { status: 400 })

  try {
    // Read the slug before the delete — afterwards there's nothing to look up,
    // and without it /post/<slug> would keep serving the cached page.
    const live = await getBlogPostCacheKeys(docId).catch(() => null)
    await deleteDocument(docId)
    if (live?.slug) {
      revalidateBlogPaths({ slug: live.slug, author: live.author ?? undefined })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: `Delete failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}

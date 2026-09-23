import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  BLOG_PLATFORMS,
  createSocialDrafts,
  findSocialPosts,
  generateSocialCaptions,
  updateSocialDraft,
  captionFor,
  platformSpec,
  type PlatformKey,
  type SocialSource,
} from "@/lib/social/zernio"
import { buildPanelState, publishedBlogFacts, draftBodyImages } from "@/lib/social/panelState"

export const runtime = "nodejs"
export const maxDuration = 120

/**
 * Social drafts for a blog post — one Zernio draft per platform (X, Google
 * Business AU + SG + UK + US, Instagram, LinkedIn, Pinterest, Reddit). YouTube
 * is excluded here and only here: every YouTube post is a video, and an
 * article has none, so it belongs to the standalone composer.
 *
 * GET    ?slug=&draftId=&docId=      → panel state (accounts, drafts, blog facts)
 * POST   {source, blog, keys?}       → generate captions + create/regenerate drafts
 * PUT    {source, items}             → save edited captions to Zernio
 *
 * The Zernio post ↔ blog mapping lives in Zernio post `metadata`
 * (marketaSlug / marketaDraftId / marketaDocId), so there is no local table.
 */

function sourceFrom(obj: Record<string, unknown>): SocialSource | null {
  const slug = typeof obj.slug === "string" ? obj.slug.trim() : ""
  if (!slug) return null
  return {
    slug,
    draftId: typeof obj.draftId === "string" && obj.draftId ? obj.draftId : undefined,
    docId: typeof obj.docId === "string" && obj.docId ? obj.docId : undefined,
  }
}

export async function GET(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "Zernio is not configured (ZERNIO_API_KEY missing)." }, { status: 501 })
  }

  const params = new URL(req.url).searchParams
  const source = sourceFrom({
    slug: params.get("slug") ?? "",
    draftId: params.get("draftId") ?? "",
    docId: params.get("docId") ?? "",
  })
  if (!source) return NextResponse.json({ error: "Missing slug." }, { status: 400 })

  try {
    return NextResponse.json(await buildPanelState(source))
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to load social drafts: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}

/**
 * Generate captions (one LLM call for all platforms) and create the missing
 * Zernio drafts. With `keys`, regenerates those platforms in place instead.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "Zernio is not configured (ZERNIO_API_KEY missing)." }, { status: 501 })
  }

  let body: {
    slug?: string
    draftId?: string
    docId?: string
    title?: string
    excerpt?: string
    bodyMarkdown?: string
    industry?: string
    targetKeyword?: string
    keys?: PlatformKey[]
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const source = sourceFrom(body as Record<string, unknown>)
  const title = (body.title ?? "").trim()
  if (!source) return NextResponse.json({ error: "Missing slug." }, { status: 400 })
  if (!title) return NextResponse.json({ error: "Missing title." }, { status: 400 })

  const keys =
    Array.isArray(body.keys) && body.keys.length
      ? body.keys.filter((k): k is PlatformKey => BLOG_PLATFORMS.some((p) => p.key === k))
      : undefined

  try {
    const [facts, mdImages] = await Promise.all([
      publishedBlogFacts(source.slug),
      draftBodyImages(source.draftId),
    ])
    const blogUrl = facts.blogUrl
    // Default image for new drafts: cover first, then body images.
    const defaultImage = facts.images[0] ?? mdImages[0]
    const captions = await generateSocialCaptions({
      title,
      excerpt: body.excerpt,
      body: body.bodyMarkdown,
      industry: body.industry,
      targetKeyword: body.targetKeyword,
      blogUrl,
      only: keys?.map((k) => platformSpec(k).captionKey),
    })

    const existing = await findSocialPosts(source)
    const errors: string[] = []

    if (keys) {
      // Regenerate: overwrite the caption on existing drafts, create the rest.
      const toCreate: PlatformKey[] = []
      for (const key of keys) {
        const post = existing[key]
        if (!post) {
          toCreate.push(key)
          continue
        }
        const { content, title: itemTitle } = captionFor(platformSpec(key), captions)
        await updateSocialDraft({ postId: post._id, key, content, title: itemTitle, blogUrl }).catch((err) =>
          errors.push(`${key}: ${err instanceof Error ? err.message : String(err)}`),
        )
      }
      if (toCreate.length) {
        const created = await createSocialDrafts({
          target: { kind: "blog", source },
          blogTitle: title,
          captions,
          blogUrl,
          imageUrls: defaultImage ? [defaultImage] : undefined,
          keys: toCreate,
        })
        errors.push(...created.filter((r) => r.error).map((r) => `${r.key}: ${r.error}`))
      }
    } else {
      const created = await createSocialDrafts({
        target: { kind: "blog", source },
        blogTitle: title,
        captions,
        blogUrl,
        imageUrls: defaultImage ? [defaultImage] : undefined,
        existing,
      })
      errors.push(...created.filter((r) => r.error).map((r) => `${r.key}: ${r.error}`))
    }

    const state = await buildPanelState(source)
    return NextResponse.json({ ...state, ...(errors.length ? { warning: errors.join(" · ") } : {}) })
  } catch (err) {
    return NextResponse.json(
      { error: `Generate failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}

/** Save edited captions (and Pinterest/Reddit titles) back to the Zernio drafts. */
export async function PUT(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: {
    slug?: string
    items?: Array<{
      key?: PlatformKey
      postId?: string
      content?: string
      title?: string
      /** "" removes the image; undefined leaves it untouched. */
      mediaUrl?: string
      subreddit?: string
    }>
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  const items = (body.items ?? []).filter((i) => i.key && i.postId && typeof i.content === "string")
  if (!items.length) return NextResponse.json({ error: "Nothing to save." }, { status: 400 })

  const { blogUrl } = await publishedBlogFacts((body.slug ?? "").trim())
  const errors: string[] = []
  for (const item of items) {
    try {
      await updateSocialDraft({
        postId: item.postId!,
        key: item.key!,
        content: item.content!,
        title: item.title,
        blogUrl,
        imageUrls: item.mediaUrl === undefined ? undefined : item.mediaUrl ? [item.mediaUrl] : [],
        subreddit: item.subreddit,
      })
    } catch (err) {
      errors.push(`${item.key}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  if (errors.length) return NextResponse.json({ error: errors.join(" · ") }, { status: 502 })
  return NextResponse.json({ ok: true })
}

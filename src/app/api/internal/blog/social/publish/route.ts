import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  getZernioPost,
  publishSocialDraft,
  republishCancelledPost,
  type PlatformKey,
} from "@/lib/social/zernio"
import { buildPanelState, draftVideo, publishedBlogFacts } from "@/lib/social/panelState"

export const runtime = "nodejs"
export const maxDuration = 120

/**
 * Publish selected social drafts NOW via Zernio (isDraft:false + publishNow).
 *
 * Body: { slug, draftId?, docId?, items: [{ key, postId, content, title? }] }
 *
 * Requires the blog to be live in Sanity — captions get the live URL appended
 * when missing, and Instagram/Pinterest attach the blog's cover image (both
 * platforms refuse media-less posts). Per-platform failures are isolated so
 * one bad channel never blocks the rest.
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
    items?: Array<{
      key?: PlatformKey
      postId?: string
      content?: string
      title?: string
      /** Image chosen in the panel; "" = publish without media. */
      mediaUrl?: string
      /** Video chosen in the panel; "" = none, undefined = whatever the draft carries. */
      videoUrl?: string
      subreddit?: string
    }>
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const slug = (body.slug ?? "").trim()
  const items = (body.items ?? []).filter((i) => i.key && i.postId && typeof i.content === "string")
  if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 })
  if (!items.length) return NextResponse.json({ error: "No platforms selected." }, { status: 400 })

  const [{ blogUrl, coverImageUrl }, { videoPosterUrl }] = await Promise.all([
    publishedBlogFacts(slug),
    draftVideo(body.draftId || undefined),
  ])
  if (!blogUrl) {
    return NextResponse.json(
      { error: "The blog post isn't live yet — publish it first so social posts can link to it." },
      { status: 409 },
    )
  }

  const results: Array<{ key: PlatformKey; status?: string; error?: string }> = []
  for (const item of items) {
    try {
      const current = await getZernioPost(item.postId!)
      // Panel-chosen image wins, then the image already on the draft (the
      // video's poster frame on Google Business Profile), then the blog
      // cover. "" = no media.
      const imageUrl =
        item.mediaUrl !== undefined
          ? item.mediaUrl || undefined
          : current.mediaItems?.find((m) => m.type === "image")?.url ?? coverImageUrl
      /* Publishing rebuilds the post's media from these args, so the video
         the draft already carries has to be passed back or it is dropped. */
      const videoUrl =
        item.videoUrl !== undefined
          ? item.videoUrl || undefined
          : current.mediaItems?.find((m) => m.type === "video")?.url
      const args = {
        postId: item.postId!,
        key: item.key!,
        content: item.content!,
        title: item.title,
        blogUrl,
        imageUrls: imageUrl ? [imageUrl] : undefined,
        videoUrl,
        videoCoverUrl: videoUrl ? videoPosterUrl : undefined,
        subreddit: item.subreddit,
      }
      if (current.status === "published") {
        results.push({ key: item.key!, error: "Already live — unpublish it first to repost." })
        continue
      }
      // After an unpublish the record is "cancelled" and Zernio won't re-run
      // it; recreate a fresh post carrying its metadata and publish that.
      const { status } =
        current.status === "cancelled"
          ? await republishCancelledPost({ ...args, oldPost: current })
          : await publishSocialDraft(args)
      results.push({ key: item.key!, status })
    } catch (err) {
      results.push({ key: item.key!, error: err instanceof Error ? err.message : String(err) })
    }
  }

  const state = await buildPanelState({
    slug,
    draftId: body.draftId || undefined,
    docId: body.docId || undefined,
  }).catch(() => null)

  return NextResponse.json({ results, state })
}

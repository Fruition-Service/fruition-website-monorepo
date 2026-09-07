import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  buildComposerState,
  channelImages,
  constraintsOf,
  getComposition,
  knownKeys,
  liveOf,
  mediaUrlsOf,
  statusFrom,
  updateComposition,
  type Composition,
  type CompositionPlatform,
  type ComposerLive,
} from "@/lib/social/composition"
import { problemsFor } from "@/lib/social/validate"
import { shortenForChannel } from "@/lib/social/shortLinks"
import {
  createDraftPost,
  fetchPostsById,
  getZernioPost,
  platformSpec,
  publishSocialDraft,
  republishCancelledPost,
  scheduleSocialPost,
  unscheduleSocialPost,
  type PlatformKey,
  type PlatformSpec,
  type ZernioPost,
} from "@/lib/social/zernio"

export const runtime = "nodejs"
export const maxDuration = 180

/**
 * Publish or schedule a standalone composition.
 *
 * Body: { id, keys[], mode: "now" | "schedule" | "cancel", scheduledFor?, timezone? }
 *
 * This is where a composition first reaches Zernio: drafts are created lazily
 * here (and their ids written back), then published or handed to the scheduler.
 * Validation runs server-side too — the composer disables the button, but the
 * API must not be talkable into an over-limit or image-less post.
 *
 * Per-platform failures are isolated: one bad channel never blocks the rest.
 */

interface PublishResult {
  key: PlatformKey
  status?: string
  error?: string
}

/**
 * What one channel actually attaches. A channel publishes ONLY the images it
 * was given: the post's `mediaUrls` is a library of uploads, not a default, or
 * an image meant for one channel goes out on all of them. A PDF displaces them
 * entirely, because LinkedIn carries one or the other.
 *
 * Deriving it once keeps validation and publishing looking at the same post.
 * They used to compute the image separately, which is how a rule can pass on
 * a picture that never gets sent.
 *
 * `live` is the channel's Zernio draft, and only matters when no media choice
 * was ever recorded for the channel: the composer shows that channel carrying
 * whatever is on the draft, so publishing has to send the same thing.
 */
function attachments(
  spec: PlatformSpec,
  draft: CompositionPlatform,
  live?: ComposerLive,
): { imageUrls?: string[]; documentUrl?: string } {
  const documentUrl = spec.supportsDocument ? draft.documentUrl || undefined : undefined
  if (documentUrl) return { documentUrl }
  if (!spec.supportsMedia) return {}
  return { imageUrls: channelImages(draft, live) }
}

export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "Zernio is not configured (ZERNIO_API_KEY missing)." }, { status: 501 })
  }

  let body: {
    id?: string
    keys?: unknown
    mode?: string
    scheduledFor?: string
    timezone?: string
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const id = typeof body.id === "string" ? body.id : ""
  const mode = body.mode === "schedule" ? "schedule" : body.mode === "cancel" ? "cancel" : "now"
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

  const composition = await getComposition(id).catch(() => null)
  if (!composition) return NextResponse.json({ error: "Post not found." }, { status: 404 })

  const requested = knownKeys(body.keys)
  const keys = (requested.length ? requested : (Object.keys(composition.platforms) as PlatformKey[])).filter(
    (k) => composition.platforms[k],
  )
  if (!keys.length) return NextResponse.json({ error: "No channels selected." }, { status: 400 })

  if (mode === "cancel") return cancelSchedule(composition, keys)

  if (mode === "schedule") {
    const when = Date.parse(body.scheduledFor ?? "")
    if (!Number.isFinite(when)) {
      return NextResponse.json({ error: "Pick a valid date and time to schedule." }, { status: 400 })
    }
    if (when <= Date.now()) {
      return NextResponse.json({ error: "That time has already passed — pick a future time." }, { status: 400 })
    }
  }

  // Read the Zernio drafts of the channels that never recorded a media choice,
  // and nothing else: those are the only ones whose images come from Zernio
  // rather than from the row, and an extra read per channel is not free. A
  // Zernio outage here degrades to "no fallback" instead of failing the publish,
  // exactly as the composer degrades to "not connected".
  const unresolved: Partial<Record<PlatformKey, string>> = {}
  for (const key of keys) {
    const draft = composition.platforms[key] as CompositionPlatform
    if (draft.zernioPostId && mediaUrlsOf(draft) === undefined) unresolved[key] = draft.zernioPostId
  }
  const livePosts: Partial<Record<PlatformKey, ZernioPost>> = Object.keys(unresolved).length
    ? await fetchPostsById(unresolved).catch(() => ({}))
    : {}
  const live: Partial<Record<PlatformKey, ComposerLive>> = {}
  for (const key of keys) {
    const found = liveOf(livePosts[key])
    if (found) live[key] = found
  }

  // Validate everything BEFORE creating any Zernio draft, so a rejected publish
  // leaves nothing half-created behind.
  const problems = keys.flatMap((key) => {
    const draft = composition.platforms[key] as CompositionPlatform
    const spec = platformSpec(key)
    const { imageUrls, documentUrl } = attachments(spec, draft, live[key])
    return problemsFor(constraintsOf(spec), {
      content: draft.content,
      title: draft.title,
      mediaUrls: imageUrls,
      documentUrl,
      shortenLinks: composition.shortenLinks,
    })
  })
  if (problems.length) return NextResponse.json({ error: problems.join(" · ") }, { status: 400 })

  const results: PublishResult[] = []
  const platforms = { ...composition.platforms }

  for (const key of keys) {
    const draft = platforms[key] as CompositionPlatform
    const { imageUrls, documentUrl } = attachments(platformSpec(key), draft, live[key])
    const documentName = draft.documentName
    try {
      const { content, link } = await shortenForChannel({
        composition,
        key,
        content: draft.content,
        createdBy: user.email ?? undefined,
      })

      // Lazily create the Zernio draft the first time this channel is used.
      let postId = draft.zernioPostId
      if (!postId) {
        postId = await createDraftPost({
          target: { kind: "composition", compositionId: composition.id },
          key,
          name: composition.title,
          content,
          title: draft.title,
          imageUrls,
          documentUrl,
          documentName,
          link,
          subreddit: draft.subreddit,
          boardId: draft.boardId,
        })
        platforms[key] = { ...draft, zernioPostId: postId }
      }

      const args = {
        postId,
        key,
        content,
        title: draft.title,
        imageUrls,
        documentUrl,
        documentName,
        subreddit: draft.subreddit,
        boardId: draft.boardId,
      }

      if (mode === "schedule") {
        const { status } = await scheduleSocialPost({
          ...args,
          link,
          scheduledFor: body.scheduledFor!,
          timezone: body.timezone,
        })
        results.push({ key, status })
        continue
      }

      const current = await getZernioPost(postId)
      if (current.status === "published") {
        results.push({ key, error: "Already live — unpublish it first to repost." })
        continue
      }
      // Zernio won't re-run a cancelled record; recreate it carrying the metadata.
      const { status, postId: newId } =
        current.status === "cancelled"
          ? await republishCancelledPost({ ...args, blogUrl: link ?? "", oldPost: current })
          : { ...(await publishSocialDraft({ ...args, blogUrl: link ?? "" })), postId }
      if (newId !== postId) platforms[key] = { ...platforms[key]!, zernioPostId: newId }
      results.push({ key, status })
    } catch (err) {
      results.push({ key, error: err instanceof Error ? err.message : String(err) })
    }
  }

  const saved = await updateComposition(composition.id, {
    platforms,
    scheduledFor: mode === "schedule" ? body.scheduledFor : null,
    timezone: mode === "schedule" ? (body.timezone ?? null) : null,
  })
  const state = await buildComposerState(saved)
  const status = statusFrom(state)
  if (status !== saved.status) {
    state.composition = await updateComposition(saved.id, { status }).catch(() => state.composition)
  }

  return NextResponse.json({ results, ...state })
}

/** Pull scheduled posts back to drafts so they won't fire. */
async function cancelSchedule(composition: Composition, keys: PlatformKey[]) {
  const results: PublishResult[] = []
  for (const key of keys) {
    const postId = composition.platforms[key]?.zernioPostId
    if (!postId) continue
    try {
      await unscheduleSocialPost(postId)
      results.push({ key, status: "draft" })
    } catch (err) {
      results.push({ key, error: err instanceof Error ? err.message : String(err) })
    }
  }
  const saved = await updateComposition(composition.id, {
    scheduledFor: null,
    timezone: null,
    status: "draft",
  })
  return NextResponse.json({ results, ...(await buildComposerState(saved)) })
}

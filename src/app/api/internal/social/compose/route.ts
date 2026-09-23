import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  buildComposerState,
  createComposition,
  deleteComposition,
  getComposition,
  listCompositions,
  loadComposer,
  mediaUrlsOf,
  platformsFromInput,
  updateComposition,
  type CompositionPlatform,
} from "@/lib/social/composition"
import {
  deleteZernioPost,
  platformSpec,
  unpublishZernioPost,
  updateSocialDraft,
  type PlatformKey,
} from "@/lib/social/zernio"

export const runtime = "nodejs"
export const maxDuration = 120

/**
 * Standalone social posts — the composer behind /internal/social/new.
 *
 * GET    ?id=            → composer state (row merged with live Zernio truth)
 * GET                    → every composition, newest first
 * POST   {fields}        → create a composition (Supabase only)
 * PUT    {id, fields}    → save; existing Zernio drafts are re-synced
 * DELETE ?id=            → delete the composition and its Zernio drafts
 *
 * Zernio drafts are created LAZILY — only when a composition is published or
 * scheduled (see ./publish). A post abandoned in the composer therefore never
 * litters the Zernio dashboard.
 */

function strings(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  return value.filter((v): v is string => typeof v === "string" && v.length > 0)
}

export async function GET(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  try {
    if (!id) return NextResponse.json({ compositions: await listCompositions() })
    const state = await loadComposer(id)
    if (!state) return NextResponse.json({ error: "Post not found." }, { status: 404 })
    return NextResponse.json(state)
  } catch (err) {
    return NextResponse.json({ error: message(err, "Failed to load") }, { status: 502 })
  }
}

export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  // Duplicate: same words, none of the history. Zernio ids are deliberately
  // dropped so the copy publishes as new posts rather than touching the
  // original's live ones.
  const duplicateOf = typeof body.duplicateOf === "string" ? body.duplicateOf : ""
  if (duplicateOf) {
    try {
      const source = await getComposition(duplicateOf)
      if (!source) return NextResponse.json({ error: "Post not found." }, { status: 404 })
      const platforms: Partial<Record<PlatformKey, CompositionPlatform>> = {}
      for (const [key, value] of Object.entries(source.platforms)) {
        if (!value) continue
        platforms[key as PlatformKey] = { ...value, zernioPostId: undefined }
      }
      const copy = await createComposition({
        title: `Copy of ${source.title}`,
        brief: source.brief,
        link: source.link,
        masterContent: source.masterContent,
        mediaUrls: source.mediaUrls,
        shortenLinks: source.shortenLinks,
        platforms,
        createdBy: user.email ?? undefined,
      })
      return NextResponse.json(await buildComposerState(copy), { status: 201 })
    } catch (err) {
      return NextResponse.json({ error: message(err, "Could not duplicate the post") }, { status: 502 })
    }
  }

  try {
    const composition = await createComposition({
      title: typeof body.title === "string" ? body.title : "",
      brief: typeof body.brief === "string" ? body.brief : undefined,
      link: typeof body.link === "string" ? body.link : undefined,
      masterContent: typeof body.masterContent === "string" ? body.masterContent : undefined,
      mediaUrls: strings(body.mediaUrls) ?? [],
      shortenLinks: typeof body.shortenLinks === "boolean" ? body.shortenLinks : undefined,
      platforms: platformsFromInput(body.platforms),
      createdBy: user.email ?? undefined,
    })
    return NextResponse.json(await buildComposerState(composition), { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: message(err, "Could not create the post") }, { status: 502 })
  }
}

/**
 * Save the composition. Platforms that already have a Zernio draft are updated
 * there too, so what the Zernio dashboard shows never drifts from the portal —
 * per-platform sync failures are reported but don't lose the local save.
 */
export async function PUT(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  const id = typeof body.id === "string" ? body.id : ""
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

  try {
    const existing = await getComposition(id)
    if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 })

    const platforms = platformsFromInput(body.platforms)
    // Carry over the Zernio ids we already hold — the client never invents them.
    if (platforms) {
      for (const [key, value] of Object.entries(platforms)) {
        const prior = existing.platforms[key as PlatformKey]
        if (prior?.zernioPostId && value) value.zernioPostId = prior.zernioPostId
      }
    }

    const composition = await updateComposition(id, {
      title: typeof body.title === "string" ? body.title : undefined,
      brief: typeof body.brief === "string" ? body.brief : undefined,
      link: typeof body.link === "string" ? body.link : undefined,
      masterContent: typeof body.masterContent === "string" ? body.masterContent : undefined,
      mediaUrls: strings(body.mediaUrls),
      shortenLinks: typeof body.shortenLinks === "boolean" ? body.shortenLinks : undefined,
      platforms,
      scheduledFor: body.scheduledFor === null ? null : undefined,
    })

    // Re-sync live drafts. Published posts are immutable here — editing a live
    // post means unpublish → edit → republish, same as the blog panel.
    const state = await buildComposerState(composition)
    const warnings: string[] = []
    await Promise.all(
      state.platforms
        .filter((p) => p.selected && p.live && p.live.status !== "published")
        .map(async (p) => {
          try {
            await updateSocialDraft({
              postId: p.live!.postId,
              key: p.key,
              content: p.draft.content,
              title: p.draft.title,
              blogUrl: composition.link,
              // undefined leaves the draft's media alone, which is what a
              // channel that has picked nothing has always meant. Sending []
              // instead would strip the pictures off the live post.
              imageUrls: mediaUrlsOf(p.draft),
              documentUrl: p.supportsDocument ? p.draft.documentUrl : undefined,
              documentName: p.draft.documentName,
              videoUrl: p.supportsVideo ? p.draft.videoUrl : undefined,
              subreddit: p.draft.subreddit,
              boardId: p.draft.boardId,
            })
          } catch (err) {
            warnings.push(`${p.label}: ${message(err, "sync failed")}`)
          }
        }),
    )

    return NextResponse.json({ ...state, ...(warnings.length ? { warning: warnings.join(" · ") } : {}) })
  } catch (err) {
    return NextResponse.json({ error: message(err, "Save failed") }, { status: 502 })
  }
}

/**
 * Delete a composition and the Zernio drafts behind it. Refuses while anything
 * is live, so a published post can never be orphaned by deleting its record —
 * the same rule the social dashboard enforces.
 */
export async function DELETE(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

  try {
    const composition = await getComposition(id)
    if (!composition) return NextResponse.json({ error: "Post not found." }, { status: 404 })

    // Delete means delete: take it off the platforms first rather than making
    // someone unpublish each channel by hand and come back.
    const state = await buildComposerState(composition)
    const live = state.platforms.filter((p) => p.live?.status === "published")
    const warnings: string[] = []
    const failures: string[] = []

    for (const platform of live) {
      const postId = platform.live?.postId
      if (!postId) continue
      if (platform.key === "instagram") {
        // Instagram's API genuinely can't delete a post. Say so plainly instead
        // of pretending the whole thing is gone.
        warnings.push("The Instagram post is still live — Instagram won't let us delete it. Remove it in the app.")
        continue
      }
      try {
        await unpublishZernioPost(postId, platformSpec(platform.key).platform)
      } catch (err) {
        failures.push(`${platform.label}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // A live post we couldn't take down must keep its record, or it's orphaned
    // out there with nothing in the portal pointing at it.
    if (failures.length) {
      return NextResponse.json(
        { error: `Couldn't take it down — ${failures.join(" · ")}. Nothing was deleted.` },
        { status: 502 },
      )
    }

    for (const postId of composition.postIds) {
      await deleteZernioPost(postId).catch(() => {}) // already gone in Zernio is fine
    }
    await deleteComposition(id)
    return NextResponse.json({
      ok: true,
      ...(live.length ? { removedFrom: live.map((p) => p.label) } : {}),
      ...(warnings.length ? { warning: warnings.join(" ") } : {}),
    })
  } catch (err) {
    return NextResponse.json({ error: message(err, "Delete failed") }, { status: 502 })
  }
}

function message(err: unknown, prefix: string): string {
  return `${prefix}: ${err instanceof Error ? err.message : String(err)}`
}

/**
 * Standalone social posts ("compositions") — the non-blog half of the portal's
 * social publishing.
 *
 * A composition is one idea written in /internal/social/new and fanned out to
 * one Zernio draft per selected platform, exactly like the blog flow. The
 * difference is where it comes from: there's no article behind it, so the row
 * in `social_compositions` holds the copy, the media and the schedule intent.
 *
 * Division of truth, deliberately:
 *   - Supabase owns identity + intent (what we meant to post, who wrote it).
 *   - Zernio owns reality (status, live URLs, engagement).
 * `buildComposerState` merges the two on every read, so a post deleted or
 * published in the Zernio dashboard is reflected here without a sync job. The
 * cached `status` column exists only so the list view can sort and filter.
 */

import {
  PLATFORMS,
  fetchPostsById,
  listZernioAccounts,
  type PlatformKey,
  type PlatformSpec,
  type ZernioPost,
} from "@/lib/social/zernio"
import { problemsFor, type PlatformConstraints } from "@/lib/social/validate"
import { shortLinksForComposition, type ShortLink } from "@/lib/social/shortLinks"
import { rollupStatus } from "@/lib/social/status"
import { getPortalAdmin } from "@/lib/portalAuth"

const DASHBOARD_URL = process.env.ZERNIO_DASHBOARD_URL || "https://zernio.com/dashboard"

/* ------------------------------------------------------------------ */
/*  Row shape                                                          */
/* ------------------------------------------------------------------ */

/** One platform's copy within a composition. */
export interface CompositionPlatform {
  /** The Zernio draft backing it, once one has been created. */
  zernioPostId?: string
  content: string
  /** Pinterest pin title / Reddit post title. */
  title?: string
  /** Reddit target subreddit, without the r/. */
  subreddit?: string
  /** Pinterest board id (defaults to the account's board). */
  boardId?: string
  /**
   * Chosen images, in carousel order; [] means deliberately none.
   * `mediaUrl` is the pre-carousel shape, still read off rows written before
   * a channel could carry more than one.
   */
  mediaUrls?: string[]
  /** @deprecated Legacy single image. Read on load, never written. */
  mediaUrl?: string
  /** Attached PDF (LinkedIn carousel); "" means deliberately none. */
  documentUrl?: string
  /** Filename / carousel title for the attached PDF. */
  documentName?: string
  /** Set once the copy is edited away from the master caption. */
  customised?: boolean
}

export interface Composition {
  id: string
  title: string
  brief?: string
  link?: string
  masterContent?: string
  mediaUrls: string[]
  /** Swap links for fruitionservices.io/s/<code> when this post goes out. */
  shortenLinks: boolean
  platforms: Partial<Record<PlatformKey, CompositionPlatform>>
  postIds: string[]
  scheduledFor?: string
  timezone?: string
  status: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

/** Fields a caller may write. Everything else is derived server-side. */
export interface CompositionInput {
  title?: string
  brief?: string
  link?: string
  masterContent?: string
  mediaUrls?: string[]
  shortenLinks?: boolean
  platforms?: Partial<Record<PlatformKey, CompositionPlatform>>
  scheduledFor?: string | null
  timezone?: string | null
  status?: string
}

const TABLE = "social_compositions"

interface CompositionRow {
  id: string
  title: string
  brief: string | null
  link: string | null
  master_content: string | null
  media_urls: string[] | null
  shorten_links: boolean | null
  platforms: Record<string, CompositionPlatform> | null
  post_ids: string[] | null
  scheduled_for: string | null
  timezone: string | null
  status: string
  created_by: string | null
  created_at: string
  updated_at: string
}

function fromRow(row: CompositionRow): Composition {
  return {
    id: row.id,
    title: row.title,
    brief: row.brief ?? undefined,
    link: row.link ?? undefined,
    masterContent: row.master_content ?? undefined,
    mediaUrls: Array.isArray(row.media_urls) ? row.media_urls : [],
    shortenLinks: row.shorten_links !== false,
    // Normalised on the way out so nothing downstream has to know that rows
    // written before carousels stored a single `mediaUrl`.
    platforms: normalisePlatforms(row.platforms),
    postIds: Array.isArray(row.post_ids) ? row.post_ids : [],
    scheduledFor: row.scheduled_for ?? undefined,
    timezone: row.timezone ?? undefined,
    status: row.status,
    createdBy: row.created_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Read a stored platform map, folding the legacy single image into a list. */
function normalisePlatforms(
  stored: Record<string, CompositionPlatform> | null,
): Partial<Record<PlatformKey, CompositionPlatform>> {
  const out: Partial<Record<PlatformKey, CompositionPlatform>> = {}
  for (const [key, value] of Object.entries(stored ?? {})) {
    if (!value) continue
    const urls = mediaUrlsOf(value)
    const next: CompositionPlatform = { ...value, ...(urls !== undefined ? { mediaUrls: urls } : {}) }
    delete next.mediaUrl
    out[key as PlatformKey] = next
  }
  return out
}

/**
 * A channel's images, in carousel order. Undefined means "no choice recorded",
 * which is not the same as [] ("deliberately none") and must survive the round
 * trip. Rows written before carousels stored one `mediaUrl`, so fold that in.
 */
export function mediaUrlsOf(value: CompositionPlatform): string[] | undefined {
  if (Array.isArray(value.mediaUrls)) return value.mediaUrls.filter((u) => typeof u === "string" && u)
  if (value.mediaUrl !== undefined) return value.mediaUrl ? [value.mediaUrl] : []
  return undefined
}

/** Only keys we know about, so a stale client can't write junk platforms. */
function cleanPlatforms(
  platforms: Partial<Record<PlatformKey, CompositionPlatform>> | undefined,
): Record<string, CompositionPlatform> {
  const out: Record<string, CompositionPlatform> = {}
  for (const [key, value] of Object.entries(platforms ?? {})) {
    if (!PLATFORMS.some((p) => p.key === key) || !value) continue
    out[key] = {
      ...(value.zernioPostId ? { zernioPostId: value.zernioPostId } : {}),
      content: typeof value.content === "string" ? value.content : "",
      ...(value.title ? { title: value.title } : {}),
      ...(value.subreddit ? { subreddit: value.subreddit } : {}),
      ...(value.boardId ? { boardId: value.boardId } : {}),
      ...(mediaUrlsOf(value) !== undefined ? { mediaUrls: mediaUrlsOf(value) } : {}),
      ...(value.documentUrl !== undefined ? { documentUrl: value.documentUrl } : {}),
      ...(value.documentName ? { documentName: value.documentName } : {}),
      ...(value.customised ? { customised: true } : {}),
    }
  }
  return out
}

/**
 * A channel's images, in carousel order, as they would actually go out. [] when
 * it has none.
 *
 * "No choice recorded" (no media key at all) falls back to whatever the Zernio
 * draft already carries, exactly as the composer shows it. Publishing read this
 * as [] while the composer read it as the draft's pictures, so the portal could
 * show a channel with an image and then publish it without one.
 * An explicit [] (or the pre-carousel `mediaUrl: ""`) is a deliberate none and
 * never inherits.
 */
export function channelImages(draft: CompositionPlatform | undefined, live?: ComposerLive): string[] {
  const chosen = draft && mediaUrlsOf(draft)
  return chosen ?? live?.mediaUrls ?? []
}

/**
 * Read the per-channel drafts off a request body.
 *
 * Every field the composer can write has to be listed here or it is dropped on
 * save: this ran without `mediaUrls`, so a carousel arranged in the composer
 * was thrown away the moment the post was saved and Instagram was left with
 * whatever single picture the old `mediaUrl` still held.
 *
 * Unknown platform keys are ignored so a stale client can't write junk.
 */
export function platformsFromInput(
  value: unknown,
): Partial<Record<PlatformKey, CompositionPlatform>> | undefined {
  if (!value || typeof value !== "object") return undefined
  const out: Partial<Record<PlatformKey, CompositionPlatform>> = {}
  for (const key of knownKeys(Object.keys(value as Record<string, unknown>))) {
    const raw = (value as Record<string, Partial<CompositionPlatform>>)[key]
    if (!raw) continue
    out[key] = {
      zernioPostId: typeof raw.zernioPostId === "string" ? raw.zernioPostId : undefined,
      content: typeof raw.content === "string" ? raw.content : "",
      title: typeof raw.title === "string" ? raw.title : undefined,
      subreddit: typeof raw.subreddit === "string" ? raw.subreddit : undefined,
      boardId: typeof raw.boardId === "string" ? raw.boardId : undefined,
      // Both shapes are accepted: the composer sends a list, and a client that
      // predates carousels still sends the single url.
      mediaUrls: Array.isArray(raw.mediaUrls)
        ? raw.mediaUrls.filter((u): u is string => typeof u === "string" && Boolean(u))
        : undefined,
      mediaUrl: typeof raw.mediaUrl === "string" ? raw.mediaUrl : undefined,
      documentUrl: typeof raw.documentUrl === "string" ? raw.documentUrl : undefined,
      documentName: typeof raw.documentName === "string" ? raw.documentName : undefined,
      customised: Boolean(raw.customised),
    }
  }
  return out
}

function postIdsOf(platforms: Record<string, CompositionPlatform>): string[] {
  return Object.values(platforms)
    .map((p) => p.zernioPostId)
    .filter((id): id is string => Boolean(id))
}

/* ------------------------------------------------------------------ */
/*  CRUD                                                               */
/* ------------------------------------------------------------------ */

/** Newest first. `limit` keeps the dashboard's first paint cheap. */
export async function listCompositions(limit = 100): Promise<Composition[]> {
  const { data, error } = await getPortalAdmin()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data as CompositionRow[]).map(fromRow)
}

export async function getComposition(id: string): Promise<Composition | null> {
  const { data, error } = await getPortalAdmin().from(TABLE).select("*").eq("id", id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? fromRow(data as CompositionRow) : null
}

/** Find the composition a Zernio post belongs to (dashboard row → composer). */
export async function compositionForPost(postId: string): Promise<Composition | null> {
  const { data, error } = await getPortalAdmin()
    .from(TABLE)
    .select("*")
    .contains("post_ids", [postId])
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? fromRow(data as CompositionRow) : null
}

export async function createComposition(input: CompositionInput & { createdBy?: string }): Promise<Composition> {
  const platforms = cleanPlatforms(input.platforms)
  const { data, error } = await getPortalAdmin()
    .from(TABLE)
    .insert({
      title: input.title?.trim() || "Untitled post",
      brief: input.brief ?? null,
      link: input.link ?? null,
      master_content: input.masterContent ?? null,
      media_urls: input.mediaUrls ?? [],
      shorten_links: input.shortenLinks ?? true,
      platforms,
      post_ids: postIdsOf(platforms),
      scheduled_for: input.scheduledFor ?? null,
      timezone: input.timezone ?? null,
      status: input.status ?? "draft",
      created_by: input.createdBy ?? null,
    })
    .select("*")
    .single()
  if (error) throw new Error(error.message)
  return fromRow(data as CompositionRow)
}

/** Patch a composition. Only the fields present in `input` are written. */
export async function updateComposition(id: string, input: CompositionInput): Promise<Composition> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.title !== undefined) patch.title = input.title.trim() || "Untitled post"
  if (input.brief !== undefined) patch.brief = input.brief
  if (input.link !== undefined) patch.link = input.link
  if (input.masterContent !== undefined) patch.master_content = input.masterContent
  if (input.mediaUrls !== undefined) patch.media_urls = input.mediaUrls
  if (input.shortenLinks !== undefined) patch.shorten_links = input.shortenLinks
  if (input.scheduledFor !== undefined) patch.scheduled_for = input.scheduledFor
  if (input.timezone !== undefined) patch.timezone = input.timezone
  if (input.status !== undefined) patch.status = input.status
  if (input.platforms !== undefined) {
    const platforms = cleanPlatforms(input.platforms)
    patch.platforms = platforms
    patch.post_ids = postIdsOf(platforms)
  }

  const { data, error } = await getPortalAdmin().from(TABLE).update(patch).eq("id", id).select("*").single()
  if (error) throw new Error(error.message)
  return fromRow(data as CompositionRow)
}

/** Delete the row only — Zernio drafts are removed separately by the route. */
export async function deleteComposition(id: string): Promise<void> {
  const { error } = await getPortalAdmin().from(TABLE).delete().eq("id", id)
  if (error) throw new Error(error.message)
}

/* ------------------------------------------------------------------ */
/*  Composer state (row + live Zernio truth)                           */
/* ------------------------------------------------------------------ */

/** The live Zernio side of one platform, when a draft exists for it. */
export interface ComposerLive {
  postId: string
  status: string
  platformUrl?: string
  error?: string
  /** Images currently attached to the Zernio draft, in order. */
  mediaUrls: string[]
  /** Document currently attached to the Zernio draft. */
  documentUrl?: string
  scheduledFor?: string
}

export interface ComposerPlatform {
  key: PlatformKey
  label: string
  /** Every constraint the editor needs, straight from the platform registry. */
  limit: number
  titleLimit?: number
  titleRequired?: boolean
  needsMedia: boolean
  supportsMedia: boolean
  supportsDocument?: boolean
  maxMedia: number
  aspect?: { min: number; max: number }
  linkInBody: boolean
  notes: string[]
  /** Account handle shown under the label. */
  account: string
  connected: boolean
  /** Whether this platform is part of the composition. */
  selected: boolean
  draft: CompositionPlatform
  live?: ComposerLive
  /** Blocking problems, same rules the publish route enforces. */
  problems: string[]
}

export interface ComposerState {
  composition: Composition
  platforms: ComposerPlatform[]
  dashboardUrl: string
  /** Short links this post has handed out, with their click counts. */
  shortLinks: ShortLink[]
}

/**
 * The live half of a channel, read off its Zernio post. Exported so the publish
 * route resolves media from the same shape the composer renders.
 */
export function liveOf(post: ZernioPost | undefined): ComposerLive | undefined {
  if (!post) return undefined
  const entry = post.platforms?.[0]
  return {
    postId: post._id,
    status: entry?.status === "failed" ? "failed" : post.status,
    platformUrl: entry?.platformPostUrl,
    error: entry?.error,
    mediaUrls: (post.mediaItems ?? []).filter((m) => m.type === "image").map((m) => m.url),
    documentUrl: post.mediaItems?.find((m) => m.type === "document")?.url,
    scheduledFor: post.scheduledFor,
  }
}

/** The publishability rules for a platform, in the shape validate.ts wants. */
export function constraintsOf(spec: PlatformSpec): PlatformConstraints {
  return {
    label: spec.label,
    limit: spec.limit,
    titleLimit: spec.titleLimit,
    titleRequired: spec.titleRequired,
    needsMedia: spec.needsMedia,
    supportsMedia: spec.supportsMedia,
    supportsDocument: spec.supportsDocument,
    maxMedia: spec.maxMedia,
  }
}

/** The PDF a platform would publish with right now. "" = none. */
export function effectiveDocument(
  draft: CompositionPlatform | undefined,
  live: ComposerLive | undefined,
  spec: PlatformSpec,
): string {
  if (!spec.supportsDocument) return ""
  if (draft?.documentUrl !== undefined) return draft.documentUrl
  return live?.documentUrl ?? ""
}

/**
 * The images a platform would publish with right now, in order. [] = none.
 *
 * Each channel answers for itself. `mediaUrls` is a LIBRARY of everything
 * uploaded to this post, not a default — it used to be both, so an image
 * dropped on LinkedIn alone became the first entry and every other channel
 * quietly published it. Worse, those channels still showed "No image" as
 * selected, so the composer said one thing and the post did another. Sharing
 * an image across channels is now only what "Add image to all" does, and that
 * writes it onto each channel where you can see it.
 *
 * A PDF displaces the image rather than sitting beside it: LinkedIn allows a
 * post to carry one or the other.
 */
export function effectiveMedia(
  draft: CompositionPlatform | undefined,
  live: ComposerLive | undefined,
  spec: PlatformSpec,
): string[] {
  if (!spec.supportsMedia) return []
  if (effectiveDocument(draft, live, spec)) return []
  // Same resolution the publish route uses, deliberately shared: the two used
  // to compute it separately and disagreed about "no choice recorded".
  // Not capped at `maxMedia` here: an over-full channel has to reach the
  // validator as it stands, or the page would show no blocker for a carousel
  // the publish route is going to refuse.
  return channelImages(draft, live)
}

/**
 * Merge the stored composition with live Zernio state. Accounts and drafts are
 * fetched in parallel; a Zernio outage degrades to "not connected" rather than
 * failing the page, so a half-written composition is never lost behind an error.
 */
export async function buildComposerState(composition: Composition): Promise<ComposerState> {
  const ids: Partial<Record<PlatformKey, string>> = {}
  for (const [key, value] of Object.entries(composition.platforms)) {
    if (value?.zernioPostId) ids[key as PlatformKey] = value.zernioPostId
  }

  const [accounts, posts, shortLinks] = await Promise.all([
    listZernioAccounts(),
    fetchPostsById(ids).catch(() => ({}) as Partial<Record<PlatformKey, ZernioPost>>),
    // Click counts are a nicety; never fail the page over them.
    composition.id ? shortLinksForComposition(composition.id).catch(() => []) : Promise.resolve([]),
  ])
  const accountById = new Map(accounts.map((a) => [a._id, a]))

  const platforms: ComposerPlatform[] = PLATFORMS.map((spec) => {
    const account = accountById.get(spec.accountId)
    const draft = composition.platforms[spec.key]
    const live = liveOf(posts[spec.key])
    const selected = Boolean(draft)
    const media = effectiveMedia(draft, live, spec)
    const document = effectiveDocument(draft, live, spec)
    return {
      key: spec.key,
      label: spec.label,
      limit: spec.limit,
      titleLimit: spec.titleLimit,
      titleRequired: spec.titleRequired,
      needsMedia: spec.needsMedia,
      supportsMedia: spec.supportsMedia,
      supportsDocument: spec.supportsDocument,
      maxMedia: spec.maxMedia,
      aspect: spec.aspect,
      linkInBody: spec.linkInBody,
      notes: spec.notes,
      account: account?.username || account?.displayName || spec.label,
      connected: Boolean(account && account.isActive !== false && account.enabled !== false),
      selected,
      draft: draft ?? { content: "" },
      live,
      problems: selected
        ? problemsFor(constraintsOf(spec), {
            content: draft?.content ?? "",
            title: draft?.title,
            mediaUrls: media,
            documentUrl: document || undefined,
            shortenLinks: composition.shortenLinks,
          })
        : [],
    }
  })

  return { composition, platforms, dashboardUrl: DASHBOARD_URL, shortLinks }
}

/* ------------------------------------------------------------------ */
/*  Status rollup                                                      */
/* ------------------------------------------------------------------ */

/** Re-derive a composition's cached status from live Zernio state. */
export function statusFrom(state: ComposerState): string {
  return rollupStatus(
    state.platforms.filter((p) => p.selected && p.live).map((p) => p.live!.status),
  )
}

/** Convenience for routes: fetch, merge, and refresh the cached status. */
export async function loadComposer(id: string): Promise<ComposerState | null> {
  const composition = await getComposition(id)
  if (!composition) return null
  const state = await buildComposerState(composition)
  const status = statusFrom(state)
  if (status !== composition.status) {
    // Best-effort: a stale cached status must never break the read path.
    await updateComposition(id, { status }).catch(() => {})
    state.composition = { ...state.composition, status }
  }
  return state
}

/** Platform keys that exist in the registry, filtered from untrusted input. */
export function knownKeys(keys: unknown): PlatformKey[] {
  if (!Array.isArray(keys)) return []
  return keys.filter((k): k is PlatformKey => typeof k === "string" && PLATFORMS.some((p) => p.key === k))
}

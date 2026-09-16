/**
 * Zernio social-posting integration for the Marketa blog pipeline.
 *
 * One Zernio DRAFT post is created PER PLATFORM (X, Google Business AU + SG +
 * UK + US, Instagram, LinkedIn, Pinterest, Reddit — YouTube deliberately
 * excluded) so each platform's caption can be edited and published
 * independently, either from the Zernio dashboard or from the portal's social
 * drafts panel (/internal/blog/... on the website).
 *
 * Posts come from two places: a blog (captions promote an article) or a
 * standalone composition written straight in the portal (/internal/social/new).
 * Both fan out the same way; only the `metadata` written on each post differs.
 *
 * Captions are generated per platform in a single OpenRouter call and clamped
 * to hard per-platform limits in code (Zernio's X counter is RAW characters,
 * so the X caption must fit 280 raw chars INCLUDING any URL).
 *
 * Each Zernio post carries `metadata` (marketaSlug / marketaDraftId /
 * marketaDocId / marketaPlatform) so the portal can find a blog's social posts
 * without any local persistence. Verified to round-trip on the live API.
 *
 * Activated only when ZERNIO_API_KEY is set; every call is best-effort in the
 * pipeline and must never break blog generation.
 *
 * API: https://docs.zernio.com — POST/PUT/GET https://zernio.com/api/v1/posts
 */

const ZERNIO_BASE = "https://zernio.com/api/v1"
const DASHBOARD_URL = process.env.ZERNIO_DASHBOARD_URL || "https://zernio.com/dashboard"
const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fruitionservices.io").replace(/\/+$/, "")

/* ------------------------------------------------------------------ */
/*  Platform registry                                                  */
/* ------------------------------------------------------------------ */

/** Stable keys for every target platform (gbp has two locations). */
export type PlatformKey =
  | "twitter"
  | "gbp-au"
  | "gbp-sg"
  | "gbp-uk"
  | "gbp-us"
  | "instagram"
  | "linkedin"
  | "pinterest"
  | "reddit"

export interface PlatformSpec {
  key: PlatformKey
  /** Zernio `platform` identifier. */
  platform: string
  /** Connected Zernio account id (overridable via env if reconnected). */
  accountId: string
  /** Human label for portal UI / logs. */
  label: string
  /** Hard character cap enforced on the caption body. */
  limit: number
  /** Platform refuses to publish without an image. */
  needsMedia: boolean
  /** Whether to attach blog images at all (Reddit stays a text post). */
  supportsMedia: boolean
  /** Platform accepts a PDF/slide document instead of an image (LinkedIn only). */
  supportsDocument?: boolean
  /** Which generated caption this platform uses (gbp-au + gbp-sg share one). */
  captionKey: "twitter" | "googlebusiness" | "instagram" | "linkedin" | "pinterest" | "reddit"

  /* --- constraints, surfaced in the composer UI and enforced before publish --- */

  /** Character cap on the separate title field, when the platform has one. */
  titleLimit?: number
  /** Platform refuses to publish without a title. */
  titleRequired?: boolean
  /** How many images one post may carry; more than one publishes as a carousel. */
  maxMedia: number
  /** Per-image byte cap, where the platform enforces one. */
  mediaMaxBytes?: number
  /** Accepted width/height ratio range, where the platform enforces one. */
  aspect?: { min: number; max: number }
  /** Whether a URL in the body is useful (false = not clickable / has a link field). */
  linkInBody: boolean
  /** Counter is raw characters including URLs, rather than shortened-link weighted. */
  countsRawChars: boolean
  /** Plain-English limitations shown verbatim next to the editor. */
  notes: string[]
}

const PINTEREST_BOARD_ID = process.env.ZERNIO_PINTEREST_BOARD_ID || "1009369403924050337"
/** Optional subreddit override; empty = the account's default subreddit. */
const REDDIT_SUBREDDIT = process.env.ZERNIO_REDDIT_SUBREDDIT || ""

export const PLATFORMS: PlatformSpec[] = [
  {
    key: "twitter",
    platform: "twitter",
    accountId: process.env.ZERNIO_X_ACCOUNT_ID || "6a4f402e3ecd8aa344702cec",
    label: "X (Twitter)",
    limit: 280,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "twitter",
    maxMedia: 4,
    linkInBody: true,
    countsRawChars: true,
    notes: [
      "280 characters counted RAW — the link eats into the limit, it isn't shortened.",
      "One post, no threads.",
    ],
  },
  {
    key: "gbp-au",
    platform: "googlebusiness",
    accountId: process.env.ZERNIO_GBP_AU_ACCOUNT_ID || "6a606dc7542d8bc5a6a2d3c7",
    label: "Google Business — Australia",
    limit: 1500,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "googlebusiness",
    maxMedia: 1,
    mediaMaxBytes: 5 * 1024 * 1024,
    linkInBody: true,
    countsRawChars: true,
    notes: [
      "One image, 5 MB max.",
      "A local-SEO surface: name the service plainly and end with a clear call to action.",
      "AU, SG, UK and US are separate listings — each gets this caption unless you edit them apart.",
    ],
  },
  {
    key: "gbp-sg",
    platform: "googlebusiness",
    accountId: process.env.ZERNIO_GBP_ACCOUNT_ID || "6a4f41573ecd8aa3447039c0",
    label: "Google Business — Singapore",
    limit: 1500,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "googlebusiness",
    maxMedia: 1,
    mediaMaxBytes: 5 * 1024 * 1024,
    linkInBody: true,
    countsRawChars: true,
    notes: [
      "One image, 5 MB max.",
      "A local-SEO surface: name the service plainly and end with a clear call to action.",
      "AU, SG, UK and US are separate listings — each gets this caption unless you edit them apart.",
    ],
  },
  {
    key: "gbp-uk",
    platform: "googlebusiness",
    accountId: process.env.ZERNIO_GBP_UK_ACCOUNT_ID || "6a7421f2d0fe733d1a911351",
    label: "Google Business — United Kingdom",
    limit: 1500,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "googlebusiness",
    maxMedia: 1,
    mediaMaxBytes: 5 * 1024 * 1024,
    linkInBody: true,
    countsRawChars: true,
    notes: [
      "One image, 5 MB max.",
      "A local-SEO surface: name the service plainly and end with a clear call to action.",
      "AU, SG, UK and US are separate listings — each gets this caption unless you edit them apart.",
    ],
  },
  {
    key: "gbp-us",
    platform: "googlebusiness",
    accountId: process.env.ZERNIO_GBP_US_ACCOUNT_ID || "6a742243d0fe733d1a9116f6",
    label: "Google Business — United States",
    limit: 1500,
    needsMedia: false,
    supportsMedia: true,
    captionKey: "googlebusiness",
    maxMedia: 1,
    mediaMaxBytes: 5 * 1024 * 1024,
    linkInBody: true,
    countsRawChars: true,
    notes: [
      "One image, 5 MB max.",
      "A local-SEO surface: name the service plainly and end with a clear call to action.",
      "AU, SG, UK and US are separate listings — each gets this caption unless you edit them apart.",
    ],
  },
  {
    key: "instagram",
    platform: "instagram",
    accountId: process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID || "6a6072be542d8bc5a6a322b7",
    label: "Instagram",
    limit: 2200,
    needsMedia: true,
    supportsMedia: true,
    captionKey: "instagram",
    maxMedia: 10,
    aspect: { min: 0.8, max: 1.91 },
    linkInBody: false,
    countsRawChars: true,
    notes: [
      "An image is required.",
      "Pick several and they publish as one swipeable carousel, in the order shown (10 max).",
      "Aspect must sit between 4:5 and 1.91:1 — wider images are cropped automatically.",
      "Links in captions aren't clickable.",
      "Once published it CANNOT be deleted through the API — only in the Instagram app.",
    ],
  },
  {
    key: "linkedin",
    platform: "linkedin",
    accountId: process.env.ZERNIO_LINKEDIN_ACCOUNT_ID || "6a606c8f542d8bc5a6a2c6ae",
    label: "LinkedIn (Fruition)",
    limit: 3000,
    needsMedia: false,
    supportsMedia: true,
    supportsDocument: true,
    captionKey: "linkedin",
    maxMedia: 1,
    linkInBody: true,
    countsRawChars: true,
    notes: [
      "Only the first ~2 lines show in the feed before “see more”.",
      "Posts to the Fruition company page, not a personal profile.",
      "A PDF posts as a swipeable carousel — up to 100 MB and 300 pages, and it replaces the image.",
      "Tagging a company works; the tag is stored as markup and expands when it publishes.",
    ],
  },
  {
    key: "pinterest",
    platform: "pinterest",
    accountId: process.env.ZERNIO_PINTEREST_ACCOUNT_ID || "6a6072db542d8bc5a6a323bd",
    label: "Pinterest",
    limit: 500,
    needsMedia: true,
    supportsMedia: true,
    captionKey: "pinterest",
    titleLimit: 100,
    maxMedia: 1,
    linkInBody: false,
    countsRawChars: true,
    notes: [
      "An image is required — the pin IS the image.",
      "Title (100 chars) and description are separate fields.",
      "The destination link is a field, not part of the description.",
    ],
  },
  {
    key: "reddit",
    platform: "reddit",
    accountId: process.env.ZERNIO_REDDIT_ACCOUNT_ID || "6a6070d4542d8bc5a6a30d3e",
    label: "Reddit",
    limit: 10000,
    needsMedia: false,
    supportsMedia: false,
    captionKey: "reddit",
    titleLimit: 300,
    titleRequired: true,
    maxMedia: 0,
    linkInBody: true,
    countsRawChars: true,
    notes: [
      "A title is required.",
      "Leave the subreddit blank to use the account default.",
      "Most subs remove or ban promotional posts — pick a niche sub and write like a practitioner, not an ad.",
      "Text post only.",
    ],
  },
]

export function platformSpec(key: PlatformKey): PlatformSpec {
  const spec = PLATFORMS.find((p) => p.key === key)
  if (!spec) throw new Error(`Unknown platform key: ${key}`)
  return spec
}

/** Same slug algorithm as the portal editor, used as a stable source key. */
export function slugifyTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

/* ------------------------------------------------------------------ */
/*  Zernio API client                                                  */
/* ------------------------------------------------------------------ */

function apiKey(): string | null {
  return process.env.ZERNIO_API_KEY || null
}

async function zernioFetch(path: string, init?: RequestInit): Promise<Response> {
  const key = apiKey()
  if (!key) throw new Error("ZERNIO_API_KEY is not set")
  return fetch(`${ZERNIO_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
}

async function zernioJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await zernioFetch(path, init)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Zernio ${init?.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`)
  }
  return JSON.parse(text) as T
}

export interface ZernioPlatformEntry {
  platform: string
  accountId: string | { _id: string }
  status?: string
  platformPostUrl?: string
  error?: string
  platformSpecificData?: Record<string, unknown>
}

export interface ZernioPost {
  _id: string
  title?: string
  content: string
  status: string
  scheduledFor?: string
  metadata?: Record<string, unknown>
  mediaItems?: Array<{ type: string; url: string; title?: string }>
  platforms: ZernioPlatformEntry[]
  createdAt?: string
}

export interface ZernioAccount {
  _id: string
  platform: string
  displayName?: string
  username?: string
  isActive?: boolean
  enabled?: boolean
}

/** Connected Zernio accounts, used to show which channels are live. */
export async function listZernioAccounts(): Promise<ZernioAccount[]> {
  if (!apiKey()) return []
  try {
    const data = await zernioJson<{ accounts?: ZernioAccount[] }>("/accounts")
    return data.accounts ?? []
  } catch {
    return [] // a channels lookup failing must never blank the whole panel
  }
}

/** One account tagged in a LinkedIn post, as Zernio resolves it. */
export interface LinkedInMention {
  urn: string
  type: "person" | "organization"
  displayName: string
  /** Ready to paste into the caption: "@[monday.com](urn:li:organization:…)". */
  mentionFormat: string
  vanityName?: string
  /** Zernio's caveat about person mentions, when it returns one. */
  notice?: string
}

/**
 * Turn a LinkedIn company/profile URL (or bare vanity name) into a mention.
 *
 * LinkedIn has no plain-text @mention: the post body has to carry the
 * account's URN, and only LinkedIn can say what that URN is. Zernio resolves
 * it against the connected account and expands the markup at publish time.
 *
 * Company mentions always resolve. Person mentions need the connected account
 * to administer at least one organisation — a LinkedIn API limit on resolving
 * a profile URL, not on publishing — so they can fail where a company won't.
 */
export async function resolveLinkedInMention(
  target: string,
  displayName?: string,
): Promise<LinkedInMention> {
  const spec = platformSpec("linkedin")
  const params = new URLSearchParams({ url: target })
  if (displayName) params.set("displayName", displayName)
  const data = await zernioJson<{
    urn?: string
    type?: string
    displayName?: string
    mentionFormat?: string
    vanityName?: string
    personMentionNotice?: string
    warning?: string
  }>(`/accounts/${spec.accountId}/linkedin-mentions?${params}`)

  if (!data.urn || !data.mentionFormat) throw new Error("LinkedIn returned no account for that link")
  return {
    urn: data.urn,
    type: data.type === "person" ? "person" : "organization",
    displayName: data.displayName ?? displayName ?? target,
    mentionFormat: data.mentionFormat,
    vanityName: data.vanityName,
    notice: data.warning ?? data.personMentionNotice,
  }
}

export async function getZernioPost(postId: string): Promise<ZernioPost> {
  const data = await zernioJson<{ post: ZernioPost }>(`/posts/${postId}`)
  return data.post
}

export async function listZernioPosts(limit = 100): Promise<ZernioPost[]> {
  const data = await zernioJson<{ posts: ZernioPost[] }>(`/posts?limit=${limit}`)
  return data.posts ?? []
}

export async function deleteZernioPost(postId: string): Promise<void> {
  await zernioJson<{ message: string }>(`/posts/${postId}`, { method: "DELETE" })
}

/**
 * Delete a PUBLISHED post from the live platform (the Zernio record stays,
 * status → "cancelled"). Unsupported by Instagram (platform limitation —
 * delete in the IG app instead). `platform` is Zernio's platform string.
 */
export async function unpublishZernioPost(postId: string, platform: string): Promise<void> {
  if (platform === "instagram") {
    throw new Error("Instagram posts can't be deleted via API — remove it in the Instagram app")
  }
  await zernioJson<{ success?: boolean; message?: string }>(`/posts/${postId}/unpublish`, {
    method: "POST",
    body: JSON.stringify({ platform }),
  })
}

/** Source identifiers linking a Zernio post back to a blog. */
export interface SocialSource {
  slug: string
  draftId?: string
  docId?: string
  pulseId?: string
}

/**
 * What a Zernio post belongs to: a blog (captions promote a post) or a
 * standalone composition written straight in the portal. Both fan out to one
 * Zernio post per platform; only the `metadata` written on each post differs.
 */
export type PostTarget =
  | { kind: "blog"; source: SocialSource }
  | { kind: "composition"; compositionId: string }

function targetMetadata(target: PostTarget, key: PlatformKey): Record<string, unknown> {
  if (target.kind === "composition") {
    return {
      marketaKind: "standalone",
      marketaCompositionId: target.compositionId,
      marketaPlatform: key,
    }
  }
  const { source } = target
  return {
    marketaSlug: source.slug,
    ...(source.draftId ? { marketaDraftId: source.draftId } : {}),
    ...(source.docId ? { marketaDocId: source.docId } : {}),
    ...(source.pulseId ? { marketaPulseId: source.pulseId } : {}),
    marketaPlatform: key,
  }
}

function matchesSource(post: ZernioPost, source: SocialSource): boolean {
  const m = post.metadata
  if (!m) return false
  return (
    (typeof m.marketaSlug === "string" && m.marketaSlug === source.slug) ||
    (typeof m.marketaDraftId === "string" && Boolean(source.draftId) && m.marketaDraftId === source.draftId) ||
    (typeof m.marketaDocId === "string" && Boolean(source.docId) && m.marketaDocId === source.docId) ||
    (typeof m.marketaPulseId === "string" && Boolean(source.pulseId) && m.marketaPulseId === source.pulseId)
  )
}

/**
 * Find the existing Zernio posts for a blog, newest first, keyed by platform.
 * Scans the most recent posts (the dashboard holds drafts, so 200 is plenty).
 */
export async function findSocialPosts(source: SocialSource): Promise<Partial<Record<PlatformKey, ZernioPost>>> {
  const posts = await listZernioPosts(200)
  const byPlatform: Partial<Record<PlatformKey, ZernioPost>> = {}
  for (const post of posts) {
    if (!matchesSource(post, source)) continue
    const key = post.metadata?.marketaPlatform as PlatformKey | undefined
    if (!key || byPlatform[key]) continue // newest wins; list is newest-first
    byPlatform[key] = post
  }
  return byPlatform
}

/**
 * Fetch a composition's Zernio posts by id. Compositions store their post ids
 * locally (social_compositions.platforms), so this fetches them directly rather
 * than scanning the post list — no 200-post ceiling, and it stays correct once
 * standalone posts outnumber blog posts.
 */
export async function fetchPostsById(
  ids: Partial<Record<PlatformKey, string>>,
): Promise<Partial<Record<PlatformKey, ZernioPost>>> {
  const entries = Object.entries(ids).filter(([, id]) => Boolean(id)) as Array<[PlatformKey, string]>
  const found = await Promise.all(
    entries.map(async ([key, id]) => {
      // A post deleted in the Zernio dashboard shouldn't break the whole panel.
      const post = await getZernioPost(id).catch(() => null)
      return [key, post] as const
    }),
  )
  const byPlatform: Partial<Record<PlatformKey, ZernioPost>> = {}
  for (const [key, post] of found) if (post) byPlatform[key] = post
  return byPlatform
}

/* ------------------------------------------------------------------ */
/*  Caption limits                                                     */
/* ------------------------------------------------------------------ */

/** Trim to a hard cap, breaking on a word and appending an ellipsis. */
export function clampText(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, Math.max(0, max - 1))
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/**
 * Clamp an X caption to 280 RAW characters including any trailing URL line
 * (Zernio's composer counts raw characters, not t.co-weighted ones).
 * The URL line is preserved; only the leading copy is trimmed.
 */
export function clampTwitter(text: string): string {
  const t = text.trim()
  if (t.length <= 280) return t
  const lines = t.split("\n")
  const last = lines[lines.length - 1]?.trim() ?? ""
  const isUrlLine = /^https?:\/\/\S+$/.test(last)
  if (isUrlLine && lines.length > 1) {
    const budget = 280 - last.length - 1
    return `${clampText(lines.slice(0, -1).join("\n"), budget)}\n${last}`
  }
  return clampText(t, 280)
}

/* ------------------------------------------------------------------ */
/*  Caption generation (one OpenRouter call for every platform)        */
/* ------------------------------------------------------------------ */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const CAPTION_MODEL = process.env.MARKETA_SOCIAL_MODEL ?? "anthropic/claude-haiku-4.5"

const VOICE_RULES = [
  "Voice (Fruition):",
  "- Plain-spoken, confident, technical without academic.",
  "- Talk to a senior operator (COO, ops director).",
  "- Show, don't tell. Specific verbs over marketing adjectives.",
  "- No em dashes anywhere. Use commas, parens, or two short sentences.",
  "- Banned words: leverage, synergise, best-in-class, unlock potential, drive transformation, seamlessly, robust, dive into, in today's world, fast-paced, game-changer.",
  "- No 'I hope this helps' / 'let's dive in' AI-tells.",
].join("\n")

export interface SocialCaptions {
  twitter: string
  googlebusiness: string
  instagram: string
  linkedin: string
  /** Pinterest pin: separate title (≤100) + description (≤500). */
  pinterest: { title: string; description: string }
  /** Reddit: separate title (≤300) + body. */
  reddit: { title: string; body: string }
}

export interface GenerateCaptionsInput {
  /**
   * "blog" (default) promotes a published/soon-published article; "idea" writes
   * a standalone post from a brief, with no article behind it.
   */
  kind?: "blog" | "idea"
  title: string
  excerpt?: string
  /** Blog draft/article markdown for grounding (truncated internally). */
  body?: string
  industry?: string
  targetKeyword?: string
  /** Live blog URL, or (kind "idea") any link the post should carry. */
  blogUrl?: string
  /** kind "idea": what the post should say, in the writer's own words. */
  brief?: string
  /** kind "idea": optional steer, e.g. "announcement", "hiring", "opinion". */
  tone?: string
  /** kind "idea": what the reader should do next. */
  cta?: string
  /** Restrict generation to these caption keys (regenerate one platform). */
  only?: Array<PlatformSpec["captionKey"]>
}

const MAX_BODY_CHARS = 5000

function captionsPrompt(input: GenerateCaptionsInput): { system: string; user: string } {
  const link = input.blogUrl
  const standalone = input.kind === "idea"
  const urlRule = link
    ? standalone
      ? `Link to include: ${link} — put it where each platform's spec says so.`
      : `The blog post is live at ${link} — include that URL where each platform's spec says so.`
    : standalone
      ? "There is NO link for this post — do not invent or include any URL."
      : "The blog post is NOT live yet, so do NOT include any URL anywhere. The link is appended automatically at publish time — leave headroom for it on X."
  const xBudget = link ? 280 - (link.length + 1) : standalone ? 280 : 200
  const system = [
    "You are Marketa, Fruition's marketing agent. Fruition is a Platinum monday.com consulting partner (900+ implementations across Australia, US, UK, Singapore).",
    standalone
      ? "Write social captions for one idea, for several platforms at once. This is a standalone post, not a blog promotion — never refer to 'the post', 'the article', or 'read more' unless a link is given."
      : "Write social captions promoting one blog post, for several platforms at once.",
    "",
    urlRule,
    "",
    "Return ONLY a JSON object (no markdown fences, no commentary) with exactly these keys:",
    "{",
    `  "twitter": "one punchy post, HARD MAX ${xBudget} characters. Specific hook, one concrete takeaway, soft CTA${input.blogUrl ? ", then the URL on its own final line" : ""}. At most 2 lowercase hashtags.",`,
    '  "googlebusiness": "a Google Business Profile update, 400-900 characters. Local-SEO aware: name the service plainly (monday.com consulting / implementation), one concrete benefit or example' +
      (standalone ? "" : " from the post") +
      ", end with a clear call to action" +
      (link ? " and the URL." : '."') +
      ' No hashtags.",',
    '  "instagram": "a caption: one-line hook, then 2-4 short lines of concrete value (blank line between each), a soft CTA, then a final line of 5-8 lowercase hashtags relevant to monday.com / ops / automation. Max 1800 characters.",',
    '  "linkedin": "a post for the Fruition company page: strong first line (it gets truncated in feed), 3-6 short paragraphs or a tight list with concrete takeaways' +
      (standalone ? "" : " from the post") +
      ", soft CTA" +
      (link ? ", URL at the end." : '."') +
      ' Max 2500 characters. At most 3 hashtags.",',
    '  "pinterest": {"title": "keyword-aware pin title, max 90 characters", "description": "2-3 sentences of value ending with 3-5 lowercase hashtags, max 450 characters"},',
    '  "reddit": {"title": "a plain, non-clickbait title a human would post, max 280 characters", "body": "2-4 conversational paragraphs sharing the core insight like a practitioner, not an ad. No hashtags' +
      (link ? ", link it once, plainly." : '."') +
      '"}',
    "}",
    "",
    VOICE_RULES,
  ].join("\n")

  const body = (input.body ?? "").slice(0, MAX_BODY_CHARS)
  const user = standalone
    ? [
        `What the post is about: ${input.brief?.trim() || input.title}`,
        input.title ? `Working title (internal, don't quote it): ${input.title}` : "",
        input.tone ? `Angle: ${input.tone}` : "",
        input.cta ? `What the reader should do next: ${input.cta}` : "",
        input.industry && input.industry.toLowerCase() !== "general" ? `Audience/industry: ${input.industry}` : "",
        input.only?.length ? `Only these keys are needed (fill the rest with empty strings): ${input.only.join(", ")}` : "",
        "",
        body ? `Extra material to draw on (may be truncated):\n---\n${body}\n---` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : [
        `Blog title: ${input.title}`,
        input.excerpt ? `Excerpt: ${input.excerpt}` : "",
        input.industry && input.industry.toLowerCase() !== "general" ? `Industry: ${input.industry}` : "",
        input.targetKeyword ? `Target keyword (tone only, do not stuff): ${input.targetKeyword}` : "",
        input.only?.length ? `Only these keys are needed (fill the rest with empty strings): ${input.only.join(", ")}` : "",
        "",
        body ? `Source draft below (may be truncated):\n---\n${body}\n---` : "No draft body available — write from the title and excerpt.",
      ]
        .filter(Boolean)
        .join("\n")

  return { system, user }
}

function extractJson(raw: string): unknown {
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "")
  const start = stripped.indexOf("{")
  const end = stripped.lastIndexOf("}")
  if (start === -1 || end === -1) throw new Error(`No JSON object in caption response: ${raw.slice(0, 120)}`)
  return JSON.parse(stripped.slice(start, end + 1))
}

/** Generate captions for every platform in one LLM call, clamped to limits. */
export async function generateSocialCaptions(input: GenerateCaptionsInput): Promise<SocialCaptions> {
  const orKey = process.env.OPENROUTER_API_KEY
  if (!orKey) throw new Error("OPENROUTER_API_KEY is not set")
  const { system, user } = captionsPrompt(input)

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${orKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": "Marketa Social Captions",
    },
    body: JSON.stringify({
      model: CAPTION_MODEL,
      max_tokens: 4000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`OpenRouter captions request failed ${r.status}: ${text.slice(0, 300)}`)
  const parsed = JSON.parse(text) as { choices?: Array<{ message?: { content?: string | null } }>; error?: { message?: string } }
  if (parsed.error) throw new Error(`OpenRouter captions error: ${parsed.error.message ?? "unknown"}`)
  const content = parsed.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error("OpenRouter captions returned empty content")

  const j = extractJson(content) as Record<string, unknown>
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "")
  const pin = (j.pinterest ?? {}) as Record<string, unknown>
  const red = (j.reddit ?? {}) as Record<string, unknown>

  return {
    twitter: clampTwitter(str(j.twitter)),
    googlebusiness: clampText(str(j.googlebusiness), 1500),
    instagram: clampText(str(j.instagram), 2200),
    linkedin: clampText(str(j.linkedin), 3000),
    pinterest: {
      title: clampText(str(pin.title) || input.title, 100),
      description: clampText(str(pin.description), 500),
    },
    reddit: {
      title: clampText(str(red.title) || input.title, 300),
      body: str(red.body),
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Draft creation / update / publish                                  */
/* ------------------------------------------------------------------ */

export interface PlatformDraftInput {
  key: PlatformKey
  /** Caption body (post content). */
  content: string
  /** Pinterest pin title / Reddit post title. */
  title?: string
}

function platformEntry(
  spec: PlatformSpec,
  args: { title?: string; link?: string; subreddit?: string; boardId?: string; documentName?: string },
): ZernioPlatformEntry {
  const psd: Record<string, unknown> = {}
  if (spec.key === "linkedin" && args.documentName) {
    // LinkedIn refuses a document post without a title, and shows this one on
    // the carousel — so it's the filename unless the writer named it.
    psd.documentTitle = clampText(args.documentName, 100)
  }
  if (spec.key === "pinterest") {
    const boardId = args.boardId || PINTEREST_BOARD_ID
    if (boardId) psd.boardId = boardId
    if (args.title) psd.title = clampText(args.title, 100)
    if (args.link) psd.link = args.link
  }
  if (spec.key === "reddit") {
    if (args.title) psd.title = clampText(args.title, 300)
    const subreddit = (args.subreddit ?? REDDIT_SUBREDDIT).trim().replace(/^\/?r\//, "")
    if (subreddit) psd.subreddit = subreddit
  }
  return {
    platform: spec.platform,
    accountId: spec.accountId,
    ...(Object.keys(psd).length ? { platformSpecificData: psd } : {}),
  }
}

export interface SocialDraftResult {
  key: PlatformKey
  postId?: string
  error?: string
}

/** Images, a document, or nothing: what one post attaches. */
export interface MediaChoice {
  /**
   * Ordered images. Channels whose `maxMedia` is above 1 publish the whole
   * list as a carousel; the rest take the first and drop the others, which is
   * what "only one picture uploaded" looked like before they could carry more.
   */
  imageUrls?: string[]
  /** Publicly reachable PDF/PPT/DOC. LinkedIn only; posts as a carousel. */
  documentUrl?: string
  /** Shown on the LinkedIn carousel; falls back to the post name. */
  documentName?: string
}

/**
 * Build `mediaItems` for one platform.
 *
 * A LinkedIn document and an image can't coexist on the same post, and the
 * document wins: someone who attached a PDF meant to post the PDF. Returns
 * undefined when there's nothing to attach, so callers can leave the field off
 * the request entirely rather than sending an empty array.
 */
export function mediaItemsFor(
  spec: PlatformSpec,
  media: MediaChoice,
  imageTitle?: string,
): Array<{ type: string; url: string; title?: string }> | undefined {
  if (media.documentUrl && spec.supportsDocument) {
    return [
      {
        type: "document",
        url: media.documentUrl,
        ...(media.documentName ? { title: media.documentName } : {}),
      },
    ]
  }
  if (!spec.supportsMedia) return undefined
  // Order is the carousel order, so keep it and cut from the end at the cap
  // rather than silently reordering what the writer arranged.
  const images = (media.imageUrls ?? []).filter(Boolean).slice(0, spec.maxMedia)
  if (!images.length) return undefined
  return images.map((raw, i) => ({
    type: "image",
    url: spec.key === "instagram" ? instagramSafeImageUrl(raw) : raw,
    // The title is the post's, not each slide's: only the first carries it.
    ...(i === 0 && imageTitle ? { title: imageTitle } : {}),
  }))
}

/**
 * Create ONE Zernio draft with exact copy, and return its id.
 *
 * The blog flow reaches this through createSocialDrafts (which maps generated
 * captions onto platforms first); the composer calls it directly, because by
 * then the writer has already decided what each platform says.
 */
export async function createDraftPost(args: {
  target: PostTarget
  key: PlatformKey
  /** Internal post name in the Zernio dashboard. */
  name: string
  content: string
  /** Pinterest pin title / Reddit post title. */
  title?: string
  imageUrls?: string[]
  documentUrl?: string
  documentName?: string
  link?: string
  subreddit?: string
  boardId?: string
}): Promise<string> {
  const spec = platformSpec(args.key)
  const documentName = args.documentUrl ? args.documentName || args.name : undefined
  const body: Record<string, unknown> = {
    title: args.name.slice(0, 120),
    content: clampText(args.key === "twitter" ? clampTwitter(args.content) : args.content, spec.limit),
    isDraft: true,
    platforms: [
      platformEntry(spec, {
        title: args.title,
        link: args.link || SITE_BASE,
        subreddit: args.subreddit,
        boardId: args.boardId,
        documentName,
      }),
    ],
    metadata: targetMetadata(args.target, args.key),
  }
  const mediaItems = mediaItemsFor(
    spec,
    { imageUrls: args.imageUrls, documentUrl: args.documentUrl, documentName },
    args.name.slice(0, 90),
  )
  if (mediaItems) body.mediaItems = mediaItems
  const data = await zernioJson<{ post?: { _id?: string } }>("/posts", {
    method: "POST",
    body: JSON.stringify(body),
  })
  if (!data.post?._id) throw new Error("Zernio returned no post id")
  return data.post._id
}

/**
 * Create one Zernio DRAFT per platform. Skips platforms that already have a
 * post for this source (pass `existing` from findSocialPosts to make this
 * idempotent). Per-platform failures are isolated.
 */
export async function createSocialDrafts(args: {
  target: PostTarget
  blogTitle: string
  captions: SocialCaptions
  /** Cover image(s), attached to every platform that benefits from media. */
  imageUrls?: string[]
  /** Blog URL for Pinterest's destination link (falls back to site base). */
  blogUrl?: string
  keys?: PlatformKey[]
  existing?: Partial<Record<PlatformKey, ZernioPost>>
}): Promise<SocialDraftResult[]> {
  const targets = PLATFORMS.filter((p) => !args.keys || args.keys.includes(p.key))
  const results: SocialDraftResult[] = []

  for (const spec of targets) {
    if (args.existing?.[spec.key]) {
      results.push({ key: spec.key, postId: args.existing[spec.key]!._id })
      continue
    }
    try {
      const { content, title } = captionFor(spec, args.captions)
      const postId = await createDraftPost({
        target: args.target,
        key: spec.key,
        name: args.blogTitle,
        content,
        title,
        imageUrls: args.imageUrls,
        link: args.blogUrl,
      })
      results.push({ key: spec.key, postId })
    } catch (err) {
      results.push({ key: spec.key, error: err instanceof Error ? err.message : String(err) })
    }
  }
  return results
}

/** Map the generated caption set onto one platform's content/title. */
export function captionFor(spec: PlatformSpec, captions: SocialCaptions): { content: string; title?: string } {
  switch (spec.captionKey) {
    case "twitter":
      return { content: clampTwitter(captions.twitter) }
    case "googlebusiness":
      return { content: captions.googlebusiness }
    case "instagram":
      return { content: captions.instagram }
    case "linkedin":
      return { content: captions.linkedin }
    case "pinterest":
      return { content: captions.pinterest.description, title: captions.pinterest.title }
    case "reddit":
      return { content: captions.reddit.body, title: captions.reddit.title }
  }
}

/** Update a draft's caption (and Pinterest/Reddit title, Reddit subreddit) in place. */
export async function updateSocialDraft(args: {
  postId: string
  key: PlatformKey
  content: string
  title?: string
  blogUrl?: string
  imageUrls?: string[]
  documentUrl?: string
  documentName?: string
  subreddit?: string
  boardId?: string
}): Promise<void> {
  const spec = platformSpec(args.key)
  const documentName = args.documentUrl ? args.documentName : undefined
  const body: Record<string, unknown> = {
    content: clampText(args.key === "twitter" ? clampTwitter(args.content) : args.content, spec.limit),
    platforms: [
      platformEntry(spec, {
        title: args.title,
        link: args.blogUrl || SITE_BASE,
        subreddit: args.subreddit,
        boardId: args.boardId,
        documentName,
      }),
    ],
  }
  // imageUrls / documentUrl semantics: undefined = leave media as-is,
  // [] or "" = remove, values = set. Either one being present rebuilds the
  // whole list, because a document and images can't both be attached.
  if (args.imageUrls !== undefined || args.documentUrl !== undefined) {
    body.mediaItems =
      mediaItemsFor(spec, {
        imageUrls: args.imageUrls,
        documentUrl: args.documentUrl || undefined,
        documentName,
      }) ?? []
  }
  await zernioJson(`/posts/${args.postId}`, { method: "PUT", body: JSON.stringify(body) })
}

/**
 * Instagram rejects images outside the 4:5 – 1.91:1 aspect range (a standard
 * 1200×627 OG cover is 1.914 and FAILS). For Sanity CDN images (dimensions are
 * in the filename) return a URL cropped server-side into range, as JPEG.
 * Non-Sanity URLs are returned unchanged.
 */
export function instagramSafeImageUrl(url: string): string {
  const m = url.match(/^(https:\/\/cdn\.sanity\.io\/images\/[^?]+-(\d+)x(\d+)\.\w+)(\?.*)?$/)
  if (!m) return url
  const base = m[1]
  const w = parseInt(m[2], 10)
  const h = parseInt(m[3], 10)
  if (!w || !h) return url
  const ratio = w / h
  if (ratio > 1.91) {
    const cw = Math.min(w, 1600)
    return `${base}?w=${cw}&h=${Math.round(cw / 1.9)}&fit=crop&fm=jpg`
  }
  if (ratio < 0.8) {
    const ch = Math.min(h, 1600)
    return `${base}?h=${ch}&w=${Math.round(ch * 0.8)}&fit=crop&fm=jpg`
  }
  return `${base}?w=${Math.min(w, 1600)}&fit=max&fm=jpg`
}

/**
 * Publish a draft NOW. Ensures the blog URL is present in the caption for
 * link-friendly platforms (appended if missing, X re-clamped to fit raw 280),
 * and attaches the cover image where the platform requires media.
 */
export async function publishSocialDraft(args: {
  postId: string
  key: PlatformKey
  content: string
  title?: string
  blogUrl: string
  imageUrls?: string[]
  documentUrl?: string
  documentName?: string
  subreddit?: string
  boardId?: string
}): Promise<{ status: string }> {
  const spec = platformSpec(args.key)
  if (spec.needsMedia && !args.imageUrls?.length) {
    throw new Error(`${spec.label} requires an image — publish the blog with a cover image first`)
  }

  let content = args.content.trim()
  const wantsUrlInBody = spec.key !== "pinterest" && spec.key !== "instagram"
  if (wantsUrlInBody && args.blogUrl && !content.includes(args.blogUrl)) {
    content = `${content}\n\n${args.blogUrl}`
  }
  if (spec.key === "twitter") content = clampTwitter(content.replace(/\n\n(https?:\/\/\S+)$/, "\n$1"))
  content = clampText(content, spec.limit)

  const body: Record<string, unknown> = {
    content,
    platforms: [
      platformEntry(spec, {
        title: args.title,
        link: args.blogUrl,
        subreddit: args.subreddit,
        boardId: args.boardId,
        documentName: args.documentName,
      }),
    ],
    isDraft: false,
    publishNow: true,
  }
  const mediaItems = mediaItemsFor(spec, {
    imageUrls: args.imageUrls,
    documentUrl: args.documentUrl,
    documentName: args.documentName,
  })
  if (mediaItems) body.mediaItems = mediaItems
  const data = await zernioJson<{ post?: { status?: string } }>(`/posts/${args.postId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
  return { status: data.post?.status ?? "publishing" }
}

/**
 * Republish after an unpublish (Zernio leaves the old record "cancelled" and
 * won't re-run it): create a FRESH draft carrying over the old post's
 * metadata, publish that, then delete the cancelled record. Returns the new
 * post id so callers can re-link.
 */
export async function republishCancelledPost(args: {
  oldPost: ZernioPost
  key: PlatformKey
  content: string
  title?: string
  blogUrl: string
  imageUrls?: string[]
  documentUrl?: string
  documentName?: string
  subreddit?: string
  boardId?: string
}): Promise<{ status: string; postId: string }> {
  const spec = platformSpec(args.key)
  const created = await zernioJson<{ post?: { _id?: string } }>("/posts", {
    method: "POST",
    body: JSON.stringify({
      title: args.oldPost.title,
      content: clampText(args.content, spec.limit),
      isDraft: true,
      platforms: [
        platformEntry(spec, {
          title: args.title,
          link: args.blogUrl,
          subreddit: args.subreddit,
          boardId: args.boardId,
          documentName: args.documentName,
        }),
      ],
      metadata: args.oldPost.metadata ?? {},
    }),
  })
  const postId = created.post?._id
  if (!postId) throw new Error("Zernio recreate returned no post id")

  const { status } = await publishSocialDraft({ ...args, postId })
  await deleteZernioPost(args.oldPost._id).catch(() => {}) // best-effort cleanup
  return { status, postId }
}

/* ------------------------------------------------------------------ */
/*  Scheduling                                                         */
/* ------------------------------------------------------------------ */

/**
 * Hand a draft to Zernio's scheduler. Verified on the live API: `scheduledFor`
 * (ISO) + `timezone` (IANA) put the post into status "scheduled", and both
 * round-trip on GET. Content is finalised exactly as publishSocialDraft does it,
 * because the scheduler publishes whatever is stored at fire time.
 */
export async function scheduleSocialPost(args: {
  postId: string
  key: PlatformKey
  content: string
  title?: string
  link?: string
  imageUrls?: string[]
  documentUrl?: string
  documentName?: string
  subreddit?: string
  boardId?: string
  /** ISO timestamp; must be in the future. */
  scheduledFor: string
  /** IANA zone the timestamp is interpreted in, e.g. "Australia/Sydney". */
  timezone?: string
}): Promise<{ status: string; scheduledFor?: string }> {
  const spec = platformSpec(args.key)
  if (spec.needsMedia && !args.imageUrls?.length) {
    throw new Error(`${spec.label} requires an image`)
  }
  const body: Record<string, unknown> = {
    content: clampText(args.key === "twitter" ? clampTwitter(args.content) : args.content, spec.limit),
    platforms: [
      platformEntry(spec, {
        title: args.title,
        link: args.link || SITE_BASE,
        subreddit: args.subreddit,
        boardId: args.boardId,
        documentName: args.documentName,
      }),
    ],
    isDraft: false,
    scheduledFor: args.scheduledFor,
    ...(args.timezone ? { timezone: args.timezone } : {}),
  }
  const mediaItems = mediaItemsFor(spec, {
    imageUrls: args.imageUrls,
    documentUrl: args.documentUrl,
    documentName: args.documentName,
  })
  if (mediaItems) body.mediaItems = mediaItems
  const data = await zernioJson<{ post?: { status?: string; scheduledFor?: string } }>(`/posts/${args.postId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
  return { status: data.post?.status ?? "scheduled", scheduledFor: data.post?.scheduledFor }
}

/** Pull a scheduled post back to a draft so it won't fire. Verified live. */
export async function unscheduleSocialPost(postId: string): Promise<void> {
  await zernioJson(`/posts/${postId}`, { method: "PUT", body: JSON.stringify({ isDraft: true }) })
}

/* ------------------------------------------------------------------ */
/*  Analytics                                                          */
/* ------------------------------------------------------------------ */

export interface PostAnalytics {
  impressions: number
  reach: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  views: number
  follows: number
  engagementRate: number
  lastUpdated?: string
}

export interface AnalyticsOverview {
  totalPosts?: number
  publishedPosts?: number
  scheduledPosts?: number
  lastSync?: string
}

/** One published post's performance, joined back to the Zernio record we own. */
export interface AnalyticsRow {
  /** Zernio's analytics id — NOT the post id. */
  analyticsId: string
  /** The post record this belongs to, when it was published through our API. */
  postId?: string
  platform: string
  content: string
  publishedAt?: string
  platformPostUrl?: string
  /** True for posts published outside Zernio (e.g. straight to LinkedIn). */
  external: boolean
  metrics: PostAnalytics
}

interface RawAnalyticsPost {
  _id: string
  latePostId?: string | null
  content?: string
  publishedAt?: string
  platform?: string
  platformPostUrl?: string
  isExternal?: boolean
  analytics?: Partial<PostAnalytics>
  platforms?: Array<{ platform?: string; platformPostUrl?: string; analytics?: Partial<PostAnalytics> }>
}

function metrics(a: Partial<PostAnalytics> | undefined): PostAnalytics {
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0)
  return {
    impressions: n(a?.impressions),
    reach: n(a?.reach),
    likes: n(a?.likes),
    comments: n(a?.comments),
    shares: n(a?.shares),
    saves: n(a?.saves),
    clicks: n(a?.clicks),
    views: n(a?.views),
    follows: n(a?.follows),
    engagementRate: n(a?.engagementRate),
    lastUpdated: typeof a?.lastUpdated === "string" ? a.lastUpdated : undefined,
  }
}

/**
 * Engagement for every published post Zernio can see — including posts made
 * directly on the platforms, which never appear in /posts.
 *
 * Two gotchas, both verified live:
 *  - the join key back to our own posts is `latePostId`, NOT the analytics `_id`;
 *  - `limit` silently returns ZERO rows at 200. Stay at or below 100.
 */
export async function fetchAnalytics(
  limit = 100,
): Promise<{ overview: AnalyticsOverview; rows: AnalyticsRow[] }> {
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const data = await zernioJson<{ overview?: AnalyticsOverview; posts?: RawAnalyticsPost[] }>(
    `/analytics?limit=${safeLimit}`,
  )
  const rows: AnalyticsRow[] = (data.posts ?? []).map((p) => {
    const entry = p.platforms?.[0]
    return {
      analyticsId: p._id,
      postId: p.latePostId ?? undefined,
      platform: p.platform ?? entry?.platform ?? "unknown",
      content: p.content ?? "",
      publishedAt: p.publishedAt,
      platformPostUrl: p.platformPostUrl ?? entry?.platformPostUrl,
      external: Boolean(p.isExternal),
      metrics: metrics(p.analytics ?? entry?.analytics),
    }
  })
  return { overview: data.overview ?? {}, rows }
}

/** Analytics keyed by OUR Zernio post id, for joining onto posts we manage. */
export async function analyticsByPostId(limit = 100): Promise<Record<string, PostAnalytics>> {
  const { rows } = await fetchAnalytics(limit)
  const byId: Record<string, PostAnalytics> = {}
  for (const row of rows) if (row.postId) byId[row.postId] = row.metrics
  return byId
}

/* ------------------------------------------------------------------ */
/*  Pipeline entry point (best-effort, used by generate + webhooks)    */
/* ------------------------------------------------------------------ */

export interface SocialDraft {
  postId: string
  reviewUrl: string
}

/**
 * Auto-drafting is OFF by default: every blog used to spawn nine drafts nobody
 * asked for, and almost none were published. Social posts are written on
 * demand from the portal's social panel instead. Set BLOG_AUTO_SOCIAL_DRAFTS=1
 * to bring the automatic drafts back. (Mirrors marketa-monorepo, where the
 * blog pipeline actually runs.)
 */
function autoSocialDraftsEnabled(): boolean {
  const v = (process.env.BLOG_AUTO_SOCIAL_DRAFTS || "").trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes"
}

/**
 * Generate captions and create one Zernio draft per platform for a freshly
 * generated blog. Returns the dashboard URL for Slack buttons, or null when
 * auto-drafting is off or the integration isn't configured. Never throws for
 * per-platform failures — only when nothing could be created at all.
 */
export async function createSocialDraftsForBlog(args: {
  source: SocialSource
  title: string
  excerpt?: string
  body?: string
  industry?: string
  targetKeyword?: string
  blogUrl?: string
  imageUrl?: string
}): Promise<SocialDraft | null> {
  if (!autoSocialDraftsEnabled()) return null
  if (!apiKey()) return null

  const captions = await generateSocialCaptions({
    title: args.title,
    excerpt: args.excerpt,
    body: args.body,
    industry: args.industry,
    targetKeyword: args.targetKeyword,
    blogUrl: args.blogUrl,
  })
  const results = await createSocialDrafts({
    target: { kind: "blog", source: args.source },
    blogTitle: args.title,
    captions,
    imageUrls: args.imageUrl ? [args.imageUrl] : undefined,
    blogUrl: args.blogUrl,
  })
  const failures = results.filter((r) => r.error)
  for (const f of failures) console.error(`[zernio] ${f.key} draft failed:`, f.error)
  const firstOk = results.find((r) => r.postId)
  if (!firstOk) throw new Error(`Zernio drafts failed for every platform: ${failures[0]?.error ?? "unknown"}`)
  return { postId: firstOk.postId!, reviewUrl: DASHBOARD_URL }
}

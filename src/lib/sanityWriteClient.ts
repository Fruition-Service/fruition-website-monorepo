/**
 * Sanity write helpers used by /api/internal/onboarding.
 * Kept separate from src/sanity/client.ts so the read-only client can
 * stay `useCdn: true`.
 */

import { fetchRemoteImage, isSanityImageUrl } from "@/lib/remoteImage"
import { parseInlineMarkdown } from "@/lib/inlineMarkdown"

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

function getToken(): string {
  const t = process.env.SANITY_WRITE_TOKEN
  if (!t) throw new Error("SANITY_WRITE_TOKEN missing")
  return t
}

function base(): string {
  if (!PROJECT_ID || !DATASET) throw new Error("Sanity project id / dataset missing")
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
}

export async function uploadImageAsset(
  bytes: ArrayBuffer | Uint8Array,
  mime: string,
  filename: string,
): Promise<string> {
  const ext = (mime.split("/")[1] ?? "jpg").split(";")[0]
  const url = `${base()}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}.${ext}`
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      Authorization: `Bearer ${getToken()}`,
    },
    body: u8 as unknown as BodyInit,
  })
  if (!r.ok) throw new Error(`sanity asset upload ${r.status} ${await r.text()}`)
  const j = (await r.json()) as { document?: { _id?: string } }
  const id = j.document?._id
  if (!id) throw new Error("sanity asset upload returned no _id")
  return id
}

/**
 * Upload a non-image asset (a PDF for a LinkedIn carousel, today) and return
 * its public CDN URL.
 *
 * Zernio takes documents by URL, so the file has to live somewhere it can
 * reach — Sanity's file assets are already public and already where the
 * portal's social images go, which keeps one store rather than two.
 */
export async function uploadFileAsset(
  bytes: ArrayBuffer | Uint8Array,
  mime: string,
  filename: string,
): Promise<{ id: string; url: string }> {
  const url = `${base()}/assets/files/${DATASET}?filename=${encodeURIComponent(filename)}`
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      Authorization: `Bearer ${getToken()}`,
    },
    body: u8 as unknown as BodyInit,
  })
  if (!r.ok) throw new Error(`sanity file upload ${r.status} ${await r.text()}`)
  const j = (await r.json()) as { document?: { _id?: string; url?: string } }
  const id = j.document?._id
  const assetUrl = j.document?.url
  if (!id || !assetUrl) throw new Error("sanity file upload returned no url")
  return { id, url: assetUrl }
}

/**
 * Upload a large asset by STREAMING the request body straight through to
 * Sanity, without ever holding it in memory.
 *
 * The portal runs as a single Cloudflare Worker with 128 MB of memory, and the
 * buffered path costs roughly twice the file: once to read it, once to copy it
 * into a Buffer. That is fine for a 5 MB image and hopeless for a video, so a
 * video goes through here instead — the body arrives as a stream and leaves as
 * one, which is why this takes a ReadableStream rather than bytes.
 *
 * `duplex: "half"` is required by the fetch spec for any streaming request
 * body; omitting it throws before a single byte moves.
 */
export async function uploadFileStream(
  body: ReadableStream<Uint8Array>,
  mime: string,
  filename: string,
): Promise<{ id: string; url: string }> {
  const url = `${base()}/assets/files/${DATASET}?filename=${encodeURIComponent(filename)}`
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      Authorization: `Bearer ${getToken()}`,
    },
    body,
    // Not in the DOM lib's RequestInit yet, but required at runtime.
    duplex: "half",
  } as RequestInit & { duplex: "half" })
  if (!r.ok) throw new Error(`sanity file upload ${r.status} ${await r.text()}`)
  const j = (await r.json()) as { document?: { _id?: string; url?: string } }
  const id = j.document?._id
  const assetUrl = j.document?.url
  if (!id || !assetUrl) throw new Error("sanity file upload returned no url")
  return { id, url: assetUrl }
}

export interface CreateTeamMemberInput {
  docId: string
  name: string
  role: string
  regions: string[]
  bio?: string
  emoji?: string
  linkedinUrl?: string
  photoAssetId?: string
  order?: number
}

function buildTeamMemberDoc(input: CreateTeamMemberInput): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: input.docId,
    _type: "teamMember",
    name: input.name,
    role: input.role,
    regions: input.regions,
    order: input.order ?? 9999,
  }
  if (input.bio) doc.bio = input.bio
  if (input.emoji) doc.emoji = input.emoji
  if (input.linkedinUrl) doc.linkedinUrl = input.linkedinUrl
  if (input.photoAssetId) {
    doc.photo = { _type: "image", asset: { _type: "reference", _ref: input.photoAssetId } }
  }
  return doc
}

async function mutate(mutations: unknown[]): Promise<void> {
  const r = await fetch(`${base()}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`sanity mutate ${r.status} ${await r.text()}`)
}

export async function createTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ create: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}

export async function upsertTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ createOrReplace: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}

/**
 * Partial update of an existing document — only the given fields change
 * (unlike createOrReplace, which drops everything not re-sent, e.g. a team
 * member's photo). `unsetFields` removes fields entirely.
 */
export async function patchDocument(
  docId: string,
  set: Record<string, unknown>,
  unsetFields: string[] = [],
): Promise<void> {
  const patch: Record<string, unknown> = { id: docId }
  if (Object.keys(set).length > 0) patch.set = set
  if (unsetFields.length > 0) patch.unset = unsetFields
  await mutate([{ patch }])
}

/** Delete a document by id (e.g. unpublish a blog post, remove a team member). */
export async function deleteDocument(docId: string): Promise<void> {
  await mutate([{ delete: { id: docId } }])
}

export interface UpsertBlogPostInput {
  /** Stable doc id, e.g. `blog-monday-<pulseId>`. Allows re-publish to update in place. */
  docId: string
  title: string
  /** Markdown body. See bodyToPortableText for the supported subset. */
  body: string
  slug?: string
  excerpt?: string
  industry?: string
  author?: string
  seoKeyword?: string
  seoTitle?: string
  seoDescription?: string
  coverImageAssetId?: string
  /** _ids of blogCategory documents to reference. */
  categoryIds?: string[]
  mondayItemId?: string
  publishedAt?: string
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

interface PortableTextSpan {
  _type: "span"
  _key: string
  text: string
  marks: string[]
}

interface LinkMarkDef {
  _key: string
  _type: "link"
  href: string
}

interface PortableTextBlock {
  _type: "block"
  _key: string
  style: string
  markDefs: LinkMarkDef[]
  children: PortableTextSpan[]
  /** Present only for list items — "bullet" or "number". */
  listItem?: "bullet" | "number"
  /** Nesting level for list items (1-based). */
  level?: number
}

interface VideoEmbedBlock {
  _type: "videoEmbed"
  _key: string
  url: string
}

interface TableRow {
  _type: "tableRow"
  _key: string
  cells: string[]
}

interface TableBlock {
  _type: "table"
  _key: string
  rows: TableRow[]
}

interface ImageBlock {
  _type: "image"
  _key: string
  asset: { _type: "reference"; _ref: string }
  alt?: string
}

type BodyBlock = PortableTextBlock | VideoEmbedBlock | TableBlock | ImageBlock

/**
 * If a line is a lone markdown image pointing at the Sanity CDN, return the
 * asset reference (`image-<hash>-<WxH>-<fmt>`) + alt. Round-trips body images
 * on posts loaded back into the editor via portableTextToMarkdown.
 */
function loneSanityImage(line: string): { ref: string; alt: string } | null {
  const img = loneMarkdownImage(line)
  if (!img) return null
  // Tolerate a transform query string (`?w=800`) — the asset id is the path.
  const m = /^https:\/\/cdn\.sanity\.io\/images\/[^/?]+\/[^/?]+\/([A-Za-z0-9]+)-(\d+x\d+)\.([a-z0-9]+)(?:\?.*)?$/.exec(
    img.url,
  )
  if (!m) return null
  return { ref: `image-${m[1]}-${m[2]}-${m[3]}`, alt: img.alt }
}

/**
 * If a line is nothing but a markdown image, return its alt + URL. Used both
 * to recognise Sanity body images and to spot the remote ones that need
 * side-loading before publish (see sideloadBodyImages).
 */
export function loneMarkdownImage(line: string): { alt: string; url: string } | null {
  const m = /^!\[([^\]]*)\]\(\s*(\S+?)(?:\s+["'(][^)]*)?\s*\)$/.exec(line.trim())
  if (!m) return null
  return { alt: m[1].trim(), url: m[2].trim() }
}

/**
 * If a line is nothing but a YouTube / Vimeo / Twitch / Loom URL, return that
 * URL so it can be rendered as an inline video block. Otherwise null (text).
 */
function loneVideoUrl(line: string): string | null {
  if (/\s/.test(line)) return null
  if (!/^https?:\/\//i.test(line)) return null
  return /(?:youtube\.com|youtu\.be|vimeo\.com|loom\.com|twitch\.tv)/i.test(line) ? line : null
}

/** Split one GFM table row into trimmed cell strings, honouring `\|` escapes. */
function splitTableRow(line: string): string[] {
  let s = line.trim()
  if (s.startsWith("|")) s = s.slice(1)
  if (s.endsWith("|")) s = s.slice(0, -1)
  return s.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"))
}

/** True for a GFM header/body separator like `| --- | :--: |`. */
function isTableSeparator(line: string): boolean {
  const s = line.trim()
  if (!s.includes("-") || !s.includes("|")) return false
  return /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/.test(s)
}

/** A table starts on a pipe row immediately followed by a separator row. */
function isTableStart(line: string, next: string | undefined): boolean {
  return line.includes("|") && next !== undefined && isTableSeparator(next)
}

let keyCounter = 0
function nextKey(): string {
  keyCounter += 1
  return `k${Date.now().toString(36)}${keyCounter.toString(36)}`
}

function span(text: string, marks: string[]): PortableTextSpan {
  return { _type: "span", _key: nextKey(), text, marks }
}

/**
 * Parse a single line of inline markdown into Portable Text spans + link
 * markDefs, using the same tokenizer the blog renderer uses on table cells
 * (src/lib/inlineMarkdown.ts) so the two can never drift apart.
 */
function parseInline(text: string): { children: PortableTextSpan[]; markDefs: LinkMarkDef[] } {
  const markDefs: LinkMarkDef[] = []
  const children: PortableTextSpan[] = []
  for (const run of parseInlineMarkdown(text)) {
    if (run.href) {
      const key = nextKey()
      markDefs.push({ _key: key, _type: "link", href: run.href })
      children.push(span(run.text, [key]))
      continue
    }
    const marks: string[] = []
    if (run.strong) marks.push("strong")
    if (run.em) marks.push("em")
    children.push(span(run.text, marks))
  }
  // A block must always have at least one child span.
  if (children.length === 0) children.push(span("", []))
  return { children, markDefs }
}

function makeBlock(
  style: string,
  text: string,
  extra?: Pick<PortableTextBlock, "listItem" | "level">,
): PortableTextBlock {
  const { children, markDefs } = parseInline(text)
  return { _type: "block", _key: nextKey(), style, markDefs, children, ...extra }
}

/**
 * Markdown → Portable Text conversion for the internal blog editor.
 *
 * Supports (matching the marks/styles rendered by BlogPostTemplate.tsx):
 *   - Headings `#`..`####` → h1..h4
 *   - Blockquotes (`> `)
 *   - Bullet lists (`- ` / `* `) and numbered lists (`1. ` / `1) `)
 *   - Inline `**bold**`/`__bold__`, `*italic*`/`_italic_`, `[text](url)` links
 *   - Blank-line-separated paragraphs (soft-wrapped lines are joined)
 *   - GFM pipe tables (header row + `---` separator) → a `table` block
 *
 * Nested lists are out of scope; raw HTML passes through as plain text. Body
 * images become `image` blocks only from lone `![alt](sanity-cdn-url)` lines
 * (see loneSanityImage); run sideloadBodyImages first so images hosted
 * elsewhere are pulled into Sanity rather than dropped. The cover image is
 * handled separately.
 */
export function bodyToPortableText(body: string): BodyBlock[] {
  const blocks: BodyBlock[] = []
  const lines = body.replace(/\r\n/g, "\n").split("\n")
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    const text = paragraph.join(" ").trim()
    if (text) blocks.push(makeBlock("normal", text))
    paragraph = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      flushParagraph()
      continue
    }
    // GFM pipe table: a header row + a `---` separator, then body rows.
    if (isTableStart(line, lines[i + 1]?.trim())) {
      flushParagraph()
      const rows: TableRow[] = [{ _type: "tableRow", _key: nextKey(), cells: splitTableRow(line) }]
      let k = i + 2
      while (k < lines.length) {
        const rowLine = lines[k].trim()
        if (!rowLine || !rowLine.includes("|")) break
        rows.push({ _type: "tableRow", _key: nextKey(), cells: splitTableRow(rowLine) })
        k++
      }
      // Keep the grid rectangular (pad / truncate body rows to the header width).
      const cols = rows[0].cells.length
      for (const r of rows) {
        if (r.cells.length < cols) {
          r.cells = [...r.cells, ...Array(cols - r.cells.length).fill("")]
        } else if (r.cells.length > cols) {
          r.cells = r.cells.slice(0, cols)
        }
      }
      blocks.push({ _type: "table", _key: nextKey(), rows })
      i = k - 1
      continue
    }
    const videoUrl = loneVideoUrl(line)
    if (videoUrl) {
      flushParagraph()
      blocks.push({ _type: "videoEmbed", _key: nextKey(), url: videoUrl })
      continue
    }
    const image = loneSanityImage(line)
    if (image) {
      flushParagraph()
      blocks.push({
        _type: "image",
        _key: nextKey(),
        asset: { _type: "reference", _ref: image.ref },
        ...(image.alt ? { alt: image.alt } : {}),
      })
      continue
    }
    // A lone markdown image that isn't a Sanity asset — sideloadBodyImages
    // either failed to re-host it or was never run. parseInline would turn it
    // into a stray `!` followed by a link on the live post (the bug on
    // monday item 2836162069), so leave it out entirely.
    if (loneMarkdownImage(line)) {
      flushParagraph()
      continue
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      blocks.push(makeBlock(`h${heading[1].length}`, heading[2]))
      continue
    }
    const quote = /^>\s+(.*)$/.exec(line)
    if (quote) {
      flushParagraph()
      blocks.push(makeBlock("blockquote", quote[1]))
      continue
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      flushParagraph()
      blocks.push(makeBlock("normal", bullet[1], { listItem: "bullet", level: 1 }))
      continue
    }
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line)
    if (numbered) {
      flushParagraph()
      blocks.push(makeBlock("normal", numbered[1], { listItem: "number", level: 1 }))
      continue
    }
    paragraph.push(line)
  }
  flushParagraph()
  return blocks
}

/**
 * Sanity asset id → its public CDN URL. A twin of the helper in
 * portableTextToMarkdown.ts; kept local so this file mirrors into
 * marketa-monorepo without dragging that module along.
 */
function assetIdToUrl(ref: string): string | null {
  const m = /^image-([A-Za-z0-9]+)-(\d+x\d+)-([a-z0-9]+)$/.exec(ref)
  if (!m || !PROJECT_ID || !DATASET) return null
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`
}

export interface SideloadResult {
  /** The body with every re-hosted image line rewritten to its Sanity URL. */
  body: string
  /** Images we could not fetch — the caller shows these to the publisher. */
  warnings: string[]
  /** How many images were pulled into Sanity. */
  rehosted: number
}

/**
 * Re-host every remote body image into Sanity, in place.
 *
 * bodyToPortableText only turns a lone `![alt](url)` line into an `image`
 * block when the URL is a Sanity CDN asset; anything else used to fall through
 * to parseInline and render as a stray `!` plus a link on the live post. AI
 * drafts routinely reference images on other CDNs, and pasting one in from
 * another tab does the same — so pull the bytes in before the conversion runs
 * and rewrite the line.
 *
 * Failures are reported, never fatal: one dead external URL should not block a
 * publish, and the line is dropped rather than published as a broken link.
 */
export async function sideloadBodyImages(body: string): Promise<SideloadResult> {
  const lines = body.replace(/\r\n/g, "\n").split("\n")
  const warnings: string[] = []
  // The same image often appears twice in a post; upload it once.
  const seen = new Map<string, string | null>()
  let rehosted = 0

  for (let i = 0; i < lines.length; i++) {
    const img = loneMarkdownImage(lines[i].trim())
    if (!img || !img.url || isSanityImageUrl(img.url)) continue

    if (!seen.has(img.url)) {
      try {
        const remote = await fetchRemoteImage(img.url)
        const assetId = await uploadImageAsset(remote.bytes, remote.mime, `blog-body-${remote.stem}`)
        const url = assetIdToUrl(assetId)
        if (!url) throw new Error(`unexpected asset id from Sanity: ${assetId}`)
        seen.set(img.url, url)
        rehosted++
      } catch (err) {
        seen.set(img.url, null)
        warnings.push(
          `Image left out — ${img.url}: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }

    const hosted = seen.get(img.url)
    if (hosted) {
      const alt = img.alt.replace(/[[\]\n]/g, " ").replace(/\s+/g, " ").trim()
      lines[i] = `![${alt}](${hosted})`
    }
  }

  return { body: lines.join("\n"), warnings, rehosted }
}

function buildBlogPostDoc(input: UpsertBlogPostInput): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: input.docId,
    _type: "blogPost",
    title: input.title,
    slug: { _type: "slug", current: input.slug || slugify(input.title) },
    body: bodyToPortableText(input.body),
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    author: input.author ?? "Fruition Editorial",
  }
  if (input.excerpt) doc.excerpt = input.excerpt
  if (input.industry) doc.industry = input.industry
  if (input.seoKeyword) doc.seoKeyword = input.seoKeyword
  if (input.seoTitle) doc.seoTitle = input.seoTitle
  if (input.seoDescription) doc.seoDescription = input.seoDescription
  if (input.categoryIds && input.categoryIds.length > 0) {
    doc.categories = input.categoryIds.map((id) => ({
      _type: "reference",
      _key: nextKey(),
      _ref: id,
    }))
  }
  if (input.mondayItemId) doc.mondayItemId = input.mondayItemId
  if (input.coverImageAssetId) {
    doc.coverImage = {
      _type: "image",
      asset: { _type: "reference", _ref: input.coverImageAssetId },
    }
  }
  return doc
}

/**
 * Run a GROQ query against the live API (not the CDN) with the write token, so
 * reads taken around a mutation see the just-written state.
 */
async function groq<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const search = new URLSearchParams({ query })
  for (const [k, v] of Object.entries(params)) search.set(`$${k}`, JSON.stringify(v))
  const r = await fetch(`${base()}/data/query/${DATASET}?${search.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!r.ok) throw new Error(`sanity query ${r.status} ${await r.text()}`)
  return ((await r.json()) as { result?: T }).result as T
}

/** The live post's id + current slug, or null when the document doesn't exist. */
async function getExistingBlogPost(
  docId: string,
): Promise<{ _id: string; slug: string | null } | null> {
  return groq<{ _id: string; slug: string | null } | null>(
    `*[_id == $id][0]{ _id, "slug": slug.current }`,
    { id: docId },
  )
}

/** Slug + byline of a live post, read fresh — enough to flush its cached pages. */
export async function getBlogPostCacheKeys(
  docId: string,
): Promise<{ slug: string | null; author: string | null } | null> {
  return groq<{ slug: string | null; author: string | null } | null>(
    `*[_id == $id][0]{ "slug": slug.current, author }`,
    { id: docId },
  )
}

/**
 * Find the published post that owns a slug — the link between a portal draft
 * and the live document when the draft has no recorded doc id (posts migrated
 * in, published by Marketa, or created straight in the Studio).
 */
export async function findBlogPostIdBySlug(slug: string): Promise<string | null> {
  if (!slug) return null
  const found = await groq<{ _id: string } | null>(
    `*[_type == "blogPost" && slug.current == $slug] | order(_createdAt asc) [0]{ _id }`,
    { slug },
  )
  return found?._id ?? null
}

export async function upsertBlogPost(
  input: UpsertBlogPostInput,
): Promise<{ id: string; slug: string; previousSlug?: string; created: boolean }> {
  const slug = input.slug || slugify(input.title)
  const existing = await getExistingBlogPost(input.docId)

  // A second document on the same slug is invisible in the worst way: the site
  // resolves /post/<slug> to whichever doc GROQ returns first, so the edit
  // "publishes" and nothing on the page changes. Refuse it instead.
  const slugOwner = await findBlogPostIdBySlug(slug)
  if (slugOwner && slugOwner !== input.docId) {
    throw new Error(
      `/post/${slug} already belongs to another post (${slugOwner}). Change the slug, or edit that post instead.`,
    )
  }

  // Republishing an existing post must PATCH, not replace: createOrReplace
  // would drop every field the editor doesn't resend — the cover image (when
  // no new file was uploaded), legacy fields like videoUrls/mainImage, etc.
  if (existing) {
    const set: Record<string, unknown> = {
      title: input.title,
      slug: { _type: "slug", current: slug },
      body: bodyToPortableText(input.body),
      author: input.author ?? "Fruition Editorial",
    }
    // Optional fields only overwrite when the editor sent a value; an edit
    // without an explicit publish date keeps the original one.
    if (input.publishedAt) set.publishedAt = input.publishedAt
    if (input.excerpt) set.excerpt = input.excerpt
    if (input.industry) set.industry = input.industry
    if (input.seoKeyword) set.seoKeyword = input.seoKeyword
    if (input.seoTitle) set.seoTitle = input.seoTitle
    if (input.seoDescription) set.seoDescription = input.seoDescription
    if (input.mondayItemId) set.mondayItemId = input.mondayItemId
    if (input.categoryIds && input.categoryIds.length > 0) {
      set.categories = input.categoryIds.map((id) => ({
        _type: "reference",
        _key: nextKey(),
        _ref: id,
      }))
    }
    if (input.coverImageAssetId) {
      set.coverImage = {
        _type: "image",
        asset: { _type: "reference", _ref: input.coverImageAssetId },
      }
    }
    await patchDocument(input.docId, set)
    return {
      id: input.docId,
      slug,
      previousSlug: existing.slug ?? undefined,
      created: false,
    }
  }

  const doc = buildBlogPostDoc(input)
  await mutate([{ createOrReplace: doc }])
  return { id: input.docId, slug, created: true }
}

/**
 * Internal linking planner for blog post bodies (Portable Text).
 *
 * Pure logic, no I/O. The CLI in `scripts/internal-links/` fetches posts from
 * Sanity, runs `planInternalLinks` over each body and either reports or
 * patches. Given the same input it always returns the same output, and running
 * it over its own output adds nothing (see the idempotency rules below).
 *
 * Inserted links are plain `link` annotations with a relative href, the same
 * shape editors already create, so they render with the existing in-prose link
 * style in `BlogPostTemplate`.
 */

export type InternalLinkTarget = {
  /** Internal URL, must start with "/". */
  path: string
  /** Phrases to link, most specific first. Matching is case-insensitive. */
  keywords: string[]
  /** Why this page matters. Report only. */
  note?: string
  /** Let single generic words (see GENERIC_KEYWORDS) through for this target. */
  allowGeneric?: boolean
  /** Other paths (old URLs, redirects) that count as "already linked" for this target. */
  aliases?: string[]
}

export type PtSpan = {
  _type: "span"
  _key: string
  text: string
  marks?: string[]
  [key: string]: unknown
}

export type PtMarkDef = {
  _key: string
  _type: string
  href?: string
  [key: string]: unknown
}

export type PtBlock = {
  _type: string
  _key?: string
  style?: string
  listItem?: string
  children?: Array<PtSpan | { _type: string; _key?: string; [key: string]: unknown }>
  markDefs?: PtMarkDef[]
  [key: string]: unknown
}

export type AddedLink = {
  keyword: string
  targetPath: string
  anchorText: string
  blockIndex: number
  style: string
  /** Short plain-text snippet around the anchor, anchor in [brackets]. */
  before: string
}

export type SkipReason =
  | "self-link"
  | "already-linked-target"
  | "generic-keyword"
  | "heading"
  | "blockquote"
  | "cta-list-item"
  | "first-paragraph"
  | "inside-existing-link"
  | "cross-span"
  | "target-used"
  | "anchor-used"
  | "overlap"
  | "cap"

export type PlanResult = {
  blocks: PtBlock[]
  added: AddedLink[]
  skipped: Partial<Record<SkipReason, number>>
}

export type PlanOptions = {
  blocks: PtBlock[]
  /** The document's own path, e.g. "/post/my-slug". Used for the self-link guard. */
  docPath: string
  targets: InternalLinkTarget[]
  /** Max links inserted per document. Default 5, clamped to 3..5. */
  maxLinks?: number
  /** Skip the first normal paragraph. Default false. */
  skipFirstParagraph?: boolean
}

/** Single words and stock phrases that make noisy anchors. */
export const GENERIC_KEYWORDS: ReadonlySet<string> = new Set([
  "services",
  "service",
  "contact",
  "team",
  "about",
  "blog",
  "insights",
  "read more",
  "learn more",
  "get started",
  "book a call",
  "ours",
  "solutions",
  "monday",
  "ai",
])

export const DEFAULT_MAX_LINKS = 5
export const MIN_MAX_LINKS = 3
export const MAX_MAX_LINKS = 5

export function clampMaxLinks(n: number | undefined): number {
  if (n === undefined || !Number.isFinite(n)) return DEFAULT_MAX_LINKS
  return Math.min(MAX_MAX_LINKS, Math.max(MIN_MAX_LINKS, Math.floor(n)))
}

const SITE_ORIGIN = /^https?:\/\/(?:www\.)?fruitionservices\.io(?=\/|$|[?#])/i

/**
 * Normalise an href to a comparable site path: lowercase, no origin (for our
 * own domain), no query, no hash, no trailing slash. Returns null for
 * external or non-path hrefs.
 */
export function normalizePath(href: string | undefined | null): string | null {
  if (!href) return null
  let h = href.trim().replace(SITE_ORIGIN, "")
  if (h === "") h = "/"
  if (!h.startsWith("/")) return null
  h = h.split("#")[0].split("?")[0].toLowerCase()
  if (h.length > 1) h = h.replace(/\/+$/, "")
  return h || "/"
}

const LINK_MARK_TYPES = new Set(["link", "internalLink"])

function markDefPath(def: PtMarkDef): string | null {
  if (def._type === "link") return normalizePath(def.href)
  if (def._type === "internalLink") {
    const slug = (def as { slug?: { current?: string } }).slug?.current
    return slug ? normalizePath(`/${slug}`) : null
  }
  return null
}

function isSpan(child: unknown): child is PtSpan {
  return (
    typeof child === "object" &&
    child !== null &&
    (child as { _type?: unknown })._type === "span" &&
    typeof (child as { text?: unknown }).text === "string"
  )
}

function linkMarkKeys(block: PtBlock): Set<string> {
  const keys = new Set<string>()
  for (const d of block.markDefs ?? []) if (LINK_MARK_TYPES.has(d._type)) keys.add(d._key)
  return keys
}

function blockText(block: PtBlock): string {
  return (block.children ?? []).map((c) => (isSpan(c) ? c.text : "")).join("")
}

const HEADING_STYLES = new Set(["h1", "h2", "h3", "h4", "h5", "h6"])
const CTA_PATTERN =
  /(?<![\p{L}\p{N}_])(?:book|contact|get started|learn more|talk to|download|request|schedule|call us|sign up)(?![\p{L}\p{N}_])/iu

function wordCount(text: string): number {
  const t = text.trim()
  return t ? t.split(/\s+/u).length : 0
}

/** A short list item with a call-to-action verb ("Book a call with us"). */
export function isCtaListItem(block: PtBlock): boolean {
  if (!block.listItem) return false
  const text = blockText(block)
  return wordCount(text) <= 12 && CTA_PATTERN.test(text)
}

type BlockVerdict = "ok" | Extract<SkipReason, "heading" | "blockquote" | "cta-list-item">

function blockVerdict(block: PtBlock): BlockVerdict | "not-text" {
  if (block._type !== "block") return "not-text"
  const style = block.style ?? "normal"
  if (HEADING_STYLES.has(style)) return "heading"
  if (style === "blockquote") return "blockquote"
  if (style !== "normal") return "heading"
  if (isCtaListItem(block)) return "cta-list-item"
  return "ok"
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Whole-word, case-insensitive matcher for a keyword. Boundaries are Unicode
 * aware, so "CRM" does not match "CRMs" or "scrum" and "AI" does not match
 * "said". Spaces in a keyword match any run of whitespace, including NBSP.
 */
export function keywordRegExp(keyword: string): RegExp {
  const body = keyword
    .trim()
    .split(/\s+/u)
    .map(escapeRegExp)
    .join("[\\s\\u00a0]+")
  return new RegExp(`(?<![\\p{L}\\p{N}_])${body}(?![\\p{L}\\p{N}_])`, "giu")
}

function isGeneric(keyword: string): boolean {
  return GENERIC_KEYWORDS.has(keyword.trim().toLowerCase().replace(/\s+/g, " "))
}

/**
 * Existing links in a body: normalised target paths and lowercased anchor texts.
 */
function existingLinks(blocks: PtBlock[]): { paths: Set<string>; anchors: Set<string> } {
  const paths = new Set<string>()
  const anchors = new Set<string>()
  for (const block of blocks) {
    if (block._type !== "block") continue
    const defs = new Map<string, PtMarkDef>()
    for (const d of block.markDefs ?? []) if (LINK_MARK_TYPES.has(d._type)) defs.set(d._key, d)
    const textByKey = new Map<string, string>()
    for (const child of block.children ?? []) {
      if (!isSpan(child)) continue
      for (const m of child.marks ?? []) {
        if (defs.has(m)) textByKey.set(m, (textByKey.get(m) ?? "") + child.text)
      }
    }
    for (const [key, text] of textByKey) {
      const p = markDefPath(defs.get(key)!)
      if (p) paths.add(p)
      const a = text.trim().toLowerCase()
      if (a) anchors.add(a)
    }
  }
  return { paths, anchors }
}

/**
 * Number of links per normalised target path in a body. A link counts once
 * per annotation that at least one span uses.
 */
export function countLinksPerTarget(blocks: PtBlock[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const block of blocks) {
    if (block._type !== "block") continue
    const used = new Set<string>()
    for (const child of block.children ?? []) {
      if (isSpan(child)) for (const m of child.marks ?? []) used.add(m)
    }
    for (const d of block.markDefs ?? []) {
      if (!LINK_MARK_TYPES.has(d._type) || !used.has(d._key)) continue
      const p = markDefPath(d)
      if (p) counts[p] = (counts[p] ?? 0) + 1
    }
  }
  return counts
}

type Candidate = {
  blockIndex: number
  childIndex: number
  /** Offsets inside the span's text. */
  start: number
  end: number
  /** Offset inside the block's plain text, for ordering and snippets. */
  blockOffset: number
  target: InternalLinkTarget
  targetPath: string
  keyword: string
}

function snippet(text: string, start: number, end: number, radius = 40): string {
  const from = Math.max(0, start - radius)
  const to = Math.min(text.length, end + radius)
  const pre = (from > 0 ? "..." : "") + text.slice(from, start)
  const post = text.slice(end, to) + (to < text.length ? "..." : "")
  return `${pre}[${text.slice(start, end)}]${post}`.replace(/\s+/g, " ").trim()
}

function collectKeys(blocks: PtBlock[]): Set<string> {
  const keys = new Set<string>()
  for (const b of blocks) {
    if (b._key) keys.add(b._key)
    for (const c of b.children ?? []) if (c._key) keys.add(c._key)
    for (const d of b.markDefs ?? []) if (d._key) keys.add(d._key)
  }
  return keys
}

/**
 * Plan (and apply, immutably) internal links for one document body.
 *
 * Rules: whole-word case-insensitive matches with the original casing kept as
 * anchor text; longest match first, then earliest; at most one link per
 * target and per anchor text; a capped total; never in headings, blockquotes,
 * tables, images, existing links or CTA-like list items; never to the
 * document itself or to a target the body already links to. Links the body
 * already has to configured targets count toward the cap.
 */
export function planInternalLinks(opts: PlanOptions): PlanResult {
  const { blocks, targets } = opts
  const maxLinks = clampMaxLinks(opts.maxLinks)
  const selfPath = normalizePath(opts.docPath)
  const skipped: Partial<Record<SkipReason, number>> = {}
  const skip = (r: SkipReason, n = 1) => {
    skipped[r] = (skipped[r] ?? 0) + n
  }

  const existing = existingLinks(blocks)

  // Targets that may be linked at all from this document. Targets the body
  // already links to count toward the cap, so a rerun over our own output
  // cannot add more links once a document is full.
  const active: Array<{ target: InternalLinkTarget; path: string; keywords: string[] }> = []
  let alreadyLinkedTargets = 0
  for (const target of targets) {
    const path = normalizePath(target.path)
    if (!path) continue
    if (path === selfPath) {
      skip("self-link")
      continue
    }
    const aliases = (target.aliases ?? []).map(normalizePath).filter((p): p is string => !!p)
    if (existing.paths.has(path) || aliases.some((a) => existing.paths.has(a))) {
      alreadyLinkedTargets++
      skip("already-linked-target")
      continue
    }
    const keywords: string[] = []
    for (const k of target.keywords) {
      if (!k.trim()) continue
      if (!target.allowGeneric && isGeneric(k)) {
        skip("generic-keyword")
        continue
      }
      keywords.push(k)
    }
    if (keywords.length) active.push({ target, path, keywords })
  }

  // Index of the first normal paragraph, when it should be left alone.
  let firstParagraph = -1
  if (opts.skipFirstParagraph) {
    firstParagraph = blocks.findIndex(
      (b) => b._type === "block" && (b.style ?? "normal") === "normal" && !b.listItem,
    )
  }

  const candidates: Candidate[] = []
  const matchers = active.map((a) => ({ ...a, regs: a.keywords.map((k) => ({ k, re: keywordRegExp(k) })) }))

  blocks.forEach((block, blockIndex) => {
    const verdict = blockVerdict(block)
    if (verdict === "not-text") return
    const text = blockText(block)
    if (!text) return

    // Map block-text offsets to children.
    const children = block.children ?? []
    const ranges: Array<{ childIndex: number; start: number; end: number }> = []
    let pos = 0
    children.forEach((c, childIndex) => {
      if (!isSpan(c)) return
      ranges.push({ childIndex, start: pos, end: pos + c.text.length })
      pos += c.text.length
    })
    const linkKeys = linkMarkKeys(block)

    for (const m of matchers) {
      for (const { k, re } of m.regs) {
        re.lastIndex = 0
        for (const hit of text.matchAll(re)) {
          const start = hit.index ?? 0
          const end = start + hit[0].length
          if (verdict !== "ok") {
            skip(verdict)
            continue
          }
          if (blockIndex === firstParagraph) {
            skip("first-paragraph")
            continue
          }
          const range = ranges.find((r) => start >= r.start && end <= r.end)
          if (!range) {
            skip("cross-span")
            continue
          }
          const span = children[range.childIndex] as PtSpan
          if ((span.marks ?? []).some((mk) => linkKeys.has(mk))) {
            skip("inside-existing-link")
            continue
          }
          candidates.push({
            blockIndex,
            childIndex: range.childIndex,
            start: start - range.start,
            end: end - range.start,
            blockOffset: start,
            target: m.target,
            targetPath: m.target.path,
            keyword: k,
          })
        }
      }
    }
  })

  // Longest match first, then earliest position.
  candidates.sort(
    (a, b) =>
      b.end - b.start - (a.end - a.start) ||
      a.blockIndex - b.blockIndex ||
      a.blockOffset - b.blockOffset,
  )

  const chosen: Candidate[] = []
  const usedTargets = new Set<string>()
  const usedAnchors = new Set(existing.anchors)
  for (const c of candidates) {
    const span = blocks[c.blockIndex].children![c.childIndex] as PtSpan
    const anchor = span.text.slice(c.start, c.end)
    const overlaps = chosen.some(
      (o) => o.blockIndex === c.blockIndex && o.blockOffset < c.blockOffset + (c.end - c.start) && c.blockOffset < o.blockOffset + (o.end - o.start),
    )
    if (overlaps) {
      skip("overlap")
      continue
    }
    if (usedTargets.has(normalizePath(c.targetPath)!)) {
      skip("target-used")
      continue
    }
    if (usedAnchors.has(anchor.trim().toLowerCase())) {
      skip("anchor-used")
      continue
    }
    if (alreadyLinkedTargets + chosen.length >= maxLinks) {
      skip("cap")
      continue
    }
    chosen.push(c)
    usedTargets.add(normalizePath(c.targetPath)!)
    usedAnchors.add(anchor.trim().toLowerCase())
  }

  if (!chosen.length) return { blocks, added: [], skipped }

  // Apply, in document order, without touching the input.
  chosen.sort((a, b) => a.blockIndex - b.blockIndex || a.blockOffset - b.blockOffset)
  const usedKeys = collectKeys(blocks)
  let counter = 0
  const freshKey = () => {
    let key: string
    do key = `il${++counter}`
    while (usedKeys.has(key))
    usedKeys.add(key)
    return key
  }

  const added: AddedLink[] = []
  const out = blocks.slice()
  const byBlock = new Map<number, Candidate[]>()
  for (const c of chosen) byBlock.set(c.blockIndex, [...(byBlock.get(c.blockIndex) ?? []), c])

  for (const [blockIndex, list] of byBlock) {
    const block = blocks[blockIndex]
    const text = blockText(block)
    const newDefs: PtMarkDef[] = []
    const newChildren: NonNullable<PtBlock["children"]> = []
    ;(block.children ?? []).forEach((child, childIndex) => {
      const hits = list.filter((c) => c.childIndex === childIndex).sort((a, b) => a.start - b.start)
      if (!hits.length || !isSpan(child)) {
        newChildren.push(child)
        return
      }
      const marks = child.marks ?? []
      let cursor = 0
      for (const h of hits) {
        if (h.start > cursor) {
          newChildren.push({ ...child, _key: freshKey(), text: child.text.slice(cursor, h.start), marks: [...marks] })
        }
        const markKey = freshKey()
        newDefs.push({ _key: markKey, _type: "link", href: h.targetPath })
        const anchorText = child.text.slice(h.start, h.end)
        newChildren.push({ ...child, _key: freshKey(), text: anchorText, marks: [...marks, markKey] })
        added.push({
          keyword: h.keyword,
          targetPath: h.targetPath,
          anchorText,
          blockIndex,
          style: block.listItem ? `list:${block.listItem}` : (block.style ?? "normal"),
          before: snippet(text, h.blockOffset, h.blockOffset + anchorText.length),
        })
        cursor = h.end
      }
      if (cursor < child.text.length) {
        newChildren.push({ ...child, _key: freshKey(), text: child.text.slice(cursor), marks: [...marks] })
      }
    })
    out[blockIndex] = {
      ...block,
      children: newChildren,
      markDefs: [...(block.markDefs ?? []), ...newDefs],
    }
  }

  return { blocks: out, added, skipped }
}

/**
 * Mid-article audit CTA for blog posts.
 *
 * Clarity showed ~50 dead clicks per long article (Nov 2026, monday 2904218621)
 * and readers who never reach the bottom-of-article banner. A second banner
 * goes roughly halfway through the body, between top-level blocks, with copy
 * that matches what the post is about.
 */

/** Below this many body blocks the post is short enough for the bottom banner alone. */
export const MID_CTA_MIN_BLOCKS = 8

// Loose shape: Portable Text blocks plus custom types (image, table, videoEmbed).
interface BodyNode {
  _type?: string
  style?: string
  listItem?: string
}

const isListItem = (b: BodyNode | undefined) => !!b && b._type === "block" && !!b.listItem
const isHeading = (b: BodyNode | undefined) =>
  !!b && b._type === "block" && !b.listItem && /^h[1-4]$/.test(b.style ?? "")

/**
 * Whether the banner may go between body[i - 1] and body[i]. Never inside a
 * list (Portable Text groups consecutive list items into one <ul>/<ol>, so a
 * split would break the list and restart its numbering) and never straight
 * after a heading (that would orphan the heading from its section).
 */
function canSplitAt<T extends BodyNode>(body: T[], i: number): boolean {
  if (i <= 0 || i >= body.length) return false
  const prev = body[i - 1]
  const next = body[i]
  if (isListItem(prev) && isListItem(next)) return false
  if (isHeading(prev)) return false
  return true
}

/**
 * Index to insert the mid-article banner before, or -1 when the post is too
 * short or has no safe split point. Prefers the start of a section (a heading)
 * near the middle; otherwise the nearest safe gap to the middle.
 */
export function midArticleSplitIndex<T extends BodyNode>(
  body: T[] | undefined | null,
  minBlocks = MID_CTA_MIN_BLOCKS,
): number {
  if (!body || body.length < minBlocks) return -1
  const n = body.length
  const mid = Math.round(n / 2)
  // Keep the banner well clear of the very top and bottom of the article.
  const lo = Math.max(2, Math.floor(n * 0.3))
  const hi = Math.min(n - 2, Math.ceil(n * 0.7))

  // Candidates ordered by distance from the middle (ties go to the earlier gap).
  const candidates: number[] = []
  for (let d = 0; d <= n; d++) {
    for (const i of d === 0 ? [mid] : [mid - d, mid + d]) {
      if (i >= lo && i <= hi && !candidates.includes(i)) candidates.push(i)
    }
  }
  const safe = candidates.filter((i) => canSplitAt(body, i))
  if (!safe.length) return -1

  // A section start within a fifth of the article from the middle reads best.
  const window = Math.max(2, Math.round(n * 0.2))
  const sectionStart = safe.find((i) => isHeading(body[i]) && Math.abs(i - mid) <= window)
  return sectionStart ?? safe[0]
}

/** Split the body around the mid-article banner. `after` is empty when there is no banner. */
export function splitBodyForMidCta<T extends BodyNode>(
  body: T[] | undefined | null,
  minBlocks = MID_CTA_MIN_BLOCKS,
): { before: T[]; after: T[]; hasMidCta: boolean } {
  const all = body ?? []
  const i = midArticleSplitIndex(all, minBlocks)
  if (i < 0) return { before: all, after: [], hasMidCta: false }
  return { before: all.slice(0, i), after: all.slice(i), hasMidCta: true }
}

export interface MidCtaCopy {
  heading: string
  /** Omitted so the banner keeps its shared body copy. */
  body?: string
  ctaLabel: string
}

interface PostTopic {
  slug?: string
}

/**
 * Per-post heading and button label (Claude Design spec, monday 2904218621).
 * Every other post keeps the shared banner copy. The body stays the shared
 * `audit-body` copy on all posts.
 */
const COPY_BY_SLUG: Record<string, MidCtaCopy> = {
  "monday-ai-pricing-model-2026": {
    heading: "Get a monday.com pricing review",
    ctaLabel: "Get a monday.com pricing review",
  },
  "mondaycom-and-whatsapp-integration": {
    heading: "Plan your WhatsApp integration",
    ctaLabel: "Plan your WhatsApp integration",
  },
  "ai-adoption-framework": {
    heading: "Book an AI readiness session",
    ctaLabel: "Book an AI readiness session",
  },
}

/** Topic copy for the post's slug, or null to fall back to the banner's shared default copy. */
export function midCtaCopyFor(post: PostTopic): MidCtaCopy | null {
  return (post.slug && COPY_BY_SLUG[post.slug]) || null
}

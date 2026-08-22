/**
 * Publishability rules for a single social post, in one place.
 *
 * Deliberately dependency-free and constraint-driven rather than reading the
 * platform registry itself: the composer runs these in the browser as you type
 * (so the blockers are live, not one save behind), and every publish/schedule
 * route runs the same function server-side before touching Zernio. Keeping the
 * rules here rather than in zernio.ts also keeps that module byte-identical to
 * its marketa-monorepo mirror, and keeps account ids out of the client bundle.
 */

import { renderedLength } from "@/lib/social/mentions"
import { shorteningSaving } from "@/lib/social/shortLinkText"

export interface PlatformConstraints {
  label: string
  limit: number
  titleLimit?: number
  titleRequired?: boolean
  needsMedia: boolean
  supportsMedia: boolean
  /** Accepts a PDF/slide document in place of an image (LinkedIn only). */
  supportsDocument?: boolean
}

export interface DraftValues {
  content: string
  title?: string
  /** "" or undefined = no image attached. */
  mediaUrl?: string
  /** "" or undefined = no document attached. */
  documentUrl?: string
  /**
   * Links get swapped for short ones at send time, so the caption travels
   * shorter than it's written. Off means measure it as typed.
   */
  shortenLinks?: boolean
}

/**
 * Every reason this post can't go out, in plain English. Empty array = good.
 * Messages are user-facing: they name the channel and say what to do.
 */
export function problemsFor(spec: PlatformConstraints, values: DraftValues): string[] {
  const problems: string[] = []
  const content = values.content?.trim() ?? ""
  const title = values.title?.trim() ?? ""

  // A Reddit post with a title and no body is still a valid post.
  if (!content && !(spec.titleRequired && title)) {
    problems.push(`${spec.label}: the caption is empty.`)
  }
  // Measure what the platform will actually receive, not what's in the box.
  // Two things pull those apart: a LinkedIn tag reads as "@monday.com" but
  // travels as markup carrying the account's URN (longer), and a link gets
  // swapped for a short one on the way out (shorter). Blocking a post that
  // would have fit is as wrong as letting one through that won't.
  const saved = values.shortenLinks ? shorteningSaving(content) : 0
  const sent = content.length - saved
  if (sent > spec.limit) {
    const over = sent - spec.limit
    const hidden = content.length - renderedLength(content)
    problems.push(
      `${spec.label}: ${over} character${over === 1 ? "" : "s"} over the ${spec.limit} limit` +
        (hidden > 0 ? ` (tags add ${hidden} hidden characters).` : "."),
    )
  }
  if (spec.titleRequired && !title) {
    problems.push(`${spec.label}: a title is required.`)
  }
  if (spec.titleLimit && title.length > spec.titleLimit) {
    const over = title.length - spec.titleLimit
    problems.push(`${spec.label}: the title is ${over} character${over === 1 ? "" : "s"} over the ${spec.titleLimit} limit.`)
  }
  if (spec.needsMedia && !values.mediaUrl) {
    problems.push(`${spec.label}: an image is required.`)
  }
  if (values.mediaUrl && !spec.supportsMedia && !values.documentUrl) {
    problems.push(`${spec.label}: this channel is text-only.`)
  }
  if (values.documentUrl && !spec.supportsDocument) {
    problems.push(`${spec.label}: this channel can't post a PDF — LinkedIn is the only one that can.`)
  }
  return problems
}

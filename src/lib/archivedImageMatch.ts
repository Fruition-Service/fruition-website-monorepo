/**
 * Matching a blog post's image slots to the images on an archived copy of the
 * original page.
 *
 * The hard part is that two numbering schemes disagree. Each slot carries the
 * index the original scrape gave it (`<slug>-body-9`), but the body array has
 * since had images removed, so that slot can sit at position 7. Match purely by
 * the scrape number and two slots end up claiming the same source image: one
 * wins, the other silently gets nothing and stays blurry. That happened on
 * `ai-call-recording-apps` — "Fathom Pricing Plans" (`-body-9`, position 7)
 * collided with the slot at position 9 and was left at 147px.
 *
 * So a source can only be claimed once, and a slot whose numbered position is
 * taken walks forward to the next free image.
 */

export interface ArchivedImage {
  src: string
  alt: string
}

export interface MatchableSlot {
  /** Position among the post's body images, 1-based, as the scraper saw them. */
  index: number
  alt: string
}

export function normaliseAlt(s: string | null | undefined): string {
  return (s ?? "").toLowerCase().replace(/\s+/g, " ").trim()
}

/**
 * The archived image belonging to `slot`, or null when every candidate is
 * already claimed.
 *
 * `taken` holds the source URLs earlier slots in the same post have claimed;
 * the caller adds each returned src to it.
 */
export function matchArchivedImage(
  slot: MatchableSlot,
  body: ArchivedImage[],
  taken: Set<string>,
): string | null {
  const alt = normaliseAlt(slot.alt)
  if (alt) {
    // Alt text is the strongest signal, so it may claim a source outright.
    const byAlt = body.find((img) => normaliseAlt(img.alt) === alt && !taken.has(img.src))
    if (byAlt) return byAlt.src
  }

  const byOrder = body[slot.index - 1]
  if (byOrder && !taken.has(byOrder.src)) return byOrder.src

  // Its numbered position is spoken for: take the next unclaimed image at or
  // after it, then fall back to any unclaimed one.
  const after = body.slice(slot.index).find((img) => !taken.has(img.src))
  return (after ?? body.find((img) => !taken.has(img.src)))?.src ?? null
}

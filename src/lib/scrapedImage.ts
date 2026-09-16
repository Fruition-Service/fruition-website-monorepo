/**
 * Picking the real image out of scraped markup.
 *
 * A lazy-loading page puts a low-resolution stand-in in `<img src>` and keeps
 * the full image in `srcset` or a `data-` attribute. Reading `src` and stopping
 * there is what left the migrated blog posts with blurred body images, so this
 * is the one place that decides which attribute to believe.
 */

import { wixOriginalUrl } from "@/lib/wixImage"

/**
 * The largest candidate in a `srcset`.
 *
 * Candidates are whitespace-delimited, not comma-delimited: per the srcset
 * grammar a URL runs to the next whitespace, and only a *trailing* comma ends
 * the candidate. That distinction matters here — a Wix URL carries commas
 * inside its transform (`w_1600,h_900`), so splitting on every comma shreds it.
 *
 * Ranks `w` descriptors by pixel width and `x` descriptors by density; a
 * candidate with no descriptor ranks lowest, since the spec treats it as `1x`.
 */
export function widestSrcsetUrl(srcset: string | null | undefined): string | null {
  if (!srcset) return null
  const tokens = srcset.trim().split(/\s+/).filter(Boolean)
  let best: { url: string; rank: number } | null = null

  for (let i = 0; i < tokens.length; ) {
    const token = tokens[i++]
    const closed = token.endsWith(",")
    const url = token.replace(/,+$/, "")
    if (!url) continue

    let rank = 0
    if (!closed && i < tokens.length) {
      // Densities are scaled so any plausible 2x outranks any plausible width.
      const descriptor = /^(\d+(?:\.\d+)?)([wx]),?$/.exec(tokens[i])
      if (descriptor) {
        i++
        rank = descriptor[2] === "w" ? Number(descriptor[1]) : Number(descriptor[1]) * 100_000
      }
    }
    if (!best || rank > best.rank) best = { url, rank }
  }
  return best?.url ?? null
}

/**
 * The best image URL among an element's attributes, in descending order of
 * trust, normalised to its full-resolution form. Inline `data:` URIs are
 * skipped — those are the blur-up placeholder itself, never the real image.
 */
export function bestScrapedImageUrl(candidates: (string | null | undefined)[]): string | null {
  for (const candidate of candidates) {
    const url = candidate?.trim()
    if (!url || url.startsWith("data:")) continue
    return wixOriginalUrl(url)
  }
  return null
}

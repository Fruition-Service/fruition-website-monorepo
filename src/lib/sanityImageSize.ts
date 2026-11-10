/**
 * Intrinsic size of a Sanity image from its asset ref
 * (`image-<hash>-<width>x<height>-<ext>`), or null when the ref is not in that form.
 */
export function sanityImageSize(ref: unknown): { width: number; height: number } | null {
  if (typeof ref !== "string") return null
  const m = ref.match(/^image-[A-Za-z0-9]+-(\d+)x(\d+)-[a-z0-9]+$/)
  if (!m) return null
  const width = Number(m[1])
  const height = Number(m[2])
  if (!width || !height) return null
  return { width, height }
}

/** Longest edge of the lightbox rendition. Sanity's `fit=max` never upscales past the original. */
export const LIGHTBOX_MAX_WIDTH = 1600

/** Size the lightbox rendition will come back at, given the original size. */
export function lightboxSize(
  original: { width: number; height: number } | null,
  maxWidth = LIGHTBOX_MAX_WIDTH,
): { width: number; height: number } | null {
  if (!original) return null
  if (original.width <= maxWidth) return original
  return { width: maxWidth, height: Math.round((original.height * maxWidth) / original.width) }
}

/** An external or internal link an editor attached to an image, if any. */
export function imageLinkHref(value: unknown): string | null {
  if (!value || typeof value !== "object") return null
  const v = value as Record<string, unknown>
  const candidates = [v.href, v.link, v.url]
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim()
    if (c && typeof c === "object") {
      const href = (c as Record<string, unknown>).href
      if (typeof href === "string" && href.trim()) return href.trim()
    }
  }
  return null
}

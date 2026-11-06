/**
 * Wix static-media URLs, and how to get the original back out of one.
 *
 * Every image on the old Wix site is served from `static.wixstatic.com/media/`
 * with an optional transform segment appended:
 *
 *   https://static.wixstatic.com/media/<mediaId>/v1/fill/w_1069,h_544,al_c/<file>
 *   ^-------------------- the original ------------------^
 *
 * The transform is a *request*, not part of the asset — strip it and Wix serves
 * the full-resolution upload. That matters because Wix's server-rendered HTML
 * puts a lazy-load placeholder in `<img src>`: a ~49px or ~147px crop with a
 * gaussian blur baked in (`blur_2`). The blog scrapers uploaded those
 * placeholders verbatim, which is why older posts show blurred body images.
 *
 * The saving grace is that a placeholder URL still names the same `<mediaId>`,
 * so recovering the sharp original is a pure URL rewrite — no re-crop, no
 * upscale, no guessing.
 */

const WIX_MEDIA_HOSTS = new Set(["static.wixstatic.com", "static.wixstatic.com."])

/** Widths at or below this only ever come from a Wix lazy-load placeholder. */
export const WIX_PLACEHOLDER_WIDTH = 400

export interface WixMediaUrl {
  /** Full-resolution original, with the transform segment removed. */
  original: string
  /** The `w_` the transform asked for, when it carries one. */
  transformWidth: number | null
  /** Wix bakes a gaussian blur into its lazy-load placeholders. */
  blurred: boolean
}

/**
 * Split a Wix media URL into its original and the transform it was asking for.
 * Returns null for anything that is not a `static.wixstatic.com/media/…` URL —
 * including Wix's `/shapes/` SVGs, which have no original to recover.
 */
export function parseWixMediaUrl(raw: string): WixMediaUrl | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  let u: URL
  try {
    // Wix markup is full of protocol-relative `//static.wixstatic.com/...`.
    u = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed)
  } catch {
    return null
  }
  if (!WIX_MEDIA_HOSTS.has(u.hostname.toLowerCase())) return null

  const segments = u.pathname.split("/").filter(Boolean)
  if (segments[0] !== "media" || segments.length < 2) return null

  // Everything from the `v1` marker onwards is the transform. Without one the
  // URL already points at the original.
  const v1 = segments.indexOf("v1")
  const mediaPath = v1 === -1 ? segments : segments.slice(0, v1)
  const transform = v1 === -1 ? "" : segments.slice(v1).join("/")

  return {
    original: `https://${u.hostname}/${mediaPath.join("/")}`,
    transformWidth: Number(/(?:^|,|\/)w_(\d+)(?:,|\/|$)/.exec(transform)?.[1]) || null,
    blurred: /(?:^|,)blur_\d+(?:,|\/|$)/.test(transform),
  }
}

/**
 * The full-resolution form of a Wix media URL. Anything else — a Sanity URL, a
 * monday attachment, a relative path — comes back untouched, so callers can
 * pipe every scraped `src` through this without special-casing.
 */
export function wixOriginalUrl(raw: string): string {
  return parseWixMediaUrl(raw)?.original ?? raw
}

/**
 * True when a URL is asking Wix for a degraded rendition: a baked-in blur, or a
 * width too small to fill the slot it will be rendered into. Use it to reject a
 * scraped `src` *before* uploading it, so a placeholder can never be ingested.
 */
export function isLowResWixUrl(raw: string, minWidth = WIX_PLACEHOLDER_WIDTH): boolean {
  const parsed = parseWixMediaUrl(raw)
  if (!parsed) return false
  if (parsed.blurred) return true
  return parsed.transformWidth !== null && parsed.transformWidth < minWidth
}

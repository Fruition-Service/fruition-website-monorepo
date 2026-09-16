import { createImageUrlBuilder } from "@sanity/image-url"
import { dataset, projectId } from "./env"

const builder = createImageUrlBuilder({ projectId, dataset })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source)

/**
 * Standard image size presets for common use cases.
 *
 * Always prefer these over bare urlFor(ref).url() to avoid serving
 * full-resolution originals through the CDN (a major driver of quota overage).
 */
export function heroImage(source: any) {
  return urlFor(source).width(1440).auto("format").url()
}
export function contentImage(source: any) {
  return urlFor(source).width(800).auto("format").url()
}
export function cardImage(source: any, width = 800, height = 600) {
  return urlFor(source).width(width).height(height).fit("crop").auto("format").url()
}
export function thumbnailImage(source: any, size = 200) {
  return urlFor(source).width(size).height(size).fit("crop").auto("format").url()
}
/** The article body column, in CSS pixels. Blog covers and inline images fill it. */
export const ARTICLE_IMAGE_WIDTH = 740

/**
 * An image sized for the article body column.
 *
 * Requests 2x the slot so it stays sharp on a retina display, and — because
 * Sanity never upscales past the stored asset — keeps a full-resolution
 * original from being shipped whole to the browser.
 */
export function articleImage(source: any) {
  return urlFor(source)
    .width(ARTICLE_IMAGE_WIDTH * 2)
    .auto("format")
    .quality(90)
    .url()
}

/**
 * The intrinsic pixel size of a Sanity image, read straight off the asset
 * reference (`image-<sha1>-1200x675-jpg` carries it verbatim). No network
 * call, so this is safe on any render path.
 */
export function imageDimensions(source: any): { width: number; height: number } | null {
  const ref: unknown = source?.asset?._ref ?? source?._ref ?? source
  if (typeof ref !== "string") return null
  const m = /-(\d+)x(\d+)-[a-z0-9]+$/i.exec(ref)
  if (!m) return null
  const width = Number(m[1])
  const height = Number(m[2])
  if (!width || !height) return null
  return { width, height }
}

export interface ArticleImageProps {
  src: string
  width: number
  height: number
  /** False when the asset is too small to fill the column and must not be stretched. */
  fillsColumn: boolean
  sizes: string
}

/**
 * Everything needed to place an image in the article column *without
 * upscaling it*.
 *
 * Some older posts were scraped at Wix placeholder resolution (147x83), and
 * stretching those across the 740px column is what makes them look blurry —
 * the pixels simply are not there. An asset narrower than the column is laid
 * out at its own size instead: small, but sharp. Anything column-width or
 * wider behaves exactly as before.
 */
export function articleImageProps(source: any): ArticleImageProps {
  const intrinsic = imageDimensions(source)
  const fillsColumn = !intrinsic || intrinsic.width >= ARTICLE_IMAGE_WIDTH
  const width = fillsColumn ? ARTICLE_IMAGE_WIDTH : intrinsic!.width
  // Keep the real aspect ratio so the reserved box matches what loads.
  const height = intrinsic
    ? Math.max(1, Math.round((width / intrinsic.width) * intrinsic.height))
    : Math.round((width * 416) / ARTICLE_IMAGE_WIDTH)
  // Never ask the CDN for more pixels than the asset actually holds.
  const requested = Math.min(ARTICLE_IMAGE_WIDTH * 2, intrinsic?.width ?? ARTICLE_IMAGE_WIDTH * 2)
  return {
    src: urlFor(source).width(requested).auto("format").quality(90).url(),
    width,
    height,
    fillsColumn,
    sizes: fillsColumn ? `(max-width: 924px) 100vw, ${ARTICLE_IMAGE_WIDTH}px` : `${width}px`,
  }
}

export function ogImage(source: any) {
  return urlFor(source).width(1200).height(630).fit("crop").auto("format").url()
}

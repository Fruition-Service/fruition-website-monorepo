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
export function ogImage(source: any) {
  return urlFor(source).width(1200).height(630).fit("crop").auto("format").url()
}

/**
 * Logo marquee preset. Logos are drawn at a fixed height (65px), so size the
 * request by height at 2x DPR rather than by width: very wide wordmarks keep
 * their sharpness and small logos are never upscaled (fit max).
 */
export function logoImageUrl(source: Parameters<typeof urlFor>[0], height = 130) {
  return urlFor(source).height(height).fit("max").auto("format").url()
}

/**
 * Intrinsic width and height of a Sanity image, read from its asset ref
 * ("image-<id>-<w>x<h>-<ext>"). Null when the ref does not carry dimensions.
 */
export function sanityImageDimensions(
  ref: string | undefined | null,
): { width: number; height: number } | null {
  const m = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i)
  if (!m) return null
  const width = Number(m[1])
  const height = Number(m[2])
  return width > 0 && height > 0 ? { width, height } : null
}

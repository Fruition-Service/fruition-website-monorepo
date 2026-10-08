import { urlFor } from "@/sanity/image"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"
const SITE_NAME = "Fruition"
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image.png`
/** Bump when the /og-card design changes (workers/og-card): the cards are cached as immutable. */
const OG_CARD_VERSION = "1"
const DEFAULT_TITLE =
  "Fruition | monday.com Platinum Partners | monday CRM Experts"
const DEFAULT_DESCRIPTION =
  "monday.com Partner certified - Fruition is an expert in Monday implementation and integration. Our monday.com consultants partners with you to integrate and automate Sales, Projects & Operations"

export interface OgMetadataInput {
  title?: string | null
  description?: string | null
  path: string
  /**
   * Explicit image URL. When neither this nor `ogImageSource` is given, the page
   * gets its own generated /og-card image (title + section) instead of the site default.
   */
  image?: string | null
  /** Sanity image source — resolved via urlFor to 1200×630. Takes precedence over `image`. */
  ogImageSource?: unknown
  /** Extra OpenGraph / Twitter fields merged on top of the generated defaults. */
  extra?: {
    openGraph?: Record<string, unknown>
    twitter?: Record<string, unknown>
  }
}

/**
 * Build openGraph + twitter metadata objects for a page.
 *
 * Falls back to site-wide defaults when title/description are empty.
 * Supports `ogImageSource` (Sanity image ref) and `extra` for article metadata.
 */
export function buildOgMetadata(input: OgMetadataInput) {
  const url = `${SITE_URL}${input.path}`
  const title = input.title || DEFAULT_TITLE
  const description = input.description || DEFAULT_DESCRIPTION
  const image = buildOgImage(
    input.ogImageSource,
    // The homepage keeps the partner-badge artwork; every other page gets its own card.
    input.image ?? (input.path === "/" ? DEFAULT_OG_IMAGE : ogCardUrl(title, input.path)),
  )

  const og: Record<string, unknown> = {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url,
    title,
    description,
    images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    ...(input.extra?.openGraph ?? {}),
  }

  const tw: Record<string, unknown> = {
    card: "summary_large_image",
    title,
    description,
    images: image ? [image] : [],
    ...(input.extra?.twitter ?? {}),
  }

  return {
    openGraph: og,
    twitter: tw,
  }
}

/**
 * Build an absolute image URL from a Sanity image reference.
 *
 * Uses 1200×630 crop suitable for OG/Twitter cards.
 * Falls back to the site-wide default OG image when source is missing/invalid.
 */
export function buildOgImage(
  source?: unknown,
  fallbackUrl?: string | null,
): string {
  if (!source) return fallbackUrl || DEFAULT_OG_IMAGE
  try {
    // Always JPEG: an animated GIF cover upscaled to 1200×630 came out at 12-18 MB
    // (over Facebook's 8 MB and LinkedIn's 5 MB limits, so no preview at all),
    // and LinkedIn does not render WebP/AVIF previews.
    return urlFor(source).width(1200).height(630).fit("crop").format("jpg").quality(85).url()
  } catch {
    return fallbackUrl || DEFAULT_OG_IMAGE
  }
}

/** Section label shown on the card, from the page path. */
function ogEyebrow(path: string): string {
  const region = path.match(/^\/monday-partner-([a-z]+)/)?.[1]
  if (region) {
    const names: Record<string, string> = { us: "US", uk: "UK", australia: "Australia", india: "India", philippines: "Philippines", singapore: "Singapore" }
    return `monday.com Partner · ${names[region] ?? region}`
  }
  const sections: [RegExp, string][] = [
    [/^\/ai-(consulting|strategy|capability|readiness)/, "AI Consulting"],
    [/^\/atlassian-consulting/, "Atlassian Consulting"],
    [/^\/hubspot-consulting/, "HubSpot Consulting"],
    [/^\/integrations/, "Integrations"],
    [/^\/(industries|monday-for-)/, "Industries"],
    [/^\/monday-consulting-solutions/, "monday.com Solutions"],
    [/^\/partnerships/, "Partnerships"],
    [/^\/(consulting-blog|post|author)/, "Fruition Blog"],
    [/^\/(legal|terms-and-conditions|data-privacy)/, "Legal"],
  ]
  return sections.find(([re]) => re.test(path))?.[1] ?? ""
}

/**
 * The headline for the card: the leading part of the SEO title, cut at the first
 * " | " or spaced dash, without the "| Fruition …" / ": Fruition Blog" brand tails
 * (the card already carries the logo).
 */
export function ogCardTitle(title: string): string {
  const parts = title
    .replace(/:\s*Fruition Blog$/i, "")
    .split(/\s+[|\u2014\u2013]\s+/)
    .map((p) => p.trim())
    .filter((p) => p && !/^Fruition( Services)?$/i.test(p))
  return parts[0] ?? title
}

/** Absolute URL of the generated per-page social card. */
export function ogCardUrl(title: string, path: string, eyebrowOverride?: string): string {
  const params = new URLSearchParams({ title: ogCardTitle(title) })
  const eyebrow = eyebrowOverride ?? ogEyebrow(path)
  if (eyebrow) params.set("eyebrow", eyebrow)
  params.set("v", OG_CARD_VERSION)
  return `${SITE_URL}/og-card?${params.toString()}`
}

/**
 * Async convenience export for root layout back-compat.
 * Returns the default OG image URL.
 */
export async function defaultOgImage(): Promise<string> {
  return DEFAULT_OG_IMAGE
}

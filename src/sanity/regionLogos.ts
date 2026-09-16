import { client } from './client'
import type { CarouselLogo } from '@/components/sections/types'

/**
 * The proof band under each region hero draws that region's own clients.
 *
 * Keys are the region page slugs, so the page asks for its own set with no
 * second lookup table to keep in step. Keep this in step with the `regionKey`
 * option list in `src/sanity/schemas/regionLogoSet.ts`.
 */
export const REGION_LOGO_KEYS = [
  'monday-partner-australia',
  'monday-partner-uk',
  'monday-partner-us',
  'monday-partner-singapore',
  'monday-partner-india',
  'monday-partner-philippines',
] as const

export type RegionLogoKey = (typeof REGION_LOGO_KEYS)[number]

export interface RegionLogoSet {
  logos: CarouselLogo[]
  /** Optional Studio override for the line under the heading. */
  lead?: string
}

/**
 * One region's curated wall, or null when no set has been seeded yet —
 * callers fall back to the global carousel via `resolveRegionLogos`.
 */
export async function getRegionLogos(key: string): Promise<RegionLogoSet | null> {
  const res = await client.fetch<{ logos?: CarouselLogo[]; lead?: string } | null>(
    `*[_type == "regionLogoSet" && regionKey == $key][0]{
      lead,
      logos[]{ _key, alt, image, clientSlug }
    }`,
    { key },
  )
  const logos = (res?.logos ?? []).filter((l) => l?.image)
  return logos.length ? { logos, lead: res?.lead } : null
}

/**
 * Region set wins; the global carousel is the fallback. Same precedence the
 * industry walls and the FAQ tabs use — a curated per-page set always beats
 * the site-wide default.
 */
export function resolveRegionLogos(
  regionLogos: CarouselLogo[] | null | undefined,
  carouselLogos: CarouselLogo[] | null | undefined,
): CarouselLogo[] {
  return regionLogos?.length ? regionLogos : (carouselLogos ?? [])
}

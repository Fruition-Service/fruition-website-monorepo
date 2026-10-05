import { client } from './client'
import type { CarouselLogo } from '@/components/sections/types'

/**
 * The industry keys the site asks Sanity for, and the pages that ask for them.
 * Keep this in step with the `industryKey` option list in
 * `src/sanity/schemas/industryLogoSet.ts`.
 */
export const INDUSTRY_LOGO_KEYS = {
  '/monday-for-construction': 'construction',
  '/monday-for-government': 'government',
  '/monday-for-manufacturing': 'manufacturing',
  '/monday-for-marketing': 'marketing',
  '/monday-for-professional-services': 'professional-services',
  '/monday-for-real-estate': 'real-estate',
  '/monday-for-retail': 'retail',
  '/industries/financial-services': 'financial-services',
  '/industries/healthcare': 'healthcare',
  '/industries/solar-renewables': 'solar-renewables',
  '/industries/education': 'education',
  '/industries/nonprofits': 'nonprofits',
} as const

export type IndustryLogoKey = (typeof INDUSTRY_LOGO_KEYS)[keyof typeof INDUSTRY_LOGO_KEYS]

/**
 * The logo wall for one industry, or null when no set has been curated yet —
 * callers fall back to the global carousel via `resolveIndustryLogos`.
 */
export async function getIndustryLogos(key: string): Promise<CarouselLogo[] | null> {
  const res = await client.fetch<{ logos?: CarouselLogo[] } | null>(
    `*[_type == "industryLogoSet" && industryKey == $key][0]{
      logos[]{ _key, alt, image, clientSlug }
    }`,
    { key },
  )
  const logos = (res?.logos ?? []).filter((l) => l?.image)
  return logos.length ? logos : null
}

/**
 * Industry set wins; the global carousel is the fallback. Mirrors the precedence
 * the FAQ tabs use — a curated per-page set always beats the site-wide default.
 */
export function resolveIndustryLogos(
  industryLogos: CarouselLogo[] | null | undefined,
  carouselLogos: CarouselLogo[] | null | undefined,
): CarouselLogo[] {
  return industryLogos?.length ? industryLogos : (carouselLogos ?? [])
}

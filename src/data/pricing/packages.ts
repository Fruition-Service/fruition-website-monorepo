/**
 * Implementation package tiers shown on /pricing (the site's commercial page).
 *
 * The Studio `implementationPackagesPage.packageTiers` array is authoritative
 * for names, hours, prices, CTAs and features. This file is the fallback used
 * when that array is empty or unreachable, plus the editorial framing the
 * Studio does not hold: who each tier is for, how it is billed, and the
 * "which package fits" rows. /implementation-packages describes delivery only
 * and publishes no prices.
 */

/** Shape of one `packageTiers` entry as it comes back from Sanity. */
export interface SanityPackageTier {
  name?: string
  hours?: string
  basePrice?: number
  pricePrefix?: string
  priceLabel?: string
  ctaLabel?: string
  featured?: boolean
  features?: string[]
}

/** A tier ready to render: cleaned Studio data plus editorial framing. */
export interface PackageTierView {
  name: string
  hours: string
  /** No basePrice = a scoped tier: the card shows priceLabel instead of a figure. */
  basePrice?: number
  pricePrefix?: string
  priceLabel?: string
  ctaLabel?: string
  featured: boolean
  features: string[]
  bestFor?: string
  billing?: string
}

export const PACKAGE_TIER_FALLBACK: SanityPackageTier[] = [
  {
    name: 'Training & Optimisation',
    hours: 'Starting from 10 hrs',
    basePrice: 2500,
    pricePrefix: 'From',
    features: [
      'Team training sessions',
      'Board and workflow review',
      'Automation clean-up and optimisation',
      'Best-practice recommendations',
      'Handover documentation',
    ],
  },
  {
    name: 'Lock-Step',
    hours: '40 hrs',
    priceLabel: 'Custom quote',
    ctaLabel: 'Contact sales',
    featured: true,
    features: [
      'Process mapping for 1 to 2 use cases',
      'Solution design',
      'Build support',
      'Native automation',
      'Handover documentation',
    ],
  },
  {
    name: 'Managed Services',
    hours: 'Ongoing, with a forward deployed engineer',
    priceLabel: 'Custom quote',
    ctaLabel: 'Get your managed services',
    features: [
      'A forward deployed engineer embedded with your team',
      'Ongoing builds, automations and integrations',
      'Continuous optimisation as your processes change',
      'Admin support and change requests handled',
      'Regular roadmap and progress reviews',
    ],
  },
]

const TIER_EDITORIAL: Record<string, { bestFor: string; billing: string }> = {
  'Training & Optimisation': {
    bestFor:
      'Teams already working in monday.com who need their boards cleaned up, their automations fixed and their people trained on what they already own.',
    billing: 'Fixed starting price, confirmed in writing before work starts.',
  },
  'Lock-Step': {
    bestFor:
      'A first proper build across one or two processes, where Fruition designs the solution and builds it with your team rather than for them.',
    billing: 'Quoted after a scoping call, once the use cases and the build are known.',
  },
  'Managed Services': {
    bestFor:
      'Teams that want a named monday.com engineer working inside the business month after month, with no project end date.',
    billing: 'Ongoing engagement, quoted after scoping.',
  },
}

function toView(t: SanityPackageTier): PackageTierView | null {
  const name = typeof t?.name === 'string' ? t.name.trim() : ''
  if (!name) return null
  const editorial = TIER_EDITORIAL[name]
  return {
    name,
    hours: t.hours ?? '',
    basePrice: typeof t.basePrice === 'number' ? t.basePrice : undefined,
    pricePrefix: t.pricePrefix,
    priceLabel: t.priceLabel,
    ctaLabel: t.ctaLabel,
    featured: !!t.featured,
    features: (t.features ?? []).filter(
      (f): f is string => typeof f === 'string' && f.trim() !== '',
    ),
    ...(editorial ? { bestFor: editorial.bestFor, billing: editorial.billing } : {}),
  }
}

/**
 * Studio tiers when any are usable, otherwise the shipped fallback. Entries
 * without a name are dropped; blank feature strings are filtered out.
 */
export function buildPackageTiers(
  tiers: SanityPackageTier[] | undefined | null,
): PackageTierView[] {
  const fromStudio = (tiers ?? [])
    .map(toView)
    .filter((t): t is PackageTierView => t !== null)
  if (fromStudio.length) return fromStudio
  return PACKAGE_TIER_FALLBACK.map(toView).filter((t): t is PackageTierView => t !== null)
}

export const PACKAGE_FIT_ROWS: { situation: string; tier: string; when: string }[] = [
  {
    situation: 'You already run monday.com and want it tidied up',
    tier: 'Training & Optimisation',
    when: 'The platform is roughly right, but the boards, automations and habits need work.',
  },
  {
    situation: 'You need a new build across one or two processes',
    tier: 'Lock-Step',
    when: 'Nothing exists yet, or the current setup cannot carry the process.',
  },
  {
    situation: 'You want an engineer on call every month',
    tier: 'Managed Services',
    when: 'The build is never really finished and someone has to keep improving it.',
  },
]

/* Indicative conversions for the price cards. Not a quote. */

export type CurrencyCode = 'USD' | 'SGD' | 'GBP' | 'AUD' | 'EUR'
export type RegionCode = 'US' | 'UK' | 'APAC'

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; rate: number; locale: string; label: string }
> = {
  USD: { symbol: '$', rate: 1, locale: 'en-US', label: 'USD' },
  SGD: { symbol: 'S$', rate: 1.34, locale: 'en-SG', label: 'SGD' },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB', label: 'GBP' },
  AUD: { symbol: 'A$', rate: 1.52, locale: 'en-AU', label: 'AUD' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE', label: 'EUR' },
}

export const REGIONS: Record<RegionCode, { label: string; multiplier: number }> = {
  US: { label: 'US', multiplier: 1.0 },
  UK: { label: 'UK', multiplier: 0.95 },
  APAC: { label: 'APAC', multiplier: 0.85 },
}

/** Secondary label shown next to each region in the team dropdown. */
export const REGION_AREA_LABELS: Record<RegionCode, string> = {
  US: 'Americas',
  UK: 'EMEA',
  APAC: 'Asia-Pacific',
}

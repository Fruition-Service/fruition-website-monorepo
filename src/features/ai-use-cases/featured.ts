import type { UseCase } from "./types"

/**
 * Which catalogue industry feeds each existing industry landing page, and
 * which use cases that page should lead with.
 *
 * `prefer` matches the use case's title, summary and challenge. The
 * education and nonprofit pages share one catalogue industry; the solar page
 * draws the solar and energy builds out of construction.
 */
export interface FeaturedUseCaseSource {
  industrySlug: string
  /** The landing page's name, for links back to it from the catalogue. */
  label: string
  prefer?: RegExp
  /** Show only use cases matching `prefer` (the solar page). */
  onlyPreferred?: boolean
  /** Section heading, when "<industry> use cases" does not fit the page. */
  heading?: string
}

export const LANDING_PAGE_USE_CASES = {
  "/monday-for-construction": { industrySlug: "construction", label: "monday.com for Construction" },
  "/monday-for-manufacturing": { industrySlug: "manufacturing", label: "monday.com for Manufacturing" },
  "/monday-for-government": { industrySlug: "government", label: "monday.com for Government" },
  "/monday-for-real-estate": { industrySlug: "real-estate", label: "monday.com for Real Estate" },
  "/monday-for-professional-services": {
    industrySlug: "professional-services",
    label: "monday.com for Professional Services",
  },
  "/monday-for-retail": { industrySlug: "retail-ecommerce", label: "monday.com for Retail" },
  "/industries/healthcare": { industrySlug: "healthcare", label: "Healthcare" },
  "/industries/financial-services": { industrySlug: "financial-services", label: "Financial Services" },
  "/industries/education": {
    industrySlug: "education-nonprofit",
    label: "Education",
    prefer: /\b(school|universit|college|education|student|training|learning|tafe)/i,
  },
  "/industries/nonprofits": {
    industrySlug: "education-nonprofit",
    label: "Nonprofits",
    prefer: /\b(nonprofit|non-profit|not-for-profit|charit|foundation|donor|grant|volunteer|association|membership)/i,
  },
  "/industries/solar-renewables": {
    industrySlug: "construction",
    label: "Solar & Renewables",
    prefer: /\b(solar|battery|batteries|energy|renewable)/i,
    onlyPreferred: true,
    heading: "Solar, battery and energy use cases",
  },
} satisfies Record<string, FeaturedUseCaseSource>

export type LandingPagePath = keyof typeof LANDING_PAGE_USE_CASES

const matches = (uc: UseCase, re?: RegExp) =>
  !!re && re.test(`${uc.title} ${uc.summary} ${uc.challenge}`)

/** How much a card says at a glance: a metric, an outcome, a known timeframe. */
function evidence(uc: UseCase): number {
  return (uc.metric ? 4 : 0) + (uc.outcome ? 2 : 0) + (uc.timeframe ? 1 : 0)
}

/**
 * Picks the use cases for an industry landing page's featured section.
 *
 * Client builds lead (a prospect wants to see their peers, not Fruition's own
 * tooling), then preferred matches, then builds with an AI step, then the
 * ones with the most evidence. Ties keep the catalogue's curated order.
 */
export function pickFeaturedUseCases(
  useCases: UseCase[],
  source: FeaturedUseCaseSource,
  limit = 6,
): UseCase[] {
  const pool = source.onlyPreferred ? useCases.filter((uc) => matches(uc, source.prefer)) : useCases
  return pool
    .map((uc, i) => ({ uc, i }))
    .sort(
      (a, b) =>
        Number(a.uc.own) - Number(b.uc.own) ||
        Number(matches(b.uc, source.prefer)) - Number(matches(a.uc, source.prefer)) ||
        Number(b.uc.ai) - Number(a.uc.ai) ||
        evidence(b.uc) - evidence(a.uc) ||
        a.i - b.i,
    )
    .slice(0, limit)
    .map(({ uc }) => uc)
}

/**
 * The landing pages a catalogue industry page links back to. The solar page
 * only borrows a few construction builds, so construction does not link to it.
 */
export function landingPagesFor(industrySlug: string): { path: string; label: string }[] {
  return Object.entries(LANDING_PAGE_USE_CASES as Record<string, FeaturedUseCaseSource>)
    .filter(([, s]) => s.industrySlug === industrySlug && !s.onlyPreferred)
    .map(([path, s]) => ({ path, label: s.label }))
}

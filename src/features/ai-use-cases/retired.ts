import { INDUSTRY_PAGES, USE_CASES_ANCHOR, USE_CASES_PATH } from "./types"

/**
 * The retired /ai-use-cases/<industry> pages and where each one went (Edward,
 * 13 Nov 2026: 12 pages, 1 search click and ~160 impressions in 90 days). The
 * hub /ai-use-cases stays. Spread into `auditRedirects` in next.config.ts.
 * The route no longer exists, so these redirects are the only thing serving
 * those URLs.
 */
export const RETIRED_INDUSTRY_SLUGS = [
  "construction",
  "education-nonprofit",
  "financial-services",
  "government",
  "healthcare",
  "logistics",
  "manufacturing",
  "professional-services",
  "real-estate",
  "retail-ecommerce",
  "technology-saas",
  "cross-industry",
] as const

export const retiredUseCaseRedirects = RETIRED_INDUSTRY_SLUGS.map((slug) => ({
  source: `${USE_CASES_PATH}/${slug}`,
  destination: INDUSTRY_PAGES[slug] ? `${INDUSTRY_PAGES[slug]}#${USE_CASES_ANCHOR}` : USE_CASES_PATH,
  statusCode: 301 as const,
}))

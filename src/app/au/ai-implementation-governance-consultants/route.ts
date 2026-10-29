import { landingPageResponse } from "@/lib/landingPage"
import { html } from "./content"

// Google Ads landing page: served as a self-contained HTML document (no site
// chrome, noindex), styled only by the shared theme in landingPageTheme.ts,
// with GTM, the lead-form wiring and the booking calendar added at serve time.
// Prerendered at build, refreshed in the background. See src/lib/landingPage.ts.
export const dynamic = "force-static"
export const revalidate = 60

export function GET() {
  return landingPageResponse(html, {
    source: "adwords-lp-au-ai-implementation-governance-consultants",
    region: "APAC",
  })
}

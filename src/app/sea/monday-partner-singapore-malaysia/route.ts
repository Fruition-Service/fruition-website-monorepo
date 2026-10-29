import { landingPageResponse } from "@/lib/landingPage"
import { html } from "./content"

// Google Ads landing page: served verbatim (own design system, no site chrome),
// with GTM, the lead-form wiring and the booking calendar added at serve time.
// Prerendered at build, refreshed in the background. See src/lib/landingPage.ts.
export const dynamic = "force-static"
export const revalidate = 60

export function GET() {
  return landingPageResponse(html, { source: "adwords-lp-sea-monday-partner-singapore-malaysia", region: "SEA" })
}

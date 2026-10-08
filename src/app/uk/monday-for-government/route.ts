import { landingPageResponse } from "@/lib/landingPage"
import { html } from "./content"

// Google Ads landing page: served verbatim (own design system, no site chrome),
// with GTM, the lead-form wiring and the booking calendar added at serve time.
export function GET() {
  return landingPageResponse(html, { source: "adwords-lp-uk-monday-for-government", region: "UK" })
}

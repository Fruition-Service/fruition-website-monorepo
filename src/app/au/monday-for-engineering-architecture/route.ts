import { html } from "./content"

// Google Ads landing page: served verbatim (own design system, no site chrome).
// noindex (meta + header): paid-traffic page, must stay out of organic search.
export function GET() {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}

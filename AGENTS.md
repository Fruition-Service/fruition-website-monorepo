<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Social previews on every page

Every new page, route, deck or microsite ships with a proper link preview before it counts as done. Links get pasted into WhatsApp, Viber, Messenger, Slack, LinkedIn and X, and a bare link with no card looks broken.

- **Tags:** a specific `<title>` and meta description, Open Graph (`og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, and `og:image` as an absolute https URL with `og:image:width`, `og:image:height` and `og:image:alt`), and a Twitter card (`twitter:card` set to `summary_large_image`, with its own title, description and image). In Next.js use the Metadata API (`metadataBase`, `openGraph`, `twitter`) or a per-route `opengraph-image`.
- **Image:** 1200x630, under 300 KB (JPEG unless it needs transparency, or WhatsApp drops it), made for that page in its own brand and readable as a small thumbnail. The site-wide default image is only for pages that really are generic.
- **Gated pages:** a page behind a password or login still gets a preview. Serve the tags on the gate page with HTTP 200 (crawlers drop the card on 401 or 403) and let the preview image load without the password. Keep figures, prices and terms out of a gated page's preview, since anyone with the link sees it.
- **Check after deploy:** `curl -A "facebookexternalhit/1.1"` and `curl -A "WhatsApp/2.23"` on the live URL return 200 with the tags, and the `og:image` URL returns 200 `image/*`. Then paste the link into a chat or an Open Graph preview tool and look at the card.

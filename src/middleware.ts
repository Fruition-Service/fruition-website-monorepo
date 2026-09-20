import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// The Cloudflare Worker serves both fruitionservices.io and
// www.fruitionservices.io (see routes in wrangler.jsonc), so without this
// redirect every page is live on two hosts. Google then has to pick a
// canonical host itself and drops the duplicates from the index
// ("Duplicate without user-selected canonical" in Search Console).
//
// This stays a middleware.ts (deprecated in Next 16 in favour of proxy.ts)
// on purpose: proxy.ts always compiles to the Node.js runtime, which
// @opennextjs/cloudflare rejects — only edge middleware is supported.
const CANONICAL_HOST = "www.fruitionservices.io"

// Wix-era domains that still carry inbound links and rankings. Any of their
// traffic that reaches this Worker is 301'd to the SAME path on the canonical
// host.
//
// Preserving the path is deliberate: the old Wix site and this one share
// almost every URL — the page paths and all 241 /post/<slug> blog URLs match
// one-for-one — so a path-preserving 301 hands each old URL's equity to its
// real successor. Folding everything onto the homepage instead would read as
// a soft 404 and throw that away. The handful of paths that WERE renamed are
// caught on the next hop by the redirect table in next.config.ts.
//
// Only fruitionmonday.com is wired in (via routes in wrangler.jsonc);
// fruition-services.io is forwarded at Wix instead and so never reaches this
// Worker. It is listed anyway so that if that domain is ever moved onto
// Cloudflare, it gets the path-preserving treatment for free.
const LEGACY_HOSTS = new Set([
  "fruitionmonday.com",
  "www.fruitionmonday.com",
  "fruition-services.io",
  "www.fruition-services.io",
])

// Markdown twins of the three pages that have one. An agent arriving cold from
// web search, without having read llms.txt first, can content-negotiate its way
// to the markdown instead of parsing the rendered page.
//
// Only requests that ask for markdown AND do not accept HTML are rewritten, so
// no browser can ever land on this path: every browser sends text/html, and an
// Accept listing both still gets HTML.
//
// The markdown response carries `Vary: Accept`. The HTML one does not, and
// cannot: Next owns that header on a page response for its RSC router and
// replaces both the next.config.ts entry and anything middleware appends. It
// is safe here because this negotiation runs in middleware, ahead of any cache
// lookup, so the variant is chosen per request rather than served from
// whichever one was cached at this path first.
const MARKDOWN_TWINS: Record<string, string> = {
  "/": "/index.md",
  "/pricing": "/pricing.md",
  "/about-us": "/about-us.md",
}

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false
  const value = accept.toLowerCase()
  return value.includes("text/markdown") && !value.includes("text/html")
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()
  if (host === "fruitionservices.io" || LEGACY_HOSTS.has(host)) {
    const url = request.nextUrl.clone()
    url.protocol = "https"
    url.host = CANONICAL_HOST
    url.port = ""
    return NextResponse.redirect(url, 301)
  }
  const twin = MARKDOWN_TWINS[request.nextUrl.pathname]
  if (twin && wantsMarkdown(request.headers.get("accept"))) {
    const url = request.nextUrl.clone()
    url.pathname = twin
    const response = NextResponse.rewrite(url)
    response.headers.set("Vary", "Accept")
    return response
  }

  // No header forwarding: the only consumer was FaqHeadJsonLd, which read
  // x-pathname via headers() in the ROOT layout and thereby opted every route
  // out of static rendering. FAQ JSON-LD now comes from FaqAccordion, built
  // from the tabs the page already renders.
  return NextResponse.next()
}

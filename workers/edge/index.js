// fruition-edge: a few-KB Worker in front of the site Worker (fruition-landing).
//
// Why: the site Worker is a ~10 MB script. Every request that lands on an
// isolate where it is not loaded yet pays the start-up, and on a low-traffic
// site that is most requests: live TTFB on cache HITs ran 0.8 to 3.7 s, and a
// trivial API route took as long, while static files on the same host came back
// in 0.3 s (30 Oct 2026). Google's field data put TTFB at 2.6 to 3.1 s.
//
// What it does: public HTML pages are kept in this colo's cache and served
// from here, so the big Worker is only woken on a miss or to refresh in the
// background. Everything else (portal, APIs, Studio, edit mode, RSC client
// navigations, non-GET) passes straight through, untouched.
//
// Freshness: an entry younger than FRESH_SECONDS is served as is. An older one
// is still served instantly, and the page is refetched in the background
// (stale-while-revalidate), the same contract the site's own ISR cache has.
// The cache key carries BUILD_ID, which the deploy sets to the new build, so a
// deploy never serves HTML that points at the previous build's JS and CSS.

const FRESH_SECONDS = 60
const KEEP_SECONDS = 86400

const PASS_PREFIXES = ["/internal", "/api/", "/studio", "/_next/", "/login", "/og-card"]
const PASS_COOKIES = /(?:^|;\s*)(__prerender_bypass|__next_preview_data|fruition-edit[a-z-]*|sb-[^=]*)=/

function cacheable(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return false
  if (PASS_PREFIXES.some((p) => url.pathname === p || url.pathname.startsWith(p))) return false
  if (url.searchParams.has("_rsc")) return false
  if (request.headers.has("RSC") || request.headers.has("Next-Router-Prefetch") ||
      request.headers.has("Next-Router-State-Tree") || request.headers.has("Next-Action")) return false
  if (PASS_COOKIES.test(request.headers.get("Cookie") || "")) return false
  // Markdown twins are chosen by Accept (src/middleware.ts); let the site decide.
  if ((request.headers.get("Accept") || "").includes("text/markdown")) return false
  return true
}

function storable(res) {
  if (res.status !== 200) return false
  if (res.headers.has("Set-Cookie")) return false
  if (!(res.headers.get("Content-Type") || "").startsWith("text/html")) return false
  // Only ISR/static pages: they carry s-maxage. Dynamic pages say no-store.
  return /s-maxage=\d+/.test(res.headers.get("Cache-Control") || "")
}

function cacheKey(url, env) {
  const k = new URL(url)
  k.searchParams.set("__build", env.BUILD_ID || "none")
  return new Request(k.toString(), { method: "GET" })
}

async function refresh(request, url, env) {
  const fresh = await env.SITE.fetch(new Request(url.toString(), { headers: request.headers, method: "GET" }))
  if (!storable(fresh)) return null
  const stored = new Response(fresh.body, fresh)
  stored.headers.set("X-Edge-Stored-At", String(Date.now()))
  stored.headers.set("Cache-Control", `public, max-age=${KEEP_SECONDS}`)
  await caches.default.put(cacheKey(url, env), stored)
  return null
}

function forClient(res, state, siteCacheControl) {
  const out = new Response(res.body, res)
  out.headers.set("X-Edge-Cache", state)
  if (siteCacheControl) out.headers.set("Cache-Control", siteCacheControl)
  out.headers.delete("X-Edge-Stored-At")
  return out
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (!cacheable(request, url)) return env.SITE.fetch(request)

    const key = cacheKey(url, env)
    const hit = await caches.default.match(key)
    if (hit) {
      const age = (Date.now() - Number(hit.headers.get("X-Edge-Stored-At") || 0)) / 1000
      const stale = age > FRESH_SECONDS
      if (stale) ctx.waitUntil(refresh(request, url, env).catch(() => null))
      return forClient(hit, stale ? "STALE" : "HIT", "public, max-age=0, must-revalidate")
    }

    const res = await env.SITE.fetch(request)
    if (request.method === "GET" && storable(res)) {
      const siteCc = res.headers.get("Cache-Control")
      const copy = res.clone()
      ctx.waitUntil((async () => {
        const stored = new Response(copy.body, copy)
        stored.headers.set("X-Edge-Stored-At", String(Date.now()))
        stored.headers.set("Cache-Control", `public, max-age=${KEEP_SECONDS}`)
        await caches.default.put(key, stored)
      })().catch(() => null))
      return forClient(res, "MISS", siteCc)
    }
    return res
  },
}

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
//
// Two tiers (Nov 2026, monday 2904361390). The colo cache above is per data
// centre, so a page nobody in that colo had asked for since the last deploy was
// a MISS that woke the big Worker cold: 1 to 3 s TTFB, which is what PageSpeed
// Insights measured on the partner pages (its test servers rarely share a colo
// with real visitors). Every stored page is now also written to Workers KV,
// which is global: a colo MISS reads the KV copy (tens of ms) instead of
// starting the site Worker, and the deploy warms KV once for every sitemap URL
// (.github/workflows/deploy.yml). The KV copy follows the same freshness rule:
// older than FRESH_SECONDS means served once, then refreshed in the background.
//
// Ad and campaign parameters (gclid, utm_*, srsltid, ...) are left out of the
// cache key. Only static/ISR pages are stored and those render the same HTML
// whatever the query string says, but each click carried a unique gclid, so
// every paid or tagged visit was a MISS. The request the site Worker sees is
// unchanged; only the key ignores them.

import { keyUrl, kvKey } from "./keys.js"

const FRESH_SECONDS = 60
// How long a colo keeps a page it has not been asked for. This used to be one
// day, so a low-traffic route (a region or industry page seen less than daily
// in a given colo) was almost always a MISS and woke the big Worker cold: 0.7
// to 2.6 s TTFB against 0.06 to 0.14 s on a HIT (Nov 2026 UX review). A week
// keeps those pages warm between deploys. It does not loosen freshness: any
// entry older than FRESH_SECONDS is still refreshed in the background on its
// next request, and a deploy changes BUILD_ID, which empties the cache anyway.
const KEEP_SECONDS = 7 * 86400

// The colo copy only rewrites the KV copy when the KV one is at least this old,
// so busy pages do not write KV on every background refresh.
const KV_REWRITE_SECONDS = 300
// A KV copy only serves its own build, and production deploys several times a
// day, so it does not need the colo's week. Three days covers a quiet weekend.
// Copies are gzipped (about 400 KB of HTML becomes about 80 KB), which keeps
// KV storage small and makes a cold KV read faster.
const KV_KEEP_SECONDS = 3 * 86400
// Headers the site sends that a KV copy must replay. Everything else (date,
// server-timing, cf-*, report-to, ...) is per response and set by Cloudflare.
const KV_HEADERS = [
  "content-type",
  "vary",
  "x-nextjs-cache",
  "x-nextjs-prerender",
  "x-nextjs-stale-time",
  "x-opennext",
  "x-powered-by",
  "strict-transport-security",
  "content-security-policy",
  "content-security-policy-report-only",
  "referrer-policy",
  "x-content-type-options",
  "x-frame-options",
  "permissions-policy",
]

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
  const k = keyUrl(url)
  k.searchParams.set("__build", env.BUILD_ID || "none")
  return new Request(k.toString(), { method: "GET" })
}

function kvHeaders(res) {
  const out = []
  for (const name of KV_HEADERS) {
    const v = res.headers.get(name)
    if (v !== null) out.push([name, v])
  }
  // KV metadata is capped at 1024 bytes. Content-Type alone always fits.
  return JSON.stringify(out).length <= 900 ? out : out.filter(([n]) => n === "content-type")
}

const gzip = (text) =>
  new Response(new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer()
const gunzip = (buf) =>
  new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).text()

async function kvWrite(env, key, html, res, storedAt) {
  if (!env.HTML_KV || !key) return
  await env.HTML_KV.put(key, await gzip(html), {
    expirationTtl: KV_KEEP_SECONDS,
    metadata: { t: storedAt, z: 1, h: kvHeaders(res) },
  })
}

async function kvRead(env, key) {
  if (!env.HTML_KV || !key) return null
  try {
    const { value, metadata } = await env.HTML_KV.getWithMetadata(key, { type: "arrayBuffer" })
    if (value === null || !metadata || !Number(metadata.t) || metadata.z !== 1) return null
    const html = await gunzip(value)
    const headers = new Headers(Array.isArray(metadata.h) ? metadata.h : [])
    if (!headers.has("Content-Type")) headers.set("Content-Type", "text/html; charset=utf-8")
    return { html, headers, storedAt: Number(metadata.t) }
  } catch {
    return null
  }
}

// What goes into the colo cache: the page, when it was rendered, and when the
// KV copy was last written (so a refresh knows whether KV needs a new copy).
function coloCopy(body, init, storedAt, kvAt) {
  const stored = new Response(body, init)
  stored.headers.set("X-Edge-Stored-At", String(storedAt))
  if (kvAt) stored.headers.set("X-Edge-KV-At", String(kvAt))
  stored.headers.set("Cache-Control", `public, max-age=${KEEP_SECONDS}`)
  return stored
}

// Store a page the site Worker just rendered in both tiers.
async function storeBoth(res, url, env, writeKv) {
  const html = await res.text()
  const now = Date.now()
  if (writeKv) await kvWrite(env, kvKey(url, env), html, res, now).catch(() => null)
  const kvAt = writeKv && env.HTML_KV ? now : null
  await caches.default.put(cacheKey(url, env), coloCopy(html, res, now, kvAt))
}

async function refresh(request, url, env, kvAt) {
  const fresh = await env.SITE.fetch(new Request(url.toString(), { headers: request.headers, method: "GET" }))
  if (!storable(fresh)) return null
  const kvDue = !kvAt || (Date.now() - kvAt) / 1000 > KV_REWRITE_SECONDS
  await storeBoth(fresh, url, env, kvDue)
  return null
}

function forClient(res, state, siteCacheControl, env) {
  const out = new Response(res.body, res)
  out.headers.set("X-Edge-Cache", state)
  // Which build's cache answered. The id is public (it is in every page's
  // HTML); the post-deploy warm-up waits for it to match the new build.
  out.headers.set("X-Edge-Build", env.BUILD_ID || "none")
  if (siteCacheControl) out.headers.set("Cache-Control", siteCacheControl)
  out.headers.delete("X-Edge-Stored-At")
  out.headers.delete("X-Edge-KV-At")
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
      const kvAt = Number(hit.headers.get("X-Edge-KV-At") || 0) || null
      if (stale) ctx.waitUntil(refresh(request, url, env, kvAt).catch(() => null))
      return forClient(hit, stale ? "STALE" : "HIT", "public, max-age=0, must-revalidate", env)
    }

    // Not in this colo yet: the global KV copy beats starting the site Worker.
    const copy = await kvRead(env, kvKey(url, env))
    if (copy) {
      const stale = (Date.now() - copy.storedAt) / 1000 > FRESH_SECONDS
      ctx.waitUntil(
        (async () => {
          await caches.default.put(key, coloCopy(copy.html, { status: 200, headers: copy.headers }, copy.storedAt, copy.storedAt))
          if (stale) await refresh(request, url, env, copy.storedAt)
        })().catch(() => null),
      )
      const res = new Response(copy.html, { status: 200, headers: copy.headers })
      return forClient(res, stale ? "KV-STALE" : "KV", "public, max-age=0, must-revalidate", env)
    }

    const res = await env.SITE.fetch(request)
    if (request.method === "GET" && storable(res)) {
      const siteCc = res.headers.get("Cache-Control")
      const copy = res.clone()
      ctx.waitUntil(storeBoth(copy, url, env, true).catch(() => null))
      return forClient(res, "MISS", siteCc, env)
    }
    const out = new Response(res.body, res)
    out.headers.set("X-Edge-Build", env.BUILD_ID || "none")
    return out
  },
}

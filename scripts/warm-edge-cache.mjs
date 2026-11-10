#!/usr/bin/env node
// Warm fruition-edge's global HTML copy (Workers KV) right after a production
// deploy, so the first visitor to a page in any colo, PageSpeed Insights
// included, is served from KV instead of starting the 10 MB site Worker cold.
// See workers/edge/index.js.
//
// Usage: node scripts/warm-edge-cache.mjs <site-url> <build-id>
//
// 1. Waits until the live edge Worker runs with the new build id (its
//    X-Edge-Build header), so the warm-up does not fill the previous build's keys.
// 2. Requests every URL in the sitemap once. Each one is an edge MISS that the
//    edge stores in this colo and in KV. Pages come from the ISR cache the
//    deploy just populated, so this makes no Sanity requests for prerendered
//    pages.
//
// It never fails the deploy: a warm-up that does not finish only means some
// pages take the slow path once, as they did before.

const [base = "https://www.fruitionservices.io", buildId = ""] = process.argv.slice(2)
const CONCURRENCY = 6
const HEADERS = { Accept: "text/html", "User-Agent": "fruition-deploy-warmup" }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function servesBuild() {
  if (!buildId) return true
  // HEAD is never stored by the edge, and every edge answer names its build.
  const res = await fetch(`${base}/`, { method: "HEAD", headers: HEADERS })
  return res.headers.get("x-edge-build") === buildId
}

async function main() {
  let live = false
  for (let i = 0; i < 24 && !live; i++) {
    live = await servesBuild().catch(() => false)
    if (!live) await sleep(5000)
  }
  if (!live) {
    console.log(`Build ${buildId} not live after 2 minutes; skipping warm-up.`)
    return
  }

  const xml = await (await fetch(`${base}/sitemap.xml`, { headers: HEADERS })).text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  const tally = {}
  let next = 0
  async function worker() {
    while (next < urls.length) {
      const url = urls[next++]
      try {
        const res = await fetch(url, { headers: HEADERS })
        await res.arrayBuffer()
        const state = `${res.status} ${res.headers.get("x-edge-cache") ?? "-"}`
        tally[state] = (tally[state] ?? 0) + 1
      } catch {
        tally.error = (tally.error ?? 0) + 1
      }
    }
  }
  const started = Date.now()
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  console.log(`Warmed ${urls.length} URLs in ${Math.round((Date.now() - started) / 1000)}s:`, tally)
}

main().catch((e) => console.log("Warm-up skipped:", e?.message ?? e))

// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"
import edge from "./index.js"
import { CONTENT_VERSION_KEY, keyUrl, kvKey } from "./keys.js"

const ENV_BUILD = "build-1"

const gz = (text) =>
  new Response(new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer()
const gunz = (buf) =>
  new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).text()

function memoryCache() {
  const store = new Map()
  return {
    store,
    async match(req) {
      const r = store.get(req.url)
      return r ? r.clone() : undefined
    },
    async put(req, res) {
      store.set(req.url, res.clone())
    },
  }
}

function memoryKv() {
  const store = new Map()
  return {
    store,
    put: vi.fn(async (key, value, opts) => {
      store.set(key, { value, metadata: opts?.metadata ?? null })
    }),
    getWithMetadata: vi.fn(async (key) => store.get(key) ?? { value: null, metadata: null }),
    get: vi.fn(async (key) => (typeof store.get(key)?.value === "string" ? store.get(key).value : null)),
  }
}

function page(body = "<html>page</html>") {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=2592000",
      "X-Nextjs-Cache": "HIT",
      "Server-Timing": "cfWorker;dur=900",
    },
  })
}

function setup() {
  const cache = memoryCache()
  globalThis.caches = { default: cache }
  const kv = memoryKv()
  const site = { fetch: vi.fn(async () => page()) }
  const pending = []
  const ctx = { waitUntil: (p) => pending.push(p) }
  const env = { BUILD_ID: ENV_BUILD, SITE: site, HTML_KV: kv }
  const settle = async () => {
    while (pending.length) await pending.shift()
  }
  return { cache, kv, site, ctx, env, settle }
}

const get = (path, headers = {}) =>
  new Request(`https://www.fruitionservices.io${path}`, { headers: { Accept: "text/html", ...headers } })

describe("fruition-edge cache keys", () => {
  it("drops ad and campaign parameters but keeps real ones", () => {
    const u = keyUrl("https://www.fruitionservices.io/monday-partner-uk?gclid=abc&utm_source=li&page=2&srsltid=x#top")
    expect(u.toString()).toBe("https://www.fruitionservices.io/monday-partner-uk?page=2")
  })

  it("scopes KV keys to the build and host", () => {
    expect(kvKey("https://www.fruitionservices.io/monday-partner-us?utm_medium=cpc", { BUILD_ID: "b9" })).toBe(
      "edge-html/b9/www.fruitionservices.io/monday-partner-us",
    )
  })

  it("skips KV for keys over the KV limit", () => {
    expect(kvKey(`https://www.fruitionservices.io/x?q=${"a".repeat(600)}`, { BUILD_ID: "b" })).toBeNull()
  })
})

describe("fruition-edge", () => {
  let t
  beforeEach(() => {
    t = setup()
  })

  it("stores a MISS in the colo cache and in KV", async () => {
    const res = await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    expect(res.headers.get("X-Edge-Cache")).toBe("MISS")
    expect(await res.text()).toBe("<html>page</html>")
    await t.settle()
    expect(t.cache.store.size).toBe(1)
    const stored = t.kv.store.get(`edge-html/${ENV_BUILD}/www.fruitionservices.io/monday-partner-uk`)
    expect(await gunz(stored.value)).toBe("<html>page</html>")
    expect(stored.metadata.z).toBe(1)
    expect(t.kv.put.mock.calls[0][2].expirationTtl).toBe(3 * 86400)
    expect(stored.metadata.h).toContainEqual(["x-nextjs-cache", "HIT"])
    expect(stored.metadata.h.map(([n]) => n)).not.toContain("server-timing")
  })

  it("serves a tagged URL from the entry the clean URL stored", async () => {
    await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    await t.settle()
    const res = await edge.fetch(get("/monday-partner-uk?gclid=123&utm_campaign=x"), t.env, t.ctx)
    expect(res.headers.get("X-Edge-Cache")).toBe("HIT")
    expect(t.site.fetch).toHaveBeenCalledTimes(1)
  })

  it("serves a colo MISS from KV without waking the site Worker", async () => {
    t.kv.store.set(`edge-html/${ENV_BUILD}/www.fruitionservices.io/monday-partner-au`, {
      value: await gz("<html>from kv</html>"),
      metadata: { t: Date.now(), z: 1, h: [["content-type", "text/html; charset=utf-8"], ["x-nextjs-cache", "HIT"]] },
    })
    const res = await edge.fetch(get("/monday-partner-au"), t.env, t.ctx)
    expect(res.status).toBe(200)
    expect(res.headers.get("X-Edge-Cache")).toBe("KV")
    expect(res.headers.get("Content-Type")).toBe("text/html; charset=utf-8")
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=0, must-revalidate")
    expect(await res.text()).toBe("<html>from kv</html>")
    await t.settle()
    expect(t.site.fetch).not.toHaveBeenCalled()
    // The colo now has it too.
    const again = await edge.fetch(get("/monday-partner-au"), t.env, t.ctx)
    expect(again.headers.get("X-Edge-Cache")).toBe("HIT")
    expect(await again.text()).toBe("<html>from kv</html>")
  })

  it("serves an old KV copy at once and refreshes both tiers in the background", async () => {
    const key = `edge-html/${ENV_BUILD}/www.fruitionservices.io/monday-partner-us`
    t.kv.store.set(key, { value: await gz("<html>old</html>"), metadata: { t: Date.now() - 3600_000, z: 1, h: [] } })
    const res = await edge.fetch(get("/monday-partner-us"), t.env, t.ctx)
    expect(res.headers.get("X-Edge-Cache")).toBe("KV-STALE")
    expect(await res.text()).toBe("<html>old</html>")
    await t.settle()
    expect(t.site.fetch).toHaveBeenCalledTimes(1)
    expect(await gunz(t.kv.store.get(key).value)).toBe("<html>page</html>")
    const next = await edge.fetch(get("/monday-partner-us"), t.env, t.ctx)
    expect(await next.text()).toBe("<html>page</html>")
  })

  it("never reads KV from another build", async () => {
    t.kv.store.set(`edge-html/old-build/www.fruitionservices.io/monday-partner-uk`, {
      value: await gz("<html>old build</html>"),
      metadata: { t: Date.now(), z: 1, h: [] },
    })
    const res = await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    expect(res.headers.get("X-Edge-Cache")).toBe("MISS")
    expect(await res.text()).toBe("<html>page</html>")
  })

  it("falls through to the site Worker when KV fails", async () => {
    t.kv.getWithMetadata.mockRejectedValueOnce(new Error("kv down"))
    const res = await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    expect(res.headers.get("X-Edge-Cache")).toBe("MISS")
    expect(res.status).toBe(200)
  })

  it("works without the KV binding", async () => {
    delete t.env.HTML_KV
    const res = await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    expect(res.headers.get("X-Edge-Cache")).toBe("MISS")
    await t.settle()
    expect(t.cache.store.size).toBe(1)
  })

  it("does not store dynamic or non-HTML responses", async () => {
    t.site.fetch.mockResolvedValueOnce(
      new Response("{}", { status: 200, headers: { "Content-Type": "text/html", "Cache-Control": "private, no-store" } }),
    )
    await edge.fetch(get("/contact-us"), t.env, t.ctx)
    await t.settle()
    expect(t.cache.store.size).toBe(0)
    expect(t.kv.put).not.toHaveBeenCalled()
  })

  it("passes portal, API and RSC requests straight through", async () => {
    await edge.fetch(get("/internal/leads"), t.env, t.ctx)
    await edge.fetch(get("/monday-partner-uk", { RSC: "1" }), t.env, t.ctx)
    await t.settle()
    expect(t.site.fetch).toHaveBeenCalledTimes(2)
    expect(t.kv.getWithMetadata).not.toHaveBeenCalled()
    expect(t.cache.store.size).toBe(0)
  })

  it("only rewrites KV on a background refresh when the KV copy is old", async () => {
    await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    await t.settle()
    expect(t.kv.put).toHaveBeenCalledTimes(1)
    // Age the colo entry past FRESH_SECONDS but keep its KV write recent.
    const [k, r] = [...t.cache.store.entries()][0]
    const aged = new Response(await r.clone().text(), r)
    aged.headers.set("X-Edge-Stored-At", String(Date.now() - 120_000))
    t.cache.store.set(k, aged)
    const res = await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    expect(res.headers.get("X-Edge-Cache")).toBe("STALE")
    await t.settle()
    expect(t.site.fetch).toHaveBeenCalledTimes(2)
    expect(t.kv.put).toHaveBeenCalledTimes(1)
  })
})

describe("fruition-edge build header", () => {
  it("names the build on every answer it handles", async () => {
    const t = setup()
    const miss = await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    await t.settle()
    const hit = await edge.fetch(get("/monday-partner-uk"), t.env, t.ctx)
    const head = await edge.fetch(new Request("https://www.fruitionservices.io/", { method: "HEAD" }), t.env, t.ctx)
    expect(miss.headers.get("X-Edge-Build")).toBe(ENV_BUILD)
    expect(hit.headers.get("X-Edge-Build")).toBe(ENV_BUILD)
    expect(head.headers.get("X-Edge-Build")).toBe(ENV_BUILD)
  })
})

describe("fruition-edge content version (Sanity edits)", () => {
  it("adds the version to KV keys only once one is set", () => {
    expect(kvKey("https://www.fruitionservices.io/hubspot-consulting", { BUILD_ID: "b9" }, "1731")).toBe(
      "edge-html/b9/1731/www.fruitionservices.io/hubspot-consulting",
    )
    expect(kvKey("https://www.fruitionservices.io/hubspot-consulting", { BUILD_ID: "b9" }, "")).toBe(
      "edge-html/b9/www.fruitionservices.io/hubspot-consulting",
    )
  })

  it("fetches every page again after the webhook bumps the version", async () => {
    const t = setup()
    t.site.fetch.mockImplementationOnce(async () => page("<html>before edit</html>"))
    await edge.fetch(get("/hubspot-consulting"), t.env, t.ctx)
    await t.settle()
    const hit = await edge.fetch(get("/hubspot-consulting"), t.env, t.ctx)
    expect(hit.headers.get("X-Edge-Cache")).toBe("HIT")
    expect(await hit.text()).toBe("<html>before edit</html>")

    // The Sanity webhook writes a new content version.
    t.kv.store.set(CONTENT_VERSION_KEY, { value: "1731500000000", metadata: null })
    t.site.fetch.mockImplementationOnce(async () => page("<html>after edit</html>"))
    const after = await edge.fetch(get("/hubspot-consulting"), t.env, t.ctx)
    expect(after.headers.get("X-Edge-Cache")).toBe("MISS")
    expect(await after.text()).toBe("<html>after edit</html>")
    await t.settle()
    expect(t.kv.store.has(`edge-html/${ENV_BUILD}/1731500000000/www.fruitionservices.io/hubspot-consulting`)).toBe(true)
    const next = await edge.fetch(get("/hubspot-consulting"), t.env, t.ctx)
    expect(next.headers.get("X-Edge-Cache")).toBe("HIT")
    expect(await next.text()).toBe("<html>after edit</html>")
  })

  it("does not forward browser conditional headers on a background refresh", async () => {
    const t = setup()
    await edge.fetch(get("/hubspot-consulting"), t.env, t.ctx)
    await t.settle()
    const [k, r] = [...t.cache.store.entries()][0]
    const aged = new Response(await r.clone().text(), r)
    aged.headers.set("X-Edge-Stored-At", String(Date.now() - 120_000))
    t.cache.store.set(k, aged)
    await edge.fetch(get("/hubspot-consulting", { "If-None-Match": '"abc"', "If-Modified-Since": "Tue, 10 Nov 2026 00:00:00 GMT" }), t.env, t.ctx)
    await t.settle()
    const refreshReq = t.site.fetch.mock.calls[1][0]
    expect(refreshReq.headers.get("If-None-Match")).toBeNull()
    expect(refreshReq.headers.get("If-Modified-Since")).toBeNull()
    expect(refreshReq.headers.get("Accept")).toBe("text/html")
  })
})

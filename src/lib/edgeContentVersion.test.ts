import { afterEach, describe, expect, it, vi } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

afterEach(() => {
  vi.resetModules()
  vi.doUnmock("@opennextjs/cloudflare")
})

describe("bumpEdgeContentVersion", () => {
  it("writes the new version to the key fruition-edge reads", async () => {
    const put = vi.fn(async () => {})
    vi.doMock("@opennextjs/cloudflare", () => ({ getCloudflareContext: async () => ({ env: { NEXT_INC_CACHE_KV: { put } } }) }))
    const { bumpEdgeContentVersion, EDGE_CONTENT_VERSION_KEY } = await import("./edgeContentVersion")
    expect(await bumpEdgeContentVersion(1731500000000)).toBe("1731500000000")
    expect(put).toHaveBeenCalledWith(EDGE_CONTENT_VERSION_KEY, "1731500000000")
  })

  it("is a no-op outside the Workers runtime", async () => {
    vi.doMock("@opennextjs/cloudflare", () => ({ getCloudflareContext: async () => { throw new Error("no context") } }))
    const { bumpEdgeContentVersion } = await import("./edgeContentVersion")
    expect(await bumpEdgeContentVersion()).toBeNull()
  })

  it("uses the same key and KV namespace as the edge Worker", async () => {
    const { EDGE_CONTENT_VERSION_KEY } = await import("./edgeContentVersion")
    const keys = readFileSync(join(process.cwd(), "workers/edge/keys.js"), "utf8")
    expect(keys).toContain('`${KV_PREFIX}content-version`')
    expect(keys).toContain('const KV_PREFIX = "edge-html/"')
    expect(EDGE_CONTENT_VERSION_KEY).toBe("edge-html/content-version")
    const strip = (f: string) => readFileSync(join(process.cwd(), f), "utf8").replace(/\/\/.*$/gm, "")
    const site = strip("wrangler.jsonc").match(/"NEXT_INC_CACHE_KV",\s*"id":\s*"(\w+)"/)?.[1]
    const edge = strip("workers/edge/wrangler.jsonc").match(/"HTML_KV",\s*"id":\s*"(\w+)"/)?.[1]
    expect(site).toBeTruthy()
    expect(edge).toBe(site)
  })
})

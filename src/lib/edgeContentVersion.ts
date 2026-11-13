/**
 * Bumps the content version that fruition-edge (workers/edge) puts in its
 * cache keys, so a Sanity edit empties the edge HTML cache everywhere instead
 * of waiting for each colo's stale copy to be refreshed.
 *
 * The edge reads the value from its HTML_KV binding; that is the same KV
 * namespace as this Worker's NEXT_INC_CACHE_KV (wrangler.jsonc), so the site
 * can write it. Keep the key in step with CONTENT_VERSION_KEY in
 * workers/edge/keys.js. Outside the Workers runtime (next dev, tests) there is
 * no binding and this is a no-op.
 */
export const EDGE_CONTENT_VERSION_KEY = "edge-html/content-version"

interface KvLike {
  put(key: string, value: string): Promise<void>
}

export async function bumpEdgeContentVersion(now: number = Date.now()): Promise<string | null> {
  let kv: KvLike | undefined
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare")
    const { env } = await getCloudflareContext({ async: true })
    kv = (env as { NEXT_INC_CACHE_KV?: KvLike }).NEXT_INC_CACHE_KV
  } catch {
    return null
  }
  if (!kv) return null
  const version = String(now)
  await kv.put(EDGE_CONTENT_VERSION_KEY, version)
  return version
}

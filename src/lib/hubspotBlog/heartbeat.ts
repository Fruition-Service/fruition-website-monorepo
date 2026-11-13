/**
 * Last-run marker for the HubSpot blog sync, kept in the NEXT_INC_CACHE_KV
 * namespace. The Worker's logs need Cloudflare account access; this lets
 * anyone with HUBSPOT_SYNC_SECRET see whether the cron is running
 * (GET /api/cron/hubspot-blog-sync). No-op outside the Workers runtime.
 */

const KEY = "hubspot-blog-sync/last-run"

interface KvLike {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

async function kv(): Promise<KvLike | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare")
    const { env } = await getCloudflareContext({ async: true })
    return (env as { NEXT_INC_CACHE_KV?: KvLike }).NEXT_INC_CACHE_KV ?? null
  } catch {
    return null
  }
}

export async function recordRun(run: Record<string, unknown>): Promise<void> {
  const store = await kv()
  await store?.put(KEY, JSON.stringify({ at: new Date().toISOString(), ...run })).catch(() => undefined)
}

export async function lastRun(): Promise<unknown> {
  const raw = await (await kv())?.get(KEY).catch(() => null)
  return raw ? JSON.parse(raw) : null
}

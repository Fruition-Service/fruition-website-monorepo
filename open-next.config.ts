import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import kvNextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";

// Persistent ISR cache in Workers KV (NEXT_INC_CACHE_KV binding in
// wrangler.jsonc). Without it every isolate re-rendered pages from scratch,
// firing the full set of Sanity queries per render — which is what blew the
// Sanity API CDN request quota. The regional cache layer keeps hot entries in
// the colo's Cache API to cut KV reads too.
//
// The tag cache (NEXT_TAG_CACHE_KV) is what makes `revalidatePath()` work.
// Without it the adapter falls back to the "dummy" tag cache, on-demand
// revalidation is a silent no-op, and a cached page stays frozen until the
// next deploy — which is why editing a published blog post never showed up on
// the site. The portal's publish route revalidates the affected paths; see
// src/lib/revalidateSite.ts.
//
// KV rather than D1 because the deploy pipeline's Cloudflare token has Workers
// KV rights but not D1, and `opennextjs-cloudflare upload` provisions a D1 tag
// cache's table at deploy time (a KV one needs no provisioning). The cost is
// consistency: KV can take up to ~60s to propagate a write to every colo, so a
// revalidation is near-instant in practice but not guaranteed immediate. Give
// the token `Account · D1 · Edit` and this becomes a two-line swap to
// `d1-next-tag-cache` + a NEXT_TAG_CACHE_D1 binding, which is strongly
// consistent.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
  tagCache: kvNextTagCache,
});

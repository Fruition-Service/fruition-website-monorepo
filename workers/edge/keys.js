// Cache keys for fruition-edge (index.js). Kept apart so tests can import them;
// a Worker entry module should only export its handler.

const KV_PREFIX = "edge-html/"
// KV keys are capped at 512 bytes; longer URLs just skip the KV tier.
const KV_MAX_KEY = 480

// Query parameters that only feed analytics and ad attribution, never the page.
const TRACKING_PARAM = /^(utm_[a-z0-9_]+|gclid|gclsrc|gbraid|wbraid|dclid|gad_source|gad_campaignid|fbclid|msclkid|li_fat_id|ttclid|twclid|igshid|mc_cid|mc_eid|_hsenc|_hsmi|hsa_[a-z_]+|_gl|srsltid|ref_src)$/i

export function keyUrl(url) {
  const k = new URL(url)
  k.hash = ""
  for (const name of [...k.searchParams.keys()]) {
    if (TRACKING_PARAM.test(name)) k.searchParams.delete(name)
  }
  return k
}

export function kvKey(url, env) {
  const k = keyUrl(url)
  const key = `${KV_PREFIX}${env.BUILD_ID || "none"}/${k.host}${k.pathname}${k.search}`
  return key.length <= KV_MAX_KEY ? key : null
}

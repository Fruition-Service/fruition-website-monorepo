import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Verify a Sanity GROQ webhook's `sanity-webhook-signature` header.
 *
 * Sanity signs `${t}.${rawBody}` with HMAC-SHA256 using the webhook's secret
 * and sends `t=<unix ms>,v1=<base64url digest>`. This is the same check the
 * @sanity/webhook package runs, without adding it as a dependency.
 */
export function isValidSanitySignature(header: string | null, body: string, secret: string): boolean {
  if (!header || !secret) return false
  const parts = new Map<string, string>()
  for (const kv of header.split(",")) {
    const i = kv.indexOf("=")
    if (i > 0) parts.set(kv.slice(0, i).trim(), kv.slice(i + 1).trim())
  }
  const t = parts.get("t")
  const v1 = parts.get("v1")
  if (!t || !v1 || !/^\d+$/.test(t)) return false
  const expected = createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url")
  const a = Buffer.from(expected)
  const b = Buffer.from(v1.replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_"))
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Build a signature header the way Sanity does. Used by tests and the smoke script. */
export function signSanityWebhook(body: string, secret: string, t: number = Date.now()): string {
  const digest = createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url")
  return `t=${t},v1=${digest}`
}

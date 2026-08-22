/**
 * The text half of the link shortener — no database, no server.
 *
 * Split out from `shortLinks.ts` so the composer can do the one thing it needs
 * in the browser: say how long a caption will be AFTER its links are swapped.
 * X is the reason. Zernio counts raw characters, so a post carrying a long URL
 * reads as over the 280 limit while the version that actually gets sent fits
 * comfortably — and being blocked from sending a post that would have been
 * fine is worse than no shortener at all.
 *
 * `shortLinks.ts` re-exports everything here, so server code has one import.
 */

const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fruitionservices.io").replace(/\/+$/, "")

/** Codes are fixed-length, so every shortened URL is exactly this long. */
export const CODE_LENGTH = 6

export function shortLinkUrl(code: string): string {
  return `${SITE_BASE}/s/${code}`
}

export const SHORT_URL_LENGTH = shortLinkUrl("x".repeat(CODE_LENGTH)).length

/** Every URL in a block of text, with trailing sentence punctuation trimmed. */
export function urlsIn(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(/https?:\/\/[^\s<>"'`]+/gi)) {
    // Trailing punctuation is almost always the sentence, not the URL. A
    // closing bracket belongs to the URL only if the URL opened one.
    let url = m[0].replace(/[.,;:!?]+$/, "")
    while (url.endsWith(")") && url.split(")").length > url.split("(").length) url = url.slice(0, -1)
    while (url.endsWith("]") && url.split("]").length > url.split("[").length) url = url.slice(0, -1)
    if (url && !out.includes(url)) out.push(url)
  }
  return out
}

/** Only absolute http(s) links are worth shortening, and only sane ones. */
export function isShortenable(url: string): boolean {
  if (!/^https?:\/\//i.test(url) || url.length > 2000) return false
  if (url.startsWith(`${SITE_BASE}/s/`)) return false // already ours
  return url.length > SHORT_URL_LENGTH
}

/**
 * Characters the caption loses once its links are shortened. Counted per
 * occurrence, because every instance of the same URL is replaced.
 */
export function shorteningSaving(text: string): number {
  let saved = 0
  for (const url of urlsIn(text)) {
    if (!isShortenable(url)) continue
    const occurrences = text.split(url).length - 1
    saved += occurrences * (url.length - SHORT_URL_LENGTH)
  }
  return saved
}

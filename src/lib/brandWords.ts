/**
 * Vendor names that take their own brand colour inside H1 headings: every
 * "Atlassian" is Atlassian blue and every "HubSpot" is HubSpot orange. The
 * wording never changes; only a colour span is added around the word.
 *
 * Site pages (Version C heroes) use `splitBrandWords` through `<Acc brands>`
 * with the `text-atlassian` / `text-hubspot` utilities (tokens in globals.css).
 * Ad landing pages are standalone HTML, so `withBrandH1` adds
 * `brand-atlassian` / `brand-hubspot` classes styled in landingPageTheme.ts.
 */
export type BrandWord = "atlassian" | "hubspot"

const BRAND_RE = /\b(Atlassian|HubSpot)\b/gi

export type BrandPart = { text: string; brand?: BrandWord }

/** "Jira by Atlassian" → [{text:"Jira by "}, {text:"Atlassian", brand:"atlassian"}] */
export function splitBrandWords(text: string): BrandPart[] {
  const parts: BrandPart[] = []
  let last = 0
  for (const m of text.matchAll(BRAND_RE)) {
    const at = m.index ?? 0
    if (at > last) parts.push({ text: text.slice(last, at) })
    parts.push({ text: m[0], brand: m[0].toLowerCase() as BrandWord })
    last = at + m[0].length
  }
  if (last < text.length || parts.length === 0) parts.push({ text: text.slice(last) })
  return parts
}

/** Wraps vendor names in every `<h1>` of an HTML document; tags and attributes are left alone. */
export function withBrandH1(html: string): string {
  return html.replace(/(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/gi, (_, open: string, inner: string, close: string) => {
    const body = inner
      .split(/(<[^>]+>)/)
      .map((seg) =>
        seg.startsWith("<")
          ? seg
          : seg.replace(BRAND_RE, (w) => `<span class="brand-${w.toLowerCase()}">${w}</span>`),
      )
      .join("")
    return open + body + close
  })
}

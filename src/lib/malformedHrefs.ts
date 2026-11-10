/**
 * Finds malformed link targets anywhere in a Sanity document (monday 2904193295).
 *
 * Pure logic, no I/O. `scripts/scan-malformed-hrefs.ts` fetches documents and
 * prints what this finds. Two kinds of hit:
 *
 * - "embedded-scheme" (definite): the href holds "http://" or "https://" more
 *   than once, or anywhere other than the start, e.g.
 *   "/monday-partner-ukhttps://www.fruitionservices.io/monday-partner-uk".
 * - "domain-in-path" (review): another URL is glued into the path or query of
 *   this one: our own domain anywhere in it, or a host followed by a path
 *   ("foo.com/bar"). A bare brand name in a slug ("...-Earns-monday.com-Platinum-...")
 *   is normal for press releases and is not reported. These need a human look.
 */

export type MalformedKind = "embedded-scheme" | "domain-in-path"

export type MalformedHref = {
  /** Sanity path to the value, e.g. body[_key=="a1"].markDefs[_key=="m2"].href */
  path: string
  href: string
  kind: MalformedKind
}

const SCHEME = /https?:\/\//gi
/** Field names whose string values are link targets. */
const LINK_FIELD = /^(?:href|url|link|[a-z]+(?:Href|Url|URL|Link))$/
const TLDS = "com|net|org|io|ai|co|app|dev|info|biz|uk|au|nz|sg|us|ca|de|fr|in|me|tv|xyz"
/** A host followed by a path, e.g. "foo.com/bar". */
const HOST_WITH_PATH = new RegExp(`(?<![a-z0-9-])(?:[a-z0-9-]+\\.)+(?:${TLDS})\\/[^/]`, "i")
const OWN_DOMAIN = /fruitionservices\.io/i

export function classifyHref(href: string): MalformedKind | null {
  const h = href.trim()
  const schemes = [...h.matchAll(SCHEME)].map((m) => m.index ?? 0)
  if (schemes.length > 1 || (schemes.length === 1 && schemes[0] !== 0)) return "embedded-scheme"
  if (schemes.length === 1) {
    let rest: string
    try {
      const u = new URL(h)
      rest = decodeURIComponent(u.pathname + u.search)
    } catch {
      return null
    }
    if (OWN_DOMAIN.test(rest) || HOST_WITH_PATH.test(rest)) return "domain-in-path"
  }
  return null
}

function segment(key: string | number, item: unknown): string {
  if (typeof key === "number") {
    const k = (item as { _key?: unknown } | null)?._key
    return typeof k === "string" ? `[_key=="${k}"]` : `[${key}]`
  }
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `["${key}"]`
}

/** Walk a document and return every malformed link value with its path. */
export function findMalformedHrefs(doc: unknown): MalformedHref[] {
  const out: MalformedHref[] = []
  const walk = (value: unknown, path: string, key: string | null) => {
    if (typeof value === "string") {
      if (key && LINK_FIELD.test(key)) {
        const kind = classifyHref(value)
        if (kind) out.push({ path: path.replace(/^\./, ""), href: value, kind })
      }
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, path + segment(i, item), null))
      return
    }
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, path + segment(k, v), k)
    }
  }
  walk(doc, "", null)
  return out
}

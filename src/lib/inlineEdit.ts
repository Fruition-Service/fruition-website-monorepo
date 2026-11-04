/**
 * Shared helpers for the inline website editor (src/components/edit/ and
 * /api/internal/edit/*). Pure functions, so the browser overlay and the save
 * route agree on what a field reference looks like.
 *
 * A field reference comes from the stega source map Sanity hides in every
 * edit-mode string: the document id plus a Studio-style path such as
 * `faq.items[_key=="faq-0"].answer`. That path syntax is also what Sanity's
 * patch API accepts, so it goes to the save route unchanged.
 */

export interface FieldRef {
  id: string
  type: string
  path: string
}

type Segment = string | number | { _key: string }

const DOC_ID = /^[A-Za-z0-9][\w.-]{0,127}$/
const SEGMENT = /^(?:[A-Za-z_][\w]*)?((?:\[(?:\d+|_key=="[\w-]+")\])*)$/

/** Read the field reference out of a decoded stega `href`. */
export function parseStegaHref(href: string): FieldRef | null {
  const q = href.indexOf("?")
  if (q < 0) return null
  const params = new URLSearchParams(href.slice(q + 1))
  const id = params.get("id")
  const type = params.get("type")
  const path = params.get("path")
  if (!id || !type || !path) return null
  return { id, type, path }
}

/** Published id for a draft or version id (`drafts.x` → `x`). */
export function publishedId(id: string): string {
  return id.startsWith("drafts.") ? id.slice("drafts.".length) : id.replace(/^versions\.[^.]+\./, "")
}

export function isSafeDocId(id: string): boolean {
  return DOC_ID.test(id)
}

/** Split a Studio path into segments, or null if it is not one we accept. */
export function parsePath(path: string): Segment[] | null {
  if (!path || path.length > 500) return null
  const out: Segment[] = []
  for (const part of path.split(".")) {
    const m = SEGMENT.exec(part)
    if (!m || (!part.startsWith("[") && !/^[A-Za-z_]/.test(part))) return null
    const name = part.slice(0, part.length - m[1].length)
    if (name) {
      if (name.startsWith("_")) return null
      out.push(name)
    }
    for (const idx of m[1].match(/\[[^\]]+\]/g) ?? []) {
      const inner = idx.slice(1, -1)
      out.push(/^\d+$/.test(inner) ? Number(inner) : { _key: inner.slice(7, -1) })
    }
  }
  return out.length ? out : null
}

/** Walk a parsed path into a document. */
export function getAtPath(doc: unknown, segments: Segment[]): unknown {
  let cur: unknown = doc
  for (const seg of segments) {
    if (cur == null) return undefined
    if (typeof seg === "string") cur = (cur as Record<string, unknown>)[seg]
    else if (typeof seg === "number") cur = Array.isArray(cur) ? cur[seg] : undefined
    else cur = Array.isArray(cur) ? cur.find((x) => x && (x as { _key?: string })._key === seg._key) : undefined
  }
  return cur
}

/** Only same-site paths, so the enable/disable routes can't be open redirects. */
export function safeReturnPath(p: string | null | undefined): string {
  if (!p || !p.startsWith("/") || p.startsWith("//") || p.startsWith("/\\")) return "/"
  return p
}

/** Edit mode is for public pages; these never render CMS copy to edit. */
export function isEditablePagePath(p: string): boolean {
  return !/^\/(internal|studio|api)(\/|$)/.test(p)
}

const SANITY_IMAGE = /^https:\/\/cdn\.sanity\.io\/images\/[\w-]+\/[\w-]+\/([a-f0-9]+)-(\d+x\d+)\.(\w+)/

/**
 * Sanity image asset id (`image-<hash>-<WxH>-<ext>`) behind an <img> src.
 * Accepts the CDN URL itself or a Next image-optimiser URL wrapping it.
 */
export function assetIdFromImageUrl(src: string): string | null {
  let url = src
  try {
    const u = new URL(src, "https://www.fruitionservices.io")
    const inner = u.pathname === "/_next/image" ? u.searchParams.get("url") : null
    url = inner ?? u.href
  } catch {
    return null
  }
  const m = SANITY_IMAGE.exec(url)
  return m ? `image-${m[1]}-${m[2]}-${m[3]}` : null
}

/**
 * Patch paths (Studio syntax) of every image object in a document that points
 * at `assetId`. Array items are addressed by `_key` when they have one.
 */
export function findImagePaths(doc: unknown, assetId: string): string[] {
  const out: string[] = []
  const walk = (v: unknown, path: string) => {
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        const key = item && typeof item === "object" ? (item as { _key?: unknown })._key : undefined
        walk(item, `${path}[${typeof key === "string" && /^[\w-]+$/.test(key) ? `_key=="${key}"` : i}]`)
      })
    } else if (v && typeof v === "object") {
      const asset = (v as { asset?: { _ref?: unknown } }).asset
      if (path && asset?._ref === assetId) {
        out.push(path)
        return
      }
      for (const [k, child] of Object.entries(v)) {
        if (k.startsWith("_")) continue
        walk(child, path ? `${path}.${k}` : k)
      }
    }
  }
  walk(doc, "")
  return out
}

/** Document types that carry a page's own `seoTitle` + `seoDescription`. */
export const SEO_DOC_TYPES = new Set([
  "page", "servicePage", "solutionPage", "industryPage", "partnershipPage", "aiPartnerPage",
  "locationPage", "blogPost", "homePage", "implementationPackagesPage", "licensingPage",
  "makePartnersPage", "mondayImplementationConsultantsPage", "mondayTrainingPage", "practicePage",
])

export interface MetaCandidate {
  id: string
  type: string
  slug?: string | null
}

/**
 * Which document holds this page's meta title and description.
 *
 * `head` are documents whose strings reached the <title> or meta tags (stega
 * markers survive into <head>): the first SEO-capable one is the answer. With
 * no field set the head falls back to code and carries no marker, so the
 * documents shown in the body are tried next. A listing page shows many
 * (blog cards, partner tiles), so several candidates only resolve when one
 * slug matches the URL's last segment; otherwise the answer is "unknown"
 * rather than a guess that would retitle the wrong page.
 */
export function pickMetaDoc<T extends MetaCandidate>(head: T[], body: T[], pagePath: string): T | null {
  const fromHead = head.find((d) => SEO_DOC_TYPES.has(d.type))
  if (fromHead) return fromHead
  const seen = new Set<string>()
  const cands = body.filter((d) => SEO_DOC_TYPES.has(d.type) && !seen.has(d.id) && seen.add(d.id))
  if (cands.length === 1) return cands[0]
  const last = pagePath.split("?")[0].split("/").filter(Boolean).pop()
  const bySlug = last ? cands.filter((d) => d.slug === last) : []
  return bySlug.length === 1 ? bySlug[0] : null
}

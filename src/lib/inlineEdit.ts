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

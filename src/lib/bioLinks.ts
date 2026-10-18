/**
 * Inline links inside team-member bios.
 *
 * `teamMember.bio` is a plain `text` field in Sanity, edited in Studio and in
 * the portal's team editor. To let a bio carry links without changing the
 * field type, a bio may contain markdown-style links: `[Kelin Studio](https://kelin.studio)`.
 *
 * Deliberately links-only. The blog's `parseInlineMarkdown` also reads `*`
 * and `_` as emphasis, which would silently restyle existing bios that happen
 * to contain them. Here every character outside a well-formed `[text](url)`
 * with an http(s) URL stays literal text, so bios without link syntax render
 * exactly as before. Anything else (`javascript:`, relative paths, `mailto:`)
 * is left as the literal characters the editor typed.
 */

export type BioSegment = { text: string; href?: undefined } | { text: string; href: string }

const LINK_RE = /\[([^\[\]\n]+)\]\((https?:\/\/[^\s()]+)\)/g

function isHttpUrl(href: string): boolean {
  try {
    const u = new URL(href)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

/** Split a bio into plain-text and link segments. Empty segments are never emitted. */
export function parseBioLinks(bio: string): BioSegment[] {
  const out: BioSegment[] = []
  let idx = 0
  let plain = ""
  for (const m of bio.matchAll(LINK_RE)) {
    const start = m.index ?? 0
    plain += bio.slice(idx, start)
    const label = m[1].trim()
    if (label && isHttpUrl(m[2])) {
      if (plain) out.push({ text: plain })
      plain = ""
      out.push({ text: label, href: m[2] })
    } else {
      plain += m[0]
    }
    idx = start + m[0].length
  }
  plain += bio.slice(idx)
  if (plain) out.push({ text: plain })
  return out
}

/** The bio as plain text, with link syntax reduced to its label (for meta descriptions). */
export function bioPlainText(bio: string): string {
  return parseBioLinks(bio)
    .map((s) => s.text)
    .join("")
}

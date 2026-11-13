/**
 * HubSpot blog HTML → the markdown subset the Fruition blog stores.
 *
 * HubSpot's rich-text editor emits plain, predictable HTML (p, h2-h4, ul/ol,
 * strong/em, a, img, blockquote, table, br). The portal and Sanity speak a
 * markdown subset instead (see bodyToPortableText in sanityWriteClient.ts),
 * so this walks the HTML tree and writes exactly that subset:
 *
 *   - h1..h6 → `#`..`####` (deeper levels clamp to h4)
 *   - p / div → paragraphs; br → a space (paragraph soft-wraps are joined)
 *   - ul / ol → `- ` / `1. ` lines (nesting flattens to one level)
 *   - blockquote → `> ` lines
 *   - strong/b, em/i, a[href] → `**`, `*`, `[text](url)`
 *   - img → a lone `![alt](src)` line, which sideloadBodyImages re-hosts
 *   - table → a GFM pipe table
 *
 * Anything else contributes its text. Pure: no network, no DOM globals and no
 * parser dependency (the Worker is near its size cap), so it runs the same in the Worker, in vitest and in a one-off script.
 */

import { parseHtml, HTMLElement, TextNode, type Node } from "./miniHtml"

const BLOCK_TAGS = new Set([
  "p", "div", "section", "article", "header", "footer", "figure", "figcaption",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "table",
  "pre", "hr",
])

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, ", ")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
}

const squash = (s: string) => s.replace(/\s+/g, " ")

/** Wrap a run in a markdown mark, keeping surrounding spaces outside it. */
function wrap(text: string, mark: string): string {
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text)
  if (!m || !m[2]) return text
  return `${m[1]}${mark}${m[2]}${mark}${m[3]}`
}

/** Inline content of an element, as one line of inline markdown. */
function inline(node: Node): string {
  if (node instanceof TextNode) return squash(decodeEntities(node.rawText))
  if (!(node instanceof HTMLElement)) return ""
  const tag = node.tagName?.toLowerCase() ?? ""
  if (tag === "br") return " "
  if (tag === "img") return "" // images are lifted to their own line by blocks()
  if (tag === "script" || tag === "style") return ""
  const inner = node.childNodes.map(inline).join("")
  if (tag === "strong" || tag === "b") return wrap(inner, "**")
  if (tag === "em" || tag === "i") return wrap(inner, "*")
  if (tag === "a") {
    const href = (node.getAttribute("href") ?? "").trim()
    const text = inner.trim()
    if (!href || !text || href.startsWith("#") || href.startsWith("javascript:")) return inner
    return `[${text.replace(/[[\]]/g, "")}](${href.replace(/\s/g, "%20")})`
  }
  return inner
}

function imageLine(img: HTMLElement): string | null {
  const src = (img.getAttribute("src") ?? "").trim()
  if (!/^https?:\/\//i.test(src)) return null
  const w = Number(img.getAttribute("width") ?? "0")
  const h = Number(img.getAttribute("height") ?? "0")
  if (w === 1 && h === 1) return null // tracking pixel
  const alt = squash(decodeEntities(img.getAttribute("alt") ?? "")).replace(/[[\]]/g, "").trim()
  return `![${alt}](${src.replace(/\s/g, "%20")})`
}

function cellText(cell: HTMLElement): string {
  return inline(cell).trim().replace(/\|/g, "\\|")
}

function table(el: HTMLElement): string[] {
  const rows = el.querySelectorAll("tr").map((tr) =>
    tr.childNodes
      .filter((c): c is HTMLElement => c instanceof HTMLElement && /^(td|th)$/i.test(c.tagName))
      .map(cellText),
  ).filter((r) => r.length > 0)
  if (rows.length === 0) return []
  const cols = Math.max(...rows.map((r) => r.length))
  const pad = (r: string[]) => [...r, ...Array(cols - r.length).fill("")]
  const line = (r: string[]) => `| ${pad(r).join(" | ")} |`
  return [line(rows[0]), line(Array(cols).fill("---")), ...rows.slice(1).map(line)]
}

/** True when an element holds block-level children we should recurse into. */
function hasBlockChildren(el: HTMLElement): boolean {
  return el.childNodes.some(
    (c) => c instanceof HTMLElement && BLOCK_TAGS.has(c.tagName?.toLowerCase() ?? ""),
  )
}

/** Emit the markdown blocks for one node. Each entry is one block. */
function blocks(node: Node, out: string[]): void {
  if (node instanceof TextNode) {
    const t = squash(decodeEntities(node.rawText)).trim()
    if (t) out.push(t)
    return
  }
  if (!(node instanceof HTMLElement)) return
  const tag = node.tagName?.toLowerCase() ?? ""
  if (!tag) {
    // The parse root: walk its children.
    for (const c of node.childNodes) blocks(c, out)
    return
  }
  if (tag === "script" || tag === "style" || tag === "hr") return

  // Lift images out of whatever wraps them so each sits on its own line.
  const images = tag === "img" ? [node] : node.querySelectorAll("img")
  const imageLines = images.map(imageLine).filter((l): l is string => Boolean(l))

  if (tag === "img") {
    out.push(...imageLines)
    return
  }
  if (/^h[1-6]$/.test(tag)) {
    const level = Math.min(Number(tag[1]), 4)
    const text = inline(node).trim().replace(/\*\*/g, "")
    if (text) out.push(`${"#".repeat(level)} ${text}`)
    out.push(...imageLines)
    return
  }
  if (tag === "ul" || tag === "ol") {
    let n = 0
    for (const li of node.querySelectorAll("li")) {
      // Only text directly in this li, not in a nested list (flattened separately).
      const own = li.childNodes
        .filter((c) => !(c instanceof HTMLElement && /^(ul|ol)$/i.test(c.tagName)))
        .map(inline)
        .join("")
        .trim()
      if (!own) continue
      n += 1
      out.push(tag === "ol" ? `${n}. ${own}` : `- ${own}`)
    }
    out.push(...imageLines)
    return
  }
  if (tag === "blockquote") {
    const inner: string[] = []
    if (hasBlockChildren(node)) for (const c of node.childNodes) blocks(c, inner)
    else inner.push(inline(node).trim())
    for (const b of inner) if (b && !b.startsWith("![")) out.push(`> ${b.replace(/^> /, "")}`)
    out.push(...imageLines)
    return
  }
  if (tag === "table") {
    const t = table(node)
    if (t.length) out.push(t.join("\n"))
    return
  }
  if (hasBlockChildren(node)) {
    for (const c of node.childNodes) blocks(c, out)
    return
  }
  const text = inline(node).trim()
  if (text) out.push(text)
  out.push(...imageLines)
}

export function htmlToMarkdown(html: string): string {
  const root = parseHtml(html ?? "")
  const out: string[] = []
  blocks(root, out)
  return liftHeadings(
    out
      .map((b) => b.trim())
      .filter(Boolean)
      .join("\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  )
}

/**
 * Shift headings so the top level is h2, the level Fruition posts use for
 * sections (the page title is the h1). Framer posts start at h3.
 */
export function liftHeadings(md: string): string {
  const levels = [...md.matchAll(/^(#{1,4}) /gm)].map((m) => m[1].length)
  if (levels.length === 0) return md
  const shift = Math.min(...levels) - 2
  if (shift <= 0) return md
  return md.replace(/^(#{1,4}) /gm, (_, h: string) => `${"#".repeat(Math.max(2, h.length - shift))} `)
}

/** Plain text of an HTML snippet (for excerpts). */
export function htmlToText(html: string): string {
  return squash(decodeEntities(parseHtml(html ?? "").text)).trim()
}

/**
 * Posts written for OG Labs name OG Labs as the firm doing the work. On the
 * Fruition site that has to read Fruition: same people, other brand.
 */
export function toFruitionBrand(s: string): string {
  return s
    .replace(/\bOG\s?Labs\b/g, "Fruition")
    .replace(/https?:\/\/(www\.)?oglabs\.io/gi, "https://www.fruitionservices.io")
    .replace(/\boglabs\.io\b/gi, "fruitionservices.io")
}

/**
 * A deliberately small HTML tree builder, enough for HubSpot's rich-text
 * output. Exposes the handful of members htmlToMarkdown.ts uses, with the same
 * names node-html-parser has, so the converter reads naturally.
 *
 * Not a general parser: no CDATA, no implied <tbody>/<p> rules beyond closing
 * whatever is open when an end tag arrives. Kept in-house because every
 * dependency counts against the Worker's 10 MiB limit.
 */

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
])
const RAW = new Set(["script", "style"])

export abstract class Node {
  parent: HTMLElement | null = null
  abstract get text(): string
}

export class TextNode extends Node {
  constructor(public rawText: string) {
    super()
  }
  get text(): string {
    return this.rawText
  }
}

export class HTMLElement extends Node {
  childNodes: Node[] = []
  constructor(
    /** Upper-case tag name like the DOM; "" for the parse root. */
    public tagName: string,
    private attrs: Record<string, string> = {},
  ) {
    super()
  }
  getAttribute(name: string): string | undefined {
    return this.attrs[name.toLowerCase()]
  }
  get text(): string {
    return this.childNodes.map((c) => c.text).join("")
  }
  /** Descendants with one of the given tag names (lower case), document order. */
  querySelectorAll(tags: string): HTMLElement[] {
    const want = new Set(tags.split(",").map((t) => t.trim().toLowerCase()))
    const out: HTMLElement[] = []
    const walk = (el: HTMLElement) => {
      for (const c of el.childNodes) {
        if (!(c instanceof HTMLElement)) continue
        if (want.has(c.tagName.toLowerCase())) out.push(c)
        walk(c)
      }
    }
    walk(this)
    return out
  }
}

function parseAttrs(src: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? ""
  }
  return attrs
}

export function parseHtml(html: string): HTMLElement {
  const root = new HTMLElement("")
  const stack: HTMLElement[] = [root]
  const top = () => stack[stack.length - 1]
  const append = (n: Node) => {
    n.parent = top()
    top().childNodes.push(n)
  }
  const tagRe = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!doctype[^>]*>|<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/gi
  let last = 0
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(html)) !== null) {
    if (m.index > last) append(new TextNode(html.slice(last, m.index)))
    last = tagRe.lastIndex
    const name = m[1]?.toLowerCase()
    if (!name) continue // comment / doctype
    const isEnd = m[0].startsWith("</")
    if (isEnd) {
      // Close up to the matching open tag; ignore a stray end tag.
      const idx = stack.map((e) => e.tagName.toLowerCase()).lastIndexOf(name)
      if (idx > 0) stack.length = idx
      continue
    }
    const el = new HTMLElement(name.toUpperCase(), parseAttrs(m[2] ?? ""))
    append(el)
    if (VOID.has(name) || /\/\s*$/.test(m[2] ?? "")) continue
    if (RAW.has(name)) {
      // Skip raw text up to the closing tag; its content is never wanted.
      const close = html.toLowerCase().indexOf(`</${name}`, last)
      const end = close === -1 ? html.length : html.indexOf(">", close) + 1 || html.length
      last = end
      tagRe.lastIndex = end
      continue
    }
    stack.push(el)
  }
  if (last < html.length) append(new TextNode(html.slice(last)))
  return root
}

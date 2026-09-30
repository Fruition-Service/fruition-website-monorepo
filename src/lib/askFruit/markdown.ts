/**
 * Block-level markdown for Ask Fruit replies: paragraphs, bullet and numbered
 * lists, headings and pipe tables. Inline marks and links reuse the site's
 * tokenizer (src/lib/inlineMarkdown.ts).
 *
 * Proploy used react-markdown + remark-gfm. The prompt limits Fruit to this
 * subset, the Worker bundle has little headroom, and building React elements
 * from a tiny AST means model output never reaches the DOM as HTML.
 */

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }

const BULLET = /^\s*[-*•]\s+(.*)$/
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/
const HEADING = /^\s*#{1,6}\s+(.*)$/
const TABLE_ROW = /^\s*\|.*\|\s*$/
const TABLE_RULE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/

function cells(line: string): string[] {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim())
}

/**
 * The inline tokenizer cannot bold a link (see inlineMarkdown.ts), so a model
 * that writes **[Solar CRM](/x)** would show the asterisks. A link already
 * stands out; drop the emphasis around it.
 */
function unwrapEmphasisedLinks(markdown: string): string {
  return markdown.replace(/(\*\*|__)(\[[^\]]+\]\([^)\s]+\))\1/g, "$2")
}

export function parseBlocks(markdown: string): Block[] {
  const lines = unwrapEmphasisedLinks(markdown).replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let paragraph: string[] = []

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() })
    paragraph = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) {
      flush()
      continue
    }
    const heading = line.match(HEADING)
    if (heading) {
      flush()
      blocks.push({ type: "heading", text: heading[1].trim() })
      continue
    }
    if (TABLE_ROW.test(line) && i + 1 < lines.length && TABLE_RULE.test(lines[i + 1])) {
      flush()
      const header = cells(line)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && TABLE_ROW.test(lines[i])) rows.push(cells(lines[i++]))
      i--
      blocks.push({ type: "table", header, rows })
      continue
    }
    const bullet = line.match(BULLET)
    const numbered = bullet ? null : line.match(NUMBERED)
    if (bullet || numbered) {
      flush()
      const ordered = Boolean(numbered)
      const items = [(bullet ?? numbered)![1]]
      while (i + 1 < lines.length) {
        const next = lines[i + 1]
        const m = ordered ? next.match(NUMBERED) : next.match(BULLET)
        if (m) {
          items.push(m[1])
          i++
        } else if (next.trim() && /^\s{2,}\S/.test(next)) {
          // Indented continuation of the previous item.
          items[items.length - 1] += ` ${next.trim()}`
          i++
        } else break
      }
      blocks.push({ type: "list", ordered, items })
      continue
    }
    paragraph.push(line.trim())
  }
  flush()
  return blocks
}

/** Only site-relative, https and mailto links render as links; anything else stays text. */
export function safeHref(href: string): string | null {
  const h = href.trim()
  if (/^\/(?!\/)/.test(h)) return h
  if (/^https:\/\//i.test(h) || /^mailto:/i.test(h)) return h
  return null
}

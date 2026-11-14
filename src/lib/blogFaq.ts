import type { PortableTextBlock } from "@portabletext/types"

/**
 * Pulls a blog post's FAQ block out of the body so the Version C post template
 * can show it in the FAQ accordion (approved mock-up, 14 Nov 2026).
 *
 * Marketa and the editors write FAQs as an "FAQs" H2 followed by H3 questions,
 * each with its answer paragraphs (219 of the 221 posts with an FAQ heading in
 * Nov 2026). The block ends at the next H1/H2 or at the end of the body. Only
 * that exact shape moves: if anything sits between the heading and the first
 * question, or an answer holds an image, table, video or deeper heading, the
 * body is returned untouched so nothing is dropped or reshaped.
 */

interface Node {
  _type?: string
  style?: string
  listItem?: string
  children?: unknown[]
}

export interface BlogFaqItem {
  question: string
  answer: PortableTextBlock[]
}

export interface BlogFaq {
  /** The heading's own text ("FAQs"), kept verbatim. */
  heading: string
  /** Anchor id, the same slug the heading had in the body. */
  id: string
  items: BlogFaqItem[]
}

const FAQ_HEADING = /^\s*(faqs?|frequently asked questions)\b/i

const text = (b: Node) =>
  (b.children ?? []).map((c) => ((c as { text?: unknown })?.text ?? "")).filter((t): t is string => typeof t === "string").join("").trim()
const isBlock = (b: Node | undefined) => !!b && b._type === "block"
const isTopHeading = (b: Node | undefined) => isBlock(b) && !b!.listItem && (b!.style === "h1" || b!.style === "h2")
const isQuestion = (b: Node | undefined) => isBlock(b) && !b!.listItem && b!.style === "h3"
/** Answer content the accordion renders faithfully: paragraphs, quotes and list lines. */
const isAnswerBlock = (b: Node) => isBlock(b) && (!!b.listItem || b.style === "normal" || b.style === "blockquote" || !b.style)

export function extractBlogFaq<T extends Node>(
  body: T[] | undefined | null,
  slugify: (s: string) => string,
): { body: T[]; faq: BlogFaq | null } {
  const all = body ?? []
  const start = all.findIndex((b) => isTopHeading(b) && FAQ_HEADING.test(text(b)))
  if (start < 0 || !isQuestion(all[start + 1])) return { body: all, faq: null }
  let end = all.length
  for (let i = start + 1; i < all.length; i++) {
    if (isTopHeading(all[i])) {
      end = i
      break
    }
  }
  const items: BlogFaqItem[] = []
  for (let i = start + 1; i < end; i++) {
    const b = all[i]
    if (isQuestion(b)) {
      const q = text(b)
      if (!q) return { body: all, faq: null }
      items.push({ question: q, answer: [] })
    } else if (isAnswerBlock(b)) {
      items[items.length - 1].answer.push(b as unknown as PortableTextBlock)
    } else {
      return { body: all, faq: null }
    }
  }
  if (!items.length || items.some((it) => !it.answer.length)) return { body: all, faq: null }
  const heading = text(all[start])
  return {
    body: [...all.slice(0, start), ...all.slice(end)],
    faq: { heading, id: slugify(heading) || "faqs", items },
  }
}

/**
 * Chat-driven editing of a generated design document.
 *
 * The model receives the current document HTML plus the conversation and
 * replies with a short message and zero or more SEARCH/REPLACE edit blocks
 * (or, for sweeping restructures, a complete replacement document). The
 * client parses the reply, applies the blocks to the HTML string locally and
 * saves via PATCH /api/internal/design/docs/[id].
 *
 * Shared by the edit API route (prompt) and the viewer client (parse/apply) —
 * keep this file free of server-only imports.
 *
 * The style rules the model must respect are derived from the document's
 * template rather than restated here, so they cannot drift from theme/.
 */

import { getTemplate } from "./templates"

/** The class list, kept short — the editing model needs the vocabulary, not the spec. */
const VOCABULARY_SUMMARY =
  "fr-doc, fr-cover, fr-eyebrow, fr-title, fr-meta/fr-meta-item, fr-toc, fr-section, fr-sublabel, fr-table (fr-name), fr-callout, fr-figure (fr-figure-flow, fr-node, fr-arrow), fr-signoff (fr-signer, fr-signer-name, fr-signer-role, fr-sig-field, fr-date-field, fr-field-label), fr-footer, and for decks fr-deck, fr-slide, fr-slide-title, fr-slide-body, fr-cols, fr-stats/fr-stat, fr-slide-foot"

/** Marker lines for an edit block. Kept in one place so prompt and parser can't drift. */
const SEARCH_MARK = "<<<<<<< SEARCH"
const DIVIDE_MARK = "======="
const REPLACE_MARK = ">>>>>>> REPLACE"

export function buildEditPrompt(templateId: string | null | undefined): string {
  const template = getTemplate(templateId)
  const legacy = !templateId || templateId === "legacy"

  // Legacy documents carry their own model-authored CSS inline; new ones are
  // semantic HTML with the stylesheet attached at render time. The rule the
  // editing model must follow differs completely between the two.
  const styleRules = legacy
    ? `- This document carries its own <style> block. Keep the styling consistent with it and keep the document a single self-contained file (no newly *loaded* external resources — scripts, stylesheets, fonts, images).
- Every colored/tinted element keeps -webkit-print-color-adjust: exact; print-color-adjust: exact;
- Preserve pagination-friendly print CSS: no fixed heights, no 100vh, long tables break between rows (thead as table-header-group), break-inside: avoid only on units smaller than a page.`
    : `- Write NO CSS. This document has no <style> block and must not gain one: the Fruition stylesheet is attached automatically at render time. Never add a <style> block, a stylesheet <link>, or a style="…" attribute — any CSS you add will fight the stylesheet.
- Style comes only from the class vocabulary: ${VOCABULARY_SUMMARY}. Do not invent classes.
- \`fr-section\` headings number themselves. Never type a number into an <h2> or into a table-of-contents <li>.`

  return `You are Fruition's brand document designer, now in EDITING mode. The user has an existing Fruition-branded single-file HTML document (a ${template.label}). You make the changes they ask for.

# How to respond
- Start with a one-or-two sentence plain-language summary of what you changed (or an answer, if they only asked a question).
- Then output one edit block per change, in EXACTLY this format:

${SEARCH_MARK}
(a verbatim snippet copied from the current document)
${DIVIDE_MARK}
(the replacement for that snippet)
${REPLACE_MARK}

# Edit block rules
- The SEARCH text must be copied EXACTLY from the current document — character for character, including whitespace and attribute order — or it will not apply.
- Keep each SEARCH as short as possible while still being unique in the document. Include a line or two of surrounding context if the target text appears more than once.
- Use multiple small blocks rather than one giant block. Each block's SEARCH must match exactly once.
- To insert content, SEARCH for the adjacent existing markup and include it unchanged in the replacement alongside the new content.
- To delete content, make the replacement empty (nothing between ${DIVIDE_MARK} and ${REPLACE_MARK}).
- Never use an edit block for anything except real changes to the document.

# Full rewrite (rare)
If the request is so sweeping that patching is impractical (e.g. "restructure the whole document"), output the complete new document instead of edit blocks: your summary sentence, then the full HTML starting with <!DOCTYPE html> and ending with </html>.

# Rules that must hold after your edits
${styleRules}
- Links are content — preserve them. Never delete a link or turn it into inert plain text, and never alter the URL. When you add or move a link (e.g. to an interactive diagram such as Mermaid Live or a monday.com board), embed it as a real working anchor: <a href="THE-EXACT-URL" target="_blank" rel="noopener">…</a> with the exact absolute URL.
- Diagrams need extra care. When editing a figure card or recreated diagram, keep every node label and every connection intact, and keep any interactive-diagram link working — a diagram behind a broken or missing link is a defect.
- Never modify, expand, or re-emit the Fruition logo data URI — treat any <img src="data:..."> as opaque and leave its src untouched.
- "monday.com"/"monday" always lowercase. No emoji.

If the user asks a question or something needs no document change, just answer in plain language with no edit blocks.`
}

/** One parsed SEARCH/REPLACE block. */
export interface DocEdit {
  search: string
  replace: string
}

export interface ParsedEditResponse {
  /** Assistant prose with edit blocks / full document removed. */
  reply: string
  edits: DocEdit[]
  /** Present when the model chose a full-document rewrite. */
  fullHtml: string | null
}

/** Extract a complete HTML document from mixed text, if one is present. */
function extractFullHtml(text: string): string | null {
  const start = text.search(/<!doctype html/i)
  if (start === -1) return null
  const end = text.toLowerCase().lastIndexOf("</html>")
  return end === -1 ? text.slice(start) : text.slice(start, end + "</html>".length)
}

/** Parse a completed assistant response into prose, edit blocks and/or a full document. */
export function parseEditResponse(text: string): ParsedEditResponse {
  const fullHtml = extractFullHtml(text)
  if (fullHtml) {
    const reply = text.slice(0, text.search(/<!doctype html/i)).replace(/```\w*\s*$/, "").trim()
    return { reply, edits: [], fullHtml }
  }

  const edits: DocEdit[] = []
  const prose: string[] = []
  const lines = text.split("\n")
  let i = 0
  while (i < lines.length) {
    if (lines[i].trim() === SEARCH_MARK) {
      const search: string[] = []
      const replace: string[] = []
      let j = i + 1
      while (j < lines.length && lines[j].trim() !== DIVIDE_MARK) search.push(lines[j++])
      j++ // past =======
      while (j < lines.length && lines[j].trim() !== REPLACE_MARK) replace.push(lines[j++])
      if (j < lines.length) {
        // complete block
        edits.push({ search: search.join("\n"), replace: replace.join("\n") })
        i = j + 1
        continue
      }
      // truncated block — treat the rest as prose so nothing half-applies
    }
    // Drop fence lines the model sometimes wraps blocks in.
    if (!/^```/.test(lines[i].trim())) prose.push(lines[i])
    i++
  }
  return { reply: prose.join("\n").trim(), edits, fullHtml: null }
}

export interface ApplyResult {
  html: string
  applied: number
  /** 1-based indices of blocks whose SEARCH text wasn't found exactly once. */
  failed: number[]
}

/**
 * Apply edit blocks to the document. A block only applies when its SEARCH text
 * occurs exactly once — ambiguous or missing matches are reported, not guessed.
 */
export function applyEdits(html: string, edits: DocEdit[]): ApplyResult {
  let out = html
  let applied = 0
  const failed: number[] = []
  edits.forEach((edit, idx) => {
    if (!edit.search) {
      failed.push(idx + 1)
      return
    }
    const first = out.indexOf(edit.search)
    const unique = first !== -1 && out.indexOf(edit.search, first + 1) === -1
    if (!unique) {
      failed.push(idx + 1)
      return
    }
    out = out.slice(0, first) + edit.replace + out.slice(first + edit.search.length)
    applied++
  })
  return { html: out, applied, failed }
}

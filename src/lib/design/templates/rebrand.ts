import type { DocTemplate } from "./types"

/**
 * The catch-all: apply the Fruition look to a document whose own structure must
 * survive intact. This is the template that makes "turn any random document into
 * the Fruition theme" work, and its defining rule is restraint — it imposes no
 * cover, no numbering and no section order of its own.
 */
export const rebrand: DocTemplate = {
  id: "rebrand",
  label: "Plain rebrand (keep structure)",
  description: "Repaint any document in Fruition styling, leaving its own structure untouched.",
  stylesheet: "doc",
  structure: `# Structure: plain rebrand — KEEP THE SOURCE'S OWN STRUCTURE

This template imposes NO structure of its own. The source document's organisation is correct by
definition; your job is only to dress it in the Fruition vocabulary.

- Put \`class="fr-doc fr-doc--unnumbered"\` on the root wrapper. Section numbering is OFF: if the
  source numbers its headings, type those numbers as part of the heading text exactly as the
  source has them. If it doesn't number them, they stay unnumbered.
- Keep the source's own heading hierarchy and wording. Its first heading is the document's title —
  render it as \`<h1 class="fr-title">\` inside a plain \`<header>\`, NOT a gradient cover card.
- Do NOT add a cover card, a table of contents, an executive summary, a sign-off block or a
  running footer unless the source itself has that element.
- Do NOT reorder, merge, split or renumber sections.
- Map what the source already has onto the vocabulary, and nothing more:
  its sections → \`<section class="fr-section">\`, its tables → \`<table class="fr-table">\`,
  its pull-quotes / notes / warnings → \`<div class="fr-callout">\`,
  its diagrams → \`<div class="fr-figure">\`, its small uppercase labels → \`<p class="fr-sublabel">\`.
- When a piece of source content has no matching class, use plain semantic HTML
  (\`<p>\`, \`<ul>\`, \`<blockquote>\`, \`<h3>\`). Plain HTML is already styled — that is fine and
  expected. Never invent a class that isn't in the vocabulary.

If you find yourself adding an element the source doesn't have, stop: that belongs to a different
template, not this one.`,
}

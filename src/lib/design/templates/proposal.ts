import type { DocTemplate } from "./types"

export const proposal: DocTemplate = {
  id: "proposal",
  label: "Proposal / SOW",
  description: "Client-facing proposal or statement of work, ending in an acceptance block.",
  stylesheet: "doc",
  structure: `# Structure: proposal / statement of work

Emit, in this order:

1. \`<header class="fr-cover">\` — as for any Fruition document: logo + partner tag, an
   \`<p class="fr-eyebrow">\` of "PROPOSAL" or "STATEMENT OF WORK" (match the source),
   \`<h1 class="fr-title">\`, and an \`<dl class="fr-meta">\` of the meta the source provides
   (typically PREPARED FOR, PREPARED BY, DATE, and a validity date if one is given).
2. A \`<section class="fr-section">\` headed "Executive summary" — two or three paragraphs drawn
   ONLY from the source. If the source has no summary, omit this section rather than writing one.
3. \`<section class="fr-section">\` for scope / approach, in the source's own order.
4. Deliverables as a \`<table class="fr-table">\`. Give the identifier/ref column first; put the
   deliverable name in \`<td class="fr-name">\`.
5. Timeline or phases — a \`<table class="fr-table">\` when the source is tabular, otherwise a
   \`<div class="fr-figure">\` flow of \`<span class="fr-node">\` phases joined by
   \`<span class="fr-arrow">→</span>\`.
6. Commercials — a \`<table class="fr-table">\`. Reproduce every line item, quantity, rate, total,
   currency and tax note EXACTLY. Never recompute, round or reformat a number.
7. Assumptions, exclusions and terms — \`<section class="fr-section">\` each, using
   \`<p class="fr-sublabel">\` for sub-labels. Put anything the source flags as important in a
   \`<div class="fr-callout">\`.
8. \`<section class="fr-signoff">\` — an acceptance block with a signer card per party.
9. \`<footer class="fr-footer">\`.

Commercial accuracy outranks everything else here. A wrong figure is a far worse defect than an
imperfect layout.`,
}

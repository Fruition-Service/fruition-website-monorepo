import type { DocTemplate } from "./types"

export const report: DocTemplate = {
  id: "report",
  label: "Report / whitepaper",
  description: "Findings, audit or research document. No signature block.",
  stylesheet: "doc",
  structure: `# Structure: report / whitepaper

Emit, in this order:

1. \`<header class="fr-cover">\` — \`<p class="fr-eyebrow">\` of "REPORT", "AUDIT" or whatever type
   the source implies; \`<h1 class="fr-title">\`; \`<dl class="fr-meta">\` with the meta the source
   gives (typically AUTHOR, DATE, and a period covered).
2. \`<nav class="fr-toc">\` when there are 3 or more top-level sections.
3. A "Key findings" \`<section class="fr-section">\` ONLY if the source has one — as a list, with
   each finding's lead-in bolded. Do not synthesise findings the source does not state.
4. One \`<section class="fr-section">\` per top-level section, \`<h2>\` title only (numbering is
   automatic). \`<h3>\` for sub-sections, \`<p class="fr-sublabel">\` for in-section labels.
5. Data as \`<table class="fr-table">\`, every row and cell preserved. Charts and diagrams become
   \`<div class="fr-figure">\` per the diagram rules — including every series, axis label and value.
6. Notable statements, caveats and limitations as \`<div class="fr-callout">\`.
7. Appendices, references, footnotes and methodology notes as ordinary sections at the end.
   These are content: reproduce them in full, never trim them as boilerplate.
8. \`<footer class="fr-footer">\`.

There is NO sign-off block in a report. Do not emit \`fr-signoff\` even if the source has a
distribution or approval list — render that as an ordinary section or table.`,
}

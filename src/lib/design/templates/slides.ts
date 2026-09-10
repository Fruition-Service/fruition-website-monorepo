import type { DocTemplate } from "./types"

export const slides: DocTemplate = {
  id: "slides",
  label: "Slide deck",
  description: "16:9 presentation deck, exportable to PDF one slide per page.",
  stylesheet: "slides",
  structure: `# Structure: 16:9 slide deck

Wrap everything in \`<div class="fr-deck">\`. Every slide is
\`<section class="fr-slide">\` containing \`<h2 class="fr-slide-title">\` and
\`<div class="fr-slide-body">\`.

Slide kinds:
- \`<section class="fr-slide fr-slide--title">\` — the opening slide. The logo img, an
  \`<p class="fr-eyebrow">\` of the deck type, and \`<h1 class="fr-slide-title">\` with the title.
  Follow it with a \`<p>\` of presenter and date if the source gives them.
- \`<section class="fr-slide fr-slide--section">\` — a dark chapter divider. Title only. Use one
  before each major part of a long deck.
- \`<section class="fr-slide">\` — a content slide.

Inside \`.fr-slide-body\` use: short \`<ul>\` bullets, \`<div class="fr-cols">\` for two columns,
\`<div class="fr-stats">\` of \`<div class="fr-stat"><div class="fr-stat-value">500+</div><div class="fr-stat-label">implementations</div></div>\`
for figures, \`<table class="fr-table">\`, \`<div class="fr-callout">\`, and
\`<div class="fr-figure">\` for diagrams.

End every content slide with \`<div class="fr-slide-foot"><span>Fruition Services</span></div>\`.
The slide number appends itself — never type one.

# Fitting content to slides

This is the one template where a slide CAN overflow its page, and an overflowing slide is a
defect. A slide holds roughly 6 bullets of about 12 words, or one table of about 7 rows, or one
figure card.

- **Split, never shrink.** When a source section carries more than fits, break it across several
  slides and continue the title as "Title (cont.)". Never compress the content to fit.
- Preserving all source content still applies in full — splitting is how you honour it here.
- One idea per slide. A source heading with a lot under it becomes a divider slide followed by
  several content slides.`,
}

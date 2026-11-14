/**
 * The Fruition document stylesheet — the `fr-*` class vocabulary the model
 * writes HTML against, plus the print/pagination rules.
 *
 * This file replaces ~60 lines of English prose in the old system prompt that
 * described this styling and left the model to re-author the CSS on every run.
 * Owning the CSS here means every document is identical, print bugs are fixed
 * once, and fixes reach already-saved documents (the stylesheet is injected at
 * render time, never persisted).
 *
 * Pagination rules are the delicate part. `break-inside: avoid` is applied ONLY
 * to units guaranteed shorter than a page — an oversized avoid causes a
 * page-sized blank gap and then slices the element anyway.
 */
export const FRUITION_DOC_CSS = `
/* ─── Page ─────────────────────────────────────────────── */
/* The bottom margin is deep enough to hold the running footer. A fixed footer
   at bottom:0 sits INSIDE the content box, so on every page but the last it
   paints over the text; the footer is pushed down into this margin instead. */
@page { size: A4; margin: 18mm 16mm 26mm; }

html, body { background: var(--background); }
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--doc-text-size);
  line-height: var(--leading-body);
  color: var(--text-body);
  -webkit-font-smoothing: antialiased;
}

.fr-doc {
  counter-reset: fr-section;
  max-width: var(--doc-measure);
  margin: 0 auto;
  padding: var(--space-12) var(--doc-gutter) var(--space-16);
}

/* ─── Cover ────────────────────────────────────────────── */
.fr-cover {
  border-radius: 28px;
  padding: var(--space-12) 52px;
  margin-bottom: var(--space-10);
  background: var(--doc-cover-gradient);
  color: var(--text-on-dark);
  break-inside: avoid;
}
.fr-cover-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}
.fr-cover-top img { height: 34px; width: auto; }
.fr-partner-tag {
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  font-size: 12px;
  font-weight: var(--weight-semibold);
  color: #c9b3ef;
}
.fr-cover .fr-eyebrow { margin-top: var(--space-10); color: var(--purple-light); }
.fr-title {
  margin: var(--space-3) 0 0;
  font-size: 46px;
  font-weight: var(--weight-semibold);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  color: var(--text-on-dark);
}
.fr-meta { display: flex; flex-wrap: wrap; gap: 56px; margin-top: 28px; }
.fr-meta-item { display: flex; flex-direction: column; gap: var(--space-1); }
.fr-meta-item dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.6);
}
.fr-meta-item dd {
  margin: 0;
  font-size: var(--doc-text-size);
  font-weight: var(--weight-medium);
  color: var(--text-on-dark);
}

/* ─── Eyebrows & sub-labels ────────────────────────────── */
.fr-eyebrow {
  text-transform: uppercase;
  font-size: 12px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--purple-primary);
  margin: 0;
}
.fr-sublabel {
  text-transform: uppercase;
  font-size: 13px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.1em;
  color: var(--purple-primary);
  margin: 28px 0 var(--space-3);
}

/* ─── Table of contents ────────────────────────────────── */
.fr-toc { margin: var(--space-10) 0; }
.fr-toc > .fr-eyebrow { font-size: 13px; letter-spacing: var(--tracking-eyebrow); margin-bottom: var(--space-3); }
.fr-toc ol { margin: 0; padding-left: 1.4em; }
.fr-toc li { font-size: 18px; line-height: 2; color: var(--text-body); }
.fr-toc a { color: inherit; text-decoration: none; }

/* ─── Sections ─────────────────────────────────────────── */
/* Numbering is a CSS counter, not something the model has to get right. */
.fr-section { margin: var(--space-12) 0 0; }
.fr-section > h2 {
  font-size: 28px;
  font-weight: var(--weight-semibold);
  line-height: var(--leading-heading);
  color: var(--foreground);
  margin: 0 0 var(--space-4);
}
.fr-section > h2::before {
  counter-increment: fr-section;
  content: counter(fr-section) ". ";
  color: var(--purple-primary);
}
/* Opt out for templates that keep the source's own headings (rebrand). */
.fr-doc--unnumbered { counter-reset: none; }
.fr-doc--unnumbered .fr-section > h2::before { content: none; }

.fr-section h3 {
  font-size: 22px;
  font-weight: var(--weight-semibold);
  color: var(--foreground);
  margin: var(--space-8) 0 var(--space-3);
}

/* ─── Body & lists ─────────────────────────────────────── */
p { margin: 0 0 14px; }
a { color: var(--link); }
ul, ol { margin: 0 0 14px; padding-left: 1.3em; }
li { margin-bottom: 10px; }
li > strong:first-child { color: var(--foreground); }
strong { font-weight: var(--weight-semibold); }

/* ─── Tables ───────────────────────────────────────────── */
.fr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  margin: var(--space-5) 0;
}
.fr-table th {
  background: var(--purple-tint);
  text-transform: uppercase;
  color: var(--purple-primary);
  font-weight: var(--weight-bold);
  font-size: 13px;
  letter-spacing: 0.06em;
  text-align: left;
  padding: 14px var(--space-4);
  border-bottom: 2px solid var(--purple-primary);
}
.fr-table td {
  padding: var(--space-4);
  vertical-align: top;
  border-bottom: 1px solid var(--border-soft);
}
/* Ref codes are short identifiers — wrapping "B-02" to "B-"/"02" reads as a typo. */
.fr-table td:first-child { color: var(--purple-primary); font-weight: var(--weight-bold); white-space: nowrap; }
.fr-table td.fr-name { color: var(--foreground); font-weight: var(--weight-semibold); }

/* ─── Callout ──────────────────────────────────────────── */
.fr-callout {
  background: var(--purple-tint);
  border-radius: var(--radius-chip);
  border-left: 4px solid var(--purple-primary);
  padding: var(--space-4) var(--space-5);
  margin: var(--space-5) 0;
  color: var(--text-body);
  break-inside: avoid;
}

/* ─── Figure card (diagrams that can't be redrawn) ─────── */
.fr-figure {
  border-radius: var(--radius-card);
  background: var(--doc-figure-bg);
  color: var(--doc-figure-text);
  padding: var(--space-10);
  margin: var(--space-6) 0;
  break-inside: avoid;
}
.fr-figure .fr-eyebrow { color: var(--purple-light); font-size: 13px; letter-spacing: 0.1em; }
.fr-figure a { color: var(--purple-light); font-weight: var(--weight-semibold); text-decoration: underline; }
.fr-figure-flow { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); margin-top: var(--space-4); }
.fr-node {
  background: #1f0f47;
  color: var(--doc-figure-text);
  border: 1px solid rgba(186, 131, 240, 0.35);
  border-radius: var(--radius-chip);
  padding: 10px var(--space-4);
  font-size: 14px;
}
.fr-arrow { color: var(--purple-light); font-weight: var(--weight-bold); }

/* ─── Sign-off ─────────────────────────────────────────── */
.fr-signoff { display: flex; flex-wrap: wrap; gap: var(--space-6); margin: var(--space-8) 0; }
.fr-signer {
  flex: 1 1 260px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 28px;
  background: var(--surface-card);
  break-inside: avoid;
}
.fr-signer .fr-eyebrow { font-size: 12px; letter-spacing: 0.1em; }
.fr-signer-name { font-weight: var(--weight-bold); font-size: 20px; color: var(--foreground); margin: var(--space-2) 0 var(--space-1); }
.fr-signer-role { font-size: 14px; color: var(--text-muted); margin: 0 0 var(--space-5); }
.fr-sig-field, .fr-date-field {
  background: var(--purple-tint);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-chip);
}
.fr-sig-field { height: 64px; }
.fr-date-field { height: 52px; width: 50%; margin-top: var(--space-5); }
.fr-field-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-top: var(--space-2);
}

/* ─── Running footer ───────────────────────────────────── */
.fr-footer {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  border-top: 1px solid var(--color-border);
  padding: 10px var(--doc-gutter);
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  background: var(--background);
}
.fr-doc { padding-bottom: var(--space-16); }

/* ─── Print ────────────────────────────────────────────── */
@media print {
  html, body { height: auto !important; min-height: 0 !important; background: #fff; }
  .fr-doc { padding: 0; max-width: none; }
  /* Chrome seats a fixed element at the bottom of the CONTENT box, not the page,
     and a negative offset makes it wrap onto the next page instead of sitting in
     the margin (verified). So the clearance comes from the deep @page bottom
     margin above, which keeps text off the footer band. */
  .fr-footer { padding-left: 0; padding-right: 0; }
  a { color: inherit; text-decoration: none; }
  .fr-figure a { text-decoration: underline; }
  h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; break-inside: avoid; }
  p { orphans: 3; widows: 3; }
  /* Long tables flow row by row with a repeating header — never held together. */
  table { break-inside: auto !important; page-break-inside: auto !important; }
  thead { display: table-header-group; }
  tr, li, img, figure, blockquote { break-inside: avoid; page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`

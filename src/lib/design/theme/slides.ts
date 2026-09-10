/**
 * The Fruition slide-deck stylesheet — 16:9 pages built on the same tokens as
 * doc.ts, so a deck and a document cannot drift apart visually.
 *
 * Geometry is the whole difference. A4 portrait with @page margins is wrong for
 * slides: each .fr-slide is its own full-bleed landscape page with padding of
 * its own, so the export produces one slide per page with no A4 leakage.
 * 297mm x 167mm is 16:9 at A4 width, which every browser print path handles.
 */
export const FRUITION_SLIDES_CSS = `
@page { size: 297mm 167mm; margin: 0; }

html, body { background: var(--background); }
body {
  margin: 0;
  font-family: var(--font-sans);
  line-height: var(--leading-body);
  color: var(--text-body);
  -webkit-font-smoothing: antialiased;
}

.fr-deck { counter-reset: fr-slide; }

.fr-slide {
  position: relative;
  box-sizing: border-box;
  width: 297mm;
  height: 167mm;
  padding: 22mm 24mm 18mm;
  margin: 0 auto 8mm;
  background: var(--background);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  break-inside: avoid;
  break-after: page;
}
.fr-slide:last-child { break-after: auto; margin-bottom: 0; }

/* Title slide — the deck's cover, in the brand gradient. */
.fr-slide--title {
  background: var(--doc-cover-gradient);
  color: var(--text-on-dark);
  justify-content: center;
}
.fr-slide--title .fr-slide-title { font-size: 54px; color: var(--text-on-dark); }
.fr-slide--title .fr-eyebrow { color: var(--purple-light); }
/* align-self, or the flex column stretches the logo and centres the artwork. */
.fr-slide--title img { height: 38px; width: auto; align-self: flex-start; margin-bottom: var(--space-10); }

/* Section divider — dark, used to break the deck into chapters. */
.fr-slide--section {
  background: var(--dark-bg);
  color: var(--text-on-dark);
  justify-content: center;
}
.fr-slide--section .fr-slide-title { color: var(--text-on-dark); }

.fr-slide-title {
  font-size: 40px;
  font-weight: var(--weight-semibold);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  color: var(--foreground);
  margin: 0 0 var(--space-6);
}
.fr-slide-body { flex: 1; font-size: 20px; min-height: 0; }
.fr-slide-body > :last-child { margin-bottom: 0; }
.fr-slide-body ul, .fr-slide-body ol { padding-left: 1.2em; }
.fr-slide-body li { margin-bottom: var(--space-3); }

/* Two-column slide body. */
.fr-cols { display: flex; gap: var(--space-10); }
.fr-cols > * { flex: 1; min-width: 0; }

/* Stat row — the deck's proof-led moment. */
.fr-stats { display: flex; gap: var(--space-10); margin-top: var(--space-6); }
.fr-stat { flex: 1; }
.fr-stat-value {
  font-size: 48px;
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-display);
  color: var(--purple-primary);
  line-height: 1.1;
}
.fr-stat-label { font-size: 15px; color: var(--text-muted); margin-top: var(--space-2); }

/* Shared vocabulary, resized for the larger canvas. */
.fr-eyebrow {
  text-transform: uppercase;
  font-size: 14px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  color: var(--purple-primary);
  margin: 0 0 var(--space-4);
}
.fr-table { width: 100%; border-collapse: collapse; font-size: 17px; }
.fr-table th {
  background: var(--purple-tint);
  text-transform: uppercase;
  color: var(--purple-primary);
  font-weight: var(--weight-bold);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border-bottom: 2px solid var(--purple-primary);
}
.fr-table td { padding: var(--space-3) var(--space-4); vertical-align: top; border-bottom: 1px solid var(--border-soft); }
.fr-callout {
  background: var(--purple-tint);
  border-radius: var(--radius-chip);
  border-left: 4px solid var(--purple-primary);
  padding: var(--space-4) var(--space-5);
  margin: var(--space-5) 0;
}
.fr-figure {
  border-radius: var(--radius-card);
  background: var(--doc-figure-bg);
  color: var(--doc-figure-text);
  padding: var(--space-6);
  margin: var(--space-4) 0;
}
.fr-figure a { color: var(--purple-light); font-weight: var(--weight-semibold); text-decoration: underline; }
.fr-figure-flow { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.fr-node {
  background: #1f0f47;
  color: var(--doc-figure-text);
  border: 1px solid rgba(186, 131, 240, 0.35);
  border-radius: var(--radius-chip);
  padding: var(--space-2) var(--space-3);
  font-size: 15px;
}
.fr-arrow { color: var(--purple-light); font-weight: var(--weight-bold); }
a { color: var(--link); }
p { margin: 0 0 var(--space-4); }

/* Slide footer — number auto-increments, so the model never writes one. */
.fr-slide-foot {
  position: absolute;
  left: 24mm; right: 24mm; bottom: 10mm;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-muted);
}
.fr-slide--title .fr-slide-foot, .fr-slide--section .fr-slide-foot { display: none; }
.fr-slide { counter-increment: fr-slide; }
.fr-slide-foot::after { content: counter(fr-slide); }

@media print {
  html, body { height: auto !important; background: #fff; }
  .fr-slide { margin: 0 auto; }
  a { color: inherit; }
  .fr-figure a { text-decoration: underline; }
  tr, li, img, figure { break-inside: avoid; page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`

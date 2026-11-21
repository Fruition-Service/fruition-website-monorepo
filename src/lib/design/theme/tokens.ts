/**
 * Fruition design tokens for generated documents.
 *
 * Vendored from the Fruition Design System package (a Claude Design export,
 * itself reverse-engineered from this repo's own src/app/globals.css). The
 * brand values below are the canonical ones — where the old prose prompt had
 * drifted (heading weight 700 vs 600, hairline #eceaf3 vs #dedee5, a different
 * gradient angle), the design system wins and the document-only variants are
 * named explicitly in the `--doc-*` block rather than smuggled in as one-offs.
 *
 * Kept as a TS string rather than a .css file because the Cloudflare Worker has
 * no filesystem — the same reason PRINT_FIX_CSS was already a string constant.
 * See theme/DESIGN.md for the prose that explains these choices.
 */
export const FRUITION_TOKENS_CSS = `
:root {
  /* ---- Brand purple ramp ---- */
  --purple-primary: #8015e8;
  --purple-light: #ba83f0;
  --purple-dark: #550e9b;
  --purple-tint: #f7f5ff;
  --purple-tint-2: #f5edfd;

  /* ---- Dark surfaces (deep indigo) ---- */
  --dark-bg: #10003a;
  --dark-bg-secondary: #2b074d;

  /* ---- Neutrals ---- */
  --background: #ffffff;
  --foreground: #171717;
  --text-dark: #242323;
  --text-secondary: #686b82;
  --color-border: #dedee5;
  --border-soft: #ece7fb;
  --light-section-bg: #ecf1fc;

  /* ---- Interaction accent (monday blue) ---- */
  --blue-accent: #579bfc;
  --blue-press: #4674fb;

  /* ---- Semantic aliases ---- */
  --text-body: var(--text-dark);
  --text-muted: var(--text-secondary);
  --text-on-dark: #ffffff;
  --link: var(--purple-primary);
  --surface-card: #ffffff;
  --surface-subtle: var(--purple-tint);
  --accent: var(--purple-primary);

  /* ---- Type ---- */
  --font-sans: "Poppins", system-ui, -apple-system, sans-serif;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --leading-body: 1.55;
  --leading-heading: 1.25;
  --leading-display: 1.2;
  --tracking-display: -0.02em;
  --tracking-h2: -0.015em;
  --tracking-eyebrow: 0.12em;

  /* ---- Spacing (4px base) ---- */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px;  --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;

  /* ---- Radius ---- */
  --radius-badge: 8px;
  --radius-chip: 12px;
  --radius-card: 24px;
  --radius-pill: 9999px;

  /* ---- Document-only tokens ----
     Print geometry and the two dark treatments that exist only in documents.
     Named here so they are auditable rather than inlined per-element. */
  --doc-measure: 820px;
  --doc-gutter: 48px;
  --doc-cover-gradient: linear-gradient(120deg, #12013a 0%, #2b074d 42%, #7d18e0 100%);
  --doc-figure-bg: #150a33;
  --doc-figure-text: #e7e2f5;
  --doc-text-size: 16px;
}
`

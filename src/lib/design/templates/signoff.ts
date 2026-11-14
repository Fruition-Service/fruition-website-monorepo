import type { DocTemplate } from "./types"

/**
 * The original Design-function format, preserved verbatim as one template among
 * several. Structure ported from the pre-template prompt; every styling rule it
 * used to carry now lives in theme/doc.ts.
 */
export const signoff: DocTemplate = {
  id: "signoff",
  label: "Sign-off / process design",
  description: "Approval document with signature blocks — the original Fruition format.",
  stylesheet: "doc",
  structure: `# Structure: workflow process design sign-off

Emit, in this order:

1. \`<header class="fr-cover">\` — cover card.
   - \`<div class="fr-cover-top">\` with the logo img and \`<span class="fr-partner-tag">MONDAY.COM PLATINUM PARTNER</span>\`.
   - \`<p class="fr-eyebrow">\` = the document TYPE derived from the source (e.g. "WORKFLOW PROCESS DESIGN SIGN-OFF").
   - \`<h1 class="fr-title">\` = the document title.
   - \`<dl class="fr-meta">\` with one \`<div class="fr-meta-item"><dt>LABEL</dt><dd>value</dd></div>\` per meta fact
     the source actually provides (typically PRESENTED BY and DATE). Omit meta the source doesn't give.
2. \`<nav class="fr-toc">\` — include ONLY when the document has 3 or more top-level sections.
   An \`<p class="fr-eyebrow">TABLE OF CONTENTS</p>\` then \`<ol>\` of the section titles.
   Do not write the numbers yourself — the list numbers itself.
3. One \`<section class="fr-section">\` per top-level section, each opening with \`<h2>\`.
   Write the title ONLY — the section number is generated automatically. Never type "1." yourself.
   Use \`<p class="fr-sublabel">\` for in-section labels such as ASSUMPTIONS or CONSTRAINTS.
4. \`<section class="fr-signoff">\` — when the source is an approval/agreement with signatures.
   One \`<div class="fr-signer">\` per signer, each containing:
   \`<p class="fr-eyebrow">ROLE</p>\`, \`<p class="fr-signer-name">Name</p>\`,
   \`<p class="fr-signer-role">subtitle</p>\`, \`<div class="fr-sig-field"></div>\`,
   \`<p class="fr-field-label">Signature</p>\`, \`<div class="fr-date-field"></div>\`,
   \`<p class="fr-field-label">Date</p>\`.
   Use the source's real names; fall back to "[Name]" only when the source leaves it blank.
5. \`<footer class="fr-footer">\` — two spans: "Fruition Services: Confidential" and the document title.`,
}

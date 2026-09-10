import { FRUITION_TOKENS_CSS } from "./tokens"
import { FRUITION_DOC_CSS } from "./doc"
import { FRUITION_SLIDES_CSS } from "./slides"
import { stylesheetFor } from "../templates"

/**
 * Theme injection for generated design documents.
 *
 * The stylesheet is injected at render time (view iframe + HTML export) and
 * never persisted. That is deliberate and predates this module: already-saved
 * documents pick up theme fixes without a data migration, and the saved HTML
 * stays semantic, so a chat edit cannot break the styling.
 *
 * Documents saved before templates existed carry their own model-authored CSS.
 * They are marked `legacy` and get only the original defensive print fixes —
 * layering a full stylesheet over CSS we didn't write would restyle them
 * unpredictably. The constant below is preserved byte-for-byte from the old
 * printFixes.ts for exactly that reason; do not "tidy" it.
 */
export const THEME_STYLE_ID = "fruition-print-fixes"

const LEGACY_PRINT_FIX_CSS = `
@page { size: A4; margin: 18mm 16mm; }
@media print {
  html, body { height: auto !important; min-height: 0 !important; }
  /* Long tables must flow page to page row-by-row (header repeating) instead
     of leaving a page-sized gap trying to keep the whole table together. */
  table { break-inside: auto !important; page-break-inside: auto !important; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  li, img, figure, blockquote { break-inside: avoid; page-break-inside: avoid; }
  /* Keep card-like units whole — these are page-height or smaller by design. */
  [class*="card" i], [class*="callout" i], [class*="signoff" i], [class*="sign-off" i] {
    break-inside: avoid; page-break-inside: avoid;
  }
  h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; break-inside: avoid; }
  p { orphans: 3; widows: 3; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`

/** The full stylesheet for a stored document's template. */
export function themeCss(storedTemplate: string | null | undefined): string {
  const sheet = stylesheetFor(storedTemplate)
  if (sheet === "legacy") return LEGACY_PRINT_FIX_CSS
  return FRUITION_TOKENS_CSS + (sheet === "slides" ? FRUITION_SLIDES_CSS : FRUITION_DOC_CSS)
}

/**
 * Append the theme stylesheet to a complete HTML document string.
 *
 * Appended last so its rules win the cascade at equal specificity. Idempotent —
 * a document that already carries the style block is returned unchanged.
 */
export function withTheme(html: string, storedTemplate: string | null | undefined): string {
  if (html.includes(THEME_STYLE_ID)) return html
  const style = `<style id="${THEME_STYLE_ID}">${themeCss(storedTemplate)}</style>`
  const bodyClose = html.toLowerCase().lastIndexOf("</body>")
  if (bodyClose !== -1) return html.slice(0, bodyClose) + style + html.slice(bodyClose)
  const htmlClose = html.toLowerCase().lastIndexOf("</html>")
  if (htmlClose !== -1) return html.slice(0, htmlClose) + style + html.slice(htmlClose)
  return html + style
}

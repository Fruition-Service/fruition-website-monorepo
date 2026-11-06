/** Template identifiers. `legacy` is not a template — it marks documents saved
 *  before templates existed, which carry their own model-authored CSS. */
export type TemplateId = "signoff" | "proposal" | "report" | "slides" | "rebrand"
export type StoredTemplate = TemplateId | "legacy"

/** Which stylesheet a template renders against. */
export type StylesheetId = "doc" | "slides"

export interface DocTemplate {
  id: TemplateId
  /** Picker label. */
  label: string
  /** Picker helper text — one line, plain language. */
  description: string
  stylesheet: StylesheetId
  /**
   * Structure instructions appended to the shared contract in buildDocPrompt().
   * Describes WHAT blocks to emit and in what order — never how they look.
   * Styling belongs in theme/, not here.
   */
  structure: string
}

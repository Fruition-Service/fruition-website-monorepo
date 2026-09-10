/**
 * What the generator sends upstream: either the PDF itself (the model parses it
 * natively) or already-extracted text. DOCX/PPTX are resolved to text in the
 * browser before they ever reach the API.
 */
export type DesignSource =
  | { kind: "pdf"; file: File }
  | { kind: "text"; text: string; filename?: string }

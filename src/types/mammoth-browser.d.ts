/**
 * mammoth ships types for its main entry but not for the browser build, which
 * is the one we import (the default entry pulls in Node built-ins that break
 * the bundle). The calls src/lib/design/extract/docx.ts and
 * src/lib/askFruit/extractDocument.ts make are declared here.
 */
declare module "mammoth/mammoth.browser" {
  export interface ConvertResult {
    value: string
    messages: { type: string; message: string }[]
  }
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<ConvertResult>
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<ConvertResult>
}

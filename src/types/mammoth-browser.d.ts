/**
 * mammoth ships types for its main entry but not for the browser build, which
 * is the one we import (the default entry pulls in Node built-ins that break
 * the bundle). Only the single call src/lib/design/extract/docx.ts makes is
 * declared here.
 */
declare module "mammoth/mammoth.browser" {
  export interface ConvertResult {
    value: string
    messages: { type: string; message: string }[]
  }
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<ConvertResult>
}

/**
 * Browser-only text extraction for the Implementation Calculator's upload
 * button. Every heavy library (pdfjs-dist, mammoth, fflate) is a dynamic import,
 * so it is a client chunk served as a static asset and never counts against the
 * Worker's size limit (same approach as clockifyPdf.ts and design/extract).
 */
import { MAX_DOCUMENT_BYTES, clampDocumentText, documentKind, safeDocumentName, type ChatDocument, type DocumentKind } from "./documents"

export interface ExtractedDocument extends ChatDocument {
  kind: DocumentKind
  /** Page or slide count when the format has one. */
  pages?: number
  bytes: number
}

export class DocumentError extends Error {}

const PDF_WORKER_SRC = "/pdf.worker.min.mjs"

async function extractPdf(file: File): Promise<{ text: string; pages: number }> {
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  const parts: string[] = []
  let length = 0
  // Stop reading once there is clearly more than the cap: a 500 page PDF should not freeze the tab.
  for (let i = 1; i <= pdf.numPages && length < 200_000; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    let line = ""
    for (const item of content.items) {
      if (!("str" in item)) continue
      line += item.str
      if ((item as { hasEOL?: boolean }).hasEOL) line += "\n"
      else if (item.str && !line.endsWith(" ")) line += " "
    }
    parts.push(line)
    length += line.length
  }
  const pages = pdf.numPages
  void pdf.cleanup()
  return { text: parts.join("\n\n"), pages }
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth/mammoth.browser")
  const { value } = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  })
  return value
}

async function extractPptxText(file: File): Promise<{ text: string; pages: number }> {
  const { extractPptx } = await import("@/lib/design/extract/pptx")
  const text = await extractPptx(file)
  return { text, pages: (text.match(/^## Slide /gm) ?? []).length }
}

/** Read a picked file into capped plain text. Throws DocumentError with a visitor-readable message. */
export async function extractDocument(file: File): Promise<ExtractedDocument> {
  const kind = documentKind(file.name)
  if (!kind) throw new DocumentError("That file type is not supported. Use PDF, DOCX, PPTX, TXT, MD or CSV.")
  if (file.size > MAX_DOCUMENT_BYTES) throw new DocumentError("That file is over 10 MB. Try a smaller one.")
  if (file.size === 0) throw new DocumentError("That file is empty.")

  let raw = ""
  let pages: number | undefined
  try {
    if (kind === "pdf") ({ text: raw, pages } = await extractPdf(file))
    else if (kind === "docx") raw = await extractDocxText(file)
    else if (kind === "pptx") ({ text: raw, pages } = await extractPptxText(file))
    else raw = await file.text()
  } catch (err) {
    if (err instanceof DocumentError) throw err
    const name = (err as { name?: string })?.name
    if (name === "PasswordException") throw new DocumentError("That PDF is password protected. Remove the password and try again.")
    throw new DocumentError("We could not read that file. Try a different copy, or paste the text into your message.")
  }

  const { text, truncated } = clampDocumentText(raw)
  if (!text) {
    throw new DocumentError(
      kind === "pdf"
        ? "No readable text found. A scanned PDF needs to be run through OCR first, or paste the text into your message."
        : "That file has no readable text.",
    )
  }
  return {
    name: safeDocumentName(file.name),
    text,
    truncated,
    kind,
    pages,
    bytes: file.size,
  }
}

/**
 * Visitor-uploaded documents (project briefs and the like) for the
 * Implementation Calculator. Pure helpers shared by the browser (limits, file
 * type checks, truncation) and the server (re-validation, prompt block). The
 * text is extracted in the browser (see extractDocument.ts), so none of the
 * PDF/DOCX libraries reach the Worker.
 */

/** Characters of document text kept, enforced by the browser and again by the route. */
export const MAX_DOCUMENT_CHARS = 40_000
/** Largest file the picker accepts. */
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024
export const MAX_DOCUMENT_NAME_CHARS = 120
/** Document text from earlier turns that is replayed to the model, newest first. */
export const HISTORY_DOCUMENT_CHARS = 60_000

export const DOCUMENT_KINDS = ["pdf", "docx", "pptx", "txt", "md", "csv"] as const
export type DocumentKind = (typeof DOCUMENT_KINDS)[number]

/** The picker's `accept` value: extensions plus the MIME types browsers report. */
export const DOCUMENT_ACCEPT = [
  ".pdf",
  ".docx",
  ".pptx",
  ".txt",
  ".md",
  ".csv",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/markdown",
  "text/csv",
].join(",")

export const DOCUMENT_HELP = "PDF, DOCX, PPTX, TXT, MD or CSV, up to 10 MB"

/** A document as it travels in the chat request and sits on a stored message. */
export interface ChatDocument {
  name: string
  text: string
  truncated: boolean
}

export function documentKind(fileName: string): DocumentKind | null {
  const ext = fileName.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]
  if (ext === "markdown") return "md"
  return (DOCUMENT_KINDS as readonly string[]).includes(ext ?? "") ? (ext as DocumentKind) : null
}

/** Strip control characters, unify newlines, collapse runs of blank lines and trailing spaces. */
export function normaliseDocumentText(raw: string): string {
  return (
    raw
      .replace(/\r\n?/g, "\n")
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  )
}

/** Cut to `max` characters, preferring a line or word boundary, and say whether anything was lost. */
export function clampDocumentText(raw: string, max: number = MAX_DOCUMENT_CHARS): { text: string; truncated: boolean } {
  const text = normaliseDocumentText(raw)
  if (text.length <= max) return { text, truncated: false }
  const cut = text.slice(0, max)
  const boundary = Math.max(cut.lastIndexOf("\n"), cut.lastIndexOf(" "))
  return {
    text: (boundary > max * 0.8 ? cut.slice(0, boundary) : cut).trimEnd(),
    truncated: true,
  }
}

export function safeDocumentName(name: string): string {
  const clean = name
    .replace(/[\u0000-\u001F\u007F<>"]/g, "")
    .replace(/\s+/g, " ")
    .trim()
  return (clean || "document").slice(0, MAX_DOCUMENT_NAME_CHARS)
}

/** Server side: validate and re-clamp whatever the request carried. Null when absent or unusable. */
export function parseChatDocument(input: unknown): ChatDocument | null {
  if (!input || typeof input !== "object") return null
  const { name, text } = input as { name?: unknown; text?: unknown }
  if (typeof text !== "string" || !text.trim()) return null
  const clamped = clampDocumentText(text)
  return {
    name: safeDocumentName(typeof name === "string" ? name : ""),
    text: clamped.text,
    truncated: Boolean((input as { truncated?: unknown }).truncated) || clamped.truncated,
  }
}

/**
 * The block placed after the visitor's words. The document is data the visitor
 * pasted in, never instructions: the system prompt says so, and the fences make
 * the boundary explicit. A fence-like line inside the text is defused so the
 * document cannot close its own block.
 */
export function formatDocumentBlock(doc: ChatDocument): string {
  const body = doc.text.replace(/^(\s*)<\/?uploaded_document[^>]*>/gim, "$1[removed tag]")
  return [`<uploaded_document name="${doc.name}"${doc.truncated ? ' truncated="true"' : ""}>`, body, "</uploaded_document>"].join("\n")
}

/** What the model reads as the user's turn. */
export function userContentWithDocument(message: string, doc?: ChatDocument | null): string {
  return doc ? `${message}\n\n${formatDocumentBlock(doc)}` : message
}

/** Stored when the visitor sent a document without typing anything. */
export const DEFAULT_DOCUMENT_MESSAGE = "I have attached a document. Please read it and use it as context for your answer."

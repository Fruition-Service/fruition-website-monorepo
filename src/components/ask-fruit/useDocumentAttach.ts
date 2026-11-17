"use client"

import { useCallback, useRef, useState } from "react"
import type { ChatDocument } from "@/lib/askFruit/documents"
import { DocumentError, extractDocument, type ExtractedDocument } from "@/lib/askFruit/extractDocument"

export type AttachStatus = "idle" | "reading" | "ready"

/** State for one composer's attached document: pick, read in the browser, show, remove. */
export function useDocumentAttach() {
  const [status, setStatus] = useState<AttachStatus>("idle")
  const [fileName, setFileName] = useState("")
  const [doc, setDoc] = useState<ExtractedDocument | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Only the latest pick may land: a slow PDF must not overwrite a newer file.
  const ticket = useRef(0)

  const pick = useCallback(async (file: File | null | undefined) => {
    if (!file) return
    const mine = ++ticket.current
    setError(null)
    setDoc(null)
    setFileName(file.name)
    setStatus("reading")
    try {
      const extracted = await extractDocument(file)
      if (mine !== ticket.current) return
      setDoc(extracted)
      setStatus("ready")
    } catch (err) {
      if (mine !== ticket.current) return
      setStatus("idle")
      setFileName("")
      setError(err instanceof DocumentError ? err.message : "We could not read that file.")
    }
  }, [])

  const clear = useCallback(() => {
    ticket.current++
    setStatus("idle")
    setFileName("")
    setDoc(null)
    setError(null)
  }, [])

  const chatDocument: ChatDocument | null = doc ? { name: doc.name, text: doc.text, truncated: doc.truncated } : null
  return {
    status,
    fileName,
    doc,
    chatDocument,
    error,
    pick,
    clear,
    reading: status === "reading",
  }
}

export type DocumentAttach = ReturnType<typeof useDocumentAttach>

/** "PDF, 14 pages" / "DOCX, 12 KB". */
export function documentLabel(doc: ExtractedDocument): string {
  const kind = doc.kind.toUpperCase()
  if (doc.pages) return `${kind}, ${doc.pages} ${doc.kind === "pptx" ? "slide" : "page"}${doc.pages === 1 ? "" : "s"}`
  const kb = doc.bytes / 1024
  return `${kind}, ${kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB`}`
}

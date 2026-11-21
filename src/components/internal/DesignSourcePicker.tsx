"use client"

import * as React from "react"
import { FileUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { DesignSource } from "@/lib/design/extract/types"

const MAX_PDF_BYTES = 10 * 1024 * 1024
// Office files are extracted here in the browser and only their text is
// uploaded, so this cap protects the browser rather than the request.
const MAX_OFFICE_BYTES = 25 * 1024 * 1024
const MAX_TEXT_CHARS = 600_000

interface Props {
  disabled?: boolean
  onChange: (source: DesignSource | null) => void
}

/**
 * Choose the document to redesign: upload a PDF/DOCX/PPTX, or paste text.
 *
 * This component is loaded with `ssr: false`, which is load-bearing rather than
 * cosmetic. The DOCX and PPTX parsers are imported here, and `ssr: false` is what
 * keeps them out of the Cloudflare Worker bundle — that bundle is within a few
 * hundred KiB of its 10 MiB limit, and mammoth alone is ~113 KiB gzipped. Import
 * the extractors from a server-rendered module and the deploy gets that much
 * closer to failing. Same reason SolutionModal defers mermaid.
 *
 * DOCX/PPTX are extracted the moment a file is chosen rather than at generate
 * time, so an unreadable file is reported while the user is still looking at the
 * file picker.
 */
export default function DesignSourcePicker({ disabled, onChange }: Props) {
  const [mode, setMode] = React.useState<"upload" | "paste">("upload")
  const [filename, setFilename] = React.useState<string | null>(null)
  const [text, setText] = React.useState("")
  const [reading, setReading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [dragOver, setDragOver] = React.useState(false)

  function fail(message: string) {
    setError(message)
    setFilename(null)
    onChange(null)
  }

  async function pickFile(file: File | undefined | null) {
    setError(null)
    if (!file) return
    const name = file.name.toLowerCase()

    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      if (file.size > MAX_PDF_BYTES) return fail("PDF is too large (max 10 MB).")
      setFilename(file.name)
      return onChange({ kind: "pdf", file })
    }

    const isDocx = name.endsWith(".docx")
    if (!isDocx && !name.endsWith(".pptx")) return fail("Supported files: PDF, DOCX, PPTX.")
    if (file.size > MAX_OFFICE_BYTES) return fail("File is too large (max 25 MB).")

    setReading(true)
    try {
      const extracted = isDocx
        ? await (await import("@/lib/design/extract/docx")).extractDocx(file)
        : await (await import("@/lib/design/extract/pptx")).extractPptx(file)
      if (extracted.length > MAX_TEXT_CHARS) {
        return fail("That document is too long to redesign in one pass.")
      }
      setFilename(file.name)
      onChange({ kind: "text", text: extracted, filename: file.name })
    } catch (e) {
      fail((e as Error).message || "Could not read that file.")
    } finally {
      setReading(false)
    }
  }

  function pickText(next: string) {
    setText(next)
    setError(null)
    onChange(next.trim() ? { kind: "text", text: next.trim() } : null)
  }

  function switchMode(next: "upload" | "paste") {
    setMode(next)
    setError(null)
    // The two inputs are alternatives — carry the newly active one's value
    // forward so switching tabs doesn't silently keep the other one's source.
    if (next === "paste") {
      pickText(text)
    } else {
      setFilename(null)
      onChange(null)
    }
  }

  const busy = disabled || reading

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        {(["upload", "paste"] as const).map((m) => (
          <Button
            key={m}
            type="button"
            size="sm"
            variant={mode === m ? "default" : "outline"}
            disabled={busy}
            onClick={() => switchMode(m)}
          >
            {m === "upload" ? "Upload a file" : "Paste text"}
          </Button>
        ))}
      </div>

      {mode === "upload" ? (
        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            void pickFile(e.dataTransfer.files?.[0])
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? "border-[var(--purple-primary)] bg-[var(--light-section-bg,#ecf1fc)]"
              : "border-[var(--color-border)]"
          }`}
        >
          {reading ? (
            <Loader2 className="size-6 animate-spin text-[var(--purple-primary)]" />
          ) : (
            <FileUp className="size-6 text-[var(--purple-primary)]" />
          )}
          <span className="text-sm font-medium text-ink-heading">
            {reading ? "Reading…" : (filename ?? "Drop a file here or click to browse")}
          </span>
          <span className="text-xs text-muted-foreground">
            PDF up to 10 MB, or DOCX / PPTX up to 25 MB
          </span>
          <input
            type="file"
            accept=".pdf,.docx,.pptx,application/pdf"
            className="hidden"
            disabled={busy}
            onChange={(e) => void pickFile(e.target.files?.[0])}
          />
        </label>
      ) : (
        <Textarea
          placeholder="Paste the document text or Markdown here…"
          value={text}
          disabled={busy}
          rows={10}
          onChange={(e) => pickText(e.target.value)}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

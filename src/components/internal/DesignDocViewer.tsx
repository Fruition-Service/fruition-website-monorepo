"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, Download, Loader2, Pencil, Printer, Trash2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DesignChatPanel from "@/components/internal/DesignChatPanel"
import { applyEdits, parseEditResponse } from "@/lib/design/docEdit"
import { withTheme } from "@/lib/design/theme"

interface Props {
  id: string
  title: string
  html: string
  sourceFilename?: string | null
  /** Template id, or "legacy" for documents generated before templates existed. */
  template?: string | null
}

/**
 * Preview a generated design document, edit it via the Claude chat panel,
 * export it (print → PDF), rename, delete.
 */
export default function DesignDocViewer({
  id,
  title: initialTitle,
  html: initialHtml,
  sourceFilename,
  template,
}: Props) {
  const router = useRouter()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [title, setTitle] = React.useState(initialTitle)
  const [editing, setEditing] = React.useState(false)
  const [busy, setBusy] = React.useState<"rename" | "delete" | "undo" | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  // The document itself. Chat edits update this locally and persist via PATCH,
  // so state (not the server prop) is the source of truth after mount.
  const [html, setHtml] = React.useState(initialHtml)
  const [undoStack, setUndoStack] = React.useState<string[]>([])
  // Chat responses arrive async — apply them against the latest HTML, not the
  // value captured when the request started (e.g. if Undo ran in between).
  const htmlRef = React.useRef(html)
  htmlRef.current = html

  function exportPdf() {
    iframeRef.current?.contentWindow?.print()
  }

  function downloadHtml() {
    const blob = new Blob([withTheme(html, template)], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/[^\w\- ]+/g, "").trim() || "fruition-document"}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function saveHtml(next: string) {
    const res = await fetch(`/api/internal/design/docs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: next }),
    })
    if (!res.ok) {
      throw new Error(((await res.json()) as { error?: string }).error || "Saving the change failed.")
    }
  }

  /**
   * Handle a completed chat response: apply its edit blocks (or full-document
   * rewrite) to the HTML, persist, and return a short outcome note for the chat.
   */
  async function handleAssistantResponse(raw: string): Promise<string | null> {
    const parsed = parseEditResponse(raw)

    const current = htmlRef.current
    let next: string
    let note: string
    if (parsed.fullHtml) {
      next = parsed.fullHtml
      note = "Document rewritten"
    } else if (parsed.edits.length > 0) {
      const result = applyEdits(current, parsed.edits)
      if (result.applied === 0) {
        return "No changes could be applied — the edit didn't match the document. Try rephrasing."
      }
      next = result.html
      note =
        result.failed.length > 0
          ? `${result.applied} of ${parsed.edits.length} changes applied — ask again for the rest`
          : `${result.applied} change${result.applied === 1 ? "" : "s"} applied`
    } else {
      return null // conversational reply, nothing to change
    }

    await saveHtml(next)
    setUndoStack((s) => [...s, current])
    setHtml(next)
    return note
  }

  async function undo() {
    const prev = undoStack[undoStack.length - 1]
    if (prev === undefined || busy) return
    setBusy("undo")
    setError(null)
    try {
      await saveHtml(prev)
      setUndoStack((s) => s.slice(0, -1))
      setHtml(prev)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function rename() {
    setBusy("rename")
    setError(null)
    try {
      const res = await fetch(`/api/internal/design/docs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error(((await res.json()) as { error?: string }).error || "Rename failed.")
      setEditing(false)
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function remove() {
    if (!window.confirm("Delete this design document? This cannot be undone.")) return
    setBusy("delete")
    setError(null)
    try {
      const res = await fetch(`/api/internal/design/docs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(((await res.json()) as { error?: string }).error || "Delete failed.")
      router.push("/internal/design")
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface p-4 sm:p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 w-72"
                autoFocus
              />
              <Button size="sm" onClick={rename} disabled={busy === "rename"}>
                {busy === "rename" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Save
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="group flex items-center gap-2 text-left"
              onClick={() => setEditing(true)}
              title="Rename"
            >
              <h1 className="truncate text-xl font-semibold text-ink-heading">{title}</h1>
              <Pencil className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}
          {sourceFilename && (
            <p className="mt-0.5 text-xs text-muted-foreground">From {sourceFilename}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {undoStack.length > 0 && (
            <Button variant="outline" onClick={undo} disabled={busy === "undo"} title="Undo last edit">
              {busy === "undo" ? <Loader2 className="size-4 animate-spin" /> : <Undo2 className="size-4" />}
              Undo
            </Button>
          )}
          <Button onClick={exportPdf}>
            <Printer className="size-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={downloadHtml}>
            <Download className="size-4" />
            HTML
          </Button>
          <Button variant="outline" onClick={remove} disabled={busy === "delete"}>
            {busy === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div
          className="rounded-card bg-surface p-2 sm:p-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* same-origin needed so Export PDF can call contentWindow.print(); no scripts allowed.
              allow-popups(+escape) lets embedded links (e.g. an interactive-diagram URL) open in a
              new tab — without it the sandbox silently swallows the click. */}
          <iframe
            ref={iframeRef}
            title={title}
            sandbox="allow-same-origin allow-modals allow-popups allow-popups-to-escape-sandbox"
            srcDoc={withTheme(html, template)}
            className="h-[80vh] w-full rounded-[calc(var(--radius-card)-8px)] border border-[var(--color-border)] bg-white"
          />
        </div>

        <div
          className="h-[60vh] overflow-hidden rounded-card bg-surface lg:sticky lg:top-4 lg:h-[calc(80vh+1.5rem)]"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <DesignChatPanel docId={id} onAssistantResponse={handleAssistantResponse} />
        </div>
      </div>
    </div>
  )
}

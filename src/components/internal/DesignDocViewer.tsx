"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, Code2, Columns2, Download, Eye, Loader2, Pencil, Printer, Trash2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DesignChatPanel from "@/components/internal/DesignChatPanel"
import DesignDocCodeEditor from "@/components/internal/DesignDocCodeEditor"
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

type Mode = "preview" | "split" | "code"

/** How long typing in the code editor pauses before the preview re-renders. */
const PREVIEW_DEBOUNCE_MS = 400

/**
 * Preview a generated design document, edit it via the Claude chat panel or by
 * hand in the HTML code view, export it (print → PDF), rename, delete.
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
  const [busy, setBusy] = React.useState<"rename" | "delete" | "undo" | "code" | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  // The saved document. Chat edits and code saves update this locally and
  // persist via PATCH, so state (not the server prop) is the source of truth
  // after mount.
  const [html, setHtml] = React.useState(initialHtml)
  const [undoStack, setUndoStack] = React.useState<string[]>([])
  // Chat responses arrive async — apply them against the latest HTML, not the
  // value captured when the request started (e.g. if Undo ran in between).
  const htmlRef = React.useRef(html)
  htmlRef.current = html

  // Code view: `draft` is the editor's working copy of the document. It equals
  // `html` until you type, and the preview always renders the draft so edits
  // show up before (and without) saving.
  const [mode, setMode] = React.useState<Mode>("preview")
  const [draft, setDraft] = React.useState(initialHtml)
  const draftRef = React.useRef(draft)
  draftRef.current = draft
  const dirty = draft !== html
  // Set when a chat edit lands while the editor has unsaved changes: the two
  // versions have diverged and the user has to pick one.
  const [conflict, setConflict] = React.useState(false)

  const [previewHtml, setPreviewHtml] = React.useState(initialHtml)
  React.useEffect(() => {
    if (draft === previewHtml) return
    const t = window.setTimeout(() => setPreviewHtml(draft), PREVIEW_DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [draft, previewHtml])

  // Warn before leaving with unsaved code edits.
  React.useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  /**
   * Record a new saved version. Keeps the editor in step: a clean editor
   * follows the document, a dirty one keeps your text and raises a conflict.
   */
  function applySaved(next: string, { pushUndo = true }: { pushUndo?: boolean } = {}) {
    const wasClean = draftRef.current === htmlRef.current
    if (pushUndo) setUndoStack((s) => [...s, htmlRef.current])
    setHtml(next)
    if (wasClean) setDraft(next)
    else setConflict(true)
  }

  // Re-render the preview iframe from the same scroll offset so a debounced
  // update mid-edit doesn't throw you back to the top of the document.
  const scrollRef = React.useRef(0)
  function onIframeLoad() {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    if (scrollRef.current) win.scrollTo(0, scrollRef.current)
    win.addEventListener("scroll", () => {
      scrollRef.current = win.scrollY
    })
    if (pendingPrintRef.current) {
      pendingPrintRef.current = false
      win.print()
    }
  }

  // Printing needs the iframe laid out, so exporting from the code-only view
  // switches to split first and prints once the preview is back on screen.
  const pendingPrintRef = React.useRef(false)
  function exportPdf() {
    if (mode === "code") {
      pendingPrintRef.current = true
      setMode("split")
      window.setTimeout(() => {
        if (!pendingPrintRef.current) return
        pendingPrintRef.current = false
        iframeRef.current?.contentWindow?.print()
      }, 300)
      return
    }
    iframeRef.current?.contentWindow?.print()
  }

  function downloadHtml() {
    const blob = new Blob([withTheme(draft, template)], { type: "text/html" })
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

  /** Persist the code editor's working copy. */
  async function saveDraft() {
    if (!dirty || busy) return
    setBusy("code")
    setError(null)
    try {
      const next = draftRef.current
      await saveHtml(next)
      setUndoStack((s) => [...s, htmlRef.current])
      setHtml(next)
      setConflict(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  /** Throw away the code editor's unsaved changes. */
  function revertDraft() {
    setDraft(htmlRef.current)
    setConflict(false)
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
    applySaved(next)
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
      applySaved(prev, { pushUndo: false })
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

  const modeButton = (key: Mode, label: string, Icon: typeof Eye) => {
    const active = mode === key
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => setMode(key)}
        title={label}
        className="flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-semibold transition"
        style={
          active
            ? { backgroundColor: "var(--purple-primary)", color: "#fff" }
            : { color: "var(--ink-heading)" }
        }
      >
        <Icon className="size-3.5" />
        {label}
      </button>
    )
  }

  const showCode = mode === "code" || mode === "split"
  const showPreview = mode === "preview" || mode === "split"

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
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Document view"
            className="flex items-center gap-1 rounded-pill p-1"
            style={{ border: "1px solid var(--color-border)" }}
          >
            {modeButton("preview", "Preview", Eye)}
            {modeButton("split", "Split", Columns2)}
            {modeButton("code", "Code", Code2)}
          </div>
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

      {dirty && (
        <div className="flex flex-wrap items-center gap-3 rounded-card bg-surface px-4 py-3 text-sm" style={{ boxShadow: "var(--shadow-card)" }}>
          <span className="text-ink-heading">
            {conflict
              ? "A chat edit changed the saved document while your code edits were unsaved. Save to keep yours, or discard to take the chat edit."
              : "You have unsaved code edits. The preview shows them; the saved document doesn't."}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={revertDraft} disabled={busy === "code"}>
              Discard
            </Button>
            <Button size="sm" onClick={saveDraft} disabled={busy === "code"}>
              {busy === "code" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Save HTML
            </Button>
          </div>
        </div>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div
          className={`grid min-w-0 gap-4 rounded-card bg-surface p-2 sm:p-3 ${
            mode === "split" ? "xl:grid-cols-2" : ""
          }`}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className={showCode ? "h-[80vh] min-w-0" : "hidden"}>
            <DesignDocCodeEditor
              value={draft}
              onChange={setDraft}
              onSave={saveDraft}
              dirty={dirty}
              saving={busy === "code"}
            />
          </div>
          {/* The iframe stays mounted in every mode (hidden in code view) so
              Export PDF and the preview's scroll position survive a mode switch.
              same-origin is needed so Export PDF can call contentWindow.print();
              no scripts allowed. allow-popups(+escape) lets embedded links (e.g.
              an interactive-diagram URL) open in a new tab — without it the
              sandbox silently swallows the click. */}
          <div className={showPreview ? "min-w-0" : "hidden"}>
            <iframe
              ref={iframeRef}
              title={title}
              sandbox="allow-same-origin allow-modals allow-popups allow-popups-to-escape-sandbox"
              srcDoc={withTheme(previewHtml, template)}
              onLoad={onIframeLoad}
              className="h-[80vh] w-full rounded-[calc(var(--radius-card)-8px)] border border-[var(--color-border)] bg-white"
            />
          </div>
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

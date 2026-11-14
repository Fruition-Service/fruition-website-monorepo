"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEFAULT_TEMPLATE_ID, TEMPLATES, getTemplate, type TemplateId } from "@/lib/design/templates"
import { withTheme } from "@/lib/design/theme"
import type { DesignSource } from "@/lib/design/extract/types"

// ssr:false keeps the DOCX/PPTX parsers out of the Cloudflare Worker bundle,
// which sits within a few hundred KiB of its 10 MiB limit. See the picker's
// own comment — this is a deploy constraint, not a rendering preference.
const DesignSourcePicker = dynamic(() => import("./DesignSourcePicker"), {
  ssr: false,
  loading: () => (
    <div className="rounded-card border-2 border-dashed border-[var(--color-border)] p-8 text-center text-sm text-muted-foreground">
      Loading…
    </div>
  ),
})

type Phase = "idle" | "generating" | "saving" | "error"

/**
 * Pick a template and a source (PDF, DOCX/PPTX, or pasted text) → stream the
 * Fruition-branded HTML into a live preview → save and route to the document.
 *
 * DOCX/PPTX are extracted here in the browser: the parsers are heavy and
 * dynamically imported, so they stay out of the Cloudflare Worker bundle.
 */
export default function DesignGenerator() {
  const router = useRouter()
  const [source, setSource] = React.useState<DesignSource | null>(null)
  const [templateId, setTemplateId] = React.useState<TemplateId>(DEFAULT_TEMPLATE_ID)
  const [title, setTitle] = React.useState("")
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [html, setHtml] = React.useState("")
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => () => abortRef.current?.abort(), [])

  const template = getTemplate(templateId)
  const busy = phase === "generating" || phase === "saving"

  /** The form body the generate route expects. */
  function buildForm(src: DesignSource): FormData {
    const form = new FormData()
    form.set("template", templateId)
    if (title.trim()) form.set("title", title.trim())
    if (src.kind === "pdf") form.set("file", src.file)
    else form.set("text", src.text)
    return form
  }

  function sourceFilename(src: DesignSource): string | null {
    return src.kind === "pdf" ? src.file.name : (src.filename ?? null)
  }

  function defaultTitle(src: DesignSource): string {
    if (title.trim()) return title.trim()
    const name = sourceFilename(src)
    return name ? name.replace(/\.(pdf|docx|pptx)$/i, "") : "Untitled document"
  }

  async function generate() {
    if (!source || busy) return
    setError(null)
    setHtml("")
    setPhase("generating")
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const form = buildForm(source)

      const res = await fetch("/api/internal/design/generate", {
        method: "POST",
        body: form,
        signal: controller.signal,
      })
      if (!res.ok || !res.body) {
        const msg = await res
          .json()
          .then((j: { error?: string }) => j.error)
          .catch(() => null)
        throw new Error(msg || `Generation failed (${res.status}).`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""
      let lastPaint = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        // Throttle iframe repaints — srcdoc replacement is expensive.
        const now = Date.now()
        if (now - lastPaint > 400) {
          lastPaint = now
          setHtml(acc)
        }
      }
      acc += decoder.decode()
      const finalHtml = cleanHtml(acc)
      if (!finalHtml) throw new Error("The model returned an empty document. Try again.")
      setHtml(finalHtml)

      setPhase("saving")
      const save = await fetch("/api/internal/design/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: defaultTitle(source),
          html: finalHtml,
          template: templateId,
          source_filename: sourceFilename(source),
        }),
      })
      const saved = (await save.json()) as { id?: string; error?: string }
      if (!save.ok || !saved.id) throw new Error(saved.error || "Failed to save the document.")
      router.push(`/internal/design/${saved.id}`)
    } catch (e) {
      if ((e as Error).name === "AbortError") return
      setError((e as Error).message)
      setPhase("error")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card bg-surface p-6 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">New design document</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn any document into the Fruition house style — same content, new look. Pick a template,
          give it a source, and export the result as a PDF.
        </p>

        <div className="mt-6 grid gap-5 sm:max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="design-template">Template</Label>
            <Select
              value={templateId}
              onValueChange={(v) => setTemplateId(v as TemplateId)}
              disabled={busy}
            >
              <SelectTrigger id="design-template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{template.description}</p>
          </div>

          <div className="grid gap-2">
            <Label>Source</Label>
            <DesignSourcePicker disabled={busy} onChange={setSource} />
          </div>

          <Input
            placeholder="Document title (optional — derived from the source if empty)"
            value={title}
            disabled={busy}
            onChange={(e) => setTitle(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button onClick={generate} disabled={!source || busy}>
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {phase === "saving" ? "Saving…" : "Designing…"}
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate design
                </>
              )}
            </Button>
            {phase === "generating" && (
              <p className="mt-2 text-xs text-muted-foreground">
                This usually takes one to a few minutes for longer documents — the preview below
                fills in as it&apos;s designed.
              </p>
            )}
          </div>
        </div>
      </div>

      {(html || busy) && (
        <div className="rounded-card bg-surface p-2 sm:p-3" style={{ boxShadow: "var(--shadow-card)" }}>
          <iframe
            title="Design preview"
            sandbox=""
            // Themed exactly as the saved document will be, so the preview can't
            // promise something the finished document doesn't deliver.
            srcDoc={withTheme(html, templateId)}
            className="h-[75vh] w-full rounded-[calc(var(--radius-card)-8px)] border border-[var(--color-border)] bg-white"
          />
        </div>
      )}
    </div>
  )
}

/** Strip stray markdown fences / prose around the HTML document, if any. */
function cleanHtml(raw: string): string {
  const text = raw.trim()
  const start = text.search(/<!doctype html/i)
  const startAlt = start === -1 ? text.search(/<html[\s>]/i) : start
  if (startAlt === -1) return ""
  const end = text.toLowerCase().lastIndexOf("</html>")
  return end === -1 ? text.slice(startAlt) : text.slice(startAlt, end + "</html>".length)
}

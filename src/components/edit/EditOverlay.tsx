"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { vercelStegaClean, vercelStegaDecode } from "@vercel/stega"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { assetIdFromImageUrl, parseStegaHref, type FieldRef } from "@/lib/inlineEdit"

/**
 * Framer-style inline editor for the public site.
 *
 * In edit mode every Sanity string arrives with a hidden stega source map
 * (document id + field path). This overlay finds those strings in the DOM,
 * outlines the elements that show them, and lets a portal user click one to
 * edit it in place. Save writes the field to Sanity, drops the site cache and
 * reloads, so the change is visible straight away here and on the live site.
 *
 * Copy that lives in code rather than Sanity carries no source map, so it is
 * simply not outlined.
 *
 * Images carry no source map (their URLs are built in code), but a Sanity CDN
 * URL names its asset. Clicking one asks the server which documents use that
 * asset, preselects the ones already on this page, and swaps in an upload.
 */

const MARK = ["fe-editable", "cursor-text", "outline-dashed", "outline-1", "outline-offset-2", "outline-primary/50", "hover:outline-2", "hover:outline-primary"]
const ACTIVE = ["outline-solid", "outline-2", "outline-primary", "bg-primary/5"]
const IMAGE_MARK = ["cursor-pointer", "outline-dashed", "outline-2", "-outline-offset-2", "outline-primary/60", "hover:outline-primary"]
const FLASH_KEY = "fruition-edit-flash"

type Place = { id: string; type: string; title: string; fields: number; onPage: boolean }

type ImageEditing = {
  el: HTMLImageElement
  asset: string
  places: Place[]
  selected: string[]
}

type Editing = {
  el: HTMLElement
  ref: FieldRef
  raw: string
  /** "inline" edits the element itself; "panel" edits the stored value in a docked textarea. */
  mode: "inline" | "panel"
  original: Node[]
}

const normalise = (s: string) => vercelStegaClean(s).replace(/\s+/g, " ").trim()

function isOurUi(node: Node | null): boolean {
  const el = node instanceof Element ? node : node?.parentElement
  return !!el?.closest("[data-fe-ui]")
}

/** Tag every element whose text carries a Sanity source map. Returns how many. */
function scan(): number {
  // Page titles come from Sanity too; keep the markers out of the browser tab.
  const title = vercelStegaClean(document.title)
  if (title !== document.title) document.title = title
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n as Text
    const el = text.parentElement
    if (!el || isOurUi(el) || el.closest("script,style,noscript,[contenteditable='plaintext-only']")) continue
    const decoded = vercelStegaDecode<{ href?: string }>(text.data)
    const ref = decoded?.href ? parseStegaHref(decoded.href) : null
    if (!ref) continue
    el.dataset.feId = ref.id
    el.dataset.feType = ref.type
    el.dataset.fePath = ref.path
    el.classList.add(...MARK)
  }
  for (const img of Array.from(document.images)) {
    if (isOurUi(img) || img.dataset.feAsset) continue
    const asset = assetIdFromImageUrl(img.currentSrc || img.src)
    if (!asset) continue
    img.dataset.feAsset = asset
    img.classList.add(...IMAGE_MARK)
  }
  return document.querySelectorAll("[data-fe-id],[data-fe-asset]").length
}

function refOf(el: HTMLElement): FieldRef {
  return { id: el.dataset.feId!, type: el.dataset.feType!, path: el.dataset.fePath! }
}

export default function EditOverlay() {
  const [count, setCount] = useState(0)
  const [editing, setEditing] = useState<Editing | null>(null)
  const [draft, setDraft] = useState("")
  const [status, setStatus] = useState<{ tone: "info" | "error"; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [image, setImage] = useState<ImageEditing | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const editingRef = useRef<Editing | null>(null)
  editingRef.current = editing
  const imageRef = useRef<ImageEditing | null>(null)
  imageRef.current = image

  // Object URLs for the chosen file are released when it changes.
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const closeImage = useCallback(() => {
    imageRef.current?.el.classList.remove(...ACTIVE)
    setImage(null)
    setFile(null)
    setPreview(null)
  }, [])

  const startImage = useCallback(async (el: HTMLImageElement) => {
    const asset = el.dataset.feAsset!
    setStatus(null)
    // Documents whose text is on this page: "replace it here" is the usual intent.
    const pageDocs = Array.from(new Set(Array.from(document.querySelectorAll<HTMLElement>("[data-fe-id]"), (e) => e.dataset.feId!)))
    try {
      const res = await fetch(`/api/internal/edit/image?asset=${encodeURIComponent(asset)}&docs=${encodeURIComponent(pageDocs.join(","))}`)
      const json = (await res.json()) as { places?: Place[]; error?: string }
      if (!res.ok || !json.places) throw new Error(json.error || "Could not look up this image")
      if (json.places.length === 0) throw new Error("This image isn't stored in a page's content, so it can't be replaced here")
      // Preselect the places tied to this page. With none, a single place is
      // obviously the one; with several, the editor has to choose, so a logo
      // shared by many pages is never swapped everywhere by accident.
      const onPage = json.places.filter((p) => p.onPage).map((p) => p.id)
      const selected = onPage.length ? onPage : json.places.length === 1 ? [json.places[0].id] : []
      el.classList.add(...ACTIVE)
      setImage({ el, asset, places: json.places, selected })
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Could not look up this image" })
    }
  }, [])

  const saveImage = useCallback(async () => {
    const cur = imageRef.current
    if (!cur || !file || cur.selected.length === 0) return
    setSaving(true)
    try {
      const form = new FormData()
      form.set("file", file)
      form.set("asset", cur.asset)
      form.set("targets", cur.selected.join(","))
      form.set("pagePath", location.pathname)
      const res = await fetch("/api/internal/edit/image", { method: "POST", body: form })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`)
      try {
        sessionStorage.setItem(FLASH_KEY, "Image replaced. The live site shows it from the next page load.")
      } catch {}
      location.reload()
    } catch (err) {
      setSaving(false)
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Upload failed" })
    }
  }, [file])

  // Show the "Saved" note that survived the post-save reload.
  useEffect(() => {
    try {
      const flash = sessionStorage.getItem(FLASH_KEY)
      if (flash) {
        sessionStorage.removeItem(FLASH_KEY)
        setStatus({ tone: "info", text: flash })
      }
    } catch {}
  }, [])

  // Initial scan, then rescan whenever the page renders new content
  // (tabs, accordions, client-side navigation).
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    const run = () => {
      if (editingRef.current || imageRef.current) return
      setCount(scan())
    }
    run()
    const mo = new MutationObserver((records) => {
      if (records.every((r) => isOurUi(r.target))) return
      clearTimeout(t)
      t = setTimeout(run, 150)
    })
    mo.observe(document.body, { childList: true, subtree: true, characterData: true })
    // Next rewrites <title> on re-render; strip the markers again each time.
    const titleMo = new MutationObserver(() => {
      const clean = vercelStegaClean(document.title)
      if (clean !== document.title) document.title = clean
    })
    titleMo.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => {
      mo.disconnect()
      titleMo.disconnect()
      clearTimeout(t)
    }
  }, [])

  const finish = useCallback((restore: boolean) => {
    const cur = editingRef.current
    if (!cur) return
    cur.el.classList.remove(...ACTIVE)
    if (cur.mode === "inline") {
      cur.el.removeAttribute("contenteditable")
      // Put React's own text nodes back so it can keep updating them.
      if (restore) cur.el.replaceChildren(...cur.original)
    }
    setEditing(null)
  }, [])

  const save = useCallback(async () => {
    const cur = editingRef.current
    if (!cur) return
    const value = cur.mode === "inline" ? (cur.el.innerText ?? "").replace(/\n+$/, "") : draft
    if (value === cur.raw) {
      finish(true)
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/internal/edit/field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cur.ref, value, pagePath: location.pathname }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(json.error || `Save failed (${res.status})`)
      try {
        sessionStorage.setItem(FLASH_KEY, "Saved. The live site shows it from the next page load.")
      } catch {}
      location.reload()
    } catch (err) {
      setSaving(false)
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Save failed" })
    }
  }, [draft, finish])

  const start = useCallback(async (el: HTMLElement) => {
    const ref = refOf(el)
    setStatus(null)
    let raw: string
    try {
      const res = await fetch(`/api/internal/edit/field?id=${encodeURIComponent(ref.id)}&path=${encodeURIComponent(ref.path)}`)
      const json = (await res.json()) as { value?: string; error?: string }
      if (!res.ok || typeof json.value !== "string") throw new Error(json.error || "Could not load this field")
      raw = json.value
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Could not load this field" })
      return
    }

    // Edit in place only when the element shows exactly the stored text.
    // Anything the template reshapes (markdown, joined strings, nested
    // markup) is edited as its stored value in the panel instead, so saving
    // never writes rendered output back over the source.
    const inline = el.children.length === 0 && normalise(el.textContent ?? "") === normalise(raw)
    const original = Array.from(el.childNodes)
    el.classList.add(...ACTIVE)
    if (inline) {
      el.replaceChildren(document.createTextNode(raw))
      el.setAttribute("contenteditable", "plaintext-only")
      el.focus()
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    } else {
      setDraft(raw)
    }
    setEditing({ el, ref, raw, mode: inline ? "inline" : "panel", original })
  }, [])

  // Clicking outlined text edits it instead of following links or buttons.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target || isOurUi(target)) return
      const cur = editingRef.current
      if (cur?.mode === "inline" && cur.el.contains(target)) return
      const img = target.closest<HTMLImageElement>("img[data-fe-asset]")
      const el = img ? null : target.closest<HTMLElement>("[data-fe-id]")
      if (!img && !el) return
      e.preventDefault()
      e.stopPropagation()
      if (cur || imageRef.current) return
      if (img) void startImage(img)
      else if (el) void start(el)
    }
    const onKey = (e: KeyboardEvent) => {
      if (imageRef.current && e.key === "Escape") {
        e.preventDefault()
        closeImage()
        return
      }
      const cur = editingRef.current
      if (!cur) return
      if (e.key === "Escape") {
        e.preventDefault()
        finish(true)
      } else if (e.key === "Enter" && !e.shiftKey && cur.mode === "inline") {
        e.preventDefault()
        void save()
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && cur.mode === "panel") {
        e.preventDefault()
        void save()
      }
    }
    document.addEventListener("click", onClick, true)
    document.addEventListener("keydown", onKey, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("keydown", onKey, true)
    }
  }, [start, startImage, save, finish, closeImage])

  const here = typeof window === "undefined" ? "/" : location.pathname + location.search
  const exitHref = `/api/internal/edit/disable?path=${encodeURIComponent(here)}`
  const reenterHref = `/api/internal/edit/enable?path=${encodeURIComponent(here)}`

  return (
    <div data-fe-ui className="fixed inset-x-0 bottom-0 z-[2147483000] flex flex-col items-center gap-2 p-4 font-sans pointer-events-none">
      {image && (
        <div className="pointer-events-auto max-h-[70vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-background p-4 text-foreground shadow-xl">
          <div className="grid grid-cols-2 gap-3">
            <figure className="flex flex-col gap-1">
              <figcaption className="text-sm text-muted-foreground">Current</figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element -- previews of arbitrary CDN and blob URLs */}
              <img src={image.el.currentSrc || image.el.src} alt="" className="h-32 w-full rounded-md bg-muted object-contain" />
            </figure>
            <figure className="flex flex-col gap-1">
              <figcaption className="text-sm text-muted-foreground">New</figcaption>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                <img src={preview} alt="" className="h-32 w-full rounded-md bg-muted object-contain" />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  No file chosen
                </div>
              )}
            </figure>
          </div>
          <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted">
            {file ? `Change file (${file.name})` : "Choose image"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <p className="mt-3 text-sm text-muted-foreground">Replace it in:</p>
          <ul className="mt-1 flex flex-col gap-1">
            {image.places.map((p) => (
              <li key={p.id}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                  <Checkbox
                    checked={image.selected.includes(p.id)}
                    onCheckedChange={(on) =>
                      setImage((cur) =>
                        cur && { ...cur, selected: on ? [...cur.selected, p.id] : cur.selected.filter((id) => id !== p.id) },
                      )
                    }
                  />
                  <span>
                    {p.title}
                    <span className="text-muted-foreground">
                      {" "}
                      ({p.type}
                      {p.fields > 1 ? `, ${p.fields} spots` : ""}
                      {p.onPage ? ", on this page" : ""})
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" className="min-h-11" onClick={closeImage} disabled={saving}>
              Cancel
            </Button>
            <Button className="min-h-11" onClick={() => void saveImage()} disabled={saving || !file || image.selected.length === 0}>
              {saving ? "Uploading…" : "Replace image"}
            </Button>
          </div>
        </div>
      )}

      {editing?.mode === "panel" && (
        <div className="pointer-events-auto w-full max-w-2xl rounded-lg border border-border bg-background p-4 text-foreground shadow-xl">
          <p className="mb-2 text-sm text-muted-foreground">
            This text is reshaped by the page template, so you are editing the stored copy.
          </p>
          <Textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-32 text-base"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => finish(true)} disabled={saving}>
              Cancel
            </Button>
            <Button className="min-h-11" onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      )}

      {status && (
        <div
          role="status"
          className={`pointer-events-auto max-w-2xl rounded-md px-4 py-2 text-sm shadow-lg ${
            status.tone === "error" ? "bg-destructive text-white" : "bg-foreground text-background"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl md:rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground shadow-xl">
        <span className="size-2 rounded-full bg-primary" aria-hidden />
        {editing?.mode === "inline" ? (
          <>
            <span>Enter to save, Esc to cancel</span>
            <Button size="sm" className="min-h-11 md:min-h-9" onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button size="sm" variant="ghost" className="min-h-11 md:min-h-9" onClick={() => finish(true)} disabled={saving}>
              Cancel
            </Button>
          </>
        ) : count > 0 ? (
          <span>Editing: click any outlined text or image ({count} on this page)</span>
        ) : (
          <span>
            Nothing editable here. This page&apos;s copy may live in code, or{" "}
            <a className="underline" href={reenterHref}>
              re-enter edit mode
            </a>
            .
          </span>
        )}
        <Button render={<a href={exitHref} />} size="sm" variant="outline" className="min-h-11 md:min-h-9">
          Exit
        </Button>
      </div>
    </div>
  )
}

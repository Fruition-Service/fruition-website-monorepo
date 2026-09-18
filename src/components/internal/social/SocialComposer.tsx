"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, Trash2, Upload, X, Link as LinkIcon, Scissors } from "lucide-react"
import type { ComposerPlatform, ComposerState, CompositionPlatform } from "@/lib/social/composition"
import type { ShortLink } from "@/lib/social/shortLinks"
import type { PlatformKey } from "@/lib/social/zernio"
import { problemsFor } from "@/lib/social/validate"
import { useCaretInsert } from "@/lib/social/caret"
import PlatformIcon from "@/components/internal/SocialIcons"
import PlatformEditor from "@/components/internal/social/PlatformEditor"
import EmojiPicker from "@/components/internal/social/EmojiPicker"
import ScheduleField from "@/components/internal/social/ScheduleField"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Write one social post and send it to any combination of channels.
 *
 * The shape of the task drives the layout: decide who it goes to, write it
 * once, adjust per channel where it matters, then send. Channel selection sits
 * at the top because it changes what the rest of the page is; the send bar is
 * pinned to the bottom because that's the commitment, and it refuses to arm
 * itself while anything is over a limit or missing a required image.
 *
 * Zernio drafts are created lazily on publish/schedule, so a post abandoned
 * here leaves nothing behind.
 */

type PlatformMap = Partial<Record<PlatformKey, CompositionPlatform>>

interface Editable {
  title: string
  brief: string
  link: string
  masterContent: string
  mediaUrls: string[]
  shortenLinks: boolean
  platforms: PlatformMap
}

function editableFrom(state: ComposerState | null): Editable {
  const c = state?.composition
  return {
    title: c?.title && c.title !== "Untitled post" ? c.title : "",
    brief: c?.brief ?? "",
    link: c?.link ?? "",
    masterContent: c?.masterContent ?? "",
    mediaUrls: c?.mediaUrls ?? [],
    shortenLinks: c?.shortenLinks ?? true,
    platforms: c?.platforms ?? {},
  }
}

/** Status chip wording that matches what the channel is actually doing. */
function statusBadge(status: string | undefined): { label: string; variant: "default" | "secondary" | "outline" | "destructive" } | null {
  switch (status) {
    case "published":
      return { label: "live", variant: "default" }
    case "failed":
      return { label: "failed", variant: "destructive" }
    case "cancelled":
      return { label: "unpublished", variant: "outline" }
    case "scheduled":
      return { label: "scheduled", variant: "secondary" }
    case "publishing":
      return { label: "publishing", variant: "secondary" }
    case "draft":
      return { label: "draft", variant: "outline" }
    default:
      return status ? { label: status, variant: "outline" } : null
  }
}

export default function SocialComposer({ initial }: { initial: ComposerState | null }) {
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const masterBox = useRef<HTMLTextAreaElement>(null)

  const [state, setState] = useState<ComposerState | null>(initial)
  const [edit, setEdit] = useState<Editable>(() => editableFrom(initial))
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [scheduleAt, setScheduleAt] = useState("")
  const [aiOpen, setAiOpen] = useState(false)

  const id = state?.composition.id
  // Stable identity: several hooks below depend on it.
  const specs = useMemo(() => state?.platforms ?? [], [state])

  /**
   * Always update from the previous state, never from the render's closure:
   * toggling two channels in quick succession used to drop the first, because
   * the second handler still held the pre-toggle map.
   */
  const patch = useCallback((partial: Partial<Editable> | ((prev: Editable) => Partial<Editable>)) => {
    setEdit((prev) => ({ ...prev, ...(typeof partial === "function" ? partial(prev) : partial) }))
    setDirty(true)
  }, [])

  // Emoji land where the cursor is in the shared box, same as in each channel.
  const masterCaret = useCaretInsert(masterBox, (next) => setMaster(next))

  /**
   * Short links this post has handed out, by channel. They only exist once
   * something has been sent, which is exactly when the click count starts
   * being worth looking at.
   */
  const linksByPlatform = useMemo(() => {
    const out = new Map<string, ShortLink[]>()
    for (const link of state?.shortLinks ?? []) {
      if (!link.platform) continue
      out.set(link.platform, [...(out.get(link.platform) ?? []), link])
    }
    return out
  }, [state])

  /** Live status per channel, straight from Zernio at last load. */
  const liveOf = useCallback(
    (key: PlatformKey) => specs.find((p) => p.key === key)?.live,
    [specs],
  )

  const selectedKeys = useMemo(
    () => specs.filter((p) => edit.platforms[p.key]).map((p) => p.key),
    [specs, edit.platforms],
  )

  /** Blockers recomputed as you type, using the same rules the API enforces. */
  const blockers = useMemo(() => {
    const out: string[] = []
    for (const spec of specs) {
      const draft = edit.platforms[spec.key]
      if (!draft) continue
      if (!spec.connected) {
        out.push(`${spec.label}: the account isn't connected in Zernio.`)
        continue
      }
      if (liveOf(spec.key)?.status === "published") continue
      // A PDF displaces the image, so don't hand the validator both.
      const documentUrl = draft.documentUrl || undefined
      out.push(
        ...problemsFor(spec, {
          content: draft.content,
          title: draft.title,
          // Only this channel's own images. The upload pool is a library, not
          // a default (see effectiveMedia).
          mediaUrls: spec.supportsMedia && !documentUrl ? (draft.mediaUrls ?? []) : [],
          documentUrl,
          shortenLinks: edit.shortenLinks,
        }),
      )
    }
    return out
  }, [specs, edit.platforms, edit.shortenLinks, liveOf])

  const sendableKeys = selectedKeys.filter((k) => liveOf(k)?.status !== "published")
  const canSend = blockers.length === 0 && sendableKeys.length > 0
  /**
   * One channel is a different job from several. With one there's nothing to
   * reconcile, so the shared post box would just be a second place to type the
   * same words — the channel's own editor is the whole task.
   */
  const multi = selectedKeys.length > 1

  /* ---------------- channel selection ---------------- */

  function toggle(spec: ComposerPlatform) {
    if (edit.platforms[spec.key] && liveOf(spec.key)?.status === "published") {
      setError(`${spec.label} is already live. Unpublish it before removing the channel.`)
      return
    }
    setError(null)
    patch((prev) => {
      const next = { ...prev.platforms }
      if (next[spec.key]) {
        delete next[spec.key]
      } else {
        // Copy the shared post across as written. Anything over the channel's
        // limit shows as over-limit rather than being silently cut — losing the
        // end of someone's sentence without saying so is worse than a blocker.
        next[spec.key] = {
          content: prev.masterContent,
          ...(spec.titleRequired || spec.titleLimit ? { title: prev.title } : {}),
        }
      }
      return { platforms: next }
    })
  }

  /**
   * Select or clear every channel at once. A published channel is left alone —
   * removing it here would not unpublish it, and toggle() refuses for that
   * reason, so the bulk control has to respect it too.
   */
  function toggleAll() {
    setError(null)
    const everything = selectedKeys.length === specs.length
    patch((prev) => {
      if (everything) {
        const next: typeof prev.platforms = {}
        for (const spec of specs) {
          if (liveOf(spec.key)?.status === "published" && prev.platforms[spec.key]) {
            next[spec.key] = prev.platforms[spec.key]
          }
        }
        return { platforms: next }
      }
      const next = { ...prev.platforms }
      for (const spec of specs) {
        if (next[spec.key]) continue
        next[spec.key] = {
          content: prev.masterContent,
          ...(spec.titleRequired || spec.titleLimit ? { title: prev.title } : {}),
        }
      }
      return { platforms: next }
    })
  }

  /**
   * "Customised" means the wording has been pulled away from the shared post,
   * so only a change to the words counts. Picking an image, attaching a PDF or
   * naming a subreddit shouldn't quietly stop the shared caption flowing into
   * this channel — that reads as the editor losing your text.
   */
  function patchPlatform(
    key: PlatformKey,
    partial: Partial<CompositionPlatform>,
    markCustom = "content" in partial || "title" in partial,
  ) {
    patch((prev) => {
      const current = prev.platforms[key]
      if (!current) return {}
      return {
        platforms: {
          ...prev.platforms,
          [key]: { ...current, ...partial, ...(markCustom ? { customised: true } : {}) },
        },
      }
    })
  }

  /** The shared caption flows into every channel the writer hasn't touched. */
  function setMaster(value: string) {
    patch((prev) => {
      const platforms: PlatformMap = { ...prev.platforms }
      for (const key of Object.keys(platforms) as PlatformKey[]) {
        const draft = platforms[key]
        if (!draft || draft.customised) continue
        platforms[key] = { ...draft, content: value }
      }
      return { masterContent: value, platforms }
    })
  }

  function resetToMaster(key: PlatformKey) {
    patch((prev) => ({
      platforms: {
        ...prev.platforms,
        [key]: { ...prev.platforms[key]!, content: prev.masterContent, customised: false },
      },
    }))
  }

  /* ---------------- server calls ---------------- */

  async function post<T>(url: string, body: unknown, method = "POST"): Promise<T | null> {
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = (await r.json().catch(() => ({}))) as T & { error?: string; warning?: string }
    if (!r.ok) {
      setError(data.error ?? "Something went wrong.")
      return null
    }
    if (data.warning) setNotice(`Saved, with warnings: ${data.warning}`)
    return data
  }

  /** Save to Supabase. Creates the row on first save, then keeps the URL stable. */
  async function save(quiet = false): Promise<string | null> {
    setBusy("save")
    setError(null)
    if (!quiet) setNotice(null)
    try {
      const payload = {
        title: edit.title.trim() || "Untitled post",
        brief: edit.brief,
        link: edit.link,
        masterContent: edit.masterContent,
        mediaUrls: edit.mediaUrls,
        shortenLinks: edit.shortenLinks,
        platforms: edit.platforms,
      }
      const data = id
        ? await post<ComposerState>("/api/internal/social/compose", { id, ...payload }, "PUT")
        : await post<ComposerState>("/api/internal/social/compose", payload)
      if (!data) return null
      setState(data)
      setDirty(false)
      if (!id) window.history.replaceState(null, "", `/internal/social/${data.composition.id}`)
      if (!quiet) setNotice("Saved.")
      return data.composition.id
    } finally {
      setBusy(null)
    }
  }

  async function generate() {
    if (!selectedKeys.length) {
      setError("Pick at least one channel first.")
      return
    }
    setBusy("generate")
    setError(null)
    setNotice(null)
    try {
      const data = await post<{ platforms: Record<string, { content: string; title?: string }> }>(
        "/api/internal/social/generate",
        {
          brief: edit.brief,
          title: edit.title,
          link: edit.link,
          keys: selectedKeys,
        },
      )
      if (!data) return
      // Written while the request was in flight, so fold into current state.
      patch((prev) => {
        const platforms: PlatformMap = { ...prev.platforms }
        for (const [key, written] of Object.entries(data.platforms)) {
          const k = key as PlatformKey
          const draft = platforms[k]
          if (!draft || liveOf(k)?.status === "published") continue
          platforms[k] = {
            ...draft,
            content: written.content,
            ...(written.title ? { title: written.title } : {}),
            customised: true, // generated copy is per-channel by definition
          }
        }
        return { platforms }
      })
      setNotice("Written. Read it before you send it.")
    } finally {
      setBusy(null)
    }
  }

  /**
   * Add one image to a channel, keeping carousel order.
   *
   * A channel that carries several appends, because the order you add them in
   * is the order they are swiped. A single-image channel replaces, because
   * there is no order to keep. A full carousel keeps what it has: the count
   * next to the picker says why.
   */
  function withImage(list: string[], url: string, max: number): string[] {
    if (list.includes(url)) return list
    if (max <= 1) return [url]
    return list.length >= max ? list : [...list, url]
  }

  /**
   * Upload an image.
   *
   * `only` is the normal case: the image belongs to that channel and nothing
   * else. Without it (the "Add image to all" button) the image is added to
   * every channel that can show one, which is the only way an image is ever
   * shared. It's written rather than inherited so each card shows what it
   * will actually publish.
   *
   * Either way the URL joins the composition's pool, so any channel can pick
   * it later from its own picker.
   */
  async function upload(file: File, only?: PlatformKey) {
    setBusy(only ? `upload:${only}` : "upload")
    setError(null)
    try {
      const form = new FormData()
      form.append("image", file)
      const r = await fetch("/api/internal/social/image", { method: "POST", body: form })
      const data = (await r.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!r.ok || !data.url) {
        setError(data.error ?? "Image upload failed.")
        return
      }
      patch((prev) => {
        const platforms: PlatformMap = { ...prev.platforms }
        if (only) {
          const draft = platforms[only]
          const spec = specs.find((p) => p.key === only)
          if (draft && spec) {
            platforms[only] = { ...draft, mediaUrls: withImage(draft.mediaUrls ?? [], data.url!, spec.maxMedia) }
          }
        } else {
          // "to all" means all: every channel that can show an image gets it,
          // and every image stays in the pool to re-pick from.
          for (const spec of specs) {
            const draft = platforms[spec.key]
            if (!draft || !spec.supportsMedia) continue
            platforms[spec.key] = {
              ...draft,
              mediaUrls: withImage(draft.mediaUrls ?? [], data.url!, spec.maxMedia),
            }
          }
        }
        const pool = prev.mediaUrls.includes(data.url!) ? prev.mediaUrls : [...prev.mediaUrls, data.url!]
        return { mediaUrls: pool, platforms }
      })
    } finally {
      setBusy(null)
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  /**
   * Drop an image from the whole post, not just from the channel it was
   * clicked on: it came from one pool, so leaving it attached elsewhere while
   * it's gone from the picker is how you end up publishing an image you
   * thought you'd deleted. Channels using it fall back to no image, which
   * shows as a blocker on the two that require one.
   *
   * The Sanity asset itself stays — it may be in a post that's already live.
   */
  function removeImage(url: string) {
    patch((prev) => {
      const platforms: PlatformMap = { ...prev.platforms }
      for (const key of Object.keys(platforms) as PlatformKey[]) {
        const draft = platforms[key]
        if (!draft?.mediaUrls?.includes(url)) continue
        platforms[key] = { ...draft, mediaUrls: draft.mediaUrls.filter((u) => u !== url) }
      }
      return { mediaUrls: prev.mediaUrls.filter((u) => u !== url), platforms }
    })
  }

  /**
   * Attach a PDF to one channel (LinkedIn, today). Unlike an image this is
   * never shared across channels — only LinkedIn renders it, and it replaces
   * whatever image that channel had.
   */
  async function uploadDocument(file: File, key: PlatformKey) {
    setBusy(`doc:${key}`)
    setError(null)
    try {
      const form = new FormData()
      form.append("document", file)
      const r = await fetch("/api/internal/social/document", { method: "POST", body: form })
      const data = (await r.json().catch(() => ({}))) as { url?: string; name?: string; error?: string }
      if (!r.ok || !data.url) {
        setError(data.error ?? "Document upload failed.")
        return
      }
      // Attaching a file isn't a copy edit, so it mustn't unlink the channel
      // from the shared post.
      patchPlatform(key, { documentUrl: data.url, documentName: data.name })
    } finally {
      setBusy(null)
    }
  }

  async function send(mode: "now" | "schedule" | "cancel") {
    const labels = specs.filter((p) => sendableKeys.includes(p.key)).map((p) => p.label)
    if (mode !== "cancel") {
      const when = mode === "now" ? "right now" : `on ${new Date(scheduleAt).toLocaleString()}`
      if (!window.confirm(`Post to ${labels.join(", ")} ${when}?`)) return
    }

    const savedId = await save(true)
    if (!savedId) return

    setBusy(mode)
    setError(null)
    setNotice(null)
    try {
      const data = await post<ComposerState & { results?: Array<{ key: PlatformKey; status?: string; error?: string }> }>(
        "/api/internal/social/compose/publish",
        {
          id: savedId,
          keys: mode === "cancel" ? selectedKeys : sendableKeys,
          mode,
          ...(mode === "schedule"
            ? {
                scheduledFor: new Date(scheduleAt).toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }
            : {}),
        },
      )
      if (!data) return
      setState(data)
      setEdit(editableFrom(data))
      setDirty(false)

      const results = data.results ?? []
      const failed = results.filter((r) => r.error)
      const ok = results.filter((r) => !r.error)
      if (failed.length) setError(failed.map((f) => `${f.key}: ${f.error}`).join(" · "))
      if (ok.length) {
        setNotice(
          mode === "cancel"
            ? "Schedule cancelled — these are drafts again."
            : mode === "schedule"
              ? `Scheduled on ${ok.length} channel${ok.length > 1 ? "s" : ""}.`
              : `Sending on ${ok.length} channel${ok.length > 1 ? "s" : ""} — Zernio pushes them out now.`,
        )
      }
    } finally {
      setBusy(null)
    }
  }

  async function unpublish(spec: ComposerPlatform) {
    const live = liveOf(spec.key)
    if (!live) return
    if (!window.confirm(`Delete this post from ${spec.label}? It comes off the platform immediately.`)) return
    setBusy(`unpublish:${spec.key}`)
    setError(null)
    setNotice(null)
    try {
      const r = await fetch("/api/internal/social/unpublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: live.postId, key: spec.key }),
      })
      const data = (await r.json().catch(() => ({}))) as { error?: string }
      if (!r.ok) {
        setError(data.error ?? "Unpublish failed.")
        return
      }
      await refresh()
      setNotice(`Removed from ${spec.label}. Edit and send again whenever.`)
    } finally {
      setBusy(null)
    }
  }

  async function refresh() {
    if (!id) return
    const r = await fetch(`/api/internal/social/compose?id=${encodeURIComponent(id)}`)
    const data = (await r.json().catch(() => ({}))) as ComposerState & { error?: string }
    if (!r.ok) {
      setError(data.error ?? "Failed to reload.")
      return
    }
    setState(data)
    setEdit(editableFrom(data))
    setDirty(false)
  }

  async function destroy() {
    if (!id) {
      router.push("/internal/social")
      return
    }
    if (!window.confirm("Delete this post and its drafts? This can't be undone.")) return
    setBusy("delete")
    setError(null)
    try {
      const r = await fetch(`/api/internal/social/compose?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      const data = (await r.json().catch(() => ({}))) as { error?: string }
      if (!r.ok) {
        setError(data.error ?? "Delete failed.")
        return
      }
      router.push("/internal/social")
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  const scheduled = state?.composition.scheduledFor
  const working = busy !== null

  return (
    <div className="space-y-4 pb-28">
      {/* ---------- name + save, one line, no panel ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          value={edit.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Name this post (internal only)"
          aria-label="Post name, internal only"
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-lg font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-2">
          {dirty && <span className="text-xs text-muted-foreground">unsaved</span>}
          <Button variant="outline" size="sm" onClick={() => void save()} disabled={working}>
            {busy === "save" ? <Loader2 className="animate-spin" /> : null}
            Save draft
          </Button>
          <Button variant="destructive" size="sm" onClick={() => void destroy()} disabled={working}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      {/* ---------- 1. pick the channels ---------- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Channels</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {selectedKeys.length === 0
                ? "Pick one to write a single post. Pick several and you can write once, then adapt each."
                : `${selectedKeys.length} of ${specs.length} selected · ${specs.length} connected in Zernio`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleAll()}
            disabled={working}
            className="text-xs font-medium text-primary underline-offset-2 hover:underline disabled:opacity-50"
          >
            {selectedKeys.length === specs.length ? "Clear all" : `Select all ${specs.length}`}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {specs.map((spec) => {
            const on = Boolean(edit.platforms[spec.key])
            const live = liveOf(spec.key)
            return (
              <button
                key={spec.key}
                type="button"
                onClick={() => toggle(spec)}
                aria-pressed={on}
                disabled={!spec.connected}
                title={spec.connected ? `${spec.limit} characters` : "Not connected in Zernio"}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  on
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <PlatformIcon platform={spec.key} size={14} />
                <span className="font-medium">{spec.label}</span>
                <span className="font-mono text-[11px] tabular-nums opacity-70">{spec.limit}</span>
                {live?.status === "published" && (
                  <span className="font-mono text-[10px] uppercase tracking-wide text-primary">live</span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Shared file input, used by the toolbar; channel cards have their own. */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void upload(file)
        }}
      />

      {/* ---------- 2. tools + optional link, a row rather than a panel ---------- */}
      {selectedKeys.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={aiOpen ? "default" : "outline"} size="sm" onClick={() => setAiOpen((v) => !v)} disabled={working}>
            <Sparkles />
            Write with AI
          </Button>
          {multi && (
            <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()} disabled={working}>
              {busy === "upload" ? <Loader2 className="animate-spin" /> : <Upload />}
              Add image to all
            </Button>
          )}
          <label className="flex min-w-[15rem] flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20">
            <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              value={edit.link}
              onChange={(e) => patch({ link: e.target.value })}
              placeholder="Link (optional) — skipped on Instagram and Pinterest"
              inputMode="url"
              aria-label="Link"
              className="h-9 w-full min-w-0 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <Button
            variant={edit.shortenLinks ? "default" : "outline"}
            size="sm"
            aria-pressed={edit.shortenLinks}
            onClick={() => patch({ shortenLinks: !edit.shortenLinks })}
            disabled={working}
            title={
              edit.shortenLinks
                ? "Links become fruitionservices.io/s/… when this sends, one code per channel so clicks split by platform"
                : "Links go out exactly as written"
            }
          >
            <Scissors />
            Short links {edit.shortenLinks ? "on" : "off"}
          </Button>
        </div>
      )}

      {/* AI brief, opened from the toolbar instead of sitting in a panel forever. */}
      {selectedKeys.length > 0 && aiOpen && (
        <section className="rounded-xl border border-border bg-card p-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              What&apos;s it about
            </span>
            <textarea
              value={edit.brief}
              onChange={(e) => patch({ brief: e.target.value })}
              rows={2}
              placeholder="A sentence or two in your own words. Everything else is written from this."
              className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {multi
                ? `Writes a version for each of the ${selectedKeys.length} channels, inside their limits.`
                : `Writes it for ${specs.find((s) => s.key === selectedKeys[0])?.label}, inside its limits.`}
            </p>
            <Button size="sm" onClick={() => void generate()} disabled={working || !edit.brief.trim()}>
              {busy === "generate" ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {multi ? `Write ${selectedKeys.length} versions` : "Write it"}
            </Button>
          </div>
        </section>
      )}

      {/* The post and when it goes, beside the channels it goes to. Replaces a
          fixed bottom bar, which hid the schedule under the channel list. */}
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-5">
        {/* ---------- 3. the shared post — only worth having for several channels ---------- */}
        {multi && (
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-foreground">The post</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Flows into every channel below that you haven&apos;t edited separately.
                </p>
              </div>
              {/* No tag picker here: a tag is per-channel markup, and LinkedIn's
                  would arrive on X as literal brackets. */}
              <EmojiPicker onPick={masterCaret.insert} onClose={masterCaret.restore} disabled={working} />
            </div>

            <textarea
              ref={masterBox}
              value={edit.masterContent}
              onChange={(e) => setMaster(e.target.value)}
              onSelect={masterCaret.remember}
              onKeyUp={masterCaret.remember}
              onClick={masterCaret.remember}
              rows={4}
              placeholder="Write it once here, then adjust any channel that needs different wording."
              className="mt-3 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
            />

            {edit.mediaUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {edit.mediaUrls.map((url) => (
                  <span key={url} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="size-12 rounded-md border border-border object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      disabled={working}
                      aria-label="Delete this image from the post"
                      title="Delete from the post"
                      className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:border-destructive hover:text-destructive disabled:opacity-50"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                <span className="text-xs text-muted-foreground">
                  Uploaded to this post — each channel picks its own from here. Delete one and it goes
                  from every channel.
                </span>
              </div>
            )}
          </section>
        )}

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">When</h2>
            <div className="mt-3 flex flex-col gap-3">

                      <div className="min-w-0 flex-1">
                        {error && (
                          <p role="alert" className="truncate text-xs text-destructive" title={error}>
                            {error}
                          </p>
                        )}
                        {!error && notice && <p className="truncate text-xs text-primary">{notice}</p>}
                        {!error && !notice && blockers.length > 0 && (
                          <p className="truncate text-xs text-muted-foreground" title={blockers.join(" · ")}>
                            {blockers[0]}
                            {blockers.length > 1 ? ` (+${blockers.length - 1} more)` : ""}
                          </p>
                        )}
                        {!error && !notice && blockers.length === 0 && scheduled && (
                          <p className="truncate text-xs text-muted-foreground">
                            Scheduled for {new Date(scheduled).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {scheduled ? (
                          <Button variant="outline" size="sm" onClick={() => void send("cancel")} disabled={working}>
                            {busy === "cancel" ? <Loader2 className="animate-spin" /> : null}
                            Cancel schedule
                          </Button>
                        ) : (
                          <>
                            <ScheduleField value={scheduleAt} onChange={setScheduleAt} disabled={working} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => void send("schedule")}
                              disabled={working || !canSend || !scheduleAt}
                            >
                              {busy === "schedule" ? <Loader2 className="animate-spin" /> : null}
                              Schedule
                            </Button>
                          </>
                        )}
                        <Button size="sm" onClick={() => void send("now")} disabled={working || !canSend}>
                          {busy === "now" ? <Loader2 className="animate-spin" /> : null}
                          Post now
                          {sendableKeys.length > 0 ? ` (${sendableKeys.length})` : ""}
                        </Button>
                      </div>
        
            </div>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
        {/* ---------- per channel ---------- */}
        {selectedKeys.length === 0 ? (
          <section className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-sm font-medium text-foreground">Pick a channel to start writing</p>
            <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
              Every channel gets its own post and its own limits. X caps at 280 characters including the link, Instagram
              and Pinterest need an image, Reddit needs a title.
            </p>
          </section>
        ) : (
          <div className={`grid gap-4 ${multi ? "lg:grid-cols-2" : ""}`}>
            {specs
              .filter((spec) => edit.platforms[spec.key])
              .map((spec) => {
                const draft = edit.platforms[spec.key]!
                const live = liveOf(spec.key)
                const published = live?.status === "published"
                const badge = statusBadge(live?.status)
                return (
                  <article key={spec.key} className="flex flex-col rounded-xl border border-border bg-card p-4">
                    <header className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <PlatformIcon platform={spec.key} size={16} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground">{spec.label}</span>
                          <span className="block text-xs text-muted-foreground">@{spec.account.replace(/^@/, "")}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {live?.platformUrl && (
                          <a
                            href={live.platformUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                          >
                            View post
                          </a>
                        )}
                        {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                      </div>
                    </header>

                    <PlatformEditor
                      spec={spec}
                      value={draft}
                      images={edit.mediaUrls}
                      disabled={published}
                      uploading={busy === `upload:${spec.key}`}
                      uploadingDocument={busy === `doc:${spec.key}`}
                      shortenLinks={edit.shortenLinks}
                      onChange={(p) => patchPlatform(spec.key, p)}
                      onUpload={(file) => void upload(file, spec.key)}
                      onUploadDocument={
                        spec.supportsDocument ? (file) => void uploadDocument(file, spec.key) : undefined
                      }
                      onRemoveImage={removeImage}
                    />

                    {(linksByPlatform.get(spec.key)?.length ?? 0) > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Short link
                        </span>
                        {linksByPlatform.get(spec.key)!.map((link) => (
                          <span key={link.code} className="flex items-center gap-1.5 text-xs">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-primary underline-offset-2 hover:underline"
                              title={link.targetUrl}
                            >
                              /s/{link.code}
                            </a>
                            <span className="tabular-nums text-muted-foreground">
                              {link.clicks} click{link.clicks === 1 ? "" : "s"}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    <footer className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">
                        {!multi ? "" : draft.customised ? "Edited for this channel" : "Following the shared post"}
                      </span>
                      <div className="flex gap-2">
                        {multi && draft.customised && !published && (
                          <Button variant="ghost" size="xs" onClick={() => resetToMaster(spec.key)} disabled={working}>
                            Reset
                          </Button>
                        )}
                        {published && spec.key !== "instagram" && (
                          <Button
                            variant="destructive"
                            size="xs"
                            onClick={() => void unpublish(spec)}
                            disabled={working}
                          >
                            {busy === `unpublish:${spec.key}` ? <Loader2 className="animate-spin" /> : null}
                            Unpublish
                          </Button>
                        )}
                        {published && spec.key === "instagram" && (
                          <span className="text-xs text-muted-foreground">Delete in the Instagram app</span>
                        )}
                      </div>
                    </footer>

                    {live?.status === "failed" && live.error && (
                      <p className="mt-2 text-xs text-destructive">{live.error}</p>
                    )}
                  </article>
                )
              })}
          </div>
        )}
        </div>
      </div>

    </div>
  )
}

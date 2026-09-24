"use client"

import { useMemo, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RichTextEditor from "@/components/internal/RichTextEditor"

export interface CategoryOption {
  _id: string
  title: string
}

/** The publishable fields of a post, shared by the editor state and the live copy. */
export interface BlogEditorFields {
  title?: string
  slug?: string
  excerpt?: string
  industry?: string
  categoryIds?: string[]
  seoKeyword?: string
  seoTitle?: string
  seoDescription?: string
  publishedAt?: string
  body?: string
  author?: string
}

export interface BlogEditorInitial extends BlogEditorFields {
  draftId?: string
  /** Sanity doc id — editing a published post updates it in place on publish. */
  docId?: string
  /**
   * The post exactly as it stands on the live site, when it differs from what
   * the editor opens with (a draft is the working copy; Sanity is what readers
   * see). The primary button compares against this to decide whether there is
   * anything to update. Omit when the two are the same.
   */
  live?: BlogEditorFields
  /**
   * The draft's full metadata row, passed through so saving from the editor
   * preserves pipeline keys it doesn't edit (status, monday_item_id,
   * google_doc_url, …) instead of overwriting the whole object.
   */
  metadata?: Record<string, unknown>
}

const INDUSTRIES = [
  { value: "", label: "— none —" },
  { value: "ai", label: "AI" },
  { value: "construction", label: "Construction" },
  { value: "hr", label: "HR" },
  { value: "real-estate", label: "Real Estate" },
  { value: "marketing", label: "Marketing" },
  { value: "saas", label: "SaaS" },
  { value: "professional-services", label: "Professional Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "product", label: "Product" },
]

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

/** Radix Select has no empty-string value, so "use my byline" needs a sentinel. */
const AUTHOR_DEFAULT = "__default__"

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

const inputClass =
  "block w-full rounded-chip border border-[var(--color-border)] bg-surface px-4 py-3 text-sm text-ink-heading placeholder:text-ink-faint outline-none transition hover:border-[var(--purple-light)] focus:border-[var(--purple-primary)] focus:ring-2 focus:ring-[rgba(128,21,232,0.18)]"

/** Ignore trailing spaces and runs of blank lines when diffing bodies. */
function normaliseBody(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/**
 * What a publish would leave in Sanity, as a comparable string.
 *
 * Mirrors the write rules in upsertBlogPost: an empty optional field means
 * "leave what's there" rather than "clear it", so a draft that never filled in
 * an excerpt doesn't read as a pending change to a live post that has one.
 * `fallback` supplies those inherited values — pass the live post when there is
 * one, so the fingerprint answers "would publishing change the site?".
 */
function publishFingerprint(fields: BlogEditorFields, fallback: BlogEditorFields): string {
  const pick = (a?: string, b?: string) => (a?.trim() ? a.trim() : (b ?? "").trim())
  const cats = fields.categoryIds?.length ? fields.categoryIds : (fallback.categoryIds ?? [])
  return JSON.stringify({
    title: (fields.title ?? "").trim(),
    slug: slugify(fields.slug ?? fields.title ?? ""),
    body: normaliseBody(fields.body ?? ""),
    author: pick(fields.author, fallback.author),
    excerpt: pick(fields.excerpt, fallback.excerpt),
    industry: pick(fields.industry, fallback.industry),
    seoKeyword: pick(fields.seoKeyword, fallback.seoKeyword),
    seoTitle: pick(fields.seoTitle, fallback.seoTitle),
    seoDescription: pick(fields.seoDescription, fallback.seoDescription),
    // Only the calendar day is editable, so compare at that resolution.
    publishedAt: pick(fields.publishedAt, fallback.publishedAt).slice(0, 10),
    categoryIds: [...cats].sort(),
  })
}

export default function BlogEditor({
  categories,
  authors = [],
  currentAuthorName,
  initial,
}: {
  categories: CategoryOption[]
  authors?: string[]
  /** The signed-in user's resolved byline, shown as the default author. */
  currentAuthorName?: string
  initial?: BlogEditorInitial
}) {
  const [draftId, setDraftId] = useState(initial?.draftId)
  const [title, setTitle] = useState(initial?.title ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "")
  const [industry, setIndustry] = useState(initial?.industry ?? "")
  const [categoryIds, setCategoryIds] = useState<string[]>(initial?.categoryIds ?? [])
  const [seoKeyword, setSeoKeyword] = useState(initial?.seoKeyword ?? "")
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "")
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "")
  const [publishedAt, setPublishedAt] = useState(initial?.publishedAt ?? "")
  const [body, setBody] = useState(initial?.body ?? "")
  const [author, setAuthor] = useState(initial?.author ?? "")
  const [cover, setCover] = useState<File | null>(null)

  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)
  const [savingDraft, startDraft] = useTransition()
  /* Send the social drafts as soon as the page is live.
   *
   * Default on for an unpublished draft and off for a live post: the first
   * publish is the moment the captions were written for, and a later edit is
   * usually a typo fix that should not re-announce the post. */
  const [alsoSendSocial, setAlsoSendSocial] = useState(!initial?.docId)
  const [publishing, startPublish] = useTransition()
  const [unpublishing, startUnpublish] = useTransition()

  // Editing a live Sanity doc: the primary action updates it in place, and
  // Unpublish becomes available. Set once the post exists in Sanity — either
  // because it was already live when the page loaded, or because publishing
  // from here just put it there.
  const [docId, setDocId] = useState(initial?.docId)
  const isPublished = Boolean(docId)

  /**
   * Pipeline keys the editor doesn't render (status, monday_item_id,
   * google_doc_url, and the sanity_doc_id written on publish). Held in state
   * so a publish can add to them and a later draft save still carries them —
   * the draft save replaces the whole metadata object.
   */
  const [pipelineMeta, setPipelineMeta] = useState<Record<string, unknown>>(
    () => initial?.metadata ?? {},
  )

  const effectiveSlug = useMemo(
    () => (slugTouched && slug ? slugify(slug) : slugify(title)),
    [slug, slugTouched, title],
  )

  /**
   * The published state to diff against. Starts as the live post (or, on a
   * post with no separate live copy, the values the editor opened with) and is
   * replaced after every successful publish, so the button settles back to
   * "no changes" once the site matches.
   */
  const [published, setPublished] = useState<BlogEditorFields>(
    () => initial?.live ?? (initial as BlogEditorFields | undefined) ?? {},
  )
  const publishedPrint = useMemo(
    () => publishFingerprint(published, published),
    [published],
  )
  const currentPrint = useMemo(
    () =>
      publishFingerprint(
        {
          title,
          // Same derivation as effectiveSlug, so clearing the field falls back
          // to the title rather than reading as a change to an empty slug.
          slug: slugTouched && slug ? slug : title,
          excerpt,
          industry,
          categoryIds,
          seoKeyword,
          seoTitle,
          seoDescription,
          publishedAt,
          body,
          author: author || currentAuthorName,
        },
        published,
      ),
    [
      title,
      slug,
      slugTouched,
      excerpt,
      industry,
      categoryIds,
      seoKeyword,
      seoTitle,
      seoDescription,
      publishedAt,
      body,
      author,
      currentAuthorName,
      published,
    ],
  )
  // A newly picked cover image is a change no fingerprint can see.
  const dirty = currentPrint !== publishedPrint || cover !== null

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function metadata() {
    return {
      // Preserve pipeline keys (status, monday_item_id, google_doc_url,
      // sanity_doc_id, …) the editor doesn't manage — the draft save replaces
      // the whole object.
      ...pipelineMeta,
      excerpt,
      industry,
      categoryIds,
      seoKeyword,
      seoTitle,
      seoDescription,
      publishedAt,
      author,
      slug: effectiveSlug,
    }
  }

  function onSaveDraft() {
    setError(null)
    setStatus(null)
    if (!title.trim()) {
      setError("Add a title before saving a draft.")
      return
    }
    startDraft(async () => {
      const r = await fetch("/api/internal/blog/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draftId, title, body_markdown: body, metadata: metadata() }),
      })
      const data = (await r.json().catch(() => ({}))) as { id?: string; error?: string }
      if (!r.ok || !data.id) {
        setError(data.error ?? "Failed to save draft.")
        return
      }
      setDraftId(data.id)
      setStatus("Draft saved.")
    })
  }

  /* Send every social draft attached to this post, once it is live.
   *
   * Goes through the same two endpoints the Social tab uses rather than a new
   * one, so a caption sent from here is identical to one sent from there.
   * Only drafts are sent: anything Zernio already reports as scheduled or
   * published is skipped, which is what makes pressing publish twice safe.
   *
   * Never throws into the publish flow. By the time this runs the post is
   * already public, so a Zernio outage has to leave a message, not undo a
   * publish that succeeded. */
  async function sendSocialDrafts(slug: string, liveDraftId: string | null): Promise<string> {
    try {
      const q = new URLSearchParams({ slug })
      if (liveDraftId) q.set("draftId", liveDraftId)
      if (docId) q.set("docId", docId)
      const r = await fetch(`/api/internal/blog/social?${q.toString()}`)
      const state = (await r.json().catch(() => ({}))) as {
        platforms?: Array<{
          key: string
          label: string
          post?: { id: string; content: string; title?: string; status: string }
        }>
        error?: string
      }
      if (!r.ok) return ` Social not sent: ${state.error ?? "could not read the drafts"}.`

      const items = (state.platforms ?? [])
        .filter((pl) => pl.post && /draft/i.test(pl.post.status) && pl.post.content.trim())
        .map((pl) => ({ key: pl.key, postId: pl.post!.id, content: pl.post!.content, title: pl.post!.title }))
      if (items.length === 0) return " No social drafts were waiting."

      const pr = await fetch("/api/internal/blog/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, draftId: liveDraftId ?? undefined, docId: docId ?? undefined, items }),
      })
      const pd = (await pr.json().catch(() => ({}))) as {
        results?: Array<{ key: string; ok: boolean; error?: string }>
        error?: string
      }
      if (!pr.ok) return ` Social not sent: ${pd.error ?? "publish failed"}.`
      const results = pd.results ?? []
      const failed = results.filter((x) => !x.ok)
      if (failed.length === 0) return ` All ${results.length} social posts went out.`
      return (
        ` ${results.length - failed.length} of ${results.length} social posts went out. ` +
        `Failed: ${failed.map((f) => `${f.key} (${f.error ?? "unknown"})`).join(", ")} — retry them in the Social tab.`
      )
    } catch (err) {
      return ` Social not sent: ${err instanceof Error ? err.message : String(err)}.`
    }
  }

  function onPublish() {
    setError(null)
    setStatus(null)
    setPublishedSlug(null)
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required to publish.")
      return
    }
    if (cover && cover.size > MAX_IMAGE_BYTES) {
      setError("Cover image exceeds 8 MB.")
      return
    }
    const fd = new FormData()
    fd.set("title", title.trim())
    fd.set("body", body)
    fd.set("slug", effectiveSlug)
    fd.set("excerpt", excerpt.trim())
    fd.set("industry", industry)
    fd.set("author", author)
    fd.set("seoKeyword", seoKeyword.trim())
    fd.set("seoTitle", seoTitle.trim())
    fd.set("seoDescription", seoDescription.trim())
    if (publishedAt) fd.set("publishedAt", new Date(publishedAt).toISOString())
    // The doc id is what makes this an update rather than a second post at the
    // same URL. It comes from the live post the page resolved for this draft.
    if (docId) fd.set("docId", docId)
    categoryIds.forEach((id) => fd.append("categoryIds", id))
    if (cover) fd.set("coverImage", cover)

    // What the site will hold once this write lands.
    const justPublished: BlogEditorFields = {
      title,
      slug: effectiveSlug,
      excerpt,
      industry,
      categoryIds,
      seoKeyword,
      seoTitle,
      seoDescription,
      publishedAt,
      body,
      author: author || currentAuthorName,
    }
    const wasPublished = isPublished

    startPublish(async () => {
      const r = await fetch("/api/internal/blog", { method: "POST", body: fd })
      const data = (await r.json().catch(() => ({}))) as {
        id?: string
        slug?: string
        body?: string
        error?: string
        imageWarnings?: string[]
        cacheWarning?: string
      }
      if (!r.ok || !data.slug) {
        setError(data.error ?? "Publish failed.")
        return
      }

      // Publishing can rewrite the body (remote images are pulled into
      // Sanity), so adopt what was actually stored.
      const storedBody = data.body ?? body
      if (storedBody !== body) setBody(storedBody)
      justPublished.body = storedBody

      // Keep the portal copy in step with what's now live, and remember which
      // Sanity document it is — that's what makes the *next* edit an update
      // instead of a fork.
      const nextMeta = {
        ...pipelineMeta,
        status: "published",
        sanity_doc_id: data.id ?? docId,
        last_published_at: new Date().toISOString(),
      }
      setPipelineMeta(nextMeta)
      if (data.id) setDocId(data.id)
      if (draftId) {
        await fetch("/api/internal/blog/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: draftId,
            title,
            body_markdown: storedBody,
            metadata: { ...metadata(), ...nextMeta, slug: data.slug },
          }),
        }).catch(() => {})
      }

      setCover(null)
      setPublished({ ...justPublished, slug: data.slug })
      setPublishedSlug(data.slug)
      const warnings = [...(data.imageWarnings ?? []), data.cacheWarning].filter(Boolean)
      if (warnings.length) setError(warnings.join(" "))
      const base = wasPublished ? "Updated — the live post now matches this." : "Published to Sanity."
      if (alsoSendSocial && data.slug) {
        setStatus(`${base} Sending social posts…`)
        const note = await sendSocialDrafts(data.slug, draftId ?? null)
        /* Sent once. Leaving it armed would re-announce the post on the next
           save, and a social post cannot be recalled. */
        setAlsoSendSocial(false)
        setStatus(base + note)
      } else {
        setStatus(base)
      }
    })
  }

  /**
   * Take a live post off the site: save its content as a portal draft first
   * (so nothing is lost and it can be re-published), then delete the Sanity
   * doc and jump to the new draft.
   */
  function onUnpublish() {
    if (!docId) return
    if (
      !window.confirm(
        "Unpublish this post? It comes off the live site immediately. A copy is kept in portal drafts so you can re-publish it later.",
      )
    ) {
      return
    }
    setError(null)
    setStatus(null)
    startUnpublish(async () => {
      const draftRes = await fetch("/api/internal/blog/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draftId,
          title,
          body_markdown: body,
          metadata: { ...metadata(), status: "unpublished", unpublished_doc_id: docId },
        }),
      })
      const draftData = (await draftRes.json().catch(() => ({}))) as { id?: string; error?: string }
      if (!draftRes.ok || !draftData.id) {
        setError(draftData.error ?? "Could not save a draft copy — the post was NOT unpublished.")
        return
      }
      const delRes = await fetch(`/api/internal/blog?docId=${encodeURIComponent(docId)}`, {
        method: "DELETE",
      })
      const delData = (await delRes.json().catch(() => ({}))) as { error?: string }
      if (!delRes.ok) {
        setError(delData.error ?? "Unpublish failed — the post is still live.")
        return
      }
      window.location.href = `/internal/blog/${draftData.id}/edit`
    })
  }

  // Cheap, honest checks — each one is something the editor can actually see.
  const keywordLower = seoKeyword.trim().toLowerCase()
  const seoChecks = [
    {
      label: keywordLower
        ? `Target keyword ${
            title.toLowerCase().includes(keywordLower) ? "is in" : "is missing from"
          } the title`
        : "No target keyword set yet",
      ok: Boolean(keywordLower) && title.toLowerCase().includes(keywordLower),
    },
    {
      label: `SEO title ${seoTitle.length}/60 characters`,
      ok: seoTitle.length > 0 && seoTitle.length <= 60,
    },
    {
      label: `Meta description ${seoDescription.length}/160 characters`,
      ok: seoDescription.length > 0 && seoDescription.length <= 160,
    },
    {
      label: cover || isPublished ? "Cover image set" : "No cover image — social cards fall back",
      ok: Boolean(cover) || isPublished,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Actions first. They used to sit under ten metadata fields, which put
          Publish below the fold on every screen shorter than the sidebar. */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isPublished ? (
              <Badge
                variant="outline"
                className="border-[var(--success-strong)]/30 bg-[var(--success-surface)] text-[var(--success-strong)]"
              >
                Live
              </Badge>
            ) : (
              <Badge variant="outline">Draft</Badge>
            )}
            <p className="text-xs text-muted-foreground">
              {isPublished
                ? dirty
                  ? "Edits here are not on the site yet."
                  : "This editor matches the live post."
                : "Not on the site yet — Publish puts it live."}
            </p>
          </div>
          {isPublished && (published.slug || effectiveSlug) ? (
            <a
              href={`/post/${published.slug || effectiveSlug}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block font-mono text-xs text-[var(--purple-primary)] underline-offset-2 hover:underline"
            >
              /post/{published.slug || effectiveSlug}
            </a>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {/* The same choice the Slack approval card offers, in the same
              words, so somebody who has used one already knows the other. */}
          <label
            className="flex items-center gap-2 text-sm"
            title="Sends the Zernio drafts for this post once the page is live. They cannot be recalled."
            style={{ color: "var(--ink-body)" }}
          >
            <input
              type="checkbox"
              checked={alsoSendSocial}
              onChange={(e) => setAlsoSendSocial(e.target.checked)}
              disabled={publishing || unpublishing}
            />
            <span>Send social</span>
          </label>
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={savingDraft || unpublishing}
          >
            {savingDraft ? "Saving…" : "Save draft"}
          </Button>
          <Button
            variant="brand"
            onClick={onPublish}
            // On a live post there is nothing to do until something changes;
            // the label switches to "Update post" the moment there is.
            disabled={publishing || unpublishing || (isPublished && !dirty)}
            title={
              isPublished && !dirty
                ? "Edit something first — the live post is already up to date."
                : undefined
            }
          >
            {publishing
              ? isPublished
                ? "Updating…"
                : "Publishing…"
              : isPublished
                ? dirty
                  ? "Update post"
                  : "No changes"
                : alsoSendSocial
                  ? "Approve and publish"
                  : "Publish"}
          </Button>
          {isPublished && (
            <Button
              variant="destructive-outline"
              onClick={onUnpublish}
              disabled={publishing || unpublishing || savingDraft}
            >
              {unpublishing ? "Unpublishing…" : "Unpublish"}
            </Button>
          )}
        </div>
      </div>

        {error && (
          <div
            className="rounded-chip px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--danger-surface)", color: "var(--danger-strong)" }}
            role="alert"
          >
            {error}
          </div>
        )}
        {status && (
          <div
            className="rounded-chip px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--success-surface)", color: "var(--success-strong)" }}
          >
            {status}{" "}
            {publishedSlug && (
              <a
                href={`/post/${publishedSlug}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline"
              >
                View post →
              </a>
            )}
          </div>
        )}

        {isPublished && (
          <p className="text-xs text-[var(--color-text-secondary)]">
            {dirty ? (
              <>
                Unpublished changes — “Update post” writes them to Sanity and refreshes{" "}
                <a
                  href={`/post/${published.slug || effectiveSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  the live page
                </a>
                .
              </>
            ) : (
              <>
                This editor matches{" "}
                <a
                  href={`/post/${published.slug || effectiveSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  the live post
                </a>
                .
              </>
            )}
          </p>
        )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column: title + markdown body */}
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className={`${inputClass} text-lg font-semibold`}
          />
          <RichTextEditor value={body} onChange={setBody} />
        </div>

        {/* Sidebar: metadata, split so the search fields stop burying the rest */}
        <aside>
          <Tabs defaultValue="post">
            <TabsList className="w-full">
              <TabsTrigger value="post" className="flex-1">
                Post
              </TabsTrigger>
              <TabsTrigger value="search" className="flex-1">
                Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="post" className="space-y-4">
              <Field label="Slug">
                <input
                  value={slugTouched ? slug : effectiveSlug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setSlugTouched(true)
                  }}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">/post/{effectiveSlug || "…"}</p>
              </Field>
              <Field label="Excerpt">
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </Field>
              <Field label="Cover image" hint="Max 8 MB">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCover(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                />
              </Field>
              <Field label="Author" hint="From the team page">
                <Select value={author || AUTHOR_DEFAULT} onValueChange={(v) => setAuthor(v === AUTHOR_DEFAULT || !v ? "" : v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        value === AUTHOR_DEFAULT || !value
                          ? currentAuthorName || "You (default)"
                          : value
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AUTHOR_DEFAULT}>{currentAuthorName || "You (default)"}</SelectItem>
                    {authors
                      .filter((name) => name !== currentAuthorName)
                      .map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Industry">
                <Select value={industry || INDUSTRIES[0]?.value} onValueChange={(v) => setIndustry(v ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        INDUSTRIES.find((o) => o.value === value)?.label ?? INDUSTRIES[0].label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {categories.length > 0 && (
                <Field label="Categories">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => {
                      const on = categoryIds.includes(c._id)
                      return (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => toggleCategory(c._id)}
                          className="rounded-pill border px-3 py-1 text-xs transition"
                          style={{
                            borderColor: on ? "var(--purple-primary)" : "var(--color-border)",
                            backgroundColor: on ? "rgba(128,21,232,0.10)" : "var(--surface)",
                            color: on ? "var(--purple-primary)" : "var(--ink-heading)",
                          }}
                        >
                          {c.title}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
            <Field label="SEO keyword" hint="Primary keyword this post targets">
              <input
                value={seoKeyword}
                onChange={(e) => setSeoKeyword(e.target.value)}
                placeholder="e.g. monday.com automations"
                className={inputClass}
              />
            </Field>
            <Field label="SEO title" hint={`${seoTitle.length}/60`}>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Meta description" hint={`${seoDescription.length}/160`}>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Field label="Publish date" hint="Defaults to now">
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className={inputClass}
              />
            </Field>

              <div className="rounded-chip border border-[var(--color-border)] p-3">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.09em] text-muted-foreground">
                  How it will look in search
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  fruitionservices.io › post › {effectiveSlug || "…"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-[#1a0dab]">
                  {seoTitle || title || "Untitled post"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {seoDescription || excerpt || "No meta description yet."}
                </p>
              </div>

              <ul className="space-y-2">
                {seoChecks.map((c) => (
                  <li key={c.label} className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        c.ok ? "bg-[var(--success-strong)]" : "bg-[var(--warning-strong)]"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">{c.label}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium text-ink-heading">
        <span>{label}</span>
        {hint && <span className="text-xs font-normal text-[var(--color-text-secondary)]">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

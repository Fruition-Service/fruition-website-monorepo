"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AtSign, Building2, Loader2, User } from "lucide-react"
import {
  TAG_SUGGESTIONS,
  mentionQueryAt,
  normaliseXHandle,
  type MentionQuery,
} from "@/lib/social/mentions"
import { readRecents, rememberTag, type RecentTag } from "@/lib/social/tagRecents"

/**
 * The menu that opens when you type "@" in a caption.
 *
 * Two halves, and the split is forced by what the platforms actually offer.
 * There is no "search LinkedIn companies" API — Zernio can turn a vanity name
 * into a URN and that's it — so the instant half is a local list (seeded
 * partners plus everything you've tagged before) and the second half is a live
 * lookup of exactly what you typed.
 *
 * The live half is never auto-selected, and that isn't fussiness: LinkedIn's
 * resolver falls back to PEOPLE when no company matches, so "@monday" comes
 * back as a stranger called Yuanhao Zhang. Every remote result therefore states
 * the name it resolved to and whether it's a company or a person, and picking
 * one is always a deliberate keystroke on a highlighted row.
 */

export type TagKey = "linkedin" | "twitter"

export interface MentionOption {
  id: string
  /** Shown in the menu. */
  label: string
  /** The quiet line underneath: where it came from, or what it resolved to. */
  hint: string
  kind: "saved" | "lookup" | "literal"
  /** Ready to splice in. Absent means it has to be resolved when picked. */
  text?: string
  /** LinkedIn vanity name to resolve on pick, for seeded entries. */
  resolve?: string
}

interface Resolved {
  text: string
  displayName: string
  type: "person" | "organization"
}

async function resolveLinkedIn(target: string): Promise<Resolved | { error: string }> {
  try {
    const r = await fetch("/api/internal/social/mention", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target }),
    })
    const data = (await r.json().catch(() => ({}))) as {
      text?: string
      displayName?: string
      type?: string
      error?: string
    }
    if (!r.ok || !data.text) return { error: data.error ?? "Couldn't find that account." }
    return {
      text: data.text,
      displayName: data.displayName ?? target,
      type: data.type === "person" ? "person" : "organization",
    }
  } catch {
    return { error: "Couldn't reach LinkedIn." }
  }
}

/**
 * Everything the caption editor needs to run an "@" menu: what's being typed,
 * what to offer, and what the arrow keys should do.
 */
export function useMentionMenu({
  platformKey,
  content,
  caret,
  enabled,
}: {
  platformKey: TagKey | null
  content: string
  /** Cursor position, or null when the field isn't focused. */
  caret: number | null
  enabled: boolean
}) {
  const [dismissed, setDismissed] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const [lookup, setLookup] = useState<{ query: string; result: Resolved | { error: string } } | null>(null)
  const [resolving, setResolving] = useState(false)
  // Read once, lazily: localStorage doesn't exist while this renders on the
  // server, and the menu is closed until someone types, so the two renders
  // can't disagree about any DOM.
  const [recents, setRecents] = useState<RecentTag[]>(() =>
    typeof window === "undefined" || !platformKey ? [] : readRecents(platformKey),
  )
  const requestId = useRef(0)

  const query: MentionQuery | null =
    enabled && platformKey && caret !== null ? mentionQueryAt(content, caret) : null
  const isOpen = Boolean(query) && dismissed !== query?.query
  const term = (query?.query ?? "").toLowerCase()

  const saved = useMemo(() => {
    if (!platformKey) return []
    const seeded = TAG_SUGGESTIONS.flatMap((s) => {
      const handle = platformKey === "linkedin" ? s.linkedin : s.x
      if (!handle) return []
      return [
        platformKey === "linkedin"
          ? { id: `seed:${s.name}`, label: s.name, hint: "saved", kind: "saved" as const, resolve: handle }
          : { id: `seed:${s.name}`, label: s.name, hint: `@${handle}`, kind: "saved" as const, text: `@${handle}` },
      ]
    })
    const used = recents.map((r) => ({
      id: `recent:${r.text}`,
      label: r.label,
      hint: "used before",
      kind: "saved" as const,
      text: r.text,
    }))
    // Recents win over the seeded copy of the same account — they carry a
    // resolved URN, so they insert without a round trip.
    const seen = new Set(used.map((u) => u.label.toLowerCase()))
    return [...used, ...seeded.filter((s) => !seen.has(s.label.toLowerCase()))].filter(
      (o) => !term || o.label.toLowerCase().includes(term) || o.hint.toLowerCase().includes(term),
    )
  }, [platformKey, recents, term])

  /*
   * Live lookup, debounced. LinkedIn only — on X the handle IS the mention.
   * "Looking" is derived rather than stored: a stored flag would mean setting
   * state inside the effect body on every keystroke, and it can drift out of
   * sync with the result it describes.
   */
  const wantsLookup = isOpen && platformKey === "linkedin" && term.length >= 2
  const haveLookup = Boolean(lookup) && lookup?.query === query?.query
  const looking = resolving || (wantsLookup && !haveLookup)

  useEffect(() => {
    if (!wantsLookup || haveLookup || !query) return
    const q = query.query
    const id = ++requestId.current
    const timer = setTimeout(async () => {
      const result = await resolveLinkedIn(q)
      if (id === requestId.current) setLookup({ query: q, result }) // a newer keystroke wins
    }, 350)
    return () => clearTimeout(timer)
  }, [wantsLookup, haveLookup, query])

  const options = useMemo<MentionOption[]>(() => {
    const out: MentionOption[] = [...saved]
    if (!query) return out

    if (platformKey === "twitter") {
      const handle = normaliseXHandle(query.query)
      if (handle && !out.some((o) => o.text === `@${handle}`)) {
        out.push({
          id: `literal:${handle}`,
          label: `@${handle}`,
          hint: "use exactly this handle",
          kind: "literal",
          text: `@${handle}`,
        })
      }
      return out
    }

    if (lookup && lookup.query === query.query && "text" in lookup.result) {
      const r = lookup.result
      out.push({
        id: `lookup:${r.text}`,
        label: r.displayName,
        hint: r.type === "person" ? "person on LinkedIn — check it's the right one" : "company on LinkedIn",
        kind: "lookup",
        text: r.text,
      })
    }
    return out
  }, [saved, query, platformKey, lookup])

  // Clamped rather than corrected in an effect: a shrinking list must never
  // leave the highlight past the end, and deriving it means there's no frame
  // where it is.
  const activeIndex = Math.min(active, Math.max(0, options.length - 1))

  const lookupError =
    platformKey === "linkedin" && lookup && lookup.query === query?.query && "error" in lookup.result
      ? lookup.result.error
      : null

  const dismiss = useCallback(() => setDismissed(query?.query ?? ""), [query?.query])

  /**
   * Turn a menu row into text. Seeded LinkedIn rows only carry a vanity name,
   * so this is where they finally become a URN.
   */
  const choose = useCallback(
    async (index: number): Promise<{ text: string; label: string } | null> => {
      const option = options[index]
      if (!option || !platformKey) return null

      let text = option.text
      if (!text && option.resolve) {
        setResolving(true)
        const result = await resolveLinkedIn(option.resolve)
        setResolving(false)
        if ("error" in result) {
          setLookup({ query: query?.query ?? "", result })
          return null
        }
        text = result.text
      }
      if (!text) return null

      setRecents(rememberTag(platformKey, { label: option.label, text }))
      return { text, label: option.label }
    },
    [options, platformKey, query?.query],
  )

  return {
    query,
    isOpen: isOpen && (options.length > 0 || looking || Boolean(lookupError)),
    options,
    active: activeIndex,
    setActive,
    looking,
    lookupError,
    dismiss,
    choose,
  }
}

export default function MentionMenu({
  listId,
  options,
  active,
  looking,
  error,
  platformKey,
  onHover,
  onPick,
}: {
  /** Ties the list back to the textarea for aria-controls/activedescendant. */
  listId: string
  options: MentionOption[]
  active: number
  looking: boolean
  error: string | null
  platformKey: TagKey
  onHover: (index: number) => void
  onPick: (index: number) => void
}) {
  return (
    <div className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
      <ul id={listId} className="max-h-56 overflow-y-auto py-1" role="listbox">
        {options.map((option, i) => (
          <li key={option.id}>
            <button
              id={`${listId}-${i}`}
              type="button"
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => onHover(i)}
              // The textarea must keep focus, or the caret we're about to
              // replace stops existing.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(i)}
              className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition ${
                i === active ? "bg-muted" : ""
              }`}
            >
              <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
                {option.kind === "lookup" && option.hint.startsWith("person") ? (
                  <User className="size-3.5" />
                ) : option.kind === "literal" ? (
                  <AtSign className="size-3.5" />
                ) : (
                  <Building2 className="size-3.5" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">{option.label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{option.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {looking && (
        <p className="flex items-center gap-1.5 border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          Looking up “{platformKey === "linkedin" ? "LinkedIn" : "X"}”…
        </p>
      )}
      {error && !looking && (
        <p className="border-t border-border px-3 py-1.5 text-[11px] text-destructive">{error}</p>
      )}
      {!looking && !error && options.length > 0 && (
        <p className="border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
          ↑↓ to choose · ↵ to tag · esc to dismiss
        </p>
      )}
    </div>
  )
}

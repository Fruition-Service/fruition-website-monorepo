/**
 * Tagging other accounts from the composer.
 *
 * The two channels that can be tagged work in completely different ways, and
 * the difference decides the whole design:
 *
 *   X    — "@handle" in the body IS the mention. Nothing to resolve; the only
 *          risk is a typo tagging a stranger, so the picker offers saved
 *          handles and remembers the ones you type.
 *   LinkedIn — plain "@Name" is inert text. A real mention is markup carrying
 *          the account's URN, "@[monday.com](urn:li:organization:2525169)",
 *          which Zernio resolves for us and expands at publish time. The
 *          writer must never see or type that; the editor shows "@monday.com"
 *          and only the wire format carries the URN.
 *
 * Everything here is pure string work so `validate.ts` can measure a caption
 * the way the reader will see it, in the browser and on the server alike.
 */

/** "@[Display Name](urn:li:organization:123)" — Zernio's LinkedIn wire format. */
const LINKEDIN_MENTION = /@\[([^\]]+)\]\((urn:li:(?:person|organization):[^)]+)\)/g

export interface ParsedMention {
  displayName: string
  urn: string
  /** Character offsets of the whole "@[…](…)" run within the source string. */
  start: number
  end: number
}

export function parseMentions(text: string): ParsedMention[] {
  const out: ParsedMention[] = []
  for (const m of text.matchAll(LINKEDIN_MENTION)) {
    out.push({ displayName: m[1], urn: m[2], start: m.index, end: m.index + m[0].length })
  }
  return out
}

export function hasMentionMarkup(text: string): boolean {
  return parseMentions(text).length > 0
}

/** The caption as a reader sees it: mention markup collapsed to "@Name". */
export function renderMentions(text: string): string {
  return text.replace(LINKEDIN_MENTION, (_, name: string) => `@${name}`)
}

/**
 * How long the caption reads, not how long it is on the wire. Only these two
 * differ, and only when a LinkedIn tag is present — every other channel's
 * rendered length is its raw length.
 */
export function renderedLength(text: string): number {
  return renderMentions(text).length
}

/** Build the wire format from a resolved account. */
export function mentionMarkup(displayName: string, urn: string): string {
  return `@[${displayName}](${urn})`
}

/* ------------------------------------------------------------------ */
/*  Handles                                                            */
/* ------------------------------------------------------------------ */

/** Accept "@name", "name", or a full x.com/twitter.com URL; return "name". */
export function normaliseXHandle(input: string): string {
  const trimmed = input.trim()
  const fromUrl = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/@?([A-Za-z0-9_]{1,15})/i)
  const raw = fromUrl ? fromUrl[1] : trimmed.replace(/^@/, "")
  return raw.replace(/[^A-Za-z0-9_]/g, "").slice(0, 15)
}

/**
 * Accept a LinkedIn company/profile URL or a bare vanity name. Zernio's
 * resolver takes either, so this only strips the noise people paste along with
 * a URL (tracking params, a trailing slash).
 */
export function normaliseLinkedInTarget(input: string): string {
  return input.trim().split(/[?#]/)[0].replace(/\/+$/, "")
}

/* ------------------------------------------------------------------ */
/*  Starting directory                                                 */
/* ------------------------------------------------------------------ */

export interface TagSuggestion {
  name: string
  /** LinkedIn company/profile URL or vanity name, resolved on pick. */
  linkedin?: string
  /** X handle without the @. */
  x?: string
}

/**
 * The accounts we tag often enough to be worth one click. Deliberately short:
 * anything else is a paste-and-resolve away, and whatever you type is
 * remembered locally, so this list doesn't need to grow to stay useful.
 *
 * LinkedIn entries are vanity names — Zernio resolves them to a URN and hands
 * back the real display name, so a wrong slug fails loudly instead of tagging
 * a stranger.
 */
export const TAG_SUGGESTIONS: TagSuggestion[] = [
  { name: "monday.com", linkedin: "mondaydotcom", x: "mondaydotcom" },
  { name: "Fruition", linkedin: "fruition-services", x: "Fruitionservic" },
  { name: "Atlassian", linkedin: "atlassian", x: "Atlassian" },
  { name: "HubSpot", linkedin: "hubspot", x: "HubSpot" },
]

/* ------------------------------------------------------------------ */
/*  The "@" you type in the caption                                    */
/* ------------------------------------------------------------------ */

export interface MentionQuery {
  /** What's been typed after the "@", up to the cursor. "" right after "@". */
  query: string
  /** Index of the "@" itself. */
  start: number
  /** The cursor, i.e. the end of the token being replaced. */
  end: number
}

/** Longer than this and it isn't a name any more, it's a sentence. */
const MAX_QUERY = 80

/**
 * The mention being typed at the cursor, if there is one.
 *
 * An "@" only opens the menu at the start of a word — otherwise every email
 * address in a caption would trigger it. Text already converted to LinkedIn
 * markup is skipped too: "@[monday.com](urn:…)" is a finished tag, not someone
 * halfway through typing one.
 */
export function mentionQueryAt(text: string, caret: number): MentionQuery | null {
  const end = Math.max(0, Math.min(caret, text.length))
  for (let i = end - 1; i >= 0 && end - i <= MAX_QUERY + 1; i--) {
    const ch = text[i]
    if (/\s/.test(ch)) return null // hit whitespace before an "@"
    if (ch !== "@") continue

    const before = i > 0 ? text[i - 1] : ""
    if (before && !/[\s(<]/.test(before)) return null // mid-word: an email, not a mention
    if (text[i + 1] === "[") return null // already a finished tag

    return { query: text.slice(i + 1, end), start: i, end }
  }
  return null
}

/**
 * Swap the half-typed "@name" for the finished tag, leaving a trailing space so
 * the next word doesn't run into it (and so the menu closes).
 */
export function replaceMentionQuery(text: string, q: MentionQuery, replacement: string): {
  text: string
  caret: number
} {
  const after = text.slice(q.end)
  const spacer = after.startsWith(" ") || after.startsWith("\n") ? "" : " "
  return {
    text: text.slice(0, q.start) + replacement + spacer + after,
    caret: q.start + replacement.length + spacer.length,
  }
}

/** Channels where tagging does anything at all. */
export function supportsTagging(key: string): key is "linkedin" | "twitter" {
  return key === "linkedin" || key === "twitter"
}

/* ------------------------------------------------------------------ */
/*  What the writer sees vs. what goes on the wire                     */
/* ------------------------------------------------------------------ */

/**
 * A tag located in both texts at once: where its markup sits on the wire, and
 * where the "@Name" it renders to sits in the caption a person is reading.
 *
 * Everything below exists so the editor can hold the rendered caption while
 * the draft keeps the wire format. The writer types against "@monday.com"; the
 * URN that makes the tag real never appears in the box and never gets typed
 * over, because every edit is translated back through these offsets.
 */
export interface MentionSpan extends ParsedMention {
  displayStart: number
  displayEnd: number
}

export function mentionSpans(text: string): MentionSpan[] {
  let drift = 0 // characters the markup adds ahead of this point
  return parseMentions(text).map((m) => {
    const displayStart = m.start - drift
    const displayEnd = displayStart + m.displayName.length + 1 // "@" + name
    drift += m.end - m.start - (displayEnd - displayStart)
    return { ...m, displayStart, displayEnd }
  })
}

/**
 * Where a position in the rendered caption sits in the wire text.
 *
 * A position inside a tag has no honest answer — it points between characters
 * that don't exist on the wire — so it snaps to one end. `start`/`end` widen
 * an edit to swallow the whole tag, which is what makes a tag behave like one
 * object: backspace anywhere in "@monday.com" removes the tag, not a letter of
 * a name that would otherwise stop matching the URN it's attached to.
 */
export function toRawIndex(text: string, displayIndex: number, snap: "start" | "end" | "nearest" = "nearest"): number {
  const at = Math.max(0, Math.min(displayIndex, renderedLength(text)))
  let drift = 0
  for (const span of mentionSpans(text)) {
    if (at <= span.displayStart) break
    if (at < span.displayEnd) {
      if (snap === "start") return span.start
      if (snap === "end") return span.end
      return at - span.displayStart <= span.displayEnd - at ? span.start : span.end
    }
    drift += span.end - span.start - (span.displayEnd - span.displayStart)
  }
  return at + drift
}

/** The reverse: a wire position as the reader's caption counts it. */
export function toDisplayIndex(text: string, rawIndex: number): number {
  const at = Math.max(0, Math.min(rawIndex, text.length))
  let drift = 0
  for (const span of mentionSpans(text)) {
    if (at <= span.start) break
    if (at < span.end) return span.displayEnd // inside markup: the tag is one object
    drift += span.end - span.start - (span.displayEnd - span.displayStart)
  }
  return at - drift
}

/**
 * Close the gap a tag left behind — and only that gap. Collapsing every double
 * space in the caption would quietly reformat deliberate spacing elsewhere.
 */
function joinSeam(before: string, after: string): string {
  return /\s$/.test(before) && /^[ \t]/.test(after) ? before + after.replace(/^[ \t]+/, "") : before + after
}

/** Cut one tag's markup out of the caption, leaving the rest untouched. */
export function removeMention(text: string, start: number, end: number): { text: string; caret: number } {
  const before = text.slice(0, start)
  return { text: joinSeam(before, text.slice(end)), caret: before.length }
}

/**
 * Replay an edit made against the rendered caption onto the wire text.
 *
 * A textarea only ever reports its whole new value, so the edit is recovered
 * the way every diff does it — matching prefix, matching suffix, whatever's
 * left in between is what changed. The cursor, when we have it, pins where
 * that run ends, which is the only way to tell "hello" typed before "o" from
 * the same letter typed after it.
 *
 * Both ends of the changed run are then widened over any tag they land inside,
 * so a half-eaten tag can never survive as markup pointing at the wrong name.
 */
export function applyDisplayEdit(
  text: string,
  nextDisplay: string,
  nextCaret?: number,
): { text: string; caret: number } {
  const prev = renderMentions(text)
  const caret = nextCaret === undefined ? null : Math.max(0, Math.min(nextCaret, nextDisplay.length))
  if (prev === nextDisplay) return { text, caret: toRawIndex(text, caret ?? nextDisplay.length) }

  let suffix = 0
  const maxSuffix = Math.min(prev.length, nextDisplay.length, caret === null ? nextDisplay.length : nextDisplay.length - caret)
  while (suffix < maxSuffix && prev[prev.length - 1 - suffix] === nextDisplay[nextDisplay.length - 1 - suffix]) suffix++

  let prefix = 0
  const maxPrefix = Math.min(prev.length - suffix, nextDisplay.length - suffix, caret ?? nextDisplay.length)
  while (prefix < maxPrefix && prev[prefix] === nextDisplay[prefix]) prefix++

  const inserted = nextDisplay.slice(prefix, nextDisplay.length - suffix)
  const from = toRawIndex(text, prefix, "start")
  const to = toRawIndex(text, prev.length - suffix, "end")
  const before = text.slice(0, from)
  const after = text.slice(to)

  // A tag deleted whole leaves the same gap as the chip's remove button, so
  // tidy it the same way. A plain character deleted between two words doesn't.
  const ateTag = !inserted && mentionSpans(text).some((s) => s.start >= from && s.end <= to)
  return ateTag
    ? { text: joinSeam(before, after), caret: before.length }
    : { text: before + inserted + after, caret: from + inserted.length }
}

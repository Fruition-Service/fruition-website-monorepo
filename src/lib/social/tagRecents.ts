"use client"

/**
 * Accounts you've tagged before, kept in this browser.
 *
 * There is no directory to search: Zernio resolves a LinkedIn company from its
 * vanity name, but nothing answers "companies matching 'mon'". So the menu's
 * instant half is a local list — a few seeded partners plus whatever you've
 * used — and it earns its keep by growing as you work.
 *
 * localStorage rather than a table, deliberately: this is a convenience, and a
 * blocked or cleared store must degrade to "type the name" rather than error.
 */

export interface RecentTag {
  /** What the menu shows. */
  label: string
  /** Exactly what gets spliced into the caption. */
  text: string
}

const CAP = 20

function key(platform: string): string {
  return `fruition:social-tags:${platform}`
}

export function readRecents(platform: string): RecentTag[] {
  try {
    const raw = window.localStorage.getItem(key(platform))
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t): t is RecentTag =>
        Boolean(t) && typeof (t as RecentTag).label === "string" && typeof (t as RecentTag).text === "string",
    )
  } catch {
    return []
  }
}

/** Most recent first, deduped on the inserted text. Returns the new list. */
export function rememberTag(platform: string, tag: RecentTag): RecentTag[] {
  const next = [tag, ...readRecents(platform).filter((t) => t.text !== tag.text)].slice(0, CAP)
  try {
    window.localStorage.setItem(key(platform), JSON.stringify(next))
  } catch {
    // Private browsing, quota, whatever — the tag still goes into the caption.
  }
  return next
}

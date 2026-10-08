"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { CLIENTS, clientSlug, type Region } from "../data/clients"

const REGIONS: { key: Region; label: string; flag: string; emoji: string }[] = [
  { key: "us", label: "United States", flag: "US", emoji: "🇺🇸" },
  { key: "apac", label: "Australia & APAC", flag: "AU", emoji: "🇦🇺" },
  { key: "uk", label: "United Kingdom", flag: "UK", emoji: "🇬🇧" },
]

const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener("popstate", onChange)
  window.addEventListener("hashchange", onChange)
  return () => {
    window.removeEventListener("popstate", onChange)
    window.removeEventListener("hashchange", onChange)
  }
}
const readLocation = () => window.location.search + window.location.hash
/** Server render has no location, so nothing is requested there. */
const noLocation = () => ""

/**
 * Reads the client the visitor arrived for. The homepage logo wall links here as
 * `?client=<slug>`; `#client-<slug>` is accepted too so the anchors are shareable.
 *
 * Deliberately reads `window.location` rather than `useSearchParams()` — this is a
 * client-side-only enhancement, and useSearchParams would force the whole catalog
 * behind a Suspense boundary to keep prerendering. useSyncExternalStore keeps that
 * read hydration-safe without a setState-in-effect cascade.
 */
function useRequestedClient(): string | null {
  const raw = useSyncExternalStore(subscribeToLocation, readLocation, noLocation)

  return useMemo(() => {
    const [search, hash = ""] = raw.split("#")
    const fromQuery = new URLSearchParams(search).get("client")
    const fromHash = hash.startsWith("client-") ? hash.slice("client-".length) : null
    const requested = (fromQuery || fromHash || "").trim().toLowerCase()
    return requested && CLIENTS.some((c) => clientSlug(c.name) === requested) ? requested : null
  }, [raw])
}

export default function ProjectBuildsIndex() {
  const requested = useRequestedClient()
  // Arriving with ?client= expands the folder; the toggle still works on top of that.
  const [toggled, setToggled] = useState<boolean | null>(null)
  const open = toggled ?? Boolean(requested)

  const grouped = useMemo(() => {
    return REGIONS.map((r) => ({
      ...r,
      items: CLIENTS.filter((c) => c.region === r.key),
    }))
  }, [])

  const total = CLIENTS.length

  useEffect(() => {
    if (!requested || !open) return
    const el = document.getElementById(`client-${requested}`)
    if (!el) return

    // One smooth scroll on a single frame was not enough: the card sits ~6000px
    // down, and the advisor, grid and fonts above it are still settling, so the
    // scroll was interrupted or landed short and the visitor was left at the top
    // with no sign of the client they clicked. Re-align a few times while the
    // layout settles, and stop the moment the visitor scrolls for themselves.
    // Timers rather than requestAnimationFrame so a tab opened in the background
    // is already in place when it is brought forward.
    let userMoved = false
    const stop = () => {
      userMoved = true
    }
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }))

    const align = () => {
      if (userMoved) return
      const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" })
    }
    const timers = [0, 150, 400, 800, 1500, 2500].map((ms) => window.setTimeout(align, ms))

    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      events.forEach((e) => window.removeEventListener(e, stop))
    }
  }, [requested, open])

  return (
    <section id="builds" className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 md:px-7 py-16 lg:py-20">
        <div className="max-w-[820px] mb-10">
          <div className="text-micro font-semibold tracking-[0.16em] uppercase text-[var(--purple-primary)]">
            Project Builds Index
          </div>
          <h2 className="text-section-h2 mt-2 mb-3">
            299 client engagements across the US, Australia, APAC, and the UK.
          </h2>
          <p className="text-body-lead text-[var(--color-text-secondary)]">
            Every build below has been delivered and is in active support across our three
            regional books of business.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-surface-raised shadow-whisper dark:shadow-none overflow-hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="builds-folder-body"
            onClick={() => setToggled(!open)}
            className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-surface-subtle transition-colors"
          >
            <span
              className={`inline-flex items-center justify-center w-6 h-6 transition-transform duration-200 text-[var(--purple-primary)] ${
                open ? "rotate-0" : "-rotate-90"
              }`}
              aria-hidden
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <span className="text-card-title text-[var(--text-dark)]">Fruition Clients</span>
            <span className="text-body-sm text-[var(--color-text-secondary)] hidden md:inline">
              <strong>{total}</strong>{" "}delivered implementations across US, APAC &amp; UK
            </span>
            <span className="ml-auto text-caption text-[var(--purple-primary)]">
              {open ? "Hide" : "Click to expand"}
            </span>
          </button>

          {open && (
            <div id="builds-folder-body" className="px-6 pb-8 pt-2">
              {grouped.map((g) => (
                <div key={g.key} className="mt-6">
                  <h3 className="flex items-center gap-3 text-card-title text-[var(--text-dark)] mb-4">
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[rgba(128,21,232,0.08)] text-lg leading-none"
                      aria-label={g.label}
                    >
                      {g.emoji}
                    </span>
                    {g.label}
                    <span className="text-caption text-[var(--color-text-secondary)] font-normal">
                      {g.items.length} delivered
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {g.items.map((c, idx) => {
                      const slug = clientSlug(c.name)
                      const isTarget = slug === requested
                      return (
                        <div
                          key={`${g.key}-${c.name}-${idx}`}
                          id={`client-${slug}`}
                          className={`scroll-mt-28 rounded-xl border bg-surface-raised p-3 transition-all ${
                            isTarget
                              ? "border-[var(--purple-primary)] ring-2 ring-[var(--purple-primary)] ring-offset-2 ring-offset-[var(--color-surface)]"
                              : "border-[var(--color-border)] hover:border-[var(--purple-light)] hover:shadow-whisper dark:hover:shadow-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#16a34a] font-semibold mb-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                            Delivered
                          </div>
                          <h4 className="text-sm font-semibold text-[var(--text-dark)] leading-tight">
                            {c.name}
                          </h4>
                          <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                            {c.meta}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              <p className="mt-8 text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-[760px]">
                Note: the US, APAC, and UK client rosters shown here are curated from Fireflies
                meeting transcripts, Gmail threads, Google Drive artifacts, and monday.com CRM,
                Client Projects, and Work Order workspace activity between 2024 and 2026.
                Additional smaller engagements, support retainers, Hootsuite HSE line items, and
                partner-referred opportunities across all three regions are tracked separately in
                our internal CRM and total an additional 150+ accounts.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

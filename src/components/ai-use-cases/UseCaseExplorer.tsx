"use client"

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { IndustryMeta, UseCase, UseCaseTile } from "@/features/ai-use-cases/types"
import { USE_CASES_DATA_PATH, toTile } from "@/features/ai-use-cases/types"
import UseCaseCard, { SEE_BUILD, UseCasePills } from "./UseCaseCard"
import UseCaseBuild from "./UseCaseBuild"
import BuildDialog from "./BuildDialog"

/**
 * The filterable use case catalogue, shared by the hub and the industry pages.
 *
 * Filters and the open build live in the URL (`?industry=…&ai=1`, `#uc-…`), so
 * a filtered view or a single build can be linked to, and so the landing-page
 * cards can deep-link straight into a build. The URL is read through an
 * external store, which keeps the page itself statically rendered.
 *
 * Every tile is rendered and the ones outside the current filter or page are
 * `hidden`, so the whole catalogue is in the HTML. On the industry pages
 * (`details` passed) every build is server-rendered into its own closed
 * dialog for the same reason; the hub fetches a build's detail on first open.
 */

interface Filters {
  industry: string
  dept: string
  type: string
  q: string
  ai: boolean
  own: boolean
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("popstate", listener)
  window.addEventListener("hashchange", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("popstate", listener)
    window.removeEventListener("hashchange", listener)
  }
}

const readSearch = () => window.location.search
const readHash = () => window.location.hash
const serverSnapshot = () => ""

/** replaceState, so filtering and opening builds do not fill the Back stack. */
function writeUrl(mutate: (url: URL) => void) {
  const url = new URL(window.location.href)
  mutate(url)
  window.history.replaceState(window.history.state, "", url)
  listeners.forEach((l) => l())
}

function parseFilters(search: string): Filters {
  const p = new URLSearchParams(search)
  return {
    industry: p.get("industry") ?? "",
    dept: p.get("dept") ?? "",
    type: p.get("type") ?? "",
    q: p.get("q") ?? "",
    ai: p.get("ai") === "1",
    own: p.get("own") === "1",
  }
}

function setParam(key: keyof Filters, value: string | boolean) {
  writeUrl((url) => {
    const v = typeof value === "boolean" ? (value ? "1" : "") : value
    if (v) url.searchParams.set(key, v)
    else url.searchParams.delete(key)
  })
}

function clearParams() {
  writeUrl((url) => {
    for (const key of ["industry", "dept", "type", "q", "ai", "own"]) url.searchParams.delete(key)
  })
}

const openBuild = (id: string) => writeUrl((url) => (url.hash = id))
const closeBuild = () => writeUrl((url) => (url.hash = ""))

const LABEL = "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
const TOGGLE = "inline-flex min-h-11 cursor-pointer items-center gap-2 text-[15px] text-body"
const CHECKBOX = "size-4 accent-brand"

interface UseCaseExplorerProps {
  /** Tiles only; each build's detail is fetched on first open (the hub). */
  tiles?: UseCaseTile[]
  /** Full records, server-rendered into dialogs (the industry pages). */
  details?: UseCase[]
  industries: IndustryMeta[]
  departments: Record<string, string>
  solutionTypes: Record<string, string>
  /** Show the industry select (the hub only). */
  industryFilter?: boolean
  bookingHref: string
  pageSize?: number
}

export default function UseCaseExplorer({
  tiles: tilesProp,
  details,
  industries,
  departments,
  solutionTypes,
  industryFilter = false,
  bookingHref,
  pageSize = 24,
}: UseCaseExplorerProps) {
  const tiles = useMemo(() => tilesProp ?? (details ?? []).map(toTile), [tilesProp, details])
  const search = useSyncExternalStore(subscribe, readSearch, serverSnapshot)
  const hash = useSyncExternalStore(subscribe, readHash, serverSnapshot)
  const filters = useMemo(() => parseFilters(search), [search])
  const openId = hash.startsWith("#uc-") ? decodeURIComponent(hash.slice(1)) : null

  const detailById = useMemo(() => new Map((details ?? []).map((d) => [d.id, d])), [details])
  const industryByKey = useMemo(() => new Map(industries.map((i) => [i.key, i])), [industries])

  /** Lower-cased text each tile is searched against. */
  const haystacks = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of tiles) {
      const d = detailById.get(t.id)
      map.set(
        t.id,
        [t.title, t.summary, t.kicker, ...t.integrations, ...t.teams, ...(d ? [...d.boards, ...d.automations] : [])]
          .join(" ")
          .toLowerCase(),
      )
    }
    return map
  }, [tiles, detailById])

  const visible = useMemo(() => {
    const terms = filters.q.toLowerCase().split(/\s+/).filter(Boolean)
    return tiles.filter(
      (t) =>
        (!industryFilter || !filters.industry || t.industry === filters.industry) &&
        (!filters.dept || t.departments.includes(filters.dept)) &&
        (!filters.type || t.solutionTypes.includes(filters.type)) &&
        (!filters.ai || t.ai) &&
        (!filters.own || t.own) &&
        terms.every((term) => haystacks.get(t.id)?.includes(term)),
    )
  }, [tiles, filters, industryFilter, haystacks])

  // "Show more" pages through the current result set; a new filter starts over.
  const filterKey = search
  const [more, setMore] = useState({ key: "", count: pageSize })
  const limit = more.key === filterKey ? more.count : pageSize
  const shown = useMemo(() => new Set(visible.slice(0, limit).map((t) => t.id)), [visible, limit])

  const present = useCallback(
    (pick: (t: UseCaseTile) => string[]) => new Set(tiles.flatMap(pick)),
    [tiles],
  )
  const deptOptions = useMemo(() => {
    const has = present((t) => t.departments)
    return Object.entries(departments).filter(([k]) => has.has(k))
  }, [departments, present])
  const typeOptions = useMemo(() => {
    const has = present((t) => t.solutionTypes)
    return Object.entries(solutionTypes).filter(([k]) => has.has(k))
  }, [solutionTypes, present])
  const hasOwn = tiles.some((t) => t.own)
  const hasAi = tiles.some((t) => t.ai)
  const active =
    (industryFilter && !!filters.industry) ||
    !!filters.dept ||
    !!filters.type ||
    !!filters.q ||
    filters.ai ||
    filters.own

  // Hub: fetch an industry's records the first time one of its builds opens.
  const [fetched, setFetched] = useState<Record<string, UseCase>>({})
  const [fetchFailed, setFetchFailed] = useState<string | null>(null)
  const openTile = openId ? tiles.find((t) => t.id === openId) : undefined
  const openDetail = openId ? (detailById.get(openId) ?? fetched[openId]) : undefined
  const needsFetch = !details && !!openTile && !openDetail
  const fetchSlug = needsFetch ? industryByKey.get(openTile.industry)?.slug : undefined

  useEffect(() => {
    if (!fetchSlug) return
    let cancelled = false
    fetch(`${USE_CASES_DATA_PATH}/${fetchSlug}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { useCases: UseCase[] }) => {
        if (cancelled) return
        setFetched((prev) => ({ ...prev, ...Object.fromEntries(data.useCases.map((u) => [u.id, u])) }))
      })
      .catch(() => {
        if (!cancelled) setFetchFailed(fetchSlug)
      })
    return () => {
      cancelled = true
    }
  }, [fetchSlug])

  const countText =
    visible.length === tiles.length
      ? `Showing all ${tiles.length} use cases`
      : `Showing ${Math.min(limit, visible.length)} of ${visible.length} matching use cases`

  const dialogHeader = (tile: UseCaseTile, titleId: string) => (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          {tile.kicker}
        </span>
        <UseCasePills ai={tile.ai} own={tile.own} />
      </div>
      {tile.metric && <p className="mt-2 font-mono text-sm font-semibold text-body">{tile.metric}</p>}
      <h2 id={titleId} className="mt-1.5 text-section-h3 text-body text-balance">
        {tile.title}
      </h2>
    </>
  )

  return (
    <div>
      <form role="search" aria-label="Filter use cases" onSubmit={(e) => e.preventDefault()}>
        <div className="rounded-card bg-surface-raised p-4 shadow-whisper ring-1 ring-ui md:p-5">
          <div
            className={`grid gap-3 md:grid-cols-2 ${
              industryFilter
                ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]"
                : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)]"
            }`}
          >
            {industryFilter && (
              <div>
                <label htmlFor="uc-f-industry" className={LABEL}>
                  Industry
                </label>
                <select
                  id="uc-f-industry"
                  className="form-field min-h-11"
                  value={filters.industry}
                  onChange={(e) => setParam("industry", e.target.value)}
                >
                  <option value="">All industries</option>
                  {industries.map((i) => (
                    <option key={i.key} value={i.key}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="uc-f-dept" className={LABEL}>
                Department
              </label>
              <select
                id="uc-f-dept"
                className="form-field min-h-11"
                value={filters.dept}
                onChange={(e) => setParam("dept", e.target.value)}
              >
                <option value="">All departments</option>
                {deptOptions.map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="uc-f-type" className={LABEL}>
                Solution type
              </label>
              <select
                id="uc-f-type"
                className="form-field min-h-11"
                value={filters.type}
                onChange={(e) => setParam("type", e.target.value)}
              >
                <option value="">All solution types</option>
                {typeOptions.map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label htmlFor="uc-f-q" className={LABEL}>
                Search
              </label>
              <input
                id="uc-f-q"
                type="search"
                className="form-field min-h-11"
                placeholder="Try Xero, quoting, RFIs, invoices"
                autoComplete="off"
                value={filters.q}
                onChange={(e) => setParam("q", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-ui pt-3">
            {hasAi && (
              <label className={TOGGLE}>
                <input
                  type="checkbox"
                  className={CHECKBOX}
                  checked={filters.ai}
                  onChange={(e) => setParam("ai", e.target.checked)}
                />
                Show AI use cases only
              </label>
            )}
            {hasOwn && (
              <label className={TOGGLE}>
                <input
                  type="checkbox"
                  className={CHECKBOX}
                  checked={filters.own}
                  onChange={(e) => setParam("own", e.target.checked)}
                />
                Fruition&apos;s own builds
              </label>
            )}
            {active && (
              <button
                type="button"
                onClick={clearParams}
                className="min-h-11 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
            <p className="text-caption text-muted md:ml-auto" aria-live="polite">
              {countText}
            </p>
          </div>
        </div>
      </form>

      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.id} id={tile.id} hidden={!shown.has(tile.id)} className="scroll-mt-28">
            <UseCaseCard
              tile={tile}
              hideKicker={!industryFilter}
              action={
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => openBuild(tile.id)}
                  className={SEE_BUILD}
                >
                  See the build
                  <ArrowRight size={16} aria-hidden />
                </button>
              }
            />
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="mt-8 rounded-card bg-surface-raised p-6 text-center text-body ring-1 ring-ui">
          No use cases match those filters.{" "}
          <button type="button" onClick={clearParams} className="font-semibold text-brand hover:underline">
            Clear filters
          </button>{" "}
          or{" "}
          <Link href={bookingHref} className="font-semibold text-brand hover:underline">
            ask us about yours
          </Link>
          .
        </p>
      )}

      {visible.length > limit && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setMore({ key: filterKey, count: limit + pageSize })}
            className="cta-btn cta-btn-outline"
          >
            <span className="cta-btn-label">Show more</span>
          </button>
        </div>
      )}

      {details
        ? details.map((d) => (
            <BuildDialog
              key={d.id}
              open={openId === d.id}
              onClose={closeBuild}
              labelledBy={`${d.id}-title`}
              header={dialogHeader(d, `${d.id}-title`)}
            >
              <UseCaseBuild useCase={d} />
            </BuildDialog>
          ))
        : openTile && (
            <BuildDialog
              open
              onClose={closeBuild}
              labelledBy="uc-build-title"
              header={dialogHeader(openTile, "uc-build-title")}
            >
              {openDetail ? (
                <UseCaseBuild useCase={openDetail} />
              ) : fetchFailed && fetchFailed === fetchSlug ? (
                <p className="text-body text-muted">
                  This build could not be loaded.{" "}
                  <Link
                    href={`/ai-use-cases/${industryByKey.get(openTile.industry)?.slug ?? ""}#${openTile.id}`}
                    className="font-semibold text-brand hover:underline"
                  >
                    Open it on the industry page
                  </Link>
                  .
                </p>
              ) : (
                <p className="text-body text-muted" aria-live="polite">
                  Loading the build…
                </p>
              )}
            </BuildDialog>
          )}
    </div>
  )
}

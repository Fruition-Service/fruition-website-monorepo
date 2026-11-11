"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { vercelStegaClean } from "@vercel/stega"
import BuildDialog from "@/components/ai-use-cases/BuildDialog"
import UseCaseBuild from "@/components/ai-use-cases/UseCaseBuild"
import { USE_CASES_DATA_PATH } from "@/features/ai-use-cases/types"
import type { IndustryMeta, UseCase, UseCaseTile } from "@/features/ai-use-cases/types"
import { Arrow, Head } from "../primitives"
import type { VcCatalogueData } from "../types"

/**
 * The use case catalogue on the hub, in the Version C skin. Same behaviour as
 * the catalogue explorer it replaces: filters live in the URL (`?dept=&q=&ai=1`),
 * "See the build" opens the build in a dialog (`#uc-...`, detail fetched from the
 * static data files on first open), 24 tiles at a time. The tiles are the
 * catalogue data, so they are not click-to-edit; the surrounding copy is.
 */

const listeners = new Set<() => void>()
function subscribe(l: () => void) {
  listeners.add(l)
  window.addEventListener("popstate", l)
  window.addEventListener("hashchange", l)
  return () => {
    listeners.delete(l)
    window.removeEventListener("popstate", l)
    window.removeEventListener("hashchange", l)
  }
}
const readSearch = () => window.location.search
const readHash = () => window.location.hash
const serverSnapshot = () => ""
function writeUrl(mutate: (url: URL) => void) {
  const url = new URL(window.location.href)
  mutate(url)
  window.history.replaceState(window.history.state, "", url)
  listeners.forEach((l) => l())
}
const setParam = (key: string, value: string) =>
  writeUrl((url) => (value ? url.searchParams.set(key, value) : url.searchParams.delete(key)))
const closeBuild = () => writeUrl((url) => (url.hash = ""))

const PAGE = 24

function fill(t: string | undefined, vars: Record<string, number>) {
  return (t ?? "").replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? ""))
}

export default function VcCatalogueView({
  s,
  tiles,
  industries,
  departments,
}: {
  s: VcCatalogueData
  tiles: UseCaseTile[]
  industries: IndustryMeta[]
  departments: Record<string, string>
}) {
  const search = useSyncExternalStore(subscribe, readSearch, serverSnapshot)
  const hash = useSyncExternalStore(subscribe, readHash, serverSnapshot)
  const p = useMemo(() => new URLSearchParams(search), [search])
  const f = { industry: p.get("industry") ?? "", dept: p.get("dept") ?? "", type: p.get("type") ?? "", q: p.get("q") ?? "", ai: p.get("ai") === "1", own: p.get("own") === "1" }
  const openId = hash.startsWith("#uc-") ? decodeURIComponent(hash.slice(1)) : null

  const haystacks = useMemo(
    () => new Map(tiles.map((t) => [t.id, [t.title, t.summary, t.kicker, ...t.integrations, ...t.teams].join(" ").toLowerCase()])),
    [tiles],
  )
  const visible = useMemo(() => {
    const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean)
    return tiles.filter(
      (t) =>
        (!f.industry || t.industry === f.industry) &&
        (!f.dept || t.departments.includes(f.dept)) &&
        (!f.type || t.solutionTypes.includes(f.type)) &&
        (!f.ai || t.ai) &&
        (!f.own || t.own) &&
        terms.every((term) => haystacks.get(t.id)?.includes(term)),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles, search, haystacks])

  const [more, setMore] = useState({ key: "", count: PAGE })
  const limit = more.key === search ? more.count : PAGE
  const shown = useMemo(() => new Set(visible.slice(0, limit).map((t) => t.id)), [visible, limit])
  const deptKeys = useMemo(() => {
    const has = new Set(tiles.flatMap((t) => t.departments))
    return Object.entries(departments).filter(([k]) => has.has(k))
  }, [tiles, departments])

  // Open build: fetch the industry's records the first time one of its builds opens.
  const [fetched, setFetched] = useState<Record<string, UseCase>>({})
  const [failed, setFailed] = useState<string | null>(null)
  const openTile = openId ? tiles.find((t) => t.id === openId) : undefined
  const openDetail = openId ? fetched[openId] : undefined
  const slug = openTile && !openDetail ? industries.find((i) => i.key === openTile.industry)?.slug : undefined
  useEffect(() => {
    if (!slug) return
    let cancelled = false
    fetch(`${USE_CASES_DATA_PATH}/${slug}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { useCases: UseCase[] }) => !cancelled && setFetched((prev) => ({ ...prev, ...Object.fromEntries(d.useCases.map((u) => [u.id, u])) })))
      .catch(() => !cancelled && setFailed(slug))
    return () => {
      cancelled = true
    }
  }, [slug])

  const filtered = visible.length !== tiles.length
  const count = filtered
    ? fill(s.countFiltered, { shown: Math.min(limit, visible.length), total: visible.length })
    : fill(s.countAll, { total: tiles.length })
  const ownLabel = s.ownLabel
  const aiLabel = s.aiLabel

  return (
    <>
      <Head head={s.head} />
      <div className="filters">
        <div className="frow">
          <span className="label">{s.departmentLabel}</span>
          <div className="tabs" role="group">
            <button type="button" className={f.dept ? "" : "on"} onClick={() => setParam("dept", "")}>
              {s.allDepartmentsLabel}
            </button>
            {deptKeys.map(([k, label]) => (
              <button type="button" key={k} className={f.dept === k ? "on" : ""} onClick={() => setParam("dept", k)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="frow">
          <label className="label" htmlFor="q">
            {s.searchLabel}
          </label>
          <input className="fsearch" id="q" type="search" placeholder={vercelStegaClean(s.searchPlaceholder ?? "")} autoComplete="off" value={f.q} onChange={(e) => setParam("q", e.target.value)} />
        </div>
        <div className="frow">
          <span className="label">{s.filterLabel}</span>
          <label className="ftog">
            <input type="checkbox" checked={f.ai} onChange={(e) => setParam("ai", e.target.checked ? "1" : "")} />
            {s.aiOnlyLabel}
          </label>
        </div>
      </div>
      <p className="fcount" aria-live="polite">
        {count}
      </p>
      <div className="ucs">
        {tiles.map((t) => (
          <article className="card uc" key={t.id} id={t.id} hidden={!shown.has(t.id)}>
            {(t.own || t.ai || t.metric) && (
              <div className="uc-top">
                {t.own && <span className="label">{ownLabel}</span>}
                {t.ai && <span className="tag ai">{aiLabel}</span>}
                {t.metric && <span className="tag">{t.metric.toUpperCase()}</span>}
              </div>
            )}
            <h3 className="h3">{t.title}</h3>
            <p className="body">{t.summary}</p>
            <div className="uc-dept">
              {t.departments.map((d) => (
                <span className="label" key={d}>
                  {departments[d] ?? d}
                </span>
              ))}
            </div>
            <button type="button" className="link" aria-haspopup="dialog" onClick={() => writeUrl((url) => (url.hash = t.id))}>
              {s.linkLabel}
              <Arrow />
            </button>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="empty body vc-show">{s.emptyText}</p>
      )}
      {visible.length > limit && (
        <div className="ctas">
          <button type="button" className="btn outline" onClick={() => setMore({ key: search, count: limit + PAGE })}>
            <span className="roll">
              <span>{s.moreLabel}</span>
              <span aria-hidden="true">{vercelStegaClean(s.moreLabel ?? "")}</span>
            </span>
          </button>
        </div>
      )}
      {openTile && (
        <BuildDialog
          open
          onClose={closeBuild}
          labelledBy="uc-build-title"
          header={
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">{openTile.kicker}</span>
              </div>
              {openTile.metric && <p className="mt-2 font-mono text-sm font-semibold text-body">{openTile.metric}</p>}
              <h2 id="uc-build-title" className="mt-1.5 text-section-h3 text-body text-balance">
                {openTile.title}
              </h2>
            </>
          }
        >
          {openDetail ? (
            <UseCaseBuild useCase={openDetail} />
          ) : failed && failed === slug ? (
            <p className="text-body text-muted">
              This build could not be loaded.{" "}
              <Link href={`/ai-use-cases/${industries.find((i) => i.key === openTile.industry)?.slug ?? ""}#${openTile.id}`} className="font-semibold text-brand hover:underline">
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
    </>
  )
}

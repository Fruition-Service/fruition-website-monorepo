"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { vercelStegaClean } from "@vercel/stega"
import { dataset, projectId } from "@/sanity/env"
import { answerToPlainText } from "@/lib/faqSchema"
import type { VcBlogCard } from "@/sanity/vcQueries"
import type { VcBlogListData, VcFaqHubData } from "../types"

/** The hero search box and the list below talk through one window event. */
const SEARCH_EVENT = "vc-search"

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  )
}

export function VcHeroSearch({ placeholder, clearable }: { placeholder?: string; clearable?: boolean }) {
  const [q, setQ] = useState("")
  const label = vercelStegaClean(placeholder ?? "Search")
  const send = (v: string) => {
    setQ(v)
    window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: v }))
  }
  return (
    <form className="hsearch" role="search" onSubmit={(e) => e.preventDefault()}>
      <SearchIcon />
      <input type="search" placeholder={label} aria-label={label} autoComplete="off" value={q} onChange={(e) => send(e.target.value)} />
      {clearable && (
        <button className={`clr${q ? " show" : ""}`} type="button" aria-label="Clear search" onClick={() => send("")}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      )}
    </form>
  )
}

function useSearch() {
  const [q, setQ] = useState("")
  useEffect(() => {
    const on = (e: Event) => setQ(String((e as CustomEvent).detail ?? ""))
    window.addEventListener(SEARCH_EVENT, on)
    return () => window.removeEventListener(SEARCH_EVENT, on)
  }, [])
  return q
}

/* --------------------------------------------------------------- blog */

const PER = 12
const coverSrc = (ref?: string) => {
  const m = (ref ?? "").match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/)
  return m ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}.${m[3]}?w=720&auto=format` : undefined
}
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : ""

export function VcBlogGrid({ s, posts }: { s: VcBlogListData; posts: VcBlogCard[] }) {
  const q = useSearch()
  const other = vercelStegaClean(s.otherLabel ?? "General")
  const catOf = (p: VcBlogCard) => p.category || other
  // A post sits under every category it carries, not only its first, so a tab lists all its posts.
  const catsOf = (p: VcBlogCard) => {
    const all = (p.categories ?? []).filter((c): c is string => !!c)
    return all.length ? all : [other]
  }
  const cats = Array.from(new Set(posts.flatMap(catsOf))).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
  const [cat, setCat] = useState("")
  const terms = q.trim().toLowerCase()
  // The page number belongs to one filter + search combination; changing either starts at page 1.
  const view = `${cat}|${terms}`
  const [pg, setPg] = useState({ view: "", n: 1 })
  const page = pg.view === view ? pg.n : 1
  const setPage = (n: number) => setPg({ view, n })
  const list = posts.filter((p) => (!cat || catsOf(p).includes(cat)) && (!terms || (p.title ?? "").toLowerCase().includes(terms)))
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const cur = Math.min(page, pages)
  return (
    <>
      <div className="pbar">
        <div className="tabs">
          <button type="button" className={cat === "" ? "on" : ""} onClick={() => setCat("")}>
            {s.allLabel ?? "All Posts"}
          </button>
          {cats.map((c) => (
            <button key={c} type="button" className={cat === c ? "on" : ""} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="posts">
        {list.slice((cur - 1) * PER, cur * PER).map((p) => {
          const src = coverSrc(p.cover?.asset?._ref)
          const href = `/post/${p.slug}`
          return (
            <article className="post" key={p._id}>
              <a className="pic" href={href} tabIndex={-1} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {src && <img src={src} alt="" loading="lazy" />}
              </a>
              <div className="top">
                <span className="label">{catOf(p)}</span>
                <span className="label">{Math.max(1, Math.round((p.charCount ?? 5000) / 5 / 200))} min read</span>
              </div>
              <h3 className="h3">
                <a href={href}>{p.title}</a>
              </h3>
              <div className="by">
                <span className="label">
                  {fmtDate(p.publishedAt)}
                  {p.author ? ` · ${p.author}` : ""}
                </span>
              </div>
            </article>
          )
        })}
      </div>
      {!list.length && <p className="empty body vc-show">{s.emptyText ?? "No posts match that search."}</p>}
      {pages > 1 && (
        <nav className="pager" aria-label="Pages">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i + 1 === cur ? "on" : ""}
              aria-current={i + 1 === cur ? "page" : undefined}
              onClick={() => {
                setPage(i + 1)
                document.getElementById("posts")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      )}
    </>
  )
}

/* ---------------------------------------------------------- FAQ hub */

function Hl({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>
  const rx = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi")
  return (
    <>
      {text.split(rx).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>))}
    </>
  )
}

function HubQa({ n, q, a, terms, startOpen }: { n: number; q: string; a: string; terms: string[]; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <div className={`qa${open ? " open" : ""}`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="label">{String(n).padStart(2, "0")}</span>
        <span>
          <Hl text={q} terms={terms} />
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div className="ans">
        <Hl text={a} terms={terms} />
      </div>
    </div>
  )
}

function HubGroup({ name, items, terms, startOpen, firstOpen }: { name: string; items: { q: string; a: string }[]; terms: string[]; startOpen: boolean; firstOpen: boolean }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <div className={`grp${open ? " open" : ""}`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="t">
          <Hl text={name} terms={terms} />
          <span className="n">{items.length}</span>
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div className="qs">
        {items.map((it, k) => (
          <HubQa key={k} n={k + 1} q={it.q} a={it.a} terms={terms} startOpen={firstOpen && k === 0 && open} />
        ))}
      </div>
    </div>
  )
}

/**
 * The /faqs help centre: topic list with counts, grouped questions, search
 * across every question with highlighting, as in the approved mock-up.
 */
export function VcFaqHubView({ s }: { s: VcFaqHubData }) {
  const q = useSearch()
  const data = useMemo(
    () =>
      (s.categories ?? []).map((c) => ({
        id: vercelStegaClean(c.key ?? c._key ?? ""),
        n: c.name ?? "",
        d: c.description ?? "",
        g: (c.groups ?? []).map((g) => ({
          n: vercelStegaClean(g.name ?? ""),
          i: (g.items ?? []).filter(Boolean).map((it) => ({ q: vercelStegaClean(it.question ?? ""), a: vercelStegaClean(answerToPlainText(it.answer)) })),
        })),
      })),
    [s.categories],
  )
  const [cat, setCat] = useState(data[0]?.id ?? "")
  const [allOpen, setAllOpen] = useState<string | null>(null)
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hits = data.map((c) => ({ c, g: c.g.map((g) => ({ n: g.n, i: g.i.filter((it) => !terms.length || terms.every((t) => `${it.q} ${it.a}`.toLowerCase().includes(t))) })).filter((g) => g.i.length) }))
  const nOf = (h: (typeof hits)[number]) => h.g.reduce((b, g) => b + g.i.length, 0)
  const allN = hits.reduce((b, h) => b + nOf(h), 0)
  const show = cat === "" ? hits : hits.filter((h) => h.c.id === cat)
  const flat = show.reduce((b, h) => b + nOf(h), 0)
  const isOpen = (h: (typeof hits)[number], gi: number) => {
    const many = h.g.length > 6
    return terms.length ? true : allOpen === h.c.id ? true : many ? gi < 2 && cat !== "" && allOpen !== `x${h.c.id}` : cat !== ""
  }
  // Only the first open group shows its first answer.
  const firstKey = (() => {
    for (const h of show) for (let gi = 0; gi < h.g.length; gi++) if (isOpen(h, gi)) return `${h.c.id}-${gi}`
    return ""
  })()
  return (
    <>
      <nav className="side" aria-label={vercelStegaClean(s.sideLabel ?? "Browse by topic")}>
        {s.sideLabel && <span className="label">{s.sideLabel}</span>}
        <div className="pills">
          <button type="button" className={cat === "" ? "on" : ""} onClick={() => { setCat(""); setAllOpen(null) }}>
            <span>{s.allLabel ?? "All topics"}</span>
            <span className="n">{allN}</span>
          </button>
          <hr />
          {hits.map((h) => (
            <button key={h.c.id} type="button" className={`${cat === h.c.id ? "on" : ""}${terms.length && !nOf(h) ? " zero" : ""}`} onClick={() => { setCat(h.c.id); setAllOpen(null) }}>
              <span>{h.c.n}</span>
              <span className="n">{nOf(h)}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="res">
        <div className="res-h">
          {!terms.length && cat !== "" && show[0] ? (
            <>
              <span className="label">{nOf(show[0])} questions</span>
              <h2 className="h3">{show[0].c.n}</h2>
              <p className="body">{show[0].c.d}</p>
            </>
          ) : (
            <span className="label">
              {flat} {flat === 1 ? "question" : "questions"}
              {terms.length ? ` for "${q.trim()}"` : ""}
            </span>
          )}
        </div>
        {show.map((h) => {
          if (!h.g.length) return null
          const many = h.g.length > 6
          return (
            <Fragment key={h.c.id}>
              {cat === "" && (
                <div className="catn">
                  <h2 className="h3">{h.c.n}</h2>
                  <span className="label">
                    {nOf(h)} {nOf(h) === 1 ? "question" : "questions"}
                  </span>
                </div>
              )}
              {many && !terms.length && (
                <div className="bar2">
                  <span className="label">{h.g.length} topics</span>
                  <button type="button" onClick={() => setAllOpen(allOpen === h.c.id ? `x${h.c.id}` : h.c.id)}>
                    {allOpen === h.c.id ? "Collapse all" : "Expand all"}
                  </button>
                </div>
              )}
              {h.g.map((g, gi) => (
                <HubGroup
                  key={`${h.c.id}-${gi}-${terms.join(" ")}-${allOpen}-${cat}`}
                  name={g.n}
                  items={g.i}
                  terms={terms}
                  startOpen={isOpen(h, gi)}
                  firstOpen={firstKey === `${h.c.id}-${gi}`}
                />
              ))}
            </Fragment>
          )
        })}
        {!flat && (
          <div className="none show">
            <h3 className="title">No matching questions</h3>
            <p className="small vc-mt8">Try a different word.</p>
          </div>
        )}
      </div>
    </>
  )
}

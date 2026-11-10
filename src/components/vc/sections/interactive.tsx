"use client"

import { useState } from "react"
import { vercelStegaClean } from "@vercel/stega"
import { Btn, Head } from "../primitives"
import { dataset, projectId } from "@/sanity/env"
import type { VcFixData, VcIndustryTabsData, VcTrackData } from "../types"

/** Tick used in the solution and benefit lists. */
export function Tick() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

/* ------------------------------------------------------- find your fix */

export function VcFixPicker({ s }: { s: VcFixData }) {
  const items = s.items ?? []
  const [active, setActive] = useState(0)
  const cur = items[active]
  return (
    <>
      <Head head={s.head} />
      <div className="fix">
        <div className="fix-list" role="tablist">
          {items.map((it, i) => (
            <div
              key={it._key ?? i}
              className={`frow${i === active ? " on" : ""}`}
              role="tab"
              tabIndex={0}
              aria-selected={i === active}
              onClick={() => setActive(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(i))}
            >
              <h3 className="title">{it.title}</h3>
              {it.problem && <p className="small">{it.problem}</p>}
            </div>
          ))}
        </div>
        {cur && (
          <div className="fix-detail" role="tabpanel">
            {s.detailLabel && <span className="label">{s.detailLabel}</span>}
            <h3 className="h3">{vercelStegaClean(cur.title ?? "")}</h3>
            <ul className="tl">
              {(cur.steps ?? []).map((x, i) => (
                <li key={i}>
                  <Tick />
                  {x}
                </li>
              ))}
            </ul>
            {cur.outcome && <p className="out">{cur.outcome}</p>}
            <Btn cta={s.cta ? { arrow: true, ...s.cta } : null} />
          </div>
        )}
      </div>
    </>
  )
}

/* -------------------------------------------------------- industry tabs */

export function VcIndustryTabsView({ s }: { s: VcIndustryTabsData }) {
  const tabs = s.tabs ?? []
  const [active, setActive] = useState(0)
  const cur = tabs[active]
  return (
    <>
      <Head head={s.head} />
      <div className="inds" role="tablist">
        {tabs.map((t, i) => (
          <span
            key={t._key ?? i}
            className={i === active ? "on" : ""}
            role="tab"
            tabIndex={0}
            aria-selected={i === active}
            onClick={() => setActive(i)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(i))}
          >
            {t.label}
          </span>
        ))}
      </div>
      {cur && (
        <div className="ind" role="tabpanel">
          {cur.title && <h3 className="h3">{cur.title}</h3>}
          {cur.body && <p className="body">{cur.body}</p>}
          {s.benefitsLabel && <span className="label">{s.benefitsLabel}</span>}
          <ul className="tl two">
            {(cur.benefits ?? []).map((b, i) => (
              <li key={i}>
                <Tick />
                {b}
              </li>
            ))}
          </ul>
          <Btn cta={s.cta ? { arrow: true, ...s.cta } : null} />
        </div>
      )}
    </>
  )
}

/* ----------------------------------------------------- training tracks */

/**
 * Track rules (from the approved mock-up): many departments, or 80+ people,
 * is the enterprise track; one simple team under 20 is self-paced; everything
 * else is the live bootcamp.
 */
export function pickTrack(size: number, complexity: number): number {
  if (complexity === 2 || size >= 80) return 2
  if (complexity === 0 && size < 20) return 0
  return 1
}

export function VcTrackFinder({ s }: { s: VcTrackData }) {
  const [size, setSize] = useState(15)
  const [cx, setCx] = useState(1)
  const tracks = s.tracks ?? []
  const t = tracks[pickTrack(size, cx)] ?? tracks[0]
  return (
    <>
      <Head head={s.head} />
      <div className="track">
        <div className="tcard">
          <div>
            <div className="row">
              <b>{s.sizeLabel}</b>
              <span className="val">{size === 1 ? "1 person" : `${size} people`}</span>
            </div>
            <input
              type="range"
              min={1}
              max={150}
              step={1}
              value={size}
              aria-label={vercelStegaClean(s.sizeLabel ?? "Team size")}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>
          <div>
            <b>{s.complexityLabel}</b>
            <div className="opts3">
              {(s.complexity ?? []).map((c, i) => (
                <button key={i} type="button" className={i === cx ? "on" : ""} aria-pressed={i === cx} onClick={() => setCx(i)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rec" aria-live="polite">
          {s.recLabel && <span className="label">{s.recLabel}</span>}
          {t && (
            <>
              <h3 className="h3">{t.title}</h3>
              <p>{t.body}</p>
              <p className="small">{t.fit}</p>
            </>
          )}
          <Btn cta={s.cta ? { arrow: true, style: "inverse", ...s.cta } : null} />
        </div>
      </div>
      {!!s.pills?.length && (
        <div className="pills">
          {s.pills.map((p, i) => (
            <span className="badge" key={i}>
              <i />
              {p}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

/* ---------------------------------------------------- partner directory */

export function VcDirectoryGrid({ s }: { s: import("../types").VcDirectoryData }) {
  const [f, setF] = useState("all")
  const filters = s.filters ?? []
  return (
    <>
      <Head head={s.head} />
      {filters.length > 1 && (
        <div className="tabs vc-mt0" role="tablist">
          {filters.map((x, i) => {
            const k = vercelStegaClean(x.key ?? "all")
            return (
              <button key={x._key ?? i} type="button" role="tab" aria-selected={k === f} className={k === f ? "on" : ""} onClick={() => setF(k)}>
                {x.label}
              </button>
            )
          })}
        </div>
      )}
      <div className="pgrid">
        {(s.tiles ?? [])
          .filter((t) => f === "all" || (t.groups ?? []).map((g) => vercelStegaClean(g)).includes(f))
          .map((t, i) => (
            <article className="ptile" key={t._key ?? i}>
              <div className="logo">
                {t.logo?.asset && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={vercelStegaClean(t.logoShape ?? "")} src={tileSrc(t.logo)} alt={vercelStegaClean(t.title ?? "")} loading="lazy" />
                )}
              </div>
              <div className="pt">
                {t.tag && <span className="gtag">{t.tag}</span>}
                {t.title && <h3 className="h3">{t.title}</h3>}
              </div>
              {t.href && (
                <a className="link" href={vercelStegaClean(t.href)} aria-label={vercelStegaClean(t.title ?? "")}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </article>
          ))}
      </div>
    </>
  )
}

/** Client-side Sanity URL (the server SImg helper is not importable in a client island). */
function tileSrc(image: import("../types").VcImage) {
  const ref = image.asset?._ref ?? ""
  const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/)
  return m ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}.${m[3]}?h=160&fit=max&auto=format` : undefined
}

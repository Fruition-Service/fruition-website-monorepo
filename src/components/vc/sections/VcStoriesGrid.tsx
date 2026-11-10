"use client"

import { useEffect, useRef, useState } from "react"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { vercelStegaClean } from "@vercel/stega"
import { dataset, projectId } from "@/sanity/env"
import type { VcImage, VcStoriesData, VcStoryData } from "../types"

const RICH: PortableTextComponents = {
  block: { normal: ({ children }) => <p className="body">{children}</p> },
}

function logoSrc(image?: VcImage) {
  const m = (image?.asset?._ref ?? "").match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/)
  return m ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}.${m[3]}?h=160&fit=max&auto=format` : undefined
}

function Logo({ c }: { c: VcStoryData }) {
  const src = logoSrc(c.logo)
  return (
    <span className="tl-logo lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt={`${vercelStegaClean(c.client ?? "")} logo`} />}
    </span>
  )
}

/**
 * Customer stories: solution filter, card grid, and a native <dialog> with the
 * full story (challenge, solution, impact, people, details), as in the mock-up.
 */
export default function VcStoriesGrid({ s }: { s: VcStoriesData }) {
  const stories = (s.stories ?? []).filter(Boolean)
  const solutions = Array.from(new Set(stories.map((c) => vercelStegaClean(c.solution ?? "")).filter(Boolean)))
  const [sol, setSol] = useState("")
  const [open, setOpen] = useState<VcStoryData | null>(null)
  const dlg = useRef<HTMLDialogElement>(null)
  const shown = stories.filter((c) => !sol || vercelStegaClean(c.solution ?? "") === sol)

  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (open && !d.open) d.showModal?.()
    if (!open && d.open) d.close()
  }, [open])

  const count = vercelStegaClean(s.countText ?? "Showing {shown} of {total} success stories")
    .replace("{shown}", String(shown.length))
    .replace("{total}", String(stories.length))

  return (
    <>
      <div className="filters">
        {s.filterLabel && <span className="label">{s.filterLabel}</span>}
        <div className="tabs">
          <button type="button" className={sol === "" ? "on" : ""} onClick={() => setSol("")}>
            All
          </button>
          {solutions.map((x) => (
            <button key={x} type="button" className={sol === x ? "on" : ""} onClick={() => setSol(x)}>
              {x}
            </button>
          ))}
        </div>
        <p className="fcount">{count}</p>
      </div>
      <div className="csgrid">
        {shown.map((c) => (
          <button key={c._id} className="cs" type="button" onClick={() => setOpen(c)} id={`case-${vercelStegaClean(c.num ?? "")}`}>
            <Logo c={c} />
            <span className="cs-body">
              <span className="label">
                {c.num} &middot; {c.weeks}
              </span>
              <span className="h3">{c.client}</span>
              {c.sub && <span className="small cs-sub">{c.sub}</span>}
              {!!c.metrics?.length && (
                <span className="metrics sm">
                  {c.metrics.map((m, i) => (
                    <span className="m" key={m._key ?? i}>
                      <b>{m.value}</b>
                      <span className="label">{m.label}</span>
                    </span>
                  ))}
                </span>
              )}
              {!!c.tags?.length && (
                <span className="cs-tags">
                  {c.tags.map((t, i) => (
                    <span className="tag" key={i}>
                      {t}
                    </span>
                  ))}
                </span>
              )}
            </span>
            <span className="go">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        ))}
      </div>
      <dialog className="cdlg" ref={dlg} onClose={() => setOpen(null)} aria-labelledby="vc-story-title">
        <button className="dl-x" type="button" aria-label="Close" onClick={() => setOpen(null)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
        {open && (
          <div className="dl">
            <div className="dl-h">
              <Logo c={open} />
              <div>
                <span className="label">{open.num} &middot; Case study</span>
                <h2 className="h2" id="vc-story-title">
                  {open.client} Case Study
                </h2>
                {open.sub && <p className="body vc-mt8">{open.sub}</p>}
                <div className="dl-tags">
                  {open.solution && <span className="tag">{open.solution}</span>}
                  {open.weeks && <span className="tag">{open.weeks}</span>}
                </div>
              </div>
            </div>
            <div className="metrics">
              {(open.metrics ?? []).map((m, i) => (
                <div className="m" key={m._key ?? i}>
                  <b>{m.value}</b>
                  <span className="label">{m.label}</span>
                  {m.sub && <span className="small">{m.sub}</span>}
                </div>
              ))}
            </div>
            {open.quote && (
              <div className="dl-q">
                <blockquote>{open.quote}</blockquote>
                <div className="dl-p">
                  {(open.people ?? []).map((p, i) => (
                    <div key={p._key ?? i}>
                      <b>{p.name}</b>
                      <span>{p.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="dl-cols">
              <div>
                <span className="label">The challenge</span>
                {open.challenge && <PortableText value={open.challenge} components={RICH} />}
              </div>
              <div>
                <span className="label">The solution</span>
                {open.solutionText && <PortableText value={open.solutionText} components={RICH} />}
              </div>
              <div>
                <span className="label">The impact</span>
                {open.impact && <PortableText value={open.impact} components={RICH} />}
              </div>
            </div>
            <div className="dl-kv">
              <div>
                <span className="label">Location</span>
                <b>{open.location}</b>
              </div>
              <div>
                <span className="label">Employees</span>
                <b>{open.employees}</b>
              </div>
              <div>
                <span className="label">Industry</span>
                <b>{open.industry}</b>
              </div>
              <div>
                <span className="label">Use case</span>
                <b>{open.useCase}</b>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { vercelStegaClean } from "@vercel/stega"
import type { VcFinderBuild, VcSolutionFinderData } from "../types"
import { ALL, GENERAL, buildsFor, industryCounts, resultsIntro, splitHubs, splitPhase } from "./finderLogic"

/**
 * Solution finder card (vcSolutionFinder, PAGE-SPECIFIC). Built from the Claude
 * Design spec "HubSpot solution finder section.dc.html" (Fruition design
 * project, 13 Nov 2026). A chat transcript: the bot asks for the industry, the
 * visitor's pick shows as their own bubble, a typing pause, then the matching
 * builds. Any build opens its full detail in the same card. "Get it scoped" is
 * a plain booking link, so InPageBookingLinks scrolls it to the page's own
 * #book section. Ported from the oglabs.io home page finder; copy is Sanity's.
 */

const TYPING_MS = 900
const clean = (s?: string) => vercelStegaClean(s ?? "")

type Msg =
  | { id: number; kind: "bot"; text: string; chips?: boolean; ind?: string; actions?: boolean }
  | { id: number; kind: "user"; text: string }
  | { id: number; kind: "typing" }

function reducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

const Chevron = ({ dir = "right" }: { dir?: "right" | "left" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
)
const Tick = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)
const Person = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

function Detail({ b }: { b: VcFinderBuild }) {
  const ind = clean(b.industry) === GENERAL ? "Any industry" : b.industry
  return (
    <article className="sf-detail">
      <div>
        <div className="sf-badges">
          {ind && <span className="sf-badge sf-badge--ind">{ind}</span>}
          {splitHubs(b.hubs).map((h, i) => (
            <span className="sf-badge" key={i}><i aria-hidden="true" />{h}</span>
          ))}
        </div>
        <h3 className="sf-dn">{b.name}</h3>
        {b.description && <p className="sf-dd">{b.description}</p>}
      </div>
      {!!b.outcomes?.length && (
        <div>
          <p className="sf-k">Outcomes</p>
          <ul className="sf-outcomes">
            {b.outcomes.map((o, i) => <li key={i}><Tick /><span>{o}</span></li>)}
          </ul>
        </div>
      )}
      {!!b.steps?.length && (
        <div>
          <p className="sf-k sf-k--tight">What we build</p>
          <ol className="sf-steps">
            {b.steps.map((s, i) => (
              <li key={s._key ?? i}>
                <span className="sf-step-n">{String(i + 1).padStart(2, "0")}</span>
                <div className="sf-step-c">
                  <div className="sf-step-l">{s.label}</div>
                  {s.summary && <div className="sf-step-s">{s.summary}</div>}
                  {s.how && <div className="sf-step-h"><span>How</span><span>{s.how}</span></div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {!!b.roles?.length && (
        <div>
          <p className="sf-k">Who uses it</p>
          <ul className="sf-roles">
            {b.roles.map((r, i) => (
              <li key={r._key ?? i} title={r.text}><Person />{r.label}</li>
            ))}
          </ul>
        </div>
      )}
      {!!b.phases?.length && (
        <div>
          <p className="sf-k">Delivery phases</p>
          <div className="sf-phases">
            {b.phases.map((p, i) => {
              const { title, line } = splitPhase(p)
              return (
                <div className="sf-phase" key={i}>
                  <div className="sf-phase-n">Phase {i + 1}</div>
                  <div className="sf-phase-t">{title}</div>
                  {line && <div className="sf-phase-l">{line}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
      {(!!b.kpis?.length || !!b.integrations?.length) && (
        <div className="sf-pair">
          {!!b.kpis?.length && (
            <div>
              <p className="sf-k">KPIs</p>
              <div className="sf-chips">{b.kpis.map((x, i) => <span className="sf-chip sf-chip--kpi" key={i}>{x}</span>)}</div>
            </div>
          )}
          {!!b.integrations?.length && (
            <div>
              <p className="sf-k">Integrations</p>
              <div className="sf-chips">{b.integrations.map((x, i) => <span className="sf-chip" key={i}>{x}</span>)}</div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function VcSolutionFinder({ s }: { s: VcSolutionFinderData }) {
  const builds = useMemo(() => s.builds ?? [], [s.builds])
  const platform = clean(s.platform)
  const allLabel = s.allLabel || "Show me everything"
  const greet = (): Msg => ({ id: 0, kind: "bot", text: s.greeting ?? "", chips: true })

  const [msgs, setMsgs] = useState<Msg[]>(() => [greet()])
  const [openKey, setOpenKey] = useState<string | null>(null)
  const nextId = useRef(1)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const savedTop = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevCount = useRef(1)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const industries = useMemo(() => industryCounts(builds, clean), [builds])
  const keyOf = (b: VcFinderBuild) => b._key ?? clean(b.buildId) ?? clean(b.name)
  const open = openKey ? builds.find((b) => keyOf(b) === openKey) ?? null : null
  const typing = msgs.some((m) => m.kind === "typing")

  function resultsMsg(ind: string): Msg {
    const n = buildsFor(builds, ind, clean).length
    return { id: nextId.current++, kind: "bot", text: resultsIntro(n, ind, platform), ind, actions: true }
  }

  function pick(ind: string) {
    if (typing) return
    const label = ind === ALL ? allLabel : ind
    if (timer.current) clearTimeout(timer.current)
    if (reducedMotion()) {
      setMsgs((m) => [...m, { id: nextId.current++, kind: "user", text: label }, resultsMsg(ind)])
      return
    }
    setMsgs((m) => [...m, { id: nextId.current++, kind: "user", text: label }, { id: nextId.current++, kind: "typing" }])
    timer.current = setTimeout(() => setMsgs((m) => [...m.filter((x) => x.kind !== "typing"), resultsMsg(ind)]), TYPING_MS)
  }

  function changeIndustry() {
    setMsgs((m) => [...m, { id: nextId.current++, kind: "bot", text: s.changePrompt || "No problem. Which industry should we look at?", chips: true }])
  }

  function startOver() {
    if (timer.current) clearTimeout(timer.current)
    savedTop.current = 0
    setOpenKey(null)
    setMsgs([greet()])
  }

  function openBuild(key: string) {
    savedTop.current = scrollRef.current?.scrollTop ?? 0
    setOpenKey(key)
  }

  // Into a build: top of the card. Back: where the transcript was.
  useEffect(() => {
    const sc = scrollRef.current
    if (sc) sc.scrollTop = openKey ? 0 : savedTop.current
  }, [openKey])

  // A new message: bring the visitor's latest answer to the top of the card,
  // with the reply under it. Scrolls the card only, never the page.
  useEffect(() => {
    const sc = scrollRef.current
    const grew = msgs.length > prevCount.current
    prevCount.current = msgs.length
    if (!sc || openKey) return
    if (!grew) { sc.scrollTop = 0; return }
    const users = sc.querySelectorAll<HTMLElement>("[data-msg-user]")
    const anchor = users[users.length - 1]
    const lastBot = sc.querySelector<HTMLElement>("[data-msg]:last-child")
    const node = msgs[msgs.length - 1]?.kind === "bot" && msgs[msgs.length - 2]?.kind === "bot" ? lastBot : anchor
    if (node) sc.scrollTo({ top: Math.max(0, node.offsetTop - 20), behavior: reducedMotion() ? "auto" : "smooth" })
  }, [msgs, openKey])

  const last = msgs.length - 1

  return (
    <div className="sf-card">
      <div className="sf-head">
        {open ? (
          <button type="button" className="sf-back" onClick={() => setOpenKey(null)}>
            <Chevron dir="left" />
            Back to builds
          </button>
        ) : (
          <span className="sf-title"><i aria-hidden="true" />{s.label || "Solution finder"}</span>
        )}
        {msgs.length > 1 || open ? (
          <button type="button" className="sf-reset" onClick={startOver}>Start over</button>
        ) : (
          <span className="sf-count">{builds.length} builds</span>
        )}
      </div>

      <div className="sf-body" ref={scrollRef}>
        {open ? (
          <Detail b={open} />
        ) : (
          <div className="sf-log" role="log" aria-live="polite" aria-label={`${s.label || "Solution finder"} conversation`}>
            {msgs.map((m, i) => {
              if (m.kind === "user") {
                return <div className="sf-msg" data-msg="" data-msg-user="" key={m.id}><div className="sf-me">{m.text}</div></div>
              }
              const list = m.kind === "bot" && m.ind ? buildsFor(builds, m.ind, clean) : null
              return (
                <div className="sf-msg" data-msg="" key={m.id}>
                  <div className="sf-bot">
                    <span className="sf-av" aria-hidden="true"><i /></span>
                    <div className="sf-bot-c">
                      {m.kind === "typing" ? (
                        <div className="sf-bub sf-typing" aria-label="Typing"><i /><i /><i /></div>
                      ) : (
                        <div className="sf-bub">{m.text}</div>
                      )}
                      {m.kind === "bot" && m.chips && i === last && (
                        <div className="sf-chipset" role="group" aria-label="Industries">
                          {industries.map(([name, count]) => (
                            <button type="button" key={name} className="sf-opt" onClick={() => pick(name)}>
                              {name}<span>{count}</span>
                            </button>
                          ))}
                          <button type="button" className="sf-opt sf-opt--all" onClick={() => pick(ALL)}>
                            {allLabel}<span>{builds.length}</span>
                          </button>
                        </div>
                      )}
                      {!!list?.length && (
                        <div className="sf-list">
                          {list.map((b) => (
                            <button type="button" key={keyOf(b)} className="sf-item" aria-label={`${clean(b.name)}: ${clean(b.useCase)}`} onClick={() => openBuild(keyOf(b))}>
                              <span className="sf-item-c">
                                {m.kind === "bot" && m.ind === ALL && b.industry && <span className="sf-item-t">{b.industry}</span>}
                                <span className="sf-item-n">{b.name}</span>
                                {b.useCase && <span className="sf-item-u">{b.useCase}</span>}
                              </span>
                              <Chevron />
                            </button>
                          ))}
                        </div>
                      )}
                      {m.kind === "bot" && m.actions && i === last && (
                        <div className="sf-chipset">
                          <button type="button" className="sf-pill" onClick={changeIndustry}>Change industry</button>
                          <button type="button" className="sf-pill" onClick={startOver}>Start over</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="sf-foot">
        <span className="sf-foot-p">{s.scopePrompt}</span>
        <a className="sf-scope" href={clean(s.scopeHref) || "/contact-us#book"}>
          {s.scopeLabel || "Get it scoped"}
          <ArrowRight />
        </a>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { vercelStegaClean } from "@vercel/stega"
import { Head } from "../primitives"
import type { VcAskDemoData } from "../types"

/**
 * Scripted walkthrough of the Implementation Calculator (an illustration; the
 * live tool is /ask-fruit/workspace). Scenarios, solutions and every label come
 * from the section document; this component only runs the interactions: add
 * context, shortlist, comparison and implementation briefs.
 */

type Fit = "meets" | "partly" | "gap"
interface Req { k: string; v: string }
interface Msg { anim?: boolean; id: number; t: "u" | "a"; text?: string; paras?: string[]; typing?: boolean }
interface Brief { k: "cmp" | "imp"; opts: string[] }

const hs = (s: string) => {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}
const fill = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_m, k) => String(v[k] ?? ""))

/** "*bold* words" -> text with <b>. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/).map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p))}
    </>
  )
}

function Roll({ label }: { label?: string }) {
  return (
    <span className="roll">
      <span>{label}</span>
      <span aria-hidden="true">{vercelStegaClean(label ?? "")}</span>
    </span>
  )
}

let uid = 1

export default function VcAskDemo({ s }: { s: VcAskDemoData }) {
  const ui = Object.fromEntries((s.ui ?? []).map((u) => [vercelStegaClean(u.id ?? ""), u.text ?? ""]))
  const t = (id: string) => ui[id] ?? ""
  const sc = s.scenarios?.[0]
  const sol = new Map((s.solutions ?? []).map((x) => [vercelStegaClean(x.name ?? ""), x]))
  const matches = (sc?.matches ?? []).map((m) => vercelStegaClean(m))
  const fields = [1, 2, 3, 4, 5].map((n) => ({ label: t(`field${n}`), ph: t(`field${n}Ph`) }))
  const regions = [t("region1"), t("region2"), t("region3")]

  const mk = (m: Omit<Msg, "id">): Msg => ({ id: uid++, ...m })
  const initial = (): Msg[] => (sc ? [mk({ t: "u", text: sc.user }), mk({ t: "a", paras: sc.reply })] : [])
  const [msgs, setMsgs] = useState<Msg[]>(initial)
  const [reqs, setReqs] = useState<Req[]>([{ k: t("goalsKey"), v: sc?.goals ?? "" }, { k: t("toolsKey"), v: sc?.tools ?? "" }])
  const [list, setList] = useState<string[]>([])
  const [tab, setTab] = useState<"m" | "s" | "b">("m")
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [adding, setAdding] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [input, setInput] = useState("")
  const [addVal, setAddVal] = useState("")
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (box.current && msgs.some((m) => m.anim)) box.current.scrollTop = box.current.scrollHeight
  }, [msgs])

  if (!sc) return null

  const reply = (paras: string[]) => {
    const typing = mk({ t: "a", typing: true, anim: true })
    setBusy(true)
    setMsgs((m) => [...m, typing])
    setTimeout(() => {
      setMsgs((m) => m.map((x) => (x.id === typing.id ? { ...x, typing: false, paras } : x)))
      setBusy(false)
    }, 900)
  }
  const say = (text: string) => setMsgs((m) => [...m, mk({ t: "u", text, anim: true })])

  const status = (m: string, i: number): Fit => {
    if (i < 2) return (vercelStegaClean(sol.get(m)?.fit?.[i] ?? "meets") as Fit)
    return (["meets", "meets", "meets", "partly", "gap"] as Fit[])[hs(reqs[i].v + m) % 5]
  }
  const fit = (m: string) => {
    const st = reqs.map((_r, i) => status(m, i))
    const me = st.filter((x) => x === "meets").length
    const pa = st.filter((x) => x === "partly").length
    return { me, pa, gap: st.length - me - pa, n: st.length, score: (me + pa / 2) / st.length, st }
  }

  const addReq = (k: string, v: string) => {
    const i = reqs.findIndex((r) => r.k === k)
    setReqs(i > 1 ? reqs.map((r, j) => (j === i ? { k, v } : r)) : [...reqs, { k, v }])
    setAdding(null)
    setAddVal("")
    setBriefs([])
    say(`${k}: ${v}`)
    reply([fill(t("noteAdded"), { k, v })])
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const v = input.trim()
    if (!v || busy) return
    setInput("")
    setOpen(null)
    say(v)
    const m = v.match(/(\d+)\s*(people|seats|users|staff|reps|employees)?/i)
    const team = t("field1")
    const pain = t("field2")
    if (m && !reqs.some((r) => r.k === team)) {
      setReqs([...reqs, { k: team, v: m[1] + (m[2] ? ` ${m[2]}` : ` ${t("teamSuffix")}`) }])
      setBriefs([])
      reply([fill(t("noteTeam"), { k: team })])
    } else {
      const i = reqs.findIndex((r) => r.k === pain)
      setReqs(i > -1 ? reqs.map((r, j) => (j === i ? { ...r, v: `${r.v}; ${v}` } : r)) : [...reqs, { k: pain, v }])
      setBriefs([])
      reply([fill(t("notePain"), { k: pain })])
    }
  }

  const reset = () => {
    setMsgs(initial())
    setReqs([{ k: t("goalsKey"), v: sc.goals ?? "" }, { k: t("toolsKey"), v: sc.tools ?? "" }])
    setList([])
    setBriefs([])
    setTab("m")
    setOpen(null)
    setAdding(null)
  }

  const n = reqs.length
  const stateText = n < 4 ? t("state1") : n < 6 ? t("state2") : t("state3")
  const stl: Record<Fit, string> = { meets: t("statusMeets"), partly: t("statusPartly"), gap: t("statusGap") }
  const metText = (f: { me: number; n: number }) => fill(t("metText"), { me: f.me, n: f.n })

  const briefView = () => {
    if (open === null || !briefs[open]) return null
    const b = briefs[open]
    const fs = b.opts.map((m) => ({ m, f: fit(m) }))
    const top = [...fs].sort((a, c) => c.f.score - a.f.score)[0]
    const impl = b.k === "imp" ? sol.get(top.m) : null
    return (
      <div className="brief">
        <div className="top">
          <span className="label">{b.k === "cmp" ? t("sampleCmp") : t("sampleImp")}</span>
          <span>
            <button className="btn outline" type="button" onClick={() => setOpen(null)}>
              <Roll label={t("back")} />
            </button>{" "}
            <button className="btn" type="button" onClick={() => window.print()}>
              <Roll label={t("print")} />
            </button>
          </span>
        </div>
        <h3>{sc.title}</h3>
        <h5>{t("reqFit")}</h5>
        <div className="rf" style={{ "--n": fs.length } as React.CSSProperties}>
          <div>
            <span>{t("reqCol")}</span>
            {fs.map((x) => (
              <span key={x.m}>{x.m}</span>
            ))}
          </div>
          {reqs.map((r, ri) => (
            <div key={r.k}>
              <span>{`${r.k}: ${r.v}`}</span>
              {fs.map((x) => (
                <span key={x.m}>
                  <i className={`st ${x.f.st[ri]}`}>{stl[x.f.st[ri]]}</i>
                </span>
              ))}
            </div>
          ))}
        </div>
        <h5>{t("sw")}</h5>
        <div className="sw">
          {fs.map((x) => (
            <div key={x.m}>
              <b>{x.m}</b>
              <span className="label">{t("strength")}</span>
              {sol.get(x.m)?.strength}
              <br />
              <br />
              <span className="label">{t("watch")}</span>
              {sol.get(x.m)?.watch}
            </div>
          ))}
        </div>
        <h5>{t("recHeading")}</h5>
        <p className="rec">{fill(t("recTemplate"), { m: top.m, n: top.f.n, me: top.f.me, pa: top.f.pa, gap: top.f.gap, rec: sol.get(top.m)?.rec ?? "" })}</p>
        {impl && (
          <>
            <h5>{t("plan")}</h5>
            <p className="small vc-mb12">
              <b className="vc-ink-b">{t("objective")}</b> {sc.goals}
            </p>
            <div className="plan">
              {(impl.phases ?? []).map((p, j) => (
                <div key={j}>
                  <span className="label">{`${t("phase")} 0${j + 1}`}</span>
                  {p}
                </div>
              ))}
            </div>
            <p className="small vc-mt12">
              <b className="vc-ink-b">{t("owners")}</b> {t("ownersText")} <b className="vc-ink-b">{t("risk")}</b> {impl.watch}
            </p>
          </>
        )}
      </div>
    )
  }

  const tabBody = () => {
    if (tab === "m")
      return matches.map((m) => {
        const f = fit(m)
        const on = list.includes(m)
        return (
          <div className="mc" key={m}>
            <div className="row">
              <h4>{m}</h4>
              <button className={`pill${on ? " on" : ""}`} type="button" onClick={() => { setList(on ? list.filter((x) => x !== m) : [...list, m]); setBriefs([]) }}>
                {on ? t("shortlisted") : t("shortlist")}
              </button>
            </div>
            <p>{sol.get(m)?.why}</p>
            <div className="fit">
              <span className="bar">
                <i style={{ "--w": `${Math.round(f.score * 100)}%` } as React.CSSProperties} />
              </span>
              <span className="label">{metText(f)}</span>
            </div>
          </div>
        )
      })
    if (tab === "s") {
      if (!list.length) return <div className="empty vc-show">{t("emptyShortlist")}</div>
      return (
        <>
          {list.map((m) => (
            <div className="mc" key={m}>
              <div className="row">
                <h4>{m}</h4>
                <span className="label">{metText(fit(m))}</span>
              </div>
              <p>{sol.get(m)?.why}</p>
            </div>
          ))}
          <div className="cta-row">
            <button className="btn" type="button" disabled={list.length < 2} onClick={() => { setBriefs([{ k: "cmp", opts: [...list] }]); setTab("b"); setOpen(0) }}>
              <Roll label={t("cmpBrief")} />
            </button>
            <button className="btn outline" type="button" onClick={() => { setBriefs([{ k: "imp", opts: [...list] }]); setTab("b"); setOpen(0) }}>
              <Roll label={t("impBrief")} />
            </button>
          </div>
        </>
      )
    }
    if (!briefs.length) return <div className="empty vc-show">{t("emptyBriefs")}</div>
    return briefs.map((b, i) => (
      <div className="mc" key={i}>
        <div className="row">
          <h4>{b.k === "cmp" ? t("cmpBrief") : t("impBrief")}</h4>
          <button className="pill" type="button" onClick={() => setOpen(i)}>
            {t("open")}
          </button>
        </div>
        <p>{b.opts.join(", ")}</p>
      </div>
    ))
  }

  return (
    <>
      <Head head={s.head} />
      <div className="app">
        <div className="app-h">
          <div>
            <span className="label">{t("appTitle")}</span>
            <span className="t">{sc.title}</span>
          </div>
          <button className="pill" type="button" onClick={reset}>
            {t("newConversation")}
          </button>
        </div>
        <div className="app-b">
          <div className="chat">
            <div className="msgs" ref={box} aria-live="polite" hidden={open !== null}>
              {msgs.map((m) => (
                <div key={m.id} className={`msg ${m.t}${m.anim ? " new" : ""}`}>
                  {m.t === "a" && <span className="label">{t("assistant")}</span>}
                  {m.typing ? (
                    <span className="typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : m.paras ? (
                    m.paras.map((p, i) => (
                      <p key={i}>
                        <Rich text={p} />
                      </p>
                    ))
                  ) : (
                    m.text
                  )}
                </div>
              ))}
            </div>
            {briefView()}
            <form className="cmp" onSubmit={send}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={vercelStegaClean(t("replyPlaceholder"))} aria-label={vercelStegaClean(t("replyAria"))} />
              <button className="send" type="submit" aria-label={vercelStegaClean(t("sendAria"))}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <p className="label foot">{t("foot")}</p>
          </div>
          <aside className="side">
            <div className="know">
              <div className="know-h">
                <span className="label">{t("knowsLabel")}</span>
                <span className="label">{n}/7</span>
              </div>
              <div className="segs">
                {Array.from({ length: 7 }, (_, i) => (
                  <i key={i} className={i < n ? "on" : ""} />
                ))}
              </div>
              <p className="state">{stateText}</p>
              <dl className="kv">
                {reqs.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="ctx">{t("contextLabel")}</div>
              <div className="chips">
                {fields.map((f) => {
                  const done = reqs.some((r) => r.k === f.label)
                  return (
                    <button key={f.label} type="button" className={`pill ${done ? "on" : "add"}`} onClick={() => setAdding(adding === f.label ? null : f.label)}>
                      {done ? "" : "+ "}
                      {f.label}
                    </button>
                  )
                })}
              </div>
              <div>
                {adding === t("field5") ? (
                  <div className="chips">
                    {regions.map((r) => (
                      <button key={r} type="button" className="pill" onClick={() => addReq(adding, r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                ) : adding ? (
                  <form className="addf" onSubmit={(e) => { e.preventDefault(); if (addVal.trim()) addReq(adding, addVal.trim()) }}>
                    <input value={addVal} onChange={(e) => setAddVal(e.target.value)} placeholder={vercelStegaClean(fields.find((f) => f.label === adding)?.ph ?? "")} aria-label={vercelStegaClean(adding)} />
                    <button className="pill" type="submit">
                      {t("add")}
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
            <div className="ptabs" role="tablist">
              {([["m", t("tabMatches"), matches.length], ["s", t("tabShortlist"), list.length], ["b", t("tabBriefs"), briefs.length]] as const).map(([k, label, c]) => (
                <button key={k} className={tab === k ? "on" : ""} type="button" onClick={() => setTab(k)}>
                  {label}
                  <span>{c}</span>
                </button>
              ))}
            </div>
            <div>{tabBody()}</div>
          </aside>
        </div>
      </div>
      {s.note && <p className="label note-ill">{s.note}</p>}
    </>
  )
}

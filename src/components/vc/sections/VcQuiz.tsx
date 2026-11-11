"use client"

import { useState } from "react"
import Link from "next/link"
import { vercelStegaClean } from "@vercel/stega"
import { trackLead } from "@/lib/leadTracking"
import { Head } from "../primitives"
import type { VcQuizData } from "../types"
import { buildBlueprint, DIM_KEYS, type Blueprint, type DimKey, type QuizQuestion } from "./quizLogic"

/**
 * The AI readiness self-assessment: twelve questions, live scores per
 * dimension, then a generated blueprint and the lead form. Scoring and the
 * blueprint are the logic in ./quizLogic; the lead goes to /api/leads exactly
 * as the page has always posted it. Question and label wording is Sanity copy.
 */

const fill = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_m, k) => String(v[k] ?? ""))

function Roll({ label }: { label?: string }) {
  return (
    <span className="roll">
      <span>{label}</span>
      <span aria-hidden="true">{vercelStegaClean(label ?? "")}</span>
    </span>
  )
}

export default function VcQuiz({ s }: { s: VcQuizData }) {
  const ui = Object.fromEntries((s.ui ?? []).map((u) => [vercelStegaClean(u.id ?? ""), u.text ?? ""]))
  const t = (id: string) => ui[id] ?? ""
  const qs = s.questions ?? []
  const dims = s.dims ?? []
  const logic: QuizQuestion[] = qs.map((q) => ({
    dim: typeof q.dim === "number" ? DIM_KEYS[q.dim] : null,
    options: (q.options ?? []).map((o) => ({ label: vercelStegaClean(o.label ?? ""), hint: o.hint, value: o.value ?? 0 })),
  }))

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | undefined)[]>([])
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [email, setEmail] = useState("")
  const [lead, setLead] = useState<"idle" | "sending" | "done" | "error">("idle")

  const live: Partial<Record<DimKey, number>> = {}
  logic.forEach((q, i) => {
    if (q.dim && answers[i] !== undefined) live[q.dim] = q.options[answers[i]!].value
  })
  const vals = Object.values(live) as number[]
  const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
  const stateText = avg === null ? t("begin") : avg >= 70 ? t("stateAdvanced") : avg >= 45 ? t("stateDeveloping") : t("stateEmerging")

  const q = qs[step]
  const last = step === qs.length - 1

  const generate = () => {
    setBlueprint(buildBlueprint(logic, dims.map((d) => vercelStegaClean(d)), answers as number[]))
    requestAnimationFrame(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }))
  }
  const restart = () => {
    setStep(0)
    setAnswers([])
    setBlueprint(null)
    setLead("idle")
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!blueprint || lead === "sending" || lead === "done") return
    setLead("sending")
    try {
      const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? ""
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0] || "Blueprint lead",
          email,
          source: "ai-readiness-blueprint",
          website: honeypot,
          fields: { blueprint: blueprint.summaryForLead },
        }),
      })
      const j = (await r.json()) as { ok?: boolean }
      if (!j.ok) throw new Error("lead failed")
      trackLead("ai-readiness-blueprint")
      setLead("done")
    } catch {
      setLead("error")
    }
  }

  const bar = (v: number | undefined) => ({ "--w": `${v ?? 0}%` }) as React.CSSProperties

  return (
    <>
      <Head head={s.head} />
      <div className="quiz">
        <aside className="live" aria-label={vercelStegaClean(t("liveAria"))}>
          <span className="label">{t("liveLabel")}</span>
          <div className="total">{avg ?? 0}</div>
          <div className="label state">{stateText}</div>
          <div className="dlist">
            {DIM_KEYS.map((k, i) => (
              <div className="dr" key={k}>
                <span>{dims[i]}</span>
                <span className="bar">
                  <i style={bar(live[k])} />
                </span>
                <span className="label">{live[k] ?? 0}</span>
              </div>
            ))}
          </div>
          <p className="small note">{t("note")}</p>
        </aside>
        <div className="qcard">
          {blueprint ? (
            <div className="final">
              <span className="label">{fill(t("finalCount"), { n: qs.length })}</span>
              <h3 className="h3 vc-mt12">{t("finalHeading")}</h3>
              <p className="body vc-mt12">{t("finalBody")}</p>
              {lead === "done" ? (
                <p className="body vc-mt12">{t("leadDone")}</p>
              ) : (
                <form className="qlead" onSubmit={submit}>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="vc-hp" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={vercelStegaClean(t("emailPlaceholder"))} aria-label={vercelStegaClean(t("emailAria"))} />
                  <button className="btn" type="submit" disabled={lead === "sending"}>
                    <Roll label={lead === "sending" ? t("sending") : t("emailSubmit")} />
                  </button>
                </form>
              )}
              {lead === "error" && <p className="small vc-mt12">{t("leadError")}</p>}
              <div className="ctas">
                <Link className="btn outline" href="#book">
                  <Roll label={t("book")} />
                </Link>
              </div>
              <button type="button" className="link restart" onClick={restart}>
                {t("restart")}
              </button>
            </div>
          ) : (
            q && (
              <>
                <div className="qtop">
                  <span className="label">{`${step + 1} / ${qs.length}`}</span>
                  <span className="label">{q.kicker}</span>
                </div>
                <div className="bar">
                  <i style={bar(((step + 1) / qs.length) * 100)} />
                </div>
                <h3 className="h3">{q.title}</h3>
                <p className="small">{q.help}</p>
                <div className="opts" role="radiogroup" aria-label={vercelStegaClean(q.title ?? "")}>
                  {(q.options ?? []).map((o, i) => (
                    <button key={o._key ?? i} type="button" role="radio" aria-checked={answers[step] === i} className={`opt${answers[step] === i ? " on" : ""}`} onClick={() => setAnswers((a) => { const n = [...a]; n[step] = i; return n })}>
                      <b>{o.label}</b>
                      {o.hint && <span>{o.hint}</span>}
                    </button>
                  ))}
                </div>
                <div className="qnav">
                  {step > 0 ? (
                    <button className="btn outline" type="button" onClick={() => setStep(step - 1)}>
                      <Roll label={t("back")} />
                    </button>
                  ) : (
                    <span className="spacer" />
                  )}
                  <button className="btn" type="button" disabled={answers[step] === undefined} onClick={() => (last ? generate() : setStep(step + 1))}>
                    <Roll label={last ? t("generate") : t("next")} />
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
      {blueprint && (
        <div className="bp" id="report">
          <div className="live bp-cover">
            <span className="label">{fill(t("reportMeta"), { date: blueprint.date })}</span>
            <h3 className="h3 vc-mt12">{blueprint.title}</h3>
            <p className="small note">{blueprint.sub}</p>
          </div>
          <div className="bp-sec">
            <h3 className="h3">{t("landscapeH")}</h3>
            <p className="body">{blueprint.landscape}</p>
          </div>
          <div className="bp-sec">
            <h3 className="h3">{t("scorecardH")}</h3>
            <p className="body">{fill(t("scorecardText"), { a: blueprint.weakest[0], b: blueprint.weakest[1] })}</p>
            <div className="cards4">
              {DIM_KEYS.map((k, i) => (
                <div className="card" key={k}>
                  <b className="bp-n">{blueprint.scores[k]}</b>
                  <span className="label">{dims[i]}</span>
                  <span className="bar">
                    <i style={bar(blueprint.scores[k])} />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bp-sec">
            <h3 className="h3">{t("stackH")}</h3>
            <p className="body">{t("stackText")}</p>
            <div className="cards3">
              {blueprint.stack.map((x) => (
                <div className="card" key={x.name}>
                  <span className="label">{x.tag}</span>
                  <h4 className="h3">{x.name}</h4>
                  <p className="body">{x.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bp-sec">
            <h3 className="h3">{t("phasesH")}</h3>
            <div className="steps s4">
              {blueprint.phases.map((p, i) => (
                <div className="step" key={p.name}>
                  <span className="label">{fill(t("phaseLabel"), { n: i + 1, window: p.window })}</span>
                  <h4 className="h3">{p.name}</h4>
                  <p className="body">{p.body}</p>
                  <span className="label">{`${p.hours}h ${t("estimated")}`}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bp-sec">
            <h3 className="h3">{t("investH")}</h3>
            <div className="card bp-inv">
              {blueprint.invest.map((r, i) => (
                <div className={`bp-row${i === blueprint.invest.length - 1 ? " tot" : ""}`} key={r.item}>
                  <span>{r.item}</span>
                  <span className="label">{r.note}</span>
                  <b>{r.estimate}</b>
                </div>
              ))}
            </div>
            <p className="small">{t("investNote")}</p>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from "react"
import { MAX_MESSAGE_CHARS } from "@/lib/askFruit/types"
import { CHIP_ICONS } from "@/components/vc/sections/VcAskPrompt"
import { STARTERS } from "./Composer"

const STEPS = [
  ["01", "Describe", "Your goal, your tools, what is breaking."],
  ["02", "Compare", "Matched Fruition solutions, scored against your requirements."],
  ["03", "Plan", "A brief to share, then a call with a consultant when you are ready."],
] as const

/**
 * The Implementation Calculator's start screen, in the /ask-fruit Version C
 * look (review-v3 p/ask-fruit-workspace.html, approved by Edward 14 Nov 2026):
 * the hero with the gradient ask box and its starter chips, the client logo
 * strip from /ask-fruit, and the three steps. Styles: the /ask-fruit
 * stylesheet plus scripts/vc/extras-ask-fruit-workspace.css.
 *
 * Sending is the live workspace's own: the question goes straight into a new
 * conversation, as the old composer did.
 */
export function Welcome({ onSend, sending, trust }: { onSend: (text: string) => void; sending: boolean; trust?: ReactNode }) {
  const [value, setValue] = useState("")

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    const text = value.trim()
    if (!text || sending) return
    onSend(text)
    setValue("")
  }
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e)
  }

  return (
    <div className="vc vc-p-ask-fruit vc-p-ask-fruit-workspace">
      <section className="hero" data-sec="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="badge">
              <i />
              Implementation Calculator
            </span>
            <h1 className="display">
              What are you trying to <span className="acc">make happen?</span>
            </h1>
            <p className="lead">
              Describe the problem in your own words. The Implementation Calculator asks what it needs to, recommends the Fruition solution that fits,
              and writes up a comparison or delivery plan you can share.
            </p>
          </div>
          <div className="hero-art">
            <form className="inner dark ask-box" onSubmit={submit}>
              <div className="cmp">
                <textarea
                  id="af-composer"
                  rows={3}
                  value={value}
                  maxLength={MAX_MESSAGE_CHARS}
                  autoFocus
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Describe what you are trying to fix or build…"
                  aria-label="Message the Implementation Calculator"
                />
                <div className="cmp-foot">
                  <button className="send" type="submit" aria-label="Send" disabled={!value.trim() || sending}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="chips">
                {STARTERS.map((s, i) => (
                  <button key={s.label} type="button" className="pill" disabled={sending} onClick={() => onSend(s.text)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={CHIP_ICONS[i % CHIP_ICONS.length]} />
                    </svg>
                    {s.label}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
        {trust}
      </section>
      <section data-sec="why">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="badge">
                <i />
                Three steps
              </span>
              <h2 className="h2">
                Describe, compare, <span className="acc">plan.</span>
              </h2>
            </div>
          </div>
          <ol className="steps">
            {STEPS.map(([n, t, d], i) => (
              <li className="step" key={n}>
                <div className="bar">
                  <i style={{ "--w": `${(i + 1) * 25}%` } as CSSProperties} />
                </div>
                <span className="n">{n}</span>
                <h3 className="h3">{t}</h3>
                <p className="body">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}

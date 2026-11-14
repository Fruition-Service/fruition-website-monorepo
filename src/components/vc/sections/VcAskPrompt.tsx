"use client"

import { useState, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { vercelStegaClean } from "@vercel/stega"
import type { VcHeroData } from "../types"

/** Small line icons for the starter chips, matched by position (Claude Design spec, 13 Nov 2026). */
export const CHIP_ICONS = [
  "M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4",
  "M6 5v11M12 5v6M18 5v14M3 3h18",
  "M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z",
  "M12 22v-5M9 8V2M15 8V2M18 8v5a6 6 0 0 1-12 0V8z",
]

/**
 * The Implementation Calculator hero box: a brand-gradient card holding a
 * white composer and the starter chips. The question (typed or a starter)
 * opens the live Calculator at /ask-fruit/workspace?q=...
 */
export default function VcAskPrompt({ p }: { p: NonNullable<VcHeroData["prompt"]> }) {
  const router = useRouter()
  const [v, setV] = useState("")
  const base = vercelStegaClean(p.href ?? "/ask-fruit/workspace")
  const go = (text: string) => router.push(`${base}?q=${encodeURIComponent(vercelStegaClean(text))}`)
  const submit = () => {
    const t = v.trim()
    if (t) go(t)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }
  return (
    <div className="hero-art">
      <form
        className="inner dark ask-box"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <label className="label" htmlFor="vc-ask-input">
          <i aria-hidden="true" />
          {p.label}
        </label>
        <div className="cmp">
          <textarea
            id="vc-ask-input"
            rows={3}
            value={v}
            onChange={(e) => setV(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={vercelStegaClean(p.placeholder ?? "")}
            aria-label={vercelStegaClean(p.ariaLabel ?? "") || undefined}
          />
          <div className="cmp-foot">
            <button className="send" type="submit" aria-label={vercelStegaClean(p.sendLabel ?? "")}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
        <div className="chips">
          {(p.chips ?? []).map((c, i) => (
            <button key={c._key ?? i} type="button" className="pill" onClick={() => go(c.text ?? "")}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={CHIP_ICONS[i % CHIP_ICONS.length]} />
              </svg>
              {c.label}
            </button>
          ))}
        </div>
        {p.note && <p className="small">{p.note}</p>}
      </form>
    </div>
  )
}

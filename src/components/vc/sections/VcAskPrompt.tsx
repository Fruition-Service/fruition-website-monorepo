"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { vercelStegaClean } from "@vercel/stega"
import type { VcHeroData } from "../types"

/**
 * The Implementation Calculator hero box. Same behaviour as the box it
 * replaces: the question (typed or a starter) opens the live Calculator at
 * /ask-fruit/workspace?q=...
 */
export default function VcAskPrompt({ p }: { p: NonNullable<VcHeroData["prompt"]> }) {
  const router = useRouter()
  const [v, setV] = useState("")
  const base = vercelStegaClean(p.href ?? "/ask-fruit/workspace")
  const go = (text: string) => router.push(`${base}?q=${encodeURIComponent(vercelStegaClean(text))}`)
  return (
    <div className="hero-art">
      <div className="inner dark">
        <span className="label">{p.label}</span>
        <form
          className="cmp"
          onSubmit={(e) => {
            e.preventDefault()
            const t = v.trim()
            if (t) go(t)
          }}
        >
          <input type="text" value={v} onChange={(e) => setV(e.target.value)} placeholder={vercelStegaClean(p.placeholder ?? "")} aria-label={vercelStegaClean(p.ariaLabel ?? "")} />
          <button className="send" type="submit" aria-label={vercelStegaClean(p.sendLabel ?? "")}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
        <div className="chips">
          {(p.chips ?? []).map((c, i) => (
            <button key={c._key ?? i} type="button" className="pill" onClick={() => go(c.text ?? "")}>
              {c.label}
            </button>
          ))}
        </div>
        {p.note && <p className="small">{p.note}</p>}
      </div>
    </div>
  )
}

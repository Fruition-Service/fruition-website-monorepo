"use client"

import { useState } from "react"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import { useHydrated } from "@/lib/currency/client"
import type { VcFaqTabData } from "../types"

/**
 * Tabbed FAQ from the mock-ups: pill tabs under the heading, numbered
 * questions on the right, the first question of each tab open. Every panel is
 * in the HTML (hidden ones carry `hidden`) so crawlers and the FAQPage JSON-LD
 * see the same questions a visitor can open.
 */
export function VcFaqTabsList({ tabs, active, onPick }: { tabs: VcFaqTabData[]; active: number; onPick: (i: number) => void }) {
  if (tabs.length < 2) return null
  return (
    <div className="tabs fxtabs" role="tablist">
      {tabs.map((t, i) => (
        <button
          key={t._key ?? i}
          type="button"
          role="tab"
          aria-selected={i === active}
          className={i === active ? "on" : ""}
          onClick={() => onPick(i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Answers render as plain paragraphs, list lines included, as in the mock-ups. */
const ANSWER: PortableTextComponents = {
  list: ({ children }) => <>{children}</>,
  // A div, not a <p>: list items can hold nested lists, and <p> cannot nest.
  listItem: ({ children }) => <div className="vc-ans-p">{children}</div>,
}

function Qa({ q, a, n, startOpen }: { q?: string; a?: PortableTextBlock[]; n: number; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <div className={`qa${open ? " open" : ""}`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="label">{String(n).padStart(2, "0")}</span>
        <span>{q}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div className="ans">{a && <PortableText value={a} components={ANSWER} />}</div>
    </div>
  )
}

export default function VcFaqTabs({ badge, heading, tabs }: { badge?: React.ReactNode; heading?: React.ReactNode; tabs: VcFaqTabData[] }) {
  const [active, setActive] = useState(0)
  // Answers quote prices. The display-currency rewrite must not touch their
  // text before this component has hydrated (hydration would then see A$ on
  // the server and S$ in the DOM and regenerate the tree); it converts them
  // once the attribute lifts. See useHydrated.
  const hydrated = useHydrated()
  return (
    <>
      <div>
        {badge}
        {heading}
        <VcFaqTabsList tabs={tabs} active={active} onPick={setActive} />
      </div>
      <div data-currency-skip={hydrated ? undefined : ""}>
        {tabs.map((t, ti) => (
          <div className="fxpanel" key={t._key ?? ti} hidden={ti !== active} role="tabpanel">
            {(t.items ?? []).map((it, i) => (
              <Qa key={`${it._id}-${i}`} q={it.question} a={it.answer} n={i + 1} startOpen={i === 0} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

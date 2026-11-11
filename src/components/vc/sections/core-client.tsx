"use client"

import { useState } from "react"
import { Btn } from "../primitives"
import type { VcServicesData } from "../types"

/** Service price tabs (AI, Atlassian, HubSpot, ...): one panel visible at a time. */
export function VcServiceTabs({ tabs }: { tabs: NonNullable<VcServicesData["tabs"]> }) {
  const [on, setOn] = useState(0)
  return (
    <>
      <div className="tabs svtabs" role="tablist">
        {tabs.map((t, i) => (
          <button key={t._key ?? i} type="button" role="tab" className={i === on ? "on" : ""} aria-selected={i === on} aria-controls={`sv-${i}`} onClick={() => setOn(i)}>
            {t.label}
            <span className="n">{t.rows?.length ?? 0}</span>
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div className="svpanel" id={`sv-${i}`} role="tabpanel" key={t._key ?? i} hidden={i !== on}>
          <div className="sv-intro2">
            {t.kicker && <span className="label">{t.kicker}</span>}
            {t.title && <h3 className="h3">{t.title}</h3>}
            {t.body && <p className="body">{t.body}</p>}
            {t.from && (
              <div className="sv-from">
                {t.fromLabel && <span className="label">{t.fromLabel}</span>}
                <b>{t.from}</b>
              </div>
            )}
            <Btn cta={t.cta} />
          </div>
          <div className="svc-card">
            {(t.rows ?? []).map((r, ri) => (
              <div className="svc" key={r._key ?? ri}>
                <span>
                  {r.name}
                  {r.note && <span className="label">{r.note}</span>}
                </span>
                <b className="price sm">{r.price}</b>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

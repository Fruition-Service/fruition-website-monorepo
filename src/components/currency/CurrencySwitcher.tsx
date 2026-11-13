"use client"

import { useId } from "react"
import { currency, type CurrencyCode } from "@/lib/currency/kit"
import { setDisplayCurrency, useDisplayCurrency } from "@/lib/currency/client"

/**
 * Footer currency control, built from the Claude Design spec "Footer currency
 * switcher.dc.html" (project 0c8f9e21, 13 Nov 2026). Styles live in
 * src/styles/vc/chrome.css under `.vcf .cur`. A native select, so phones use
 * their own picker. The static HTML shows USD; after hydration it shows the
 * detected or chosen currency. Changing it converts every price on the site
 * and is remembered across pages.
 */
export default function CurrencySwitcher() {
  const id = useId()
  const state = useDisplayCurrency()
  const value = state?.code ?? currency.FALLBACK
  return (
    <div className="cur">
      <label htmlFor={id}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        Currency
      </label>
      <div className="cur-box">
        <select id={id} value={value} onChange={(e) => setDisplayCurrency(e.target.value as CurrencyCode)}>
          {currency.CODES.map((c) => (
            <option key={c} value={c}>
              {c} · {currency.CURRENCIES[c].prefix.trim()}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}

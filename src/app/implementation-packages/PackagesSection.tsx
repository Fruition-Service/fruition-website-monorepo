"use client"

import { useState } from "react"
import Link from "next/link"
import { COMPARE_ROWS, PACKAGES, PACKAGES_INTRO, type ImplementationPackage } from "./content"

/*
 * Currency and team switcher, carried over from the previous page. The server
 * render (what crawlers see) is always USD at the US team rate, so the default
 * HTML carries $2,500 / $5,000 / $2,500 per month. Rates and regional multipliers
 * are unchanged from the live switcher; Josh still has to confirm local rates.
 */
type CurrencyCode = "USD" | "AUD" | "SGD" | "GBP" | "EUR"
type TeamCode = "US" | "UK" | "APAC"

const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; locale: string }> = {
  USD: { symbol: "$", rate: 1, locale: "en-US" },
  AUD: { symbol: "A$", rate: 1.52, locale: "en-AU" },
  SGD: { symbol: "S$", rate: 1.34, locale: "en-SG" },
  GBP: { symbol: "£", rate: 0.79, locale: "en-GB" },
  EUR: { symbol: "€", rate: 0.92, locale: "de-DE" },
}
const TEAMS: Record<TeamCode, { label: string; multiplier: number }> = {
  US: { label: "US team", multiplier: 1 },
  UK: { label: "UK team", multiplier: 0.95 },
  APAC: { label: "APAC team", multiplier: 0.85 },
}

function formatPrice(base: number, currency: CurrencyCode, team: TeamCode): string {
  const { rate, locale, symbol } = CURRENCIES[currency]
  const rounded = Math.round((base * TEAMS[team].multiplier * rate) / 100) * 100
  return `${symbol}${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(rounded)}`
}

export default function PackagesSection() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [team, setTeam] = useState<TeamCode>("US")
  const price = (p: ImplementationPackage) => formatPrice(p.basePriceUsd, currency, team)

  return (
    <section id="packages" className="scroll-mt-24 bg-surface-subtle py-14 md:py-24">
      <div className="mx-auto max-w-[1148px] px-4">
        <div className="text-center">
          <p className="mb-[18px] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {PACKAGES_INTRO.eyebrow}
          </p>
          <h2 className="text-section-h2 text-body text-balance">{PACKAGES_INTRO.heading}</h2>
          <p className="text-body-lead mx-auto mt-5 max-w-[62ch] text-muted">{PACKAGES_INTRO.lead}</p>
        </div>

        {/* Switcher */}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 md:flex-row md:items-end">
          <Picker
            id="pkg-currency"
            label="Currency"
            value={currency}
            onChange={(v) => setCurrency(v as CurrencyCode)}
            options={(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => ({ value: c, label: c }))}
          />
          <Picker
            id="pkg-team"
            label="Delivery team"
            value={team}
            onChange={(v) => setTeam(v as TeamCode)}
            options={(Object.keys(TEAMS) as TeamCode[]).map((t) => ({ value: t, label: TEAMS[t].label }))}
          />
        </div>

        {/* Price cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-8"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{p.tag}</p>
              <h3 className="text-card-title mt-3 text-body">{p.name}</h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">{p.team}</p>
              <p className="mt-5 flex flex-wrap items-baseline gap-x-2 border-y border-dashed border-ui py-4 text-body">
                <span className="text-caption text-muted">From</span>
                <span className="text-section-h3 font-semibold" aria-live="polite">
                  {price(p)}
                </span>
                <span className="text-caption text-muted">{p.cadence}</span>
              </p>
              <p className="text-body-sm mt-5 text-muted">
                <b className="font-semibold text-body">Best for:</b> {p.bestFor}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {p.highlights.map((h) => (
                  <li key={h} className="text-body-sm flex gap-2.5 text-body">
                    <Check />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <Link href="#book" className="cta-btn cta-btn-primary w-full">
                  <span className="cta-btn-label">{p.ctaLabel}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* What's included: fold-out under the cards. Closed by default; the
            table is in the HTML either way, so crawlers and Ctrl+F still see it. */}
        <details id="compare" className="group mt-6 scroll-mt-24 rounded-card border border-ui bg-surface-raised">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-body marker:hidden md:px-8 [&::-webkit-details-marker]:hidden">
            <span className="font-semibold">{PACKAGES_INTRO.compareToggle}</span>
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-ui text-brand transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="border-t border-ui px-4 pb-6 pt-5 md:px-8">
            <h3 className="text-card-title text-body">{PACKAGES_INTRO.compareHeading}</h3>
            {/* Mobile: one ledger per package, so nothing hides off to the side. */}
            <div className="mt-5 flex flex-col gap-8 md:hidden">
              {PACKAGES.map((p, col) => (
                <div key={p.id}>
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{p.name}</h4>
                  <dl className="mt-2">
                    {COMPARE_ROWS.map((row) => (
                      <div key={row.label} className="grid grid-cols-[42%_1fr] gap-3 border-b border-dashed border-ui py-2.5">
                        <dt className="text-caption font-semibold text-body">{row.label}</dt>
                        <dd className="text-body-sm text-muted">
                          {row.cells[col] ?? <span className="text-faint">Not included</span>}
                        </dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[42%_1fr] gap-3 py-2.5">
                      <dt className="text-caption font-semibold text-body">Price</dt>
                      <dd className="text-body-sm font-semibold text-body">
                        From {price(p)} {p.cadence}
                      </dd>
                    </div>
                  </dl>
                  <Link href="#book" className="cta-btn cta-btn-outline mt-3 w-full">
                    <span className="cta-btn-label">{p.ctaLabel}</span>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-5 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr>
                    <td className="w-[22%]" />
                    {PACKAGES.map((p) => (
                      <th
                        key={p.id}
                        scope="col"
                        className="px-3 pb-3 align-bottom font-mono text-xs font-semibold uppercase tracking-[0.1em] text-body"
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="border-t border-dashed border-ui">
                      <th scope="row" className="text-caption py-3 pr-3 align-top font-semibold text-body">
                        {row.label}
                      </th>
                      {row.cells.map((cell, i) => (
                        <td key={i} className="text-body-sm px-3 py-3 align-top text-muted">
                          {cell ?? <span className="text-faint">Not included</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-dashed border-ui">
                    <th scope="row" className="text-caption py-3 pr-3 align-top font-semibold text-body">
                      Price
                    </th>
                    {PACKAGES.map((p) => (
                      <td key={p.id} className="text-body-sm px-3 py-3 align-top font-semibold text-body">
                        From {price(p)} {p.cadence}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td />
                    {PACKAGES.map((p) => (
                      <td key={p.id} className="px-3 pt-3">
                        <Link href="#book" className="cta-btn cta-btn-outline w-full">
                          <span className="cta-btn-label">{p.ctaLabel}</span>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </details>

        <p className="text-body-sm mt-6 text-center text-body">
          {PACKAGES_INTRO.enterprise}{" "}
          <Link href="#book" className="font-semibold text-cta-blue-light underline underline-offset-2 hover:text-cta-blue-dark">
            {PACKAGES_INTRO.enterpriseCta}
          </Link>
          .
        </p>
        <p className="text-caption mx-auto mt-4 max-w-[80ch] text-center text-muted">{PACKAGES_INTRO.footnote}</p>
        <p className="text-caption mx-auto mt-3 max-w-[80ch] text-center text-muted">
          These packages price Fruition&apos;s implementation services. To buy or renew monday.com licences, see{" "}
          <Link href="/pricing" className="underline underline-offset-2 hover:text-brand">
            monday.com licence procurement
          </Link>
          . Looking for a consultant rather than a package? Meet our{" "}
          <Link href="/monday-implementation-consultants" className="underline underline-offset-2 hover:text-brand">
            monday.com implementation consultants
          </Link>
          .
        </p>
      </div>
    </section>
  )
}

function Picker({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div className="flex flex-col gap-1.5 md:w-[200px]">
      <label htmlFor={id} className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="form-field min-h-[44px]">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

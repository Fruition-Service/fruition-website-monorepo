"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { PricingSectionCopy } from "@/data/practicePages/types"
import {
  CURRENCIES,
  PACKAGE_FIT_ROWS,
  REGIONS,
  REGION_AREA_LABELS,
  type CurrencyCode,
  type PackageTierView,
  type RegionCode,
} from "@/data/pricing/packages"

/**
 * Implementation package price cards for /pricing (anchor #packages): tier
 * cards with an indicative currency and team-region switcher, the "which
 * package fits" ledger, and a handoff to /implementation-packages for how
 * delivery works.
 */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`text-brand transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Check({ className }: { className: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 11 11" fill="none" aria-hidden className={`mt-1 shrink-0 ${className}`}>
      <path d="M1.5 5.6l2.6 2.6L9.5 2.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Dropdown<T extends string>({
  tag,
  value,
  selected,
  options,
  open,
  onToggle,
  onSelect,
}: {
  tag: string
  value: string
  selected: T
  options: { code: T; label: string; hint: string }[]
  open: boolean
  onToggle: () => void
  onSelect: (code: T) => void
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-pill border bg-surface-raised pl-4 pr-3.5 text-sm font-semibold text-body transition-colors hover:border-brand ${
          open ? "border-brand" : "border-ui"
        }`}
      >
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{tag}</span>
        <span>{value}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 min-w-[180px] rounded-chip border border-ui bg-surface-raised p-1.5 shadow-card">
          {options.map((o) => {
            const active = o.code === selected
            return (
              <button
                key={o.code}
                type="button"
                onClick={() => onSelect(o.code)}
                className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-chip px-3.5 text-left text-sm ${
                  active ? "bg-brand-soft font-semibold text-brand" : "font-medium text-body hover:text-brand"
                }`}
              >
                <span>{o.label}</span>
                <span className="text-xs font-normal text-muted">{o.hint}</span>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

export default function PackagePricingSection({
  copy,
  tiers,
  ctaHref,
}: {
  copy: PricingSectionCopy
  tiers: PackageTierView[]
  ctaHref: string
}) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [region, setRegion] = useState<RegionCode>("US")
  const [openMenu, setOpenMenu] = useState<"currency" | "region" | null>(null)
  const togglesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (togglesRef.current && !togglesRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const formatPrice = (base: number): string => {
    const { rate, locale, symbol } = CURRENCIES[currency]
    const adjusted = base * REGIONS[region].multiplier * rate
    const rounded = Math.round(adjusted / 100) * 100
    const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(rounded)
    return `${symbol}${formatted}`
  }

  const hasPricedTier = tiers.some((t) => t.basePrice !== undefined)

  return (
    <section id="packages" className="scroll-mt-24 border-b border-ui">
      <div className="max-w-[1148px] mx-auto px-4 py-14 md:py-24">
        {/* Header: copy left, indicative currency and region switches right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
              {copy.eyebrow}
            </p>
            <h2 className="text-section-h2">{copy.heading}</h2>
            <p className="mt-4 text-body-lead text-muted">{copy.subheading}</p>
          </div>

          {hasPricedTier && (
            <div ref={togglesRef} className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Dropdown<CurrencyCode>
                  tag="Currency"
                  value={`${CURRENCIES[currency].symbol} ${CURRENCIES[currency].label}`}
                  selected={currency}
                  options={(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => ({
                    code,
                    label: CURRENCIES[code].label,
                    hint: CURRENCIES[code].symbol,
                  }))}
                  open={openMenu === "currency"}
                  onToggle={() => setOpenMenu((m) => (m === "currency" ? null : "currency"))}
                  onSelect={(code) => {
                    setCurrency(code)
                    setOpenMenu(null)
                  }}
                />
              </div>
              <div className="relative">
                <Dropdown<RegionCode>
                  tag="Team"
                  value={REGIONS[region].label}
                  selected={region}
                  options={(Object.keys(REGIONS) as RegionCode[]).map((code) => ({
                    code,
                    label: REGIONS[code].label,
                    hint: REGION_AREA_LABELS[code],
                  }))}
                  open={openMenu === "region"}
                  onToggle={() => setOpenMenu((m) => (m === "region" ? null : "region"))}
                  onSelect={(code) => {
                    setRegion(code)
                    setOpenMenu(null)
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tier cards */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const featured = tier.featured
            return (
              <div
                key={tier.name}
                className={`flex flex-col rounded-card p-6 md:p-8 ${
                  featured
                    ? "bg-gradient-to-br from-brand to-brand-dark text-white shadow-card lg:-translate-y-3"
                    : "border border-ui bg-surface-raised text-body shadow-whisper"
                }`}
              >
                <h3 className={`text-card-title ${featured ? "text-white" : "text-body"}`}>{tier.name}</h3>
                {/* Two lines reserved from lg up (three across) so every price block starts at the same y */}
                <p className={`mt-1 text-sm lg:min-h-[2lh] ${featured ? "text-white/80" : "text-muted"}`}>{tier.hours}</p>

                {/* Price block: shared min height from lg, content pinned to the bottom. The line
                    box is struck in the 40px mono figure size in both variants, so the
                    figure and the "Custom quote" label share one baseline. */}
                <div className="mt-5 flex flex-col justify-end lg:min-h-10">
                  <p className="font-mono text-[32px] leading-none md:text-[40px]">
                    {tier.basePrice !== undefined ? (
                      <>
                        {tier.pricePrefix && (
                          <span
                            className={`mr-1.5 font-sans text-base font-medium ${featured ? "text-white/85" : "text-muted"}`}
                          >
                            {tier.pricePrefix}
                          </span>
                        )}
                        <span
                          className={`font-semibold tabular-nums tracking-[-0.02em] ${
                            featured ? "text-white" : "text-ink"
                          }`}
                        >
                          {formatPrice(tier.basePrice)}
                        </span>
                      </>
                    ) : (
                      <span
                        className={`font-sans text-[26px] font-semibold leading-none tracking-[-0.02em] md:text-[28px] ${
                          featured ? "text-white" : "text-ink"
                        }`}
                      >
                        {tier.priceLabel || "Custom quote"}
                      </span>
                    )}
                  </p>
                </div>
                <p className={`mt-2 font-mono text-xs ${featured ? "text-white/70" : "text-muted"}`}>
                  {tier.basePrice !== undefined
                    ? `${CURRENCIES[currency].label} · ${REGIONS[region].label} team rate`
                    : "Scoped to your requirements"}
                </p>

                <div className={`my-6 h-px ${featured ? "bg-white/20" : "bg-ui"}`} />

                <ul className="flex flex-col gap-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-normal">
                      <Check className={featured ? "text-white" : "text-brand"} />
                      <span className={featured ? "text-white/95" : "text-body"}>{f}</span>
                    </li>
                  ))}
                </ul>

                {tier.bestFor && (
                  <p className={`mt-6 text-sm leading-relaxed ${featured ? "text-white/80" : "text-muted"}`}>
                    <span className={`font-semibold ${featured ? "text-white" : "text-body"}`}>Best for: </span>
                    {tier.bestFor}
                  </p>
                )}

                <div className="mt-auto pt-7">
                  <Link
                    href={ctaHref}
                    className={`flex min-h-12 items-center justify-center rounded-pill px-5 text-center text-sm font-semibold ${
                      featured
                        ? "bg-surface-raised text-brand hover:bg-brand-soft"
                        : "bg-gradient-to-r from-brand to-brand-light text-white hover:from-brand-dark hover:to-brand"
                    }`}
                  >
                    {tier.ctaLabel || (tier.basePrice !== undefined ? "Get started" : "Contact sales")}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Which package fits: dashed ledger */}
        <div className="mt-14 md:mt-20">
          <h3 className="text-card-title mb-4">{copy.comparisonHeading}</h3>
          <ul>
            {PACKAGE_FIT_ROWS.map((row) => (
              <li
                key={row.tier}
                className="flex flex-col gap-1 border-t border-dashed border-ui py-4 md:flex-row md:items-baseline md:justify-between md:gap-8"
              >
                <div className="md:max-w-[640px]">
                  <p className="font-medium text-body">{row.situation}</p>
                  <p className="mt-1 text-sm text-muted">{row.when}</p>
                </div>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand md:shrink-0 md:text-right">
                  {row.tier}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 max-w-[760px] text-xs text-muted leading-relaxed">{copy.footnote}</p>

        {/* Handoff to the delivery page */}
        <p className="mt-6 text-sm text-body">
          {copy.deliveryHandoff.text}{" "}
          <Link
            href={copy.deliveryHandoff.href}
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-brand underline-offset-4 hover:underline"
          >
            {copy.deliveryHandoff.label} <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </section>
  )
}

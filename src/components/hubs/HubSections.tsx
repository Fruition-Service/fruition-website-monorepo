import Link from 'next/link'
import type { ReactNode } from 'react'
import { NavIcon } from '@/components/common/icons/NavIcons'

/**
 * Building blocks for the three hub pages that sit under the v3 menu
 * (/partnerships, /industries, /customer-testimonials). Section structure and
 * copy follow Josh's navigation prototype; the styling is this design system's.
 */

export function HubEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{children}</p>
  )
}

export function HubHero({
  eyebrow,
  heading,
  accent,
  lead,
  facts = [],
}: {
  eyebrow: string
  heading: string
  /** Trailing words of the H1, set in the accent colour. */
  accent?: string
  lead: string
  facts?: string[]
}) {
  return (
    <section className="hero-band">
      <div className="site-container pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-14 lg:pb-20">
        <div
          className={`grid grid-cols-1 gap-8 lg:items-center ${
            facts.length > 0 ? 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16' : ''
          }`}
        >
          <div className="min-w-0">
            <span className="mb-5 inline-flex items-center rounded-full bg-brand-soft px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {eyebrow}
            </span>
            <h1 className="text-display max-w-[860px]">
              {heading}
              {accent && (
                <>
                  {' '}
                  <span className="text-brand">{accent}</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-[64ch] text-body-lead text-muted">{lead}</p>
          </div>
          {facts.length > 0 && (
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0 lg:divide-y lg:divide-dashed lg:divide-ui lg:rounded-card lg:bg-surface-raised lg:px-6 lg:py-2 lg:shadow-whisper lg:ring-1 lg:ring-ui">
              {facts.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-ui bg-surface-raised px-3.5 py-1.5 text-[13px] font-semibold text-body lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-3.5 lg:text-[15px]"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export function HubSection({
  id,
  eyebrow,
  heading,
  lede,
  subtle = false,
  children,
}: {
  id?: string
  eyebrow?: string
  heading: string
  lede?: string
  subtle?: boolean
  children: ReactNode
}) {
  return (
    <section id={id} className={`border-b border-ui ${subtle ? 'bg-surface-subtle' : ''}`}>
      <div className="site-container section-y">
        {eyebrow && <HubEyebrow>{eyebrow}</HubEyebrow>}
        <h2 className="text-section-h2">{heading}</h2>
        {lede && <p className="mt-4 max-w-[64ch] text-body-lead text-muted">{lede}</p>}
        <div className="mt-8 md:mt-10">{children}</div>
      </div>
    </section>
  )
}

export interface HubCard {
  title: string
  href: string
  /** Mono label above the title, e.g. "AI platform" or "Featured". */
  group?: string
  badge?: string
  body: string
  links?: { label: string; href: string }[]
  cta: string
  icon?: string
}

const GRID_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}

export function HubCardGrid({ cards, columns = 3 }: { cards: HubCard[]; columns?: 2 | 3 | 4 }) {
  return (
    <div className={`grid grid-cols-1 gap-5 ${GRID_COLS[columns]}`}>
      {cards.map((c) => (
        <article
          key={c.href}
          className="flex flex-col rounded-card bg-surface-raised p-6 ring-1 ring-ui shadow-whisper transition-shadow hover:ring-brand"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {c.group && (
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{c.group}</p>
              )}
              <h3 className="text-card-title mt-1.5">{c.title}</h3>
            </div>
            {(c.icon || c.href) && (
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-badge text-brand ring-1 ring-ui"
              >
                <NavIcon iconKey={c.icon} href={c.href} className="h-5 w-5" />
              </span>
            )}
          </div>
          {c.badge && (
            <span className="mt-3 self-start rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">
              {c.badge}
            </span>
          )}
          <p className="mt-3 text-body-sm text-muted">{c.body}</p>
          {c.links && c.links.length > 0 && (
            <ul className="mt-4 text-sm">
              {c.links.map((l) => (
                <li key={l.href} className="border-t border-ui">
                  <Link href={l.href} className="block py-2.5 font-semibold text-brand hover:text-brand-dark">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={c.href}
            className="mt-auto pt-5 text-sm font-semibold text-cta-blue-light hover:text-cta-blue-dark"
          >
            {c.cta}
          </Link>
        </article>
      ))}
    </div>
  )
}

export function HubChips({ chips }: { chips: { label: string; href: string; primary?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <li key={c.href}>
          <Link
            href={c.href}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-[13px] font-semibold transition-colors ${
              c.primary
                ? 'bg-brand text-white hover:bg-brand-dark'
                : 'border border-ui bg-surface-raised text-body hover:border-brand hover:text-brand'
            }`}
          >
            {c.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Dark call-to-action panel ("Not sure which platform fits?"). */
export function HubPickPanel({
  heading,
  body,
  primary,
  secondary,
}: {
  heading: string
  body: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section className="border-b border-ui">
      <div className="site-container section-y">
        <div className="grid gap-6 rounded-card bg-surface-dark p-8 text-white md:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <h2 className="text-card-title text-white">{heading}</h2>
            <p className="mt-2 text-white/80">{body}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {/* Same tab: InPageBookingLinks scrolls a #book link to this page's own booking section. */}
            <a href={primary.href} className="cta-btn cta-btn-on-dark-primary h-12 px-6 text-sm">
              {primary.label}
            </a>
            {secondary && (
              <Link href={secondary.href} className="cta-btn cta-btn-on-dark-outline h-12 px-6 text-sm">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"
import { bookingHref, bookingHrefForPath } from "@/lib/bookingLink"
import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import PaperPlaneIcon from '@/components/common/icons/PaperPlaneIcon'
import { NavIcon } from '@/components/common/icons/NavIcons'
import RegionalCallPopover, { MobileCallList, type CallOffice } from '@/components/RegionalCallPopover'

interface NavLink {
  label?: string
  href?: string
  description?: string
  icon?: string
  /** Short partner-tier pill after the label, e.g. "Platinum". */
  tier?: string
  featured?: boolean
}

interface NavSubSection {
  heading?: string
  /** Partner mark shown beside the heading (path under /public). */
  logo?: string
  items?: NavLink[]
  columns?: number
  highlight?: boolean
  badge?: string
}

interface NavFeature {
  kicker?: string
  quote?: string
  attribution?: string
  label?: string
  href?: string
}

interface NavItem {
  label?: string
  href?: string
  layout?: 'stacked' | 'columns'
  sections?: NavSubSection[]
  footerNote?: string
  footerLinks?: { label?: string; href?: string }[]
  feature?: NavFeature
}

interface PartnerBadge {
  name?: string
  image?: unknown
  width?: number
  height?: number
}

interface SiteSettingsProp {
  phone?: string
  calendlyLink?: string
  logo?: unknown
  navigation?: NavItem[]
  navbarPartnerBadges?: PartnerBadge[]
  navbarCtaLabel?: string
  offices?: CallOffice[]
}

/** Grid columns for the links inside a section. */
const ITEM_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

/** A section's share of the dropdown width in the "columns" layout. */
const SECTION_GROW: Record<number, string> = {
  1: 'flex-1',
  2: 'flex-[2]',
  3: 'flex-[3]',
}

/** How long the pointer may leave a tab or its dropdown before it closes. */
const HOVER_CLOSE_MS = 180
/** A click this soon after hover-open keeps the dropdown open instead of closing it. */
const HOVER_CLICK_GRACE_MS = 400

const panelId = (label?: string) => `nav-panel-${(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

const isDropdown = (item: NavItem) => !!item.sections?.length

/**
 * Site header. Every dropdown is rendered into the HTML on the server and only
 * shown or hidden on the client, so crawlers and AI agents can follow every
 * menu link without running JavaScript. Dropdowns open on hover or click and
 * close on Esc, an outside click or navigation; the mobile menu is a list of
 * native details/summary disclosures.
 */
export default function Navbar({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverOpenedAt = useRef(0)

  // Path-aware: on the location pages the booking form is on the page itself,
  // so the header CTA points at this page's own #book rather than /contact-us.
  const calendlyUrl = siteSettings?.calendlyLink
    ? bookingHrefForPath(siteSettings.calendlyLink, pathname)
    : ''
  const phoneAu = siteSettings?.phone
  const navItems: NavItem[] = siteSettings?.navigation || []
  const ctaLabel = siteSettings?.navbarCtaLabel || ''
  const offices: CallOffice[] = siteSettings?.offices || []

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpenMenu(null), HOVER_CLOSE_MS)
  }
  const openOnHover = (label: string) => {
    cancelClose()
    setOpenMenu((current) => {
      if (current !== label) hoverOpenedAt.current = Date.now()
      return label
    })
  }
  const toggleOnClick = (label: string) => {
    cancelClose()
    setOpenMenu((current) => {
      if (current === label && Date.now() - hoverOpenedAt.current > HOVER_CLICK_GRACE_MS) return null
      hoverOpenedAt.current = 0
      return label
    })
  }

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  // Close everything on navigation (state adjusted during render, not in an effect).
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpenMenu(null)
    setMobileOpen(false)
  }

  // Esc closes and returns focus to the tab; a click outside the header closes.
  useEffect(() => {
    if (!openMenu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const tab = navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="${panelId(openMenu)}"]`)
      setOpenMenu(null)
      tab?.focus()
    }
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [openMenu])

  useEffect(() => () => cancelClose(), [])

  const isNavItemActive = (item: NavItem) =>
    item.sections?.some((s) => s.items?.some((link) => link.href && pathname === link.href)) ?? false

  return (
    <nav ref={navRef} aria-label="Primary" className="bg-surface sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-[1348px] px-4 w-full">
        <div className="flex justify-between items-center gap-4 h-[85px]">
          {/* Logo — black on light, white in dark mode (prefers-color-scheme) */}
          <Link href="/" className="shrink-0" aria-label="Fruition home">
            <Image
              src="/images/logo-fruition-black.svg"
              alt="Fruition Services"
              width={1366}
              height={280}
              className="h-8 w-auto -translate-y-0.5 block dark:hidden"
              priority
              unoptimized
            />
            <Image
              src="/images/logo-fruition-white.svg"
              alt="Fruition Services"
              width={1366}
              height={280}
              className="h-8 w-auto -translate-y-0.5 hidden dark:block"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop tabs */}
          <div className="hidden lg:flex items-center gap-3">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const label = item.label || ''
                if (!isDropdown(item)) {
                  const linkActive = pathname === item.href
                  return (
                    <li key={label} onMouseEnter={scheduleClose}>
                      <Link
                        href={bookingHref(item.href)}
                        aria-current={linkActive ? 'page' : undefined}
                        className={`block rounded-badge px-3.5 py-2 text-[15px] font-medium whitespace-nowrap transition-colors hover:bg-tint hover:text-brand ${
                          linkActive ? 'text-brand' : 'text-body'
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                }
                const open = openMenu === label
                const active = isNavItemActive(item)
                return (
                  <li key={label} onMouseEnter={() => openOnHover(label)} onMouseLeave={scheduleClose}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId(label)}
                      onClick={() => toggleOnClick(label)}
                      className={`flex items-center gap-1.5 rounded-badge px-3.5 py-2 text-[15px] font-medium whitespace-nowrap transition-colors hover:bg-tint hover:text-brand ${
                        open ? 'bg-tint text-brand' : active ? 'text-brand' : 'text-body'
                      }`}
                    >
                      {label}
                      <svg
                        aria-hidden
                        className={`shrink-0 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Phone + CTA */}
            <div className="flex items-center gap-2 border-l border-ui pl-3" onMouseEnter={scheduleClose}>
              {/* Opens the regional numbers rather than dialling the Sydney
                  office for every visitor. */}
              <RegionalCallPopover offices={offices} fallbackPhone={phoneAu} />

              {ctaLabel && calendlyUrl && (
                // Same tab: a `target` opts out of InPageBookingLinks, so on a
                // page with its own #book this opened /contact-us in a new tab.
                <a
                  href={calendlyUrl}
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-cta-blue to-cta-blue-light hover:bg-cta-blue-dark hover:bg-none text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-md"
                >
                  <PaperPlaneIcon size={16} />
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center text-body"
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileOpen ? (
              <svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu: one native disclosure per dropdown tab */}
        {mobileOpen && (
          <div id="nav-mobile" className="lg:hidden border-t border-ui max-h-[calc(100vh-85px)] overflow-y-auto pb-8">
            {navItems.map((item) => {
              const label = item.label || ''
              if (!isDropdown(item)) {
                return (
                  <Link
                    key={label}
                    href={bookingHref(item.href)}
                    onClick={closeMobile}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`block border-b border-ui px-2 py-4 text-[17px] font-semibold ${
                      pathname === item.href ? 'text-brand' : 'text-body'
                    }`}
                  >
                    {label}
                  </Link>
                )
              }
              return (
                <details key={label} className="group border-b border-ui">
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between px-2 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden ${
                      isNavItemActive(item) ? 'text-brand' : 'text-body'
                    }`}
                  >
                    {label}
                    <svg
                      aria-hidden
                      className="shrink-0 text-brand transition-transform duration-200 group-open:rotate-180"
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="pb-3">
                    {item.sections?.map((section, sIdx) => (
                      <div key={`${section.heading}-${sIdx}`} className="mb-2">
                        {section.heading && (
                          <p className="px-2 pt-2 pb-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                            {section.heading}
                          </p>
                        )}
                        {section.items?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={bookingHref(sub.href || '#')}
                            onClick={closeMobile}
                            aria-current={pathname === sub.href ? 'page' : undefined}
                            className={`flex min-h-11 items-center gap-3 rounded-badge px-2 py-2.5 text-[15px] ${
                              pathname === sub.href ? 'bg-tint text-brand' : 'text-body'
                            }`}
                          >
                            {sub.label}
                            {sub.tier && <TierPill>{sub.tier}</TierPill>}
                          </Link>
                        ))}
                      </div>
                    ))}
                    {item.footerLinks?.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href || '#'}
                        onClick={closeMobile}
                        className="flex min-h-11 items-center px-2 py-2.5 text-[15px] font-semibold text-brand"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </details>
              )
            })}
            {ctaLabel && calendlyUrl && (
              <a
                href={calendlyUrl}
                onClick={closeMobile}
                className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-cta-blue to-cta-blue-light hover:bg-cta-blue-dark hover:bg-none text-white text-center px-6 py-3 rounded-full text-sm font-semibold transition-colors"
              >
                <PaperPlaneIcon size={16} />
                {ctaLabel}
              </a>
            )}

            {/* Regional numbers — the phone icon is desktop-only, and calling is
                the more likely action on a phone. */}
            <MobileCallList offices={offices} fallbackPhone={phoneAu} onNavigate={closeMobile} />
          </div>
        )}
      </div>

      {/* Desktop dropdowns. All of them are in the HTML; only the open one shows. */}
      {navItems.filter(isDropdown).map((item) => {
        const label = item.label || ''
        const open = openMenu === label
        const columnsLayout = item.layout === 'columns'
        return (
          <div
            key={label}
            id={panelId(label)}
            role="region"
            aria-label={label}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className={`${open ? 'hidden lg:block' : 'hidden'} absolute left-0 right-0 top-full border-t border-ui bg-surface-raised shadow-lg z-50`}
          >
            <div className="max-w-[1348px] mx-auto px-4 pt-8 pb-6">
              <div className={columnsLayout ? 'flex flex-row items-stretch gap-8' : 'flex flex-col gap-6'}>
                {item.sections?.map((section, sIdx) => {
                  const cols = section.columns ?? (columnsLayout ? 1 : 3)
                  return (
                    <div
                      key={`${section.heading}-${sIdx}`}
                      className={`min-w-0 ${columnsLayout ? SECTION_GROW[cols] ?? 'flex-1' : ''}`}
                    >
                      {section.heading && (
                        <p className="mb-3 border-b border-ui pb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          {/* Fixed row height (the partner logo's) so headings with
                              and without a logo share one baseline and one rule. */}
                          <span className="flex items-center gap-2 min-h-[26px]">
                            {section.heading}
                            {section.logo ? (
                              <Image
                                src={section.logo}
                                alt={section.badge ?? ''}
                                width={150}
                                height={38}
                                className="h-[26px] w-auto shrink-0 rounded-[4px] object-contain"
                                unoptimized
                              />
                            ) : (
                              section.badge && <TierPill>{section.badge}</TierPill>
                            )}
                          </span>
                        </p>
                      )}
                      <div className={`grid gap-x-6 gap-y-1 ${ITEM_COLS[cols] ?? 'grid-cols-1'}`}>
                        {section.items?.map((sub) => {
                          const isActive = sub.href && pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              href={bookingHref(sub.href || '#')}
                              aria-current={isActive ? 'page' : undefined}
                              className={`group flex ${sub.description ? 'items-start' : 'items-center'} gap-3 rounded-badge p-2.5 -mx-2.5 transition-colors ${
                                isActive ? 'bg-tint' : 'hover:bg-tint'
                              }`}
                              onClick={() => setOpenMenu(null)}
                            >
                              <span
                                aria-hidden
                                className={`shrink-0 ${sub.description ? 'mt-0.5' : ''} w-9 h-9 rounded-badge ring-1 bg-surface-raised flex items-center justify-center transition-colors ${
                                  isActive || sub.featured
                                    ? 'text-brand ring-brand/30'
                                    : 'text-body ring-ui group-hover:text-brand group-hover:ring-brand/30'
                                }`}
                              >
                                {sub.icon || sub.href ? (
                                  <NavIcon iconKey={sub.icon} href={sub.href} className="h-[18px] w-[18px]" />
                                ) : (
                                  <span className="block h-2 w-2 rounded-full bg-ui" />
                                )}
                              </span>
                              <span className="min-w-0">
                                <span
                                  className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm font-semibold leading-tight ${
                                    isActive || sub.featured ? 'text-brand' : 'text-body group-hover:text-brand'
                                  }`}
                                >
                                  {sub.label}
                                  {sub.tier && <TierPill>{sub.tier}</TierPill>}
                                </span>
                                {sub.description && (
                                  <span className="mt-1 block text-xs text-muted leading-snug">{sub.description}</span>
                                )}
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

                {item.feature?.quote && (
                  <figure className="flex-1 min-w-0 rounded-card bg-tint p-6 flex flex-col">
                    {item.feature.kicker && (
                      <figcaption className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                        {item.feature.kicker}
                      </figcaption>
                    )}
                    <blockquote className="mt-3 text-[15px] italic leading-relaxed text-body">
                      &ldquo;{item.feature.quote}&rdquo;
                    </blockquote>
                    {item.feature.attribution && (
                      <p className="mt-3 text-xs text-muted">{item.feature.attribution}</p>
                    )}
                    {item.feature.href && item.feature.label && (
                      <Link
                        href={item.feature.href}
                        onClick={() => setOpenMenu(null)}
                        className="mt-auto pt-4 text-sm font-semibold text-brand hover:text-brand-dark"
                      >
                        {item.feature.label}
                      </Link>
                    )}
                  </figure>
                )}
              </div>

              {(item.footerNote || item.footerLinks?.length) && (
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ui pt-4 text-sm">
                  {item.footerNote && <p className="mr-auto text-muted">{item.footerNote}</p>}
                  {item.footerLinks?.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href || '#'}
                      onClick={() => setOpenMenu(null)}
                      className="font-semibold text-brand hover:text-brand-dark"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </nav>
  )
}

function TierPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-px font-mono text-[10px] font-semibold uppercase tracking-wider text-brand whitespace-nowrap">
      {children}
    </span>
  )
}

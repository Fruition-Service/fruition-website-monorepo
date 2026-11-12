"use client"
import { bookingHref, bookingHrefForPath } from "@/lib/bookingLink"
import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { vercelStegaClean } from '@vercel/stega'
import { NavIcon } from '@/components/common/icons/NavIcons'
import RegionalCallPopover, { MobileCallList, type CallOffice } from '@/components/RegionalCallPopover'
import { urlFor } from '@/sanity/image'

interface NavLink {
  label?: string
  href?: string
  description?: string
  /** Mark shown beside the link, a Sanity image (SVG or PNG) in its own colours. */
  logo?: unknown
  /** Fallback line icon, used only when there is no logo. */
  icon?: string
  /** Short partner-tier pill after the label, e.g. "Platinum". */
  tier?: string
}

interface NavSubSection {
  heading?: string
  /** Item columns inside the section (1 to 3). */
  columns?: number
  /** The section's share of the dropdown width (1 to 3). */
  grow?: number
  items?: NavLink[]
}

interface NavFeature {
  kicker?: string
  quote?: string
  /** Render the quote as a plain blurb, without quotation marks. */
  plain?: boolean
  attribution?: string
  /** Client logo: turns the card into a case study card. */
  logo?: unknown
  /** Headshot of the person quoted. */
  image?: unknown
  /** Up to two headline results, e.g. 17x / ROI. */
  metrics?: { value?: string; label?: string }[]
  label?: string
  href?: string
}

interface NavItem {
  label?: string
  href?: string
  sections?: NavSubSection[]
  footerNote?: string
  footerLinks?: { label?: string; href?: string }[]
  feature?: NavFeature
}

interface SiteSettingsProp {
  phone?: string
  calendlyLink?: string
  navigation?: NavItem[]
  navbarCtaLabel?: string
  offices?: CallOffice[]
}

/** How long the pointer may leave a tab or its dropdown before it closes. */
const HOVER_CLOSE_MS = 180
/** A click this soon after hover-open keeps the dropdown open instead of closing it. */
const HOVER_CLICK_GRACE_MS = 400

const panelId = (label?: string) => `nav-panel-${vercelStegaClean(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

const isDropdown = (item: NavItem) => !!item.sections?.length

/** Small Sanity numbers (1 to 3) to the CSS classes that size a column or grid. */
const clamp3 = (n: number | undefined, fallback: number) => Math.min(3, Math.max(1, Math.round(n || fallback)))

/** SVG or PNG straight from the Sanity CDN; 3x the 18px display size keeps PNGs sharp. */
function logoSrc(logo: unknown, width = 72): string | null {
  if (!logo) return null
  try {
    return urlFor(logo).width(width).url()
  } catch {
    return null
  }
}

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function Pill({ children }: { children?: string }) {
  return children ? <span className="nd-pill">{children}</span> : null
}

function ItemMark({ link }: { link: NavLink }) {
  const src = logoSrc(link.logo)
  if (src) return <Image src={src} alt="" width={18} height={18} unoptimized />
  if (link.icon || link.href) return <NavIcon iconKey={link.icon} href={link.href} className="h-[18px] w-[18px]" />
  return null
}

/**
 * The dropdown's last column as a case study: client logo, the quote, the
 * person quoted with their headshot, up to two headline figures and a link.
 */
function CaseStudyCard({ feature, onNavigate }: { feature: NavFeature; onNavigate: () => void }) {
  const logo = logoSrc(feature.logo, 360)
  const photo = logoSrc(feature.image, 96)
  const metrics = (feature.metrics || []).filter((m) => m.value).slice(0, 2)
  return (
    <figure className="nd-feat nd-case">
      <div className="nd-case-top">
        {feature.kicker && <figcaption>{feature.kicker}</figcaption>}
        {logo && <Image className="nd-case-logo" src={logo} alt="" width={120} height={40} unoptimized />}
      </div>
      <blockquote>{feature.plain ? feature.quote : <>&ldquo;{feature.quote}&rdquo;</>}</blockquote>
      {(feature.attribution || photo) && (
        <div className="nd-case-who">
          {photo && <Image src={photo} alt="" width={36} height={36} unoptimized />}
          {feature.attribution && <p className="nd-who">{feature.attribution}</p>}
        </div>
      )}
      {metrics.length > 0 && (
        <dl className="nd-case-stats">
          {metrics.map((m, i) => (
            <div key={`${m.value}-${i}`}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {feature.href && feature.label && (
        <Link prefetch={false} href={feature.href} className="nd-fl-a" onClick={onNavigate}>
          {feature.label} <span aria-hidden>&rarr;</span>
        </Link>
      )}
    </figure>
  )
}

/**
 * Site header (Version C): announcement bar sits above it, then the tabs,
 * dropdowns, regional call popover, booking CTA and the mobile sheet. Every
 * dropdown is rendered into the HTML on the server and only shown or hidden
 * on the client, so crawlers and AI agents can follow every menu link without
 * running JavaScript. Dropdowns open on hover or click and close on Esc, an
 * outside click, focus leaving them or navigation; the mobile sheet is a list
 * of native details/summary disclosures.
 *
 * All text is a plain Sanity text node (siteSettings.navigation) so the inline
 * editor can click it. Styles: src/styles/vc/chrome.css, scoped under `.vcn`.
 */
export default function Navbar({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  // The dropdown item under the pointer or focus. Its description replaces the
  // panel's bottom note so the columns never move.
  const [hovered, setHovered] = useState<NavLink | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Event timestamp (ms since page load) of the hover that last opened a dropdown.
  const hoverOpenedAt = useRef(-Infinity)

  // Path-aware: on the location pages the booking form is on the page itself,
  // so the header CTA points at this page's own #book rather than /contact-us.
  // Same tab, never target=_blank: InPageBookingLinks only scrolls for that.
  const calendlyUrl = siteSettings?.calendlyLink
    ? bookingHrefForPath(siteSettings.calendlyLink, pathname)
    : ''
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
  // Handlers read `openMenu` from this render's closure and keep their state
  // updaters pure: React runs updaters twice in dev, so a ref write inside one
  // would make the second run disagree with the first.
  const openOnHover = (label: string, at: number) => {
    cancelClose()
    if (openMenu !== label) hoverOpenedAt.current = at
    setOpenMenu(label)
  }
  const toggleOnClick = (label: string, at: number) => {
    cancelClose()
    const justHoverOpened = at - hoverOpenedAt.current <= HOVER_CLICK_GRACE_MS
    hoverOpenedAt.current = -Infinity
    setOpenMenu((current) => (current === label && !justHoverOpened ? null : label))
  }
  const focusFirstLink = (label: string) => {
    requestAnimationFrame(() => {
      document.getElementById(panelId(label))?.querySelector<HTMLAnchorElement>('a[href]')?.focus()
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

  // Esc closes and returns focus to what opened it; a click outside the header closes.
  const anyOpen = openMenu !== null || mobileOpen
  useEffect(() => {
    if (!anyOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (openMenu) {
        const tab = headerRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="${panelId(openMenu)}"]`)
        setOpenMenu(null)
        tab?.focus()
      }
      if (mobileOpen) {
        setMobileOpen(false)
        burgerRef.current?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [anyOpen, openMenu, mobileOpen])

  useEffect(() => () => cancelClose(), [])

  const isNavItemActive = (item: NavItem) =>
    item.sections?.some((s) => s.items?.some((link) => link.href && pathname === link.href)) ?? false

  const cta = (extra: string, onClick?: () => void) =>
    ctaLabel && calendlyUrl ? (
      <a href={calendlyUrl} onClick={onClick} className={`btn ${extra}`}>
        <span className="roll">
          <span>{ctaLabel}</span>
          <span aria-hidden>{vercelStegaClean(ctaLabel)}</span>
        </span>
      </a>
    ) : null

  return (
    <header ref={headerRef} className="vcn">
      <div className="wrap">
        <Link prefetch={false} href="/" className="nav-logo" aria-label="Fruition home">
          <Image
            src="/images/logo-fruition-black.svg"
            alt="Fruition Services"
            width={1366}
            height={280}
            priority
            unoptimized
          />
        </Link>

        <nav aria-label="Primary">
          <ul className="nd-tabs">
            {navItems.map((item) => {
              const label = item.label || ''
              if (!isDropdown(item)) {
                return (
                  <li key={label} onMouseEnter={scheduleClose}>
                    <Link
                      href={bookingHref(item.href)}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      className="nd-tab"
                    >
                      {label}
                    </Link>
                  </li>
                )
              }
              const open = openMenu === label
              return (
                <li
                  key={label}
                  className={`nd-item${open ? ' open' : ''}`}
                  onMouseEnter={(e) => openOnHover(label, e.timeStamp)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className="nd-tab"
                    aria-expanded={open}
                    aria-controls={panelId(label)}
                    aria-current={isNavItemActive(item) ? 'true' : undefined}
                    onClick={(e) => {
                      toggleOnClick(label, e.timeStamp)
                      // A keyboard activation (detail 0) moves focus into the
                      // panel: the panels sit at the end of the header's DOM,
                      // so Tab would otherwise walk every other tab first.
                      if (e.detail === 0) focusFirstLink(label)
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'ArrowDown') return
                      e.preventDefault()
                      cancelClose()
                      setOpenMenu(label)
                      focusFirstLink(label)
                    }}
                  >
                    {label}
                    <Chevron />
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Phone + CTA */}
        <div className="nav-right" onMouseEnter={scheduleClose}>
          <RegionalCallPopover offices={offices} fallbackPhone={siteSettings?.phone} />
          {cta('sm')}
        </div>

        <button
          ref={burgerRef}
          type="button"
          className="burger"
          aria-expanded={mobileOpen}
          aria-controls="nav-mobile"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          <svg viewBox="0 0 24 24" aria-hidden>
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {/* Desktop dropdowns. All of them are in the HTML; only the open one shows. */}
      <div className="nd-panels">
        {navItems.filter(isDropdown).map((item) => {
          const label = item.label || ''
          const open = openMenu === label
          const descId = `${panelId(label)}-desc`
          return (
            <div
              key={label}
              id={panelId(label)}
              className={`nd-panel${open ? ' open' : ''}`}
              role="region"
              aria-label={vercelStegaClean(label)}
              onMouseEnter={cancelClose}
              onMouseLeave={() => {
                setHovered(null)
                scheduleClose()
              }}
              onBlur={(e) => {
                // Focus left the panel (Tab past the last link): close it.
                const next = e.relatedTarget as Node | null
                if (open && next && !e.currentTarget.contains(next) && !headerRef.current?.querySelector(`[aria-controls="${panelId(label)}"]`)?.contains(next)) {
                  setOpenMenu(null)
                }
              }}
            >
              <div className="nd-in">
                <div className="nd-grid">
                  {item.sections?.map((section, sIdx) => {
                    const cols = clamp3(section.columns, 1)
                    return (
                      <div key={`${section.heading}-${sIdx}`} className={`nd-col g${clamp3(section.grow, cols)}`}>
                        {section.heading && (
                          <p className="nd-h">
                            <span>{section.heading}</span>
                          </p>
                        )}
                        <div className={`nd-items c${cols}`}>
                          {section.items?.map((sub) => (
                            <Link prefetch={false}
                              key={sub.href}
                              href={bookingHref(sub.href || '#')}
                              className="nd-a"
                              aria-current={sub.href && pathname === sub.href ? 'page' : undefined}
                              aria-describedby={sub.description ? descId : undefined}
                              onClick={() => setOpenMenu(null)}
                              onMouseEnter={() => setHovered(sub)}
                              onFocus={() => setHovered(sub)}
                            >
                              <span className="nd-ic" aria-hidden>
                                <ItemMark link={sub} />
                              </span>
                              <span className="nd-lb">
                                {sub.label}
                                <Pill>{sub.tier}</Pill>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {item.feature?.quote && (item.feature.logo || item.feature.image) ? (
                    <CaseStudyCard feature={item.feature} onNavigate={() => setOpenMenu(null)} />
                  ) : item.feature?.quote && (
                    <figure className="nd-feat">
                      {item.feature.kicker && <figcaption>{item.feature.kicker}</figcaption>}
                      <blockquote>
                        {item.feature.plain ? item.feature.quote : <>&ldquo;{item.feature.quote}&rdquo;</>}
                      </blockquote>
                      {item.feature.attribution && <p className="nd-who">{item.feature.attribution}</p>}
                      {item.feature.href && item.feature.label && (
                        <Link prefetch={false} href={item.feature.href} className="nd-fl-a" onClick={() => setOpenMenu(null)}>
                          {item.feature.label} <span aria-hidden>&rarr;</span>
                        </Link>
                      )}
                    </figure>
                  )}
                </div>

                <div className="nd-foot">
                  {/* The hovered item's description replaces the note. */}
                  <p id={descId} className="nd-desc" aria-live="polite">
                    {open && hovered?.description && item.sections?.some((s) => s.items?.includes(hovered)) ? (
                      <>
                        <span className="nd-dl">{hovered.label}</span> {hovered.description}
                      </>
                    ) : (
                      item.footerNote
                    )}
                  </p>
                  {item.footerLinks?.map((l) => (
                    <Link prefetch={false} key={l.href} href={l.href || '#'} className="nd-fl-a" onClick={() => setOpenMenu(null)}>
                      {l.label} <span aria-hidden>&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile sheet: one native disclosure per dropdown tab */}
      {mobileOpen && (
        <div id="nav-mobile" className="nd-drawer">
          {navItems.map((item) => {
            const label = item.label || ''
            if (!isDropdown(item)) {
              return (
                <Link
                  key={label}
                  href={bookingHref(item.href)}
                  onClick={closeMobile}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="nd-dtop"
                >
                  {label}
                </Link>
              )
            }
            return (
              <details key={label}>
                <summary>
                  {label}
                  <Chevron />
                </summary>
                <div className="nd-dbody">
                  {item.sections?.map((section, sIdx) => (
                    <div key={`${section.heading}-${sIdx}`}>
                      {section.heading && <p className="nd-h">{section.heading}</p>}
                      {section.items?.map((sub) => (
                        <Link prefetch={false}
                          key={sub.href}
                          href={bookingHref(sub.href || '#')}
                          onClick={closeMobile}
                          aria-current={sub.href && pathname === sub.href ? 'page' : undefined}
                          className="nd-dl-a"
                        >
                          <span className="nd-dlab">
                            {sub.label}
                            <Pill>{sub.tier}</Pill>
                          </span>
                          {/* No hover on touch: the description sits under the link. */}
                          {sub.description && <span className="nd-dd">{sub.description}</span>}
                        </Link>
                      ))}
                    </div>
                  ))}
                  {item.footerLinks?.map((l) => (
                    <Link prefetch={false} key={l.href} href={l.href || '#'} onClick={closeMobile} className="nd-dfoot">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </details>
            )
          })}
          {cta('nd-dcta', closeMobile)}
          {/* Regional numbers: the phone icon is desktop-only, and calling is
              the more likely action on a phone. */}
          <MobileCallList offices={offices} fallbackPhone={siteSettings?.phone} onNavigate={closeMobile} />
        </div>
      )}
    </header>
  )
}

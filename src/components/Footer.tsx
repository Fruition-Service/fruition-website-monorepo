import { bookingHref } from "@/lib/bookingLink"
import Link from 'next/link'
import { Fragment } from 'react'
import FooterBookingCta from '@/components/FooterBookingCta'
import GooglePreferredSourceButton from '@/components/GooglePreferredSourceButton'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import CurrencySwitcher from '@/components/currency/CurrencySwitcher'
import { vercelStegaClean } from '@vercel/stega'

interface FooterLink {
  label?: string
  href?: string
}

interface FooterColumnData {
  heading?: string
  links?: FooterLink[]
}

interface SocialLink {
  label?: string
  href?: string
  icon?: unknown
  /** Legacy row hint from the old brand-column layout; icons now sit in one row at the bottom. */
  row?: number
}

interface SiteSettingsProp {
  contactEmail?: string
  phone?: string
  calendlyLink?: string
  socialLinks?: SocialLink[]
  footerCtaLabel?: string
  footerTagline?: string
  footerBadges?: string[]
  footerColumns?: FooterColumnData[]
  footerLegalLinks?: FooterLink[]
  footerCopyrightText?: string
}

/** Placeholder numbers seeded as all zeros (e.g. "+91 00000 00000") are never rendered. */
function isRealPhone(phone?: string): boolean {
  if (!phone) return false
  return !/0{6,}/.test(phone.replace(/\D/g, ''))
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/**
 * The copyright line, split at its " · " separators so it only ever breaks
 * between parts: one line on desktop, two planned lines on tablet, one part per
 * line on phone (Claude Design "Footer currency switcher" 2a). In the inline
 * editor (stega-encoded text) it stays one plain node so it remains editable.
 */
function CopyLine({ text, phone }: { text?: string; phone?: string }) {
  const raw = text ?? ''
  const clean = vercelStegaClean(raw)
  if (clean !== raw) {
    return (
      <p className="copy">
        {raw}
        {phone && <> · <a href={telHref(phone)}>{phone}</a></>}
      </p>
    )
  }
  const parts: React.ReactNode[] = clean.split(/\s+·\s+/).filter(Boolean)
  if (phone) parts.push(<a href={telHref(phone)}>{phone}</a>)
  const brAfter = parts.length > 2 ? Math.ceil(parts.length / 2) - 1 : -1
  return (
    <p className="copy">
      {parts.map((p, i) => (
        <Fragment key={i}>
          <span className="ci">
            {i > 0 && <span className="d" aria-hidden>·</span>}
            {p}
          </span>
          {i === brAfter && <span className="cbr" aria-hidden />}
        </Fragment>
      ))}
    </p>
  )
}

/**
 * Site footer (Version C). It carries every page the five-tab menu does not:
 * Services, Platforms, Industries, Locations and Company. All text, links,
 * social icons and the copyright line come from Sanity siteSettings (seeded by
 * scripts/seed-nav-vc.ts) as plain text nodes, so the inline editor can click
 * them. Styles: src/styles/vc/chrome.css, scoped under `.vcf`.
 */
export default function Footer({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const calendlyUrl = siteSettings?.calendlyLink ? bookingHref(siteSettings.calendlyLink) : ''
  const socials = (siteSettings?.socialLinks ?? []).filter((s) => s.icon && s.href)
  const legalLinks = siteSettings?.footerLegalLinks ?? []
  const badges = siteSettings?.footerBadges ?? []
  const ctaLabel = siteSettings?.footerCtaLabel || ''
  const contactEmail = siteSettings?.contactEmail
  const phone = isRealPhone(siteSettings?.phone) ? siteSettings?.phone : undefined
  const columns = siteSettings?.footerColumns ?? []

  return (
    <footer className="vcf">
      <div className="wrap">
        <div className="cols">
          <div className="brand">
            <Link prefetch={false} href="/" aria-label="Fruition home" className="logo">
              <Image src="/images/logo-fruition-white.svg" alt="Fruition" width={1241} height={255} unoptimized />
            </Link>
            {siteSettings?.footerTagline && <p>{siteSettings.footerTagline}</p>}
            {badges.length > 0 && (
              <ul className="chips">
                {badges.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {ctaLabel && calendlyUrl && <FooterBookingCta url={calendlyUrl} label={ctaLabel} />}
            {/* Google's "add as a preferred source" button, once per site in the footer. */}
            <GooglePreferredSourceButton />
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="mail">
                {contactEmail}
              </a>
            )}
          </div>

          {columns.map((col, i) => (
            <div className="col" key={`${col.heading}-${i}`}>
              <h2>{col.heading}</h2>
              <ul>
                {(col.links ?? []).map((link, j) => (
                  <li key={`${link.href}-${j}`}>
                    <Link prefetch={false} href={link.href || '#'}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social icons and the display currency, on their own row above the copyright. */}
        <div className="base-top">
          {socials.length > 0 && (
            <div className="soc">
              {socials.map((s, i) => {
                const external = /^https?:/i.test(s.href ?? '')
                return (
                  <a
                    key={`${s.label}-${i}`}
                    href={s.href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={s.label || 'Social'}
                    title={s.label}
                  >
                    <Image src={urlFor(s.icon).width(48).url()} alt="" width={12} height={12} unoptimized />
                  </a>
                )
              })}
            </div>
          )}
          {/* Display currency for every price on the site (src/lib/currency). */}
          <CurrencySwitcher />
        </div>

        <div className="base">
          <CopyLine text={siteSettings?.footerCopyrightText} phone={phone} />
          {legalLinks.length > 0 && (
            <nav className="legal" aria-label="Legal">
              {legalLinks.map((link, i) => (
                <span key={`${link.href}-${i}`}>
                  {i > 0 && <span aria-hidden>· </span>}
                  <Link prefetch={false} href={link.href || '#'}>{link.label}</Link>
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}

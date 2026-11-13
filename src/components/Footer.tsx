import { bookingHref } from "@/lib/bookingLink"
import Link from 'next/link'
import FooterBookingCta from '@/components/FooterBookingCta'
import GooglePreferredSourceButton from '@/components/GooglePreferredSourceButton'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import CurrencySwitcher from '@/components/currency/CurrencySwitcher'

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
  /** Footer row, 1 or 2 (the approved footer puts WhatsApp and email on row 2). */
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
 * Site footer (Version C). It carries every page the five-tab menu does not:
 * Services, Platforms, Industries, Locations and Company. All text, links,
 * social icons and the copyright line come from Sanity siteSettings (seeded by
 * scripts/seed-nav-vc.ts) as plain text nodes, so the inline editor can click
 * them. Styles: src/styles/vc/chrome.css, scoped under `.vcf`.
 */
export default function Footer({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const calendlyUrl = siteSettings?.calendlyLink ? bookingHref(siteSettings.calendlyLink) : ''
  const socials = (siteSettings?.socialLinks ?? []).filter((s) => s.icon && s.href)
  const socialRows = [1, 2, 3]
    .map((row) => socials.filter((s) => Math.min(3, Math.max(1, s.row ?? 1)) === row))
    .filter((r) => r.length > 0)
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
            {socialRows.length > 0 && (
              <div className="soc">
                {socialRows.map((row, r) => (
                  <div className="soc-row" key={r}>
                    {row.map((s, i) => {
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
                ))}
              </div>
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

        <div className="base">
          <span>
            {siteSettings?.footerCopyrightText}
            {phone && (
              <>
                {siteSettings?.footerCopyrightText ? ' · ' : ''}
                <a href={telHref(phone)}>{phone}</a>
              </>
            )}
          </span>
          <div className="base-r">
            {/* Display currency for every price on the site (src/lib/currency). */}
            <CurrencySwitcher />
          {legalLinks.length > 0 && (
            <span className="legal">
              {legalLinks.map((link, i) => (
                <span key={`${link.href}-${i}`}>
                  {i > 0 && <span aria-hidden>· </span>}
                  <Link prefetch={false} href={link.href || '#'}>{link.label}</Link>
                </span>
              ))}
            </span>
          )}
          </div>
        </div>
      </div>
    </footer>
  )
}

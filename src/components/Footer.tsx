import { bookingHref } from "@/lib/bookingLink"
import Link from 'next/link'
import CtaButton from '@/components/CtaButton'
import FooterColumn from '@/components/FooterColumn'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'

interface FooterLink {
  label?: string
  href?: string
}

interface FooterColumnData {
  heading?: string
  links?: FooterLink[]
}

interface Office {
  phone?: string
  phoneTel?: string
}

interface SocialLink {
  label?: string
  href?: string
  icon?: unknown
}

interface SiteSettingsProp {
  contactEmail?: string
  phone?: string
  calendlyLink?: string
  offices?: Office[]
  socialLinks?: SocialLink[]
  footerCtaLabel?: string
  footerTagline?: string
  footerBadges?: string[]
  footerColumns?: FooterColumnData[]
  footerLegalLinks?: FooterLink[]
  footerCopyrightText?: string
  // Pre-v3 columns: rendered only until footerColumns is seeded.
  footerServicesLinks?: FooterLink[]
  footerDepartmentLinks?: FooterLink[]
  footerIndustryLinks?: FooterLink[]
  footerServicesHeading?: string
  footerDepartmentSolutionsHeading?: string
  footerIndustrySolutionsHeading?: string
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
 * Site footer (v3). With the menu cut to five tabs, the footer carries every
 * other page: Services, Platforms, Industries, Locations and Company. All copy
 * and links come from Sanity siteSettings (seeded by scripts/seed-nav-v3.ts).
 */
export default function Footer({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const calendlyUrl = siteSettings?.calendlyLink ? bookingHref(siteSettings.calendlyLink) : ''
  const socials = siteSettings?.socialLinks ?? []
  const legalLinks = siteSettings?.footerLegalLinks ?? []
  const badges = siteSettings?.footerBadges ?? []
  const ctaLabel = siteSettings?.footerCtaLabel || ''
  const contactEmail = siteSettings?.contactEmail
  const phone = isRealPhone(siteSettings?.phone) ? siteSettings?.phone : undefined

  const columns: FooterColumnData[] = siteSettings?.footerColumns?.length
    ? siteSettings.footerColumns
    : [
        { heading: siteSettings?.footerServicesHeading, links: siteSettings?.footerServicesLinks },
        { heading: siteSettings?.footerDepartmentSolutionsHeading, links: siteSettings?.footerDepartmentLinks },
        { heading: siteSettings?.footerIndustrySolutionsHeading, links: siteSettings?.footerIndustryLinks },
      ].filter((c) => c.links?.length)

  return (
    <footer className="bg-surface-dark text-white">
      <div className="mx-auto max-w-[1348px] px-4 pt-14 pb-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-8 md:gap-y-10 lg:grid-cols-[1.5fr_repeat(5,minmax(0,1fr))]">
          {/* Brand */}
          <div className="pb-8 md:col-span-3 md:pb-0 lg:col-span-1">
            <Link href="/" aria-label="Fruition home" className="inline-block">
              <Image
                src="/images/logo-fruition-white.svg"
                alt="Fruition"
                width={1241}
                height={255}
                className="h-7 w-auto"
                unoptimized
              />
            </Link>
            {siteSettings?.footerTagline && (
              <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-white/75">{siteSettings.footerTagline}</p>
            )}
            {badges.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {badges.map((b) => (
                  <li
                    key={b}
                    className="rounded-full border border-white/25 px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {ctaLabel && calendlyUrl && (
              <CtaButton href={calendlyUrl} label={ctaLabel} variant="primary" className="mt-6 h-11 px-6 text-sm" />
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="mt-6 block text-sm text-white/75 transition-colors hover:text-white"
              >
                {contactEmail}
              </a>
            )}
            {socials.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                {socials.map((s, i) => {
                  const src = s.icon ? urlFor(s.icon).width(52).height(52).url() : null
                  if (!src) return null
                  return (
                    <a
                      key={`${s.label}-${i}`}
                      href={s.href || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label || 'Social'}
                      className="flex h-11 w-11 items-center justify-center opacity-90 transition-opacity hover:opacity-100"
                    >
                      <Image src={src} alt="" width={26} height={26} className="h-[26px] w-[26px]" unoptimized />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {columns.map((col, i) => (
            <FooterColumn key={`${col.heading}-${i}`} heading={col.heading} links={col.links ?? []} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            {siteSettings?.footerCopyrightText}
            {phone && (
              <>
                {siteSettings?.footerCopyrightText ? ' · ' : ''}
                <a href={telHref(phone)} className="transition-colors hover:text-white">
                  {phone}
                </a>
              </>
            )}
          </p>
          {legalLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {legalLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href || '#'}
                  className="whitespace-nowrap py-2 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

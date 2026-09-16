import { bookingHref } from "@/lib/bookingLink"
import Link from 'next/link'
import CtaButton from '@/components/CtaButton'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'

interface FooterLink {
  label?: string
  href?: string
}

interface Office {
  flag?: string
  city?: string
  label?: string
  href?: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

interface SocialLink {
  label?: string
  href?: string
  icon?: unknown
}

interface FooterPartnerLogo {
  name?: string
  image?: unknown
  width?: number
  height?: number
}

interface SiteSettingsProp {
  contactEmail?: string
  phone?: string
  calendlyLink?: string
  logo?: unknown
  logoWhite?: unknown
  offices?: Office[]
  socialLinks?: SocialLink[]
  footerPartnerLogos?: FooterPartnerLogo[]
  footerServicesLinks?: FooterLink[]
  footerDepartmentLinks?: FooterLink[]
  footerIndustryLinks?: FooterLink[]
  footerCtaLabel?: string
  footerPartnerExpertiseHeading?: string
  footerServicesHeading?: string
  footerDepartmentSolutionsHeading?: string
  footerIndustrySolutionsHeading?: string
  footerOurLocationsHeading?: string
  footerLegalLinks?: FooterLink[]
  footerCopyrightText?: string
}


/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function EnvelopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[2px]">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[2px]">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

/** Placeholder numbers seeded as all zeros (e.g. "+91 00000 00000") are never rendered. */
function isRealPhone(phone?: string): boolean {
  if (!phone) return false
  return !/0{6,}/.test(phone.replace(/\D/g, ''))
}

export default function Footer({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const calendlyUrl = siteSettings?.calendlyLink ? bookingHref(siteSettings.calendlyLink) : ''
  const offices = siteSettings?.offices ?? []
  const socials = siteSettings?.socialLinks ?? []
  const partnerLogos = siteSettings?.footerPartnerLogos ?? []
  const servicesLinks = siteSettings?.footerServicesLinks ?? []
  const departmentLinks = siteSettings?.footerDepartmentLinks ?? []
  const industryLinks = siteSettings?.footerIndustryLinks ?? []
  const legalLinks = siteSettings?.footerLegalLinks ?? []
  const ctaLabel = siteSettings?.footerCtaLabel || ''

  const contactEmail = siteSettings?.contactEmail
  const logoSrc = '/images/logo-fruition-white.svg'

  return (
    <footer className="flex flex-col lg:flex-row w-full">
      {/* ============================================================ */}
      {/*  LEFT PANEL - gradient background                            */}
      {/* ============================================================ */}
      <div
        className="w-full lg:w-[530px] shrink-0 py-12 lg:py-16 px-8 md:px-12 lg:pl-[120px] lg:pr-10 flex flex-col gap-8"
        style={{
          background: 'linear-gradient(-38deg, rgb(128, 21, 232) 0%, rgb(16, 0, 58) 100%)',
        }}
      >
        {/* Logo + CTA row */}
        <div className="flex items-center gap-[15px] flex-wrap">
          <Link href="/">
            {logoSrc && (
              <Image
                src={logoSrc}
                alt="Site logo"
                width={1241}
                height={255}
                className="h-[28px] w-auto"
                unoptimized
              />
            )}
          </Link>
          {ctaLabel && calendlyUrl && (
            <CtaButton
              href={calendlyUrl}
              label={ctaLabel}
              variant="primary"
              style={{ height: 40, fontSize: 13, padding: "0 22px" }}
            />
          )}
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-[10px]">
          {/* Email */}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-start gap-2 text-white hover:opacity-80 transition-opacity"
            >
              <EnvelopeIcon />
              <span className="text-[13px] leading-[20px]">{contactEmail}</span>
            </a>
          )}

          {/* Phone numbers (one per office; placeholder numbers hidden) */}
          <div className="flex items-start gap-2">
            <PhoneIcon />
            <div className="flex flex-col gap-y-0.5 md:flex-row md:flex-wrap md:gap-x-6 text-[13px] leading-[20px] text-white">
              {offices.filter((o) => isRealPhone(o.phone)).map((o) => (
                <a
                  key={o.phoneTel || o.phone}
                  href={`tel:${o.phoneTel || (o.phone || '').replace(/\s/g, '')}`}
                  className="hover:opacity-80 transition-opacity"
                >
                  {o.phone}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Expertise */}
        <div>
          {siteSettings?.footerPartnerExpertiseHeading && (
            <h4 className="text-white font-semibold text-[16px] leading-tight mb-3">{siteSettings.footerPartnerExpertiseHeading}</h4>
          )}
          <div className="grid grid-cols-2 gap-x-6 md:gap-x-[40px] gap-y-[10px] md:gap-y-[7px]">
            {partnerLogos.map((p, i) => {
              const w = p.width ?? 110
              const h = p.height ?? 38
              const src = p.image ? urlFor(p.image).width(w * 2).height(h * 2).url() : null
              if (!src) return null
              return (
                <div key={`${p.name}-${i}`} className="flex items-center">
                  <Image
                    src={src}
                    alt={p.name || 'Partner logo'}
                    width={w}
                    height={h}
                    className="object-contain"
                    style={{ width: w, height: h }}
                    unoptimized
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-[9px]">
          {socials.map((s, i) => {
            const src = s.icon ? urlFor(s.icon).width(52).height(52).url() : null
            if (!src) return null
            return (
              <a
                key={`${s.label}-${i}`}
                href={s.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image src={src} alt={s.label || 'Social'} width={26} height={26} className="w-[26px] h-[26px]" unoptimized />
              </a>
            )
          })}
        </div>

        {/* Legal links */}
        {legalLinks.length > 0 && (
          <div className="flex items-center gap-[14px]">
            {legalLinks.map((link, i) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href || '#'}
                className="text-white text-[13px] md:text-[12px] hover:opacity-80 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Copyright */}
        {siteSettings?.footerCopyrightText && (
          <p className="text-white text-[12px] md:text-[11px] tracking-[0.55px]">
            {siteSettings.footerCopyrightText}
          </p>
        )}
      </div>

      {/* ============================================================ */}
      {/*  RIGHT PANEL - dark background                               */}
      {/* ============================================================ */}
      <div className="flex-1 bg-black py-12 lg:py-16 px-8 md:px-12 lg:px-16">
        {/* Three link columns — hidden on mobile (too tall); links stay in the DOM for crawlers */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 lg:gap-8">
          {/* Services */}
          <div>
            {siteSettings?.footerServicesHeading && (
              <h4 className="text-white font-semibold text-[16px] leading-tight mb-4">{siteSettings.footerServicesHeading}</h4>
            )}
            <div className="flex flex-col">
              {servicesLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href || '#'}
                  className="text-white text-[14px] leading-[20px] py-2 md:text-[12px] md:leading-[17px] md:py-[5.5px] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Department Solutions */}
          <div>
            {siteSettings?.footerDepartmentSolutionsHeading && (
              <h4 className="text-white font-semibold text-[16px] leading-tight mb-4">{siteSettings.footerDepartmentSolutionsHeading}</h4>
            )}
            <div className="flex flex-col">
              {departmentLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href || '#'}
                  className="text-white text-[14px] leading-[20px] py-2 md:text-[12px] md:leading-[17px] md:py-[5.5px] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Industry Solutions */}
          <div>
            {siteSettings?.footerIndustrySolutionsHeading && (
              <h4 className="text-white font-semibold text-[16px] leading-tight mb-4">{siteSettings.footerIndustrySolutionsHeading}</h4>
            )}
            <div className="flex flex-col">
              {industryLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href || '#'}
                  className="text-white text-[14px] leading-[20px] py-2 md:text-[12px] md:leading-[17px] md:py-[5.5px] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Our Locations — first visible block on mobile, so no top margin there */}
        <div className="md:mt-12">
          {siteSettings?.footerOurLocationsHeading && (
            <h4 className="text-white font-semibold text-[16px] leading-tight mb-5">{siteSettings.footerOurLocationsHeading}</h4>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
            {offices.map((loc, i) => (
              <div key={`${loc.phoneTel}-${i}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[18px] leading-none">{loc.flag}</span>
                  <Link
                    href={loc.href || '#'}
                    className="text-[#d2acf7] text-[13px] md:text-[12px] font-medium hover:opacity-80 transition-opacity"
                  >
                    {loc.city}
                  </Link>
                </div>
                <p className="text-white/70 text-[12px] md:text-[11px] mb-0.5">({loc.label})</p>
                {loc.addressUrl ? (
                  <a
                    href={loc.addressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-[13px] leading-[19px] md:text-[12px] md:leading-[18px] hover:opacity-80 transition-opacity block mb-1"
                  >
                    {loc.address}
                  </a>
                ) : (
                  <p className="text-white text-[13px] leading-[19px] md:text-[12px] md:leading-[18px] mb-1">{loc.address}</p>
                )}
                {isRealPhone(loc.phone) && (
                  <a
                    href={`tel:${loc.phoneTel || (loc.phone || '').replace(/\s/g, '')}`}
                    className="text-white text-[13px] md:text-[12px] hover:opacity-80 transition-opacity"
                  >
                    {loc.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

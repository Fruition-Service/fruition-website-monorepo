"use client"

import Image from "next/image"
import Link from "next/link"
import BookingSection from "./BookingSection"
import WorldMap, { type MapOffice } from "./WorldMap"
import AuditCtaBanner from "./AuditCtaBanner"
import { useSiteCopy } from "@/components/SiteCopyProvider"
import LeadForm, { type LeadFormField } from "./LeadForm"

export interface ContactOffice extends MapOffice {
  flag?: string
  phone?: string
  phoneTel?: string
  label?: string
}

interface ContactSectionProps {
  offices: ContactOffice[]
  /** The "Sales" channel. */
  salesEmail: string
  /** Support channel email. */
  supportEmail: string
  /** Display phone + tel: target. */
  phone?: string
  phoneTel?: string
}

/**
 * /contact-us, top to bottom (Josh, 27 Oct 2026 website sync):
 *
 *   1. business details, kept simple: sales and support email, phone
 *   2. accreditations: the partner badges already used on the homepage
 *   3. a short lead form (the shared LeadForm, posting to /api/leads like the
 *      CRO and ad landing page forms)
 *   4. the booking band
 *   5. the world map, then the offices as collapsible rows
 *
 * On desktop 1 and 2 sit in the left column with the form on the right, the
 * enreap.com/contact layout Ishani shared; on mobile they stack in that order.
 */
export default function ContactSection({
  offices,
  salesEmail,
  supportEmail,
  phone,
  phoneTel,
}: ContactSectionProps) {
  const t = useSiteCopy()
  return (
    <>
      <ContactHero
        offices={offices}
        salesEmail={salesEmail}
        supportEmail={supportEmail}
        phone={phone}
        phoneTel={phoneTel}
      />

      <BookingSection
        eyebrow={t("booking-contact-eyebrow")}
        heading={t("booking-contact-heading")}
        sub={t("booking-contact-sub")}
        email={salesEmail}
      />

      {/* Mid-page conversion banner, shared site-wide */}
      <AuditCtaBanner />

      <OfficeBand offices={offices} />
      <OfficeList offices={offices} />
    </>
  )
}

/* ── Hero: details + accreditations (left), lead form (right) ──────────── */

/** Answers land under the keys the monday sink reads: "Phone" fills the phone
 *  column, "Message" the notes column (see pushToMonday in @/lib/leadNotify). */
const FORM_FIELDS: LeadFormField[] = [
  { label: "Phone", name: "Phone", inputType: "tel", autoComplete: "tel" },
  {
    label: "What do you need help with?",
    name: "Message",
    type: "textarea",
    required: true,
    placeholder: "A sentence or two is plenty.",
  },
]

function ContactHero({ salesEmail, supportEmail, phone, phoneTel }: ContactSectionProps) {
  const telHref = phoneTel || (phone ? phone.replace(/[^\d+]/g, "") : "")
  // The CMS often uses one shared inbox, so don't show the same address twice.
  const sameInbox = salesEmail.toLowerCase() === supportEmail.toLowerCase()

  return (
    <section className="bg-surface px-4 pt-14 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Contact us
          </p>
          <h1 className="text-display mt-4 text-body text-balance">We&rsquo;d love to hear from you</h1>
          <p className="text-body-lead mt-4 max-w-[560px] text-muted text-pretty">
            Reach the team directly, or find the office nearest you. We answer every message within one business day.
          </p>

          {/* Business details: the dashed-ledger rows from DESIGN.md */}
          <dl className="mt-8 border-t border-dashed border-ui">
            {sameInbox ? (
              <DetailRow label="Email" value={salesEmail} href={`mailto:${salesEmail}`} />
            ) : (
              <>
                <DetailRow label="Sales" value={salesEmail} href={`mailto:${salesEmail}`} />
                <DetailRow label="Support" value={supportEmail} href={`mailto:${supportEmail}`} />
              </>
            )}
            {phone && <DetailRow label="Phone" value={phone} href={telHref ? `tel:${telHref}` : undefined} />}
            <DetailRow
              label="LinkedIn"
              value="linkedin.com/company/fruition-services"
              href="https://www.linkedin.com/company/fruition-services"
            />
          </dl>

          <Accreditations />
        </div>

        <div className="min-w-0 lg:pt-2">
          <LeadForm
            variant="card"
            heading="Send us a message"
            subheading="Tell us a little about what you need and a specialist will get back to you within one business day."
            source="contact-us"
            showCompany={false}
            fields={FORM_FIELDS}
            submitLabel="Send message"
            successMessage="Thanks, a specialist will be in touch within one business day."
          />
        </div>
      </div>
    </section>
  )
}

function DetailRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-dashed border-ui py-4 md:flex-row md:items-center md:justify-between md:gap-6">
      <dt className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="min-w-0">
        {href ? (
          <a
            href={href}
            className="inline-flex min-h-11 items-center text-[17px] font-semibold text-body [word-break:break-word] hover:text-brand"
          >
            {value}
          </a>
        ) : (
          <span className="text-[17px] font-semibold text-body">{value}</span>
        )}
      </dd>
    </div>
  )
}

/* ── Accreditations: the same partner marks as the homepage ─────────────── */

const BADGES: { src: string; alt: string; width: number; height: number }[] = [
  { src: "/images/home/partner-monday.png", alt: "monday.com Platinum Partner", width: 268, height: 92 },
  { src: "/images/home/partner-atlassian.png", alt: "Atlassian Platinum Solution Partner", width: 291, height: 92 },
  { src: "/images/home/partner-hubspot.png", alt: "HubSpot Solutions Partner", width: 124, height: 124 },
  { src: "/images/home/partner-claude.png", alt: "Claude Select Services Partner", width: 253, height: 80 },
  { src: "/images/home/partner-openai.png", alt: "OpenAI Select Partner", width: 331, height: 156 },
  { src: "/images/home/partner-aws.png", alt: "AWS Partner", width: 123, height: 124 },
  { src: "/images/home/partner-googlecloud.png", alt: "Google Cloud Partner", width: 598, height: 147 },
  { src: "/images/home/partner-make.png", alt: "Make Partner", width: 357, height: 92 },
  { src: "/images/home/partner-clickup.png", alt: "ClickUp Registered Partner", width: 124, height: 124 },
]

function Accreditations() {
  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          Accreditations
        </h2>
        <Link
          href="/certifications-and-awards"
          className="inline-flex min-h-11 items-center text-caption font-semibold text-brand hover:text-brand-dark"
        >
          All certifications &rarr;
        </Link>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-3">
        {BADGES.map((b) => (
          <li
            key={b.alt}
            className="flex h-[72px] items-center justify-center rounded-chip border border-ui bg-surface-raised px-3 md:h-[84px] md:px-4"
          >
            <Image
              src={b.src}
              alt={b.alt}
              width={b.width}
              height={b.height}
              className="h-auto max-h-[44px] w-auto max-w-full object-contain md:max-h-[52px]"
            />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-center rounded-chip border border-ui bg-surface-raised px-4 py-3">
        <Image
          src="/images/badge-certifications.png"
          alt="monday.com certifications: product, advanced workflows, customer success, partner marketing"
          width={325}
          height={73}
          className="h-auto w-full max-w-[325px]"
        />
      </div>
    </div>
  )
}

/* ── Office band: full-bleed purple, world map ─────────────────────────── */

function OfficeBand({ offices }: { offices: ContactOffice[] }) {
  return (
    <section className="bg-[linear-gradient(135deg,var(--color-surface-dark)_0%,var(--color-surface-dark-2)_55%,var(--color-brand-dark)_100%)] px-4 py-14 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-[640px]">
          <p className="text-brand-light text-base font-semibold leading-6">Our locations</p>
          <h2 className="text-section-h2 mt-3 text-white text-balance">Visit our offices</h2>
          <p className="mt-4 text-body-lead text-white/[0.72]">
            Local teams across {offices.length} cities, working in your timezone.
          </p>
        </div>
        <div className="mt-10 rounded-card bg-surface-raised px-2 py-4 md:px-6 md:py-6">
          <WorldMap offices={offices} />
        </div>
      </div>
    </section>
  )
}

/* ── Office list: one collapsible row per office ───────────────────────── */

function OfficeList({ offices }: { offices: ContactOffice[] }) {
  if (offices.length === 0) return null
  return (
    <section className="bg-surface px-4 py-14 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-section-h3 text-body">Our offices</h2>
        <ul className="mt-6 grid grid-cols-1 gap-x-8 border-t border-ui md:grid-cols-2 lg:grid-cols-3 md:border-t-0">
          {offices.map((o, i) => (
            <li key={`${o.city}-${i}`} className="border-b border-ui md:border-t">
              <details className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-4 text-body [&::-webkit-details-marker]:hidden">
                  {o.flag && (
                    <span className="text-lg leading-none" aria-hidden>
                      {o.flag}
                    </span>
                  )}
                  <span className="flex-1 text-lg font-semibold">{o.city}</span>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-ui text-brand transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="flex flex-col gap-1 pb-5 pr-11">
                  {o.label && (
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">{o.label}</p>
                  )}
                  {o.address &&
                    (o.addressUrl ? (
                      <a
                        href={o.addressUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base leading-6 text-muted hover:text-brand"
                      >
                        {o.address}
                      </a>
                    ) : (
                      <p className="text-base leading-6 text-muted">{o.address}</p>
                    ))}
                  {o.phone && (
                    <a
                      href={`tel:${o.phoneTel || o.phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex min-h-11 items-center self-start text-base font-semibold text-body hover:text-brand"
                    >
                      {o.phone}
                    </a>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

"use client"

import BookingSection from "./BookingSection"
import WorldMap, { type MapOffice } from "./WorldMap"
import AuditCtaBanner from "./AuditCtaBanner"

export interface ContactOffice extends MapOffice {
  flag?: string
  phone?: string
  phoneTel?: string
  label?: string
}

interface ContactSectionProps {
  offices: ContactOffice[]
  /** Where the form is sent + the "Sales" channel. */
  salesEmail: string
  /** Support channel email. */
  supportEmail: string
  /** Display phone + tel: target. */
  phone?: string
  phoneTel?: string
}

export default function ContactSection({
  offices,
  salesEmail,
  supportEmail,
  phone,
  phoneTel,
}: ContactSectionProps) {
  return (
    <>
      <ContactHero offices={offices} salesEmail={salesEmail} supportEmail={supportEmail} phone={phone} phoneTel={phoneTel} />

      <OfficeBand offices={offices} />
      <BookingSection
        eyebrow="Contact us"
        heading="Tell us what you’re building"
        sub="Pick a time and talk it through with a specialist, or email us and we’ll reply within one business day."
        email={salesEmail}
      />
    </>
  )
}

/* ── Hero: headline, world map, three contact channels ─────────────────── */

function ContactHero({ offices, salesEmail, supportEmail, phone, phoneTel }: ContactSectionProps) {
  const telHref = phoneTel || (phone ? phone.replace(/[^\d+]/g, "") : "")
  // The CMS often uses one shared inbox — don't show the same address twice.
  const sameInbox = salesEmail.toLowerCase() === supportEmail.toLowerCase()
  return (
    <section className="bg-surface px-4">
      <div className="mx-auto flex flex-col items-center max-w-[1100px] pt-26 pb-6">
        <span className="inline-flex items-center rounded-full bg-brand-soft text-brand border border-brand/30 font-mono text-xs font-semibold uppercase tracking-[0.14em] px-4 py-2">
          Contact us
        </span>

        <h1 className="text-center mt-6 max-w-[860px] text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-body text-balance">
          We&rsquo;d love to hear from you
        </h1>

        <p className="text-center text-body-lead mt-5 max-w-[600px] text-muted text-pretty">
          Reach the team directly, or find the office nearest you. We answer every message within one business day.
        </p>
      </div>

      {/* Booking banner, links to the Calendly booking on this page */}
      <div className="mx-auto w-full max-w-[1000px] px-4 pt-8 pb-2 md:pt-10">
        <AuditCtaBanner contained={false} />
      </div>

      {/* World map */}
      <div className="mx-auto px-4 max-w-[1100px] pt-3 pb-4">
        <WorldMap offices={offices} />
      </div>

      {/* Channels */}
      <div className="mx-auto px-4 max-w-[1000px] pt-6 pb-22">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 text-center">
          {sameInbox ? (
            <Channel
              title="Email"
              blurb="Sales, support, or a general question."
              value={salesEmail}
              href={`mailto:${salesEmail}`}
            />
          ) : (
            <>
              <Channel
                title="Sales"
                blurb="New project or partnership? Start here."
                value={salesEmail}
                href={`mailto:${salesEmail}`}
              />
              <Channel
                title="Support"
                blurb="Existing client needing a hand."
                value={supportEmail}
                href={`mailto:${supportEmail}`}
              />
            </>
          )}
          <Channel
            title="Phone"
            blurb="Monday to Friday, business hours AEST."
            value={phone || ", "}
            href={telHref ? `tel:${telHref}` : undefined}
          />
          <Channel
            title="LinkedIn"
            blurb="Follow along and connect with the team."
            value="linkedin.com/company/fruition-services"
            href="https://www.linkedin.com/company/fruition-services"
          />
        </div>
      </div>
    </section>
  )
}

function Channel({ title, blurb, value, href }: { title: string; blurb: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <h2 className="text-[17px] font-semibold text-body">{title}</h2>
      <p className="text-sm text-muted leading-5 max-w-[240px]">{blurb}</p>
      {href ? (
        <a
          href={href}
          className="text-[15px] font-semibold text-brand mt-0.5 [word-break:break-word]"
        >
          {value}
        </a>
      ) : (
        <span className="text-[15px] font-semibold text-muted mt-0.5">{value}</span>
      )}
    </div>
  )
}

/* ── Office band: full-bleed purple, addresses ─────────────────────────── */

function OfficeBand({ offices }: { offices: ContactOffice[] }) {
  return (
    <section className="py-24 bg-[linear-gradient(135deg,var(--color-surface-dark)_0%,var(--color-surface-dark-2)_55%,var(--color-brand-dark)_100%)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 lg:flex-row lg:items-start lg:gap-16">
        {/* Heading column */}
        <div className="max-w-[360px] min-w-0 lg:flex-none">
          <p className="text-brand-light text-base font-semibold leading-6">
            Our locations
          </p>
          <h2 className="text-section-h2 text-white mt-3 text-balance">
            Visit our offices
          </h2>
          <p className="text-white/[0.72] text-xl leading-[30px] mt-5">
            Local teams across {offices.length} cities, working in your timezone.
          </p>
        </div>

        {/* Office list */}
        <div className="flex flex-1 flex-wrap gap-8 lg:gap-x-16 lg:gap-y-8">
          {offices.map((o, i) => (
            <div key={`${o.city}-${i}`} className="min-w-[240px] max-w-[320px] flex-[1_0_0]">
              <div className="flex items-center gap-2">
                {o.flag && <span className="text-lg leading-none">{o.flag}</span>}
                <span className="text-lg font-semibold text-white leading-7">{o.city}</span>
              </div>
              {o.address &&
                (o.addressUrl ? (
                  <a
                    href={o.addressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-base leading-6 text-white/[0.72] mt-1"
                  >
                    {o.address}
                  </a>
                ) : (
                  <p className="text-base leading-6 text-white/[0.72] mt-1">
                    {o.address}
                  </p>
                ))}
              {o.phone && (
                <a
                  href={`tel:${o.phoneTel || o.phone.replace(/[^\d+]/g, "")}`}
                  className="block text-base text-white/[0.72] mt-1"
                >
                  {o.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

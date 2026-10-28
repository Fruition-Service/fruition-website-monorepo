import Image from "next/image"
import Link from "next/link"

const LINKEDIN_URL = "https://www.linkedin.com/company/fruition-services"

interface ContactChannelsSectionProps {
  salesEmail: string
  supportEmail: string
  /** Display phone + tel: target. */
  phone?: string
  phoneTel?: string
}

/**
 * /contact-us direct channels as dashed ledger rows (label left in mono,
 * value right), with the partner accreditations beside them on desktop.
 */
export default function ContactChannelsSection({ salesEmail, supportEmail, phone, phoneTel }: ContactChannelsSectionProps) {
  const telHref = phoneTel || (phone ? phone.replace(/[^\d+]/g, "") : "")
  // The CMS often uses one shared inbox, so don't show the same address twice.
  const sameInbox = salesEmail.toLowerCase() === supportEmail.toLowerCase()

  return (
    <section className="bg-surface section-y">
      <div className="site-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-7">
          <div className="section-head">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">Contact channels</p>
            <h2 className="text-section-h2 text-ink text-balance">Reach the team directly</h2>
          </div>

          <dl className="mt-8 border-t border-dashed border-ui">
            {sameInbox ? (
              <LedgerRow label="Email" value={salesEmail} href={`mailto:${salesEmail}`} />
            ) : (
              <>
                <LedgerRow label="Sales" value={salesEmail} href={`mailto:${salesEmail}`} />
                <LedgerRow label="Support" value={supportEmail} href={`mailto:${supportEmail}`} />
              </>
            )}
            {phone && <LedgerRow label="Phone" value={phone} href={telHref ? `tel:${telHref}` : undefined} />}
            <LedgerRow label="LinkedIn" value="linkedin.com/company/fruition-services" href={LINKEDIN_URL} external />
          </dl>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <Accreditations />
        </div>
      </div>
    </section>
  )
}

function LedgerRow({ label, value, href, external }: { label: string; value: string; href?: string; external?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-dashed border-ui py-3">
      <dt className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="min-w-0 max-w-full">
        {href ? (
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-11 items-center text-base font-semibold text-ink [overflow-wrap:anywhere] hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {value}
          </a>
        ) : (
          <span className="text-base font-semibold text-ink">{value}</span>
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
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">Accreditations</h3>
        <Link
          href="/certifications-and-awards"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand hover:text-brand-dark"
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

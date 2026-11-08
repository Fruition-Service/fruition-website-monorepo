import Link from "next/link"

/** Offices whose region has a monday CRM consulting landing page, keyed on a substring of `city`. */
const MONDAY_CRM_LINKS: Record<string, string> = {
  Sydney: "/au/monday-crm-consulting",
  "New York": "/us/monday-crm-consulting",
  London: "/uk/monday-crm-consulting",
}

function mondayCrmHref(city: string): string | undefined {
  const key = Object.keys(MONDAY_CRM_LINKS).find((k) => city.includes(k))
  return key ? MONDAY_CRM_LINKS[key] : undefined
}

export interface ContactOffice {
  city: string
  country?: string
  flag?: string
  label?: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

/**
 * /contact-us offices from siteSettings.offices: one card per office,
 * 1 column on mobile, 2 at md, 3 at lg.
 */
export default function OfficesBandSection({ offices }: { offices: ContactOffice[] }) {
  if (offices.length === 0) return null
  return (
    <section className="bg-surface-subtle section-y">
      <div className="site-container">
        <div className="section-head">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">Our locations</p>
          <h2 className="text-section-h2 text-ink text-balance">Visit our offices</h2>
          <p className="text-body-lead text-muted">Local teams across {offices.length} cities, working in your timezone.</p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {offices.map((o, i) => {
            const crmHref = mondayCrmHref(o.city)
            return (
            <li key={`${o.city}-${i}`} className="flex min-w-0 flex-col gap-2 rounded-card border border-ui bg-surface-raised p-6 md:p-8">
              <h3 className="text-card-title flex items-center gap-2 text-ink">
                {o.flag && (
                  <span className="leading-none" aria-hidden>
                    {o.flag}
                  </span>
                )}
                <span>
                  {o.city}
                  {o.country && <span className="font-normal text-muted">, {o.country}</span>}
                </span>
              </h3>
              {o.label && <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">{o.label}</p>}
              {o.address &&
                (o.addressUrl ? (
                  <a
                    href={o.addressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base leading-6 text-muted underline-offset-2 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {o.address}
                  </a>
                ) : (
                  <p className="text-base leading-6 text-muted">{o.address}</p>
                ))}
              {o.phone && (
                <a
                  href={`tel:${o.phoneTel || o.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-auto inline-flex min-h-11 items-center self-start text-base font-semibold text-ink hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {o.phone}
                </a>
              )}
              {crmHref && (
                <Link
                  href={crmHref}
                  className={`relative inline-flex items-center gap-1.5 self-start rounded-full border border-brand/30 px-3 py-1 text-[13px] font-semibold text-brand transition-colors before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${o.phone ? "mt-2.5" : "mt-auto"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 50 50" fill="currentColor" aria-hidden="true">
                    <circle cx="10" cy="38" r="10" />
                    <circle cx="25" cy="38" r="10" />
                    <circle cx="40" cy="38" r="10" />
                    <rect x="1" y="4" width="18" height="28" rx="9" />
                    <rect x="16" y="4" width="18" height="28" rx="9" />
                    <rect x="31" y="4" width="18" height="28" rx="9" />
                  </svg>
                  monday CRM
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

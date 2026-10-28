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
          {offices.map((o, i) => (
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

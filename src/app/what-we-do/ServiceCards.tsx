import Link from 'next/link'
import { NavIcon } from '@/components/common/icons/NavIcons'
import { SERVICES_CARDS } from '@/data/hubs/services'

/**
 * The six service cards. The whole card is the link: on a hub page the card is
 * the destination, and a full-card target keeps the tap area well past 44px on
 * mobile instead of leaving only the "Learn more" line clickable.
 */
export default function ServiceCards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES_CARDS.map((service) => (
        <Link
          key={service.href}
          href={service.href}
          className="group flex flex-col rounded-card bg-surface-raised p-6 ring-1 ring-ui shadow-whisper transition-shadow hover:ring-brand"
        >
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-badge text-brand ring-1 ring-ui"
          >
            <NavIcon iconKey={service.icon} href={service.href} className="h-5 w-5" />
          </span>
          <h3 className="text-card-title mt-4 transition-colors group-hover:text-brand">{service.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{service.body}</p>
          <span className="mt-auto pt-5 text-sm font-semibold text-cta-blue-light transition-colors group-hover:text-cta-blue-dark">
            {service.cta}
          </span>
        </Link>
      ))}
    </div>
  )
}

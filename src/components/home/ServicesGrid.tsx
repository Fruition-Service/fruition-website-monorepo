import Link from "next/link"
import { Crosshair, FileText, Layers, Sparkles, Users, Zap } from "lucide-react"
import Reveal from "./Reveal"
import { SERVICES, type ServiceCard } from "./data"
import { homeText, type HomeCopy } from "./copy"

const ICONS: Record<ServiceCard["icon"], typeof Layers> = {
  layers: Layers,
  zap: Zap,
  sparkles: Sparkles,
  users: Users,
  file: FileText,
  crosshair: Crosshair,
}

/** Six practice cards on the pale purple band. */
export default function ServicesGrid({ copy }: { copy: HomeCopy }) {
  return (
    <section id="services" className="scroll-mt-24 bg-tint py-16 md:py-20 lg:py-24">
      <div className="site-container">
        <Reveal className="max-w-[820px]">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">{homeText(copy, "services-eyebrow")}</p>
          <h2 className="text-section-h2 mt-4 text-foreground" style={{ textWrap: "pretty" }}>
            {homeText(copy, "services-heading")}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-2 gap-3 md:gap-6 lg:mt-13 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon]
            return (
              <Link
                key={service.href}
                href={service.href}
                className="ui-hover-card flex h-full flex-col items-start gap-3 rounded-card border border-lilac bg-surface-raised p-5 shadow-whisper md:gap-4 md:p-8"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-chip bg-tint md:h-12 md:w-12">
                  <Icon className="size-5 text-brand md:size-6" aria-hidden strokeWidth={2} />
                </span>
                <h3 className="text-card-title hyphens-auto text-[16px] break-words text-foreground md:text-[20px] lg:text-[22px]">{homeText(copy, service.titleSlot)}</h3>
                <p className="text-body-sm flex-1 text-[14px] break-words text-muted md:text-[15px]">{homeText(copy, service.bodySlot)}</p>
                <span className="text-caption font-semibold text-brand">{homeText(copy, "services-card-cta")}</span>
              </Link>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

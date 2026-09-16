import Link from "next/link"
import { Layers, LineChart, Zap, Users, Database, Sparkles } from "lucide-react"
import SectionIntro from "@/components/sections/SectionIntro"
import type { RegionContent } from "./types"

const ICONS = {
  layers: Layers,
  chart: LineChart,
  zap: Zap,
  users: Users,
  database: Database,
  sparkles: Sparkles,
} as const

export default function RegionServicesSection({
  services,
}: {
  services: RegionContent["services"]
}) {
  return (
    <section id="services" className="scroll-mt-24 bg-tint px-4 py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="max-w-[840px]">
          <SectionIntro
            align="left"
            eyebrow={services.eyebrow}
            heading={services.heading}
            lead={services.lead}
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-13 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.cards.map((card) => {
            const Icon = ICONS[card.icon]
            return (
              <div
                key={card.title}
                className="flex h-full flex-col items-start gap-3 rounded-card border border-lilac bg-surface-raised p-5 shadow-whisper transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-card md:gap-4 md:p-7"
              >
                <span className="flex size-10 items-center justify-center rounded-chip bg-tint md:size-12">
                  <Icon className="size-5 text-brand md:size-6" aria-hidden />
                </span>
                <h3 className="text-card-title hyphens-auto text-[16px] break-words text-foreground md:text-[20px] lg:text-[22px]">{card.title}</h3>
                <p className="text-body-sm text-[14px] break-words text-muted md:text-[15px]">{card.body}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 rounded-card border border-lilac bg-surface-raised px-6 py-6 shadow-whisper md:px-8">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-label">
            {services.alsoLabel}
          </span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3.5 text-[15px] font-semibold md:ml-auto">
            {services.alsoLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-brand hover:text-brand-dark">
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

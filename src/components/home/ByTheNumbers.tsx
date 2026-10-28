import { Clock, Globe, SquareCheckBig, Trophy } from "lucide-react"
import Reveal from "./Reveal"
import { STATS, type StatCard } from "./data"
import { homeText, type HomeCopy } from "./copy"

const ICONS: Record<StatCard["icon"], typeof Clock> = {
  check: SquareCheckBig,
  globe: Globe,
  clock: Clock,
  trophy: Trophy,
}

/** Four proof-point tiles: scale, footprint, speed to Platinum, and the award. */
export default function ByTheNumbers({ copy }: { copy: HomeCopy }) {
  return (
    <section className="bg-surface pt-16 pb-10 md:pt-20 lg:pt-23">
      <div className="site-container">
        <Reveal className="max-w-[720px]">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">
            {homeText(copy, "stats-eyebrow")}
          </p>
          <h2 className="text-section-h2 mt-3.5 text-foreground lg:text-[38px]" style={{ textWrap: "pretty" }}>
            {homeText(copy, "stats-heading")}
          </h2>
        </Reveal>

        <Reveal className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-11 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = ICONS[stat.icon]
            return (
              <div
                key={stat.labelSlot}
                className="ui-hover-card flex flex-col gap-5 rounded-card border border-lilac bg-surface-raised px-8 pt-8 pb-8 shadow-whisper"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-chip bg-tint">
                  <Icon size={22} className="text-brand" aria-hidden strokeWidth={2} />
                </span>
                <div>
                  <div className="text-[40px] leading-none font-semibold tracking-[-0.025em] text-brand lg:text-[46px]">
                    {homeText(copy, stat.valueSlot)}
                  </div>
                  <div className="text-body-sm mt-2.5 text-muted">{homeText(copy, stat.labelSlot)}</div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

import SectionIntro from "@/components/sections/SectionIntro"
import type { RegionContent } from "./types"

export default function RegionNumbersSection({
  numbers,
}: {
  numbers: RegionContent["numbers"]
}) {
  return (
    <section className="bg-tint py-14 md:py-24">
      <div className="site-container">
        <div className="max-w-[860px]">
          <SectionIntro
            align="left"
            eyebrow={numbers.eyebrow}
            heading={numbers.heading}
            lead={numbers.lead}
          />
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {numbers.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-card border border-lilac bg-surface-raised p-8 shadow-whisper"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-[38px] font-semibold leading-none tracking-[-0.025em] text-brand md:text-[46px]">
                  {stat.value}
                </span>
                <span className="mt-3.5 block text-body-sm text-muted">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 max-w-[860px] text-[13px] leading-[1.6] text-faint">
          {numbers.footnote}
        </p>
      </div>
    </section>
  )
}

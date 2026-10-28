import SectionIntro from "@/components/sections/SectionIntro"
import type { RegionContent } from "./types"

/**
 * "We are actually here" — the local-delivery proof. City cards on the left,
 * the regional office on a map to the right.
 */
export default function RegionCoverageSection({
  coverage,
}: {
  coverage: RegionContent["coverage"]
}) {
  return (
    <section className="bg-tint py-14 md:py-24">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-[700px]">
            <SectionIntro align="left" eyebrow={coverage.eyebrow} heading={coverage.heading} />
          </div>
          <p className="max-w-[380px] text-[15.5px] leading-[1.6] text-muted md:flex-none md:pb-1">
            {coverage.lead}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-6 md:mt-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {coverage.locations.map((loc) => (
              <div
                key={loc.city}
                className={`relative rounded-card border bg-surface-raised px-7 py-7 shadow-whisper ${
                  loc.headquarters ? "border-lilac-strong" : "border-lilac"
                }`}
              >
                {loc.headquarters && (
                  <span aria-hidden className="absolute right-6 top-7 flex size-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald opacity-60" />
                    <span className="relative size-2.5 rounded-full bg-emerald" />
                  </span>
                )}
                <p className="text-xl font-semibold text-foreground">{loc.city}</p>
                <p className="mt-3 text-body-sm text-muted">{loc.detail}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-card border border-lilac bg-surface-raised p-3 pb-1 shadow-whisper">
            <div className="relative h-[320px] overflow-hidden rounded-[16px] bg-surface-subtle md:h-[420px]">
              <iframe
                title={`Fruition Services — ${coverage.office.address}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(coverage.office.mapQuery)}&output=embed`}
                className="block size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={coverage.office.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 px-5 py-6 text-body hover:text-brand"
            >
              <span className="text-[17px] font-semibold">{coverage.office.title}</span>
              <span className="text-[14.5px] leading-[1.5] text-muted">
                {coverage.office.address} — meetings by appointment. Open in Google Maps →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

import type { RegionContent } from "./types"

/** The one dark section mid-page: the delivery method, in four steps. */
export default function ProcessStepsSection({
  process,
}: {
  process: RegionContent["process"]
}) {
  return (
    <section className="relative overflow-hidden bg-surface-dark py-14 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 540px at 24% 10%, rgba(128,21,232,0.22) 0%, rgba(128,21,232,0) 70%)",
        }}
      />
      <div className="site-container relative">
        <div className="max-w-[800px]">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-amber">
            {process.eyebrow}
          </p>
          <h2 className="text-section-h2 mt-4 text-balance text-white">{process.heading}</h2>
          <p className="mt-4 text-body-lead text-white/70">{process.lead}</p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-[20px] border border-white/10 bg-white/[0.04] p-7 transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-brand-light/50"
            >
              <span className="flex size-[38px] items-center justify-center rounded-full border border-white/30 font-mono text-sm text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-white/60">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

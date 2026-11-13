export interface EcosystemApp {
  glyph?: string
  label: string
}

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  apps: EcosystemApp[]
  hubLabel?: string
  /** Caption under the constellation, e.g. "2,000+ apps". */
  countLabel?: string
}

const R = 38 // ring radius as % of the square container

/**
 * Radial "ecosystem" constellation: app nodes orbit a central monday.com hub,
 * joined by faint connector lines with a slow travelling pulse. Desktop renders
 * the ring (trig-positioned); mobile falls back to a hub + chip cloud.
 * Pure CSS/SVG, no client JS. See globals: .eco-line / .wc-hub-glow.
 */
export default function EcosystemGrid({
  eyebrow,
  heading,
  subheading,
  apps,
  hubLabel = "monday.com",
  countLabel,
}: Props) {
  if (!apps?.length) return null
  const n = apps.length

  const positioned = apps.map((app, i) => {
    const angle = (-90 + i * (360 / n)) * (Math.PI / 180)
    return {
      ...app,
      x: 50 + R * Math.cos(angle),
      y: 50 + R * Math.sin(angle),
    }
  })

  return (
    <section className="px-4 py-22 bg-[linear-gradient(160deg,var(--color-surface-dark-2)_0%,var(--color-surface-dark)_100%)]">
      <div className="mx-auto max-w-[1040px]">
        <div className="text-center mb-11 mx-auto max-w-[680px]">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light mb-3">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-section-h2 text-white text-balance">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-white/[0.66] text-base leading-[26px] mt-3.5">{subheading}</p>
          )}
        </div>

        {/* Desktop: radial constellation */}
        <div className="relative mx-auto hidden md:block w-full max-w-[560px] aspect-square">
          {/* connector lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {positioned.map((p, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke="var(--color-brand-light)"
                strokeOpacity="0.45"
                strokeWidth="0.4"
                strokeDasharray="2 2"
                className="eco-line"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          </svg>

          {/* app nodes */}
          {positioned.map((p, i) => (
            <div
              key={i}
              className="wc-node absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-[18px] bg-white/[0.06] border border-white/[0.14] backdrop-blur-[4px]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span aria-hidden className="text-2xl leading-none">{p.glyph ?? "•"}</span>
              <span className="font-semibold text-center text-white text-[11px] leading-[14px] mt-1.5 px-1.5">
                {p.label}
              </span>
            </div>
          ))}

          {/* central hub */}
          <div className="absolute flex flex-col items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[152px] h-[152px]">
            <span
              aria-hidden
              className="wc-hub-glow absolute -inset-1.5 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--purple-light)_55%,transparent)_0%,color-mix(in_srgb,var(--purple-light)_0%,transparent)_70%)]"
            />
            <div className="relative flex flex-col items-center justify-center w-full h-full rounded-full bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-light)_100%)] shadow-[0_24px_56px_-20px_color-mix(in_srgb,var(--purple-primary)_80%,transparent)]">
              <span aria-hidden className="text-3xl">📊</span>
              <span className="font-bold text-white text-[15px] mt-1.5">{hubLabel}</span>
            </div>
          </div>
        </div>

        {/* Mobile: hub + chip cloud */}
        <div className="md:hidden flex flex-col items-center">
          <div className="flex flex-col items-center justify-center w-[132px] h-[132px] rounded-full bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-light)_100%)] shadow-[0_24px_48px_-20px_color-mix(in_srgb,var(--purple-primary)_80%,transparent)]">
            <span aria-hidden className="text-[26px]">📊</span>
            <span className="font-bold text-white text-sm mt-1">{hubLabel}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-7">
            {apps.map((app, i) => (
              <span
                key={i}
                className="inline-flex items-center font-semibold gap-[7px] px-3.5 py-2 rounded-full bg-white/[0.06] border border-white/[0.14] text-white text-[13px]"
              >
                <span aria-hidden>{app.glyph ?? "•"}</span>
                {app.label}
              </span>
            ))}
          </div>
        </div>

        {countLabel && (
          <p className="text-center font-semibold text-brand-light text-[15px] mt-11">
            {countLabel}
          </p>
        )}
      </div>
    </section>
  )
}

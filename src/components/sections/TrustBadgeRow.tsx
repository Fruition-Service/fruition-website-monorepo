import type { TrustBadge } from "./types"

interface TrustBadgeRowProps {
  badges?: TrustBadge[]
  /** Render on a dark background (e.g. directly under a gradient hero) */
  theme?: "light" | "dark"
  compact?: boolean
}

/**
 * Text-based credential pills (Platinum Partner, SOC2, GDPR, Ex-monday Staff…).
 * Complements the image-based SecurityBadgeSection; used where the PDF asks for
 * legible, high-visibility trust strips below the hero.
 *
 * Kept flat (no drop shadow) on purpose: these are static labels, and the raised
 * pill read as a button, so visitors clicked them (PostHog dead clicks, Nov 2026).
 */
export default function TrustBadgeRow({
  badges = [],
  theme = "light",
  compact = false,
}: TrustBadgeRowProps) {
  if (!badges.length) return null
  const dark = theme === "dark"

  return (
    <section
      className={`px-4 ${compact ? "py-7" : "py-14"} ${
        dark ? "bg-transparent" : "bg-surface"
      }`}
    >
      <div className="mx-auto flex flex-wrap items-stretch justify-center max-w-[1160px] gap-4">
        {badges.map((b, i) => (
          <div
            key={b._key || i}
            className={`flex items-center rounded-full gap-3 py-3 pl-3.5 pr-[22px] border ${
              dark
                ? "border-white/18 bg-white/7"
                : "border-ui bg-surface-raised"
            }`}
          >
            {/* Verified mark */}
            <span
              aria-hidden
              className={`shrink-0 flex items-center justify-center rounded-full w-[30px] h-[30px] ${
                dark ? "bg-white/14 text-white" : "bg-brand-soft text-brand"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="flex flex-col gap-[1px]">
              <span
                className={`font-semibold text-[15px] leading-[19px] tracking-[-0.01em] ${
                  dark ? "text-white" : ""
                }`}
              >
                {b.label}
              </span>
              {b.detail && (
                <span className={`text-[12.5px] leading-4 ${dark ? "text-white/65" : "text-muted"}`}>
                  {b.detail}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

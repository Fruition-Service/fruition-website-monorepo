import { Fragment } from "react"

export interface WorkflowStep {
  /** Emoji or short glyph shown in the node chip. */
  glyph?: string
  label: string
  sublabel?: string
  /** "hub" renders the central, emphasized monday.com node. */
  tone?: "default" | "hub"
}

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  steps: WorkflowStep[]
  /** Dark surface for the section (recommended for the flow to glow). */
  theme?: "light" | "dark"
  footnote?: string
}

/**
 * Animated left-to-right (stacked on mobile) data-flow rail. Each connector
 * carries a moving pulse to read as data in flight. Pure CSS/SVG, no client
 * JS, reduced-motion safe (see globals: .wc-flow / .wc-node / .wc-hub-glow).
 *
 * Used for the Make.com "scenario" pipeline and the n8n tech-stack rail.
 */
export default function WorkflowConnector({
  eyebrow,
  heading,
  subheading,
  steps,
  theme = "dark",
  footnote,
}: Props) {
  if (!steps?.length) return null

  const dark = theme === "dark"
  const ink = dark ? "#ffffff" : "var(--text-body)"
  const muted = dark ? "rgba(255,255,255,0.66)" : "var(--text-muted-fg)"
  const nodeBg = dark ? "rgba(255,255,255,0.06)" : "var(--surface-raised)"
  const nodeBorder = dark ? "rgba(255,255,255,0.14)" : "var(--border-ui)"

  return (
    <section
      className={`px-4 py-22 ${
        dark
          ? "bg-[linear-gradient(160deg,var(--dark-bg-secondary)_0%,var(--dark-bg)_100%)]"
          : "bg-surface"
      }`}
    >
      <div className="mx-auto max-w-[1100px]">
        {(eyebrow || heading || subheading) && (
          <div className="text-center mx-auto max-w-[720px] mb-13">
            {eyebrow && (
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className={`text-section-h2 text-balance ${dark ? "text-white" : ""}`}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={`text-base leading-[26px] mt-3.5 ${dark ? "text-white/66" : "text-muted"}`}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Rail: row on desktop, column on mobile. Connectors switch axis to match. */}
        <ol className="flex flex-col md:flex-row md:items-stretch list-none m-0 p-0">
          {steps.map((step, i) => {
            const isHub = step.tone === "hub"
            const last = i === steps.length - 1
            return (
              <Fragment key={`${step.label}-${i}`}>
                <li
                  className="wc-node relative flex flex-1 flex-col items-center text-center min-w-0"
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  {/* node chip */}
                  <div
                    className="relative flex flex-col items-center justify-center"
                    style={{
                      width: "100%",
                      maxWidth: isHub ? 220 : 184,
                      padding: isHub ? "26px 20px" : "22px 18px",
                      borderRadius: 20,
                      background: isHub
                        ? "linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-light) 100%)"
                        : nodeBg,
                      border: isHub ? "none" : `1px solid ${nodeBorder}`,
                      boxShadow: isHub
                        ? "0 22px 48px -22px color-mix(in srgb, var(--purple-primary) 70%, transparent)"
                        : dark
                          ? "none"
                          : "0 10px 30px -22px color-mix(in srgb, var(--purple-dark) 40%, transparent)",
                    }}
                  >
                    {isHub && (
                      <span
                        aria-hidden
                        className="wc-hub-glow pointer-events-none absolute"
                        style={{
                          inset: -2,
                          borderRadius: 22,
                          background: "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--purple-light) 55%, transparent) 0%, color-mix(in srgb, var(--purple-light) 0%, transparent) 70%)",
                          zIndex: 0,
                        }}
                      />
                    )}
                    <span aria-hidden style={{ fontSize: isHub ? 30 : 26, lineHeight: 1, position: "relative", zIndex: 1 }}>
                      {step.glyph ?? "•"}
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        position: "relative",
                        zIndex: 1,
                        marginTop: 10,
                        fontSize: isHub ? 16 : 14,
                        color: isHub ? "#ffffff" : ink,
                      }}
                    >
                      {step.label}
                    </span>
                    {step.sublabel && (
                      <span
                        style={{
                          position: "relative",
                          zIndex: 1,
                          marginTop: 4,
                          fontSize: 12,
                          lineHeight: "16px",
                          color: isHub ? "rgba(255,255,255,0.82)" : muted,
                        }}
                      >
                        {step.sublabel}
                      </span>
                    )}
                  </div>
                </li>

                {!last && (
                  <li
                    aria-hidden
                    className="flex flex-none items-center justify-center self-center"
                  >
                    {/* horizontal connector (desktop) */}
                    <span className="wc-flow hidden md:block w-11 h-[3px] rounded-[3px]" />
                    {/* vertical connector (mobile) */}
                    <span className="wc-flow-y md:hidden w-[3px] h-[30px] rounded-[3px] my-1.5" />
                  </li>
                )}
              </Fragment>
            )
          })}
        </ol>

        {footnote && (
          <p className={`text-center text-[13px] mt-9 ${dark ? "text-white/66" : "text-muted"}`}>
            {footnote}
          </p>
        )}
      </div>
    </section>
  )
}

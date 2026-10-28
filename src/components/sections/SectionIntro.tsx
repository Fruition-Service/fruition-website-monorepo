import RichText from "./RichText"

interface SectionIntroProps {
  /** Mono label above the heading — every major section opens with one. */
  eyebrow?: string
  heading?: string
  /** Trailing half of the heading, rendered in voltage purple. */
  headingAccent?: string
  lead?: string
  align?: "center" | "left"
}

/**
 * Eyebrow + H2 + lead, the opening of the long-form industry sections. Shared
 * so the three of them stay on one type scale instead of drifting apart.
 */
export default function SectionIntro({
  eyebrow,
  heading,
  headingAccent,
  lead,
  align = "left",
}: SectionIntroProps) {
  if (!eyebrow && !heading && !headingAccent && !lead) return null
  const centered = align === "center"

  return (
    <div className={centered ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-[18px]">
          {eyebrow}
        </p>
      )}
      {(heading || headingAccent) && (
        <h2 className="text-section-h2 text-body text-balance">
          {heading}
          {headingAccent && <span className="text-brand"> {headingAccent}</span>}
        </h2>
      )}
      {lead && (
        <p
          className={`text-body-lead text-muted mt-5 max-w-[62ch] ${centered ? "mx-auto" : ""}`}
        >
          <RichText text={lead} />
        </p>
      )}
    </div>
  )
}

import { Fragment, type ReactNode } from "react"

interface TextContentSectionProps {
  heading?: string
  headingAccent?: string
  body?: string
  theme?: "light" | "tint"
}

/**
 * Editors write the body in the Studio's plain-text area and reach for
 * `**bold**` out of habit, so render that inline rather than printing the
 * asterisks. Deliberately minimal — bold only, no link/list/heading syntax.
 */
function renderInline(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    // Odd indices are the captured groups, i.e. what sat inside the asterisks.
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** A paragraph that is nothing but one bold run acts as a sub-heading. */
function isStandaloneBold(paragraph: string): boolean {
  return /^\*\*[^*]+\*\*$/.test(paragraph.trim())
}

export default function TextContentSection({
  heading,
  headingAccent,
  body,
  theme = "light",
}: TextContentSectionProps) {
  if (!heading && !body) return null

  // Schema labels this field "use blank lines for paragraphs".
  const paragraphs = (body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className={`px-4 py-20 ${theme === "tint" ? "bg-surface-subtle" : "bg-surface"}`}>
      <div className="mx-auto max-w-[880px]">
        {(heading || headingAccent) && (
          <h2 className="text-section-h2 text-center mb-8">
            {heading}
            {headingAccent && (
              <span className="text-brand"> {headingAccent}</span>
            )}
          </h2>
        )}
        {paragraphs.length > 0 && (
          <div className="flex flex-col gap-5 text-[17px] leading-7 text-body text-center">
            {paragraphs.map((paragraph, i) =>
              isStandaloneBold(paragraph) ? (
                <h3 key={i} className="text-card-title mt-3">
                  {paragraph.replace(/^\*\*|\*\*$/g, "")}
                </h3>
              ) : (
                <p key={i} className="whitespace-pre-line">
                  {renderInline(paragraph)}
                </p>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  )
}

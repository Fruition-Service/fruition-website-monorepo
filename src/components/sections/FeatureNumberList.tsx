"use client"

import type { FeatureNumberItem, SectionTheme } from "./types"

interface FeatureNumberListProps {
  heading?: string
  headingAccent?: string
  /** Force the purple accent to render on its own line. */
  accentBlock?: boolean
  subheading?: string
  items?: FeatureNumberItem[]
  theme?: SectionTheme
  columns?: 2 | 3
}

export default function FeatureNumberList({
  heading,
  headingAccent,
  accentBlock = false,
  subheading,
  items = [],
  theme = "dark",
  columns = 2,
}: FeatureNumberListProps) {
  if (items.length === 0) return null

  const isDark = theme === "dark"
  const bgClass = isDark ? "bg-surface-dark-2" : "bg-surface-subtle"
  const headingClass = isDark ? "text-white" : "text-body"
  const subheadingClass = isDark ? "text-white/80" : "text-muted"
  const titleClass = isDark ? "text-white" : "text-body"
  const descClass = isDark ? "text-white/80" : "text-body"
  const numberClass = isDark ? "text-brand-light" : "text-brand"

  const gridClass =
    columns === 3
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-1 md:grid-cols-2"

  return (
    <section className={`${bgClass} py-20`}>
      <div className="mx-auto px-4 max-w-[1100px]">
        {(heading || headingAccent) && (
          <h2
            className={`text-section-h2 text-center ${headingClass} ${subheading ? "mb-3.5" : "mb-10"}`}
          >
            {heading}
            {/* Copy (and Sanity, which trims) often omits the trailing space. */}
            {heading && headingAccent && !accentBlock && !/\s$/.test(heading) && " "}
            {headingAccent && (
              <span className={`text-brand-light ${accentBlock ? "block" : ""}`.trim()}>
                {headingAccent}
              </span>
            )}
          </h2>
        )}
        {subheading && (
          <p
            className={`text-body text-center mx-auto ${subheadingClass} max-w-[820px] mb-12 whitespace-pre-line`}
          >
            {subheading}
          </p>
        )}
        <div className={`${gridClass} gap-9 gap-y-11`}>
          {items.map((item, i) => (
            <div
              key={item._key || i}
              className="feature-number-card max-w-[460px]"
            >
              <div
                className={`feature-number-card__number text-[40px] font-semibold leading-none mb-2.5 ${numberClass}`}
              >
                {item.number || String(i + 1).padStart(2, "0")}
              </div>
              {item.title && (
                <h3 className={`text-[15px] font-bold mb-1.5 leading-[1.35] ${titleClass}`}>
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p className={`text-[13.5px] leading-[1.55] whitespace-pre-line ${descClass}`}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

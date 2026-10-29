import type { ReactNode } from "react"

/** Fewer cards than this stay in their stacked grid on a phone. */
export const CARD_RAIL_MIN = 3

/**
 * CardRail: the phone swipe rail for sections of long text cards.
 *
 * Below md the cards sit in one horizontal, snapping row (`.fr-swipe-rail` in
 * globals.css) instead of stacking many screens tall; from md the same
 * element is a grid, so pass the md/lg column utilities and the gap in
 * `className`. Never pass `grid` or `grid-cols-1` there: utilities beat the
 * components layer and would switch the rail off.
 *
 * With fewer than CARD_RAIL_MIN cards (`count`) it renders the plain element
 * with `stackedClassName`, the section's original grid, untouched.
 *
 * The rail bleeds to the screen edge by `--fr-rail-gutter`, set here to the
 * 16px `.site-container` gutter. It is a tab stop with a name so keyboard
 * users can scroll it with the arrow keys. A `ul` keeps its list role; any
 * other element becomes a named region.
 */
export default function CardRail({
  label,
  count,
  className = "",
  stackedClassName,
  as: Tag = "div",
  children,
}: {
  label: string
  count: number
  className?: string
  stackedClassName: string
  as?: "div" | "ul"
  children: ReactNode
}) {
  if (count < CARD_RAIL_MIN) return <Tag className={stackedClassName}>{children}</Tag>

  return (
    <Tag
      tabIndex={0}
      aria-label={label.replace(/\s+/g, " ").trim()}
      role={Tag === "ul" ? undefined : "region"}
      className={`fr-swipe-rail [--fr-rail-gutter:1rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${className}`}
    >
      {children}
    </Tag>
  )
}

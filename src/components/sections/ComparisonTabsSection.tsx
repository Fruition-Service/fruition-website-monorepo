"use client"

import { useState } from "react"
import NumberedStepList from "@/components/common/NumberedStepList"
import type { ComparisonTab, ComparisonTabItem, SectionTheme } from "./types"

interface ComparisonTabsSectionProps {
  heading?: string
  subheading?: string
  tabs?: ComparisonTab[]
  theme?: SectionTheme
  /** "tabs" (default) or "sideBySide" for a two-column before/after view */
  layout?: "tabs" | "sideBySide"
  /** Render decorative purple circle bg behind section */
  withPurpleCircle?: boolean
}

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#EF4444" />
      <path
        d="M6.5 6.5L13.5 13.5M13.5 6.5L6.5 13.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#22C55E" />
      <path
        d="M6 10.5L8.5 13L14 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function renderItemText(item: ComparisonTabItem) {
  const number = (item.number || "").trim()
  const hasBoldPrefix =
    number && number !== "✅" && number !== "❌" && number !== "✓" && number !== "✗"
  const description = item.description || item.title || ""
  if (hasBoldPrefix) {
    return (
      <span className="text-[15px] leading-[22px] text-body">
        <span className="font-bold">{number}</span>
        {description ? ` ${description}` : ""}
      </span>
    )
  }
  return (
    <span className="text-[15px] leading-[22px] text-body">
      {description}
    </span>
  )
}

export default function ComparisonTabsSection({
  heading,
  subheading,
  tabs = [],
  theme = "light",
  layout = "tabs",
  withPurpleCircle = false,
}: ComparisonTabsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (tabs.length === 0) return null
  const isDark = theme === "dark"

  const sectionBgClass = isDark ? "bg-surface-dark-2" : "bg-surface"
  const headingColorClass = isDark ? "text-white" : ""
  const subheadingColorClass = isDark ? "text-white/80" : "text-body"

  if (layout === "sideBySide" && tabs.length >= 2) {
    const beforeItems = tabs[0]?.items ?? []
    const afterItems = tabs.slice(1).flatMap((t) => t.items ?? [])

    return (
      <section
        id="our-process"
        className={`py-[80px] px-4 ${sectionBgClass}`}
      >
        <div className="mx-auto max-w-[1040px] flex flex-col items-center gap-[40px]">
          <div className="flex flex-col gap-[12px] items-center text-center w-full">
            {heading && (
              <h2 className={`text-section-h2 text-center ${headingColorClass}`}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={`text-body text-center mx-auto max-w-[820px] ${subheadingColorClass}`}>
                {subheading}
              </p>
            )}
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <ul className="flex flex-col gap-5 list-none">
              {beforeItems.map((item, i) => (
                <li
                  key={item._key || `before-${i}`}
                  className="flex items-start gap-3"
                >
                  <XIcon />
                  {renderItemText(item)}
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-5 list-none">
              {afterItems.map((item, i) => (
                <li
                  key={item._key || `after-${i}`}
                  className="flex items-start gap-3"
                >
                  <CheckIcon />
                  {renderItemText(item)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  const active = tabs[activeIndex]

  return (
    <section
      id="our-process"
      className={`py-[80px] px-4 relative overflow-visible ${sectionBgClass}`}
    >
      {withPurpleCircle && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] max-w-none bg-[url('/images/purple-circle-background.avif')] bg-contain bg-no-repeat bg-center"
        />
      )}
      <div className="relative mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
        {/* Heading + subheading */}
        <div className="flex flex-col gap-[12px] items-center text-center w-full">
          {heading && (
            <h2 className={`text-section-h2 text-center ${headingColorClass}`}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p className={`text-body text-center mx-auto max-w-[820px] ${subheadingColorClass}`}>
              {subheading}
            </p>
          )}
        </div>

        {/* Tab pills + content card */}
        <div className="flex flex-col gap-[24px] items-center w-full max-w-[816px]">
          {/* Tab buttons — allow overflow beyond the 816px content card */}
          <div className="flex justify-center gap-[12px] flex-wrap w-full overflow-visible">
            {tabs.map((tab, i) => {
              const isActive = i === activeIndex
              const inactiveClass = isDark
                ? "bg-white/10 text-white border border-white/20 hover:border-white/60"
                : "bg-surface-raised text-body border border-ui hover:border-brand"
              return (
                <button
                  key={tab._key || tab.label || i}
                  onClick={() => setActiveIndex(i)}
                  // whitespace-nowrap only from md: a label like "Why monday.com
                  // for Project Management" is wider than a phone screen, and
                  // nowrap pushed it past the right edge on six pages.
                  className={`relative inline-flex min-h-[44px] max-w-full shrink items-center justify-center rounded-[99px] px-5 py-2 text-[14px] leading-[1.2] transition-all cursor-pointer md:shrink-0 md:whitespace-nowrap md:px-[31px] md:py-[7px] md:text-[16px] ${
                    isActive
                      ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]"
                      : inactiveClass
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content card */}
          <div
            className={`w-full rounded-card border py-[12px] bg-surface-raised ${
              isDark ? "border-transparent" : "border-ui"
            }`}
          >
            <NumberedStepList
              items={active?.items ?? []}
              containerClassName="w-full p-0"
              stepRowClassName="ui-step-row"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

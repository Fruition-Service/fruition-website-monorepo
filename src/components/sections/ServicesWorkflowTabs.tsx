"use client"

import { useState } from "react"

export interface ServicesWorkflowBenefit {
  emoji: string
  label: string
}

export interface ServicesWorkflowTab {
  key: string
  label: string
  heading: string
  description: string
  benefits: ServicesWorkflowBenefit[]
}

interface ServicesWorkflowTabsProps {
  heading?: string
  tabs: ServicesWorkflowTab[]
}

export default function ServicesWorkflowTabs({ heading, tabs }: ServicesWorkflowTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeIndex]

  return (
    <section className="bg-surface section-y">
      <div className="site-container">
        {heading && (
          <h2 className="text-section-h2 text-center mb-8">
            {heading}
          </h2>
        )}

        {/* Tab pills */}
        <div className="flex justify-center gap-3 flex-wrap mb-10">
          {tabs.map((tab, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={tab.key}
                onClick={() => setActiveIndex(i)}
                className={`relative inline-flex items-center justify-center rounded-[99px] px-[24px] py-[8px] text-[15px] leading-[1.2] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]"
                    : "bg-surface-raised text-body border border-ui hover:border-brand"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Active panel */}
        <div className="rounded-card border border-ui bg-surface-raised p-10">
          <h3 className="text-[28px] font-bold mb-4 leading-[1.2]">
            {active.heading}
          </h3>
          <p className="text-base leading-[26px] text-muted mb-8">
            {active.description}
          </p>
          <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-4">
            Benefits
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {active.benefits.map((b, i) => (
              <div
                key={`${active.key}-b-${i}`}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-chip bg-surface-subtle"
              >
                <div className="text-[28px] leading-none">{b.emoji}</div>
                <div className="text-[13px] leading-[18px] font-medium">
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

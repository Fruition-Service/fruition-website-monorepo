"use client"

import { useState } from "react"

interface Benefit {
  _key?: string
  emoji?: string
  text?: string
}

interface IndustryTab {
  _key?: string
  label?: string
  title?: string
  description?: string
  benefits?: Benefit[]
}

interface IndustryTabsSectionProps {
  heading?: string
  tabs?: IndustryTab[]
}

export default function IndustryTabsSection({
  heading,
  tabs = [],
}: IndustryTabsSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (tabs.length === 0) return null

  const current = tabs[activeTab]

  return (
    <section className="py-[80px] bg-[linear-gradient(135deg,var(--dark-bg)_0%,var(--dark-bg-secondary)_100%)]">
      <div className="site-container">
        {heading && (
          <h2 className="text-section-h2 text-center text-white mb-10">
            {heading}
          </h2>
        )}

        {/* Tab pills */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTab
            return (
              <button
                key={tab._key || idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center justify-center font-bold h-[39px] px-6 rounded-full text-sm cursor-pointer ${
                  isActive
                    ? "bg-white text-brand shadow-[0px_2px_8px_rgba(128,21,232,0.35)]"
                    : "bg-white/15 text-white border border-white/30"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Active tab content card */}
        <div className="mx-auto rounded-card max-w-[900px] bg-white/10 border border-white/20 p-10">
          {current?.title && (
            <h3 className="font-semibold text-white text-2xl mb-4">
              {current.title}
            </h3>
          )}

          {current?.description && (
            <p className="text-base leading-[1.6] text-brand-soft whitespace-pre-line mb-7">
              {current.description}
            </p>
          )}

          {current?.benefits && current.benefits.length > 0 && (
            <>
              <p className="font-semibold text-base text-brand-light mb-4">
                Benefits
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {current.benefits.map((b, i) => (
                  <div key={b._key || i} className="flex items-start gap-2.5">
                    <span className="text-xl leading-none">
                      {b.emoji}
                    </span>
                    <span className="text-sm leading-5 text-white">
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

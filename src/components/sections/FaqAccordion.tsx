"use client"

import { useState } from "react"
import { vercelStegaClean } from "@vercel/stega"
import { faqTabsToPairs, generateFaqJsonLdFromPairs } from "@/lib/faqSchema"
import type { FaqTab } from "./types"

interface FaqAccordionProps {
  heading?: string
  tabs?: FaqTab[]
  /** Mono eyebrow above the heading. */
  eyebrow?: string
  /** Optional lead under the heading (the homepage uses one). */
  intro?: string
  /** Line above the contact email in the aside. */
  contactLead?: string
  contactEmail?: string
  /**
   * Emit FAQPage JSON-LD. Off only where the page already publishes the same
   * questions inside its own JSON-LD graph (/implementation-packages).
   */
  jsonLd?: boolean
}

const DEFAULT_CONTACT_LEAD = "Prefer a person? A consultant will answer in one business day."

/**
 * The site's one FAQ section: a sticky heading and contact aside on the left,
 * numbered native <details> questions on the right, on the shared
 * `.site-container`. The homepage, region pages, templates and hand-built
 * pages all render this; there is no other FAQ layout.
 *
 * Several Sanity pages group their questions into tabs. With more than one
 * non-empty tab, the groups show as chips above the list; with one, no chips.
 *
 * FAQPage JSON-LD is built from the very tabs this component renders, so the
 * structured data can never advertise questions the page does not show.
 * Google requires the Q&A to be visible on the page; markup that contradicts
 * it risks the rich result being dropped or a manual action. (This used to
 * live in FaqHeadJsonLd in the root layout, which opted every route out of
 * static rendering and stamped 124 generic questions onto 257 pages.)
 */
export default function FaqAccordion({
  heading = "Frequently asked questions",
  tabs = [],
  eyebrow = "FAQ",
  intro,
  contactLead = DEFAULT_CONTACT_LEAD,
  contactEmail = "hello@fruitionservices.io",
  jsonLd = true,
}: FaqAccordionProps) {
  const [activeTab, setActiveTab] = useState(0)

  // Drop empty tabs and blank or repeated questions, so what renders and what
  // the JSON-LD contains stay identical.
  const seen = new Set<string>()
  const groups = tabs
    .map((tab) => ({
      key: tab._key,
      label: tab.label,
      items: (tab.items ?? []).filter((it) => {
        const q = it.question?.trim()
        if (!q || !it.answer?.trim() || seen.has(q)) return false
        seen.add(q)
        return true
      }),
    }))
    .filter((g) => g.items.length > 0)

  if (groups.length === 0) return null

  // Edit mode wraps Sanity strings in invisible source-map characters; keep
  // them out of the schema.
  const faqJsonLd = generateFaqJsonLdFromPairs(
    faqTabsToPairs(groups).map((p) => ({ question: vercelStegaClean(p.question), answer: vercelStegaClean(p.answer) })),
  )
  const current = groups[Math.min(activeTab, groups.length - 1)]

  return (
    <section id="faq" className="bg-surface section-y scroll-mt-24">
      {jsonLd && faqJsonLd.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="site-container grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-22">
        <div className="lg:sticky lg:top-28">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {eyebrow}
          </p>
          <h2 className="text-section-h2 text-balance text-foreground">{heading}</h2>
          {intro && <p className="mt-5 max-w-[340px] text-body text-muted">{intro}</p>}
          <div className="mt-9 border-t border-lilac pt-7">
            <p className="mb-4 max-w-[300px] text-body-sm text-muted">{contactLead}</p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-[15px] font-semibold text-brand hover:text-brand-dark"
            >
              {contactEmail} →
            </a>
          </div>
        </div>

        <div className="min-w-0">
          {groups.length > 1 && (
            <div role="tablist" aria-label="FAQ topics" className="mb-4 flex flex-wrap gap-2">
              {groups.map((g, i) => (
                <button
                  key={g.key || i}
                  type="button"
                  role="tab"
                  aria-selected={current === g}
                  onClick={() => setActiveTab(i)}
                  className={`min-h-[44px] cursor-pointer rounded-pill border px-4 text-body-sm transition-colors ${
                    current === g
                      ? "border-brand bg-brand text-white"
                      : "border-lilac text-body hover:border-brand hover:text-brand"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}

          {current.items.map((item, i) => (
            <details key={`${current.key ?? activeTab}-${item._key || item.question}`} className="group border-b border-lilac">
              <summary className="flex cursor-pointer list-none items-start gap-5 py-6 text-body hover:text-brand [&::-webkit-details-marker]:hidden">
                <span className="flex-none pt-1 font-mono text-[13px] font-semibold text-brand-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[17px] font-medium leading-[1.45] tracking-[-0.01em] text-pretty md:text-[19px]">
                  {item.question}
                </span>
                <svg
                  aria-hidden
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-1.5 flex-none text-brand transition-transform duration-200 group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="whitespace-pre-line pb-7 text-base leading-[1.7] text-pretty text-muted md:pl-11">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

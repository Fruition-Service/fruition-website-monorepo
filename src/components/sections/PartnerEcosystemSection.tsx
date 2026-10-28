"use client"

import { urlFor } from "@/sanity/image"

export interface Partner {
  _key?: string
  name: string
  tier?: string
  description?: string
  /** Inline SVG content for wordmark — legacy, not CMS-driven. */
  wordmark?: React.ReactNode
  /** Sanity image reference for partner logo. */
  logo?: { asset?: { _ref: string } }
  /** Background accent used inside the logo plate. */
  tint?: string
}

interface PartnerEcosystemSectionProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  subheading?: string
  partners?: Partner[]
}

export default function PartnerEcosystemSection({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  partners = [],
}: PartnerEcosystemSectionProps) {
  if (partners.length === 0) return null

  return (
    <section className="bg-surface py-[80px]">
      <div className="site-container">
        {eyebrow && (
          <div className="text-center font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-3">
            {eyebrow}
          </div>
        )}
        {(heading || headingAccent) && (
          <h2 className={`text-section-h2 text-center text-body ${subheading ? "mb-4" : "mb-12"}`}>
            {heading}
            {headingAccent && (
              <span className="text-brand">{headingAccent}</span>
            )}
          </h2>
        )}
        {subheading && (
          <p className="text-body text-center mx-auto text-muted max-w-[760px] mb-12">
            {subheading}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {partners.map((p, i) => (
            <div
              key={p._key || i}
              className="rounded-card border border-ui bg-surface-raised flex flex-col dark:shadow-none p-5 shadow-whisper transition-[transform,box-shadow] duration-200"
            >
              <div
                className="flex items-center justify-center rounded-[16px] h-[72px] mb-3.5"
                style={{ background: p.tint || "var(--purple-soft)" }}
              >
                {p.logo?.asset?._ref ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(p.logo).height(80).url()}
                    alt={p.name}
                    className="max-h-10 w-auto"
                  />
                ) : p.wordmark ? (
                  p.wordmark
                ) : (
                  <span className="text-lg font-bold text-body">{p.name}</span>
                )}
              </div>
              <div className="text-base font-bold text-body mb-0.5">
                {p.name}
              </div>
              {p.tier && (
                <div
                  className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand ${p.description ? "mb-1.5" : ""}`}
                >
                  {p.tier}
                </div>
              )}
              {p.description && (
                <p className="text-[13px] leading-normal text-muted">
                  {p.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

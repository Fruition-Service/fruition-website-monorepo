"use client"

import { bookingHref } from "@/lib/bookingLink"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import CalendlySection from "@/components/sections/CalendlySection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import CroSections, { type CroSectionsData } from "@/components/sections/CroSections"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import FramedMedia from "@/components/common/FramedMedia"
import type {
  CapabilityCard,
  ComparisonTab,
  FaqTab,
  MethodologyStep,
  PartnerBadge,
  SanityImageRef,
  SiteSettingsData,
  StatItem,
} from "@/components/sections/types"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

interface TextSection {
  _key?: string
  heading?: string
  headingAccent?: string
  body?: string
}

interface OfficeEntry {
  _key?: string
  city?: string
  country?: string
  flag?: string
  note?: string
}

interface AboutModernProps {
  heroEyebrow?: string
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroHeadingPart2?: string
  heroSubheading?: string
  heroImage?: SanityImageRef
  heroPartnerBadgesLabel?: string
  heroCalloutBadgeLabel?: string
  heroCalloutBadgeText?: string
  heroCalloutOfficesText?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  partnerBadges?: PartnerBadge[]
  stats?: StatItem[]
  textSections?: TextSection[]
  storyEyebrow?: string
  storyHeading?: string
  storyHeadingAccent?: string
  storyCardEyebrowPrefix?: string
  capabilitiesEyebrow?: string
  capabilitiesHeading?: string
  capabilityCards?: CapabilityCard[]
  methodologyEyebrow?: string
  methodologyStepLabel?: string
  methodologyHeading?: string
  methodologySteps?: MethodologyStep[]
  approachEyebrow?: string
  approachHeading?: string
  approachHeadingAccent?: string
  comparisonTabs?: ComparisonTab[]
  globalPresenceEyebrow?: string
  globalPresenceHeading?: string
  globalPresenceHeadingAccent?: string
  globalPresenceBody?: string
  offices?: OfficeEntry[]
  partnerStackEyebrow?: string
  faqHeading?: string
  faqTabs?: FaqTab[]
  calendlyHeading?: string
  calendlySubheading?: string
  calendlyUrl: string
  closingCtaHeading?: string
  closingCtaBody?: string
  closingCtaPrimaryLabel?: string
  closingCtaSecondaryLabel?: string
  closingCtaSecondaryUrl?: string
  croSections?: CroSectionsData | null
  leadershipNote?: string
  leadershipSignatureName?: string
  leadershipSignatureTitle?: string
  siteSettings?: SiteSettingsData | null
}

/** A signed leadership note with a hand-drawn signature flourish (SVG). */
function SignatureNote({
  note,
  name,
  title,
}: {
  note?: string
  name?: string
  title?: string
}) {
  if (!note) return null
  return (
    <section className="px-4 pt-6 pb-10 md:pb-16">
      <figure className="relative mx-auto max-w-[820px] overflow-hidden rounded-card border border-ui bg-surface-raised bg-gradient-to-b from-brand-soft/50 to-surface-raised px-6 py-8 md:px-12 md:py-11 dark:bg-none">
        <span
          aria-hidden
          className="pointer-events-none absolute top-2 left-7 font-bold text-[120px] leading-none text-brand/10"
        >
          &ldquo;
        </span>
        <blockquote className="relative text-xl leading-8 font-medium text-pretty">
          {note}
        </blockquote>
        <figcaption className="relative mt-7 flex items-center gap-4">
          {/* hand-drawn signature flourish */}
          <svg
            width="116"
            height="40"
            viewBox="0 0 116 40"
            fill="none"
            aria-hidden
            role="presentation"
            className="shrink-0 text-brand"
          >
            <path
              d="M3 28c10-14 16-20 20-18s-2 22 4 22 14-26 20-24-4 24 4 24 16-30 24-24c4 3-2 14 6 14 6 0 12-8 18-12"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div className="flex flex-col">
            {name && <span className="text-base font-bold">{name}</span>}
            {title && <span className="text-sm text-muted">{title}</span>}
          </div>
        </figcaption>
      </figure>
    </section>
  )
}

function safeUrl(ref: SanityImageRef, width = 1600): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(width).auto("format").url()
  } catch {
    return null
  }
}

function badgeUrl(b: PartnerBadge): string | null {
  return safeUrl(b.image, 320)
}

function HeroSection({
  eyebrow,
  headingPart1,
  headingAccent,
  headingPart2,
  subheading,
  heroImage,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  partnerBadges = [],
  partnerBadgesLabel,
  calloutBadgeLabel,
  calloutBadgeText,
  calloutOfficesText,
}: {
  eyebrow?: string
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  subheading?: string
  heroImage?: SanityImageRef
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  partnerBadges?: PartnerBadge[]
  partnerBadgesLabel?: string
  calloutBadgeLabel?: string
  calloutBadgeText?: string
  calloutOfficesText?: string
}) {
  const imgUrl = safeUrl(heroImage, 1800)
  const featured = partnerBadges.slice(0, 4)

  return (
    <section className="relative overflow-hidden py-14 md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(1100px_600px_at_12%_-10%,rgba(128,21,232,0.18),transparent_60%),radial-gradient(900px_500px_at_95%_0%,rgba(186,131,240,0.14),transparent_55%),linear-gradient(180deg,var(--color-brand-soft)_0%,var(--color-surface)_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.35] bg-[radial-gradient(circle_at_1px_1px,rgba(128,21,232,0.18)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_70%)]"
      />

      <div className="site-container">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            {eyebrow && (
              <span className="inline-flex h-[34px] items-center gap-2 rounded-pill border border-brand/20 bg-brand-soft px-3.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">
                <span className="h-1.5 w-1.5 rounded-pill bg-brand" />
                {eyebrow}
              </span>
            )}

            <h1 className="text-display mt-5">
              {headingPart1}
              {headingAccent && (
                <>
                  {" "}
                  <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
                    {headingAccent}
                  </span>
                </>
              )}
              {headingPart2 && <> {headingPart2}</>}
            </h1>

            {subheading && (
              <p className="text-body-lead text-muted mt-5 max-w-[560px]">{subheading}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCtaLabel && primaryCtaUrl && (
                <CtaButton href={primaryCtaUrl} label={primaryCtaLabel} variant="primary" />
              )}
              {secondaryCtaLabel && secondaryCtaUrl && (
                <CtaButton href={secondaryCtaUrl} label={secondaryCtaLabel} variant="outline" />
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-7">
              {partnerBadgesLabel && (
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {partnerBadgesLabel}
                </span>
              )}
              <div className="flex flex-wrap items-center gap-5">
                {featured.map((b, i) => {
                  const u = badgeUrl(b)
                  if (!u) return null
                  return (
                    <FramedMedia key={b._key || i} className="dark:!p-1">
                      <span className="relative inline-block h-7 w-[84px]">
                        <Image
                          src={u}
                          alt={b.name || ""}
                          fill
                          sizes="84px"
                          className="object-contain object-left"
                        />
                      </span>
                    </FramedMedia>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-[22px] rounded-[32px] blur-[28px] bg-[linear-gradient(135deg,rgba(128,21,232,0.22),rgba(186,131,240,0.14)_60%,transparent)]"
              />
              <div className="relative aspect-[16/11] overflow-hidden rounded-[28px] border border-brand/15 bg-surface-raised shadow-[0_30px_80px_-30px_rgba(16,0,58,0.45),0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt="Fruition team"
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-surface-dark-2 to-surface-dark" />
                )}
              </div>

              {(calloutBadgeLabel || calloutBadgeText) && (
                <div className="absolute -right-2 -bottom-[22px] flex items-center gap-3 rounded-[18px] border border-brand/20 bg-surface-raised px-4 py-3.5 shadow-[0_18px_40px_-12px_rgba(16,0,58,0.25)] md:-right-4 dark:shadow-none">
                  <div className="h-2.5 w-2.5 rounded-pill bg-brand shadow-[0_0_0_4px_rgba(128,21,232,0.16)]" />
                  <div>
                    {calloutBadgeLabel && (
                      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {calloutBadgeLabel}
                      </div>
                    )}
                    {calloutBadgeText && (
                      <div className="text-sm font-semibold">{calloutBadgeText}</div>
                    )}
                  </div>
                </div>
              )}

              {calloutOfficesText && (
                <div className="absolute -left-[22px] top-7 hidden items-center gap-2.5 rounded-2xl border border-ui bg-surface-raised px-3.5 py-2.5 shadow-[0_18px_40px_-12px_rgba(16,0,58,0.2)] md:flex dark:shadow-none">
                  <div className="mr-0.5 flex">
                    {["bg-brand", "bg-brand-light", "bg-brand-dark"].map((c, i) => (
                      <span
                        key={i}
                        className={`h-6 w-6 rounded-pill border-2 border-surface-raised ${c} ${i ? "-ml-2" : ""}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm font-semibold">{calloutOfficesText}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBand({ stats }: { stats: StatItem[] }) {
  if (!stats?.length) return null
  return (
    <section className="pt-4 pb-10 md:pb-16">
      <div className="site-container">
        <div className="relative grid grid-cols-1 overflow-hidden rounded-[28px] bg-gradient-to-br from-surface-dark to-surface-dark-2 px-6 py-11 text-white shadow-[0_24px_60px_-28px_rgba(16,0,58,0.55)] md:grid-cols-3">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(600px_200px_at_20%_0%,rgba(128,21,232,0.35),transparent_60%),radial-gradient(500px_200px_at_90%_100%,rgba(186,131,240,0.22),transparent_60%)]"
          />
          {stats.map((s, i) => (
            <div
              key={s._key || i}
              className={`relative px-4 py-3 text-center ${
                i === 0 ? "" : "border-t border-white/10 md:border-t-0 md:border-l"
              }`}
            >
              <div className="text-[clamp(38px,4.6vw,56px)] font-bold leading-none tracking-[-0.02em] bg-gradient-to-br from-white to-brand-light bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="mt-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StorySection({
  sections,
  eyebrow,
  heading,
  headingAccent,
  cardEyebrowPrefix,
}: {
  sections: TextSection[]
  eyebrow?: string
  heading?: string
  headingAccent?: string
  cardEyebrowPrefix?: string
}) {
  if (!sections?.length) return null
  return (
    <section className="bg-surface py-10 md:py-16">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          {eyebrow && (
            <span className="inline-flex items-center rounded-pill bg-brand-soft px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2 className="text-section-h2 mt-4">
              {heading}
              {headingAccent && (
                <>
                  {" "}
                  <span className="text-brand">{headingAccent}</span>
                </>
              )}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {sections.map((s, i) => (
            <article
              key={s._key || i}
              className={`relative overflow-hidden rounded-card border border-brand/10 p-6 shadow-[0_10px_30px_-18px_rgba(16,0,58,0.18)] md:p-8 dark:shadow-none ${
                i % 2 === 0
                  ? "bg-surface-raised"
                  : "bg-surface-raised bg-gradient-to-b from-brand-soft/70 to-surface-raised"
              }`}
            >
              <span
                aria-hidden
                className="absolute -top-5 -right-5 h-[110px] w-[110px] rounded-pill bg-brand/10"
              />
              <div className="mb-3.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                0{i + 1}
                {cardEyebrowPrefix && <> · {cardEyebrowPrefix}</>}
              </div>
              <h3 className={`text-section-h3 ${i % 2 === 0 ? "" : "text-surface-dark"}`}>
                {s.heading}
                {s.headingAccent && <span className="text-brand"> {s.headingAccent}</span>}
              </h3>
              <div className="text-body mt-4 whitespace-pre-line">{s.body}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChallengesBento({
  eyebrow,
  heading,
  cards,
}: {
  eyebrow?: string
  heading?: string
  cards: CapabilityCard[]
}) {
  if (!cards?.length) return null
  const layout = [
    "md:col-span-2",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-1",
  ]
  const accent = [
    "bg-brand/10 text-brand",
    "bg-brand-light/15 text-brand-light",
    "bg-brand-dark/10 text-brand-dark",
    "bg-brand-soft text-brand",
    "bg-brand/10 text-brand-dark",
  ]
  return (
    <section className="bg-surface bg-gradient-to-b from-brand-soft/40 to-surface py-14 md:py-24 dark:bg-none">
      <div className="site-container">
        <div className="mb-10 text-center md:mb-14">
          {eyebrow && (
            <span className="inline-flex items-center rounded-pill bg-brand-soft px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">
              {eyebrow}
            </span>
          )}
          <h2 className="text-section-h2 mt-4">{heading}</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((c, i) => {
            const isFeature = i === 0
            return (
              <article
                key={c._key || i}
                className={`${layout[i] ?? "md:col-span-2"} relative flex min-h-[220px] flex-col gap-3 overflow-hidden rounded-card ${
                  isFeature
                    ? "bg-gradient-to-br from-surface-dark to-surface-dark-2 p-8 text-white shadow-[0_30px_60px_-28px_rgba(16,0,58,0.5)]"
                    : "border border-ui bg-surface-raised p-6 shadow-[0_8px_24px_-16px_rgba(16,0,58,0.12)] dark:shadow-none"
                }`}
              >
                {isFeature && (
                  <span
                    aria-hidden
                    className="absolute -right-[50px] -bottom-[60px] h-[220px] w-[220px] rounded-pill bg-brand/40 blur-xl"
                  />
                )}
                <div
                  className={`inline-flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-[26px] ${
                    isFeature
                      ? "border border-white/20 bg-white/10 text-white"
                      : accent[i % accent.length]
                  }`}
                >
                  {c.emoji}
                </div>
                <h3 className={`text-card-title mt-1 ${isFeature ? "text-white" : ""}`}>
                  {c.title}
                </h3>
                <p className={`text-body-sm m-0 ${isFeature ? "text-white/80" : "text-muted"}`}>
                  {c.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MethodologyTimeline({
  eyebrow,
  stepLabel,
  heading,
  steps,
}: {
  eyebrow?: string
  stepLabel?: string
  heading?: string
  steps: MethodologyStep[]
}) {
  if (!steps?.length) return null
  return (
    <section className="relative overflow-hidden bg-surface-dark py-14 text-white md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(800px_400px_at_0%_0%,rgba(128,21,232,0.3),transparent_60%),radial-gradient(700px_400px_at_100%_100%,rgba(186,131,240,0.16),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-[1100px] px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          {eyebrow && (
            <span className="inline-flex items-center rounded-pill bg-white/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
              {eyebrow}
            </span>
          )}
          <h2 className="text-section-h2 mt-4">{heading}</h2>
        </div>

        <ol className="relative m-0 list-none p-0">
          <span
            aria-hidden
            className="absolute left-1/2 top-6 bottom-6 hidden w-0.5 -translate-x-px bg-gradient-to-b from-brand-light/60 to-brand-light/5 md:block"
          />
          {steps.map((step, i) => {
            const left = i % 2 === 0
            return (
              <li
                key={step._key || i}
                className="mb-7 grid grid-cols-1 items-center gap-6 md:grid-cols-2"
              >
                <div className={left ? "md:order-1" : "md:order-2"}>
                  <article className="rounded-card border border-white/10 bg-white/[0.04] p-6 backdrop-blur-[10px]">
                    <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
                      {stepLabel} {step.number}
                    </div>
                    <h3 className="text-card-title mt-1.5 text-white">{step.title}</h3>
                    <p className="text-body-sm mt-2.5 text-white/70">{step.description}</p>
                  </article>
                </div>

                <div
                  className={`hidden md:flex ${
                    left ? "md:order-2 justify-start" : "md:order-1 justify-end"
                  }`}
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-pill bg-gradient-to-br from-brand to-brand-light text-[22px] font-bold text-white shadow-[0_0_0_6px_rgba(128,21,232,0.15)]">
                    {step.number}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function ApproachTabs({
  tabs,
  eyebrow,
  heading,
  headingAccent,
}: {
  tabs: ComparisonTab[]
  eyebrow?: string
  heading?: string
  headingAccent?: string
}) {
  const [active, setActive] = useState(0)
  if (!tabs?.length) return null
  const current = tabs[active]
  return (
    <section className="bg-surface py-14 md:py-24">
      <div className="site-container">
        <div className="mb-10 text-center">
          {eyebrow && (
            <span className="inline-flex items-center rounded-pill bg-brand-soft px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2 className="text-section-h2 mt-4">
              {heading}
              {headingAccent && (
                <>
                  {" "}
                  <span className="text-brand">{headingAccent}</span>
                </>
              )}
            </h2>
          )}
        </div>

        <div className="mx-auto mb-10 flex w-fit max-w-full flex-wrap justify-center gap-2 rounded-[28px] bg-brand-soft p-1.5">
          {tabs.map((t, i) => (
            <button
              key={t._key || i}
              onClick={() => setActive(i)}
              className={`cursor-pointer whitespace-nowrap rounded-pill border-none px-[22px] py-2.5 text-sm font-semibold transition-colors ${
                i === active ? "bg-surface-dark text-white" : "bg-transparent text-surface-dark"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(current?.items ?? []).map((item, i) => (
            <article
              key={item._key || i}
              className="relative overflow-hidden rounded-card border border-ui bg-surface-raised p-6 shadow-[0_8px_24px_-16px_rgba(16,0,58,0.12)] dark:shadow-none"
            >
              <div className="text-[40px] font-bold leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:1.5px_rgba(128,21,232,0.5)]">
                {item.number}
              </div>
              <h3 className="text-card-title mt-3">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function GlobalPresence({
  eyebrow,
  heading,
  headingAccent,
  body,
  offices,
}: {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  body?: string
  offices: OfficeEntry[]
}) {
  if (!offices?.length) return null
  return (
    <section className="bg-surface-subtle bg-gradient-to-b from-surface-subtle to-surface py-14 md:py-24 dark:bg-none">
      <div className="site-container">
        <div className="mb-10 text-center md:mb-14">
          {eyebrow && (
            <span className="inline-flex items-center rounded-pill bg-brand-soft px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2 className="text-section-h2 mt-4">
              {heading}
              {headingAccent && (
                <>
                  {" "}
                  <span className="text-brand">{headingAccent}</span>
                </>
              )}
            </h2>
          )}
          {body && (
            <p className="text-body-lead text-muted mx-auto mt-3 max-w-[640px]">{body}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {offices.map((o, i) => (
            <div
              key={o._key || o.city || i}
              className="rounded-[18px] border border-brand/10 bg-surface-raised p-5 text-left shadow-[0_8px_24px_-18px_rgba(16,0,58,0.18)] dark:shadow-none"
            >
              <div className="text-[28px]">{o.flag}</div>
              <div className="mt-2.5 text-lg font-bold">{o.city}</div>
              <div className="mt-0.5 text-sm text-muted">{o.country}</div>
              {o.note && (
                <div className="mt-2.5 inline-block rounded-pill bg-brand-soft px-2 py-[3px] font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  {o.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerStack({ badges, eyebrow }: { badges: PartnerBadge[]; eyebrow?: string }) {
  if (!badges?.length) return null
  return (
    <section className="bg-surface py-10 md:py-16">
      <div className="site-container">
        {eyebrow && (
          <div className="mb-8 text-center">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {eyebrow}
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-6 rounded-card border border-ui bg-surface-subtle px-6 py-7 md:gap-9">
          {badges.map((b, i) => {
            const u = badgeUrl(b)
            if (!u) return null
            return (
              <FramedMedia key={b._key || i} className="dark:!p-1.5">
                <span className="relative inline-block h-11 w-[130px]">
                  <Image src={u} alt={b.name || ""} fill sizes="130px" className="object-contain" />
                </span>
              </FramedMedia>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ClosingCta({
  calendlyUrl,
  heading,
  body,
  primaryLabel,
  secondaryLabel,
  secondaryUrl,
}: {
  calendlyUrl: string
  heading?: string
  body?: string
  primaryLabel?: string
  secondaryLabel?: string
  secondaryUrl?: string
}) {
  return (
    <section className="bg-surface py-14 md:py-24">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand to-brand-light px-6 py-12 text-center text-white shadow-[0_30px_80px_-30px_rgba(128,21,232,0.55)] md:px-12 md:py-16">
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(500px_200px_at_80%_100%,rgba(255,255,255,0.2),transparent_60%)]"
          />
          <div className="relative">
            {heading && (
              <h2 className="text-section-h2 mx-auto max-w-[720px] text-white">{heading}</h2>
            )}
            {body && (
              <p className="text-body-lead mx-auto mt-4 max-w-[560px] text-white/90">{body}</p>
            )}
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              {primaryLabel && (
                <CtaButton
                  href={calendlyUrl}
                  label={primaryLabel}
                  variant="onDarkPrimary"
                />
              )}
              {secondaryLabel && secondaryUrl && (
                <Link
                  href={secondaryUrl}
                  className="cta-btn cta-btn-on-dark-outline"
                >
                  <span className="cta-btn-icon" aria-hidden>
                    <Play size={18} />
                  </span>
                  <span className="cta-btn-label">{secondaryLabel}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutModern(props: AboutModernProps) {
  const {
    heroEyebrow,
    heroHeadingPart1,
    heroHeadingAccent,
    heroHeadingPart2,
    heroSubheading,
    heroImage,
    heroPartnerBadgesLabel,
    heroCalloutBadgeLabel,
    heroCalloutBadgeText,
    heroCalloutOfficesText,
    primaryCtaLabel,
    primaryCtaUrl,
    secondaryCtaLabel,
    secondaryCtaUrl,
    partnerBadges = [],
    stats = [],
    textSections = [],
    storyEyebrow,
    storyHeading,
    storyHeadingAccent,
    storyCardEyebrowPrefix,
    capabilitiesEyebrow,
    capabilitiesHeading,
    capabilityCards = [],
    methodologyEyebrow,
    methodologyStepLabel,
    methodologyHeading,
    methodologySteps = [],
    approachEyebrow,
    approachHeading,
    approachHeadingAccent,
    comparisonTabs = [],
    globalPresenceEyebrow,
    globalPresenceHeading,
    globalPresenceHeadingAccent,
    globalPresenceBody,
    offices = [],
    partnerStackEyebrow,
    faqHeading,
    faqTabs = [],
    calendlyHeading,
    calendlySubheading,
    calendlyUrl,
    closingCtaHeading,
    closingCtaBody,
    closingCtaPrimaryLabel,
    closingCtaSecondaryLabel,
    closingCtaSecondaryUrl,
    croSections,
    leadershipNote,
    leadershipSignatureName,
    leadershipSignatureTitle,
    siteSettings,
  } = props

  const allBadges =
    partnerBadges.length > 0
      ? partnerBadges
      : siteSettings?.navbarPartnerBadges || []

  return (
    <div>
      <StickyCtaConfig label={croSections?.stickyCtaLabel} mobileLabel={croSections?.stickyCtaMobileLabel} href={bookingHref(croSections?.stickyCtaUrl || calendlyUrl)} />
      <HeroSection
        eyebrow={heroEyebrow}
        headingPart1={heroHeadingPart1}
        headingAccent={heroHeadingAccent}
        headingPart2={heroHeadingPart2}
        subheading={heroSubheading}
        heroImage={heroImage}
        primaryCtaLabel={primaryCtaLabel}
        primaryCtaUrl={bookingHref(primaryCtaUrl || calendlyUrl)}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaUrl={secondaryCtaUrl}
        partnerBadges={allBadges}
        partnerBadgesLabel={heroPartnerBadgesLabel}
        calloutBadgeLabel={heroCalloutBadgeLabel}
        calloutBadgeText={heroCalloutBadgeText}
        calloutOfficesText={heroCalloutOfficesText}
      />
      <StatsBand stats={stats} />
      <StorySection
        sections={textSections}
        eyebrow={storyEyebrow}
        heading={storyHeading}
        headingAccent={storyHeadingAccent}
        cardEyebrowPrefix={storyCardEyebrowPrefix}
      />
      <ChallengesBento
        eyebrow={capabilitiesEyebrow}
        heading={capabilitiesHeading}
        cards={capabilityCards}
      />
      <MethodologyTimeline
        eyebrow={methodologyEyebrow}
        stepLabel={methodologyStepLabel}
        heading={methodologyHeading}
        steps={methodologySteps}
      />
      <ApproachTabs
        tabs={comparisonTabs}
        eyebrow={approachEyebrow}
        heading={approachHeading}
        headingAccent={approachHeadingAccent}
      />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      <GlobalPresence
        eyebrow={globalPresenceEyebrow}
        heading={globalPresenceHeading}
        headingAccent={globalPresenceHeadingAccent}
        body={globalPresenceBody}
        offices={offices}
      />
      <PartnerStack badges={allBadges} eyebrow={partnerStackEyebrow} />
      <CroSections data={croSections} primaryCtaLabel={primaryCtaLabel} primaryCtaUrl={bookingHref(primaryCtaUrl || calendlyUrl)} />
      {faqTabs.length > 0 && faqHeading && (
        <FaqAccordion
          heading={faqHeading}
          tabs={faqTabs}
        />
      )}
      <CalendlySection
        heading={calendlyHeading}
        subheading={calendlySubheading}
        calendlyUrl={calendlyUrl}
      />
      <SignatureNote
        note={leadershipNote}
        name={leadershipSignatureName}
        title={leadershipSignatureTitle}
      />
      <ClosingCta
        calendlyUrl={calendlyUrl}
        heading={closingCtaHeading}
        body={closingCtaBody}
        primaryLabel={closingCtaPrimaryLabel}
        secondaryLabel={closingCtaSecondaryLabel}
        secondaryUrl={closingCtaSecondaryUrl}
      />
    </div>
  )
}

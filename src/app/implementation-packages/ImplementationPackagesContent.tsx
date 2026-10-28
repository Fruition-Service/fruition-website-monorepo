import Image from "next/image"
import Link from "next/link"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import AuditLeadForm from "./AuditLeadForm"
import PackagesSection from "./PackagesSection"
import {
  AT_A_GLANCE,
  CTA,
  EXAMPLE,
  FAQ_INTRO,
  FAQS,
  HERO,
  INDUSTRIES,
  LOGOS,
  METHOD,
  PHONE_HREF,
  REGIONS,
  REVIEWS,
  WHY,
  WHY_NOW,
} from "./content"

/**
 * /implementation-packages, rebuilt from Josh's October 2026 redesign in the
 * site design system. Static copy from ./content; the only client islands are
 * the hero audit form and the package switcher.
 */

const SHELL = "mx-auto max-w-[1148px] px-4"
const EYEBROW = "mb-[18px] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand"

export interface ReviewPhotos {
  /** clientName → resolved image URL, from the caseStudy documents. */
  [clientName: string]: string | undefined
}

function Intro({ eyebrow, heading, lead, center = false }: { eyebrow: string; heading?: string; lead?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className={EYEBROW}>{eyebrow}</p>
      {heading && <h2 className="text-section-h2 text-body text-balance">{heading}</h2>}
      {lead && <p className={`text-body-lead mt-5 max-w-[62ch] text-muted ${center ? "mx-auto" : ""}`}>{lead}</p>}
    </div>
  )
}

function Tick() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ImplementationPackagesContent({ reviewPhotos = {} }: { reviewPhotos?: ReviewPhotos }) {
  return (
    <div>
      <StickyCtaConfig label="Book a free system audit" mobileLabel="Book a free audit" href="#book" />

      {/* Hero + audit form. #book is the anchor every ad, email and CTA uses. */}
      <section id="book" className="scroll-mt-24 bg-surface py-10 md:py-16">
        <div className={`${SHELL} grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14`}>
          <div>
            <p className={EYEBROW}>{HERO.eyebrow}</p>
            <h1 className="text-display text-body text-balance">
              {HERO.h1Before}
              <span className="text-brand">{HERO.h1Accent}</span>
              {HERO.h1After}
            </h1>
            <p className="answer text-body-lead mt-6 text-body">{HERO.answer}</p>
            <p className="text-body mt-4 text-muted">{HERO.lead}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {HERO.bullets.map((b) => (
                <li key={b} className="text-body flex gap-3 text-body">
                  <Tick />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Partnerships and recognition">
              {HERO.chips.map((c) => (
                <li
                  key={c}
                  className="rounded-pill border border-ui bg-surface-raised px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:pt-2">
            <AuditLeadForm />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-ui bg-surface py-8">
        <div className={`${SHELL} flex flex-col items-center gap-5 md:flex-row md:justify-between`}>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">Trusted by teams at</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:gap-x-10">
            {LOGOS.map((l) => (
              <li key={l.alt}>
                <Image
                  src={l.src}
                  alt={l.alt}
                  width={l.width}
                  height={l.height}
                  unoptimized
                  className="h-[30px] w-auto opacity-80 grayscale md:h-[34px]"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fruition at a glance */}
      <section className="bg-surface py-14 md:py-24">
        <div className={`${SHELL} grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14`}>
          <div>
            <p className={EYEBROW}>Fact sheet</p>
            <h2 className="text-section-h2 text-body">Fruition at a glance</h2>
          </div>
          <dl className="border-t border-ui">
            {AT_A_GLANCE.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-dashed border-ui py-3.5 md:grid-cols-[200px_1fr] md:gap-6">
                <dt className="text-caption font-semibold text-body">{k}</dt>
                <dd className="text-body-sm text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Worked example */}
      <section id="example" className="bg-surface-subtle py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={EXAMPLE.eyebrow} heading={EXAMPLE.heading} lead={EXAMPLE.lead} />
          <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {EXAMPLE.steps.map((s, i) => (
              <li key={s.title} className="rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {String(i + 1).padStart(2, "0")} · {s.tag}
                </p>
                <h3 className="text-card-title mt-3 text-body">{s.title}</h3>
                <p className="text-body-sm mt-3 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why implementation matters */}
      <section id="why-now" className="bg-surface py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={WHY_NOW.eyebrow} heading={WHY_NOW.heading} />
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col gap-4">
              {WHY_NOW.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="text-body text-muted">
                  {p}
                </p>
              ))}
            </div>
            <div className="rounded-card border border-ui bg-surface-raised p-6 md:p-8">
              <h3 className="text-card-title text-body">{WHY_NOW.signsHeading}</h3>
              <ul className="mt-4">
                {WHY_NOW.signs.map((s) => (
                  <li key={s} className="text-body-sm flex gap-3 border-b border-dashed border-ui py-3 text-body last:border-b-0">
                    <Tick />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packages: cards, switcher and the "See what's included" fold-out */}
      <PackagesSection />

      {/* CTA directly below the packages (27 Oct review) */}
      <section className="bg-surface py-14 md:py-20">
        <div className={SHELL}>
          <div className="rounded-card border border-ui bg-cta-blue-soft px-6 py-10 text-center md:px-12 md:py-14">
            <h2 className="text-section-h2 text-body text-balance">{CTA.heading}</h2>
            <p className="text-body-lead mx-auto mt-4 max-w-[60ch] text-muted">{CTA.body}</p>
            <div className="mx-auto mt-8 flex max-w-[560px] flex-col gap-3 md:flex-row md:justify-center">
              <Link href="#book" className="cta-btn cta-btn-primary md:flex-1">
                <span className="cta-btn-label">{CTA.primary}</span>
              </Link>
              <a href={PHONE_HREF} className="cta-btn cta-btn-outline md:flex-1">
                <span className="cta-btn-label">{CTA.secondary}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Method */}
      <section id="method" className="bg-surface-subtle py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={METHOD.eyebrow} heading={METHOD.heading} lead={METHOD.lead} />
          <ol className="mt-10 border-t border-ui">
            {METHOD.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[48px_1fr] gap-4 border-b border-dashed border-ui py-5 md:grid-cols-[72px_280px_1fr] md:gap-6">
                <span className="font-mono text-sm font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-body font-semibold text-body">{s.title}</h3>
                <p className="text-body-sm col-start-2 text-muted md:col-start-auto">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="bg-surface py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={INDUSTRIES.eyebrow} heading={INDUSTRIES.heading} lead={INDUSTRIES.lead} />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="ui-hover-card flex flex-col rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-7"
              >
                <h3 className="text-card-title text-body">{it.title}</h3>
                <p className="text-body-sm mt-3 text-muted">{it.body}</p>
                <span className="mt-auto pt-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-brand">
                  {it.link} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Fruition */}
      <section id="why" className="bg-surface-subtle py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={WHY.eyebrow} heading={WHY.heading} />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {WHY.items.map((w) => (
              <div key={w.title} className="rounded-card border border-ui bg-surface-raised p-6 md:p-8">
                <h3 className="text-card-title text-body">{w.title}</h3>
                <p className="text-body-sm mt-3 text-muted">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-surface py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={REVIEWS.eyebrow} heading={REVIEWS.heading} />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {REVIEWS.items.map((r) => {
              const photo = reviewPhotos[r.name]
              return (
                <figure key={r.name} className="flex flex-col rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-8">
                  <blockquote className="text-body text-body">&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t border-dashed border-ui pt-5">
                    {photo && (
                      <Image src={photo} alt="" width={44} height={44} unoptimized className="h-11 w-11 rounded-pill object-cover" />
                    )}
                    <span className="flex flex-col">
                      <b className="text-caption font-semibold text-body">{r.name}</b>
                      <span className="text-caption text-muted">{r.role}</span>
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section id="regions" className="border-y border-ui bg-surface-subtle py-10 md:py-14">
        <div className={SHELL}>
          <p className={`${EYEBROW} text-center`}>{REGIONS.eyebrow}</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {REGIONS.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[44px] items-center rounded-pill border border-ui bg-surface-raised px-4 text-caption text-body transition-colors hover:border-brand hover:text-brand"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ. Its FAQPage schema is part of the page's single JSON-LD graph. */}
      <section id="faq" className="bg-surface py-14 md:py-24">
        <div className={`${SHELL} grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14`}>
          <Intro eyebrow={FAQ_INTRO.eyebrow} heading={FAQ_INTRO.heading} />
          <div className="border-t border-ui">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0} className="group border-b border-ui">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-body marker:hidden [&::-webkit-details-marker]:hidden">
                  <h3 className="text-body font-semibold text-body">{f.q}</h3>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-ui text-brand transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-body-sm pb-5 pr-10 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

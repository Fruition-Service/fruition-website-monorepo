import Image from "next/image"
import Link from "next/link"
import { stegaClean } from "@sanity/client/stega"
import StickyCtaConfig from "@/components/sections/StickyCtaContext"
import ClosingCtaSection from "@/components/sections/ClosingCtaSection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import AuditLeadForm from "./AuditLeadForm"
import PackagesSection from "./PackagesSection"
import { LOGOS, PHONE_HREF, aud, groupFrom, usd, type PageContent } from "./content"

/**
 * /implementation-packages: Fruition's pricing page (/pricing redirects here).
 * Josh's October 2026 package redesign sits inside a price overview, the
 * starting prices of every other service line and the licence hand-off.
 * Copy comes in as `content`: the Sanity document laid over the defaults in
 * ./content (see ./sanityContent). The only client islands are the hero audit
 * form and the package switcher.
 */

const SHELL = "site-container"
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

export default function ImplementationPackagesContent({
  content: c,
  reviewPhotos = {},
}: {
  content: PageContent
  reviewPhotos?: ReviewPhotos
}) {
  const jumpLinks = [
    { href: "#packages", label: "monday.com packages" },
    ...c.servicePrices.map((g) => ({ href: `#${g.id}`, label: g.eyebrow })),
    { href: "#licences", label: "Licences" },
    { href: "#faq", label: "FAQ" },
  ]
  return (
    <div>
      <StickyCtaConfig label="Book a free system audit" mobileLabel="Book a free audit" href="#book" />

      {/* Hero + audit form. #book is the anchor every ad, email and CTA uses. */}
      <section id="book" className="scroll-mt-24 bg-surface py-10 md:py-16">
        <div className={`${SHELL} grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14`}>
          <div>
            <p className={EYEBROW}>{c.hero.eyebrow}</p>
            <h1 className="text-display text-body text-balance">
              {c.hero.h1Before}
              <span className="text-brand">{c.hero.h1Accent}</span>
              {c.hero.h1After}
            </h1>
            <p className="answer text-body-lead mt-6 text-body">{c.hero.answer}</p>
            <p className="text-body mt-4 text-muted">{c.hero.lead}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {c.hero.bullets.map((b) => (
                <li key={b} className="text-body flex gap-3 text-body">
                  <Tick />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Partnerships and recognition">
              {c.hero.chips.map((c) => (
                <li
                  key={c}
                  className="rounded-pill border border-ui bg-surface-raised px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
            <nav aria-label="Pricing sections" className="mt-8 border-t border-ui pt-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">{c.hero.jumpLabel}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {jumpLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="inline-flex min-h-[44px] items-center rounded-pill border border-ui bg-surface-raised px-4 text-caption text-body transition-colors hover:border-brand hover:text-brand"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="lg:pt-2">
            <AuditLeadForm copy={c.form} />
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

      {/* Pricing at a glance: one card per service line */}
      <section id="overview" className="bg-surface py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={c.overview.eyebrow} heading={c.overview.heading} lead={c.overview.lead} />
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <li>
              <PriceCard
                href="#packages"
                title={c.overview.mondayTitle}
                note={c.overview.mondayNote}
                price={usd(Math.min(...c.packages.map((p) => p.basePriceUsd)))}
                featured
                from={c.overview.from}
                view={c.overview.view}
              />
            </li>
            {c.servicePrices.map((g) => (
              <li key={g.id}>
                <PriceCard href={`#${g.id}`} title={g.eyebrow} note={c.overview.groupNote} price={aud(groupFrom(g))} from={c.overview.from} view={c.overview.view} />
              </li>
            ))}
            <li>
              <PriceCard href="#licences" title={c.overview.licencesTitle} note={c.overview.licencesNote} label={c.overview.licencesPrice} from={c.overview.from} view={c.overview.view} />
            </li>
          </ul>
        </div>
      </section>

      {/* monday.com packages: cards, switcher and the "See what's included" fold-out */}
      <PackagesSection intro={c.packagesIntro} packages={c.packages} rows={c.compareRows} />

      {/* Starting prices for every other service line */}
      <section id="services" className="scroll-mt-24 bg-surface py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={c.servicesIntro.eyebrow} heading={c.servicesIntro.heading} lead={c.servicesIntro.lead} />
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {c.servicePrices.map((g) => (
              <article
                key={g.id}
                id={g.id}
                className="flex scroll-mt-24 flex-col rounded-card border border-ui bg-surface-raised p-6 shadow-card md:p-8"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">{g.eyebrow}</p>
                <h3 className="text-card-title mt-3 text-body">{g.heading}</h3>
                <p className="text-body-sm mt-2 text-muted">{g.lead}</p>
                <ul className="mt-5 border-t border-ui">
                  {g.items.map((i) => (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        className="group flex min-h-[52px] items-center justify-between gap-4 border-b border-dashed border-ui py-3"
                      >
                        <span className="text-body-sm text-body transition-colors group-hover:text-brand">{i.name}</span>
                        <span className="flex shrink-0 flex-col items-end">
                          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">{c.servicesIntro.priceCaption}</span>
                          <span className="text-body font-semibold text-body">{aud(i.fromAud)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={g.href}
                  className="mt-auto inline-flex min-h-[44px] items-center self-start pt-3 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-brand hover:text-brand-dark"
                >
                  {g.linkLabel} →
                </Link>
              </article>
            ))}
          </div>
          <p className="text-caption mx-auto mt-6 max-w-[80ch] text-center text-muted">{c.servicesIntro.footnote}</p>
        </div>
      </section>

      {/* Licences: separate from service fees, handled on their own page */}
      <section id="licences" className="scroll-mt-24 bg-surface pb-14 md:pb-24">
        <div className={SHELL}>
          <div className="flex flex-col gap-6 rounded-card border border-ui bg-brand-soft p-6 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className={EYEBROW}>{c.licences.eyebrow}</p>
              <h2 className="text-section-h3 text-body text-balance">{c.licences.heading}</h2>
              <p className="text-body-sm mt-3 max-w-[60ch] text-muted">{c.licences.body}</p>
            </div>
            <Link href={c.licences.href} className="cta-btn cta-btn-outline shrink-0">
              <span className="cta-btn-label">{c.licences.cta}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How pricing works */}
      <section id="how-pricing-works" className="bg-surface-subtle py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={c.howPricingWorks.eyebrow} heading={c.howPricingWorks.heading} />
          <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {c.howPricingWorks.items.map((it, i) => (
              <li key={it.title} className="rounded-card border border-ui bg-surface-raised p-6">
                <p className="font-mono text-xs font-semibold text-brand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-card-title mt-3 text-body">{it.title}</h3>
                <p className="text-body-sm mt-3 text-muted">{it.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Method */}
      <section id="method" className="bg-surface py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={c.method.eyebrow} heading={c.method.heading} lead={c.method.lead} />
          <ol className="mt-10 border-t border-ui">
            {c.method.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[48px_1fr] gap-4 border-b border-dashed border-ui py-5 md:grid-cols-[72px_280px_1fr] md:gap-6">
                <span className="font-mono text-sm font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-body font-semibold text-body">{s.title}</h3>
                <p className="text-body-sm col-start-2 text-muted md:col-start-auto">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why Fruition */}
      <section id="why" className="bg-surface-subtle py-14 md:py-24">
        <div className={SHELL}>
          <Intro eyebrow={c.why.eyebrow} heading={c.why.heading} />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {c.why.items.map((w) => (
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
          <Intro eyebrow={c.reviews.eyebrow} heading={c.reviews.heading} />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {c.reviews.items.map((r) => {
              const photo = reviewPhotos[stegaClean(r.name)]
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

      {/* Fruition at a glance: the fact sheet answer engines quote */}
      <section className="bg-surface-subtle py-14 md:py-24">
        <div className={`${SHELL} grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14`}>
          <div>
            <p className={EYEBROW}>{c.atAGlance.eyebrow}</p>
            <h2 className="text-section-h2 text-body">{c.atAGlance.heading}</h2>
          </div>
          <dl className="border-t border-ui">
            {c.atAGlance.rows.map(({ label: k, value: v }) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-dashed border-ui py-3.5 md:grid-cols-[200px_1fr] md:gap-6">
                <dt className="text-caption font-semibold text-body">{k}</dt>
                <dd className="text-body-sm text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Regions */}
      <section id="regions" className="border-y border-ui bg-surface py-10 md:py-14">
        <div className={SHELL}>
          <p className={`${EYEBROW} text-center`}>{c.regions.eyebrow}</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {c.regions.links.map((l) => (
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
      <FaqAccordion
        eyebrow={c.faqIntro.eyebrow}
        heading={c.faqIntro.heading}
        tabs={[{ items: c.faqs.map(({ q, a }) => ({ question: q, answer: a })) }]}
        jsonLd={false}
      />

      <ClosingCtaSection
        fallback={{
          eyebrow: c.cta.eyebrow,
          heading: c.cta.heading,
          headingAccent: c.cta.headingAccent,
          lead: c.cta.body,
          primaryLabel: c.cta.primary,
          primaryUrl: "#book",
          secondaryLabel: c.cta.secondary,
          secondaryUrl: PHONE_HREF,
        }}
      />
    </div>
  )
}

function PriceCard({
  href,
  title,
  note,
  price,
  label,
  featured = false,
  from,
  view,
}: {
  href: string
  title: string
  note: string
  price?: string
  label?: string
  featured?: boolean
  from: string
  view: string
}) {
  return (
    <a
      href={href}
      className={`ui-hover-card flex h-full flex-col rounded-card border bg-surface-raised p-6 shadow-card md:p-7 ${featured ? "border-brand" : "border-ui"}`}
    >
      <h3 className="text-card-title text-body">{title}</h3>
      <p className="text-body-sm mt-2 text-muted">{note}</p>
      <p className="mt-auto flex flex-wrap items-baseline gap-x-2 border-t border-dashed border-ui pt-5">
        {price ? (
          <>
            <span className="text-caption text-muted">{from}</span>
            <span className="text-section-h3 font-semibold text-body">{price}</span>
          </>
        ) : (
          <span className="text-card-title font-semibold text-body">{label}</span>
        )}
      </p>
      <span className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-brand">{view} →</span>
    </a>
  )
}

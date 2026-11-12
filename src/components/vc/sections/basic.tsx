import { vercelStegaClean } from "@vercel/stega"
import Link from "next/link"
import LeadForm from "@/components/sections/LeadForm"
import { VcFilteredProof } from "./interactive"
import { VcHeroSearch } from "./hubs"
import VcAskPrompt from "./VcAskPrompt"
import { VcNodes } from "./nodes"
import { Acc, Arrow, Badge, Btn, Ctas, Head, QuoteAvatar, SImg, Sec, SvgIcon, safeSvg } from "../primitives"
import type {
  VcAuditData,
  VcCardsData,
  VcCasesData,
  VcClosingData,
  VcHeroData,
  VcItemData,
  VcLogoData,
  VcLogosData,
  VcProductsData,
  VcProofData,
  VcQuoteData,
  VcStepsData,
} from "../types"

/** Ticked list used inside steps and cards. */
function Ticks({ items, cls = "ticks", icon = "chk" }: { items?: string[]; cls?: string; icon?: string }) {
  if (!items?.length) return null
  return (
    <ul className={cls || undefined}>
      {items.map((x, i) => (
        <li key={i}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={icon === "x" ? "M7 7l10 10M17 7L7 17" : "M5 12.5l4.5 4.5L19 7.5"} />
          </svg>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ hero */

function Stats({ stats, cls }: { stats: NonNullable<VcHeroData["stats"]>; cls: string }) {
  return (
    <div className={cls}>
      <div className="wrap">
        {stats.map((s, i) => (
          <div className="stat" key={s._key ?? i}>
            <b>
              <Acc text={s.value} em />
            </b>
            {s.label && <p className="small">{s.label}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function Trust({ label, logos }: { label?: string; logos: VcLogoData[] }) {
  const run = (hidden: boolean) => (
    <div className="hm-run" aria-hidden={hidden || undefined}>
      {logos.map((l, i) => (
        <div key={l._key ?? i}>
          <SImg image={l.image} width={140} height={40} fit="max" alt={l.alt} />
        </div>
      ))}
    </div>
  )
  return (
    <div className="hm-trust">
      <div className="wrap">
        <div className="hm-trust-h">{label && <span className="label">{label}</span>}</div>
      </div>
      <div className="hm-marquee" aria-label="Client logos">
        <div className="hm-track anim">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </div>
  )
}

/** Region hero map: the generated dotted SVG (inline, its dots are styled by CSS) with pins or a label. */
function RegionMap({ s }: { s: VcHeroData }) {
  const kind = vercelStegaClean(s.mapKind ?? "rmap")
  const raw = safeSvg(s.mapSvg)
  const svg = raw ? <span className="vc-svg" dangerouslySetInnerHTML={{ __html: raw }} /> : null
  if (kind === "art") {
    return (
      <div className="hero-art">
        <div className="frame bare">
          <div className="art map" role="img" aria-label={vercelStegaClean(s.mapAria ?? "")} style={{ aspectRatio: vercelStegaClean(s.mapAspect ?? "") || undefined }}>
            {svg}
            {s.mapLabel && (
              <span className="maplabel label">
                {s.mapFlag && <span className="flag" aria-hidden="true">{vercelStegaClean(s.mapFlag)}</span>} {s.mapLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="hero-art">
      <div className="frame bare">
        <div className="mapbox">
          <div className="rmap" style={{ "--ar": vercelStegaClean(s.mapAspect ?? "1") } as React.CSSProperties}>
            {svg}
            {(s.pins ?? []).map((p, i) => (
              <span key={p._key ?? i} className={`pin${p.on ? " on" : ""}`} data-s={vercelStegaClean(p.side ?? "r")} style={{ left: `${p.left}%`, top: `${p.top}%` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/vc/fruit-mark.svg" alt="" />
                <b>{p.label}</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function VcHero({ s }: { s: VcHeroData }) {
  const variant = vercelStegaClean(s.variant ?? "")
  const artClass = vercelStegaClean(s.artClass ?? "")
  const isPh = variant === "ph"
  const stats = s.stats?.length ? s.stats : null
  const frameBox = s.frameImage?.asset ? (
    <div className={`frame${variant.includes("hc") ? " hc-shot" : ""}`}>
      {!!s.creds?.length && (
        <div className={`creds${s.creds.length === 1 ? " one" : ""}`}>
          {s.creds.map((c, i) => (
            <SImg key={c._key ?? i} image={c.image} width={160} height={50} fit="max" alt={c.alt} lazy={false} />
          ))}
        </div>
      )}
      <SImg image={s.frameImage} width={variant.includes("hc") ? 1100 : 720} priority />
      {s.chipValue && (
        <div className="chip">
          <span className="dot" />
          <div>
            <b>{s.chipValue}</b>
            {s.chipLabel && <div className="label">{s.chipLabel}</div>}
          </div>
        </div>
      )}
    </div>
  ) : null
  if (variant.includes("hc")) {
    // Centred hero (careers, blog, FAQs): copy above, optional wide photo below.
    return (
      <section className={`hero ${variant}`.trim()} data-sec="hero">
        <div className="wrap">
          <div className="hc-in">
            <Badge>{s.badge}</Badge>
            <h1 className="display">
              <Acc text={s.heading} />
            </h1>
            {s.lead && <p className="lead">{s.lead}</p>}
            <Ctas ctas={s.ctas} />
            {s.searchPlaceholder && <VcHeroSearch placeholder={s.searchPlaceholder} clearable={!!s.searchClear} />}
          </div>
          {frameBox}
        </div>
      </section>
    )
  }
  return (
    <section className={`hero ${variant}`.trim()} data-sec="hero">
      <div className="wrap hero-grid">
        <div>
          <Badge>{s.badge}</Badge>
          <h1 className="display">
            <Acc text={s.heading} />
          </h1>
          {s.lead && <p className="lead">{s.lead}</p>}
          <Ctas ctas={s.ctas} />
        </div>
        {s.form ? (
          <div className="frame">
            <LeadForm
              variant="vc"
              source="contact-us"
              showCompany={false}
              heading={s.form.heading}
              subheading={s.form.subheading}
              submitLabel={s.form.submitLabel}
              successMessage={s.form.successMessage}
              fields={[
                // Keys the monday sink reads: "Phone" fills the phone column, "Message" the enquiry.
                { label: s.form.phoneLabel ?? "Phone", name: "Phone", inputType: "tel", autoComplete: "tel" },
                { label: s.form.messageLabel ?? "Message", name: "Message", type: "textarea", required: true, placeholder: s.form.messagePlaceholder },
              ]}
            />
          </div>
        ) : s.stage?.length ? (
          <div className={vercelStegaClean(s.stageClass ?? "hero-art")} aria-hidden="true">
            <VcNodes nodes={s.stage} />
          </div>
        ) : s.prompt ? (
          <VcAskPrompt p={s.prompt} />
        ) : s.mapSvg ? (
          <RegionMap s={s} />
        ) : s.frameSvg ? (
          <div className="hero-art">
            <div className={`frame ${vercelStegaClean(s.frameClass ?? "")}`.trim()}>
              {!!s.creds?.length && (
                <div className={`creds ${vercelStegaClean(s.credsClass ?? "")}`.trim()}>
                  {s.creds.map((c, i) => (
                    <SImg key={c._key ?? i} image={c.image} width={160} height={50} fit="max" alt={c.alt} lazy={false} className={vercelStegaClean(c.shape ?? "") || undefined} />
                  ))}
                </div>
              )}
              <div className="art" role="img" aria-label={vercelStegaClean(s.frameSvgAria ?? "")}>
                <SvgIcon svg={s.frameSvg} className="vc-svg" />
              </div>
              {s.chipValue && (
                <div className="chip">
                  <span className="dot" />
                  <div>
                    <b>{s.chipValue}</b>
                    {s.chipLabel && <div className="label">{s.chipLabel}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : s.frameImage?.asset ? (
          <div className="hero-art">
            <div className="frame">
              {!!s.creds?.length && (
                <div className="creds">
                  {s.creds.map((c, i) => (
                    <SImg key={c._key ?? i} image={c.image} width={160} height={50} fit="max" alt={c.alt} lazy={false} />
                  ))}
                </div>
              )}
              <SImg image={s.frameImage} width={720} priority />
              {s.chipValue && (
                <div className="chip">
                  <span className="dot" />
                  <div>
                    <b>{s.chipValue}</b>
                    {s.chipLabel && <div className="label">{s.chipLabel}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`hero-art${isPh ? " ph-art" : ""}`}>
            <SImg image={s.art} width={560} className={`hero-3d ${artClass}`.trim()} alt="" priority />
            {!!s.floatBadges?.length && (
              <div className={`ph-badge ${vercelStegaClean(s.floatBadgeClass ?? "")}`.trim()}>
                {s.floatBadges.map((b, i) => (
                  <SImg key={b._key ?? i} image={b.image} width={200} alt={b.alt} lazy={false} className={vercelStegaClean(b.shape ?? "") || undefined} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {stats && <Stats stats={stats} cls={`stats${stats.length === 3 ? " n3" : ""}`} />}
      {s.statsNote && <p className="label foot-note wrap">{s.statsNote}</p>}
      {s.spacer && <div className="vc-spacer" />}
      {!!s.trustLogos?.length && <Trust label={s.trustLabel} logos={s.trustLogos} />}
    </section>
  )
}

/* ----------------------------------------------------------------- logos */

export function VcLogos({ s }: { s: VcLogosData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="clients">
      <Head head={s.head} />
      <div className={`logos ${vercelStegaClean(s.gridClass ?? "")}`.trim()}>
        {(s.logos ?? []).map((l, i) => (
          <div key={l._key ?? i}>
            <SImg image={l.image} width={200} height={40} fit="max" alt={l.alt} className={vercelStegaClean(l.shape ?? "") || undefined} />
          </div>
        ))}
        {s.more && <div className="more">{s.more}</div>}
      </div>
    </Sec>
  )
}

/* ----------------------------------------------------------------- steps */

export function VcSteps({ s }: { s: VcStepsData }) {
  const layout = vercelStegaClean(s.layout ?? "steps")
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="why">
      <Head head={s.head} />
      <div className={layout}>
        {(s.items ?? []).map((it, i) => (
          <div className="step" key={it._key ?? i}>
            {typeof it.bar === "number" && (
              <div className="bar">
                <i style={{ "--w": `${Math.max(0, Math.min(100, it.bar))}%` } as React.CSSProperties} />
              </div>
            )}
            {it.n && <span className="n">{it.n}</span>}
            {it.title && <h3 className={vercelStegaClean(s.titleClass ?? "") === "title" ? "title" : "h3"}>{it.title}</h3>}
            {it.body && <p className="body">{it.body}</p>}
            <Ticks items={it.bullets} />
            {it.meta && <span className="label">{it.meta}</span>}
          </div>
        ))}
      </div>
    </Sec>
  )
}

/* ------------------------------------------------------------ case studies */

export function VcCases({ s }: { s: VcCasesData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="cases">
      <Head head={s.head} />
      <div className="cs2">
        {(s.cases ?? []).filter(Boolean).map((c, ci) => (
          <article className="csc" key={`${c._id}-${ci}`}>
            <div className="csc-img">
              <SImg image={c.photo} width={660} alt="" />
              <SImg image={c.logo} width={220} className="csc-mark" alt={c.logo?.alt ?? `${vercelStegaClean(c.client ?? "")} logo`} />
            </div>
            <div className="csc-b">
              {c.label && <span className="label">{c.label}</span>}
              {c.client && <h3 className="h3">{c.client}</h3>}
              {c.body && <p className="body">{c.body}</p>}
              {!!c.results?.length && (
                <div className="csc-res">
                  {c.results.map((r, i) => (
                    <div key={r._key ?? i}>
                      <b>{r.value}</b>
                      <span>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {!!c.tags?.length && (
                <div className="csc-tags">
                  {c.tags.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Sec>
  )
}

/* ----------------------------------------------------------- audit band */

export function VcAudit({ s }: { s: VcAuditData }) {
  const cls = `cta-band${vercelStegaClean(s.tone ?? "") === "alt" ? " alt" : ""}`
  return (
    <section className={cls} data-sec="audit">
      <div className="wrap">
        <div className="audit">
          <div>
            <h2>
              <Acc text={s.heading} em />
            </h2>
            {s.text && <p>{s.text}</p>}
          </div>
          <Btn cta={s.cta ? { arrow: true, ...s.cta } : null} />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- cards */

function CardLink({ it }: { it: VcItemData }) {
  if (!it.href) return null
  const href = vercelStegaClean(it.href)
  // No label: an arrow-only link, named for screen readers by the card title.
  const aria = it.linkLabel ? undefined : vercelStegaClean(it.title ?? "")
  const inner = (
    <>
      {it.linkLabel}
      <Arrow />
    </>
  )
  return href.startsWith("/") ? (
    <Link className="link" href={href} aria-label={aria}>
      {inner}
    </Link>
  ) : (
    <a className="link" href={href} aria-label={aria}>
      {inner}
    </a>
  )
}

export function Card({ it, cls = "card", frame = "shot", pills = false, tagClass, titleClass, listClass = "ticks" }: { it: VcItemData; cls?: string; frame?: string; pills?: boolean; tagClass?: string; titleClass?: string; listClass?: string }) {
  if (it.cardLink && it.href) {
    // A full-width "see all" card: the whole tile is the link.
    return (
      <Link className={`${cls.replace(" uc", "")} go-card`} href={vercelStegaClean(it.href)}>
        <div>
          {it.title && <h3 className="h3">{it.title}</h3>}
          {it.body && <p className="body">{it.body}</p>}
        </div>
        <span className="link">
          <Arrow />
        </span>
      </Link>
    )
  }
  if (pills) {
    // Use case card with the AI chip beside the title and pill tags.
    return (
      <article className={cls}>
        <div className="top">
          {it.title && <h3 className="title">{it.title}</h3>}
          {it.ai && <span className="ai">AI</span>}
        </div>
        {it.body && <p className="small">{it.body}</p>}
        {!!it.tags?.length && (
          <div className="pills">
            {it.tags.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        )}
        <CardLink it={it} />
      </article>
    )
  }
  return (
    <article className={cls}>
      {it.image?.asset && (
        <div className={["pichd", "w4-img"].includes(frame) ? frame : "shot"}>
          <SImg image={it.image} width={640} />
        </div>
      )}
      {it.icon && <SvgIcon svg={it.icon} className="ico" />}
      {it.num && <span className="num">{it.num}</span>}
      {it.label && <span className="label">{it.label}</span>}
      {it.title && <h3 className={titleClass || "h3"}>{it.title}</h3>}
      {it.kicker && <span className="label">{it.kicker}</span>}
      {/* A blank line in the body starts a new paragraph. */}
      {it.body &&
        it.body.split(/\n\s*\n/).map((para, pi) => (
          <p className="body" key={pi}>
            {para}
          </p>
        ))}
      {it.aiNote && (
        <p className="uc-ai">
          {it.aiLabel && <b>{it.aiLabel}</b>}
          {it.aiNote}
        </p>
      )}
      <Ticks items={it.bullets} cls={it.listClass !== undefined ? vercelStegaClean(it.listClass) : listClass} icon={vercelStegaClean(it.bulletIcon ?? "chk")} />
      {it.metric && (
        <div className="oc-n">
          <b>{it.metric}</b>
          {it.metricLabel && <span>{it.metricLabel}</span>}
        </div>
      )}
      {!!it.tags?.length && (
        <div className="tags">
          {it.tags.map((t, i) => (
            <span key={i} className={tagClass || undefined}>
              {t}
            </span>
          ))}
        </div>
      )}
      {it.meta && <span className="label">{it.meta}</span>}
      <CardLink it={it} />
      {it.arrow && !it.href && (
        <span className="link">
          <Arrow />
        </span>
      )}
    </article>
  )
}

export function VcCards({ s }: { s: VcCardsData }) {
  const layout = vercelStegaClean(s.layout ?? "cards3")
  const frame = vercelStegaClean(s.imageFrame ?? "shot")
  const itemCls = layout === "why4" ? "w4" : layout === "oc" ? "oc" : layout === "uc" || layout === "uc2" ? "card uc" : "card"
  const gridCls = layout === "uc2" ? "cards2" : ["oc", "uc", "ucpills"].includes(layout) ? "cards3" : layout
  const tagClass = vercelStegaClean(s.tagClass ?? "")
  const titleClass = vercelStegaClean(s.titleClass ?? "")
  const listClass = s.listClass === undefined ? "ticks" : vercelStegaClean(s.listClass)
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="cards">
      <Head head={s.head} />
      <div className={gridCls}>
        {(s.items ?? []).map((it, i) => (
          <Card key={it._key ?? i} it={it} cls={itemCls} frame={frame} pills={layout === "ucpills"} tagClass={tagClass} titleClass={titleClass} listClass={listClass} />
        ))}
      </div>
    </Sec>
  )
}

/* -------------------------------------------------------------- products */

export function VcProducts({ s }: { s: VcProductsData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="product">
      <Head head={s.head} />
      <div className="prod2">
        {(s.items ?? []).map((it, i) => (
          <article className="pc2" key={it._key ?? i}>
            <div className="pc2-img">
              <SImg image={it.image} width={640} alt={it.image?.alt ?? it.title} />
            </div>
            {it.title && <h3 className="h3">{it.title}</h3>}
            {it.body && <p className="body">{it.body}</p>}
          </article>
        ))}
      </div>
    </Sec>
  )
}

/* ---------------------------------------------------------------- quotes */

function Quote({ q, hidden }: { q: VcQuoteData; hidden?: boolean }) {
  return (
    <figure className="q" aria-hidden={hidden || undefined}>
      {q.org && <span className="label">{hidden ? vercelStegaClean(q.org) : q.org}</span>}
      <blockquote>&ldquo;{hidden ? vercelStegaClean(q.quote ?? "") : q.quote}&rdquo;</blockquote>
      <figcaption className="who">
        <QuoteAvatar q={q} />
        <div>
          <b>{hidden ? vercelStegaClean(q.name ?? "") : q.name}</b>
          <span className="small">{hidden ? vercelStegaClean(q.role ?? "") : q.role}</span>
        </div>
      </figcaption>
    </figure>
  )
}

function QuoteCol({ quotes, dir }: { quotes: VcQuoteData[]; dir: "up" | "down" }) {
  return (
    <div className={`mq-col ${dir}`}>
      <div className="mq-track">
        {quotes.map((q, i) => (
          <Quote key={`${q._id}-${i}`} q={q} />
        ))}
        {quotes.map((q, i) => (
          <Quote key={`${q._id}-${i}-dup`} q={q} hidden />
        ))}
      </div>
    </div>
  )
}

export function VcProof({ s }: { s: VcProofData }) {
  const quotes = (s.quotes ?? []).filter(Boolean)
  const half = Math.ceil(quotes.length / 2)
  const columns = (
    <div className="quotes mq">
      <QuoteCol quotes={quotes.slice(0, half)} dir="up" />
      <QuoteCol quotes={quotes.slice(half)} dir="down" />
    </div>
  )
  if (s.filters?.length) {
    return (
      <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} inner="wrap proof" dataSec="proof">
        <VcFilteredProof
          badge={<Badge>{s.badge}</Badge>}
          heading={
            <h2 className="h2 mt24">
              <Acc text={s.heading} />
            </h2>
          }
          filters={s.filters}
          quotes={quotes}
        />
      </Sec>
    )
  }
  if (vercelStegaClean(s.layout ?? "") === "stacked") {
    return (
      <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="proof">
        <Head head={{ badge: s.badge, heading: s.heading, lead: s.lead }} />
        {columns}
      </Sec>
    )
  }
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} inner="wrap proof" dataSec="proof">
      <div className="sticky">
        <Badge>{s.badge}</Badge>
        <h2 className="h2 mt24">
          <Acc text={s.heading} />
        </h2>
        {s.lead && <p className="lead">{s.lead}</p>}
        <Ctas ctas={s.ctas?.map((c) => ({ arrow: true, ...c }))} />
      </div>
      {columns}
    </Sec>
  )
}

/* --------------------------------------------------------------- closing */

export function VcClosing({ s }: { s: VcClosingData }) {
  return (
    <section className="closing on-dark" data-sec="closing">
      <div className="wrap">
        <Badge>{s.badge}</Badge>
        <h2 className="h2">
          <Acc text={s.heading} em />
        </h2>
        {s.lead && <p className="lead">{s.lead}</p>}
        <Ctas ctas={s.ctas} />
      </div>
    </section>
  )
}

"use client"

import { bookingHref } from "@/lib/bookingLink"
import type { CSSProperties, ReactNode } from "react"
import FaqAccordion from "@/components/sections/FaqAccordion"
import ClosingCtaSection, { type ClosingCtaCopy } from "@/components/sections/ClosingCtaSection"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"
import type { FaqTab } from "@/components/sections/types"

/**
 * AiPartnerTemplate — renders an `aiPartnerPage` Sanity document.
 *
 * Faithful port of the hand-designed partner landing layouts (Anthropic /
 * OpenAI / Openclaw) reskinned to the Fruition theme: white surface,
 * Poppins (inherited from <body>), purple CTAs, rounded cards. Each page's
 * brand signature survives via a scoped `--accent` colour set on the root
 * and an optional serif accent. All copy comes from Sanity.
 */

interface SiteSettings {
  calendlyLink?: string
}

// The doc is consumed loosely — every field is optional per layout.
type Doc = Record<string, any>

// Wrap each emphasis substring (accent / strike) inline wherever it appears in
// the heading, so mid-sentence emphasis from the original designs survives.
function Heading({
  text,
  accent,
  strike,
}: {
  text?: string
  accent?: string
  strike?: string
}) {
  if (!text) return null
  let nodes: (string | ReactNode)[] = [text]
  const apply = (arr: typeof nodes, sub: string | undefined, cls: string) => {
    if (!sub) return arr
    const out: typeof nodes = []
    arr.forEach((node, n) => {
      if (typeof node !== "string") return out.push(node)
      const idx = node.indexOf(sub)
      if (idx === -1) return out.push(node)
      if (idx > 0) out.push(node.slice(0, idx))
      out.push(<span className={cls} key={`${cls}-${n}-${idx}`}>{sub}</span>)
      if (idx + sub.length < node.length) out.push(node.slice(idx + sub.length))
    })
    return out
  }
  nodes = apply(nodes, accent, "accent")
  nodes = apply(nodes, strike, "strike")
  return <>{nodes.map((n, i) => (typeof n === "string" ? <span key={i}>{n}</span> : n))}</>
}

export default function AiPartnerTemplate({
  page,
  siteSettings,
  faqTabs,
  closingCta,
}: {
  page: Doc | null
  siteSettings?: SiteSettings | null
  /** Central Sanity faqItems for this page, pre-grouped into tabs by the caller. */
  faqTabs?: FaqTab[]
  /** Central closingCta doc for this page (caller fetches via getClosingCtaForPage). */
  closingCta?: ClosingCtaCopy | null
}) {
  if (!page) return null

  const calendly = bookingHref(siteSettings?.calendlyLink)

  const rootStyle = {
    "--accent": page.accentColor || "#8015e8",
    "--accent-deep": page.accentColorDeep || page.accentColor || "#550e9b",
    "--accent-soft":
      page.accentColorSoft || "rgba(128,21,232,0.08)",
  } as CSSProperties

  const cta = (label?: string, url?: string, kind: "primary" | "secondary" = "primary") => {
    if (!label) return null
    const href = url || calendly
    const external = /^https?:/.test(href)
    return (
      <a
        className={`btn btn-${kind}`}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
    )
  }

  return (
    <div className="aipartner" style={rootStyle}>
      {/* HERO */}
      <header className="ap-hero">
        <div className="ap-wrap">
          <div className={`hero-grid ${page.heroSidePanelType === "none" ? "hero-grid-single" : ""}`}>
            <div>
              {page.heroEyebrow && <div className="eyebrow">{page.heroEyebrow}</div>}
              <h1 className="hero-h1">
                <Heading
                  text={page.heroHeading}
                  accent={page.heroHeadingAccent}
                  strike={page.heroHeadingStrike}
                />
              </h1>
              {page.heroLead && <p className="hero-lead">{page.heroLead}</p>}
              <div className="cta-row">
                {cta(page.primaryCtaLabel, page.primaryCtaUrl, "primary")}
                {cta(page.secondaryCtaLabel, page.secondaryCtaUrl, "secondary")}
              </div>
            </div>

            {page.heroSidePanelType === "log" && (
              <div className="hero-side hero-log">
                {page.heroSidePanelTitle && (
                  <div className="hero-log-title">{page.heroSidePanelTitle}</div>
                )}
                {(page.heroLogLines || []).map((l: Doc, i: number) => (
                  <div className="log-line" key={i}>
                    <span className="ts">{l.ts}</span>
                    <span className={`tag tag-${l.tagKind || "info"}`}>{l.tag}</span>
                    <span className="msg">{l.msg}</span>
                  </div>
                ))}
              </div>
            )}

            {page.heroSidePanelType === "code" && (
              <div className="hero-side hero-code">
                {page.heroSidePanelTitle && (
                  <div className="hero-code-title">{page.heroSidePanelTitle}</div>
                )}
                <pre>
                  {(page.heroCodeLines || []).map((line: string, i: number) => (
                    <code key={i}>{line || " "}{"\n"}</code>
                  ))}
                </pre>
              </div>
            )}

            {page.heroSidePanelType === "regions" && (
              <aside className="hero-side hero-regions">
                {page.heroSidePanelTitle && <h3>{page.heroSidePanelTitle}</h3>}
                <ul className="region-list">
                  {(page.heroRegions || []).map((r: Doc, i: number) => (
                    <li key={i}>
                      <span>{r.label}</span>
                      <span className="city">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </header>

      {/* STRIP */}
      {page.stripType === "marquee" && (page.marqueeItems?.length ?? 0) > 0 && (
        <div className="marquee">
          <div className="marquee-track">
            {[...page.marqueeItems, ...page.marqueeItems].map((m: string, i: number) => (
              <span className="marquee-item" key={i}>{m}</span>
            ))}
          </div>
        </div>
      )}
      {page.stripType === "stats" && (page.stats?.length ?? 0) > 0 && (
        <section className="strip-stats">
          <div className="ap-wrap stats-grid">
            {page.stats.map((s: Doc, i: number) => (
              <div className="stat" key={i}>
                <div className="stat-num">
                  {s.value}
                  {s.unit && <span className="unit">{s.unit}</span>}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAPABILITIES */}
      {(page.capabilities?.length ?? 0) > 0 && (
        <section className="ap-section" id="capabilities">
          <div className="ap-wrap">
            <div className="section-head">
              {page.capEyebrow && <div className="eyebrow">{page.capEyebrow}</div>}
              <h2><Heading text={page.capHeading} accent={page.capHeadingAccent} /></h2>
              {page.capLead && <p className="section-lead">{page.capLead}</p>}
            </div>
            <div className="cap-grid">
              {page.capabilities.map((c: Doc, i: number) => (
                <div className="cap" key={i}>
                  {c.num && <div className="cap-num">{c.num}</div>}
                  <h3>{c.title}</h3>
                  {c.body && <p>{c.body}</p>}
                  {(c.bullets?.length ?? 0) > 0 && (
                    <ul className="cap-list">
                      {c.bullets.map((b: Doc, j: number) => <li key={j}>{b.text}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SHOWCASE */}
      {(page.showcaseCards?.length ?? 0) > 0 && (
        <section className="ap-section section-alt" id="showcase">
          <div className="ap-wrap">
            <div className="section-head">
              {page.showcaseEyebrow && <div className="eyebrow">{page.showcaseEyebrow}</div>}
              <h2><Heading text={page.showcaseHeading} accent={page.showcaseHeadingAccent} /></h2>
              {page.showcaseLead && <p className="section-lead">{page.showcaseLead}</p>}
            </div>
            <div className="showcase-grid">
              {page.showcaseCards.map((card: Doc, i: number) => (
                <div className="showcase-card" key={i}>
                  {card.icon && <div className="showcase-icon">{card.icon}</div>}
                  <h4>{card.name}</h4>
                  {card.role && <div className="showcase-role">{card.role}</div>}
                  {card.body && <p>{card.body}</p>}
                  {(card.meta?.length ?? 0) > 0 && (
                    <div className="showcase-meta">
                      {card.meta.map((m: Doc, j: number) => (
                        <div className="meta-item" key={j}>
                          <strong>{m.value}</strong>
                          {m.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {(page.process?.length ?? 0) > 0 && (
        <section className="ap-section" id="process">
          <div className="ap-wrap">
            <div className="section-head">
              {page.processEyebrow && <div className="eyebrow">{page.processEyebrow}</div>}
              <h2><Heading text={page.processHeading} accent={page.processHeadingAccent} /></h2>
              {page.processLead && <p className="section-lead">{page.processLead}</p>}
            </div>
            <div className="process-grid">
              {page.process.map((s: Doc, i: number) => (
                <div className="process-cell" key={i}>
                  {s.tag && <div className="step-tag">{s.tag}</div>}
                  <h3>{s.title}</h3>
                  {s.body && <p>{s.body}</p>}
                  {s.duration && <div className="duration">{s.duration}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CASES */}
      {(page.cases?.length ?? 0) > 0 && (
        <section className="ap-section section-alt" id="work">
          <div className="ap-wrap">
            <div className="section-head">
              {page.casesEyebrow && <div className="eyebrow">{page.casesEyebrow}</div>}
              <h2><Heading text={page.casesHeading} accent={page.casesHeadingAccent} /></h2>
            </div>
            <div className="case-grid">
              {page.cases.map((c: Doc, i: number) => (
                <article className="case" key={i}>
                  {c.industry && <div className="industry">{c.industry}</div>}
                  <h3>{c.title}</h3>
                  {c.body && <p>{c.body}</p>}
                  <div className="metric"><span className="accent">{c.metric}</span></div>
                  {c.metricLabel && <div className="metric-label">{c.metricLabel}</div>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MID-PAGE CTA — shared site-wide conversion banner */}
      <section className="ap-section">
        <div className="ap-wrap">
          <AuditCtaBanner contained={false} />
        </div>
      </section>

      {/* COMPARISON */}
      {(page.compareRows?.length ?? 0) > 0 && (
        <section className="ap-section" id="compare">
          <div className="ap-wrap">
            <div className="section-head">
              {page.compareEyebrow && <div className="eyebrow">{page.compareEyebrow}</div>}
              <h2><Heading text={page.compareHeading} accent={page.compareHeadingAccent} /></h2>
              {page.compareLead && <p className="section-lead">{page.compareLead}</p>}
            </div>
            <div className="compare">
              <div className="compare-row head">
                <div>{page.compareColLabel || "Dimension"}</div>
                <div className="col-accent">{page.compareColA}</div>
                <div>{page.compareColB}</div>
              </div>
              {page.compareRows.map((r: Doc, i: number) => (
                <div className="compare-row" key={i}>
                  <div className="label">{r.label}</div>
                  <div className="col-a">{r.colA}</div>
                  <div className="col-b">{r.colB}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GEO */}
      {(page.geo?.length ?? 0) > 0 && (
        <section className="ap-section section-alt" id="contact">
          <div className="ap-wrap">
            <div className="section-head">
              {page.geoEyebrow && <div className="eyebrow">{page.geoEyebrow}</div>}
              <h2><Heading text={page.geoHeading} accent={page.geoHeadingAccent} /></h2>
              {page.geoLead && <p className="section-lead">{page.geoLead}</p>}
            </div>
            <div className="geo-grid">
              {page.geo.map((g: Doc, i: number) => (
                <div className="geo" key={i}>
                  {g.region && <div className="country">{g.region}</div>}
                  <h3>{g.city}</h3>
                  {g.body && <p>{g.body}</p>}
                  {g.addr && (
                    <div className="addr">
                      {g.addr.split("\n").map((line: string, j: number) => (
                        <div key={j}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OPERATOR */}
      {(page.operatorName || (page.operatorBody?.length ?? 0) > 0) && (
        <section className="ap-section" id="operator">
          <div className="ap-wrap">
            <div className="section-head">
              {page.operatorEyebrow && <div className="eyebrow">{page.operatorEyebrow}</div>}
              <h2><Heading text={page.operatorHeading} accent={page.operatorHeadingAccent} /></h2>
            </div>
            <div className="operator">
              <div className="operator-panel">
                {page.operatorName && (
                  <div className="row">
                    <span className="k">name</span>
                    <span className="v">{page.operatorName}</span>
                  </div>
                )}
                {page.operatorRole && (
                  <div className="row">
                    <span className="k">role</span>
                    <span className="v accent">{page.operatorRole}</span>
                  </div>
                )}
                {(page.operatorPanel || []).map((r: Doc, i: number) => (
                  <div className="row" key={i}>
                    <span className="k">{r.k}</span>
                    <span className={`v ${r.accent ? "accent" : ""}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="operator-body">
                {(page.operatorBody || []).map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
                {(page.operatorCreds?.length ?? 0) > 0 && (
                  <div className="creds">
                    {page.operatorCreds.map((c: string, i: number) => (
                      <span className="cred" key={i}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ — shared site-wide accordion (impl-packages style). Central Sanity
          faqItems arrive via the faqTabs prop; the page doc's own faq list is
          the fallback until that page's items are migrated. */}
      {((faqTabs?.length ?? 0) > 0 || (page.faq?.length ?? 0) > 0) && (
        <FaqAccordion
          heading={page.faqHeading || "Frequently asked questions"}
          tabs={
            faqTabs?.length
              ? faqTabs
              : [{
                  label: page.faqEyebrow || "General Questions",
                  items: (page.faq || []).map((f: Doc) => ({ question: f.question, answer: f.answer })),
                }]
          }
        />
      )}

      {/* FINAL CTA — shared site-wide banner; Sanity closingCta doc wins,
          this page doc's own cta fields are the verbatim fallback */}
      <ClosingCtaSection
        cta={closingCta}
        fallback={{
          eyebrow: page.ctaEyebrow,
          heading: page.ctaHeading,
          headingAccent: page.ctaHeadingAccent,
          lead: page.ctaBody,
          primaryLabel: page.ctaLabel || page.primaryCtaLabel,
          primaryUrl: page.ctaUrl || page.primaryCtaUrl || calendly,
        }}
      />

      <style>{CSS}</style>
    </div>
  )
}

const CSS = `
.aipartner {
  --ink: var(--text-body);
  --ink-soft: var(--text-muted-fg);
  --rule: var(--border-ui);
  --paper: var(--surface-subtle);
  --mono: var(--font-jetbrains), 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  --purple: #8015e8;
  --purple-light: #ba83f0;
  color: var(--ink);
  background: var(--surface);
  font-size: 16px;
  line-height: 1.6;
}
.aipartner .ap-wrap { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
.aipartner .accent { color: var(--accent); }
.aipartner .strike { position: relative; color: var(--ink-soft); white-space: nowrap; }
.aipartner .strike::after { content: ""; position: absolute; left: 0; right: 0; top: 55%; height: 4px; background: var(--accent); transform: skewY(-2deg); }
.aipartner .eyebrow {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 18px; font-weight: 600;
}

/* CTA */
.aipartner .cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 36px; }
.aipartner .cta-center { justify-content: center; }
.aipartner .btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 26px; font-size: 14px; font-weight: 600;
  text-decoration: none; border-radius: 9999px; transition: all .2s; cursor: pointer;
}
/* On the site-wide CTA blue, like .cta-btn-primary — these pages carry their
   own button classes and were the last purple CTAs left. */
.aipartner .btn-primary { background: linear-gradient(to right, var(--cta-blue), var(--cta-blue-light)); color: #fff; box-shadow: 0 6px 20px rgba(30,64,175,0.25); }
.aipartner .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(30,64,175,0.35); }
.aipartner .btn-secondary { border: 1px solid var(--rule); color: var(--ink); background: var(--surface-raised); }
.aipartner .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

/* HERO */
.aipartner .ap-hero { padding: 96px 0 72px; border-bottom: 1px solid var(--rule); background: linear-gradient(180deg, var(--surface) 0%, var(--paper) 100%); }
.aipartner .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: end; }
.aipartner .hero-grid-single { grid-template-columns: 1fr; max-width: 60ch; }
.aipartner .hero-h1 { font-size: clamp(32px, 6vw, 78px); font-weight: 700; line-height: 1.05; letter-spacing: -0.035em; }
.aipartner .hero-lead { font-size: 19px; color: var(--ink-soft); max-width: 56ch; margin-top: 26px; }

/* Hero side: log */
.aipartner .hero-side { font-family: var(--mono); }
.aipartner .hero-log, .aipartner .hero-code {
  background: #15131c; border: 1px solid #2a2733; border-radius: 16px; padding: 22px;
  font-size: 12px; color: #cfd0d6; position: relative; box-shadow: 0 14px 40px rgba(20,18,28,0.18);
}
.aipartner .hero-log-title, .aipartner .hero-code-title {
  font-size: 10px; letter-spacing: 0.12em; color: #6f7178; margin-bottom: 14px; text-transform: uppercase;
}
.aipartner .log-line { display: flex; gap: 10px; padding: 4px 0; }
.aipartner .log-line .ts { color: #6f7178; flex-shrink: 0; }
.aipartner .log-line .tag { flex-shrink: 0; color: var(--accent); }
.aipartner .log-line .tag-warn { color: #ffd03d; }
.aipartner .log-line .tag-act { color: var(--accent); }
.aipartner .log-line .tag-done { color: #7be08a; }
.aipartner .log-line .msg { color: #e7e7ee; }
.aipartner .hero-code pre { margin: 0; white-space: pre-wrap; word-break: break-word; line-height: 1.7; }
.aipartner .hero-code code { color: #cdd6e4; font-family: var(--mono); }

/* Hero side: regions */
.aipartner .hero-regions { border-left: 1px solid var(--rule); padding-left: 36px; }
.aipartner .hero-regions h3 { font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 16px; }
.aipartner .region-list { list-style: none; padding: 0; margin: 0; }
.aipartner .region-list li { display: flex; justify-content: space-between; align-items: baseline; padding: 13px 0; border-bottom: 1px dashed var(--rule); font-size: 18px; font-weight: 500; }
.aipartner .region-list li:last-child { border-bottom: none; }
.aipartner .region-list .city { color: var(--ink-soft); font-size: 13px; font-weight: 400; }

/* MARQUEE */
.aipartner .marquee { background: var(--accent); overflow: hidden; padding: 18px 0; }
.aipartner .marquee-track { display: flex; gap: 48px; white-space: nowrap; animation: ap-scroll 38s linear infinite; }
@keyframes ap-scroll { from { transform: translateX(0);} to { transform: translateX(-50%);} }
.aipartner .marquee-item { font-family: var(--mono); font-size: 13px; font-weight: 600; color: #fff; display: flex; align-items: center; }
.aipartner .marquee-item::after { content: "✦"; margin-left: 48px; color: rgba(255,255,255,0.55); }

/* STATS */
.aipartner .strip-stats { border-bottom: 1px solid var(--rule); }
.aipartner .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.aipartner .stat { padding: 44px 28px 44px 0; border-right: 1px solid var(--rule); }
.aipartner .stats-grid .stat:last-child { border-right: none; }
.aipartner .stat-num { font-size: 46px; font-weight: 700; letter-spacing: -0.02em; }
.aipartner .stat-num .unit { color: var(--accent); }
.aipartner .stat-label { font-size: 13px; color: var(--ink-soft); margin-top: 10px; max-width: 24ch; }

/* SECTIONS */
.aipartner .ap-section { padding: 96px 0; border-bottom: 1px solid var(--rule); }
.aipartner .section-alt { background: var(--paper); }
.aipartner .section-head { max-width: 780px; margin-bottom: 56px; }
.aipartner .ap-section h2 { font-size: clamp(32px, 4vw, 56px); font-weight: 700; line-height: 1.04; letter-spacing: -0.03em; margin-bottom: 18px; }
.aipartner .section-lead { font-size: 18px; color: var(--ink-soft); max-width: 64ch; }

/* CAPABILITIES */
.aipartner .cap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.aipartner .cap { background: var(--surface-raised); border: 1px solid var(--rule); border-radius: 20px; padding: 36px 32px; box-shadow: 0 1px 17px rgba(0,0,0,0.04); transition: all .2s; }
.aipartner .cap:hover { border-color: var(--accent); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
.aipartner .cap-num { font-family: var(--mono); font-size: 12px; color: var(--accent); margin-bottom: 20px; font-weight: 600; }
.aipartner .cap h3 { font-size: 22px; font-weight: 600; letter-spacing: -0.015em; margin-bottom: 12px; line-height: 1.2; }
.aipartner .cap p { color: var(--ink-soft); font-size: 15px; }
.aipartner .cap-list { list-style: none; padding: 0; margin: 18px 0 0; }
.aipartner .cap-list li { padding: 8px 0; color: var(--ink-soft); font-size: 14px; border-bottom: 1px solid var(--rule); }
.aipartner .cap-list li:last-child { border-bottom: none; }
.aipartner .cap-list li::before { content: "→ "; color: var(--accent); font-weight: 600; }

/* SHOWCASE */
.aipartner .showcase-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.aipartner .showcase-card { background: var(--surface-raised); border: 1px solid var(--rule); border-radius: 20px; padding: 30px 26px; transition: all .2s; box-shadow: 0 1px 17px rgba(0,0,0,0.04); }
.aipartner .showcase-card:hover { transform: translateY(-3px); border-color: var(--accent); box-shadow: 0 14px 32px rgba(0,0,0,0.07); }
.aipartner .showcase-icon { width: 46px; height: 46px; border-radius: 12px; background: var(--accent-soft); color: var(--accent); font-family: var(--mono); font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.aipartner .showcase-card h4 { font-size: 19px; font-weight: 600; letter-spacing: -0.01em; }
.aipartner .showcase-role { font-family: var(--mono); font-size: 11px; color: var(--ink-soft); margin: 6px 0 14px; }
.aipartner .showcase-card p { font-size: 14px; color: var(--ink-soft); }
.aipartner .showcase-meta { display: flex; gap: 16px; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--rule); font-family: var(--mono); font-size: 11px; color: var(--ink-soft); }
.aipartner .showcase-meta strong { display: block; color: var(--accent); font-size: 14px; }

/* PROCESS */
.aipartner .process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.aipartner .process-cell { background: var(--surface-raised); border: 1px solid var(--rule); border-radius: 20px; padding: 30px 26px; display: flex; flex-direction: column; box-shadow: 0 1px 17px rgba(0,0,0,0.04); }
.aipartner .process-cell .step-tag { font-family: var(--mono); font-size: 11px; color: var(--accent); margin-bottom: 22px; font-weight: 600; }
.aipartner .process-cell h3 { font-size: 19px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 10px; }
.aipartner .process-cell p { font-size: 14px; color: var(--ink-soft); flex: 1; }
.aipartner .process-cell .duration { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--rule); font-family: var(--mono); font-size: 11px; color: var(--accent); }

/* CASES */
.aipartner .case-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.aipartner .case { background: var(--surface-raised); border: 1px solid var(--rule); border-radius: 20px; padding: 34px 30px; display: flex; flex-direction: column; box-shadow: 0 1px 17px rgba(0,0,0,0.04); }
.aipartner .case .industry { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
.aipartner .case h3 { font-size: 21px; font-weight: 600; letter-spacing: -0.015em; margin-bottom: 12px; line-height: 1.2; }
.aipartner .case p { font-size: 14px; color: var(--ink-soft); flex: 1; margin-bottom: 24px; }
.aipartner .case .metric { font-size: 44px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.aipartner .case .metric-label { font-family: var(--mono); font-size: 11px; color: var(--ink-soft); margin-top: 8px; }

/* COMPARISON */
.aipartner .compare { border: 1px solid var(--rule); border-radius: 18px; overflow: hidden; }
.aipartner .compare-row { display: grid; grid-template-columns: 1fr 1.2fr 1.2fr; border-bottom: 1px solid var(--rule); }
.aipartner .compare-row:last-child { border-bottom: none; }
.aipartner .compare-row > div { padding: 20px 22px; font-size: 14px; border-right: 1px solid var(--rule); }
.aipartner .compare-row > div:last-child { border-right: none; }
.aipartner .compare-row.head > div { background: #15131c; color: #fff; font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; }
.aipartner .compare-row.head .col-accent { background: var(--accent); color: #fff; }
.aipartner .compare-row .label { font-weight: 600; background: var(--paper); }
.aipartner .compare-row .col-a { color: var(--ink); }
.aipartner .compare-row .col-b { color: var(--ink-soft); }

/* GEO */
.aipartner .geo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.aipartner .geo { background: var(--surface-raised); border: 1px solid var(--rule); border-radius: 20px; padding: 32px; position: relative; box-shadow: 0 1px 17px rgba(0,0,0,0.04); }
.aipartner .geo::before { content: ""; position: absolute; top: 0; left: 32px; width: 48px; height: 3px; background: var(--accent); border-radius: 0 0 3px 3px; }
.aipartner .geo .country { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin: 8px 0 14px; }
.aipartner .geo h3 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 14px; }
.aipartner .geo p { color: var(--ink-soft); font-size: 14px; margin-bottom: 20px; }
.aipartner .geo .addr { font-family: var(--mono); font-size: 11px; color: var(--ink-soft); padding-top: 16px; border-top: 1px solid var(--rule); }

/* OPERATOR */
.aipartner .operator { display: grid; grid-template-columns: 0.8fr 1.4fr; gap: 40px; background: var(--surface-raised); border: 1px solid var(--rule); border-radius: 24px; padding: 48px; box-shadow: 0 1px 17px rgba(0,0,0,0.04); }
.aipartner .operator-panel { background: var(--paper); border: 1px solid var(--rule); border-radius: 16px; padding: 28px; font-family: var(--mono); font-size: 13px; height: fit-content; }
.aipartner .operator-panel .row { display: flex; justify-content: space-between; gap: 16px; padding: 9px 0; border-bottom: 1px dashed var(--rule); }
.aipartner .operator-panel .row:last-child { border-bottom: none; }
.aipartner .operator-panel .k { color: var(--ink-soft); }
.aipartner .operator-panel .v { color: var(--ink); text-align: right; }
.aipartner .operator-body h3 { font-size: 28px; font-weight: 600; }
.aipartner .operator-body p { color: var(--ink-soft); margin-bottom: 14px; }
.aipartner .creds { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.aipartner .cred { font-family: var(--mono); font-size: 10px; letter-spacing: 0.04em; padding: 6px 12px; border: 1px solid var(--rule); border-radius: 9999px; color: var(--ink-soft); background: var(--paper); }

/* FAQ */
.aipartner .faq-list { max-width: 920px; }
.aipartner .faq-item { border-bottom: 1px solid var(--rule); }
.aipartner .faq-q { display: flex; align-items: center; gap: 20px; padding: 24px 0; cursor: pointer; list-style: none; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; }
.aipartner .faq-q::-webkit-details-marker { display: none; }
.aipartner .faq-num { font-family: var(--mono); font-size: 13px; color: var(--accent); }
.aipartner .faq-chev { margin-left: auto; color: var(--accent); font-size: 22px; font-weight: 400; transition: transform .2s; }
.aipartner details[open] .faq-chev { transform: rotate(45deg); }
.aipartner .faq-a { color: var(--ink-soft); font-size: 15px; max-width: 72ch; padding: 0 0 26px 49px; }

/* FINAL CTA */
.aipartner .final-cta { background: #15131c; color: #fff; text-align: center; padding: 120px 0; }
.aipartner .final-cta .eyebrow { color: var(--accent); justify-content: center; display: block; }
.aipartner .final-cta h2 { font-size: clamp(32px, 4.4vw, 60px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 18px; }
.aipartner .final-cta p { color: rgba(255,255,255,0.66); font-size: 18px; max-width: 56ch; margin: 0 auto; }

/* Tablet (768-1023px): dense desktop grids step down to two-up */
@media (max-width: 1023px) {
  .aipartner .showcase-grid, .aipartner .process-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile (up to 767px): single column, tighter shell */
@media (max-width: 767px) {
  .aipartner .hero-grid, .aipartner .cap-grid, .aipartner .showcase-grid, .aipartner .process-grid,
  .aipartner .case-grid, .aipartner .geo-grid, .aipartner .operator { grid-template-columns: 1fr; }

  /* A grid item's default min-width is auto, so the monospace log panel —
     whose lines never wrap — set a min-content width well over 390px and
     stretched the single column with it. The heading, lead and CTA row are
     siblings in that column, so all three were silently clipped by the page's
     overflow: the hero read as half a sentence on every one of these pages.
     Letting the items shrink, and giving the log its own scroller, keeps the
     copy inside the screen. */
  .aipartner .hero-grid > *,
  .aipartner .cap-grid > *,
  .aipartner .showcase-grid > *,
  .aipartner .process-grid > *,
  .aipartner .case-grid > *,
  .aipartner .geo-grid > * { min-width: 0; }
  .aipartner .hero-log, .aipartner .hero-code { overflow-x: auto; }
  .aipartner .hero-h1, .aipartner .hero-lead { overflow-wrap: break-word; }
  .aipartner .cta-row .btn { flex: 1 1 100%; justify-content: center; }
  .aipartner .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .aipartner .stat { border-right: none; padding: 28px 0; }
  .aipartner .compare-row { grid-template-columns: 1fr; }
  .aipartner .hero-regions { border-left: none; padding-left: 0; }
  .aipartner .ap-wrap { padding: 0 20px; }
  .aipartner .ap-hero { padding: 56px 0; }
  .aipartner .ap-section { padding: 56px 0; }
  .aipartner .operator { padding: 28px; }
}

`

import { vercelStegaClean } from "@vercel/stega"
import { Fragment } from "react"
import Link from "next/link"
import { Arrow, Btn, Head, SImg, Sec } from "../primitives"
import type { VcInsightsData, VcMarkupData, VcQuizData, VcAskDemoData, VcCatalogueData, VcFactsData, VcIndustryGridData, VcLinkCardsData, VcPriceCardsData, VcServicesData } from "../types"
import { getAllUseCases, getUseCaseIndex } from "@/features/ai-use-cases/data"
import { industryHref, toTile } from "@/features/ai-use-cases/types"
import { VcServiceTabs } from "./core-client"
import VcAskDemo from "./VcAskDemo"
import VcQuiz from "./VcQuiz"
import VcAnimated from "./VcAnimated"
import { VcNodes } from "./nodes"
import { getVcHomePosts } from "@/sanity/vcQueries"
import VcCatalogueView from "./VcCatalogue"

function Tick() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

/** Plain text link: in-page anchors and paths go through next/link, the rest are anchors. */
function TextLink({ href, className, children }: { href?: string; className?: string; children: React.ReactNode }) {
  const h = vercelStegaClean(href ?? "")
  if (!h) return null
  if (h.startsWith("/") || h.startsWith("#")) return <Link className={className} href={h}>{children}</Link>
  return <a className={className} href={h}>{children}</a>
}

/* ----------------------------------------------------------- price cards */

export function VcPriceCards({ s }: { s: VcPriceCardsData }) {
  const grid = vercelStegaClean(s.gridClass ?? "grid3")
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="pricing">
      <Head head={s.head} />
      <div className={grid}>
        {(s.items ?? []).map((it, i) => {
          const pk = vercelStegaClean(it.cardClass ?? "")
          const cls = `card ${pk}`.trim()
          return (
            <article className={cls} key={it._key ?? i}>
              {it.kicker && <span className="label ac">{it.kicker}</span>}
              {it.logo?.asset && (
                <span className="logo-s">
                  <SImg image={it.logo} width={160} className={vercelStegaClean(it.logoShape ?? "") || undefined} alt={it.logo.alt} />
                </span>
              )}
              {it.title && <h3 className="h3">{it.title}</h3>}
              {it.body && <p className="body">{it.body}</p>}
              {it.meta && <span className="label">{it.meta}</span>}
              {(it.price || it.quote) && (
                <div className="pricebox">
                  {it.priceLabel && <span className="label">{it.priceLabel}</span>}
                  {it.price ? (
                    <b className="price">
                      {it.price}
                      {it.unit && <span className="un">{it.unit}</span>}
                    </b>
                  ) : (
                    <b className="price pq">{it.quote}</b>
                  )}
                </div>
              )}
              {it.best && (
                <p className="body">
                  <b className="bf">{it.bestLabel}</b> {it.best}
                </p>
              )}
              {!!it.bullets?.length && (
                <ul className="ticks">
                  {it.bullets.map((b, bi) => (
                    <li key={bi}>
                      <Tick />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <Btn cta={it.cta} />
              {it.linkLabel && (
                <TextLink className="link" href={it.href}>
                  {it.linkLabel} <Arrow />
                </TextLink>
              )}
            </article>
          )
        })}
      </div>
      {!!s.notes?.length && (
        <div className="notes2">
          {s.notes.map((n, i) => (
            <div className="nt" key={n._key ?? i}>
              {n.label && <span className="label ac">{n.label}</span>}
              {n.body && <p className="body">{n.body}</p>}
              {n.links?.length === 1 && (
                <TextLink className="link" href={n.links[0].href}>
                  {n.links[0].label}
                  <Arrow />
                </TextLink>
              )}
              {(n.links?.length ?? 0) > 1 && (
                <div className="ntl">
                  {n.links!.map((l, li) => (
                    <TextLink key={l._key ?? li} className="link" href={l.href}>
                      {l.label}
                      <Arrow />
                    </TextLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Sec>
  )
}

/* ----------------------------------------------------------- link cards */

export function VcLinkCards({ s }: { s: VcLinkCardsData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="links">
      <Head head={s.head} />
      <div className={vercelStegaClean(s.gridClass ?? "grid3")}>
        {(s.items ?? []).map((it, i) => (
          <TextLink key={it._key ?? i} className="card reg" href={it.href}>
            <span className="title">{it.title}</span>
            <span className="link" aria-hidden="true">
              <Arrow />
            </span>
          </TextLink>
        ))}
      </div>
    </Sec>
  )
}

/* ------------------------------------------------------ services tabs */

export function VcServices({ s }: { s: VcServicesData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="services">
      <Head head={s.head} />
      <VcServiceTabs tabs={s.tabs ?? []} />
      {s.footnote && <p className="small note-b">{s.footnote}</p>}
    </Sec>
  )
}

/* ---------------------------------------------------------------- facts */

export function VcFacts({ s }: { s: VcFactsData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="facts">
      <Head head={s.head} />
      <div className="card fact">
        <dl>
          {(s.rows ?? []).map((r, i) => (
            <Fragment key={r._key ?? i}>
              <dt className="label">{r.label}</dt>
              <dd>{r.value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </Sec>
  )
}

/* ----------------------------------------------- use case catalogue hub */

/** Industry tiles for the use case hub: names, counts and links come from the catalogue data. */
export async function VcIndustryGrid({ s }: { s: VcIndustryGridData }) {
  const index = await getUseCaseIndex()
  const tpl = s.labelTemplate ?? "{count} use cases · {ai} with AI"
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="industries">
      <Head head={s.head} />
      <div className="cards4">
        {index.industries.map((i) => (
          <Link className="card go-card ind" href={industryHref(i.slug)} key={i.slug}>
            <div>
              <span className="label">{tpl.replace("{count}", String(i.count)).replace("{ai}", String(i.aiCount))}</span>
              <h3 className="h3">{i.name}</h3>
            </div>
            <span className="link" aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        ))}
      </div>
    </Sec>
  )
}

export async function VcCatalogue({ s }: { s: VcCatalogueData }) {
  const [index, all] = await Promise.all([getUseCaseIndex(), getAllUseCases()])
  const over = new Map((s.overrides ?? []).map((o) => [vercelStegaClean(o.id ?? ""), { ...(o.title ? { title: o.title } : {}), ...(o.summary ? { summary: o.summary } : {}), ...(o.metric ? { metric: o.metric } : {}) }]))
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="catalogue">
      <VcCatalogueView s={s} tiles={all.map(toTile).map((t) => ({ ...t, ...(over.get(t.id) ?? {}) }))} industries={index.industries} departments={index.departments} />
    </Sec>
  )
}

export function VcAskDemoSection({ s }: { s: VcAskDemoData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="tool">
      <VcAskDemo s={s} />
    </Sec>
  )
}

export function VcQuizSection({ s }: { s: VcQuizData }) {
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor ?? "quiz"} cls={s.sectionClass} dataSec="quiz">
      <VcQuiz s={s} />
    </Sec>
  )
}

/* ------------------------------------------------- designed (node) sections */

/** A bespoke section built from vcNode elements, with optional animation behaviour. */
export function VcMarkup({ s }: { s: VcMarkupData }) {
  const kind = vercelStegaClean(s.behaviour ?? "")
  const cls = vercelStegaClean(s.sectionClass ?? "") || undefined
  const id = vercelStegaClean(s.anchor ?? "") || undefined
  const dataSec = vercelStegaClean(s.dataSec ?? "") || undefined
  if (kind === "method" || kind === "industries") {
    return (
      <VcAnimated kind={kind} className={cls} id={id} dataSec={dataSec}>
        <VcNodes nodes={s.nodes} />
      </VcAnimated>
    )
  }
  return (
    <section className={cls} id={id} data-sec={dataSec}>
      <VcNodes nodes={s.nodes} />
    </section>
  )
}

/* ---------------------------------------------------------------- insights */

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "")

/** Card excerpts stop at this many words; the CSS clamp then fades out the last line. */
const EXCERPT_MAX_WORDS = 32
/** Excerpts longer than this can overrun the 4-line clamp, so they get the fade. */
const EXCERPT_FADE_WORDS = 20

function cardExcerpt(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const cut = words.length > EXCERPT_MAX_WORDS
  return { text: cut ? `${words.slice(0, EXCERPT_MAX_WORDS).join(" ")}…` : words.join(" "), fade: words.length > EXCERPT_FADE_WORDS }
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "F"
}

/** Team headshot when the byline matches a team member, the Fruition mark for brand bylines, initials otherwise. */
function PostAvatar({ name, photoUrl }: { name?: string; photoUrl?: string }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="ip-av" src={`${photoUrl}?w=64&h=64&fit=crop&auto=format`} alt="" width={32} height={32} loading="lazy" decoding="async" />
  }
  if (!name || /^fruition\b/i.test(name.trim())) {
    return (
      <span className="ip-av ip-av-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-fruition-mark.svg" alt="" width={16} height={15} />
      </span>
    )
  }
  return <span className="ip-av ip-av-init">{initials(name)}</span>
}

/** The three latest blog posts (live data), in the Version C card. */
export async function VcInsights({ s }: { s: VcInsightsData }) {
  const posts = (await getVcHomePosts()).filter((p) => p.title && p.slug)
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} dataSec="insights">
      <Head head={s.head} />
      <div className="ip-grid">
        {posts.map((p) => {
          const read = p.charCount ? Math.max(1, Math.round(p.charCount / 5 / 200)) : 5
          const cat = p.category
          const excerpt = p.excerpt ? cardExcerpt(p.excerpt) : null
          return (
            <Link className="card in-post" href={`/post/${p.slug}`} key={p._id}>
              <span className="ip-img">{p.cover?.asset && <SImg image={p.cover} width={640} alt="" />}</span>
              <span className="label">{cat ? `${cat} · ${fmtDate(p.publishedAt)}` : fmtDate(p.publishedAt)}</span>
              <h3 className="h3">{p.title}</h3>
              {excerpt && <p className={`body ip-ex${excerpt.fade ? " ip-ex-fade" : ""}`}>{excerpt.text}</p>}
              <span className="small ip-by">
                <PostAvatar name={p.author} photoUrl={p.authorPhotoUrl} />
                <span>{`${p.author ? `${p.author} · ` : ""}${read} min read`}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </Sec>
  )
}

import Link from "next/link"
import { vercelStegaClean } from "@vercel/stega"
import { getFeaturedUseCases } from "@/features/ai-use-cases/data"
import { caseAnchorHref } from "@/features/ai-use-cases/types"
import type { LandingPagePath } from "@/features/ai-use-cases/featured"
import { answerToPlainText, generateFaqJsonLdFromPairs } from "@/lib/faqSchema"
import { Acc, Arrow, Badge, Head, SImg, Sec } from "../primitives"
import type { VcFaqData, VcPractitionersData, VcSharedData, VcUseCasesData } from "../types"
import VcFaqTabs from "./VcFaqTabs"

/* -------------------------------------------------------------- use cases */

/**
 * The use case catalogue is a static dataset (public/data/ai-use-cases, kept
 * out of the Worker bundle and out of Sanity on purpose: ~1 MB of copy). The
 * section header is Sanity copy; the cards are the page's featured builds.
 */
export async function VcUseCases({ s }: { s: VcUseCasesData }) {
  const source = vercelStegaClean(s.source ?? "") as LandingPagePath
  const featured = source ? await getFeaturedUseCases(source) : null
  if (!featured?.tiles.length) return null
  const label = s.linkLabel || "See the build"
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor ?? "use-cases"} cls={s.sectionClass} dataSec="usecases">
      <Head head={s.head} />
      <div className="cards3">
        {featured.tiles.map((t) => (
          <article className="card uc" key={t.id}>
            <h3 className="h3">{t.title}</h3>
            <p className="body">{t.summary}</p>
            <div className="tags">
              {[...(t.ai ? ["AI"] : []), ...t.teams].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="link" href={caseAnchorHref(featured.industry.slug, t.id)}>
              {label}
              <Arrow />
            </Link>
          </article>
        ))}
      </div>
    </Sec>
  )
}

/* -------------------------------------------------------------------- FAQ */

export function VcFaq({ s }: { s: VcFaqData }) {
  // Render every tab as approved (a related tab may repeat a question from
  // another tab). The FAQPage JSON-LD lists each question once: the helper
  // dedupes by question, and every listed question is on the page.
  const tabs = (s.tabs ?? [])
    .map((t) => ({ ...t, items: (t.items ?? []).filter((it) => it && vercelStegaClean(it.question ?? "").trim()) }))
    .filter((t) => t.items.length)
  if (!tabs.length) return null
  const jsonLd = generateFaqJsonLdFromPairs(
    tabs.flatMap((t) =>
      t.items.map((it) => ({
        question: vercelStegaClean(it.question ?? ""),
        answer: vercelStegaClean(answerToPlainText(it.answer)),
      })),
    ),
  )
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor ?? "faq"} cls={s.sectionClass} inner="wrap faq" dataSec="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VcFaqTabs
        badge={<Badge>{s.badge}</Badge>}
        heading={
          s.heading ? (
            <h2 className="h2 mt24">
              <Acc text={s.heading} />
            </h2>
          ) : null
        }
        tabs={tabs}
      />
    </Sec>
  )
}

/* ------------------------------------------------- led by practitioners */

export function VcPractitioners({ s, shared }: { s: VcPractitionersData; shared?: VcSharedData | null }) {
  const sharedP = shared?.practitioners
  if (!sharedP) return null
  // A page can name its own leader (HubSpot, ClickUp, Aircall, n8n, OpenClaw):
  // badge and heading stay shared, the person and their facts are this page's.
  const l = s.leader?.name ? s.leader : null
  const role = l ? (l.roleOverride || l.role) : undefined
  const p = l
    ? {
        ...sharedP,
        photo: l.photo,
        name: l.name,
        role: role ? `${role} · Fruition` : "Fruition",
        facts: s.leaderFacts ?? [],
        pills: s.leaderPills ?? [],
      }
    : sharedP
  return (
    <Sec tone={s.tone} pageSpecific={s.pageSpecific} anchor={s.anchor} cls={s.sectionClass} inner="wrap josh-wrap" dataSec="lead">
      <div className="josh-copy">
        <Badge>{p.badge}</Badge>
        {p.heading && (
          <h2 className="h2 mt24">
            <Acc text={p.heading} />
          </h2>
        )}
        {s.paragraphs?.length
          ? s.paragraphs.map((b, i) => (
              <p className={vercelStegaClean(b.style ?? "") === "ink" ? "body vc-ink" : "body"} key={b._key ?? i}>
                {b.text}
              </p>
            ))
          : (p.body ?? []).map((b, i) => (
              <p className="body" key={i}>
                {b}
              </p>
            ))}
      </div>
      <div className="josh">
        <div className="josh-photo">
          <SImg image={p.photo} width={420} alt={l ? `${p.name}, ${role ?? "Fruition"}` : (p.photo?.alt ?? p.name)} />
        </div>
        <div className="josh-body">
          <div>
            {p.name && <b className="josh-name">{p.name}</b>}
            {p.role && <span className="label">{p.role}</span>}
          </div>
          {!!p.facts?.length && (
            <dl className="josh-facts">
              {p.facts.map((f, i) => (
                <div key={f._key ?? i}>
                  <dt className="label">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {!!p.pills?.length && (
            <div className="josh-pills">
              {p.pills.map((x, i) => (
                <span className="badge" key={i}>
                  <i />
                  {x}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Sec>
  )
}

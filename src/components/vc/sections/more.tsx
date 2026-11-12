import { vercelStegaClean } from "@vercel/stega"
import { buildVideoObject } from "@/lib/videoObject"
import { answerToPlainText, generateFaqJsonLdFromPairs } from "@/lib/faqSchema"
import { Acc, Badge, Head, SImg, Sec, SvgIcon } from "../primitives"
import { SOCIAL_ICONS } from "../socialIcons"
import type { VcBlogListData, VcFaqHubData, VcStoriesData, VcFormEmbedData, VcRemoteData, VcChannelsData, VcLeadershipData, VcOfficesData, VcTeamTabsData, VcSharedData, VcTeamMember, VcAnswerData, VcCoverageData, VcStatsRowData, VcTeamData, VcDirectoryData, VcPartnerStatusData, VcToolkitData, VcFixData, VcIndustryTabsData, VcPara, VcTableData, VcTextPairData, VcTrackData, VcVideoData } from "../types"
import { VcClock, VcDirectoryGrid, VcFixPicker, VcIndustryTabsView, VcTeamCard, VcTeamTabsShell, VcTrackFinder } from "./interactive"
import VcVideoPlayer from "./VcVideoPlayer"
import VcStoriesGrid from "./VcStoriesGrid"
import { VcBlogGrid, VcFaqHubView } from "./hubs"
import { getVcBlogCards } from "@/sanity/vcQueries"

function Paras({ paras }: { paras?: VcPara[] }) {
  return (
    <>
      {(paras ?? []).map((p, i) => (
        <p key={p._key ?? i} className={vercelStegaClean(p.style ?? "body") === "lead" ? "lead" : "body"}>
          {p.text}
        </p>
      ))}
    </>
  )
}

/** Video case study. Emits VideoObject JSON-LD for the one video it shows. */
export function VcVideo({ s }: { s: VcVideoData }) {
  const id = vercelStegaClean(s.youtubeId ?? "")
  const ld = id ? buildVideoObject({ id }) : null
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} inner="wrap case" dataSec="video">
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
      <div>
        <Badge>{s.badge}</Badge>
        {s.heading && (
          <h2 className="h2 mt24">
            <Acc text={s.heading} />
          </h2>
        )}
        <Paras paras={s.paragraphs} />
        {!!s.facts?.length && (
          <dl>
            {s.facts.map((f, i) => (
              <div key={f._key ?? i} className="vc-contents">
                <dt className="label">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <VcVideoPlayer id={id} poster={s.poster} alt={s.poster?.alt ?? (s.heading ? vercelStegaClean(s.heading).replace(/\*/g, "") : undefined)} caption={s.caption} />
    </Sec>
  )
}

export function VcTextPair({ s }: { s: VcTextPairData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="text">
      <div className="txt2">
        <div>
          <Badge>{s.badge}</Badge>
          {s.heading && (
            <h2 className="h2">
              <Acc text={s.heading} />
            </h2>
          )}
        </div>
        <div className="txt2-b">
          <Paras paras={s.paragraphs} />
        </div>
      </div>
    </Sec>
  )
}

export function VcFix({ s }: { s: VcFixData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="fix">
      <VcFixPicker s={s} />
    </Sec>
  )
}

export function VcIndustryTabs({ s }: { s: VcIndustryTabsData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="industry">
      <VcIndustryTabsView s={s} />
    </Sec>
  )
}

export function VcTrack({ s }: { s: VcTrackData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor ?? "track"} cls={s.sectionClass} dataSec="track">
      <VcTrackFinder s={s} />
    </Sec>
  )
}

const X = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 7l10 10M17 7L7 17" />
  </svg>
)
const Chk = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export function VcTable({ s }: { s: VcTableData }) {
  const [a, b, c] = s.columns ?? []
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="compare">
      <Head head={s.head} />
      <div className="table" role="table">
        <div className="tr th" role="row">
          <div role="columnheader">{a}</div>
          <div role="columnheader">{b}</div>
          <div role="columnheader" className="us">
            {c}
          </div>
        </div>
        {(s.rows ?? []).map((r, i) => (
          <div className="tr" role="row" key={r._key ?? i}>
            <div className="k" role="cell">
              {r.label}
            </div>
            {vercelStegaClean(s.variant ?? "") === "help" ? (
              <>
                <div role="cell">{r.no}</div>
                <div className="help" role="cell">
                  <Chk />
                  {r.yes}
                </div>
              </>
            ) : (
              <>
                <div className="no" role="cell">
                  <X />
                  {r.no}
                </div>
                <div className="yes" role="cell">
                  <Chk />
                  {r.yes}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Sec>
  )
}

export function VcPartnerStatus({ s }: { s: VcPartnerStatusData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="status">
      <div className="pst">
        <div className="pst-badge">
          {(s.badgeImages ?? []).map((b, i) => (
            <SImg key={b._key ?? i} image={b.image} width={240} className={vercelStegaClean(b.shape ?? "") || undefined} alt={b.alt} />
          ))}
        </div>
        <div className="pst-copy">
          <Badge>{s.badge}</Badge>
          {s.heading && (
            <h2 className="h2">
              <Acc text={s.heading} />
            </h2>
          )}
          <div className="pst-pts">
            {(s.points ?? []).map((p, i) => (
              <div className="pst-pt" key={p._key ?? i}>
                {p.n && <span className="label">{p.n}</span>}
                {p.title && <b>{p.title}</b>}
                {p.body && <span className="small">{p.body}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sec>
  )
}

export function VcDirectory({ s }: { s: VcDirectoryData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="directory">
      <VcDirectoryGrid s={s} />
    </Sec>
  )
}

/** Auto-scrolling tool tiles (the track is doubled for the loop; the copy is hidden from assistive tech). */
export function VcToolkit({ s }: { s: VcToolkitData }) {
  const tiles = s.tiles ?? []
  const run = (hidden: boolean) =>
    tiles.map((t, i) => (
      <div className="tile" key={`${hidden ? "h" : "v"}${t._key ?? i}`} aria-hidden={hidden || undefined}>
        <span className="logo">
          <SImg image={t.logo} width={172} className={vercelStegaClean(t.logoShape ?? "")} alt={hidden ? "" : `${vercelStegaClean(t.title ?? "")} logo`} />
        </span>
        <b>{hidden ? vercelStegaClean(t.title ?? "") : t.title}</b>
        <span className="small">{hidden ? vercelStegaClean(t.body ?? "") : t.body}</span>
      </div>
    ))
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="toolkit">
      <Head head={s.head} />
      <div className="accr">
        <div className="accr-track">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </Sec>
  )
}

export function VcStatsRow({ s }: { s: VcStatsRowData }) {
  return (
    <section className={vercelStegaClean(s.tone ?? "") === "alt" ? "alt" : undefined} id={s.anchor ? vercelStegaClean(s.anchor) : undefined} data-sec="numbers">
      <div className="wrap">
        <Head head={s.head} />
      </div>
      <div className={`stats ${vercelStegaClean(s.statsClass ?? "")}`.trim()}>
        <div className="wrap">
          {(s.stats ?? []).map((st, i) => (
            <div className="stat" key={st._key ?? i}>
              <b>
                <Acc text={st.value} em />
              </b>
              {st.label && <p className="small">{st.label}</p>}
            </div>
          ))}
          {s.note && !s.noteBelow && <p className="small foot-note">{s.note}</p>}
        </div>
      </div>
      {s.note && s.noteBelow && (
        <div className="wrap">
          <p className="small foot-note">{s.note}</p>
        </div>
      )}
    </section>
  )
}

export function VcTeam({ s }: { s: VcTeamData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="team">
      <Head head={s.head} />
      <div className="tgrid">
        {(s.members ?? []).filter((m) => m?._id).map((m, i) =>
          vercelStegaClean(s.layout ?? "") === "compact" ? (
            <article className="pc" key={`${m._id}-${i}`}>
              <div className="ph">
                <SImg image={m.photo} width={360} alt={m.name} />
              </div>
              <div className="pb">
                {(m.roleOverride || m.role) && <span className="label">{m.roleOverride || m.role}</span>}
                {m.name && <h3 className="h3">{m.name}</h3>}
                {(m.override || m.bio) && <p className="small">{m.override || m.bio}</p>}
                {m.linkedinUrl && (
                  <a className="link" href={vercelStegaClean(m.linkedinUrl)} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
              </div>
            </article>
          ) : (
            <VcTeamCard key={`${m._id}-${i}`} m={withOverrides(m)} photo={<SImg image={m.photo} width={360} alt={m.name} />} />
          ),
        )}
      </div>
    </Sec>
  )
}

export function VcAnswer({ s }: { s: VcAnswerData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} inner="wrap answer" dataSec="answer">
      <div>
        <Badge>{s.badge}</Badge>
        {s.heading && (
          <h2 className="h2 mt24">
            <Acc text={s.heading} />
          </h2>
        )}
      </div>
      {s.body && <p className="body">{s.body}</p>}
    </Sec>
  )
}

export function VcCoverage({ s }: { s: VcCoverageData }) {
  const q = vercelStegaClean(s.mapQuery ?? "")
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="coverage">
      <Head head={s.head} />
      <div className="ogrid">
        <div className="omap">
          {q && (
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`}
              title={vercelStegaClean(s.mapTitle ?? "Office map")}
              referrerPolicy="no-referrer-when-downgrade"
              loading="lazy"
              allowFullScreen
            />
          )}
        </div>
        <div className="oside">
          <div className="ovisit">
            <div>
              {s.visitLabel && <span className="label">{s.visitLabel}</span>}
              {s.visitHeading && <h3>{s.visitHeading}</h3>}
              {s.visitAddress && <p>{s.visitAddress}</p>}
            </div>
            {s.visitHref && (
              <a className="link" href={vercelStegaClean(s.visitHref)} target="_blank" rel="noopener noreferrer">
                {s.visitLinkLabel}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            )}
          </div>
          <div className="ocards">
            {(s.cities ?? []).map((c, i) =>
              vercelStegaClean(s.cityStyle ?? "") === "card" ? (
                <article className="card" key={c._key ?? i}>
                  {c.label && <span className="label">{c.label}</span>}
                  <h3 className="h3">
                    {c.title}{" "}
                    {c.flag && (
                      <span className="flag" aria-hidden="true">
                        {vercelStegaClean(c.flag)}
                      </span>
                    )}
                  </h3>
                  {c.body && <p className="body">{c.body}</p>}
                </article>
              ) : (
                <article className="card city" key={c._key ?? i}>
                  <h3 className="title">
                    {c.title}
                    {c.hq && <span className="dot" aria-label="Headquarters" />}
                  </h3>
                  {c.body && <p className="small">{c.body}</p>}
                </article>
              ),
            )}
          </div>
        </div>
      </div>
    </Sec>
  )
}

const withOverrides = (m: VcTeamMember): VcTeamMember => ({ ...m, role: m.roleOverride || m.role, bio: m.override || m.bio })

export function VcLeadership({ s }: { s: VcLeadershipData }) {
  const ceo = s.ceo ? withOverrides(s.ceo) : null
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="leadership">
      <Head head={s.head} />
      {ceo && (
        <figure className="ceo">
          <div className="ceo-ph">
            <SImg image={ceo.photo} width={520} alt={ceo.name} />
          </div>
          <div className="ceo-q">
            {ceo.role && <span className="label">{ceo.role}</span>}
            {s.quote && <blockquote>{s.quote}</blockquote>}
            <figcaption>
              <b>{ceo.name}</b>
              {s.caption && <span className="small">{s.caption}</span>}
            </figcaption>
          </div>
        </figure>
      )}
      <div className="lgrid five">
        {(s.people ?? []).filter((m) => m?._id).map((raw, i) => {
          const m = withOverrides(raw)
          return (
            <article className="lc" key={`${m._id}-${i}`}>
              <div className="ph">
                <SImg image={m.photo} width={300} alt={m.name} />
              </div>
              <div className="pb">
                {m.role && <span className="label">{m.role}</span>}
                {m.name && <b className="title">{m.name}</b>}
                {m.bio && <p className="small">{m.bio}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </Sec>
  )
}

export function VcOffices({ s, shared }: { s: VcOfficesData; shared?: VcSharedData | null }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="offices">
      <Head head={s.head} />
      <div className="offices">
        {(shared?.offices ?? []).map((o, i) => (
          <article className="card office" key={o._key ?? i}>
            <div className="top">
              {o.flag && (
                <span className="flag" aria-hidden="true">
                  {vercelStegaClean(o.flag)}
                </span>
              )}
              {o.label && <span className="label">{o.label}</span>}
            </div>
            {o.city && <h3 className="h3">{o.city}</h3>}
            {o.address && (
              <address>
                {o.addressUrl ? <a href={vercelStegaClean(o.addressUrl)}>{o.address}</a> : o.address}
              </address>
            )}
            {o.phone && (
              <a className="tel" href={`tel:${vercelStegaClean(o.phoneTel ?? o.phone).replace(/\s+/g, "")}`}>
                {o.phone}
              </a>
            )}
          </article>
        ))}
      </div>
    </Sec>
  )
}

function TeamCards({ members, cls }: { members?: VcTeamMember[]; cls: string }) {
  return (
    <>
      {(members ?? []).filter((m) => m?._id).map((raw, i) => {
        const m = withOverrides(raw)
        return <VcTeamCard key={`${m._id}-${i}`} m={m} cls={cls} photo={<SImg image={m.photo} width={360} alt={m.name} />} />
      })}
    </>
  )
}

export function VcTeamTabs({ s }: { s: VcTeamTabsData }) {
  const tabs = s.tabs ?? []
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor ?? "team"} cls={s.sectionClass} dataSec="team">
      <VcTeamTabsShell
        badge={<Badge>{s.badge}</Badge>}
        prefix={s.headingPrefix}
        tabs={tabs.map((t) => ({ label: t.label, flag: t.flag, title: t.title }))}
        panels={tabs.map((t, i) => (
          <div key={i} className="vc-contents">
            {!!t.leaders?.length && (
              <div className="lgrid">
                <TeamCards members={t.leaders} cls="pc lc" />
              </div>
            )}
            {!!t.members?.length && (
              <div className="tgrid">
                <TeamCards members={t.members} cls="pc" />
              </div>
            )}
          </div>
        ))}
      />
    </Sec>
  )
}

export function VcChannels({ s }: { s: VcChannelsData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} inner="wrap chan" dataSec="channels">
      <div>
        <Badge>{s.badge}</Badge>
        {s.heading && (
          <h2 className="h2">
            <Acc text={s.heading} />
          </h2>
        )}
        <div className="rows">
          {(s.rows ?? []).map((r, i) => (
            <a key={r._key ?? i} href={vercelStegaClean(r.href ?? "#")}>
              <span className="label">{r.label}</span>
              <b>{r.value}</b>
            </a>
          ))}
          {!!s.socials?.length && (
            <div className="srow">
              {s.followLabel && <span className="label">{s.followLabel}</span>}
              <div className="sicons">
                {s.socials.map((x, i) => {
                  const icon = SOCIAL_ICONS[vercelStegaClean(x.network ?? "")]
                  const label = vercelStegaClean(x.label ?? x.network ?? "")
                  return (
                    <a key={x._key ?? i} href={vercelStegaClean(x.href ?? "#")} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
                      {icon && (
                        <svg viewBox={icon.viewBox} aria-hidden="true">
                          {icon.d.map((d, j) => (
                            <path key={j} d={d} />
                          ))}
                        </svg>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="acc-h">
          {s.tilesLabel && <span className="label">{s.tilesLabel}</span>}
          {s.tilesLink?.href && (
            <a className="link" href={vercelStegaClean(s.tilesLink.href)}>
              {s.tilesLink.label}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          )}
        </div>
        <div className="tiles">
          {(s.tiles ?? []).map((t, i) => (
            <div key={t._key ?? i} className={vercelStegaClean(t.shape ?? "")}>
              <SImg image={t.image} width={160} alt={t.alt} />
            </div>
          ))}
          {!!s.security?.length && (
            <div className="wide secw">
              <div className="secrow">
                {s.security.map((t, i) => (
                  <SImg key={t._key ?? i} image={t.image} width={90} alt={t.alt} className={vercelStegaClean(t.shape ?? "")} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Sec>
  )
}

export function VcRemote({ s }: { s: VcRemoteData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor ?? "remote"} cls={s.sectionClass} dataSec="remote">
      <div className="rgrid">
        <div className="rl">
          <Badge>{s.badge}</Badge>
          {s.heading && (
            <h2 className="h2">
              <Acc text={s.heading} />
            </h2>
          )}
          {s.lead && <p className="lead">{s.lead}</p>}
          <ul className="rperks">
            {(s.perks ?? []).map((p, i) => (
              <li key={p._key ?? i}>
                <SvgIcon svg={p.icon} className="ico" />
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rbox">
          <div className="rhead">
            {s.listLabel && <span className="label">{s.listLabel}</span>}
            {s.timeLabel && <span className="label">{s.timeLabel}</span>}
          </div>
          <ul className="roffices">
            {(s.places ?? []).map((p, i) => (
              <li className="ro" key={p._key ?? i}>
                {p.flag && (
                  <span className="flag" aria-hidden="true">
                    {vercelStegaClean(p.flag)}
                  </span>
                )}
                <div className="rt">
                  <b>{p.title}</b>
                  {p.line && <span className="small">{p.line}</span>}
                </div>
                <div className="rr">
                  {p.label && <span className="label">{p.label}</span>}
                  <VcClock tz={p.tz} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sec>
  )
}

/** Third-party form embed (the monday.com job application form on /careers). */
export function VcFormEmbed({ s }: { s: VcFormEmbedData }) {
  const src = vercelStegaClean(s.src ?? "")
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor} cls={s.sectionClass} dataSec="apply">
      <Head head={s.head} />
      {/^https:\/\/forms\.monday\.com\//.test(src) && (
        <div className="mform">
          <iframe src={src} title={vercelStegaClean(s.title ?? "Form")} loading="lazy" />
        </div>
      )}
      {s.note && <p className="small mform-note">{s.note}</p>}
    </Sec>
  )
}

export function VcStories({ s }: { s: VcStoriesData }) {
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor ?? "case-studies"} cls={s.sectionClass} dataSec="case-studies">
      <Head head={s.head} />
      <VcStoriesGrid s={s} />
    </Sec>
  )
}

export async function VcBlogList({ s }: { s: VcBlogListData }) {
  const posts = await getVcBlogCards()
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor ?? "posts"} cls={s.sectionClass} dataSec="posts">
      <VcBlogGrid s={s} posts={posts} />
    </Sec>
  )
}

/** FAQ help centre. FAQPage JSON-LD lists every question in it (all are on the page, under their topics). */
export function VcFaqHub({ s }: { s: VcFaqHubData }) {
  const pairs = (s.categories ?? []).flatMap((c) => (c.groups ?? []).flatMap((g) => (g.items ?? []).filter(Boolean)))
  const ld = generateFaqJsonLdFromPairs(pairs.map((it) => ({ question: vercelStegaClean(it.question ?? ""), answer: vercelStegaClean(answerToPlainText(it.answer)) })))
  return (
    <Sec tone={s.tone} scope={s.scope} anchor={s.anchor ?? "faq"} cls={s.sectionClass} inner="wrap help" dataSec="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <VcFaqHubView s={s} />
    </Sec>
  )
}

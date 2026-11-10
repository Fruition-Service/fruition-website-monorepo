import { vercelStegaClean } from "@vercel/stega"
import { buildVideoObject } from "@/lib/videoObject"
import { Acc, Badge, Head, SImg, Sec } from "../primitives"
import type { VcDirectoryData, VcPartnerStatusData, VcToolkitData, VcFixData, VcIndustryTabsData, VcPara, VcTableData, VcTextPairData, VcTrackData, VcVideoData } from "../types"
import { VcDirectoryGrid, VcFixPicker, VcIndustryTabsView, VcTrackFinder } from "./interactive"
import VcVideoPlayer from "./VcVideoPlayer"

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
    <Sec tone={s.tone} anchor={s.anchor} inner="wrap case" dataSec="video">
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
    <Sec tone={s.tone} anchor={s.anchor} dataSec="text">
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
    <Sec tone={s.tone} anchor={s.anchor} dataSec="fix">
      <VcFixPicker s={s} />
    </Sec>
  )
}

export function VcIndustryTabs({ s }: { s: VcIndustryTabsData }) {
  return (
    <Sec tone={s.tone} anchor={s.anchor} dataSec="industry">
      <VcIndustryTabsView s={s} />
    </Sec>
  )
}

export function VcTrack({ s }: { s: VcTrackData }) {
  return (
    <Sec tone={s.tone} anchor={s.anchor ?? "track"} dataSec="track">
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
    <Sec tone={s.tone} anchor={s.anchor} dataSec="compare">
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
            <div className="no" role="cell">
              <X />
              {r.no}
            </div>
            <div className="yes" role="cell">
              <Chk />
              {r.yes}
            </div>
          </div>
        ))}
      </div>
    </Sec>
  )
}

export function VcPartnerStatus({ s }: { s: VcPartnerStatusData }) {
  return (
    <Sec tone={s.tone} anchor={s.anchor} dataSec="status">
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
    <Sec tone={s.tone} anchor={s.anchor} dataSec="directory">
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
    <Sec tone={s.tone} anchor={s.anchor} dataSec="toolkit">
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

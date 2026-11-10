import Link from "next/link"
import { vercelStegaClean, vercelStegaSplit } from "@vercel/stega"
import { urlFor } from "@/sanity/image"
import type { VcCtaData, VcHeadData, VcImage } from "./types"

/**
 * Renders "Plain text *accented part*" with the starred words in the accent
 * colour (`<span class="acc">`) or, on the audit and closing bands, `<em>`.
 *
 * In the inline editor every Sanity string carries an invisible source map.
 * It is split off and rendered as the last child of the parent element, so
 * the editor tags the whole heading (not just the accent span) and edits the
 * stored text, asterisks included.
 */
export function Acc({ text, em = false }: { text?: string | null; em?: boolean }) {
  if (!text) return null
  const { cleaned, encoded } = vercelStegaSplit(text)
  const parts = cleaned.split(/\*([^*]+)\*/)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 0 ? p : em ? <em key={i}>{p}</em> : <span key={i} className="acc">{p}</span>,
      )}
      {encoded}
    </>
  )
}

export function Badge({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <span className="badge">
      <i />
      {children}
    </span>
  )
}

/** The arrow used on buttons and text links. */
export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/** Internal paths and anchors go through next/link (InPageBookingLinks scrolls #book); the rest are plain anchors. */
function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//")
}

/** Pill button with the roll-up label from the mock-ups. */
export function Btn({ cta, className = "" }: { cta?: VcCtaData | null; className?: string }) {
  if (!cta?.label || !cta.href) return null
  const href = vercelStegaClean(cta.href)
  const style = vercelStegaClean(cta.style ?? "primary")
  const cls = `btn ${style === "primary" ? "" : style} ${className}`.replace(/\s+/g, " ").trim()
  const body = (
    <>
      <span className="roll">
        <span>{cta.label}</span>
        <span aria-hidden="true">{vercelStegaClean(cta.label)}</span>
      </span>
      {cta.arrow && <Arrow />}
    </>
  )
  if (isInternal(href)) {
    return (
      <Link className={cls} href={href} {...(cta.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {body}
      </Link>
    )
  }
  return (
    <a className={cls} href={href} {...(cta.newTab || /^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {body}
    </a>
  )
}

export function Ctas({ ctas, className = "ctas" }: { ctas?: VcCtaData[] | null; className?: string }) {
  if (!ctas?.length) return null
  return (
    <div className={className}>
      {ctas.map((c, i) => (
        <Btn key={i} cta={c} />
      ))}
    </div>
  )
}

/** Section header: badge + heading left, one lead line right. */
export function Head({ head, as: H = "h2" }: { head?: VcHeadData | null; as?: "h2" | "h1" }) {
  if (!head || (!head.heading && !head.badge && !head.lead)) return null
  return (
    <div className="shead">
      <div>
        <Badge>{head.badge}</Badge>
        {head.heading && (
          <H className="h2">
            <Acc text={head.heading} />
          </H>
        )}
      </div>
      {head.lead && <p className="lead">{head.lead}</p>}
    </div>
  )
}

/** Sanity CDN URL for an image at a target width (2x for retina is the caller's choice). */
export function imgUrl(image: VcImage | undefined | null, width: number, opts: { height?: number; fit?: "max" | "crop" } = {}) {
  if (!image?.asset) return undefined
  let b = urlFor(image).width(width).auto("format")
  if (opts.height) b = b.height(opts.height)
  if (opts.fit) b = b.fit(opts.fit)
  return b.url()
}

/** Intrinsic size from the asset metadata, scaled to the requested width (avoids layout shift). */
export function dims(image: VcImage | undefined | null, width?: number) {
  const m = (image?.asset?._ref ?? image?.asset?._id ?? "").match(/-(\d+)x(\d+)-[a-z]+$/)
  if (!m) return {}
  const d = { width: Number(m[1]), height: Number(m[2]) }
  if (!width) return { width: d.width, height: d.height }
  return { width, height: Math.round((d.height / d.width) * width) }
}

/** Plain <img> straight from the Sanity CDN, so the inline editor can swap it. */
export function SImg({
  image,
  width,
  alt,
  className,
  lazy = true,
  priority = false,
  fit,
  height,
}: {
  image?: VcImage | null
  width: number
  alt?: string
  className?: string
  lazy?: boolean
  priority?: boolean
  fit?: "max" | "crop"
  height?: number
}) {
  const src = imgUrl(image, width * 2, { fit, height: height ? height * 2 : undefined })
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt={vercelStegaClean(alt ?? image?.alt ?? "")}
      {...dims(image, height ? undefined : width)}
      {...(height ? { height } : {})}
      loading={priority ? "eager" : lazy ? "lazy" : undefined}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  )
}

/** Section wrapper: background tone and anchor id. */
export function Sec({
  tone,
  anchor,
  className = "",
  children,
  inner = "wrap",
  dataSec,
}: {
  tone?: string
  anchor?: string
  className?: string
  children: React.ReactNode
  inner?: string
  dataSec?: string
}) {
  const cls = `${vercelStegaClean(tone ?? "") === "alt" ? "alt" : ""} ${className}`.trim()
  return (
    <section className={cls || undefined} id={anchor ? vercelStegaClean(anchor) : undefined} data-sec={dataSec}>
      <div className={inner}>{children}</div>
    </section>
  )
}

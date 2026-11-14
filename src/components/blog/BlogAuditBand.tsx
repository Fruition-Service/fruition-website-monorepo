"use client"

import Link from "next/link"
import { useSiteCopy } from "@/components/SiteCopyProvider"
import { bookingHref } from "@/lib/bookingLink"
import { Arrow } from "@/components/vc/primitives"

/**
 * The one Version C audit band inside a blog post's reading column (compact
 * variant, `.prose .audit`). Copy is the shared `audit-*` slots unless the post
 * has its own (src/lib/blogMidCta.ts). The words from "that" on are accented,
 * as in the approved mock-up; `*asterisks*` in the copy take precedence.
 */
export default function BlogAuditBand({ heading, body, ctaLabel }: { heading?: string; body?: string; ctaLabel?: string }) {
  const t = useSiteCopy()
  const h = heading ?? t("audit-heading")
  const label = ctaLabel ?? t("audit-cta")
  return (
    <div className="audit" data-sec="audit">
      <div>
        <h2>
          <AccentTail text={h} />
        </h2>
        <p>{body ?? t("audit-body")}</p>
      </div>
      <Link className="btn" href={bookingHref(null)}>
        <span className="roll">
          <span>{label}</span>
          <span aria-hidden="true">{label}</span>
        </span>
        <Arrow />
      </Link>
    </div>
  )
}

function AccentTail({ text }: { text: string }) {
  const starred = text.split(/\*([^*]+)\*/)
  if (starred.length > 1) return <>{starred.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}</>
  const i = text.search(/\sthat\s/)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i + 1)}
      <em>{text.slice(i + 1)}</em>
    </>
  )
}

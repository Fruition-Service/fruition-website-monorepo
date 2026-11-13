import { vercelStegaClean } from "@vercel/stega"
import { SImg } from "../primitives"
import { SOCIAL_ICONS } from "../socialIcons"
import type { VcChannelRow, VcLogoData, VcSocialLink } from "../types"

/**
 * The "Reach the team directly" list: one row per channel (email, phone, LinkedIn), then the
 * social icons and, optionally, the security and compliance badges. Used by the contact
 * channels section and by the contact-us hero, beside the message form.
 */
export function ChannelRows({
  rows,
  followLabel,
  socials,
  securityLabel,
  security,
}: {
  rows?: VcChannelRow[]
  followLabel?: string
  socials?: VcSocialLink[]
  securityLabel?: string
  security?: VcLogoData[]
}) {
  return (
    <div className="rows">
      {(rows ?? []).map((r, i) => (
        <a key={r._key ?? i} href={vercelStegaClean(r.href ?? "#")}>
          <span className="label">{r.label}</span>
          <b>{r.value}</b>
        </a>
      ))}
      {!!socials?.length && (
        <div className="srow">
          {followLabel && <span className="label">{followLabel}</span>}
          <div className="sicons">
            {socials.map((x, i) => {
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
      {!!security?.length && (
        <div className="srow secline">
          {securityLabel && <span className="label">{securityLabel}</span>}
          <div className="seclogos">
            {security.map((t, i) => (
              <SImg key={t._key ?? i} image={t.image} width={90} alt={t.alt} className={vercelStegaClean(t.shape ?? "") || undefined} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

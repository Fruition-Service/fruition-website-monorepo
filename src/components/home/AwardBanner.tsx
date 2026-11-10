import Link from "next/link"
import { siteText, type SiteCopy } from "@/lib/siteCopy"

/** Where the banner link goes until siteSettings.announcementHref says otherwise. */
export const DEFAULT_ANNOUNCEMENT_HREF = "/post/fruition-claude-partner-network-certification"

/**
 * Announcement strip above the site nav. Rendered in the root layout, so it
 * appears on every marketing page; retire it by removing that one usage.
 * The wording is the `award-*` shared copy slots (src/lib/siteCopy.ts) and the
 * destination is `siteSettings.announcementHref`, so the whole bar is editable
 * in Sanity. Styles: src/styles/vc/chrome.css (`.vcn-ann`).
 */
export default function AwardBanner({ copy, href }: { copy?: SiteCopy; href?: string | null }) {
  return (
    <div className="vcn-ann">
      <span>{siteText(copy, "award-text")}</span>
      <Link prefetch={false} href={href || DEFAULT_ANNOUNCEMENT_HREF}>{siteText(copy, "award-link")}</Link>
    </div>
  )
}

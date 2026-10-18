import { Fragment } from "react"
import { parseBioLinks } from "@/lib/bioLinks"

/**
 * Renders a team-member bio, turning `[text](https://...)` into real links.
 * Bios without link syntax render as the same plain text they always did.
 * External links follow the site's inline-link convention (RichText,
 * BlogPostTemplate): new tab, underlined, brand-dark.
 */
export default function BioText({ bio }: { bio: string }) {
  return (
    <>
      {parseBioLinks(bio).map((seg, i) =>
        seg.href ? (
          <a
            key={i}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-dark underline hover:no-underline"
          >
            {seg.text}
          </a>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        ),
      )}
    </>
  )
}

import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { CarouselLogo } from "./types"

interface ClientLogoWallProps {
  logos: CarouselLogo[]
  /** How many tiles to draw. The counter cell, when set, is extra. */
  maxTiles?: number
  /**
   * Fills the cell after the last logo — the homepage uses it for "900+ more".
   * Omitted on the industry walls, which are a sample rather than a tally.
   */
  counterLabel?: string
  className?: string
}

/**
 * The client logo wall: a dense grid of tiles on the site's mist surface.
 *
 * Shared by the homepage (5×5 with the "900+ more" counter) and every industry
 * page (2×5, drawn from that industry's own set). A tile whose entry carries a
 * `clientSlug` links into the solutions catalog, which expands its builds index
 * and highlights that client.
 */

/** Exports that reached the CMS without a usable name — hidden until renamed. */
const UNNAMED = /^(screenshot\b|logo(\s|$)|client \d+$)/i

const TILE =
  "flex h-[92px] items-center justify-center rounded-xl bg-mist px-4 py-3.5 transition-colors duration-200 hover:bg-mist-hover lg:h-[104px] lg:px-6 lg:py-5"

export default function ClientLogoWall({
  logos,
  maxTiles = 10,
  counterLabel,
  className = "",
}: ClientLogoWallProps) {
  const usable = logos
    .filter((logo) => logo?.image?.asset?._ref)
    .filter((logo) => !UNNAMED.test(logo.alt ?? ""))
    .slice(0, maxTiles)

  if (usable.length === 0) return null

  return (
    <div className={`grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 ${className}`}>
      {usable.map((logo, i) => {
        const name = logo.alt || "Client logo"
        const tile = (
          <Image
            src={urlFor(logo.image).width(260).fit("max").auto("format").url()}
            alt={name}
            width={130}
            height={64}
            className="max-h-full w-auto object-contain"
          />
        )
        const key = logo._key ?? i

        return logo.clientSlug ? (
          <Link
            key={key}
            href={`/monday-consulting-solutions/catalog?client=${logo.clientSlug}`}
            aria-label={`${name} — see the work we delivered`}
            className={`${TILE} focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none`}
          >
            {tile}
          </Link>
        ) : (
          <div key={key} className={TILE}>
            {tile}
          </div>
        )
      })}

      {counterLabel && (
        <div className="flex h-[92px] items-center justify-center px-4 lg:h-[104px]">
          <span className="text-xl leading-none font-semibold tracking-[-0.02em] text-brand lg:text-[22px]">
            {counterLabel}
          </span>
        </div>
      )}
    </div>
  )
}

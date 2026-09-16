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
 *
 * Below `md` the grid gives way to a self-scrolling band: 25 tiles at three
 * across is nine rows of thumb-work on a phone, which buries whatever comes
 * next. The band shows the same logos in the space of one row. It is CSS only
 * — a track holding two copies of the run, slid by half its width — so this
 * stays a server component; the second copy is `aria-hidden`, the band is
 * still swipeable, and the animation drops out under `prefers-reduced-motion`.
 */

/** Exports that reached the CMS without a usable name — hidden until renamed. */
const UNNAMED = /^(screenshot\b|logo(\s|$)|client \d+$)/i

const TILE =
  "flex h-[92px] items-center justify-center rounded-xl bg-mist px-4 py-3.5 transition-colors duration-200 hover:bg-mist-hover lg:h-[104px] lg:px-6 lg:py-5"

const FOCUS =
  "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"

const COUNTER =
  "text-xl leading-none font-semibold tracking-[-0.02em] text-brand lg:text-[22px]"

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

  /** One tile. `clone` strips the link and the alt text off the second copy. */
  const tileFor = (logo: CarouselLogo, i: number, clone = false) => {
    const name = logo.alt || "Client logo"
    const image = (
      <Image
        src={urlFor(logo.image).width(260).fit("max").auto("format").url()}
        alt={clone ? "" : name}
        width={130}
        height={64}
        className="max-h-full w-auto object-contain"
      />
    )

    return logo.clientSlug && !clone ? (
      <Link
        key={logo._key ?? i}
        href={`/monday-consulting-solutions/catalog?client=${logo.clientSlug}`}
        aria-label={`${name} — see the work we delivered`}
        className={`${TILE} ${FOCUS}`}
      >
        {image}
      </Link>
    ) : (
      <div key={logo._key ?? i} className={TILE}>
        {image}
      </div>
    )
  }

  /** The band repeats this run twice so the -50% slide loops seamlessly. */
  const run = (clone: boolean) => (
    <div className="fr-logo-band-run" aria-hidden={clone || undefined}>
      {usable.map((logo, i) => (
        <div key={`${logo._key ?? i}${clone ? "-c" : ""}`} className="w-[136px] shrink-0">
          {tileFor(logo, i, clone)}
        </div>
      ))}
      {counterLabel && (
        <div className="flex h-[92px] w-[136px] shrink-0 items-center justify-center px-4">
          <span className={COUNTER}>{counterLabel}</span>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Phones: one self-scrolling band instead of a wall of rows. */}
      <div className={`fr-logo-band md:hidden ${className}`}>
        <div className="fr-logo-band-track">
          {run(false)}
          {run(true)}
        </div>
      </div>

      {/* md and up: the grid, unchanged. */}
      <div className={`hidden gap-3 md:grid md:grid-cols-4 lg:grid-cols-5 lg:gap-4 ${className}`}>
        {usable.map((logo, i) => tileFor(logo, i))}

        {counterLabel && (
          <div className="flex h-[92px] items-center justify-center px-4 lg:h-[104px]">
            <span className={COUNTER}>{counterLabel}</span>
          </div>
        )}
      </div>
    </>
  )
}

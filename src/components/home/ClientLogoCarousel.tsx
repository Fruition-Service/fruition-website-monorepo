import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import { usableClientLogos } from "@/components/sections/ClientLogoWall"
import type { CarouselLogo } from "@/components/sections/types"
import { homeText, type HomeCopy } from "./copy"

export type ClientLogo = CarouselLogo

interface Props {
  logos: ClientLogo[]
  copy: HomeCopy
}

/**
 * Homepage client strip, directly under the hero: one self-scrolling row of
 * logos in place of the old 5×5 wall (Josh, 27 Oct 2026: "it saves the real
 * estate", after the Senzo hero strip), so "What we do" sits right below it.
 *
 * Same source and rules as before: the first 24 usable entries in
 * `siteSettings.carouselLogos` (reorder in Studio to change who leads), run
 * through `usableClientLogos`. The region pages keep their own walls.
 *
 * CSS only, so it stays a server component: the track holds two copies of the
 * run and slides by half its width (`.fr-logo-carousel` in globals.css). The
 * second copy is `aria-hidden` with empty alt text and no links; hover or
 * keyboard focus pauses it, and reduced motion stops it entirely.
 */
const MAX_LOGOS = 24

const SLOT = "flex h-14 w-[116px] shrink-0 items-center justify-center px-3 md:w-[156px] md:px-5 lg:h-16 lg:w-[184px] lg:px-6"

const FOCUS =
  "rounded-chip focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"

export default function ClientLogoCarousel({ logos, copy }: Props) {
  const usable = usableClientLogos(logos, MAX_LOGOS)
  if (usable.length === 0) return null

  const run = (clone: boolean) => (
    <ul className="flex items-center" aria-hidden={clone || undefined} role={clone ? undefined : "list"}>
      {usable.map((logo, i) => {
        const name = logo.alt || "Client logo"
        const image = (
          <Image
            src={urlFor(logo.image).width(280).fit("max").auto("format").url()}
            alt={clone ? "" : name}
            width={140}
            height={56}
            loading="eager"
            fetchPriority="low"
            className="max-h-10 w-auto object-contain lg:max-h-12"
          />
        )
        return (
          <li key={`${logo._key ?? i}${clone ? "-c" : ""}`} className={SLOT}>
            {logo.clientSlug && !clone ? (
              <Link
                href={`/monday-consulting-solutions/catalog?client=${logo.clientSlug}`}
                aria-label={`${name}: see the work we delivered`}
                className={`flex h-full w-full items-center justify-center ${FOCUS}`}
              >
                {image}
              </Link>
            ) : (
              image
            )}
          </li>
        )
      })}
      <li className={SLOT}>
        <span className="text-xl leading-none font-semibold tracking-[-0.02em] whitespace-nowrap text-brand lg:text-[22px]">
          {homeText(copy, "clients-more")}
        </span>
      </li>
    </ul>
  )

  return (
    <section id="clients" aria-labelledby="clients-heading" className="scroll-mt-24 bg-surface pb-10 lg:pb-12">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <div className="border-t border-ui pt-7 lg:pt-8">
          <h2
            id="clients-heading"
            className="text-center text-micro font-bold tracking-[0.12em] uppercase text-brand"
          >
            <span className="sr-only">Our clients: </span>
            {homeText(copy, "clients-heading")}
          </h2>
          <div className="fr-logo-carousel mt-5 lg:mt-6">
            <div className="fr-logo-carousel-track" style={{ "--count": usable.length + 1 } as CSSProperties}>
              {run(false)}
              {run(true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

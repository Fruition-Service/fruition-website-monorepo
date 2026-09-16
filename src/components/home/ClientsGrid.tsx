import ClientLogoWall from "@/components/sections/ClientLogoWall"
import type { CarouselLogo } from "@/components/sections/types"
import Reveal from "./Reveal"

export type ClientLogo = CarouselLogo

interface Props {
  logos: ClientLogo[]
}

/**
 * Homepage client wall — the first 24 usable entries in
 * `siteSettings.carouselLogos` as a 5×5 grid, with the "900+ more" counter as
 * the last cell. Reorder them in Studio to change which clients lead.
 *
 * The grid itself is `ClientLogoWall`, shared with every industry page.
 */
const MAX_TILES = 24

export default function ClientsGrid({ logos }: Props) {
  return (
    <section id="clients" className="scroll-mt-24 bg-surface pt-12 pb-16 md:pb-20 lg:pt-18 lg:pb-24">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="mx-auto max-w-[660px] text-center">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">Our clients</p>
          <h2 className="text-section-h2 mt-3.5 text-foreground lg:text-[42px]" style={{ textWrap: "pretty" }}>
            Trusted by teams across 900+ implementations.
          </h2>
          <p className="text-body mx-auto mt-4 max-w-[560px] text-muted lg:text-[17px]" style={{ textWrap: "pretty" }}>
            From national services groups to public-sector agencies in six markets — we stay on
            after go-live.
          </p>
          <span className="mx-auto mt-10 block h-px w-[228px] bg-lilac-quiet" />
        </Reveal>

        <Reveal className="mt-10 lg:mt-12">
          <ClientLogoWall logos={logos} maxTiles={MAX_TILES} counterLabel="900+ more" />
        </Reveal>
      </div>
    </section>
  )
}

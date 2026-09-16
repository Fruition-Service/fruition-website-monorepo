import ClientProofSection from "@/components/sections/ClientProofSection"
import type { CarouselLogo } from "@/components/sections/types"

export type ClientLogo = CarouselLogo

interface Props {
  logos: ClientLogo[]
}

/**
 * Homepage client wall — the first 24 usable entries in
 * `siteSettings.carouselLogos` as a 5×5 grid, with the "900+ more" counter as
 * the last cell. Reorder them in Studio to change which clients lead.
 *
 * The band itself is `ClientProofSection`, shared with the region pages.
 */
const MAX_TILES = 24

export default function ClientsGrid({ logos }: Props) {
  return (
    <ClientProofSection
      id="clients"
      lead="From national services groups to public-sector agencies in six markets — we stay on after go-live."
      logos={logos}
      maxTiles={MAX_TILES}
      counterLabel="900+ more"
    />
  )
}

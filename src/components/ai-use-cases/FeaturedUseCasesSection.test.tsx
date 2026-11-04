import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import FeaturedUseCasesSection, { type FeaturedUseCases } from "./FeaturedUseCasesSection"
import { toTile, type IndustryUseCases } from "@/features/ai-use-cases/types"
import { USE_CASE_CATALOGUE_DEFAULTS } from "@/features/content/industryPageCopy"

const data = JSON.parse(
  readFileSync(join(process.cwd(), "public/data/ai-use-cases/government.json"), "utf8"),
) as IndustryUseCases
const featured: FeaturedUseCases = {
  industry: { key: data.key, slug: data.slug, name: data.name, count: data.count, aiCount: data.aiCount },
  tiles: data.useCases.slice(0, 3).map(toTile),
}

describe("FeaturedUseCasesSection copy", () => {
  it("renders byte for byte the same from seeded copy as from no copy", () => {
    const plain = renderToStaticMarkup(<FeaturedUseCasesSection featured={featured} />)
    expect(plain).toContain("Use case catalogue")
    expect(plain).toContain(`See all ${data.count} use cases`)
    expect(plain).toContain("Browse every industry")
    const seeded = renderToStaticMarkup(
      <FeaturedUseCasesSection
        featured={featured}
        copy={{
          eyebrow: USE_CASE_CATALOGUE_DEFAULTS.eyebrow,
          heading: `${data.name} use cases`,
          lead: USE_CASE_CATALOGUE_DEFAULTS.lead,
          ctaLabel: USE_CASE_CATALOGUE_DEFAULTS.ctaLabel,
          browseLabel: USE_CASE_CATALOGUE_DEFAULTS.browseLabel,
        }}
      />,
    )
    expect(seeded).toBe(plain)
  })

  it("renders an editor's words", () => {
    const html = renderToStaticMarkup(
      <FeaturedUseCasesSection featured={featured} copy={{ heading: "Public sector builds", browseLabel: "Every sector" }} />,
    )
    expect(html).toContain("Public sector builds")
    expect(html).toContain("Every sector")
    expect(html).not.toContain("Browse every industry")
  })
})

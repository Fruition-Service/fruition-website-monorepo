import "@/styles/vc/pages/ai-use-cases.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import JsonLd, { SITE_URL } from "@/components/ai-use-cases/JsonLd"
import { getUseCaseIndex } from "@/features/ai-use-cases/data"
import { industryHref, USE_CASES_PATH } from "@/features/ai-use-cases/types"

/**
 * /ai-use-cases: the hub over the use case catalogue (public/data/ai-use-cases).
 * Header and section copy is the Version C page document; the catalogue stays
 * the data source for the industry tiles, the use case tiles and the counts.
 */

const TITLE = "Fruition AI & Software Solutions by Industry | Use Cases"

export async function generateMetadata() {
  const index = await getUseCaseIndex()
  const description = `${index.total} AI and monday.com use cases across ${index.industries.length} industries. Filter by industry and team, and see the process, boards, automations and integrations behind each.`
  return vcMetadata(USE_CASES_PATH, { title: TITLE, description })
}

export default async function Page() {
  const index = await getUseCaseIndex()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}${USE_CASES_PATH}#page`,
    url: `${SITE_URL}${USE_CASES_PATH}`,
    name: TITLE,
    about: "AI and monday.com use cases by industry",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: index.industries.length,
      itemListElement: index.industries.map((i, n) => ({
        "@type": "ListItem",
        position: n + 1,
        url: `${SITE_URL}${industryHref(i)}`,
        name: i.name,
      })),
    },
  }
  return (
    <>
      <JsonLd data={jsonLd} />
      <VcPage path={USE_CASES_PATH} slug="ai-use-cases" />
    </>
  )
}

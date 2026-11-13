import "@/styles/vc/pages/pricing.css"
import { notFound } from "next/navigation"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { getVcPage } from "@/sanity/vcQueries"
import { buildLicenceJsonLd, PAGE_PATH } from "./jsonld"

/**
 * /licence-procurement: a Version C page (vcPage-licence-procurement, group "core").
 * It reuses the approved /implementation-packages layout (slug "pricing"), its
 * sibling in the Pricing menu. Content: scripts/vc/add-licence-procurement.ts.
 */
export function generateMetadata() {
  return vcMetadata(PAGE_PATH)
}

export default async function Page() {
  const page = await getVcPage(PAGE_PATH)
  if (!page) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLicenceJsonLd(page)) }} />
      <VcPage path={PAGE_PATH} slug="pricing" page={page} />
    </>
  )
}

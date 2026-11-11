import "@/styles/vc/pages/pricing.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { getVcPage } from "@/sanity/vcQueries"
import { notFound } from "next/navigation"
import { PAGE_PATH, SEO_DESCRIPTION, SEO_TITLE } from "./content"
import { buildPricingJsonLd } from "./jsonld"

export function generateMetadata() {
  return vcMetadata(PAGE_PATH, { title: SEO_TITLE, description: SEO_DESCRIPTION })
}

export default async function Page() {
  const page = await getVcPage(PAGE_PATH)
  if (!page) notFound()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPricingJsonLd(page, { title: page.seoTitle ?? SEO_TITLE, description: page.seoDescription ?? SEO_DESCRIPTION })) }}
      />
      <VcPage path={PAGE_PATH} slug="pricing" page={page} />
    </>
  )
}

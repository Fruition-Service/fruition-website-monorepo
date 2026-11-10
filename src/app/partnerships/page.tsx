import "@/styles/vc/pages/partnerships.css"
import { vercelStegaClean } from "@vercel/stega"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import type { VcDirectoryData } from "@/components/vc/types"
import { collectionPageJsonLd, jsonLdScript } from "@/lib/collectionSchema"
import { getVcPage } from "@/sanity/vcQueries"

const PATH = "/partnerships"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default async function Page() {
  const page = await getVcPage(PATH)
  // CollectionPage JSON-LD lists the partner tiles the directory renders.
  const dir = page?.sections?.find((s): s is VcDirectoryData => s._type === "vcDirectory")
  const jsonLd = collectionPageJsonLd({
    path: PATH,
    name: "Technology partners",
    description: vercelStegaClean(page?.seoDescription ?? ""),
    items: (dir?.tiles ?? [])
      .filter((t) => t.title && t.href)
      .map((t) => ({ name: vercelStegaClean(t.title!), href: vercelStegaClean(t.href!) })),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <VcPage path={PATH} slug="partnerships" page={page} />
    </>
  )
}

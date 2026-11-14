// Version C (14 Nov 2026): built on the approved /ai-use-cases hub layout (its industry
// go-cards), so it shares that page's stylesheet and scope class. Content: the
// vcPage document for /industries (docs/version-c.md).
import "@/styles/vc/pages/ai-use-cases.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { INDUSTRIES_HUB as hub } from "@/data/hubs/industries"
import { collectionPageJsonLd, jsonLdScript } from "@/lib/collectionSchema"

const PATH = "/industries"

export function generateMetadata() {
  return vcMetadata(PATH, { title: hub.seoTitle, description: hub.seoDescription })
}

export default function Page() {
  // Same CollectionPage structured data the hub shipped before Version C.
  const jsonLd = collectionPageJsonLd({
    path: PATH,
    name: "Industries",
    description: hub.seoDescription,
    items: [...hub.sectors.map((s) => ({ name: s.title, href: s.href })), ...hub.also.map((a) => ({ name: a.label, href: a.href }))],
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <VcPage path={PATH} slug="ai-use-cases" />
    </>
  )
}

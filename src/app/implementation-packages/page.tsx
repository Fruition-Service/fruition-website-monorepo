import type { Metadata } from "next"
import { stegaClean } from "@sanity/client/stega"
import { getCaseStudies } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import { buildOgMetadata } from "@/lib/metadata"
import ImplementationPackagesContent, { type ReviewPhotos } from "./ImplementationPackagesContent"
import { buildJsonLd, PAGE_PATH } from "./content"
import { getImplementationPackagesContent } from "./sanityContent"

/*
 * Copy, prices, FAQs and the meta title/description come from the Sanity
 * singleton `implementationPackagesPage`, laid over the defaults in ./content
 * (./sanityContent). Reviewers' profile photos come from the caseStudy
 * documents, matched by name and optional.
 */

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getImplementationPackagesContent()
  return {
    alternates: { canonical: PAGE_PATH },
    title: seo.title,
    description: seo.description,
    ...buildOgMetadata({ title: seo.title, description: seo.description, path: PAGE_PATH }),
  }
}

interface CaseStudyPhoto {
  clientName?: string
  profilePhoto?: unknown
}

async function loadReviewPhotos(names: string[]): Promise<ReviewPhotos> {
  const wanted = new Set(names)
  const photos: ReviewPhotos = {}
  let studies: CaseStudyPhoto[] = []
  try {
    studies = ((await getCaseStudies()) as CaseStudyPhoto[] | null) ?? []
  } catch {
    return photos
  }
  for (const s of studies) {
    const name = s.clientName?.trim()
    if (!name || !wanted.has(name) || photos[name] || !s.profilePhoto) continue
    // Legacy Wix image refs make urlFor() throw; a missing photo is fine.
    try {
      photos[name] = urlFor(s.profilePhoto as Parameters<typeof urlFor>[0]).width(96).height(96).fit("crop").auto("format").url()
    } catch {
      /* skip */
    }
  }
  return photos
}

export default async function Page() {
  const content = await getImplementationPackagesContent()
  const reviewPhotos = await loadReviewPhotos(content.reviews.items.map((r) => stegaClean(r.name)))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(content)) }} />
      <ImplementationPackagesContent content={content} reviewPhotos={reviewPhotos} />
    </>
  )
}

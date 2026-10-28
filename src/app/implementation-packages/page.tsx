import type { Metadata } from "next"
import { getCaseStudies } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import { buildOgMetadata } from "@/lib/metadata"
import ImplementationPackagesContent, { type ReviewPhotos } from "./ImplementationPackagesContent"
import { buildJsonLd, PAGE_PATH, REVIEWS, SEO_DESCRIPTION, SEO_TITLE } from "./content"

/*
 * Copy, prices and FAQs live in ./content (not the `implementationPackagesPage`
 * Sanity doc, which this route no longer reads). Sanity is only used for the
 * reviewers' profile photos, matched by name and optional.
 */

export const metadata: Metadata = {
  alternates: { canonical: PAGE_PATH },
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  ...buildOgMetadata({ title: SEO_TITLE, description: SEO_DESCRIPTION, path: PAGE_PATH }),
}

interface CaseStudyPhoto {
  clientName?: string
  profilePhoto?: unknown
}

async function loadReviewPhotos(): Promise<ReviewPhotos> {
  const wanted = new Set(REVIEWS.items.map((r) => r.name))
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
  const reviewPhotos = await loadReviewPhotos()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }} />
      <ImplementationPackagesContent reviewPhotos={reviewPhotos} />
    </>
  )
}

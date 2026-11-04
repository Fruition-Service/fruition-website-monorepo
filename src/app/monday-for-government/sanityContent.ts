import { cache } from "react"
import type { IndustrySections } from "@/data/industrySections"
import { client } from "@/sanity/client"
import { DEFAULT_SECTIONS, PAGE_SLUG } from "./content"
import { mergeSections } from "./contentMerge"

/**
 * The page's long-form sections for this render. In edit mode the client
 * returns stega-encoded copy, which is what makes the text clickable in the
 * inline editor.
 *
 * A failed read falls back to the defaults rather than 404ing the page: the
 * sections are an addition to a page that renders fine without them.
 */
export const getMondayForGovernmentSections = cache(async (): Promise<IndustrySections> => {
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(
      `*[_type == "industryPage" && slug.current == $slug][0]{ sections }`,
      { slug: PAGE_SLUG },
    )
    return mergeSections(doc)
  } catch {
    return DEFAULT_SECTIONS
  }
})

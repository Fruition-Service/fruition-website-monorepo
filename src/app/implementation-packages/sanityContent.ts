import { cache } from "react"
import { client } from "@/sanity/client"
import { DEFAULT_CONTENT, type PageContent } from "./content"
import { mergeContent } from "./contentMerge"

/** The page's content for this render. In edit mode the client returns stega-encoded copy. */
export const getImplementationPackagesContent = cache(async (): Promise<PageContent> => {
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(`*[_type == "implementationPackagesPage"][0]`)
    return mergeContent(doc)
  } catch {
    return DEFAULT_CONTENT
  }
})

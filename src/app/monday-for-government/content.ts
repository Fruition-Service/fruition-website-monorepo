import { getIndustrySections, type IndustrySections } from "@/data/industrySections"

/**
 * /monday-for-government.
 *
 * Every other part of this page already reads its copy from the `industryPage`
 * document: hero, comparison tabs, capability cards, FAQ, meta title and
 * description. The two long-form sections below the comparison tabs did not.
 * Their wording lived only in src/data/industrySections.ts, so nobody could
 * edit it in Studio or in the inline editor.
 *
 * That file stays the home of the default wording. The page's Sanity
 * `sections` object is laid over it field by field (./contentMerge), so a
 * blank Sanity field shows this text and the page renders exactly as it did
 * before the sections had a CMS home.
 */

export const PAGE_SLUG = "monday-for-government"
export const PAGE_PATH = `/${PAGE_SLUG}`

export const DEFAULT_SECTIONS: IndustrySections = getIndustrySections(PAGE_SLUG)

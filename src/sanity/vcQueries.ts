import { client } from './client'
import type { VcPageData, VcSharedData } from '@/components/vc/types'

/**
 * Version C page loader. Sections come back as stored; shared documents
 * (case studies, quotes, central FAQ items) are dereferenced in place. Images
 * stay as raw references: the asset id encodes the dimensions and the image
 * URL builder needs nothing else.
 */
const SECTIONS = `sections[]{
  ...,
  _type == "vcCases" => { cases[]->{ _id, client, label, body, tags, results, photo, logo, href } },
  _type == "vcProof" => { quotes[]->{ _id, org, quote, name, role, initials } },
  _type == "vcFaq" => { tabs[]{ _key, label, items[]->{ _id, question, answer } } }
}`

export async function getVcPage(path: string): Promise<VcPageData | null> {
  return client.fetch<VcPageData | null>(
    `*[_type == "vcPage" && path == $path && !(_id in path("drafts.**"))][0]{ _id, title, path, group, seoTitle, seoDescription, ogImage, ${SECTIONS} }`,
    { path },
  )
}

export async function getVcShared(): Promise<VcSharedData | null> {
  return client.fetch<VcSharedData | null>(`*[_id == "vcShared"][0]{ practitioners, bookingCalTitle, bookingEmail }`)
}

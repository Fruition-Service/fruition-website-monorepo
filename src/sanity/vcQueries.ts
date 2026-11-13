import { client } from './client'
import { withAuthorPhotos } from './queries'
import { getPartners, resolvePartnerImages } from './partners'
import type { VcPageData, VcSharedData } from '@/components/vc/types'

/**
 * Version C page loader. Sections come back as stored; shared documents
 * (case studies, quotes, central FAQ items) are dereferenced in place. Images
 * stay as raw references: the asset id encodes the dimensions and the image
 * URL builder needs nothing else.
 */
/** A team member reference with this page's optional role and bio overrides. */
const TEAMREF = `{ "override": bio, "roleOverride": role, ...person->{ _id, name, role, bio, photo, linkedinUrl } }`

/**
 * Every client-quote wall on the site shows the same quotes: the list on the
 * customer stories page (/customer-testimonials). A page's own `quotes` field
 * is only a fallback for when that list is missing, so the wall is edited in
 * one place and never drifts between pages.
 */
const QUOTE_WALL_SOURCE = `*[_id == "vcPage-customer-testimonials"][0].sections[_type == "vcProof"][0].quotes`

const SECTIONS = `sections[]{
  ...,
  _type == "vcCases" => { cases[]->{ _id, client, label, body, tags, results, photo, logo, href } },
  _type == "vcProof" => { "quotes": coalesce(${QUOTE_WALL_SOURCE}, quotes)[]->{ _id, org, quote, name, role, initials, photo, tag } },
  _type == "vcFaqHub" => { categories[]{ ..., groups[]{ _key, name, items[]->{ _id, question, answer } } } },
  _type == "vcStories" => { stories[]->{ _id, num, client, sub, solution, weeks, logo, metrics, quote, people, challenge, solutionText, impact, location, employees, industry, useCase, tags } },
  _type == "vcFaq" => { tabs[]{ _key, label, items[]->{ _id, question, answer } } },
  _type == "vcTeam" => { members[]${TEAMREF} },
  _type == "vcPractitioners" => { leader${TEAMREF} },
  _type == "vcLeadership" => { ceo${TEAMREF}, people[]${TEAMREF} },
  _type == "vcTeamTabs" => { tabs[]{ ..., leaders[]${TEAMREF}, members[]${TEAMREF} } }
}`

export async function getVcPage(path: string): Promise<VcPageData | null> {
  const [page, partners] = await Promise.all([
    client.fetch<VcPageData | null>(
      `*[_type == "vcPage" && path == $path && !(_id in path("drafts.**"))][0]{ _id, title, path, group, seoTitle, seoDescription, ogImage, ${SECTIONS} }`,
      { path },
    ),
    getPartners(),
  ])
  // Partner badges and logos come from Partners & badges (src/sanity/partners.ts).
  return page ? resolvePartnerImages(page, partners) : page
}

export async function getVcShared(): Promise<VcSharedData | null> {
  return client.fetch<VcSharedData | null>(
    `{ "s": *[_id == "vcShared"][0]{ practitioners, bookingCalTitle, bookingEmail }, "offices": *[_id == "siteSettings"][0].offices }{ ...s, offices }`,
  )
}

export interface VcBlogCard { _id: string; title?: string; slug?: string; publishedAt?: string; author?: string; category?: string; categories?: (string | null)[]; charCount?: number; cover?: { asset?: { _ref?: string } } }

/** Every published post for the blog list (light fields only; 12 render per page). */
export async function getVcBlogCards(): Promise<VcBlogCard[]> {
  return client.fetch<VcBlogCard[]>(
    `*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id, title, "slug": slug.current, publishedAt, author, "category": categories[0]->title,
      "categories": categories[]->title,
      "charCount": length(pt::text(body)),
      "cover": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]){ asset }
    }`,
  )
}

export interface VcHomePost { _id: string; title?: string; slug?: string; publishedAt?: string; author?: string; authorPhotoUrl?: string; excerpt?: string; category?: string; charCount?: number; cover?: { asset?: { _ref?: string } } }

/** The three most recent posts, for the home page Insights cards. */
export async function getVcHomePosts(): Promise<VcHomePost[]> {
  return withAuthorPhotos(await client.fetch<VcHomePost[]>(
    `*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...3] {
      _id, title, "slug": slug.current, publishedAt, author, excerpt, "category": categories[0]->title,
      "charCount": length(pt::text(body)),
      "cover": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]){ asset }
    }`,
  ))
}

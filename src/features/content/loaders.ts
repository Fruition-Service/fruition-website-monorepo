import { cache } from 'react'
import { client } from '@/sanity/client'

export async function getHomePage() {
  return client.fetch(
    `*[_type == "homePage"][0] {
      _id,
      title,
      seoTitle,
      seoDescription,
      contentBlocks[] {
        _key,
        _type,
        ...
      }
    }`
  )
}

// Deduped per render pass: the root layout fetches this in both
// generateMetadata and the component body, so without cache() every page
// render hit the Sanity CDN twice for the same document.
export const getSiteSettings = cache(async () => {
  return client.fetch(`*[_type == "siteSettings"][0]`)
})

/**
 * Everything the 2026 home page needs, in one round trip.
 *
 * The page's copy lives in `src/components/home/data.ts`; this only fetches the
 * parts that must stay live — page copy slots (see components/home/copy.ts),
 * client logos, testimonials, office phone numbers and the three most recent posts. Testimonials still come from the homePage
 * `contentBlocks` so the marketing team keeps editing them where they always
 * have, even though the blocks are no longer rendered by BlockRenderer.
 */
export async function getHomeSectionData() {
  return client.fetch(
    `{
      "settings": *[_type == "siteSettings"][0]{
        contactEmail,
        phone,
        calendlyLink,
        offices,
        carouselLogos[]{ _key, alt, image, clientSlug }
      },
      "copy": *[_type == "homePage"][0].copy[]{ _key, text },
      "testimonials": *[_type == "homePage"][0].contentBlocks[_type == "testimonialBlock"]{
        _key,
        quote,
        authorName,
        authorRole,
        company,
        profilePhoto
      },
      "posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc)[0...3]{
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        author,
        excerpt,
        "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]),
        "charCount": length(pt::text(body)),
        categories[]->{ _id, title }
      }
    }`
  )
}

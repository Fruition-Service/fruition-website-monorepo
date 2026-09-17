import { cache } from 'react'
import { client } from './client'
import { authorSlug } from './authorSlug'

/* ================================================================== */
/*  Blog                                                                */
/* ================================================================== */

export async function getBlogPosts(limit = 12, offset = 0) {
  return client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) [$offset...$end] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      author,
      excerpt,
      "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]),
      "charCount": length(pt::text(body)),
      categories[]->{ _id, title, "slug": slug.current }
    }`,
    { offset, end: offset + limit }
  )
}

export async function getBlogPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      author,
      excerpt,
      "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]),
      body,
      seoKeyword,
      seoTitle,
      seoDescription,
      videoUrls,
      categories[]->{ _id, title, "slug": slug.current }
    }`,
    { slug }
  )
}

export async function getRelatedBlogPosts(excludeSlug: string, limit = 2) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current != $excludeSlug] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0])
    }`,
    { excludeSlug, limit }
  )
}

export interface BlogAuthorSummary {
  name: string
  slug: string
  postCount: number
  latestPublishedAt?: string
}

/**
 * Distinct blog authors with a post count + slug. Author is a free-text string
 * on blogPost (not a reference), so grouping happens in JS after the fetch.
 * Used by /author/[slug] generateStaticParams and to resolve slug -> exact name.
 */
export async function getBlogAuthors(): Promise<BlogAuthorSummary[]> {
  const rows: { author?: string; publishedAt?: string }[] = await client.fetch(
    `*[_type == "blogPost" && defined(author) && author != ""]{ author, publishedAt } [0...500]`
  )
  const map = new Map<string, BlogAuthorSummary>()
  for (const row of rows) {
    const name = (row.author ?? "").trim()
    if (!name) continue
    const slug = authorSlug(name)
    if (!slug) continue
    const existing = map.get(slug)
    if (existing) {
      existing.postCount += 1
      if (row.publishedAt && (!existing.latestPublishedAt || row.publishedAt > existing.latestPublishedAt)) {
        existing.latestPublishedAt = row.publishedAt
      }
    } else {
      map.set(slug, { name, slug, postCount: 1, latestPublishedAt: row.publishedAt })
    }
  }
  return [...map.values()].sort((a, b) => b.postCount - a.postCount)
}

export async function getPostsByAuthor(authorName: string) {
  return client.fetch(
    `*[_type == "blogPost" && author == $authorName] | order(publishedAt desc) [0...100] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      author,
      excerpt,
      "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]),
      "charCount": length(pt::text(body)),
      categories[]->{ _id, title, "slug": slug.current }
    }`,
    { authorName }
  )
}

export async function getTeamMemberByName(name: string) {
  return client.fetch(
    `*[_type == "teamMember" && lower(name) == lower($name)][0] {
      name, role, emoji, photo, bio, linkedinUrl, regions,
      "photoUrl": photo.asset->url
    }`,
    { name }
  )
}

export async function getBlogCategories() {
  return client.fetch(
    `*[_type == "blogCategory"] | order(title asc) [0...100] { _id, title, "slug": slug.current, description }`
  )
}

/** Every published post, in the shape the internal portal's blog table needs. */
export async function getAllBlogPostsForPortal() {
  // No slice: a cap here silently hides the oldest posts from the portal, which
  // cannot then be found or edited by anyone. It sat at 200 while Sanity held
  // 228, so 28 live posts were unreachable.
  return client.fetch(
    `*[_type == "blogPost"] | order(coalesce(publishedAt, _updatedAt) desc) {
      _id, title, "slug": slug.current, publishedAt, _updatedAt, author, industry, excerpt
    }`
  )
}

/** One post with everything the portal editor needs to re-edit it. */
export async function getBlogPostForPortalEdit(docId: string) {
  return client.fetch(
    `*[_type == "blogPost" && _id == $docId][0] {
      _id, title, "slug": slug.current, publishedAt, author, industry, excerpt,
      seoKeyword, seoTitle, seoDescription, body, "categoryIds": categories[]._ref
    }`,
    { docId }
  )
}

/* ================================================================== */
/*  Page docs (industry / location / partnership / service / solution) */
/* ================================================================== */

const PAGE_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  seoDescription,

  // CRO action-item sections (full nested object tree)
  croSections,

  // Hero
  heroEyebrow,
  heroHeading,
  heroSubheading,
  heroBody,
  heroImage,
  heroLocalVideoSrc,
  heroVideoUrl,
  heroVideoTitle,
  heroPartnerBadges[]{ name, image, width, height },
  heroStats,
  hideHeroSubheading,
  heroSplitLayout,
  hideHeroPartnerBadges,
  heroPartnerImagePath,
  testimonialBannerPrimaryCtaLabel,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,

  body,

  // Logo cloud
  logoCloudHeadingPart1,
  logoCloudHeadingAccent,
  logoCloudDescription,

  // Comparison tabs
  comparisonHeading,
  comparisonSubheading,
  comparisonTheme,
  comparisonLayout,
  comparisonTabs,

  // Methodology
  methodologyHeading,
  methodologySteps,

  // Calendly
  calendlyHeading,
  calendlySubheading,

  // FAQ
  faqTabs,

  // Partner-page feature blocks + ROI stats
  featureBlocks,
  roiStats,

  // Industry/service/partnership page extras (per-page hardcoded data)
  bottomStats,
  workflowTabsHeading,
  workflowTabs,
  certificateBadges,
  provenStats,
  marketingCaseStudyCards,
  lifecycleStages,
  fitReasons,
  industryTestimonials,
  whyBestHeading,
  whyBestCards,
  caseStudyBlockHeading,
  caseStudyVideoUrl,
  caseStudyVideoTitle,
  caseStudyStats,
  caseStudyQuote,
  caseStudyQuoteAuthor,
  caseStudyCtaLabel,
  caseStudyCtaUrl,
  // Finance / solution-page specifics
  whyMondayItems,
  featuresItems,
  howWeHelpItems,
  generalFaqs,
  financeFaqs,
  financeFeatureCards,
  servicesList,
  solarTestimonials,
  // Partnership-page specifics
  everythingAppCards,
  servicesTabs,
  industryTabsPartnership,
  everythingAppFeatures,
  whyFruition,
  partnerTestimonials,
  implementationServices,
  industrySolutions,
  countries,
  fruitionAdvantages,
  aircallTabs,
  aircallFeatures,
  atlassianTabs,
  serviceCards,
  expertCards,
  // ClickUp
  clickupFaqTabs,
  // Make-partners + impl-consultants (custom doc queries also use these)
  makeFeatureTabs,
  showcaseOverrides,
  orderedSolutionCards,

  // Capabilities
  capabilitiesEyebrow,
  capabilitiesHeading,
  capabilitiesHeadingAccent,
  capabilitiesSubheading,
  capabilitiesTheme,
  capabilitiesColumns,
  capabilitiesCards,
  capabilitiesCtaLabel,
  capabilitiesCtaUrl,
  capabilitiesCtaSecondaryLabel,
  capabilitiesCtaSecondaryUrl,
  capabilitiesPosition,

  // Secondary capabilities
  secondaryCapabilitiesEyebrow,
  secondaryCapabilitiesHeading,
  secondaryCapabilitiesHeadingAccent,
  secondaryCapabilitiesSubheading,
  secondaryCapabilitiesCards,
  secondaryCapabilitiesColumns,
  secondaryCapabilitiesCtaLabel,
  secondaryCapabilitiesCtaUrl,

  // Remote team / offices
  remoteTeamEyebrow,
  remoteTeamHeading,
  remoteTeamHeadingAccent,
  remoteTeamSubheading,
  officeLocations,
  remoteFeatures,
  remoteTeamCtaLabel,
  remoteTeamCtaUrl,

  // Feature list
  featureListHeading,
  featureListHeadingAccent,
  featureListSubheading,
  featureListTheme,
  featureListColumns,
  featureListItems,

  // Services cards
  servicesHeading,
  servicesHeadingAccent,
  servicesSubheading,
  servicesTheme,
  servicesCards,

  // Industry tabs
  industryHeading,
  industryTabs,

  // Why Product Teams (Monday PM)
  whyProductTeamsHeadingPart1,
  whyProductTeamsHeadingAccent,
  whyProductTeamsSubheading,
  whyProductTeamsCards,

  // Strategic Approach (Monday PM)
  strategicApproachHeadingPart1,
  strategicApproachHeadingAccent,
  strategicApproachSubheading,
  strategicApproachTabs,

  // Industry Product Solutions (Monday PM)
  industryProductSolutionsHeading,
  industryProductSolutionsTabs,

  // Product Development (Monday PM)
  productDevelopmentHeadingPart1,
  productDevelopmentHeadingAccent,
  productDevelopmentHeadingPart2,
  productDevelopmentTabs,

  // Solution cards
  solutionCards,

  // Case study cards
  caseStudySectionHeading,
  caseStudyCards,

  // Bottom video + bottom feature-cards section
  bottomVideoUrl,
  bottomVideoTitle,
  bottomFeatureSectionHeadingPart1,
  bottomFeatureSectionHeadingAccent,
  beforeAfterHeading,

  // Inline section copy (industry pages mostly)
  introStripBody,
  lifecycleSectionHeading,
  lifecycleSectionHeadingAccent,
  industryTestimonialsHeading,
  industryTestimonialsHeadingAccent,
  testimonialsGridHeading,
  testimonialsGridCtaLabel,
  testimonialsGridStatValue,
  testimonialsGridStatSubtitle,
  testimonialsGridStatCtaLabel,
  testimonialsGridStatCtaUrl,

  // Team Grid section
  teamGridHeading,
  teamGridSubheading,
  teamGridCtaLabel,
  teamGridCtaUrl,

  // /fruition-team region filter chips
  teamRegions,
  heroDescriptionBlocks,

  // Text content
  textContentSections,

  // Application form
  applicationFormHeading,
  applicationFormEmbedUrl,

  // Join stats
  joinHeadingPart1,
  joinHeadingAccent,
  joinHeadingPart2,
  joinSubheading,
  joinStats,
  joinFootnote,

  // monday Service specific
  serviceHeroImage,
  comparisonHeadingAccent,
  comparisonEyebrow,
  featureTabsIntroSubheading,
  fourCardsHeadingPart1,
  fourCardsHeadingAccent,
  fourCardsCtaLabel,
  fourCardsCtaUrl,
  fourCards,
  faqHeading,
  faqEyebrow,
  faqFlatItems,
  strategicColumnsHeadingPart1,
  strategicColumnsHeadingAccent,
  strategicColumnsSubheading,
  strategicColumns,

  // Cabinetry / industry-vertical
  trustedByCaption,
  keyFeaturesHeadingPart1,
  keyFeaturesHeadingAccent,
  keyFeatures,
  servicesListHeadingPart1,
  servicesListHeadingAccent,
  servicesListItems,
  inlineTestimonials[]{ quote, name, role, company, photo },
  returnsBannerHeading,
  returnsBannerSubheading,
  returnsBannerPrimaryLabel,
  returnsBannerPrimaryUrl,
  returnsBannerSecondaryLabel,
  returnsBannerSecondaryUrl,
  beforeAfterTabs,
  heroImageUrl,

  // Section visibility toggles
  hideDiscoverSection,
  hideJoinStatsSection,
  hideTestimonialBanner,
  hideSecurityBadgeSection,
  hideTestimonialsSection,
  hideFaqSection,
  hideCapabilitiesSection,
  hideCaseStudyCardsSection,
  hideSolutionCardsSection,

  // Partnership-page join CTA (button under joinStats)
  joinCtaLabel,
  joinCtaUrl
`

export async function getSolutionPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "solutionPage" && slug.current == $slug][0]{${PAGE_FIELDS}}`,
    { slug }
  )
}

export async function getPartnershipPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "partnershipPage" && slug.current == $slug][0]{${PAGE_FIELDS}, partnerName, partnerLogo}`,
    { slug }
  )
}

export async function getAiPartnerPageBySlug(slug: string) {
  // Full document — the bespoke AiPartnerTemplate consumes every field.
  return client.fetch(
    `*[_type == "aiPartnerPage" && slug.current == $slug][0]`,
    { slug }
  )
}

/**
 * Region page (`/monday-partner-*`). Deliberately does NOT use PAGE_FIELDS:
 * `locationPage` was reshaped around the redesigned template, so it shares
 * almost nothing with the generic page projection. Every field here maps onto
 * `RegionContent` — see `mergeRegionContent`.
 */
export async function getLocationPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "locationPage" && slug.current == $slug][0]{
      _id, title, "slug": slug.current,
      seoTitle, seoDescription,
      country, region, flag,
      heroImage,
      primaryCtaLabel, primaryCtaUrl,
      hero,
      services,
      answerBlock,
      testimonials,
      video,
      process,
      numbers,
      team,
      coverage,
      faq,
      closingCta
    }`,
    { slug }
  )
}

export async function getIndustryPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "industryPage" && slug.current == $slug][0]{${PAGE_FIELDS}, industryName}`,
    { slug }
  )
}

export async function getServicePageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "servicePage" && slug.current == $slug][0]{${PAGE_FIELDS}}`,
    { slug }
  )
}

/* ================================================================== */
/*  Listing queries                                                     */
/* ================================================================== */

export async function getAllSolutionPages() {
  return client.fetch(
    `*[_type == "solutionPage"] | order(title asc) [0...200] {
      _id, title, "slug": slug.current, heroSubheading
    }`
  )
}

export async function getAllPartnershipPages() {
  return client.fetch(
    `*[_type == "partnershipPage"] | order(title asc) [0...200] {
      _id, title, "slug": slug.current, partnerName, partnerLogo, heroSubheading
    }`
  )
}

export async function getAllIndustryPages() {
  return client.fetch(
    `*[_type == "industryPage"] | order(title asc) [0...200] {
      _id, title, "slug": slug.current, industryName, heroSubheading
    }`
  )
}

export async function getAllLocationPages() {
  return client.fetch(
    `*[_type == "locationPage"] | order(title asc) [0...200] {
      _id, title, "slug": slug.current, country, region, "heroSubheading": hero.subheading
    }`
  )
}

export async function getAllServicePages() {
  return client.fetch(
    `*[_type == "servicePage"] | order(title asc) [0...100] {
      _id, title, "slug": slug.current, heroSubheading
    }`
  )
}

/* ================================================================== */
/*  Site-wide docs                                                      */
/* ================================================================== */

// Deduped per render pass: the root layout calls this from both
// generateMetadata and the component body on every page.
export const getSiteSettings = cache(async () => {
  return client.fetch(`*[_type == "siteSettings"][0]{
    contactEmail,
    phone,
    calendlyLink,
    defaultSeoTitle,
    defaultSeoDescription,
    excludedTeamMemberNames,
    mondayAffiliateLink,
    logo,
    logoWhite,
    logoRound,
    footerText,
    navigation,
    navbarPartnerBadges[]{ name, image, width, height },
    footerPartnerLogos[]{ name, image, width, height },
    socialLinks[]{ label, href, icon },
    offices,
    footerServicesLinks,
    footerDepartmentLinks,
    footerIndustryLinks,
    carouselLogos[]{ alt, image, clientSlug },
    badgeCertifications,
    badgeSecurity,
    badgeForrester,
    badgeMondayPartners,
    navbarCtaLabel,
    footerCtaLabel,
    stickyCtaHeading,
    stickyCtaLabel,
    stickyCtaMobileLabel,
    stickyCtaUrl,
    footerPartnerExpertiseHeading,
    footerServicesHeading,
    footerDepartmentSolutionsHeading,
    footerIndustrySolutionsHeading,
    footerOurLocationsHeading,
    footerLegalLinks,
    footerCopyrightText
  }`)
})

export async function getTeamMembers() {
  return client.fetch(
    `*[_type == "teamMember"] | order(order asc) [0...200] { _id, name, role, emoji, photo, bio, linkedinUrl, regions, regionPagesOnly, order, certifications }`
  )
}

/** One team member by id, with a resolved photo URL for the portal edit form. */
export async function getTeamMemberById(id: string) {
  return client.fetch(
    `*[_type == "teamMember" && _id == $id][0] {
      _id, name, role, emoji, bio, linkedinUrl, regions, order, certifications,
      "photoUrl": photo.asset->url
    }`,
    { id }
  )
}

export async function getCaseStudies() {
  return client.fetch(
    `*[_type == "caseStudy"] [0...200] { _id, clientName, clientRole, clientCompany, quote, logo, profilePhoto, linkedinUrl }`
  )
}

export async function getFaqItems() {
  return client.fetch(
    `*[_type == "faqItem"] | order(coalesce(categoryOrder, 99) asc, order asc) [0...500] {
      _id, question, answer, category, categoryOrder, order, pages
    }`
  )
}

/**
 * Return every faqItem that should render on the given page, already
 * sorted so items within each category are in the right order and
 * categories follow the curated tab order.
 *
 * Pass the page key that matches an entry in faqItem.pages (see the
 * schema's `pages` dropdown). The /faqs page uses `"faqs"`.
 */
export async function getFaqItemsForPage(pageKey: string) {
  const items = await client.fetch(
    `*[_type == "faqItem" && ($pageKey in pages || "faqs" in pages)] | order(coalesce(categoryOrder, 99) asc, order asc) [0...200] {
      _id, question, answer, category, categoryOrder, order, pages
    }`,
    { pageKey }
  )
  // Prefer page-specific items; fall back to curated /faqs set when the page
  // has none, so visitors aren't dropped into a missing-section state.
  // Pages that should stay FAQ-less can opt out via `hideFaqSection: true`.
  const specific = items.filter((i: { pages?: string[] }) => i.pages?.includes(pageKey))
  if (specific.length > 0) return specific
  return items.filter((i: { pages?: string[] }) => i.pages?.includes("faqs"))
}

/** Canonical fallbacks when the proofStats doc is absent — matches the live
 *  dataset's dominant values (implementation count raised 500+ → 900+ on
 *  2026-09-14; 4.9 rating; 180,000+ monday customers). */
export const PROOF_STATS_DEFAULTS = {
  implementations: '900+',
  clientRating: '4.9',
  marketsCount: '6',
  mondayEcosystemCustomers: '180,000+',
  partnerTierMonday: 'Platinum monday.com Partner',
  partnerTierAtlassian: 'Platinum Atlassian Partner',
  awards: ['monday.com Rising Star 2026', 'Atlassian Rising Star of the Year 2026'],
}

/**
 * The proofStats singleton — Fruition's entity-signal numbers (implementation
 * count, rating, partner tiers, awards). Always returns a complete object:
 * missing doc or missing fields fall back to PROOF_STATS_DEFAULTS.
 */
export async function getProofStats(): Promise<typeof PROOF_STATS_DEFAULTS> {
  const doc = await client.fetch(`*[_id == "proofStats"][0]{
    implementations, clientRating, marketsCount, mondayEcosystemCustomers,
    partnerTierMonday, partnerTierAtlassian, awards
  }`)
  const merged = { ...PROOF_STATS_DEFAULTS }
  for (const key of Object.keys(PROOF_STATS_DEFAULTS) as (keyof typeof PROOF_STATS_DEFAULTS)[]) {
    const v = doc?.[key]
    if (v != null && (typeof v !== 'string' || v.trim() !== '') && !(Array.isArray(v) && v.length === 0)) {
      ;(merged as Record<string, unknown>)[key] = v
    }
  }
  return merged
}

/**
 * Quote testimonials for a page — caseStudy docs tagged with the page key,
 * in page order. Returns [] when none are tagged; callers keep their previous
 * page-field arrays as fallback, so a missing tag never breaks a page.
 */
export async function getCaseStudiesForPage(pageKey: string) {
  return client.fetch(
    `*[_type == "caseStudy" && $pageKey in pages] | order(coalesce(order, 99) asc) {
      _id, clientName, clientRole, clientCompany, quote, logo, profilePhoto,
      linkedinUrl, industry, platform, order
    }`,
    { pageKey }
  )
}

/**
 * Closing CTA banner copy for a page — the closingCta doc tagged with the
 * page key, or null. Callers keep their previous hardcoded copy as fallback,
 * so a null result never breaks a page (and editors override any page just by
 * tagging a doc with its key).
 */
export async function getClosingCtaForPage(pageKey: string) {
  return client.fetch(
    `*[_type == "closingCta" && $pageKey in pages][0]{
      eyebrow, heading, headingAccent, lead,
      primaryLabel, primaryUrl, secondaryLabel, secondaryUrl
    }`,
    { pageKey }
  )
}

/**
 * The `faqTabs` array curated on whichever document owns this slug, regardless
 * of its _type. `FaqHeadJsonLd` sits in the root layout and only knows the
 * request path, so it cannot go through the per-page loaders — but it still has
 * to honour the same precedence they do (see resolveFaqTabs), or the FAQPage
 * markup in <head> describes content that is not on the page.
 */
export async function getPageFaqTabsBySlug(pageKey: string) {
  // Nested routes carry the full path ("partnerships/n8n-integration-partner")
  // while the document's slug is only the last segment, so try both. Without
  // the segment form those pages matched nothing and fell through to the
  // curated /faqs set — 124 generic questions in the markup of a partner page.
  const slug = pageKey.split("/").pop() || pageKey
  return client.fetch(
    `*[defined(faqTabs) && count(faqTabs) > 0 && slug.current in [$pageKey, $slug]][0].faqTabs[]{
      _key, label, items[]{ _key, question, answer }
    }`,
    { pageKey, slug }
  )
}

/**
 * Like getFaqItemsForPage but WITHOUT the curated-set fallback: returns []
 * when the page has no specific faqItem docs. For callers that carry their
 * own fallback content (templates with hardcoded FAQs pre-migration).
 */
export async function getFaqItemsForPageStrict(pageKey: string) {
  return client.fetch(
    `*[_type == "faqItem" && $pageKey in pages] | order(coalesce(categoryOrder, 99) asc, order asc) [0...200] {
      _id, question, answer, category, categoryOrder, order
    }`,
    { pageKey }
  )
}

export async function getPageBySlug(slug: string) {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, seoTitle, seoDescription,
      croSections,
      leadershipNote, leadershipSignatureName, leadershipSignatureTitle,
      heroEyebrow, heroHeading, heroHeadingAccent,
      heroHeadingPart1, heroHeadingPart2,
      heroPartnerBadgesLabel,
      heroCalloutBadgeLabel, heroCalloutBadgeText, heroCalloutOfficesText,
      heroSubheading, heroBody, heroImage,
      heroLocalVideoSrc,
      heroStats,
      primaryCtaLabel, primaryCtaUrl,
      secondaryCtaLabel, secondaryCtaUrl,
      heroVideoUrl, heroVideoTitle,
      body, pageType,

      // Story section (about-us)
      storyEyebrow, storyHeading, storyHeadingAccent, storyCardEyebrowPrefix,

      // Approach tabs (about-us)
      approachEyebrow, approachHeading, approachHeadingAccent,

      // Methodology extras
      methodologyEyebrow, methodologyStepLabel,

      // Global presence (about-us)
      globalPresenceEyebrow, globalPresenceHeading, globalPresenceHeadingAccent,
      globalPresenceBody,
      offices[]{ _key, city, country, flag, note },

      // Partner stack (about-us)
      partnerStackEyebrow,

      // Closing CTA (about-us)
      closingCtaHeading, closingCtaBody,
      closingCtaPrimaryLabel,
      closingCtaSecondaryLabel, closingCtaSecondaryUrl,

      // Capabilities grid
      capabilitiesEyebrow, capabilitiesHeading, capabilitiesHeadingAccent,
      capabilitiesSubheading, capabilitiesTheme, capabilitiesColumns,
      capabilitiesCards, capabilitiesCtaLabel, capabilitiesCtaUrl,

      // Secondary capabilities
      secondaryCapabilitiesEyebrow, secondaryCapabilitiesHeading,
      secondaryCapabilitiesHeadingAccent, secondaryCapabilitiesSubheading,
      secondaryCapabilitiesCards, secondaryCapabilitiesColumns,
      secondaryCapabilitiesCtaLabel, secondaryCapabilitiesCtaUrl,

      // Partner ecosystem
      partnerEcosystemEyebrow, partnerEcosystemHeading,
      partnerEcosystemHeadingAccent, partnerEcosystemSubheading,
      partnerEcosystemCards[]{ _key, name, tier, description, logo, tint },

      // Remote team / offices
      remoteTeamEyebrow, remoteTeamHeading, remoteTeamHeadingAccent,
      remoteTeamSubheading, officeLocations, remoteFeatures,
      remoteTeamCtaLabel, remoteTeamCtaUrl,

      // Application form
      applicationFormHeading, applicationFormEmbedUrl,

      comparisonHeading, comparisonSubheading, comparisonTabs,
      methodologyHeading, methodologySteps,
      calendlyHeading, calendlySubheading,
      faqHeading, faqTabs,
      teamRegions[]{ _key, code, label, emoji },
      heroDescriptionBlocks[]{ _key, style, text },
      joinHeadingPart1, joinHeadingAccent, joinHeadingPart2,
      joinSubheading, joinStats, joinFootnote,
      logoCloudHeadingPart1, logoCloudHeadingAccent, logoCloudDescription,
      textContentSections,
      heroPartnerBadges[]{ name, image, width, height },

      // Documents (PDFs)
      documents[]{ _key, label, "fileUrl": file.asset->url },

      // Section visibility toggles
      hideDiscoverSection, hideJoinStatsSection, hideTestimonialBanner,
      hideSecurityBadgeSection, hideTestimonialsSection, hideFaqSection,
      hideCapabilitiesSection, hideCaseStudyCardsSection, hideSolutionCardsSection,
      hideHeroSubheading,

      // Case study cards
      caseStudySectionHeading, caseStudyCards,

      // Testimonials
      testimonialsHeading,

      // Discover CTA
      discoverHeading, discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
      discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,

      // Testimonial banner
      testimonialBannerHeadingPart1, testimonialBannerHeadingAccent,
      testimonialBannerHeadingPart2, testimonialBannerPrimaryCtaLabel,
      testimonialBannerPrimaryCtaUrl, testimonialBannerSecondaryCtaLabel,
      testimonialBannerSecondaryCtaUrl
    }`,
    { slug }
  )
}

/* ================================================================== */
/*  Full-page singletons (big structured docs)                          */
/* ================================================================== */

export async function getImplementationPackagesPage() {
  return client.fetch(`*[_type == "implementationPackagesPage"][0]{
    title, seoTitle, seoDescription,
    croSections,
    heroHeadingPart1, heroHeadingAccent, heroHeadingPart2,
    heroPartnerBadges[]{ image, alt },
    heroMondayPartnersImage,
    heroCertificationBadge, heroImage,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    videoEmbedUrl, videoTitle,
    servicesIntroHeadingPart1, servicesIntroHeadingAccent, servicesIntroHeadingPart2,
    servicesIntroImage,
    featureCards,
    socialProofBannerHtml, socialProofCtaLabel, socialProofCtaUrl,
    pricingHeading,
    pricingSubheading,
    pricingFootnote,
    packageTiers[]{
      name,
      hours,
      basePrice,
      pricePrefix,
      featured,
      features
    },
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    calendlyHeading, calendlyUrl,
    faqHeading, faqTabs,
    discoverBadge, discoverHeading,
    discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
    discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,
    methodologyHeading, methodologyHeadingAccent, methodologySteps,
    securityBadge
  }`)
}

export async function getMondayTrainingPage() {
  return client.fetch(`*[_type == "mondayTrainingPage"][0]{
    title, seoTitle, seoDescription,
    croSections,
    heroHeadingPart1, heroHeadingAccent, heroSubheading,
    heroPartnerBadges[]{ image, alt },
    heroMondayPartnersImage,
    heroCertificationBadge, heroImage,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    videoEmbedUrl, videoTitle,
    trainingIntroHeading, trainingIntroSubheading,
    trainingSectionHeading, trainingTabs,
    empowerEyebrow, empowerHeading, empowerBody,
    empowerImage, empowerCtaLabel, empowerCtaUrl,
    servicesHeading, trainingServices,
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    calendlyHeading, calendlySubheading, calendlyUrl,
    faqHeading, faqTabs,
    discoverBadge, discoverHeading,
    discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
    discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,
    joinSectionHeadingPart1, joinSectionHeadingAccent, joinSectionHeadingPart2,
    joinSectionSubheading, joinSectionStats, joinSectionFootnote, joinSectionBadge,
    securityBadge
  }`)
}

export async function getMondayImplementationConsultantsPage() {
  return client.fetch(`*[_type == "mondayImplementationConsultantsPage"][0]{
    title, seoTitle, seoDescription,
    croSections,
    heroEyebrow, heroHeadingPart1, heroHeadingAccent, heroHeadingPart2,
    heroSubheading,
    heroPartnerBadges[]{ image, alt },
    heroMondayPartnersImage,
    heroProductImages[]{ image, alt },
    heroCertificationBadge, heroImage,
    videoEmbedUrl, videoTitle,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    teamsTransformedHeading, teamsTransformedBody,
    comparisonSectionHeading, comparisonTabs,
    methodologyHeading, methodologySteps,
    solutionsHeadingPart1, solutionsHeadingAccent, solutionsHeadingPart2,
    solutionsIntro, solutionCards,
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    calendlyHeading, calendlySubheading, calendlyUrl,
    faqHeading, faqTabs,
    discoverBadge, discoverHeading,
    discoverPrimaryCtaLabel, discoverPrimaryCtaUrl,
    discoverSecondaryCtaLabel, discoverSecondaryCtaUrl,
    joinSectionHeadingPart1, joinSectionHeadingAccent, joinSectionHeadingPart2,
    joinSectionSubheading, joinSectionStats, joinSectionFootnote, joinSectionBadge,
    securityBadge,
    orderedSolutionCards
  }`)
}

export async function getMakePartnersPage() {
  return client.fetch(`*[_type == "makePartnersPage"][0]{
    title, seoTitle, seoDescription,
    croSections,
    heroHeadingPart1, heroHeadingAccent, heroSubheading,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroImage,
    logoCloudHeadingPart1, logoCloudHeadingAccent,
    comparisonHeading, comparisonTabs,
    showcaseHeading, showcaseSubheading,
    showcaseCards[]{ heading, body, imageRight, mediaType, image, "videoUrl": video.asset->url },
    calendlyHeading, calendlySubheading,
    testimonialsHeading, testimonialsCtaLabel, testimonialsCtaUrl,
    statCardValue, statCardSubtitle, statCardCtaLabel, statCardCtaUrl,
    joinHeadingPart1, joinHeadingAccent, joinHeadingPart2,
    joinStats, joinCtaLabel, joinCtaUrl,
    testimonialBannerHeadingPart1, testimonialBannerHeadingAccent, testimonialBannerHeadingPart2,
    testimonialBannerPrimaryCtaLabel, testimonialBannerPrimaryCtaUrl,
    testimonialBannerSecondaryCtaLabel, testimonialBannerSecondaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    announcementHeading, announcementBody, announcementImage,
    featureListsHeading, featureListsSubheading, featureListsRightEyebrow, featureListsFooter,
    featureListLeft, featureListRight,
    discoverHeading,
    makeFeatureTabs,
    showcaseOverrides
  }`)
}

export async function getHomePage() {
  return client.fetch(`*[_type == "homePage"][0]{
    title, seoTitle, seoDescription, contentBlocks[]{..., heroLocalVideoSrc}
  }`)
}
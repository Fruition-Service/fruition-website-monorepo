/**
 * The `body` Portable Text field shared by the page-style documents
 * (industryPage, locationPage, servicePage, solutionPage, partnershipPage, page).
 *
 * These arrays were filled by the Wix migration and hold hundreds of blocks each,
 * including `image` blocks. The field used to accept `of: [{ type: 'block' }]` only,
 * so Studio raised "Invalid Portable Text value — block ... is of type image, which is
 * not allowed by the schema" on every migrated page and offered editors a
 * "Remove the block" button that silently drops content.
 *
 * Declaring the block types that actually exist in the data makes the warning go away
 * and keeps the content safe. Same approach as the legacy coverImageAlt / coverImageUrl
 * fields on blogPost.
 */
export function pageBodyField(description: string) {
  return {
    name: 'body',
    title: 'Body',
    type: 'array',
    description,
    of: [
      { type: 'block' },
      {
        type: 'image',
        fields: [
          { name: 'alt', title: 'Alt Text', type: 'string' },
          { name: 'caption', title: 'Caption', type: 'string' },
        ],
      },
    ],
  }
}

/** Wording for the page types whose templates never render `body`. */
export const LEGACY_BODY_DESCRIPTION =
  'Carried over from the Wix migration. This page template does not render Body — edit the section fields below instead. Kept so the original copy is not lost; do not use "Remove the block" on it.'

export default pageBodyField

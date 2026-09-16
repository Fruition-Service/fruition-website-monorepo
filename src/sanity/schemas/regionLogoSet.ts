/**
 * A per-region client logo wall for the six /monday-partner-* pages.
 *
 * The proof band under each region hero used to be the global
 * `siteSettings.carouselLogos`, which is almost entirely Australian — so a
 * visitor on the UK or US page saw no client from their own market. One
 * document here per region replaces that with clients who actually belong to
 * it; where no document exists the page falls back to the global carousel, so
 * adding a set is always additive.
 *
 * Same shape and same precedence rule as `industryLogoSet` — see
 * `REGION_LOGO_KEYS` in `src/sanity/regionLogos.ts` for the keys the pages ask
 * for, and keep the option list below in step with it.
 */
const regionLogoSet = {
  name: 'regionLogoSet',
  title: 'Region Logo Set',
  type: 'document',
  fields: [
    {
      name: 'regionKey',
      title: 'Region key',
      type: 'string',
      description: 'Must match the region page slug, e.g. "monday-partner-uk".',
      options: {
        list: [
          { title: 'Australia', value: 'monday-partner-australia' },
          { title: 'United Kingdom', value: 'monday-partner-uk' },
          { title: 'United States', value: 'monday-partner-us' },
          { title: 'Singapore', value: 'monday-partner-singapore' },
          { title: 'India', value: 'monday-partner-india' },
          { title: 'Philippines', value: 'monday-partner-philippines' },
        ],
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Label (for editors)',
      type: 'string',
    },
    {
      name: 'lead',
      title: 'Lead paragraph',
      type: 'text',
      rows: 3,
      description:
        'The line under "Trusted by teams across 900+ implementations." Leave blank for the shipped wording.',
    },
    {
      name: 'logos',
      title: 'Logos',
      type: 'array',
      description: 'The first nine are drawn — the tenth cell is the "900+ more" counter.',
      of: [
        {
          type: 'object',
          name: 'clientLogo',
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'image', title: 'Image', type: 'image' },
            {
              name: 'clientSlug',
              title: 'Catalog client slug',
              type: 'string',
              description: 'Optional. Links the logo to that client in the solutions catalog.',
            },
          ],
          preview: { select: { title: 'alt', media: 'image' } },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'regionKey' },
  },
}

export default regionLogoSet

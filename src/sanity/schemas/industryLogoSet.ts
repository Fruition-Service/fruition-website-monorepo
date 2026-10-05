/**
 * A per-industry client logo wall.
 *
 * Every industry page used to render the same global `siteSettings.carouselLogos`,
 * which meant a council saw hospitality brands and a manufacturer saw estate agents.
 * One document here per industry replaces that with the clients who actually belong
 * to the page; where no document exists the page falls back to the global carousel,
 * so adding a set is always additive.
 *
 * `industryKey` is matched in code — see `INDUSTRY_LOGO_KEYS` in
 * `src/sanity/industryLogos.ts` for the keys the pages ask for.
 */
const industryLogoSet = {
  name: 'industryLogoSet',
  title: 'Industry Logo Set',
  type: 'document',
  fields: [
    {
      name: 'industryKey',
      title: 'Industry key',
      type: 'string',
      description: 'Must match the key the page requests, e.g. "construction" or "solar-renewables".',
      options: {
        list: [
          { title: 'Construction', value: 'construction' },
          { title: 'Government', value: 'government' },
          { title: 'Manufacturing', value: 'manufacturing' },
          { title: 'Marketing & Agencies', value: 'marketing' },
          { title: 'Professional Services', value: 'professional-services' },
          { title: 'Real Estate', value: 'real-estate' },
          { title: 'Retail', value: 'retail' },
          { title: 'Financial Services', value: 'financial-services' },
          { title: 'Healthcare', value: 'healthcare' },
          { title: 'Solar & Renewables', value: 'solar-renewables' },
          { title: 'Education', value: 'education' },
          { title: 'Nonprofits', value: 'nonprofits' },
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
      name: 'logos',
      title: 'Logos',
      type: 'array',
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
    select: { title: 'title', subtitle: 'industryKey' },
  },
}

export default industryLogoSet

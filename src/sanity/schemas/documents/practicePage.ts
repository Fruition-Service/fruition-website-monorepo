import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Practice page: every route rendered by PracticePageTemplate (the AI,
 * Atlassian, HubSpot and integrations clusters, /certifications-and-awards)
 * plus the /industries leaves built from the same data. One document per
 * route, matched on `path`.
 *
 * Mirrors the `PracticePage` shape in src/data/practicePages/types.ts. The
 * route renders the code copy in src/data/practicePages/*.ts and this document
 * is merged over it field by field (src/features/content/practicePage.ts), so
 * a blank field here keeps the shipped copy and a filled one replaces it.
 * Empty or half-filled lists are ignored for the same reason: clearing a list
 * in the Studio must not blank a whole section by accident.
 *
 * The "Shared blocks" group (coverage, practice leader, booking) renders on
 * the PracticePageTemplate routes; the /industries leaves use only the logo
 * wall heading from it. Both use the FAQ heading and contact line.
 *
 * Seed with `npx tsx scripts/seed-practice-pages.ts --apply`.
 */
export default defineType({
  name: 'practicePage',
  title: 'Practice Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'approach', title: 'Approach' },
    { name: 'services', title: 'Services' },
    { name: 'children', title: 'Linked pages' },
    { name: 'faqs', title: 'FAQs' },
    { name: 'shared', title: 'Shared blocks' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'Studio label only. Never rendered.',
    }),
    defineField({
      name: 'path',
      title: 'Route path',
      type: 'string',
      description:
        'The page this document edits, e.g. /atlassian-consulting/jira. Must match the route exactly; changing it detaches the document from the page.',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\/[a-z0-9/-]*$/, { name: 'route path' })
          .custom(async (value, context) => {
            if (!value) return true
            const id = context.document?._id?.replace(/^drafts\./, '')
            const client = context.getClient({ apiVersion: '2024-01-01' })
            const taken = await client.fetch<number>(
              `count(*[_type == "practicePage" && path == $path && !(_id in [$id, $draft])])`,
              { path: value, id, draft: `drafts.${id}` },
            )
            return taken === 0 || 'Another practice page already uses this path.'
          }),
    }),

    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    defineField({
      name: 'primaryCtaLabel',
      title: 'Hero CTA Label',
      type: 'string',
      description: 'Defaults to "Book a discovery call". Always links to the booking section.',
      group: 'hero',
    }),
    defineField({
      name: 'heading',
      title: 'Hero Heading',
      type: 'string',
      description: 'No full stop: the page adds a brand-coloured one.',
      group: 'hero',
    }),
    defineField({ name: 'lead', title: 'Hero Lead', type: 'text', rows: 4, group: 'hero' }),

    defineField({ name: 'approachEyebrow', title: 'Section Eyebrow', type: 'string', group: 'approach' }),
    defineField({ name: 'approachHeading', title: 'Section Heading', type: 'string', group: 'approach' }),
    defineField({
      name: 'approach',
      title: 'Approach Items',
      type: 'array',
      group: 'approach',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'practiceApproachItem',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'body', title: 'Body', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),

    defineField({ name: 'servicesEyebrow', title: 'Section Eyebrow', type: 'string', group: 'services' }),
    defineField({ name: 'servicesHeading', title: 'Section Heading', type: 'string', group: 'services' }),
    defineField({
      name: 'services',
      title: 'Service Cards',
      type: 'array',
      group: 'services',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'practiceServiceItem',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'body', title: 'Body', type: 'text', rows: 4 },
            {
              name: 'href',
              title: 'Link path (optional)',
              type: 'string',
              description: 'Turns the card into a link. Internal paths only, e.g. /industries/healthcare.',
            },
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),

    defineField({ name: 'childrenEyebrow', title: 'Section Eyebrow', type: 'string', group: 'children' }),
    defineField({ name: 'childrenHeading', title: 'Section Heading', type: 'string', group: 'children' }),
    defineField({
      name: 'childLinks',
      title: 'Linked Pages',
      type: 'array',
      description: 'Internal paths only, e.g. /atlassian-consulting/jira.',
      group: 'children',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'practiceChildLink',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'href', title: 'Path', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),

    defineField({
      name: 'faqHeading',
      title: 'FAQ Heading',
      type: 'string',
      description: 'Defaults to "Frequently asked questions".',
      group: 'faqs',
    }),
    defineField({
      name: 'faqContactLead',
      title: 'FAQ Contact Line',
      type: 'string',
      description: 'The line above the contact email beside the questions.',
      group: 'faqs',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description:
        'Shown when the central FAQ collection has nothing for this page (or the page prefers its own list). Keep them true to the page: the FAQPage structured data is built from what renders.',
      group: 'faqs',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'practiceFaqItem',
          fields: [
            { name: 'q', title: 'Question', type: 'string' },
            { name: 'a', title: 'Answer', type: 'text', rows: 5 },
          ],
          preview: { select: { title: 'q', subtitle: 'a' } },
        }),
      ],
    }),

    // Blocks every practice page shows with the same copy. Blank fields keep
    // that copy (PRACTICE_SHARED_COPY in src/data/practicePages/types.ts).
    // Coverage, leader and booking are not used on the /industries pages.
    defineField({
      name: 'logoHeading',
      title: 'Logo Wall Heading (prefix)',
      type: 'string',
      description: 'Shown on pages with a client logo wall (the /industries pages). Keep the trailing space before the accent.',
      group: 'shared',
    }),
    defineField({ name: 'logoHeadingAccent', title: 'Logo Wall Heading (accent)', type: 'string', group: 'shared' }),
    defineField({ name: 'coverageEyebrow', title: 'Coverage Eyebrow', type: 'string', group: 'shared' }),
    defineField({ name: 'coverageHeading', title: 'Coverage Heading', type: 'string', group: 'shared' }),
    defineField({
      name: 'coverageRegions',
      title: 'Coverage Regions',
      type: 'array',
      group: 'shared',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'practiceCoverageRegion',
          fields: [
            { name: 'flag', title: 'Flag emoji', type: 'string' },
            { name: 'region', title: 'Region', type: 'string' },
            { name: 'cities', title: 'Cities', type: 'string' },
            { name: 'body', title: 'Body', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'region', subtitle: 'cities' } },
        }),
      ],
    }),
    defineField({ name: 'leaderEyebrow', title: 'Leader Eyebrow', type: 'string', group: 'shared' }),
    defineField({ name: 'leaderHeading', title: 'Leader Heading', type: 'string', group: 'shared' }),
    defineField({ name: 'leaderName', title: 'Leader Name', type: 'string', group: 'shared' }),
    defineField({ name: 'leaderTitle', title: 'Leader Job Title', type: 'string', group: 'shared' }),
    defineField({ name: 'leaderBio', title: 'Leader Bio', type: 'text', rows: 4, group: 'shared' }),
    defineField({ name: 'leaderPull', title: 'Leader Pull Quote', type: 'string', group: 'shared' }),
    defineField({
      name: 'leaderBadges',
      title: 'Leader Badges',
      type: 'array',
      group: 'shared',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'bookingHeading', title: 'Booking Heading', type: 'string', group: 'shared' }),
    defineField({ name: 'bookingSubheading', title: 'Booking Subheading', type: 'string', group: 'shared' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'path' },
  },
})

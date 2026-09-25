import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Licensing & procurement page (/pricing).
 *
 * Mirrors the `PracticePage` shape in src/data/practicePages/types.ts. The
 * route renders the code copy in src/data/practicePages/licensing.ts and this
 * document is merged over it field by field, so a blank field here keeps the
 * shipped copy and a filled one replaces it. Empty arrays are ignored for the
 * same reason: clearing a list in the Studio must not blank a whole section by
 * accident.
 */
export default defineType({
  name: 'licensingPage',
  title: 'Licensing & Procurement (/pricing)',
  type: 'document',
  // @ts-expect-error Sanity experimental API (singleton)
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'approach', title: 'How procurement works' },
    { name: 'services', title: 'What we procure' },
    { name: 'children', title: 'Linked practices' },
    { name: 'faqs', title: 'FAQs' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'Studio label only. Never rendered.',
      initialValue: 'Licensing & Procurement (/pricing)',
    }),

    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    defineField({
      name: 'eyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      description: 'Small pill above the heading, e.g. "Licensing".',
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
      title: 'Numbered Rules',
      type: 'array',
      description: 'Rendered as a three-up numbered grid. Three items fit the layout.',
      group: 'approach',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'licensingApproachItem',
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
      title: 'Procurement Cards',
      type: 'array',
      description: 'Two-column card grid, so an even number reads best.',
      group: 'services',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'licensingServiceItem',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'body', title: 'Body', type: 'text', rows: 4 },
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),

    defineField({ name: 'childrenEyebrow', title: 'Section Eyebrow', type: 'string', group: 'children' }),
    defineField({ name: 'childrenHeading', title: 'Section Heading', type: 'string', group: 'children' }),
    defineField({
      name: 'childLinks',
      title: 'Linked Practice Pages',
      type: 'array',
      description: 'Internal paths only, e.g. /monday-implementation-consultants.',
      group: 'children',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'licensingChildLink',
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
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description:
        'These win over the central FAQ collection on this route, and they are what the FAQPage structured data is built from. Keep them true to the page.',
      group: 'faqs',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'licensingFaqItem',
          fields: [
            { name: 'q', title: 'Question', type: 'string' },
            { name: 'a', title: 'Answer', type: 'text', rows: 5 },
          ],
          preview: { select: { title: 'q', subtitle: 'a' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'heading' },
  },
})

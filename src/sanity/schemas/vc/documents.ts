import { defineArrayMember, defineField, defineType } from 'sanity'
import { image, tags } from './fields'
import { VC_SECTION_TYPES } from './sections'

/**
 * A Version C page: one document per route, matched on `path`. The route file
 * loads it and renders `sections` in order (src/components/vc/VcPage.tsx).
 */
export const vcPage = defineType({
  name: 'vcPage',
  title: 'Page (Version C)',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO & sharing' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Internal title', type: 'string', description: 'Studio label only.', group: 'content' }),
    defineField({
      name: 'path',
      title: 'Route path',
      type: 'string',
      description: 'The page this document renders, e.g. /monday-for-retail. Must match the route exactly.',
      validation: (r) => r.required().regex(/^\/[a-z0-9/-]*$/, { name: 'route path' }),
      group: 'content',
    }),
    defineField({
      name: 'group',
      title: 'Page group',
      type: 'string',
      options: { list: ['industry', 'msol', 'partner', 'ai', 'region', 'company', 'core'] },
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: VC_SECTION_TYPES.map((type) => defineArrayMember({ type })),
      group: 'content',
    }),
    defineField({ name: 'seoTitle', title: 'Meta title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'Meta description', type: 'text', rows: 3, group: 'seo' }),
    defineField({
      name: 'ogImage',
      title: 'Social preview image',
      type: 'image',
      description: '1200 x 630. Leave empty to use the page card generated from the title.',
      group: 'seo',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'path' } },
})

/** A named client case study, shared by every page that shows it. */
export const vcCase = defineType({
  name: 'vcCase',
  title: 'Case study (Version C)',
  type: 'document',
  fields: [
    defineField({ name: 'client', title: 'Client', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Client build · United States"' }),
    defineField({ name: 'body', title: 'Summary', type: 'text', rows: 3 }),
    tags,
    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      description: "Figures from the client's verified case study only.",
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcResult',
          fields: [
            defineField({ name: 'value', title: 'Figure', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    image('photo', 'Photo', 'Stock or client photo; the card darkens it.'),
    image('logo', 'White logo'),
    defineField({ name: 'href', title: 'Link (optional)', type: 'string' }),
  ],
  preview: { select: { title: 'client', subtitle: 'label', media: 'logo' } },
})

/** A client quote, shared by every page that shows it. */
export const vcQuote = defineType({
  name: 'vcQuote',
  title: 'Client quote (Version C)',
  type: 'document',
  fields: [
    defineField({ name: 'org', title: 'Organisation', type: 'string' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'initials', title: 'Initials', type: 'string', description: 'Shown when there is no photo.' }),
    image('photo', 'Photo', 'Square headshot of the person quoted. Leave empty to show their initials.'),
    defineField({ name: 'tag', title: 'Filter tag', type: 'string', description: 'e.g. MONDAY CRM (used by quote filters).' }),
  ],
  preview: { select: { title: 'name', subtitle: 'org' } },
})

/**
 * Blocks that must read the same on every page: the "Led by practitioners"
 * profile and the booking card details. Singleton, _id "vcShared".
 */
export const vcShared = defineType({
  name: 'vcShared',
  title: 'Version C shared blocks',
  type: 'document',
  fields: [
    defineField({
      name: 'practitioners',
      title: 'Led by practitioners',
      type: 'object',
      fields: [
        defineField({ name: 'badge', title: 'Badge', type: 'string' }),
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Paragraphs', type: 'array', of: [{ type: 'text', rows: 3 }] }),
        image('photo', 'Photo'),
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'role', title: 'Role', type: 'string' }),
        defineField({
          name: 'facts',
          title: 'Facts',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'vcFact',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'value', title: 'Value', type: 'string' }),
              ],
              preview: { select: { title: 'label', subtitle: 'value' } },
            }),
          ],
        }),
        defineField({ name: 'pills', title: 'Pills', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({ name: 'bookingCalTitle', title: 'Booking card title', type: 'string', initialValue: 'Discovery call' }),
    defineField({ name: 'bookingEmail', title: 'Booking band email', type: 'string', initialValue: 'contact@fruitionservices.io' }),
  ],
  preview: { prepare: () => ({ title: 'Version C shared blocks' }) },
})

const richText = (name: string, title: string) =>
  defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }], lists: [{ title: 'Bullet', value: 'bullet' }] })] })

/** A full customer story (the /customer-testimonials grid and its detail dialog). */
export const vcStory = defineType({
  name: 'vcStory',
  title: 'Customer story (Version C)',
  type: 'document',
  fields: [
    defineField({ name: 'num', title: 'Number', type: 'string' }),
    defineField({ name: 'client', title: 'Client', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'sub', title: 'One-line summary', type: 'string' }),
    defineField({ name: 'solution', title: 'Solution (filter)', type: 'string' }),
    defineField({ name: 'weeks', title: 'Time to live', type: 'string' }),
    image('logo', 'Logo'),
    defineField({
      name: 'metrics',
      title: 'Results',
      type: 'array',
      description: "From the client's verified case study only.",
      of: [defineArrayMember({ type: 'object', name: 'vcMetric', fields: [defineField({ name: 'value', title: 'Figure', type: 'string' }), defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'sub', title: 'Note', type: 'string' })], preview: { select: { title: 'value', subtitle: 'label' } } })],
    }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
    defineField({
      name: 'people',
      title: 'Quoted people',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcPerson', fields: [defineField({ name: 'name', title: 'Name', type: 'string' }), defineField({ name: 'role', title: 'Role', type: 'string' })], preview: { select: { title: 'name', subtitle: 'role' } } })],
    }),
    richText('challenge', 'The challenge'),
    richText('solutionText', 'The solution'),
    richText('impact', 'The impact'),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'employees', title: 'Employees', type: 'string' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string' }),
    defineField({ name: 'useCase', title: 'Use case', type: 'string' }),
    tags,
  ],
  preview: { select: { title: 'client', subtitle: 'sub', media: 'logo' } },
})

export const vcDocuments = [vcPage, vcCase, vcQuote, vcShared, vcStory]

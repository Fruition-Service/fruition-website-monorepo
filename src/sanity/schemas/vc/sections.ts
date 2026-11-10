import { defineArrayMember, defineField, defineType } from 'sanity'
import { ctas, head, heading, image, sectionBase } from './fields'

/**
 * Version C sections. A page is an ordered list of these (vcPage.sections);
 * each renders one block of the approved mock-ups through
 * src/components/vc/sections/*.
 */

const preview = (label: string, path = 'head.heading') => ({
  select: { title: path },
  prepare: ({ title }: { title?: string }) => ({ title: title || label, subtitle: label }),
})

export const vcHero = defineType({
  name: 'vcHero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading('heading', 'Heading (H1)'),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 3 }),
    ctas,
    image('art', '3D hero graphic', 'The partner or industry x Fruition fruit render. Transparent background.'),
    defineField({
      name: 'variant',
      title: 'Hero style',
      type: 'string',
      description: 'Machine value from the design system: empty for the standard hero, "ph" for partner/AI heroes.',
    }),
    defineField({ name: 'artClass', title: 'Graphic shape', type: 'string', description: 'Machine value: empty, or "wide" for landscape renders.' }),
    image('frameImage', 'Framed screenshot', 'Used instead of the 3D graphic on product pages: a screenshot in a grey frame.'),
    defineField({ name: 'creds', title: 'Badges on the frame', type: 'array', of: [defineArrayMember({ type: 'vcLogo' })] }),
    defineField({ name: 'chipValue', title: 'Frame chip value', type: 'string' }),
    defineField({ name: 'chipLabel', title: 'Frame chip label', type: 'string' }),
    defineField({ name: 'floatBadge', title: 'Floating badge image', type: 'image', description: 'Partner badge pinned to the graphic (partner pages).' }),
    defineField({ name: 'floatBadgeAlt', title: 'Floating badge alt text', type: 'string' }),
    defineField({ name: 'stats', title: 'Stats row', type: 'array', of: [defineArrayMember({ type: 'vcStat' })] }),
    defineField({ name: 'statsNote', title: 'Note under the stats', type: 'string' }),
    defineField({ name: 'trustLabel', title: 'Logo marquee label', type: 'string' }),
    defineField({ name: 'trustLogos', title: 'Logo marquee', type: 'array', of: [defineArrayMember({ type: 'vcLogo' })] }),
  ],
  preview: preview('Hero', 'heading'),
})

export const vcLogos = defineType({
  name: 'vcLogos',
  title: 'Client logos',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'logos', title: 'Logos', type: 'array', of: [defineArrayMember({ type: 'vcLogo' })] }),
    defineField({ name: 'more', title: 'Counter tile text', type: 'string', description: 'Optional last tile, e.g. "900+ more".' }),
  ],
  preview: preview('Client logos'),
})

export const vcSteps = defineType({
  name: 'vcSteps',
  title: 'Numbered steps',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({
      name: 'layout',
      title: 'Columns',
      type: 'string',
      options: { list: [{ title: 'Three', value: 'steps' }, { title: 'Four', value: 'steps4' }, { title: 'Five', value: 'steps5' }] },
      initialValue: 'steps',
    }),
    defineField({
      name: 'items',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcStep',
          fields: [
            defineField({ name: 'n', title: 'Number', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
            defineField({ name: 'meta', title: 'Footer label', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'n' } },
        }),
      ],
    }),
  ],
  preview: preview('Numbered steps'),
})

export const vcCases = defineType({
  name: 'vcCases',
  title: 'Case studies',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({
      name: 'cases',
      title: 'Case studies',
      type: 'array',
      description: 'Named clients only. Each case study is shared: edit it once, every page updates.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'vcCase' }] })],
    }),
  ],
  preview: preview('Case studies'),
})

export const vcAudit = defineType({
  name: 'vcAudit',
  title: 'Audit banner',
  type: 'object',
  fields: [
    defineField({ name: 'tone', title: 'Background', type: 'string', options: { list: ['plain', 'alt'] }, initialValue: 'plain' }),
    heading(),
    defineField({ name: 'text', title: 'Line under the heading', type: 'string' }),
    defineField({ name: 'cta', title: 'Button', type: 'vcCta' }),
  ],
  preview: preview('Audit banner', 'heading'),
})

export const vcCards = defineType({
  name: 'vcCards',
  title: 'Cards',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Two columns', value: 'cards2' },
          { title: 'Three columns', value: 'cards3' },
          { title: 'Four columns', value: 'cards4' },
          { title: 'Grid of three', value: 'grid3' },
          { title: 'Grid of four', value: 'grid4' },
          { title: 'Grid of six', value: 'grid6' },
          { title: 'Why us (four)', value: 'why4' },
          { title: 'Outcomes (three)', value: 'oc' },
          { title: 'Use case cards (three)', value: 'uc' },
          { title: 'Use case cards (two)', value: 'uc2' },
          { title: 'Use case cards with pills (three)', value: 'ucpills' },
        ],
      },
      initialValue: 'cards3',
    }),
    defineField({ name: 'tagClass', title: 'Tag style', type: 'string', description: 'Design-system value from the mock-up ("label" or empty). Leave as is.' }),
    defineField({ name: 'sectionClass', title: 'Section style', type: 'string', description: 'Design-system value from the mock-up. Leave as is.' }),
    defineField({
      name: 'imageFrame',
      title: 'Card image style',
      type: 'string',
      options: { list: [{ title: 'Framed screenshot', value: 'shot' }, { title: 'Full-bleed header', value: 'pichd' }] },
      initialValue: 'shot',
    }),
    defineField({ name: 'items', title: 'Cards', type: 'array', of: [defineArrayMember({ type: 'vcItem' })] }),
  ],
  preview: preview('Cards'),
})

export const vcProducts = defineType({
  name: 'vcProducts',
  title: 'Product screenshots',
  type: 'object',
  fields: [...sectionBase, head(), defineField({ name: 'items', title: 'Screens', type: 'array', of: [defineArrayMember({ type: 'vcItem' })] })],
  preview: preview('Product screenshots'),
})

export const vcUseCases = defineType({
  name: 'vcUseCases',
  title: 'Use case catalogue',
  type: 'object',
  description: 'Cards come from the use case catalogue for this page; only the header is edited here.',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'source', title: 'Catalogue page', type: 'string', description: 'Machine value, e.g. /monday-for-retail.' }),
    defineField({ name: 'linkLabel', title: 'Card link label', type: 'string', initialValue: 'See the build' }),
  ],
  preview: preview('Use case catalogue'),
})

export const vcProof = defineType({
  name: 'vcProof',
  title: 'Client quotes',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: [{ title: 'Heading beside the quotes', value: 'sticky' }, { title: 'Heading above the quotes', value: 'stacked' }] },
      initialValue: 'sticky',
    }),
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 2 }),
    ctas,
    defineField({
      name: 'quotes',
      title: 'Quotes',
      type: 'array',
      description: 'Shown in two scrolling columns: the first half up, the second half down.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'vcQuote' }] })],
    }),
  ],
  preview: preview('Client quotes', 'heading'),
})

export const vcPractitioners = defineType({
  name: 'vcPractitioners',
  title: 'Led by practitioners',
  type: 'object',
  description: 'The shared block. Its copy lives on "Version C shared blocks" so it is identical on every page.',
  fields: [...sectionBase],
  preview: { prepare: () => ({ title: 'Led by practitioners', subtitle: 'Shared block' }) },
})

export const vcBooking = defineType({
  name: 'vcBooking',
  title: 'Booking',
  type: 'object',
  description: 'The live booking calendar (#book). Only the copy on the left is edited here.',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 2 }),
    defineField({
      name: 'calTitle',
      title: 'Calendar title',
      type: 'string',
      description: 'Shown as "<title> · 30 min" on the booking card, e.g. "Marketing call". Empty uses "Discovery call".',
    }),
  ],
  preview: preview('Booking', 'heading'),
})

export const vcFaq = defineType({
  name: 'vcFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({ name: 'tabs', title: 'Tabs', type: 'array', of: [defineArrayMember({ type: 'vcFaqTab' })] }),
  ],
  preview: preview('FAQ', 'heading'),
})

export const vcClosing = defineType({
  name: 'vcClosing',
  title: 'Closing band',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 2 }),
    ctas,
  ],
  preview: preview('Closing band', 'heading'),
})

export const vcSections = [
  vcHero, vcLogos, vcSteps, vcCases, vcAudit, vcCards, vcProducts, vcUseCases, vcProof, vcPractitioners,
  vcBooking, vcFaq, vcClosing,
]

export const VC_SECTION_TYPES = vcSections.map((s) => s.name)

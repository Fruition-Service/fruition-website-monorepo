import { defineArrayMember, defineField, defineType } from 'sanity'
import { HEADING_HELP, heading, image, tags } from './fields'

/** Badge (mono pill with the accent dash) + heading + lead. */
export const vcHead = defineType({
  name: 'vcHead',
  title: 'Section header',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'heading', subtitle: 'badge' } },
})

export const vcCta = defineType({
  name: 'vcCta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'A path (/contact-us), an anchor (#book) or a full URL. Booking buttons should use #book.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Solid', value: 'primary' },
          { title: 'Outline', value: 'outline' },
          { title: 'White (on dark)', value: 'inverse' },
          { title: 'Ghost (on dark)', value: 'ghost' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({ name: 'arrow', title: 'Arrow icon', type: 'boolean', initialValue: false }),
    defineField({ name: 'newTab', title: 'Open in a new tab', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

export const vcLogo = defineType({
  name: 'vcLogo',
  title: 'Logo',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Logo', type: 'image' }),
    defineField({ name: 'alt', title: 'Name (alt text)', type: 'string' }),
    defineField({ name: 'href', title: 'Link (optional)', type: 'string' }),
    defineField({ name: 'shape', title: 'Logo shape', type: 'string', description: 'Design-system value: empty or "sq" for square badges.' }),
  ],
  preview: { select: { title: 'alt', media: 'image' } },
})

export const vcStat = defineType({
  name: 'vcStat',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string', description: HEADING_HELP }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
})

export const vcItem = defineType({
  name: 'vcItem',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({ name: 'num', title: 'Large number', type: 'string', description: 'e.g. "01", shown large above the title.' }),
    defineField({ name: 'label', title: 'Small label above the title', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'kicker', title: 'Small label under the title', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
    defineField({ name: 'bullets', title: 'Ticked list', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'arrow', title: 'Arrow without a link', type: 'boolean', initialValue: false }),
    defineField({ name: 'meta', title: 'Footer label', type: 'string', description: 'Mono line at the bottom of the card.' }),
    tags,
    image('image', 'Image'),
    defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
    defineField({ name: 'href', title: 'Link', type: 'string' }),
    defineField({ name: 'ai', title: 'Show the AI chip', type: 'boolean', initialValue: false }),
    defineField({ name: 'aiLabel', title: 'AI note label', type: 'string', description: 'e.g. "AI step"' }),
    defineField({ name: 'aiNote', title: 'AI note', type: 'string' }),
    defineField({ name: 'metric', title: 'Figure', type: 'string', description: 'Outcome figure, e.g. "260 hrs".' }),
    defineField({ name: 'metricLabel', title: 'Figure label', type: 'string', description: 'e.g. "saved per year"' }),
    defineField({
      name: 'cardLink',
      title: 'Whole card is the link (full width)',
      type: 'boolean',
      initialValue: false,
      description: 'For a closing "see all" card that spans the grid.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'label', media: 'image' } },
})

export const vcFaqTab = defineType({
  name: 'vcFaqTab',
  title: 'FAQ tab',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Tab label', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      description: 'Questions come from the central FAQ store, so an edit there shows on every page that uses it.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'faqItem' }] })],
    }),
  ],
  preview: { select: { title: 'label' } },
})

export const vcObjects = [vcHead, vcCta, vcLogo, vcStat, vcItem, vcFaqTab]

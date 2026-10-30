import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * /implementation-packages (the pricing page). Every field is optional: a blank
 * field shows the default wording from src/app/implementation-packages/content.ts.
 * Seeded with today's copy by scripts/seed-implementation-packages.ts.
 * Prose that quotes a price (hero summary, FAQs) is plain text: change it
 * together with the package price.
 */

const s = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'string', description })
const t = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'text', rows: 3, description })
const list = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'array', of: [{ type: 'string' }], description })

const titled = (name: string, title: string) =>
  defineArrayMember({
    type: 'object',
    name,
    title,
    fields: [s('title', 'Title'), t('body', 'Text')],
    preview: { select: { title: 'title', subtitle: 'body' } },
  })

const section = (name: string, title: string, group: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: 'object', group, options: { collapsible: true, collapsed: false }, fields })

export default defineType({
  name: 'implementationPackagesPage',
  title: 'Implementation Packages Page',
  type: 'document',
  // @ts-expect-error Sanity experimental API (singleton)
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'seo', title: 'SEO', default: true },
    { name: 'hero', title: 'Hero & form' },
    { name: 'packages', title: 'monday.com packages' },
    { name: 'services', title: 'Other services' },
    { name: 'sections', title: 'Page sections' },
    { name: 'faq', title: 'FAQ' },
  ],
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'Meta title',
      type: 'string',
      group: 'seo',
      description: 'The <title> and the title on shared links. Aim for under 60 characters.',
      validation: (r) => r.max(70).warning('Google shows about 60 characters'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Search result snippet and shared-link description. Aim for 140-160 characters.',
      validation: (r) => r.max(170).warning('Google shows about 155 characters'),
    }),

    section('hero', 'Hero', 'hero', [
      s('eyebrow', 'Eyebrow (small line above the heading)'),
      s('h1Before', 'Heading: start'),
      s('h1Accent', 'Heading: highlighted part'),
      s('h1After', 'Heading: end'),
      t('answer', 'Summary paragraph', 'The answer-first summary AI search quotes. Mentions prices: keep them in step with the packages.'),
      t('lead', 'Lead paragraph'),
      list('bullets', 'Bullet points'),
      list('chips', 'Badges (partner / award chips)'),
      s('jumpLabel', '"Jump to" label'),
    ]),
    section('form', 'Audit form (next to the hero)', 'hero', [
      s('heading', 'Heading'),
      t('intro', 'Intro'),
      s('submit', 'Button label'),
      s('footnote', 'Note under the button'),
      s('thanksHeading', 'Thank-you heading'),
      t('thanks', 'Thank-you message'),
    ]),

    section('overview', 'Pricing at a glance (price cards)', 'packages', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      t('lead', 'Lead'),
      s('mondayTitle', 'monday.com card title'),
      s('mondayNote', 'monday.com card note'),
      s('groupNote', 'Service card note'),
      s('licencesTitle', 'Licences card title'),
      s('licencesNote', 'Licences card note'),
      s('licencesPrice', 'Licences card price text'),
      s('from', '"From" label'),
      s('view', '"See prices" link label'),
    ]),
    section('packagesIntro', 'Packages section', 'packages', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      t('lead', 'Lead'),
      s('compareToggle', '"See what\'s included" button'),
      s('compareHeading', 'Comparison table heading'),
      s('enterprise', 'Enterprise line'),
      s('enterpriseCta', 'Enterprise link label'),
      t('footnote', 'Footnote'),
    ]),
    defineField({
      name: 'packages',
      title: 'Packages',
      type: 'array',
      group: 'packages',
      description: 'The three package cards. Prices are USD at the US team rate; the currency switcher converts them.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'implementationPackage',
          title: 'Package',
          fields: [
            defineField({ name: 'id', title: 'ID', type: 'string', readOnly: true, hidden: true }),
            s('name', 'Name'),
            s('tag', 'Tag line (above the name)'),
            s('team', 'Team size line'),
            defineField({ name: 'basePriceUsd', title: 'Price (USD)', type: 'number', validation: (r) => r.min(0) }),
            defineField({
              name: 'cadence',
              title: 'Billing',
              type: 'string',
              options: { list: ['one-time', 'per month'], layout: 'radio' },
            }),
            t('bestFor', 'Best for'),
            list('highlights', 'Highlights'),
            s('ctaLabel', 'Button label'),
            t('offerDescription', 'Offer description (structured data for search engines)'),
            s('offerServiceName', 'Service name (structured data)'),
          ],
          preview: { select: { title: 'name', subtitle: 'team' } },
        }),
      ],
    }),
    defineField({
      name: 'compareRows',
      title: 'Comparison table ("See what\'s included")',
      type: 'array',
      group: 'packages',
      description: 'One row per line. Leave a cell empty to show "Not included". Start a cell with ✓ for a tick.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'compareRow',
          title: 'Row',
          fields: [
            s('label', 'Row label'),
            s('training', 'Training & Optimisation'),
            s('lockstep', 'Lock-Step'),
            s('deployed', 'Deployed Engineer'),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),

    section('servicesIntro', 'Services pricing section', 'services', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      t('lead', 'Lead'),
      s('priceCaption', 'Caption above each price'),
      t('footnote', 'Footnote'),
    ]),
    defineField({
      name: 'servicePrices',
      title: 'Service groups',
      type: 'array',
      group: 'services',
      description: 'Starting prices in AUD, as published on each service page. Change a price there too.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'servicePriceGroup',
          title: 'Service group',
          fields: [
            defineField({ name: 'id', title: 'ID', type: 'string', readOnly: true, hidden: true }),
            s('eyebrow', 'Name'),
            s('heading', 'Heading'),
            t('lead', 'Lead'),
            s('href', 'Link URL'),
            s('linkLabel', 'Link label'),
            defineField({
              name: 'items',
              title: 'Services',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'servicePriceItem',
                  title: 'Service',
                  fields: [
                    s('name', 'Name'),
                    s('href', 'Link URL'),
                    defineField({ name: 'fromAud', title: 'From (AUD)', type: 'number', validation: (r) => r.min(0) }),
                  ],
                  preview: { select: { title: 'name', subtitle: 'fromAud' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'eyebrow', subtitle: 'heading' } },
        }),
      ],
    }),
    section('licences', 'Licences banner', 'services', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      t('body', 'Text'),
      s('cta', 'Button label'),
      s('href', 'Button URL'),
    ]),

    section('howPricingWorks', 'How our pricing works', 'sections', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      defineField({ name: 'items', title: 'Points', type: 'array', of: [titled('pricingPrinciple', 'Point')] }),
    ]),
    section('method', 'Implementation method', 'sections', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      t('lead', 'Lead'),
      defineField({ name: 'steps', title: 'Steps', type: 'array', of: [titled('methodStep', 'Step')] }),
    ]),
    section('why', 'Why Fruition', 'sections', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      defineField({ name: 'items', title: 'Reasons', type: 'array', of: [titled('whyItem', 'Reason')] }),
    ]),
    section('reviews', 'Client reviews', 'sections', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      defineField({
        name: 'items',
        title: 'Reviews',
        type: 'array',
        description: 'Photos come from the matching Customer Testimonial (same client name).',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'review',
            title: 'Review',
            fields: [t('quote', 'Quote'), s('name', 'Name'), s('role', 'Role and company')],
            preview: { select: { title: 'name', subtitle: 'role' } },
          }),
        ],
      }),
    ]),
    section('atAGlance', 'Fruition at a glance (fact sheet)', 'sections', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      defineField({
        name: 'rows',
        title: 'Rows',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'glanceRow',
            title: 'Row',
            fields: [s('label', 'Label'), t('value', 'Value')],
            preview: { select: { title: 'label', subtitle: 'value' } },
          }),
        ],
      }),
    ]),
    section('regions', 'Region links', 'sections', [
      s('eyebrow', 'Eyebrow'),
      defineField({
        name: 'links',
        title: 'Links',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'regionLink',
            title: 'Link',
            fields: [s('label', 'Label'), s('href', 'URL')],
            preview: { select: { title: 'label', subtitle: 'href' } },
          }),
        ],
      }),
    ]),
    section('cta', 'Closing call to action', 'sections', [
      s('eyebrow', 'Eyebrow'),
      s('heading', 'Heading'),
      s('headingAccent', 'Highlighted words in the heading'),
      t('body', 'Text'),
      s('primary', 'Main button label'),
      s('secondary', 'Phone button label'),
    ]),

    section('faqIntro', 'FAQ heading', 'faq', [s('eyebrow', 'Eyebrow'), s('heading', 'Heading')]),
    defineField({
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      group: 'faq',
      description: 'Shown on the page and sent to Google as FAQ structured data.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqEntry',
          title: 'Question',
          fields: [s('q', 'Question'), t('a', 'Answer')],
          preview: { select: { title: 'q', subtitle: 'a' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Implementation Packages (pricing page)' }) },
})

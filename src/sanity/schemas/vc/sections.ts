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
    defineField({ name: 'floatBadges', title: 'Floating partner badges', type: 'array', description: 'Badges pinned under the graphic (partner pages).', of: [defineArrayMember({ type: 'vcLogo' })] }),
    defineField({ name: 'floatBadgeClass', title: 'Badge group style', type: 'string', description: 'Design-system value, e.g. "two". Leave as is.' }),
    defineField({ name: 'stats', title: 'Stats row', type: 'array', of: [defineArrayMember({ type: 'vcStat' })] }),
    defineField({ name: 'statsNote', title: 'Note under the stats', type: 'string' }),
    defineField({ name: 'spacer', title: 'Space above the logo marquee', type: 'boolean', initialValue: false }),
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
    defineField({ name: 'gridClass', title: 'Grid style', type: 'string', description: 'Design-system value from the mock-up, e.g. "ten". Leave as is.' }),
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
      description: 'Design-system class from the mock-up, e.g. "steps", "steps four", "steps4".',
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
            defineField({ name: 'bar', title: 'Progress bar (%)', type: 'number', description: 'Optional bar above the number, 0 to 100.' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
            defineField({ name: 'bullets', title: 'Ticked list', type: 'array', of: [{ type: 'string' }] }),
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
    defineField({ name: 'titleClass', title: 'Card title style', type: 'string', description: 'Design-system value: empty (h3) or "title" (smaller). Leave as is.' }),
    defineField({ name: 'tagClass', title: 'Tag style', type: 'string', description: 'Design-system value from the mock-up ("label" or empty). Leave as is.' }),
    defineField({ name: 'sectionClass', title: 'Section style', type: 'string', description: 'Design-system value from the mock-up. Leave as is.' }),
    defineField({
      name: 'imageFrame',
      title: 'Card image style',
      type: 'string',
      options: { list: [{ title: 'Framed screenshot', value: 'shot' }, { title: 'Full-bleed header', value: 'pichd' }, { title: 'Product shot on tint', value: 'w4-img' }] },
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
  description: 'Photo, name, facts and badges come from "Version C shared blocks" so they are identical on every page. The paragraphs are this page\'s own (they name the platform).',
  fields: [
    ...sectionBase,
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcLeadPara',
          fields: [
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
            defineField({ name: 'style', title: 'Style', type: 'string', options: { list: [{ title: 'Normal', value: 'body' }, { title: 'Dark (emphasis)', value: 'ink' }] }, initialValue: 'body' }),
          ],
          preview: { select: { title: 'text' } },
        }),
      ],
    }),
  ],
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


const paragraphs = defineField({
  name: 'paragraphs',
  title: 'Paragraphs',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      name: 'vcPara',
      fields: [
        defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
        defineField({ name: 'style', title: 'Style', type: 'string', options: { list: [{ title: 'Large', value: 'lead' }, { title: 'Normal', value: 'body' }] }, initialValue: 'body' }),
      ],
      preview: { select: { title: 'text', subtitle: 'style' } },
    }),
  ],
})

const listOfStrings = (name: string, title: string) => defineField({ name, title, type: 'array', of: [{ type: 'string' }] })

export const vcVideo = defineType({
  name: 'vcVideo',
  title: 'Video',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    paragraphs,
    defineField({
      name: 'facts',
      title: 'Facts (label / value rows)',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcVideoFact', fields: [defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'value', title: 'Value', type: 'string' })] })],
    }),
    defineField({ name: 'youtubeId', title: 'YouTube video id', type: 'string', description: 'The 11-character id from the YouTube URL.' }),
    image('poster', 'Poster image'),
    defineField({ name: 'caption', title: 'Caption on the video', type: 'string' }),
  ],
  preview: preview('Video', 'heading'),
})

export const vcTextPair = defineType({
  name: 'vcTextPair',
  title: 'Heading + text',
  type: 'object',
  fields: [...sectionBase, defineField({ name: 'badge', title: 'Badge', type: 'string' }), heading(), paragraphs],
  preview: preview('Heading + text', 'heading'),
})

export const vcFix = defineType({
  name: 'vcFix',
  title: 'Find your fix (picker)',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'detailLabel', title: 'Label above the detail', type: 'string', initialValue: 'How we solve it' }),
    defineField({
      name: 'items',
      title: 'Problems',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcFixItem',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'problem', title: 'Problem', type: 'string' }),
            listOfStrings('steps', 'What we configure'),
            defineField({ name: 'outcome', title: 'Outcome', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'problem' } },
        }),
      ],
    }),
    defineField({ name: 'cta', title: 'Button', type: 'vcCta' }),
  ],
  preview: preview('Find your fix'),
})

export const vcIndustryTabs = defineType({
  name: 'vcIndustryTabs',
  title: 'Industry tabs',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'benefitsLabel', title: 'Label above the list', type: 'string', initialValue: 'Benefits' }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcIndTab',
          fields: [
            defineField({ name: 'label', title: 'Tab label', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
            listOfStrings('benefits', 'Benefits'),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
    defineField({ name: 'cta', title: 'Button', type: 'vcCta' }),
  ],
  preview: preview('Industry tabs'),
})

export const vcTrack = defineType({
  name: 'vcTrack',
  title: 'Training track finder',
  type: 'object',
  description: 'Team size slider + complexity choice recommend one of three tracks (rules in code).',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'sizeLabel', title: 'Slider label', type: 'string', initialValue: 'Team size' }),
    defineField({ name: 'complexityLabel', title: 'Choice label', type: 'string', initialValue: 'Workflow complexity' }),
    listOfStrings('complexity', 'Complexity options (three: simple, connected, many departments)'),
    defineField({ name: 'recLabel', title: 'Label above the recommendation', type: 'string', initialValue: 'Recommended track' }),
    defineField({
      name: 'tracks',
      title: 'Tracks (three: small teams, one department, enterprise)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcTrackItem',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'What it is', type: 'string' }),
            defineField({ name: 'fit', title: 'Who it suits', type: 'string' }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({ name: 'cta', title: 'Button', type: 'vcCta' }),
    listOfStrings('pills', 'Badges under the finder'),
  ],
  preview: preview('Training track finder'),
})

export const vcTable = defineType({
  name: 'vcTable',
  title: 'Comparison table',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    listOfStrings('columns', 'Column headings (three)'),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcRow',
          fields: [
            defineField({ name: 'label', title: 'Row label', type: 'string' }),
            defineField({ name: 'no', title: 'Without us', type: 'string' }),
            defineField({ name: 'yes', title: 'With Fruition', type: 'string' }),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
  ],
  preview: preview('Comparison table'),
})

export const vcPartnerStatus = defineType({
  name: 'vcPartnerStatus',
  title: 'Partner status',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({ name: 'badgeImages', title: 'Partner badges', type: 'array', of: [defineArrayMember({ type: 'vcLogo' })], description: 'Logo shape: "sq" (square) or "wd" (wide).' }),
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcPoint', fields: [defineField({ name: 'n', title: 'Number', type: 'string' }), defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'body', title: 'Body', type: 'text', rows: 2 })], preview: { select: { title: 'title' } } })],
    }),
  ],
  preview: preview('Partner status', 'heading'),
})

export const vcDirectory = defineType({
  name: 'vcDirectory',
  title: 'Partner directory',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({
      name: 'filters',
      title: 'Filter tabs',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcFilter', fields: [defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'key', title: 'Group key', type: 'string', description: 'Machine value; "all" shows every tile.' })], preview: { select: { title: 'label', subtitle: 'key' } } })],
    }),
    defineField({
      name: 'tiles',
      title: 'Partners',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcTile',
          fields: [
            image('logo', 'Logo'),
            defineField({ name: 'logoShape', title: 'Logo shape', type: 'string', description: 'Design-system value: empty, "sq" or "mk".' }),
            defineField({ name: 'tag', title: 'Tag line', type: 'string' }),
            defineField({ name: 'title', title: 'Name', type: 'string' }),
            defineField({ name: 'href', title: 'Link', type: 'string' }),
            defineField({ name: 'groups', title: 'Group keys', type: 'array', of: [{ type: 'string' }] }),
          ],
          preview: { select: { title: 'title', subtitle: 'tag', media: 'logo' } },
        }),
      ],
    }),
  ],
  preview: preview('Partner directory'),
})

export const vcToolkit = defineType({
  name: 'vcToolkit',
  title: 'Tool marquee',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({
      name: 'tiles',
      title: 'Tools',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcTool',
          fields: [
            image('logo', 'Logo'),
            defineField({ name: 'logoShape', title: 'Logo shape', type: 'string', description: 'Design-system value: "wm-img", "sq", "card-b" or "logo-b".' }),
            defineField({ name: 'title', title: 'Name', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'title', media: 'logo' } },
        }),
      ],
    }),
  ],
  preview: preview('Tool marquee'),
})

export const vcSections = [
  vcHero, vcLogos, vcSteps, vcCases, vcAudit, vcCards, vcProducts, vcUseCases, vcProof, vcPractitioners,
  vcBooking, vcFaq, vcClosing, vcVideo, vcTextPair, vcFix, vcIndustryTabs, vcTrack, vcTable, vcPartnerStatus, vcDirectory, vcToolkit,
]

export const VC_SECTION_TYPES = vcSections.map((s) => s.name)

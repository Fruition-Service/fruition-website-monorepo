import { defineArrayMember, defineField, defineType } from 'sanity'
import { ctas, head, heading, image, sectionBase } from './fields'
import { vcCoreSections, vcNode } from './core'

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
    defineField({ name: 'stageClass', title: 'Stage style', type: 'string', description: 'Design-system value for the animated stage. Leave as is.' }),
    defineField({ name: 'stage', title: 'Animated stage', type: 'array', description: 'The animated network graphic. Edit the labels and images in place on the page.', of: [defineArrayMember({ type: 'vcNode' })] }),
    defineField({ name: 'frameSvg', title: 'Framed artwork (SVG markup)', type: 'text', rows: 3, description: 'Generated artwork shown in the frame. Do not edit by hand.' }),
    defineField({ name: 'frameSvgAria', title: 'Framed artwork description (accessibility)', type: 'string' }),
    defineField({ name: 'frameClass', title: 'Frame style', type: 'string', description: 'Design-system value, e.g. "art-frame". Leave as is.' }),
    defineField({ name: 'credsClass', title: 'Badge row style', type: 'string', description: 'Design-system value, e.g. "ai". Leave as is.' }),
    defineField({
      name: 'prompt',
      title: 'Question box (Implementation Calculator hero)',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }),
        defineField({ name: 'ariaLabel', title: 'Input description (accessibility)', type: 'string' }),
        defineField({ name: 'sendLabel', title: 'Send button description (accessibility)', type: 'string' }),
        defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
        defineField({ name: 'href', title: 'Opens (path)', type: 'string', description: 'The live Calculator. The question is added as ?q=.' }),
        defineField({
          name: 'chips',
          title: 'Starter questions',
          type: 'array',
          of: [defineArrayMember({ type: 'object', name: 'vcPromptChip', fields: [
            defineField({ name: 'label', title: 'Chip label', type: 'string' }),
            defineField({ name: 'text', title: 'Question sent', type: 'string' }),
          ], preview: { select: { title: 'label' } } })],
        }),
      ],
    }),
    defineField({ name: 'chipValue', title: 'Frame chip value', type: 'string' }),
    defineField({ name: 'chipLabel', title: 'Frame chip label', type: 'string' }),
    defineField({ name: 'mapKind', title: 'Map style', type: 'string', description: 'Region pages: "rmap" (pins) or "art" (labelled map). Leave as is.' }),
    defineField({ name: 'mapSvg', title: 'Map artwork (SVG markup)', type: 'text', rows: 3, description: 'Generated dotted map. Do not edit by hand.' }),
    defineField({ name: 'mapAspect', title: 'Map aspect ratio', type: 'string', description: 'e.g. "1.07" (pins) or "43.3/41.77" (labelled).' }),
    defineField({ name: 'mapAria', title: 'Map description (accessibility)', type: 'string' }),
    defineField({
      name: 'pins',
      title: 'Map pins',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcPin', fields: [
        defineField({ name: 'label', title: 'City', type: 'string' }),
        defineField({ name: 'left', title: 'Left (%)', type: 'number' }),
        defineField({ name: 'top', title: 'Top (%)', type: 'number' }),
        defineField({ name: 'side', title: 'Label side', type: 'string', options: { list: ['r', 'l', 't', 'b'] } }),
        defineField({ name: 'on', title: 'Highlighted', type: 'boolean' }),
      ], preview: { select: { title: 'label' } } })],
    }),
    defineField({ name: 'mapFlag', title: 'Map label flag', type: 'string' }),
    defineField({ name: 'mapLabel', title: 'Map label', type: 'string' }),
    defineField({ name: 'floatBadges', title: 'Floating partner badges', type: 'array', description: 'Badges pinned under the graphic (partner pages).', of: [defineArrayMember({ type: 'vcLogo' })] }),
    defineField({ name: 'floatBadgeClass', title: 'Badge group style', type: 'string', description: 'Design-system value, e.g. "two". Leave as is.' }),
    defineField({ name: 'stats', title: 'Stats row', type: 'array', of: [defineArrayMember({ type: 'vcStat' })] }),
    defineField({ name: 'statsNote', title: 'Note under the stats', type: 'string' }),
    defineField({ name: 'spacer', title: 'Space above the logo marquee', type: 'boolean', initialValue: false }),
    defineField({
      name: 'form',
      title: 'Message form (contact page)',
      type: 'object',
      description: 'Shows the enquiry form beside the hero. Submissions go to the lead pipeline exactly as before.',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subheading', title: 'Line under the heading', type: 'text', rows: 2 }),
        defineField({ name: 'phoneLabel', title: 'Phone label', type: 'string' }),
        defineField({ name: 'messageLabel', title: 'Message label', type: 'string' }),
        defineField({ name: 'messagePlaceholder', title: 'Message placeholder', type: 'string' }),
        defineField({ name: 'submitLabel', title: 'Button', type: 'string' }),
        defineField({ name: 'successMessage', title: 'Thank-you message', type: 'string' }),
      ],
    }),
    defineField({ name: 'searchPlaceholder', title: 'Search box placeholder', type: 'string', description: 'Shows a search box in the hero (blog and FAQ pages); it filters the list below.' }),
    defineField({ name: 'searchClear', title: 'Search box has a clear button', type: 'boolean', initialValue: false }),
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
    defineField({ name: 'titleClass', title: 'Step title style', type: 'string', description: 'Design-system value: empty (h3) or "title" (smaller). Leave as is.' }),
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
    defineField({ name: 'listClass', title: 'List style', type: 'string', description: 'Design-system value: "ticks" or empty. Leave as is.' }),
    defineField({ name: 'titleClass', title: 'Card title style', type: 'string', description: 'Design-system value: empty (h3) or "title" (smaller). Leave as is.' }),
    defineField({ name: 'tagClass', title: 'Tag style', type: 'string', description: 'Design-system value from the mock-up ("label" or empty). Leave as is.' }),
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
      name: 'filters',
      title: 'Filter tabs',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcQuoteFilter', fields: [defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'key', title: 'Quote tag', type: 'string', description: 'Empty shows all.' })], preview: { select: { title: 'label' } } })],
    }),
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
    defineField({ name: 'tag', title: 'Tag under the contact lines', type: 'string' }),
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
    defineField({ name: 'variant', title: 'Row style', type: 'string', options: { list: [{ title: 'Without us vs with us', value: 'compare' }, { title: 'Challenge, what we do, how we help', value: 'help' }] }, initialValue: 'compare' }),
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
    defineField({ name: 'variant', title: 'Tile style', type: 'string', options: { list: [{ title: 'Partner tiles', value: 'pgrid' }, { title: 'Certification cards', value: 'pcards' }] }, initialValue: 'pgrid' }),
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
            defineField({ name: 'body', title: 'Line under the name', type: 'string' }),
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

export const vcStatsRow = defineType({
  name: 'vcStatsRow',
  title: 'Numbers row',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'stats', title: 'Numbers', type: 'array', of: [defineArrayMember({ type: 'vcStat' })] }),
    defineField({ name: 'note', title: 'Footnote', type: 'text', rows: 2 }),
    defineField({ name: 'statsClass', title: 'Row style', type: 'string', description: 'Design-system value, e.g. "in". Leave as is.' }),
    defineField({ name: 'noteBelow', title: 'Footnote below the row', type: 'boolean', initialValue: false }),
  ],
  preview: preview('Numbers row'),
})

export const vcTeam = defineType({
  name: 'vcTeam',
  title: 'Team grid',
  type: 'object',
  description: 'People come from Team Members, so a bio or photo edit there updates every page.',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'layout', title: 'Card style', type: 'string', options: { list: [{ title: 'Full bio with Read more', value: 'full' }, { title: 'Compact', value: 'compact' }] }, initialValue: 'full' }),
    defineField({
      name: 'members',
      title: 'People',
      type: 'array',
      of: [
        defineArrayMember({ type: 'vcTeamRef' }),
      ],
    }),
  ],
  preview: preview('Team grid'),
})

export const vcAnswer = defineType({
  name: 'vcAnswer',
  title: 'Quick answer',
  type: 'object',
  fields: [...sectionBase, defineField({ name: 'badge', title: 'Badge', type: 'string' }), heading(), defineField({ name: 'body', title: 'Answer', type: 'text', rows: 5 })],
  preview: preview('Quick answer', 'heading'),
})

export const vcCoverage = defineType({
  name: 'vcCoverage',
  title: 'Offices and coverage',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'mapQuery', title: 'Map address', type: 'string', description: 'Address shown on the embedded Google map.' }),
    defineField({ name: 'mapTitle', title: 'Map title (accessibility)', type: 'string' }),
    defineField({ name: 'visitLabel', title: 'Visit label', type: 'string' }),
    defineField({ name: 'visitHeading', title: 'Visit heading', type: 'string' }),
    defineField({ name: 'visitAddress', title: 'Visit address', type: 'string' }),
    defineField({ name: 'visitLinkLabel', title: 'Map link label', type: 'string' }),
    defineField({ name: 'visitHref', title: 'Map link', type: 'string' }),
    defineField({ name: 'cityStyle', title: 'City card style', type: 'string', options: { list: [{ title: 'City list', value: 'city' }, { title: 'Market cards', value: 'card' }] }, initialValue: 'city' }),
    defineField({
      name: 'cities',
      title: 'Cities',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcCity', fields: [
        defineField({ name: 'label', title: 'Small label (time zone)', type: 'string' }),
        defineField({ name: 'title', title: 'City', type: 'string' }),
        defineField({ name: 'flag', title: 'Flag', type: 'string' }),
        defineField({ name: 'hq', title: 'Headquarters', type: 'boolean' }),
        defineField({ name: 'body', title: 'Line', type: 'string' }),
      ], preview: { select: { title: 'title', subtitle: 'body' } } })],
    }),
  ],
  preview: preview('Offices and coverage'),
})

const teamRefs = (name: string, title: string) =>
  defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'vcTeamRef' })] })

export const vcTeamRef = defineType({
  name: 'vcTeamRef',
  title: 'Team member',
  type: 'object',
  fields: [
    defineField({ name: 'person', title: 'Team member', type: 'reference', to: [{ type: 'teamMember' }] }),
    defineField({ name: 'role', title: 'Role for this page (optional)', type: 'string' }),
    defineField({ name: 'bio', title: 'Short bio for this page (optional)', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'person.name', subtitle: 'role' } },
})

export const vcLeadership = defineType({
  name: 'vcLeadership',
  title: 'Leadership',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'ceo', title: 'Quoted leader', type: 'vcTeamRef' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 5 }),
    defineField({ name: 'caption', title: 'Caption under the name', type: 'string' }),
    teamRefs('people', 'Leadership team'),
  ],
  preview: preview('Leadership'),
})

export const vcOffices = defineType({
  name: 'vcOffices',
  title: 'Office cards',
  type: 'object',
  description: 'Offices come from Site Settings > Offices (the same list the booking band uses).',
  fields: [...sectionBase, head()],
  preview: preview('Office cards'),
})

export const vcTeamTabs = defineType({
  name: 'vcTeamTabs',
  title: 'Team by region',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'headingPrefix', title: 'Heading before the region name', type: 'string', initialValue: 'Meet the' }),
    defineField({
      name: 'tabs',
      title: 'Regions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcTeamTab',
          fields: [
            defineField({ name: 'label', title: 'Tab label', type: 'string' }),
            defineField({ name: 'flag', title: 'Flag', type: 'string' }),
            defineField({ name: 'title', title: 'Heading accent', type: 'string', description: 'e.g. "APAC Team"' }),
            teamRefs('leaders', 'Leads (large cards)'),
            teamRefs('members', 'Team'),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
  ],
  preview: preview('Team by region', 'badge'),
})

export const vcChannels = defineType({
  name: 'vcChannels',
  title: 'Contact channels',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({
      name: 'rows',
      title: 'Channels',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcChannelRow', fields: [defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'value', title: 'Shown as', type: 'string' }), defineField({ name: 'href', title: 'Link', type: 'string' })], preview: { select: { title: 'label', subtitle: 'value' } } })],
    }),
    defineField({ name: 'followLabel', title: 'Social label', type: 'string' }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcSocial', fields: [
        defineField({ name: 'network', title: 'Network', type: 'string', options: { list: ['linkedin', 'instagram', 'facebook', 'youtube', 'x', 'reddit', 'pinterest', 'whatsapp'] } }),
        defineField({ name: 'label', title: 'Accessible name', type: 'string' }),
        defineField({ name: 'href', title: 'Link', type: 'string' }),
      ], preview: { select: { title: 'network', subtitle: 'href' } } })],
    }),
    defineField({ name: 'tilesLabel', title: 'Accreditations label', type: 'string' }),
    defineField({ name: 'tilesLink', title: 'Accreditations link', type: 'vcCta' }),
    defineField({ name: 'tiles', title: 'Accreditation badges', type: 'array', of: [defineArrayMember({ type: 'vcLogo' })] }),
    defineField({ name: 'security', title: 'Security badges row', type: 'array', of: [defineArrayMember({ type: 'vcLogo' })] }),
  ],
  preview: preview('Contact channels', 'heading'),
})

export const vcRemote = defineType({
  name: 'vcRemote',
  title: 'Where we work',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    heading(),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 2 }),
    defineField({
      name: 'perks',
      title: 'Perks',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcPerk', fields: [defineField({ name: 'icon', title: 'Icon (SVG markup)', type: 'text', rows: 2 }), defineField({ name: 'text', title: 'Text', type: 'string' })], preview: { select: { title: 'text' } } })],
    }),
    defineField({ name: 'listLabel', title: 'List label', type: 'string' }),
    defineField({ name: 'timeLabel', title: 'Time column label', type: 'string' }),
    defineField({
      name: 'places',
      title: 'Places',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcPlace', fields: [
        defineField({ name: 'flag', title: 'Flag', type: 'string' }),
        defineField({ name: 'title', title: 'City', type: 'string' }),
        defineField({ name: 'line', title: 'Line', type: 'string' }),
        defineField({ name: 'label', title: 'Label', type: 'string' }),
        defineField({ name: 'tz', title: 'Time zone', type: 'string', description: 'IANA name, e.g. Australia/Sydney (shows the live local time).' }),
      ], preview: { select: { title: 'title', subtitle: 'label' } } })],
    }),
  ],
  preview: preview('Where we work', 'heading'),
})

export const vcFormEmbed = defineType({
  name: 'vcFormEmbed',
  title: 'Embedded form',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'src', title: 'Form URL', type: 'string', description: 'Embed URL of the monday.com form.' }),
    defineField({ name: 'title', title: 'Form title (accessibility)', type: 'string' }),
    defineField({ name: 'note', title: 'Note under the form', type: 'string' }),
  ],
  preview: preview('Embedded form'),
})

export const vcStories = defineType({
  name: 'vcStories',
  title: 'Customer stories grid',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'filterLabel', title: 'Filter label', type: 'string' }),
    defineField({ name: 'countText', title: 'Count line', type: 'string', description: 'Use {shown} and {total}, e.g. "Showing {shown} of {total} success stories".' }),
    defineField({ name: 'stories', title: 'Stories', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'vcStory' }] })] }),
  ],
  preview: preview('Customer stories grid'),
})

export const vcBlogList = defineType({
  name: 'vcBlogList',
  title: 'Blog post list',
  type: 'object',
  description: 'Lists every published blog post (newest first) with category tabs, the hero search and pages of 12.',
  fields: [
    ...sectionBase,
    defineField({ name: 'allLabel', title: 'All tab label', type: 'string', initialValue: 'All Posts' }),
    defineField({ name: 'otherLabel', title: 'Label for posts without a category', type: 'string', initialValue: 'General' }),
    defineField({ name: 'emptyText', title: 'No results text', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Blog post list' }) },
})

export const vcFaqHub = defineType({
  name: 'vcFaqHub',
  title: 'FAQ help centre',
  type: 'object',
  fields: [
    ...sectionBase,
    defineField({ name: 'sideLabel', title: 'Topic list label', type: 'string' }),
    defineField({ name: 'allLabel', title: 'All topics label', type: 'string', initialValue: 'All topics' }),
    defineField({
      name: 'categories',
      title: 'Topics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'vcFaqCategory',
          fields: [
            defineField({ name: 'key', title: 'Key', type: 'string' }),
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({
              name: 'groups',
              title: 'Groups',
              type: 'array',
              of: [defineArrayMember({ type: 'object', name: 'vcFaqGroup', fields: [defineField({ name: 'name', title: 'Name', type: 'string' }), defineField({ name: 'items', title: 'Questions', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'faqItem' }] })] })], preview: { select: { title: 'name' } } })],
            }),
          ],
          preview: { select: { title: 'name' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'FAQ help centre' }) },
})

/**
 * A service deep dive (page-specific): the copy of a retired leaf page folded
 * into its hub. Heading block, an approach sub-heading with numbered steps,
 * and an engagements sub-heading with a 4-card grid, built only from existing
 * Version C classes (shead, steps, cards4). First used for the four
 * Atlassian services on /atlassian-consulting (#jira, #confluence, #jsm,
 * #migration). Mark it pageSpecific and register it in
 * src/data/vcPageSpecificSections.ts.
 */
export const vcDeepDive = defineType({
  name: 'vcDeepDive',
  title: 'Service deep dive (page-specific)',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'stepsHeading', title: 'Approach heading (H3)', type: 'string' }),
    defineField({
      name: 'steps',
      title: 'Approach steps',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcDeepDiveStep', fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
      ], preview: { select: { title: 'title' } } })],
    }),
    defineField({ name: 'cardsHeading', title: 'Engagements heading (H3)', type: 'string' }),
    defineField({
      name: 'cards',
      title: 'Engagement cards',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcDeepDiveCard', fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
      ], preview: { select: { title: 'title' } } })],
    }),
  ],
  preview: {
    select: { title: 'head.heading', badge: 'head.badge' },
    prepare: ({ title, badge }: { title?: string; badge?: string }) => ({ title: title || 'Service deep dive', subtitle: `Page-specific deep dive${badge ? `: ${badge}` : ''}` }),
  },
})

/**
 * Solution finder (page-specific): a chat-style card where the visitor picks
 * an industry and browses the builds catalogued for one platform, then opens
 * a build's full detail. "Get it scoped" links to the page's own booking
 * section. Ported from the OG Labs home page finder (oglabs.io), HubSpot
 * builds only; first used on /hubspot-consulting under the hero. Mark it
 * pageSpecific and register it in src/data/vcPageSpecificSections.ts.
 */
const finderPair = (name: string, title: string) => defineArrayMember({ type: 'object', name, title, fields: [
  defineField({ name: 'label', title: 'Label', type: 'string' }),
  defineField({ name: 'text', title: 'Text', type: 'string' }),
], preview: { select: { title: 'label', subtitle: 'text' } } })

export const vcSolutionFinder = defineType({
  name: 'vcSolutionFinder',
  title: 'Solution finder (page-specific)',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'howTo', title: 'How it works lines (beside the card)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'platform', title: 'Platform name used in the bot copy', type: 'string', description: 'e.g. HubSpot' }),
    defineField({ name: 'label', title: 'Card label', type: 'string', description: 'Mono label in the card header, e.g. Solution finder' }),
    defineField({ name: 'greeting', title: 'Bot greeting', type: 'text', rows: 2 }),
    defineField({ name: 'allLabel', title: '"Show me everything" chip label', type: 'string' }),
    defineField({ name: 'changePrompt', title: 'Bot line after "Change industry"', type: 'string' }),
    defineField({ name: 'scopePrompt', title: 'Footer prompt', type: 'string', description: 'e.g. Want a build scoped for your business?' }),
    defineField({ name: 'scopeLabel', title: 'Footer button label', type: 'string' }),
    defineField({ name: 'scopeHref', title: 'Footer button link', type: 'string', description: 'Usually /contact-us#book, which scrolls to this page’s booking section.' }),
    defineField({
      name: 'builds',
      title: 'Builds',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'vcFinderBuild', title: 'Build', fields: [
        defineField({ name: 'buildId', title: 'Build ID', type: 'string', description: 'Stable id from the catalogue sheet, e.g. HS-CON-01' }),
        defineField({ name: 'industry', title: 'Industry', type: 'string', description: 'Builds group into industry chips by this exact text. "Other / general" sorts last.' }),
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'useCase', title: 'One-line use case', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'hubs', title: 'HubSpot hubs', type: 'string' }),
        defineField({ name: 'scope', title: 'Scope (fact)', type: 'string' }),
        defineField({ name: 'users', title: 'Users (fact)', type: 'string' }),
        defineField({ name: 'strength', title: 'Strength (fact)', type: 'string' }),
        defineField({ name: 'outcomes', title: 'Outcomes', type: 'array', of: [{ type: 'string' }] }),
        defineField({
          name: 'steps', title: 'What we build', type: 'array',
          of: [defineArrayMember({ type: 'object', name: 'vcFinderStep', fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'summary', title: 'Short line', type: 'string' }),
            defineField({ name: 'how', title: 'How it is built', type: 'text', rows: 2 }),
          ], preview: { select: { title: 'label', subtitle: 'summary' } } })],
        }),
        defineField({ name: 'roles', title: 'Who uses it', type: 'array', of: [finderPair('vcFinderRole', 'Role')] }),
        defineField({ name: 'phases', title: 'Delivery phases', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'kpis', title: 'KPIs', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'integrations', title: 'Integrations', type: 'array', of: [{ type: 'string' }] }),
      ], preview: { select: { title: 'name', subtitle: 'industry' } } })],
    }),
  ],
  preview: {
    select: { title: 'head.heading' },
    prepare: ({ title }: { title?: string }) => ({ title: title || 'Solution finder', subtitle: 'Page-specific solution finder' }),
  },
})

export const vcSections = [
  vcHero, vcLogos, vcSteps, vcCases, vcAudit, vcCards, vcProducts, vcUseCases, vcProof, vcPractitioners,
  vcBooking, vcFaq, vcClosing, vcVideo, vcTextPair, vcFix, vcIndustryTabs, vcTrack, vcTable, vcPartnerStatus, vcDirectory, vcToolkit, vcStatsRow, vcTeam, vcAnswer, vcCoverage, vcTeamRef, vcLeadership, vcOffices, vcTeamTabs, vcChannels, vcRemote, vcFormEmbed, vcStories, vcBlogList, vcFaqHub, vcDeepDive, vcSolutionFinder, ...vcCoreSections, vcNode,
]

/** Section types a page may contain (vcTeamRef is an object used inside sections). */
export const VC_SECTION_TYPES = vcSections.map((s) => s.name).filter((n) => n !== 'vcTeamRef' && n !== 'vcNode')

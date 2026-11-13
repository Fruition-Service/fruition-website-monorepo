import { defineArrayMember, defineField, defineType } from 'sanity'
import { head, heading, image, partnerRef, sectionBase } from './fields'

/**
 * Version C sections for the "core" pages: pricing, AI use case hub, Implementation
 * Calculator, readiness quiz and home. Each renders through
 * src/components/vc/sections/core.tsx (+ core-client.tsx for the interactive ones).
 */

const preview = (label: string, path = 'head.heading') => ({
  select: { title: path },
  prepare: ({ title }: { title?: string }) => ({ title: title || label, subtitle: label }),
})
const strings = (name: string, title: string) => defineField({ name, title, type: 'array', of: [{ type: 'string' }] })
const str = (name: string, title: string, description?: string) => defineField({ name, title, type: 'string', description })
const txt = (name: string, title: string, rows = 3) => defineField({ name, title, type: 'text', rows })
const obj = (name: string, title: string, fields: ReturnType<typeof defineField>[], titleField = 'title') =>
  defineArrayMember({ type: 'object', name, title, fields, preview: { select: { title: titleField } } })

export const vcPriceCards = defineType({
  name: 'vcPriceCards',
  title: 'Price cards',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    str('gridClass', 'Grid style', 'Design-system value, e.g. "grid3" or "grid3 lic". Leave as is.'),
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        obj('vcPriceCard', 'Card', [
          str('cardClass', 'Card style', 'Design-system value: empty or "pk".'),
          image('logo', 'Partner badge'),
          str('logoShape', 'Badge shape', 'Design-system value, e.g. "cb" or "sqh".'),
          str('kicker', 'Kicker'),
          str('title', 'Title'),
          str('body', 'Description'),
          str('meta', 'Line under the title'),
          str('priceLabel', 'Price label', 'e.g. From'),
          str('price', 'Price'),
          str('unit', 'Price unit', 'e.g. one-time, per month'),
          str('quote', 'Price text instead of a number', 'e.g. Quoted per vendor'),
          str('bestLabel', 'Best for label'),
          str('best', 'Best for'),
          strings('bullets', 'Ticked list'),
          defineField({ name: 'cta', title: 'Button', type: 'vcCta' }),
          str('linkLabel', 'Link label'),
          str('href', 'Link'),
        ]),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes under the cards',
      type: 'array',
      of: [
        obj('vcPriceNote', 'Note', [
          str('label', 'Label'),
          str('body', 'Text'),
          defineField({ name: 'links', title: 'Links', type: 'array', of: [defineArrayMember({ type: 'object', name: 'vcNoteLink', fields: [str('label', 'Label'), str('href', 'Link')], preview: { select: { title: 'label' } } })] }),
        ], 'label'),
      ],
    }),
  ],
  preview: preview('Price cards'),
})

export const vcLinkCards = defineType({
  name: 'vcLinkCards',
  title: 'Link cards',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    str('gridClass', 'Grid style', 'Design-system value. Leave as is.'),
    defineField({ name: 'items', title: 'Cards', type: 'array', of: [obj('vcLinkCard', 'Card', [str('title', 'Title'), str('href', 'Link')])] }),
  ],
  preview: preview('Link cards'),
})

export const vcServices = defineType({
  name: 'vcServices',
  title: 'Services price tabs',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        obj('vcServiceTab', 'Tab', [
          str('label', 'Tab label'),
          str('kicker', 'Kicker'),
          str('title', 'Title'),
          str('body', 'Description'),
          str('fromLabel', 'From label'),
          str('from', 'Starting price'),
          defineField({ name: 'cta', title: 'Button', type: 'vcCta' }),
          defineField({
            name: 'rows',
            title: 'Services',
            type: 'array',
            of: [obj('vcServiceRow', 'Service', [str('name', 'Name'), str('note', 'Note'), str('price', 'Price'), str('href', 'Page', 'Where the service lives, for structured data.')], 'name')],
          }),
        ], 'label'),
      ],
    }),
    str('footnote', 'Note under the tabs'),
  ],
  preview: preview('Services price tabs'),
})

export const vcFacts = defineType({
  name: 'vcFacts',
  title: 'Fact sheet',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'rows', title: 'Facts', type: 'array', of: [obj('vcFactRow', 'Fact', [str('label', 'Label'), str('value', 'Value')], 'label')] }),
  ],
  preview: preview('Fact sheet'),
})

export const vcIndustryGrid = defineType({
  name: 'vcIndustryGrid',
  title: 'Use case industries (from the catalogue)',
  type: 'object',
  fields: [
    ...sectionBase,
    head(),
    str('labelTemplate', 'Count line', 'Use {count} and {ai}, e.g. "{count} use cases · {ai} with AI". The industries and numbers come from the use case catalogue.'),
  ],
  preview: preview('Use case industries'),
})

export const vcCatalogue = defineType({
  name: 'vcCatalogue',
  title: 'Use case catalogue (from the catalogue)',
  type: 'object',
  description: 'The tiles come from the use case catalogue data; only the surrounding copy is edited here.',
  fields: [
    ...sectionBase,
    head(),
    str('departmentLabel', 'Department filter label'),
    str('allDepartmentsLabel', 'All departments label'),
    str('industryLabel', 'Industry label (shown when the page is opened on one industry)'),
    str('allIndustriesLabel', 'All industries label'),
    str('searchLabel', 'Search label'),
    str('searchPlaceholder', 'Search placeholder'),
    str('filterLabel', 'Filter label'),
    str('aiOnlyLabel', 'AI only toggle'),
    str('countAll', 'Count, nothing filtered', 'Use {total}. e.g. "Showing all {total} use cases"'),
    str('countFiltered', 'Count, filtered', 'Use {shown} and {total}. e.g. "Showing {shown} of {total} matching use cases"'),
    str('emptyText', 'Nothing matches text'),
    str('ownLabel', 'Own build label'),
    str('aiLabel', 'AI tag'),
    str('linkLabel', 'Tile link'),
    str('moreLabel', 'Show more button'),
    defineField({
      name: 'overrides',
      title: 'Approved tile wording',
      type: 'array',
      description: 'Where the approved page wording differs from the catalogue summary, the tile shows this instead. Matched by use case id.',
      of: [obj('vcTileOverride', 'Tile', [str('id', 'Use case id'), str('title', 'Title'), txt('summary', 'Summary'), str('metric', 'Metric tag')])],
    }),
  ],
  preview: preview('Use case catalogue'),
})

export const vcAskDemo = defineType({
  name: 'vcAskDemo',
  title: 'Implementation Calculator walkthrough (illustration)',
  type: 'object',
  description: 'A scripted illustration of the Calculator. The live tool is /ask-fruit/workspace.',
  fields: [
    ...sectionBase,
    head(),
    str('note', 'Note under the illustration'),
    defineField({
      name: 'ui',
      title: 'Interface text',
      type: 'array',
      description: 'Every label inside the illustration. The id says where it is used; do not change ids.',
      of: [obj('vcUiText', 'Text', [str('id', 'Id'), str('text', 'Text')], 'text')],
    }),
    defineField({
      name: 'scenarios',
      title: 'Scenarios',
      type: 'array',
      of: [
        obj('vcAskScenario', 'Scenario', [
          str('id', 'Id'),
          str('chip', 'Chip label'),
          str('title', 'Conversation title'),
          str('user', 'Question'),
          str('goals', 'Goals'),
          str('tools', 'Current tools'),
          strings('reply', 'Reply paragraphs (wrap bold words in asterisks)'),
          strings('matches', 'Matched solutions'),
        ]),
      ],
    }),
    defineField({
      name: 'solutions',
      title: 'Solutions',
      type: 'array',
      of: [
        obj('vcAskSolution', 'Solution', [
          str('name', 'Name'),
          str('why', 'Why it matches'),
          strings('fit', 'Fit for the first two requirements (meets, partly, gap)'),
          str('strength', 'Strength'),
          str('watch', 'Watch-out'),
          str('rec', 'Recommendation line'),
          strings('phases', 'Phases'),
        ], 'name'),
      ],
    }),
  ],
  preview: preview('Calculator walkthrough'),
})

export const vcQuiz = defineType({
  name: 'vcQuiz',
  title: 'AI readiness quiz',
  type: 'object',
  description: 'The scoring behind each option (value) and the dimension each question feeds are part of the quiz logic: edit wording, not values.',
  fields: [
    ...sectionBase,
    head(),
    defineField({ name: 'ui', title: 'Interface text', type: 'array', description: 'Labels, states and form text. The id says where it is used; do not change ids.', of: [obj('vcUiText', 'Text', [str('id', 'Id'), str('text', 'Text')], 'text')] }),
    strings('dims', 'Dimension names (eight, in order)'),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        obj('vcQuizQuestion', 'Question', [
          str('kicker', 'Kicker'),
          str('title', 'Question'),
          str('help', 'Help line'),
          defineField({ name: 'dim', title: 'Dimension scored (0 to 7)', type: 'number', description: 'Leave empty for the profile questions.' }),
          defineField({ name: 'options', title: 'Options', type: 'array', of: [obj('vcQuizOption', 'Option', [str('label', 'Label'), str('hint', 'Hint'), defineField({ name: 'value', title: 'Value (quiz logic)', type: 'number' })], 'label')] }),
        ]),
      ],
    }),
  ],
  preview: preview('AI readiness quiz'),
})

/**
 * A generic element of an animated or decorative block (the home page stages:
 * network, method timeline, industries hub, AI layer). Text nodes carry the copy,
 * image nodes carry Sanity images; tag, class and style are the design.
 */
export const vcNode = defineType({
  name: 'vcNode',
  title: 'Element',
  type: 'object',
  fields: [
    str('tag', 'Tag', 'HTML tag, or #text for a run of text. Design-system value; leave as is.'),
    str('className', 'Class', 'Design-system value; leave as is.'),
    str('style', 'Inline style', 'Design-system value; leave as is.'),
    str('text', 'Text'),
    image('image', 'Image'),
    ...partnerRef,
    defineField({ name: 'svg', title: 'Artwork (SVG markup)', type: 'text', rows: 2, description: 'Generated artwork. Do not edit by hand.' }),
    str('href', 'Link'),
    strings('attrs', 'Attributes (name=value)'),
    defineField({ name: 'children', title: 'Contents', type: 'array', of: [defineArrayMember({ type: 'vcNode' })] }),
  ],
  preview: { select: { title: 'text', subtitle: 'className' }, prepare: ({ title, subtitle }: { title?: string; subtitle?: string }) => ({ title: title || subtitle || 'Element' }) },
})

export const vcMarkup = defineType({
  name: 'vcMarkup',
  title: 'Designed section (animated or bespoke)',
  type: 'object',
  description: 'A bespoke section built from elements, as approved in the mock-up. Edit the text and images in place on the page.',
  fields: [
    str('sectionClass', 'Section class', 'Design-system value; leave as is.'),
    str('anchor', 'Anchor id'),
    str('dataSec', 'Section key'),
    str('behaviour', 'Behaviour', 'Design-system value: method or industries (animated). Leave as is.'),
    defineField({ name: 'nodes', title: 'Contents', type: 'array', of: [defineArrayMember({ type: 'vcNode' })] }),
  ],
  preview: { select: { title: 'dataSec' }, prepare: ({ title }: { title?: string }) => ({ title: title || 'Designed section', subtitle: 'Designed section' }) },
})

export const vcInsights = defineType({
  name: 'vcInsights',
  title: 'Latest insights (from the blog)',
  type: 'object',
  description: 'The three most recent blog posts; only the heading is edited here.',
  fields: [...sectionBase, head()],
  preview: preview('Latest insights'),
})

export const vcCoreSections = [vcPriceCards, vcLinkCards, vcServices, vcFacts, vcIndustryGrid, vcCatalogue, vcAskDemo, vcQuiz, vcMarkup, vcInsights]
export { heading, txt }

import { defineArrayMember, defineField } from 'sanity'

/**
 * Field helpers shared by the Version C section types.
 *
 * Headings use one convention everywhere: wrap the accented part in asterisks.
 * "Retailers that run *operations on monday.com.*" renders the starred words
 * in the accent colour (purple on light sections, lilac on dark bands). The
 * inline editor shows the stored text, asterisks included.
 */
export const HEADING_HELP =
  'Wrap the accented words in asterisks, e.g. "Retailers that run *operations on monday.com.*"'

export function heading(name = 'heading', title = 'Heading') {
  return defineField({ name, title, type: 'string', description: HEADING_HELP })
}

/** Section header: badge + heading on the left, one lead line on the right. */
export function head(title = 'Section header') {
  return defineField({ name: 'head', title, type: 'vcHead' })
}

/** Background and anchor every section carries. */
export const sectionBase = [
  defineField({
    name: 'tone',
    title: 'Background',
    type: 'string',
    options: { list: [{ title: 'White', value: 'plain' }, { title: 'Grey', value: 'alt' }], layout: 'radio', direction: 'horizontal' },
    initialValue: 'plain',
  }),
  defineField({
    name: 'sectionClass',
    title: 'Section style',
    type: 'string',
    description: 'Design-system class from the mock-up (e.g. "story"). Leave as is.',
  }),
  defineField({
    name: 'anchor',
    title: 'Anchor id',
    type: 'string',
    description: 'Optional id for in-page links, e.g. "services" makes #services scroll here.',
  }),
  // Template vs page-specific: see docs/version-c.md "Template and page-specific sections".
  defineField({
    name: 'scope',
    title: 'Template or page-specific',
    type: 'string',
    options: {
      list: [
        { title: 'Template: part of this page group\'s Version C layout', value: 'template' },
        { title: 'Page-specific: added for this page only', value: 'page' },
      ],
      layout: 'radio',
    },
    description:
      'Template sections come from the approved Version C mock-up for the page group (partner, industry, region, AI...) and appear in the same order on every page of that group. Page-specific sections were added for one page: do not copy them to sibling pages, and keep them when re-applying the template. Empty means template.',
  }),
  defineField({
    name: 'scopeNote',
    title: 'Why this section is page-specific',
    type: 'text',
    rows: 2,
    description: 'Who asked for it and why, so the next editor or agent knows not to remove it.',
    hidden: ({ parent }) => (parent as { scope?: string } | undefined)?.scope !== 'page',
  }),
]

export const ctas = defineField({
  name: 'ctas',
  title: 'Buttons',
  type: 'array',
  of: [defineArrayMember({ type: 'vcCta' })],
})

export const image = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    description,
    options: { hotspot: true },
    fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
  })

export const tags = defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] })

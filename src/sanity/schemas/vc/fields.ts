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
    name: 'anchor',
    title: 'Anchor id',
    type: 'string',
    description: 'Optional id for in-page links, e.g. "services" makes #services scroll here.',
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

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
  // Page-specific marker. Pages in one group (partner, industry, ...) share a section template.
  // A section added to only one page sets this, gets a `_key` starting with "pagespecific-",
  // and is listed in src/data/vcPageSpecificSections.ts. See docs/version-c.md "Page-specific sections".
  defineField({
    name: 'pageSpecific',
    title: 'Page-specific section (outside the shared template)',
    type: 'boolean',
    description:
      'On means this section exists only on this page, not on the other pages of its group. Keep it when re-templating the group, and keep src/data/vcPageSpecificSections.ts in step.',
    initialValue: false,
  }),
  defineField({
    name: 'pageSpecificNote',
    title: 'Why this section is page-specific',
    type: 'string',
    description: 'Where the content came from and when it was added, e.g. "Ported from oglabs.io/services/hubspot, Nov 2026".',
    hidden: ({ parent }) => !(parent as { pageSpecific?: boolean } | undefined)?.pageSpecific,
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

/**
 * Point an image at a Partner document: the page then shows that partner's
 * current badge, logo or mark instead of its own image (which stays as the
 * fallback), so a badge changed on the Partner updates every page.
 */
export const partnerRef = [
  defineField({
    name: 'partner',
    title: 'Partner',
    type: 'reference',
    to: [{ type: 'partner' }],
    description: 'Shows this partner\'s image from Partners & badges. Change the badge there, not here.',
  }),
  defineField({
    name: 'partnerImage',
    title: 'Which partner image',
    type: 'string',
    options: { list: ['badge', 'logo', 'mark'], layout: 'radio', direction: 'horizontal' },
    initialValue: 'badge',
    hidden: ({ parent }) => !(parent as { partner?: unknown } | undefined)?.partner,
  }),
]

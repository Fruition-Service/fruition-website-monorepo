import { defineField, defineType } from 'sanity'

const img = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'image',
    description,
    fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
  })

/**
 * One technology partner (monday.com, OpenAI, ElevenLabs, ...) and its images.
 * Every partner badge, logo and directory tile on the site points here, so a
 * new badge uploaded once shows on every page: badge rows, the partner
 * directories, About us, Certifications & awards, the home page and the hero
 * badges on partner pages.
 */
export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'slug',
      description: 'Stable id used by the code (e.g. "openai", "google-cloud"). Do not change.',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    img('badge', 'Partner badge', 'The official partner or tier badge (e.g. "OpenAI Select Partner"). Shown in badge rows, About us, Certifications & awards and partner page heroes. The alt text is the badge name.'),
    img('logo', 'Logo (wordmark)', 'The plain brand logo, for places that show the brand rather than the badge.'),
    img('mark', 'Mark (square icon)', 'Small square icon, used in the partner directory and menus.'),
    defineField({ name: 'href', title: 'Partner page', type: 'string', description: 'e.g. /partnerships/openai-chatgpt-partner' }),
  ],
  orderings: [{ title: 'Name', name: 'name', by: [{ field: 'name', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'badge.alt', media: 'badge' } },
})

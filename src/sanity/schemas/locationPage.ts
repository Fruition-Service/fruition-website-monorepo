/**
 * Region page (`/monday-partner-*`) — the six country pages.
 *
 * This schema mirrors `RegionContent` in `src/components/region/types.ts`
 * one-for-one, so every word on the page is editable here. The pre-redesign
 * fields (comparison tabs, methodology steps, feature blocks, ROI stats, the
 * "join 500+" band, industry tabs, capabilities, solution cards, the legacy
 * body, the Calendly/team/testimonials heading overrides) were removed in the
 * same change: the redesigned template never read them, so they were editable
 * text that changed nothing on the site.
 *
 * Anything left blank falls back to the shipped copy in
 * `src/data/regionPages.ts` — see `mergeRegionContent` for the exact rule. All
 * six documents are seeded with that copy, so in practice these fields are
 * full and what you see here is what the page renders.
 */

const ICON_OPTIONS = [
  { title: 'Layers (implementation)', value: 'layers' },
  { title: 'Line chart (CRM)', value: 'chart' },
  { title: 'Lightning (integrations)', value: 'zap' },
  { title: 'People (training)', value: 'users' },
  { title: 'Database (migration)', value: 'database' },
  { title: 'Sparkles (support & AI)', value: 'sparkles' },
]

/** Section intro shared by services / process / numbers / coverage. */
const introFields = [
  { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
  { name: 'heading', title: 'Heading', type: 'string' },
  { name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 },
]

export default {
  name: 'locationPage',
  title: 'Region Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO & meta', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'services', title: 'Services' },
    { name: 'answer', title: 'Answer block' },
    { name: 'proof', title: 'Proof & video' },
    { name: 'process', title: 'Process & numbers' },
    { name: 'people', title: 'Team & coverage' },
    { name: 'faq', title: 'FAQ' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    /* ── SEO & meta ─────────────────────────────────────────────── */
    {
      name: 'title',
      title: 'Document title',
      type: 'string',
      group: 'seo',
      description: 'Studio label only — never rendered on the page.',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'seo',
      options: { source: 'title' },
      description: 'Must match the route, e.g. monday-partner-australia.',
    },
    {
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'The browser tab and Google result title.',
    },
    {
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The meta description Google shows under the title.',
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'seo',
      description: 'Rendered inside the video section lead, e.g. "Australia".',
    },
    {
      name: 'region',
      title: 'Region tag',
      type: 'string',
      group: 'seo',
      description: 'Internal grouping (APAC, UK, NA…). Not rendered.',
    },

    /* ── Hero ───────────────────────────────────────────────────── */
    {
      name: 'flag',
      title: 'Flag emoji',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroImage',
      title: 'Hero banner image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'The wide monday.com product banner under the hero copy.',
    },
    {
      name: 'hero',
      title: 'Hero copy',
      type: 'object',
      group: 'hero',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'eyebrow',
          title: 'Eyebrow pill',
          type: 'string',
          description: 'Sits beside the flag, e.g. "monday.com Platinum Partner · Sydney · Melbourne".',
        },
        {
          name: 'heading',
          title: 'H1 — first half',
          type: 'string',
          description: 'Rendered in the default colour.',
        },
        {
          name: 'headingAccent',
          title: 'H1 — accent half',
          type: 'string',
          description: 'Rendered in voltage purple, straight after the first half.',
        },
        { name: 'subheading', title: 'Subheading', type: 'text', rows: 4 },
        {
          name: 'badgeStrap',
          title: 'Badge strapline',
          type: 'string',
          description: 'Credential line beside the partner badge.',
        },
      ],
    },
    {
      name: 'primaryCtaLabel',
      title: 'Hero CTA label',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'primaryCtaUrl',
      title: 'Hero CTA URL',
      type: 'string',
      group: 'hero',
      description:
        'A Calendly URL here is rewritten to the on-site booking section (/contact-us#book). Any other URL is used as-is.',
    },

    /* ── Services ───────────────────────────────────────────────── */
    {
      name: 'services',
      title: 'Services section',
      type: 'object',
      group: 'services',
      options: { collapsible: true, collapsed: false },
      fields: [
        ...introFields,
        {
          name: 'cards',
          title: 'Service cards',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'regionService',
              fields: [
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: { list: ICON_OPTIONS },
                },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'body', title: 'Body', type: 'text', rows: 3 },
              ],
              preview: { select: { title: 'title', subtitle: 'body' } },
            },
          ],
        },
        {
          name: 'alsoLabel',
          title: '"Also delivered" label',
          type: 'string',
        },
        {
          name: 'alsoLinks',
          title: '"Also delivered" links',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'regionServiceLink',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'href', title: 'Href', type: 'string' },
              ],
              preview: { select: { title: 'label', subtitle: 'href' } },
            },
          ],
        },
      ],
    },

    /* ── Answer block ───────────────────────────────────────────── */
    {
      name: 'answerBlock',
      title: 'Answer block',
      type: 'object',
      group: 'answer',
      description:
        'The answer-engine block: one question, one self-contained answer. Written to be quotable on its own by AI search.',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'question', title: 'Question', type: 'string' },
        { name: 'answer', title: 'Answer', type: 'text', rows: 8 },
      ],
    },

    /* ── Proof & video ──────────────────────────────────────────── */
    {
      name: 'testimonials',
      title: 'Testimonials section',
      type: 'object',
      group: 'proof',
      description: 'Headings only — the quotes come from the Case Studies documents.',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 },
      ],
    },
    {
      name: 'video',
      title: 'Video section',
      type: 'object',
      group: 'proof',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 },
        { name: 'caption', title: 'Caption under the lead', type: 'string' },
        {
          name: 'videoId',
          title: 'YouTube video ID',
          type: 'string',
          description: 'Just the ID, e.g. eoOCR6OjJhI — not the full URL.',
        },
        { name: 'videoTitle', title: 'Video title (accessibility)', type: 'string' },
      ],
    },

    /* ── Process & numbers ──────────────────────────────────────── */
    {
      name: 'process',
      title: 'Process section',
      type: 'object',
      group: 'process',
      options: { collapsible: true, collapsed: false },
      fields: [
        ...introFields,
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'regionProcessStep',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'body', title: 'Body', type: 'text', rows: 3 },
              ],
              preview: { select: { title: 'title', subtitle: 'body' } },
            },
          ],
        },
      ],
    },
    {
      name: 'numbers',
      title: 'Numbers section',
      type: 'object',
      group: 'process',
      options: { collapsible: true, collapsed: false },
      fields: [
        ...introFields,
        {
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'regionStat',
              fields: [
                { name: 'value', title: 'Value', type: 'string' },
                { name: 'label', title: 'Label', type: 'text', rows: 2 },
              ],
              preview: { select: { title: 'value', subtitle: 'label' } },
            },
          ],
        },
        {
          name: 'footnote',
          title: 'Footnote',
          type: 'text',
          rows: 3,
          description: 'The qualifier under the stats. Keep it — the figures are typical, not guaranteed.',
        },
      ],
    },

    /* ── Team & coverage ────────────────────────────────────────── */
    {
      name: 'team',
      title: 'Team section',
      type: 'object',
      group: 'people',
      description:
        'Headings only. Who appears is set by the region tag on each Team Member document.',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 },
      ],
    },
    {
      name: 'coverage',
      title: 'Coverage section',
      type: 'object',
      group: 'people',
      options: { collapsible: true, collapsed: false },
      fields: [
        ...introFields,
        {
          name: 'locations',
          title: 'Cities',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'regionLocation',
              fields: [
                { name: 'city', title: 'City', type: 'string' },
                { name: 'detail', title: 'Detail', type: 'string' },
                {
                  name: 'headquarters',
                  title: 'Head office',
                  type: 'boolean',
                  description: 'Renders the pulsing "live" dot.',
                },
              ],
              preview: { select: { title: 'city', subtitle: 'detail' } },
            },
          ],
        },
        {
          name: 'office',
          title: 'Office card',
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'address', title: 'Address', type: 'string' },
            {
              name: 'mapQuery',
              title: 'Map search query',
              type: 'string',
              description: 'Address string used for the embedded map.',
            },
            { name: 'mapUrl', title: 'Map link', type: 'string' },
          ],
        },
      ],
    },

    /* ── FAQ ────────────────────────────────────────────────────── */
    {
      name: 'faq',
      title: 'FAQ section',
      type: 'object',
      group: 'faq',
      description:
        'The only FAQ source for this page. These questions are also what the page publishes as FAQPage structured data.',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        {
          name: 'contactLead',
          title: 'Contact aside',
          type: 'text',
          rows: 2,
          description: 'Sits under the sticky FAQ heading, beside the consultant contact.',
        },
        {
          name: 'items',
          title: 'Questions',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'regionFaq',
              fields: [
                { name: 'question', title: 'Question', type: 'string' },
                { name: 'answer', title: 'Answer', type: 'text', rows: 6 },
              ],
              preview: { select: { title: 'question', subtitle: 'answer' } },
            },
          ],
        },
      ],
    },

    /* ── Closing CTA ────────────────────────────────────────────── */
    {
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'object',
      group: 'cta',
      description: 'The purple booking band. The calendar itself comes from Site Settings.',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3 },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
}

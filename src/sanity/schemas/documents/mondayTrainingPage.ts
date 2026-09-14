import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'mondayTrainingPage',
  title: 'Monday Training Page',
  type: 'document',
  // @ts-expect-error Sanity experimental API (singleton)
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),
    defineField({ name: 'croSections', title: 'CRO Sections', type: 'croSections' }),

    // Hero
    defineField({ name: 'heroHeadingPart1', title: 'Hero Heading (prefix)', type: 'string' }),
    defineField({ name: 'heroHeadingAccent', title: 'Hero Heading (accent)', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text' }),
    defineField({
      name: 'heroPartnerBadges',
      title: 'Hero Partner Badges (row above heading)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'partnerBadge',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'alt', title: 'Alt text', type: 'string' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'heroMondayPartnersImage',
      title: 'Hero Monday Partners Image (shown below subheading)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'heroCertificationBadge', title: 'Hero Certification Banner', type: 'image' }),
    defineField({ name: 'heroImage', title: 'Hero Image (optional — leave empty to hide)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroPrimaryCtaLabel', title: 'Hero Primary CTA Label', type: 'string' }),
    defineField({ name: 'heroPrimaryCtaUrl', title: 'Hero Primary CTA URL', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaLabel', title: 'Hero Secondary CTA Label (optional)', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaUrl', title: 'Hero Secondary CTA URL (optional)', type: 'string' }),

    // Logo Cloud
    defineField({ name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' }),
    defineField({ name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' }),

    // Video
    defineField({ name: 'videoEmbedUrl', title: 'Video Embed URL', type: 'url' }),
    defineField({ name: 'videoTitle', title: 'Video Title', type: 'string' }),

    // Training section intro
    defineField({ name: 'trainingIntroHeading', title: 'Training Intro Heading', type: 'string' }),
    defineField({ name: 'trainingIntroSubheading', title: 'Training Intro Subheading', type: 'text' }),

    // Training Tabs
    defineField({ name: 'trainingSectionHeading', title: 'Training Section Heading', type: 'string' }),
    defineField({
      name: 'trainingTabs',
      title: 'Training Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trainingTab',
          fields: [
            { name: 'label', title: 'Tab Label', type: 'string' },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'trainingItem',
                  fields: [
                    { name: 'number', title: 'Number', type: 'string' },
                    { name: 'title', title: 'Title', type: 'string' },
                    { name: 'description', title: 'Description (paragraph)', type: 'text' },
                    { name: 'bullets', title: 'Bullets (optional, used when no description)', type: 'array', of: [{ type: 'string' }] },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),

    // Empower / intro copy ABOVE training services section
    defineField({ name: 'empowerEyebrow', title: 'Empower Section Eyebrow', type: 'string' }),
    defineField({ name: 'empowerHeading', title: 'Empower Section Heading', type: 'string' }),
    defineField({ name: 'empowerBody', title: 'Empower Section Body', type: 'text' }),
    defineField({ name: 'empowerImage', title: 'Empower Section Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'empowerCtaLabel', title: 'Empower Section CTA Label', type: 'string' }),
    defineField({ name: 'empowerCtaUrl', title: 'Empower Section CTA URL (defaults to Calendly URL)', type: 'string' }),

    // Training Services
    defineField({ name: 'servicesHeading', title: 'Services Heading', type: 'string' }),
    defineField({
      name: 'trainingServices',
      title: 'Training Services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trainingService',
          fields: [
            { name: 'emoji', title: 'Emoji', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true } },
            { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
            { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
          ],
        }),
      ],
    }),

    // Testimonials section
    defineField({ name: 'testimonialsHeading', title: 'Testimonials Heading', type: 'string' }),
    defineField({ name: 'testimonialsCtaLabel', title: 'Testimonials CTA Label', type: 'string' }),
    defineField({ name: 'testimonialsCtaUrl', title: 'Testimonials CTA URL', type: 'string' }),
    defineField({ name: 'statCardValue', title: 'Stat Card Value', type: 'string' }),
    defineField({ name: 'statCardSubtitle', title: 'Stat Card Subtitle', type: 'text' }),
    defineField({ name: 'statCardCtaLabel', title: 'Stat Card CTA Label', type: 'string' }),
    defineField({ name: 'statCardCtaUrl', title: 'Stat Card CTA URL', type: 'string' }),

    // Calendly
    defineField({ name: 'calendlyHeading', title: 'Calendly Heading', type: 'string' }),
    defineField({ name: 'calendlySubheading', title: 'Calendly Subheading', type: 'text' }),
    defineField({ name: 'calendlyUrl', title: 'Calendly URL', type: 'url' }),

    // FAQ
    defineField({ name: 'faqHeading', title: 'FAQ Heading', type: 'string' }),
    defineField({
      name: 'faqTabs',
      title: 'FAQ Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqTab',
          fields: [
            { name: 'label', title: 'Tab Label', type: 'string' },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'faqPair',
                  fields: [
                    { name: 'question', title: 'Question', type: 'string' },
                    { name: 'answer', title: 'Answer', type: 'text' },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),

    // Discover CTA section
    defineField({ name: 'discoverBadge', title: 'Discover Badge Image', type: 'image' }),
    defineField({ name: 'discoverHeading', title: 'Discover Heading', type: 'string' }),
    defineField({ name: 'discoverPrimaryCtaLabel', title: 'Discover Primary CTA Label', type: 'string' }),
    defineField({ name: 'discoverPrimaryCtaUrl', title: 'Discover Primary CTA URL', type: 'string' }),
    defineField({ name: 'discoverSecondaryCtaLabel', title: 'Discover Secondary CTA Label', type: 'string' }),
    defineField({ name: 'discoverSecondaryCtaUrl', title: 'Discover Secondary CTA URL', type: 'string' }),

    // Join 900+ stats section (Forrester data)
    defineField({ name: 'joinSectionHeadingPart1', title: 'Join Section — "Join" prefix', type: 'string' }),
    defineField({ name: 'joinSectionHeadingAccent', title: 'Join Section — "900+ businesses" accent', type: 'string' }),
    defineField({ name: 'joinSectionHeadingPart2', title: 'Join Section — suffix', type: 'string' }),
    defineField({ name: 'joinSectionSubheading', title: 'Join Section Subheading (e.g. "The economic impact of")', type: 'string' }),
    defineField({
      name: 'joinSectionStats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
          ],
        }),
      ],
    }),
    defineField({ name: 'joinSectionFootnote', title: 'Join Section Footnote ("Data by ...")', type: 'string' }),
    defineField({ name: 'joinSectionBadge', title: 'Forrester / Data Source Badge', type: 'image' }),

    // Security badge
    defineField({ name: 'securityBadge', title: 'Security Badge Image', type: 'image' }),
  ],
})

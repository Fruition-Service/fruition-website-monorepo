import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'mondayImplementationConsultantsPage',
  title: 'Monday Implementation Consultants Page',
  type: 'document',
  // @ts-expect-error Sanity experimental API (singleton)
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),
    defineField({ name: 'croSections', title: 'CRO Sections', type: 'croSections' }),

    // Hero
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow (small label above heading)', type: 'string' }),
    defineField({ name: 'heroHeadingPart1', title: 'Hero Heading (prefix)', type: 'string' }),
    defineField({ name: 'heroHeadingAccent', title: 'Hero Heading (accent / purple)', type: 'string' }),
    defineField({ name: 'heroHeadingPart2', title: 'Hero Heading (suffix)', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text' }),
    defineField({
      name: 'heroPartnerBadges',
      title: 'Hero Partner Badges (row above eyebrow)',
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
      title: 'Hero Monday Partners Image (shown under subheading)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroProductImages',
      title: 'Hero Product Images Row (under hero dashboard)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'productImage',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'alt', title: 'Alt text', type: 'string' },
          ],
        }),
      ],
    }),
    defineField({ name: 'heroCertificationBadge', title: 'Hero Certification Banner', type: 'image' }),
    defineField({ name: 'heroImage', title: 'Hero Dashboard Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'videoEmbedUrl', title: 'Video Embed URL (YouTube embed)', type: 'url' }),
    defineField({ name: 'videoTitle', title: 'Video Title', type: 'string' }),
    defineField({ name: 'heroPrimaryCtaLabel', title: 'Hero Primary CTA Label', type: 'string' }),
    defineField({ name: 'heroPrimaryCtaUrl', title: 'Hero Primary CTA URL', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaLabel', title: 'Hero Secondary CTA Label', type: 'string' }),
    defineField({ name: 'heroSecondaryCtaUrl', title: 'Hero Secondary CTA URL', type: 'string' }),

    // monday product logos strip (between hero and logo cloud)
    defineField({
      name: 'mondayProductLogos',
      title: 'monday Product Logos Strip (gradient band under hero)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'productLogo',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'alt', title: 'Alt text', type: 'string' },
          ],
        }),
      ],
    }),

    // Logo Cloud
    defineField({ name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' }),
    defineField({ name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' }),

    // "Teams Transformed with Proven Efficiency Gains" banner
    defineField({ name: 'teamsTransformedHeading', title: 'Teams Transformed Heading', type: 'string' }),
    defineField({ name: 'teamsTransformedBody', title: 'Teams Transformed Body (portable text)', type: 'array', of: [defineArrayMember({ type: 'block' })] }),

    // 3-tab DIY vs Using Consultants section
    defineField({ name: 'comparisonSectionHeading', title: 'Comparison Section Heading', type: 'string' }),
    defineField({
      name: 'comparisonTabs',
      title: 'Comparison Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'comparisonTab',
          fields: [
            { name: 'label', title: 'Tab Label', type: 'string' },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'comparisonItem',
                  fields: [
                    { name: 'number', title: 'Number', type: 'string' },
                    { name: 'title', title: 'Title', type: 'string' },
                    { name: 'description', title: 'Description', type: 'text' },
                    {
                      name: 'bullets',
                      title: 'Bullet list (emoji + text)',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          name: 'bullet',
                          fields: [
                            { name: 'emoji', title: 'Emoji', type: 'string' },
                            { name: 'text', title: 'Text', type: 'text' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),

    // "Our expert consultants empower you to adopt workflow automation..." 5-step section
    defineField({ name: 'methodologyHeading', title: 'Methodology Heading', type: 'string' }),
    defineField({
      name: 'methodologySteps',
      title: 'Methodology Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'methodologyStep',
          fields: [
            { name: 'number', title: 'Number', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        }),
      ],
    }),

    // "Create a CRM or project management tool that fits you" — multi-solution section
    defineField({ name: 'solutionsHeadingPart1', title: 'Solutions Heading (prefix)', type: 'string' }),
    defineField({ name: 'solutionsHeadingAccent', title: 'Solutions Heading (accent)', type: 'string' }),
    defineField({ name: 'solutionsHeadingPart2', title: 'Solutions Heading (suffix)', type: 'string' }),
    defineField({ name: 'solutionsIntro', title: 'Solutions Intro', type: 'text' }),
    defineField({ name: 'crmCardCtaUrl', title: 'Synthesised CRM Card — CTA URL', type: 'string' }),
    defineField({
      name: 'solutionCards',
      title: 'Solution Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'solutionCard',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow (e.g. "Training & managed services")', type: 'string' },
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'body', title: 'Body', type: 'text' },
            { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
            { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
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

    // Join 900+ stats section
    defineField({ name: 'joinSectionHeadingPart1', title: 'Join Section — "Join" prefix', type: 'string' }),
    defineField({ name: 'joinSectionHeadingAccent', title: 'Join Section — "900+ businesses" accent', type: 'string' }),
    defineField({ name: 'joinSectionHeadingPart2', title: 'Join Section — suffix', type: 'string' }),
    defineField({ name: 'joinSectionSubheading', title: 'Join Section Subheading', type: 'string' }),
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
    defineField({ name: 'joinSectionFootnote', title: 'Footnote ("Data by ...")', type: 'string' }),
    defineField({ name: 'joinSectionBadge', title: 'Data Source Badge', type: 'image' }),

    // Security badge
    defineField({ name: 'securityBadge', title: 'Security Badge Image', type: 'image' }),
  ],
})

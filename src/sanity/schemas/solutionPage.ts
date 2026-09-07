import { pageBodyField, LEGACY_BODY_DESCRIPTION } from './objects/pageBody'

export default {
  name: 'solutionPage',
  title: 'Solution Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string' },
    { name: 'heroSubheading', title: 'Hero Subheading', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' },
    { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
    { name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' },
    { name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'string' },
    pageBodyField(LEGACY_BODY_DESCRIPTION),

    // Comparison / tabbed section
    { name: 'comparisonHeading', title: 'Comparison Section Heading', type: 'string' },
    { name: 'comparisonHeadingAccent', title: 'Comparison Section Heading (accent)', type: 'string' },
    { name: 'comparisonSubheading', title: 'Comparison Section Subheading', type: 'text' },
    {
      name: 'comparisonTabs',
      title: 'Comparison Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'comparisonTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'subheading', title: 'Sub-heading (under tab pills)', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'comparisonItem',
              fields: [
                { name: 'number', title: 'Number', type: 'string' },
                { name: 'icon', title: 'Icon / Emoji', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
                {
                  name: 'bullets',
                  title: 'Bullets',
                  type: 'array',
                  of: [{
                    type: 'object',
                    name: 'bullet',
                    fields: [
                      { name: 'emoji', title: 'Emoji', type: 'string' },
                      { name: 'text', title: 'Text', type: 'text' },
                    ],
                  }],
                },
              ],
            }],
          },
        ],
      }],
    },

    // Methodology section
    { name: 'methodologyHeading', title: 'Methodology Heading', type: 'string' },
    {
      name: 'methodologySteps',
      title: 'Methodology Steps',
      type: 'array',
      of: [{
        type: 'object',
        name: 'methodologyStep',
        fields: [
          { name: 'number', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

    // Calendly section
    { name: 'calendlyHeading', title: 'Calendly Heading', type: 'string' },
    { name: 'calendlySubheading', title: 'Calendly Subheading', type: 'text' },

    // FAQ section
    {
      name: 'faqTabs',
      title: 'FAQ Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'faqTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'faqPair',
              fields: [
                { name: 'question', title: 'Question', type: 'string' },
                { name: 'answer', title: 'Answer', type: 'text' },
              ],
            }],
          },
        ],
      }],
    },

    // Join 500+ stats section
    { name: 'joinHeadingPart1', title: 'Join Heading Part 1', type: 'string' },
    { name: 'joinHeadingAccent', title: 'Join Heading Accent', type: 'string' },
    { name: 'joinHeadingPart2', title: 'Join Heading Part 2', type: 'string' },
    { name: 'joinSubheading', title: 'Join Subheading', type: 'string' },
    {
      name: 'joinStats',
      title: 'Join Stats',
      type: 'array',
      of: [{
        type: 'object',
        name: 'stat',
        fields: [
          { name: 'value', title: 'Value', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    { name: 'joinFootnote', title: 'Join Footnote', type: 'string' },

    // Industry tabs section
    { name: 'industryHeading', title: 'Industry Section Heading', type: 'string' },
    {
      name: 'industryTabs',
      title: 'Industry Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'industryTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'title', title: 'Card Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          {
            name: 'benefits',
            title: 'Benefits',
            type: 'array',
            of: [{
              type: 'object',
              name: 'benefit',
              fields: [
                { name: 'emoji', title: 'Emoji', type: 'string' },
                { name: 'text', title: 'Text', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },

    // Capabilities grid
    { name: 'capabilitiesHeading', title: 'Capabilities Heading', type: 'string' },
    {
      name: 'capabilitiesCards',
      title: 'Capabilities Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'capabilityCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

    // Solution cards (left-right alternating sections)
    {
      name: 'solutionCards',
      title: 'Solution Cards (left-right)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'solutionCard',
        fields: [
          { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
          { name: 'heading', title: 'Heading', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
          { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        ],
      }],
    },

    // Case study cards
    { name: 'caseStudySectionHeading', title: 'Case Study Section Heading', type: 'string' },
    {
      name: 'caseStudyCards',
      title: 'Case Study Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'caseStudyCard',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'personName', title: 'Person Name', type: 'string' },
          { name: 'personRole', title: 'Person Role', type: 'string' },
          { name: 'image', title: 'Image / Logo', type: 'image' },
          { name: 'imageUrl', title: 'Image URL (optional, alternative to upload)', type: 'string' },
          { name: 'videoUrl', title: 'Video URL (optional)', type: 'url' },
        ],
      }],
    },

    // Logo cloud overrides
    { name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' },
    { name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' },

    // Why Product Teams Choose monday.com (Monday PM)
    { name: 'whyProductTeamsHeadingPart1', title: 'Why Product Teams Heading (prefix)', type: 'string' },
    { name: 'whyProductTeamsHeadingAccent', title: 'Why Product Teams Heading (accent)', type: 'string' },
    { name: 'whyProductTeamsSubheading', title: 'Why Product Teams Subheading', type: 'text' },
    {
      name: 'whyProductTeamsCards',
      title: 'Why Product Teams Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'whyProductTeamCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

    // Strategic Approach Tabs (Monday PM)
    { name: 'strategicApproachHeadingPart1', title: 'Strategic Approach Heading (prefix)', type: 'string' },
    { name: 'strategicApproachHeadingAccent', title: 'Strategic Approach Heading (accent)', type: 'string' },
    { name: 'strategicApproachSubheading', title: 'Strategic Approach Subheading', type: 'text' },
    {
      name: 'strategicApproachTabs',
      title: 'Strategic Approach Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'strategicApproachTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'emojiItem',
              fields: [
                { name: 'emoji', title: 'Emoji', type: 'string' },
                { name: 'text', title: 'Text', type: 'text' },
              ],
            }],
          },
        ],
      }],
    },

    // Industry Product Solutions Tabs (Monday PM — dark gradient section)
    { name: 'industryProductSolutionsHeading', title: 'Industry Product Solutions Heading', type: 'string' },
    {
      name: 'industryProductSolutionsTabs',
      title: 'Industry Product Solutions Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'industryProductSolutionTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          {
            name: 'sections',
            title: 'Numbered Sections',
            type: 'array',
            of: [{
              type: 'object',
              name: 'numberedSection',
              fields: [
                { name: 'number', title: 'Number', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                {
                  name: 'bullets',
                  title: 'Bullets',
                  type: 'array',
                  of: [{
                    type: 'object',
                    name: 'emojiBullet',
                    fields: [
                      { name: 'emoji', title: 'Emoji', type: 'string' },
                      { name: 'text', title: 'Text', type: 'text' },
                    ],
                  }],
                },
              ],
            }],
          },
        ],
      }],
    },

    // Product Development Tabs (Monday PM — tabs with image + bullets)
    { name: 'productDevelopmentHeadingPart1', title: 'Product Development Heading (prefix)', type: 'string' },
    { name: 'productDevelopmentHeadingAccent', title: 'Product Development Heading (accent)', type: 'string' },
    { name: 'productDevelopmentHeadingPart2', title: 'Product Development Heading (suffix)', type: 'string' },
    {
      name: 'productDevelopmentTabs',
      title: 'Product Development Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'productDevelopmentTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          {
            name: 'bullets',
            title: 'Bullets',
            type: 'array',
            of: [{
              type: 'object',
              name: 'emojiBullet',
              fields: [
                { name: 'emoji', title: 'Emoji', type: 'string' },
                { name: 'text', title: 'Text', type: 'text' },
              ],
            }],
          },
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'imageAlt', title: 'Image Alt', type: 'string' },
        ],
      }],
    },

    // ── monday Service-specific sections ────────────────────────────
    // Hero image override (alt to heroImage)
    { name: 'serviceHeroImage', title: 'Service Hero Image', type: 'image', options: { hotspot: true } },

    // Comparison/feature tabs eyebrow ("Why monday.com for customer service?")
    { name: 'comparisonEyebrow', title: 'Comparison Eyebrow', type: 'string' },

    // Four image cards section (alternating image/text rows)
    { name: 'fourCardsHeadingPart1', title: 'Four Cards Heading (prefix)', type: 'string' },
    { name: 'fourCardsHeadingAccent', title: 'Four Cards Heading (accent)', type: 'string' },
    { name: 'fourCardsCtaLabel', title: 'Four Cards CTA Label', type: 'string' },
    { name: 'fourCardsCtaUrl', title: 'Four Cards CTA URL', type: 'string' },
    {
      name: 'fourCards',
      title: 'Four Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'fourCard',
        fields: [
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

    // Flat FAQ for service page (alternative to faqTabs)
    { name: 'faqHeading', title: 'FAQ Heading', type: 'string' },
    { name: 'faqEyebrow', title: 'FAQ Eyebrow', type: 'string' },
    {
      name: 'faqFlatItems',
      title: 'FAQ Flat Items',
      type: 'array',
      of: [{
        type: 'object',
        name: 'faqFlatItem',
        fields: [
          { name: 'question', title: 'Question', type: 'string' },
          { name: 'answer', title: 'Answer', type: 'text' },
        ],
      }],
    },

    // Strategic columns (3-column emoji bullets layout)
    { name: 'strategicColumnsHeadingPart1', title: 'Strategic Columns Heading (prefix)', type: 'string' },
    { name: 'strategicColumnsHeadingAccent', title: 'Strategic Columns Heading (accent)', type: 'string' },
    { name: 'strategicColumnsSubheading', title: 'Strategic Columns Subheading', type: 'text' },
    {
      name: 'strategicColumns',
      title: 'Strategic Columns',
      type: 'array',
      of: [{
        type: 'object',
        name: 'strategicColumn',
        fields: [
          { name: 'title', title: 'Column Title', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'emojiItem',
              fields: [
                { name: 'emoji', title: 'Emoji', type: 'string' },
                { name: 'text', title: 'Text', type: 'text' },
              ],
            }],
          },
        ],
      }],
    },

    // Feature tabs intro copy (above tab pills)
    { name: 'featureTabsIntroSubheading', title: 'Feature Tabs Intro Subheading', type: 'text' },

    // ── Cabinetry / industry-vertical sections ────────────────────────
    // Trusted-by caption (under hero)
    { name: 'trustedByCaption', title: 'Trusted-By Caption', type: 'string' },

    // Key Features + Services dual-column section
    { name: 'keyFeaturesHeadingPart1', title: 'Key Features Heading (prefix)', type: 'string' },
    { name: 'keyFeaturesHeadingAccent', title: 'Key Features Heading (accent)', type: 'string' },
    {
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      of: [{
        type: 'object',
        name: 'keyFeatureItem',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
        ],
      }],
    },
    { name: 'servicesListHeadingPart1', title: 'Services List Heading (prefix)', type: 'string' },
    { name: 'servicesListHeadingAccent', title: 'Services List Heading (accent)', type: 'string' },
    {
      name: 'servicesListItems',
      title: 'Services List Items',
      type: 'array',
      of: [{ type: 'string' }],
    },

    // Inline testimonials (3-up testimonial cards on dark gradient)
    {
      name: 'inlineTestimonials',
      title: 'Inline Testimonials',
      type: 'array',
      of: [{
        type: 'object',
        name: 'inlineTestimonial',
        fields: [
          { name: 'quote', title: 'Quote', type: 'text' },
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'role', title: 'Role', type: 'string' },
          { name: 'company', title: 'Company', type: 'string' },
          { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
        ],
      }],
    },

    // Returns banner (purple gradient stats + dual CTA)
    { name: 'returnsBannerHeading', title: 'Returns Banner Heading', type: 'string' },
    { name: 'returnsBannerSubheading', title: 'Returns Banner Subheading', type: 'text' },
    { name: 'returnsBannerPrimaryLabel', title: 'Returns Banner Primary CTA Label', type: 'string' },
    { name: 'returnsBannerPrimaryUrl', title: 'Returns Banner Primary CTA URL', type: 'string' },
    { name: 'returnsBannerSecondaryLabel', title: 'Returns Banner Secondary CTA Label', type: 'string' },
    { name: 'returnsBannerSecondaryUrl', title: 'Returns Banner Secondary CTA URL', type: 'string' },

    // Before/After comparison (separate from comparisonTabs)
    {
      name: 'beforeAfterTabs',
      title: 'Before/After Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'beforeAfterTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'beforeAfterItem',
              fields: [
                { name: 'number', title: 'Number/Emoji', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
              ],
            }],
          },
        ],
      }],
    },

    // Hero image URL fallback (if upload not used)
    { name: 'heroImageUrl', title: 'Hero Image URL (fallback)', type: 'string' },

    // ── Bottom feature-cards section (finance et al) ─────────────────
    { name: 'bottomFeatureSectionHeadingPart1', title: 'Bottom Feature Section Heading (prefix)', type: 'string' },
    { name: 'bottomFeatureSectionHeadingAccent', title: 'Bottom Feature Section Heading (accent)', type: 'string' },
    { name: 'bottomVideoUrl', title: 'Bottom Video URL', type: 'string' },
    { name: 'bottomVideoTitle', title: 'Bottom Video Title', type: 'string' },

    // ── Schemaless fields the frontend already reads via GROQ ────────
    { name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string' },
    { name: 'hideHeroSubheading', title: 'Hide Hero Subheading', type: 'boolean', initialValue: false },
    { name: 'heroLocalVideoSrc', title: 'Hero Local Video Src', type: 'string' },
    { name: 'heroVideoUrl', title: 'Hero Video URL', type: 'url' },
    { name: 'heroVideoTitle', title: 'Hero Video Title', type: 'string' },
    {
      name: 'heroPartnerBadges',
      title: 'Hero Partner Badges',
      type: 'array',
      of: [{
        type: 'object',
        name: 'partnerBadge',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'image', title: 'Image', type: 'image' },
          { name: 'width', title: 'Width', type: 'number' },
          { name: 'height', title: 'Height', type: 'number' },
        ],
      }],
    },
    { name: 'comparisonTheme', title: 'Comparison Section Theme', type: 'string',
      options: { list: [{ title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' }] } },
    { name: 'comparisonWithPurpleCircle', title: 'Comparison: With Purple Circle', type: 'boolean', initialValue: false },
    { name: 'hideFaqSection', title: 'Hide FAQ Section', type: 'boolean', initialValue: false },
    { name: 'beforeAfterHeading', title: 'Before/After Section Heading', type: 'string' },

    // HR-specific: life-cycle stages + reasons it's a fit
    {
      name: 'lifecycleStages',
      title: 'Lifecycle Stages',
      type: 'array',
      of: [{
        type: 'object',
        name: 'lifecycleStage',
        fields: [
          { name: 'n', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
        ],
      }],
    },
    {
      name: 'fitReasons',
      title: 'Why It Fits (cards)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'fitReason',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
        ],
      }],
    },

    // Section visibility toggles
    { name: 'hideDiscoverSection', title: 'Hide Discover CTA Section', type: 'boolean', initialValue: false },
    { name: 'hideJoinStatsSection', title: 'Hide Join Stats Section', type: 'boolean', initialValue: false },
    { name: 'hideTestimonialBanner', title: 'Hide Testimonial CTA Banner', type: 'boolean', initialValue: false },
    { name: 'hideTestimonialsSection', title: 'Hide Testimonials Grid', type: 'boolean', initialValue: false },
  ],
}

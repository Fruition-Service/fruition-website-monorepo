import { pageBodyField, LEGACY_BODY_DESCRIPTION } from './objects/pageBody'

export default {
  name: 'partnershipPage',
  title: 'Partnership Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string' },
    { name: 'heroSubheading', title: 'Hero Subheading', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'heroVideoUrl', title: 'Hero Video URL (YouTube, shown below logo cloud)', type: 'url' },
    { name: 'heroVideoTitle', title: 'Hero Video Title', type: 'string' },
    { name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' },
    { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
    { name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' },
    { name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'string' },
    pageBodyField(LEGACY_BODY_DESCRIPTION),
    { name: 'partnerName', title: 'Partner Name', type: 'string' },
    { name: 'partnerLogo', title: 'Partner Logo', type: 'image' },

    // Comparison / tabbed section
    { name: 'comparisonHeading', title: 'Comparison Section Heading', type: 'string' },
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
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'comparisonItem',
              fields: [
                { name: 'number', title: 'Number', type: 'string' },
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
    { name: 'capabilitiesEyebrow', title: 'Capabilities Eyebrow', type: 'string' },
    { name: 'capabilitiesHeading', title: 'Capabilities Heading', type: 'string' },
    { name: 'capabilitiesHeadingAccent', title: 'Capabilities Heading Accent', type: 'string' },
    { name: 'capabilitiesSubheading', title: 'Capabilities Subheading', type: 'text' },
    { name: 'capabilitiesCtaLabel', title: 'Capabilities CTA Label', type: 'string' },
    { name: 'capabilitiesCtaUrl', title: 'Capabilities CTA URL', type: 'string' },
    { name: 'capabilitiesCtaSecondaryLabel', title: 'Capabilities Secondary CTA Label', type: 'string' },
    { name: 'capabilitiesCtaSecondaryUrl', title: 'Capabilities Secondary CTA URL', type: 'string' },
    {
      name: 'capabilitiesTheme',
      title: 'Capabilities Theme',
      type: 'string',
      options: { list: [ { title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' } ] },
      initialValue: 'light',
    },
    {
      name: 'capabilitiesColumns',
      title: 'Capabilities Columns',
      type: 'number',
      options: { list: [ { title: 'Auto', value: 0 }, { title: '2 columns', value: 2 }, { title: '3 columns', value: 3 } ] },
    },
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

    // Services card grid (e.g. "Our Comprehensive X Services" as cards)
    { name: 'servicesHeading', title: 'Services Heading', type: 'string' },
    { name: 'servicesHeadingAccent', title: 'Services Heading Accent', type: 'string' },
    { name: 'servicesSubheading', title: 'Services Subheading', type: 'text' },
    {
      name: 'servicesTheme',
      title: 'Services Theme',
      type: 'string',
      options: { list: [ { title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' } ] },
      initialValue: 'dark',
    },
    {
      name: 'servicesCards',
      title: 'Services Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'serviceCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
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

    // Feature numbered list (e.g. "The Everything App for Work")
    { name: 'featureListHeading', title: 'Feature List Heading', type: 'string' },
    { name: 'featureListHeadingAccent', title: 'Feature List Heading Accent', type: 'string' },
    { name: 'featureListSubheading', title: 'Feature List Subheading', type: 'text' },
    {
      name: 'featureListTheme',
      title: 'Feature List Theme',
      type: 'string',
      options: { list: [ { title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' } ] },
      initialValue: 'dark',
    },
    {
      name: 'featureListColumns',
      title: 'Feature List Columns',
      type: 'number',
      options: { list: [ { title: '2 columns', value: 2 }, { title: '3 columns', value: 3 } ] },
      initialValue: 2,
    },
    {
      name: 'featureListItems',
      title: 'Feature List Items',
      type: 'array',
      of: [{
        type: 'object',
        name: 'featureItem',
        fields: [
          { name: 'number', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    },

    // Comparison section theme
    {
      name: 'comparisonTheme',
      title: 'Comparison Theme',
      type: 'string',
      options: { list: [ { title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' } ] },
      initialValue: 'light',
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

    // Bottom video embed
    { name: 'bottomVideoUrl', title: 'Bottom Video URL', type: 'url' },
    { name: 'bottomVideoTitle', title: 'Bottom Video Title', type: 'string' },

    // Logo cloud overrides
    { name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' },
    { name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' },

    // Per-page hardcoded data migrated from Content.tsx files
    {
      name: 'provenStats',
      title: 'Proven Stats (emoji / value / body)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'provenStat',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'value', title: 'Value', type: 'string' },
          { name: 'body', title: 'Body Text', type: 'text' },
        ],
      }],
    },

    // FAQ section heading (was hardcoded in *Content.tsx)
    { name: 'faqHeading', title: 'FAQ Heading', type: 'string' },
    { name: 'comparisonHeadingAccent', title: 'Comparison Heading (accent)', type: 'string' },

    // ── monday-consulting-partner specific ───────────────────────────
    {
      name: 'whyFruition',
      title: 'Why Fruition (string list)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'partnerTestimonials',
      title: 'Partner Testimonials',
      type: 'array',
      of: [{
        type: 'object',
        name: 'partnerTestimonial',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'role', title: 'Role', type: 'string' },
          { name: 'quote', title: 'Quote', type: 'text' },
          { name: 'photo', title: 'Photo URL (or /path)', type: 'string' },
        ],
      }],
    },
    {
      name: 'implementationServices',
      title: 'Implementation Services',
      type: 'array',
      of: [{
        type: 'object',
        name: 'implementationService',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
        ],
      }],
    },
    {
      name: 'industrySolutions',
      title: 'Industry Solutions (emoji + label)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'industrySolution',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    {
      name: 'countries',
      title: 'Countries (flag + label)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'country',
        fields: [
          { name: 'emoji', title: 'Flag Emoji', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    {
      name: 'fruitionAdvantages',
      title: 'Fruition Advantages (string list)',
      type: 'array',
      of: [{ type: 'string' }],
    },

    // ── certified-clickup-partner specific ───────────────────────────
    {
      name: 'everythingAppCards',
      title: 'Everything App Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'everythingAppCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
        ],
      }],
    },
    {
      name: 'everythingAppFeatures',
      title: 'Everything App Features',
      type: 'array',
      of: [{
        type: 'object',
        name: 'everythingAppFeature',
        fields: [
          { name: 'number', title: 'Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
        ],
      }],
    },
    {
      name: 'industryTabsPartnership',
      title: 'Industry Tabs (partnership-page variant)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'industryTabPartnership',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{
              type: 'object',
              name: 'industryFeature',
              fields: [
                { name: 'emoji', title: 'Emoji', type: 'string' },
                { name: 'text', title: 'Text', type: 'string' },
              ],
            }],
          },
        ],
      }],
    },
    {
      name: 'servicesTabs',
      title: 'Services Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'serviceTab',
        fields: [
          { name: 'key', title: 'Key', type: 'string' },
          { name: 'label', title: 'Tab Label', type: 'string' },
          { name: 'heading', title: 'Tab Heading', type: 'string' },
          {
            name: 'groups',
            title: 'Groups',
            type: 'array',
            of: [{
              type: 'object',
              name: 'serviceGroup',
              fields: [
                { name: 'number', title: 'Number', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                {
                  name: 'bullets',
                  title: 'Bullets',
                  type: 'array',
                  of: [{
                    type: 'object',
                    name: 'serviceBullet',
                    fields: [
                      { name: 'emoji', title: 'Emoji', type: 'string' },
                      { name: 'text', title: 'Text', type: 'string' },
                    ],
                  }],
                },
              ],
            }],
          },
        ],
      }],
    },

    // ── certified-atlassian-partner specific ─────────────────────────
    {
      name: 'atlassianTabs',
      title: 'Atlassian Tabs (reuses comparisonTab shape)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'atlassianTab',
        fields: [
          { name: 'label', title: 'Tab Label', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'atlassianItem',
              fields: [
                { name: 'number', title: 'Number', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
              ],
            }],
          },
        ],
      }],
    },
    {
      name: 'serviceCards',
      title: 'Service Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'atlassianServiceCard',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          {
            name: 'bullets',
            title: 'Bullets',
            type: 'array',
            of: [{ type: 'string' }],
          },
        ],
      }],
    },
    {
      name: 'expertCards',
      title: 'Expert Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'atlassianExpertCard',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'image', title: 'Image URL (or /path)', type: 'string' },
        ],
      }],
    },

    // ── aircall-partner specific ─────────────────────────────────────
    {
      name: 'aircallTabs',
      title: 'Aircall Tabs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'aircallTab',
        fields: [
          { name: 'key', title: 'Key', type: 'string' },
          { name: 'label', title: 'Tab Label', type: 'string' },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [{
              type: 'object',
              name: 'aircallTabItem',
              fields: [
                { name: 'number', title: 'Number', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
                { name: 'bullets', title: 'Bullets', type: 'array', of: [{ type: 'string' }] },
              ],
            }],
          },
        ],
      }],
    },
    {
      name: 'aircallFeatures',
      title: 'Aircall Features (alternating image rows)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'aircallFeature',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'body', title: 'Body', type: 'text' },
          { name: 'image', title: 'Image path (e.g. /images/foo.avif)', type: 'string' },
          { name: 'imageRight', title: 'Image on Right', type: 'boolean' },
        ],
      }],
    },

    // ── Join stats CTA overrides ─────────────────────────────────────
    { name: 'joinCtaLabel', title: 'Join CTA Label', type: 'string' },
    { name: 'joinCtaUrl', title: 'Join CTA URL', type: 'string' },

    // CRO action-item sections
    { name: 'croSections', title: 'CRO Sections', type: 'croSections' },
  ],
}

import { pageBodyField } from './objects/pageBody'

const PAGE_BODY_DESCRIPTION =
  'Rendered as the long-form copy on policy pages (e.g. /data-privacy). On pages built from the section fields below it is unrendered Wix-migration content — kept so the original copy is not lost; do not use "Remove the block" on it.'

export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'croSections', title: 'CRO Sections', type: 'croSections' },
    // Leadership signature note (about-us) — renders only when a note is set.
    { name: 'leadershipNote', title: 'Leadership Note (signed message)', type: 'text' },
    { name: 'leadershipSignatureName', title: 'Signature Name', type: 'string' },
    { name: 'leadershipSignatureTitle', title: 'Signature Title', type: 'string' },
    { name: 'heroEyebrow', title: 'Hero Eyebrow (small label above heading, e.g. "Careers")', type: 'string' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string' },
    { name: 'heroHeadingAccent', title: 'Hero Heading Accent (rendered purple inside heading)', type: 'string' },
    { name: 'heroHeadingPart1', title: 'Hero Heading Part 1 (before accent)', type: 'string' },
    { name: 'heroHeadingPart2', title: 'Hero Heading Part 2 (after accent)', type: 'string' },
    { name: 'heroPartnerBadgesLabel', title: 'Hero Partner Badges Label (e.g. "Certified partners")', type: 'string' },
    { name: 'heroCalloutBadgeLabel', title: 'Hero Callout Badge Label (small uppercase label)', type: 'string' },
    { name: 'heroCalloutBadgeText', title: 'Hero Callout Badge Text', type: 'string' },
    { name: 'heroCalloutOfficesText', title: 'Hero Callout Offices Text (e.g. "5 offices · 5 timezones")', type: 'string' },
    { name: 'heroSubheading', title: 'Hero Subheading', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    {
      name: 'heroPartnerBadges',
      title: 'Hero Partner Badges (overrides global badges in hero)',
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
    { name: 'heroVideoUrl', title: 'Hero Video URL (YouTube, shown below logo cloud)', type: 'url' },
    { name: 'heroVideoTitle', title: 'Hero Video Title', type: 'string' },
    { name: 'heroBody', title: 'Hero Body Text (paragraph below subheading)', type: 'text' },
    { name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string' },
    { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
    { name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string' },
    { name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'string' },
    {
      name: 'heroStats',
      title: 'Hero Stats Row',
      type: 'array',
      of: [{
        type: 'object',
        name: 'heroStat',
        fields: [
          { name: 'value', title: 'Value (e.g. "500+")', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    { name: 'heroLocalVideoSrc', title: 'Hero Local Video Path (e.g. /videos/hero.mp4)', type: 'string' },
    pageBodyField(PAGE_BODY_DESCRIPTION),

    // Capabilities / Benefits grid (e.g. "Why Join Fruition")
    { name: 'capabilitiesEyebrow', title: 'Capabilities Eyebrow (e.g. "BENEFITS")', type: 'string' },
    { name: 'capabilitiesCtaLabel', title: 'Capabilities CTA Label', type: 'string' },
    { name: 'capabilitiesCtaUrl', title: 'Capabilities CTA URL', type: 'string' },

    // Secondary capabilities grid (e.g. careers "What We're Looking For")
    { name: 'secondaryCapabilitiesEyebrow', title: 'Secondary Capabilities Eyebrow', type: 'string' },
    { name: 'secondaryCapabilitiesHeading', title: 'Secondary Capabilities Heading', type: 'string' },
    { name: 'secondaryCapabilitiesHeadingAccent', title: 'Secondary Capabilities Heading Accent', type: 'string' },
    { name: 'secondaryCapabilitiesSubheading', title: 'Secondary Capabilities Subheading', type: 'text' },
    {
      name: 'secondaryCapabilitiesCards',
      title: 'Secondary Capabilities Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'secondaryCapabilityCard',
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
    {
      name: 'secondaryCapabilitiesColumns',
      title: 'Secondary Capabilities Columns',
      type: 'number',
      options: { list: [2, 3] },
    },
    { name: 'secondaryCapabilitiesCtaLabel', title: 'Secondary Capabilities CTA Label', type: 'string' },
    { name: 'secondaryCapabilitiesCtaUrl', title: 'Secondary Capabilities CTA URL', type: 'string' },

    // Partner Ecosystem section (e.g. careers "Built on trusted partners")
    { name: 'partnerEcosystemEyebrow', title: 'Partner Ecosystem Eyebrow', type: 'string' },
    { name: 'partnerEcosystemHeading', title: 'Partner Ecosystem Heading', type: 'string' },
    { name: 'partnerEcosystemHeadingAccent', title: 'Partner Ecosystem Heading Accent', type: 'string' },
    { name: 'partnerEcosystemSubheading', title: 'Partner Ecosystem Subheading', type: 'text' },
    {
      name: 'partnerEcosystemCards',
      title: 'Partner Ecosystem Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'partnerEcosystemCard',
        fields: [
          { name: 'name', title: 'Partner Name', type: 'string' },
          { name: 'tier', title: 'Tier (e.g. "Platinum Partner")', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'logo', title: 'Logo Image', type: 'image' },
          { name: 'tint', title: 'Card Background Tint (hex e.g. #FFF2E6)', type: 'string' },
        ],
      }],
    },

    // Remote team / global offices section (e.g. careers page "Work From Anywhere")
    { name: 'remoteTeamEyebrow', title: 'Remote Team Eyebrow (e.g. "🌍 FULLY REMOTE")', type: 'string' },
    { name: 'remoteTeamHeading', title: 'Remote Team Heading', type: 'string' },
    { name: 'remoteTeamHeadingAccent', title: 'Remote Team Heading Accent', type: 'string' },
    { name: 'remoteTeamSubheading', title: 'Remote Team Subheading', type: 'text' },
    {
      name: 'officeLocations',
      title: 'Office Locations',
      type: 'array',
      of: [{
        type: 'object',
        name: 'officeLocation',
        fields: [
          { name: 'flag', title: 'Flag Emoji', type: 'string' },
          { name: 'city', title: 'City', type: 'string' },
          { name: 'region', title: 'Region / Label', type: 'string' },
          { name: 'address', title: 'Address', type: 'text' },
        ],
      }],
    },
    {
      name: 'remoteFeatures',
      title: 'Remote Feature Chips',
      type: 'array',
      of: [{
        type: 'object',
        name: 'remoteFeature',
        fields: [
          { name: 'emoji', title: 'Emoji', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
      }],
    },
    { name: 'remoteTeamCtaLabel', title: 'Remote Team CTA Label', type: 'string' },
    { name: 'remoteTeamCtaUrl', title: 'Remote Team CTA URL', type: 'string' },

    // Application form embed (e.g. monday.com WorkForms)
    { name: 'applicationFormHeading', title: 'Application Form Heading', type: 'string' },
    { name: 'applicationFormEmbedUrl', title: 'Application Form Embed URL (forms.monday.com/...)', type: 'url' },

    // Downloadable documents (e.g. Terms & Conditions PDFs)
    {
      name: 'documents',
      title: 'Downloadable Documents',
      type: 'array',
      of: [{
        type: 'object',
        name: 'downloadableDoc',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'file', title: 'File (PDF)', type: 'file' },
        ],
      }],
    },

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

    // Story section (about-us)
    { name: 'storyEyebrow', title: 'Story Eyebrow (e.g. "Our story")', type: 'string' },
    { name: 'storyHeading', title: 'Story Heading', type: 'string' },
    { name: 'storyHeadingAccent', title: 'Story Heading Accent (purple)', type: 'string' },
    { name: 'storyCardEyebrowPrefix', title: 'Story Card Eyebrow Prefix (e.g. "Why Fruition")', type: 'string' },

    // Methodology section
    { name: 'methodologyEyebrow', title: 'Methodology Eyebrow (e.g. "Methodology")', type: 'string' },
    { name: 'methodologyStepLabel', title: 'Methodology Step Label (e.g. "STEP")', type: 'string' },
    { name: 'methodologyHeading', title: 'Methodology Heading', type: 'string' },

    // Approach tabs section (about-us)
    { name: 'approachEyebrow', title: 'Approach Eyebrow (e.g. "Proven Approach")', type: 'string' },
    { name: 'approachHeading', title: 'Approach Heading', type: 'string' },
    { name: 'approachHeadingAccent', title: 'Approach Heading Accent (purple)', type: 'string' },

    // Global presence section (about-us)
    { name: 'globalPresenceEyebrow', title: 'Global Presence Eyebrow', type: 'string' },
    { name: 'globalPresenceHeading', title: 'Global Presence Heading', type: 'string' },
    { name: 'globalPresenceHeadingAccent', title: 'Global Presence Heading Accent (purple)', type: 'string' },
    { name: 'globalPresenceBody', title: 'Global Presence Body', type: 'text' },
    {
      name: 'offices',
      title: 'Offices (about-us)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'officeEntry',
        fields: [
          { name: 'city', title: 'City', type: 'string' },
          { name: 'country', title: 'Country', type: 'string' },
          { name: 'flag', title: 'Flag Emoji', type: 'string' },
          { name: 'note', title: 'Note (e.g. "Head office")', type: 'string' },
        ],
      }],
    },

    // Partner stack section (about-us)
    { name: 'partnerStackEyebrow', title: 'Partner Stack Eyebrow (e.g. "Our partner ecosystem")', type: 'string' },

    // Closing CTA section (about-us)
    { name: 'closingCtaHeading', title: 'Closing CTA Heading', type: 'string' },
    { name: 'closingCtaBody', title: 'Closing CTA Body', type: 'text' },
    { name: 'closingCtaPrimaryLabel', title: 'Closing CTA Primary Label', type: 'string' },
    { name: 'closingCtaSecondaryLabel', title: 'Closing CTA Secondary Label', type: 'string' },
    { name: 'closingCtaSecondaryUrl', title: 'Closing CTA Secondary URL', type: 'string' },
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

    // Logo cloud overrides
    { name: 'logoCloudHeadingPart1', title: 'Logo Cloud Heading (prefix)', type: 'string' },
    { name: 'logoCloudHeadingAccent', title: 'Logo Cloud Heading (accent)', type: 'string' },
    { name: 'logoCloudDescription', title: 'Logo Cloud Description (below heading)', type: 'text' },

    // Long-form text content sections (e.g. About Us scalability narrative)
    {
      name: 'textContentSections',
      title: 'Text Content Sections',
      type: 'array',
      of: [{
        type: 'object',
        name: 'textContentSection',
        fields: [
          { name: 'heading', title: 'Heading', type: 'string' },
          { name: 'headingAccent', title: 'Heading Accent (purple)', type: 'string' },
          { name: 'body', title: 'Body (use blank lines for paragraphs)', type: 'text', rows: 12 },
          {
            name: 'theme',
            title: 'Background',
            type: 'string',
            options: { list: [{ title: 'White', value: 'light' }, { title: 'Tint', value: 'tint' }] },
          },
        ],
      }],
    },

    // Case Study Cards (for listing pages like /customer-testimonials)
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
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'product', title: 'Product / Solution (e.g. "monday CRM")', type: 'string' },
          { name: 'industry', title: 'Industry (e.g. "Construction") — enables the industry filter', type: 'string' },
          { name: 'services', title: 'Services Description', type: 'text' },
          { name: 'timeline', title: 'Timeline (e.g. "4 weeks")', type: 'string' },
          { name: 'verifiedSource', title: 'Verified Source (e.g. "G2 Crowd", "Clutch.co")', type: 'string' },
        ],
      }],
    },

    // Testimonials section
    { name: 'testimonialsHeading', title: 'Testimonials Heading', type: 'string' },

    // Discover CTA section overrides
    { name: 'discoverHeading', title: 'Discover CTA Heading', type: 'string' },
    { name: 'discoverPrimaryCtaLabel', title: 'Discover Primary CTA Label', type: 'string' },
    { name: 'discoverPrimaryCtaUrl', title: 'Discover Primary CTA URL', type: 'string' },
    { name: 'discoverSecondaryCtaLabel', title: 'Discover Secondary CTA Label', type: 'string' },
    { name: 'discoverSecondaryCtaUrl', title: 'Discover Secondary CTA URL', type: 'string' },

    // Testimonial CTA Banner (bottom) overrides
    { name: 'testimonialBannerHeadingPart1', title: 'Testimonial Banner Heading Part 1', type: 'string' },
    { name: 'testimonialBannerHeadingAccent', title: 'Testimonial Banner Heading Accent', type: 'string' },
    { name: 'testimonialBannerHeadingPart2', title: 'Testimonial Banner Heading Part 2', type: 'string' },
    { name: 'testimonialBannerPrimaryCtaLabel', title: 'Testimonial Banner Primary CTA Label', type: 'string' },
    { name: 'testimonialBannerPrimaryCtaUrl', title: 'Testimonial Banner Primary CTA URL', type: 'string' },
    { name: 'testimonialBannerSecondaryCtaLabel', title: 'Testimonial Banner Secondary CTA Label', type: 'string' },
    { name: 'testimonialBannerSecondaryCtaUrl', title: 'Testimonial Banner Secondary CTA URL', type: 'string' },

    // Section visibility toggles
    { name: 'hideDiscoverSection', title: 'Hide Discover CTA Section', type: 'boolean', initialValue: false },
    { name: 'hideJoinStatsSection', title: 'Hide Join Stats Section', type: 'boolean', initialValue: false },
    { name: 'hideTestimonialBanner', title: 'Hide Testimonial CTA Banner', type: 'boolean', initialValue: false },
    { name: 'hideSecurityBadgeSection', title: 'Hide Security Badge Section', type: 'boolean', initialValue: false },
    { name: 'hideTestimonialsSection', title: 'Hide Testimonials Grid', type: 'boolean', initialValue: false },
    { name: 'hideFaqSection', title: 'Hide FAQ Section', type: 'boolean', initialValue: false },
    { name: 'hideCapabilitiesSection', title: 'Hide Capabilities Section', type: 'boolean', initialValue: false },
    { name: 'hideCaseStudyCardsSection', title: 'Hide Case Study Cards', type: 'boolean', initialValue: false },
    { name: 'hideSolutionCardsSection', title: 'Hide Solution Cards', type: 'boolean', initialValue: false },
    { name: 'hideHeroSubheading', title: 'Hide Hero Subheading', type: 'boolean', initialValue: false },

    // Team-region filter chips on /fruition-team
    {
      name: 'teamRegions',
      title: 'Team Regions (filter chips)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'teamRegion',
        fields: [
          { name: 'code', title: 'Region Code', type: 'string' },
          { name: 'label', title: 'Display Label', type: 'string' },
          { name: 'emoji', title: 'Emoji', type: 'string' },
        ],
      }],
    },

    // Hero description blocks (e.g. /fruition-team intro paragraphs under the CTA)
    {
      name: 'heroDescriptionBlocks',
      title: 'Hero Description Blocks (paragraphs under hero CTA)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'heroDescriptionBlock',
        fields: [
          {
            name: 'style',
            title: 'Style',
            type: 'string',
            options: { list: [{ title: 'Paragraph', value: 'paragraph' }, { title: 'Bold', value: 'bold' }] },
          },
          { name: 'text', title: 'Text', type: 'text' },
        ],
      }],
    },

    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'About', value: 'about' },
          { title: 'Careers', value: 'careers' },
          { title: 'Blog Listing', value: 'blog-listing' },
          { title: 'Thank You', value: 'thank-you' },
          { title: 'Terms', value: 'terms' },
          { title: 'Privacy', value: 'privacy' },
        ],
      },
    },
  ],
}

/**
 * Populate makePartnersPage singleton with content previously hardcoded in
 * MakePartnersContent.tsx (FALLBACK_COMPARISON_TABS, FALLBACK_SHOWCASE_CARDS,
 * FALLBACK_JOIN_STATS, FEATURE_LIST_LEFT/RIGHT, announcement, banner CTAs).
 *
 *   npx tsx scripts/sanity-migrate/populate-make-partners.ts
 */
import { writeClient, uploadLocalImage, uploadImageFromUrl, withKeys } from './lib'

const COMPARISON_TABS = [
  {
    label: 'Transform Your Business',
    items: [
      { number: '01', title: "As a Gold Partner, we leverage make's features to transform your operations:", bullets: [
        { emoji: '🔗', text: 'Unlimited Integration Possibilities: Connect seamlessly with 1000+ apps and services' },
        { emoji: '⚡', text: 'Real-Time Execution: Experience immediate process automation that responds instantly to triggers' },
        { emoji: '🔒', text: 'Enterprise-Grade Security: Trust in our SOC 2 Type II certified platform for maximum protection' },
        { emoji: '📈', text: 'Scalable Architecture: Effortlessly handle millions of operations as your business grows' },
      ]},
      { number: '02', title: 'Streamline operations and eliminate workflow friction:', bullets: [
        { emoji: '🤖', text: "Automate repetitive tasks that drain your team's productivity and consume valuable working hours" },
        { emoji: '✋', text: 'Reduce manual data entry errors while saving time and improving overall operational accuracy' },
        { emoji: '🎯', text: 'Enhance process accuracy with consistent, reliable automation that delivers predictable results every time' },
        { emoji: '🚀', text: 'Accelerate workflow execution across all departments to boost team performance and output' },
      ]},
      { number: '03', title: 'Improve efficiency and maximise your operational potential:', bullets: [
        { emoji: '🔄', text: 'Connect disparate systems into one cohesive ecosystem that works harmoniously across platforms' },
        { emoji: '📊', text: 'Synchronise data in real-time across all platforms to ensure information consistency and accessibility' },
        { emoji: '🚧', text: 'Eliminate process bottlenecks that slow down your business and create operational inefficiencies' },
        { emoji: '📏', text: 'Scale operations seamlessly without adding complexity or requiring additional manual oversight' },
      ]},
      { number: '04', title: 'Drive innovation and stay ahead of the competition:', bullets: [
        { emoji: '🛠️', text: 'Create custom automation solutions tailored to your unique business needs and specific requirements' },
        { emoji: '🔧', text: 'Implement advanced integrations that unlock new possibilities and enhance your existing systems' },
        { emoji: '🧠', text: 'Deploy intelligent workflows that adapt to your business requirements and evolving operational demands' },
        { emoji: '⚙️', text: 'Optimise business processes for maximum efficiency, growth, and long-term competitive advantage' },
      ]},
    ],
  },
  {
    label: 'Why Partner with Fruition',
    items: [
      { number: '01', title: 'Our Gold Partner status demonstrates our expertise in:', bullets: [
        { emoji: '🔧', text: 'Advanced automation capabilities to handle complex business requirements' },
        { emoji: '🎯', text: 'Complex multi-step workflow design for sophisticated process automation' },
        { emoji: '🔄', text: 'Real-time data synchronisation across all your connected systems' },
        { emoji: '🛡️', text: 'Error handling and monitoring systems for reliable operation' },
        { emoji: '🔗', text: 'Custom API integration development tailored to your needs' },
      ]},
      { number: '02', title: 'Enterprise integration solutions that connect your entire business ecosystem:', bullets: [
        { emoji: '📊', text: 'Cross-platform data management for seamless information flow' },
        { emoji: '🏢', text: 'Legacy system connectivity to modernise existing infrastructure' },
        { emoji: '☁️', text: 'Cloud service orchestration for optimal performance' },
        { emoji: '🔒', text: 'Secure data transfer protocols ensuring complete protection' },
        { emoji: '⚙️', text: 'Scalable architecture design that grows with your business' },
      ]},
      { number: '03', title: 'Professional services that guide you from concept to completion:', bullets: [
        { emoji: '👨‍💼', text: 'Expert implementation guidance throughout your automation journey' },
        { emoji: '🛠️', text: 'Custom scenario development aligned with your business goals' },
        { emoji: '🎓', text: 'Team training and enablement for long-term success' },
        { emoji: '🤝', text: 'Ongoing support and optimisation for continuous improvement' },
        { emoji: '📈', text: 'Strategic consulting to maximize your automation ROI' },
      ]},
      { number: '04', title: 'Drive Innovation and transform your operational capabilities:', bullets: [
        { emoji: '💡', text: 'Create custom automation solutions that solve unique challenges' },
        { emoji: '🔧', text: 'Implement advanced integrations for enhanced functionality' },
        { emoji: '🧠', text: 'Deploy intelligent workflows that adapt to changing needs' },
        { emoji: '⚙️', text: 'Optimise business processes for maximum efficiency' },
        { emoji: '🚀', text: 'Future-proof your operations with cutting-edge technology' },
      ]},
      { number: '05', title: 'Partner-Led Implementation Advantages that ensure your success:', bullets: [
        { emoji: '🎯', text: 'Expert scenario development from certified make specialists' },
        { emoji: '📋', text: 'Best practices implementation based on proven methodologies' },
        { emoji: '⚡', text: 'Performance optimisation for maximum speed and reliability' },
        { emoji: '🛟', text: 'Comprehensive support throughout implementation and beyond' },
        { emoji: '🔮', text: 'Future-proof solutions designed to evolve with your business' },
      ]},
    ],
  },
]

const SHOWCASE_CARDS = [
  { heading: 'Automation you can see, flex, and scale', body: "Realise your business's full potential with make's intuitive no-code development platform.", imageRight: true, imageUrl: 'https://static.wixstatic.com/media/a280a5_5c429db4ef644bf8b4b2ce055d306baaf000.png' },
  { heading: 'Keep operations running smoothly', body: 'Run operations smoothly, even across siloed systems, by connecting your teams and the key project management and data synchronisation tools that your business relies on.', imageRight: false, imageUrl: 'https://static.wixstatic.com/media/a280a5_c0436169100c4a09b52d59a8e2549190~mv2.png' },
  { heading: 'Solve finance complexities', body: 'Integrate multiple apps and systems into one platform and automate time-consuming processes such as quote-to-cash and procure-to-pay.', imageRight: true, imageUrl: 'https://static.wixstatic.com/media/39b8ef_6bfa6513a044479cbdd3279c452dcbf0~mv2.png' },
]

const FEATURE_LIST_LEFT = [
  { emoji: '📋', text: 'Automation strategy development' },
  { emoji: '🎨', text: 'Workflow design and implementation' },
  { emoji: '🔗', text: 'System integration and testing' },
  { emoji: '🔧', text: 'Ongoing optimisation and support' },
]

const FEATURE_LIST_RIGHT = [
  { emoji: '⚙️', text: 'Advanced Workflow Design' },
  { emoji: '🔌', text: 'System Integration Development' },
  { emoji: '🛠️', text: 'Custom Automation Solutions' },
  { emoji: '📈', text: 'Enterprise Scaling Support' },
]

const JOIN_STATS = [
  { value: '10+', label: 'Years Experience' },
  { value: '1050+', label: 'Projects Completed' },
  { value: '290', label: 'Satisfied Clients' },
]

async function main() {
  const id = 'makePartnersPage'

  console.log('Uploading hero + announcement + showcase images…')
  const heroImage = await uploadLocalImage('/images/make-partners-hero.png')
  const announcementImage = await uploadImageFromUrl(
    'https://static.wixstatic.com/media/39b8ef_cc8a5989783a401792a67b8649b7f28c~mv2.webp',
    'make-gold-partner-badge.webp'
  )
  const showcaseImages = await Promise.all(
    SHOWCASE_CARDS.map((c) => uploadImageFromUrl(c.imageUrl))
  )

  const patch: Record<string, unknown> = {
    title: 'Make Partners',
    heroHeadingPart1: 'make.com ',
    heroHeadingAccent: 'Gold Partner',
    heroSubheading:
      'Consulting and Automation Solutions\n\nCertified Make.com Platform Integration & Automation Services across Australia, US & the UK',
    heroPrimaryCtaLabel: '🚀 Book a Consultation',
    heroSecondaryCtaLabel: '▶️ Get Started with make.com',
    heroSecondaryCtaUrl: 'https://www.make.com/en/register?pc=fruition2023',
    heroImage,

    announcementHeading:
      'Fruition proudly announces our Gold Partner status with Make, the leading enterprise automation and integration platform formerly known as Integromat.',
    announcementBody:
      'As a certified Gold Partner, we deliver advanced workflow automation solutions that transform business operations and drive digital efficiency.',
    announcementImage,

    logoCloudHeadingPart1: 'Trusted by ',
    logoCloudHeadingAccent: 'leading organisations',

    comparisonHeading: 'Transform Your Business with make Automations',
    comparisonTabs: withKeys(
      COMPARISON_TABS.map((tab) => ({
        label: tab.label,
        items: withKeys(
          tab.items.map((item) => ({
            number: item.number,
            title: item.title,
            bullets: withKeys(item.bullets),
          }))
        ),
      }))
    ),

    featureListsHeading: "Transform your business operations with Fruition's make Gold Partner expertise.",
    featureListsSubheading: 'Our certified team will guide you through:',
    featureListsRightEyebrow: 'As your dedicated make Gold Partner, we specialise in:',
    featureListsFooter:
      "Contact Fruition's Make automation experts to begin your digital transformation journey. As a certified Gold Partner, we deliver enterprise-grade automation solutions that drive efficiency and growth. Transform your business operations and bring your workflows to Fruition.",
    featureListLeft: withKeys(FEATURE_LIST_LEFT),
    featureListRight: withKeys(FEATURE_LIST_RIGHT),

    calendlyHeading:
      'Schedule a 30-min consultation with one of our make.com consultants to learn how the platform can streamline your processes by 4x-6x',

    showcaseHeading: 'Enterprise Automation Solutions',
    showcaseSubheading: 'See how make.com transforms your business operations',
    showcaseCards: withKeys(
      SHOWCASE_CARDS.map((c, i) => ({
        heading: c.heading,
        body: c.body,
        imageRight: c.imageRight,
        mediaType: 'image',
        image: showcaseImages[i],
      }))
    ),

    joinHeadingPart1: 'Join ',
    joinHeadingAccent: '500+ businesses',
    joinHeadingPart2: ' that have leveraged our make.com automation expertise.',
    joinStats: withKeys(JOIN_STATS),
    joinCtaLabel: 'Start Your Transformation',

    testimonialsHeading: 'What our clients say',
    testimonialsCtaLabel: 'View All Case Studies',
    testimonialsCtaUrl: '/customer-testimonials#case-studies',
    statCardValue: '290+',
    statCardSubtitle: 'Satisfied clients across Australia, US & UK',
    statCardCtaLabel: 'Join Them',

    discoverHeading: 'Discover how much make.com can do for your team.',

    testimonialBannerHeadingPart1: 'Join ',
    testimonialBannerHeadingAccent: '500+ organisations',
    testimonialBannerHeadingPart2:
      ' that have maximised their workflows with our make.com automation expertise',
    testimonialBannerPrimaryCtaLabel: 'Start Your Transformation',
    testimonialBannerSecondaryCtaLabel: 'Get Started with make.com',
    testimonialBannerSecondaryCtaUrl: 'https://www.make.com/en/register?pc=fruition2023',
  }

  console.log(`Patching ${id}…`)
  await writeClient.createOrReplace({ _id: id, _type: 'makePartnersPage', ...patch })
  console.log('✓ makePartnersPage populated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

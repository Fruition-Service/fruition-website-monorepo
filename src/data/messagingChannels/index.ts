import type { ChannelPage } from './types'

const STUB: ChannelPage = {
  path: '/integrations/whatsapp', sanitySlug: 'integrations-whatsapp', channel: 'WhatsApp',
  seoTitle: 's', seoDescription: 's',
  heroEyebrow: 's', heroHeading: 's', heroSubheading: 's', primaryCtaLabel: 's', secondaryCtaLabel: 's',
  intro: 's',
  logoCloudHeadingPart1: 's', logoCloudHeadingAccent: 's',
  reachEyebrow: 's', reachHeading: 's', reachHeadingAccent: 's', reachLead: 's',
  reach: [{ flag: '🇦🇺', market: 's', stat: 's', body: 's' }],
  flowEyebrow: 's', flowHeading: 's', flowSubheading: 's',
  flowSteps: [{ glyph: '💬', label: 's', sublabel: 's' }], flowFootnote: 's',
  matrixEyebrow: 's', matrixHeading: 's', matrixHeadingAccent: 's', matrixLead: 's',
  matrix: [{ platform: 's', support: 'none', outOfTheBox: 's', weBuild: 's' }], matrixNote: 's',
  specEyebrow: 's', specHeading: 's', specHeadingAccent: 's', specLead: 's',
  spec: [{ label: 's', value: 's', implication: 's' }], specFootnote: 's',
  capabilitiesEyebrow: 's', capabilitiesHeading: 's', capabilitiesHeadingAccent: 's', capabilitiesSubheading: 's',
  capabilities: [{ emoji: '🔌', title: 's', description: 's', bullets: [{ text: 's' }] }],
  industryHeading: 's',
  industries: [{ label: 's', title: 's', description: 's', benefits: [{ text: 's' }] }],
  comparisonHeading: 's', comparisonSubheading: 's',
  comparisonTabs: [{ label: 's', items: [{ number: '01', title: 's', description: 's' }] }],
  phasesHeading: 's', phasesHeadingAccent: 's', phasesSubheading: 's',
  phases: [{ number: '01', title: 's', description: 's' }],
  calendlyHeading: 's', calendlySubheading: 's',
  faqs: [{ q: 's', a: 's' }],
  closing: { heading: 's', lead: 's' },
}

export const CHANNEL_PAGES: Record<'whatsapp' | 'line' | 'viber', ChannelPage> = {
  whatsapp: STUB,
  line: { ...STUB, path: '/integrations/line', sanitySlug: 'integrations-line', channel: 'LINE' },
  viber: { ...STUB, path: '/integrations/viber', sanitySlug: 'integrations-viber', channel: 'Viber' },
}

/**
 * Messaging-channel integration pages — /integrations/whatsapp, /line, /viber.
 *
 * These three pages answer one question: your customers already talk to you on
 * this app, so how does that conversation end up in the CRM, ERP or lead
 * workflow that runs the business? The honest answer differs per channel and
 * per platform, and the differences are the page.
 *
 * Content lives here as the render fallback and is mirrored into Sanity
 * (`servicePage`, slugs `integrations-whatsapp|line|viber`) so editors can
 * change copy without a deploy — the same pattern the n8n partnership page
 * uses. Sanity wins wherever it has a value.
 */
import type { Metadata } from 'next'
import { buildOgMetadata } from '@/lib/metadata'
import type { ChannelStackRow } from '@/components/sections/ChannelStackMatrix'
import type { ChannelSpecRow } from '@/components/sections/ChannelSpecPanel'
import type { WorkflowStep } from '@/components/sections/WorkflowConnector'
import type {
  CapabilityCard,
  ComparisonTab,
  FeatureNumberItem,
} from '@/components/sections/types'

/** One industry's worth of "here is the actual workflow" detail. */
export interface ChannelIndustry {
  label: string
  title: string
  description: string
  benefits: { text: string }[]
}

/** Where the channel actually has reach, with the number that proves it. */
export interface ChannelReach {
  flag: string
  market: string
  stat: string
  body: string
}

export interface ChannelPage {
  /** Route path — canonical, sitemap entry and pageShell key. */
  path: string
  /** Sanity `servicePage` slug backing this route. */
  sanitySlug: string
  /** Display name of the channel, e.g. "WhatsApp". */
  channel: string

  seoTitle: string
  seoDescription: string

  heroEyebrow: string
  heroHeading: string
  heroSubheading: string
  primaryCtaLabel: string
  secondaryCtaLabel: string

  /** Positioning paragraph under the hero. Blank lines split paragraphs. */
  intro: string

  logoCloudHeadingPart1: string
  logoCloudHeadingAccent: string

  /** Reach strip — the markets where this channel is the default inbox. */
  reachEyebrow: string
  reachHeading: string
  reachHeadingAccent: string
  reachLead: string
  reach: ChannelReach[]

  /** The pipe: channel → middleware → system of record. */
  flowEyebrow: string
  flowHeading: string
  flowSubheading: string
  flowSteps: WorkflowStep[]
  flowFootnote: string

  /** Per-CRM connection ledger — the commercial core of the page. */
  matrixEyebrow: string
  matrixHeading: string
  matrixHeadingAccent: string
  matrixLead: string
  matrix: ChannelStackRow[]
  matrixNote: string

  /** Platform rules that constrain the build. */
  specEyebrow: string
  specHeading: string
  specHeadingAccent: string
  specLead: string
  spec: ChannelSpecRow[]
  specFootnote: string

  /** What we actually deliver. */
  capabilitiesEyebrow: string
  capabilitiesHeading: string
  capabilitiesHeadingAccent: string
  capabilitiesSubheading: string
  capabilities: CapabilityCard[]

  /** Industry workflows, as tabs. */
  industryHeading: string
  industries: ChannelIndustry[]

  /** Failure modes we see, and the fix — two tabs. */
  comparisonHeading: string
  comparisonSubheading: string
  comparisonTabs: ComparisonTab[]

  /** Delivery phases. */
  phasesHeading: string
  phasesHeadingAccent: string
  phasesSubheading: string
  phases: FeatureNumberItem[]

  calendlyHeading: string
  calendlySubheading: string

  faqs: { q: string; a: string }[]

  closing: { heading: string; headingAccent?: string; lead: string }
}

export function channelMetadata(page: ChannelPage): Metadata {
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: page.path },
    ...buildOgMetadata({
      title: page.seoTitle,
      description: page.seoDescription,
      path: page.path,
    }),
  }
}

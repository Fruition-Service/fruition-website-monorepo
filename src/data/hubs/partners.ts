import type { HubCard } from '@/components/hubs/HubSections'

/**
 * /partnerships hub (Josh's navigation prototype, 21 Oct 2026). Copy is the
 * prototype's, verbatim, except:
 *  - Lovable and Base44 are left out until Josh confirms partner status and
 *    their pages exist, so "Eight platforms" reads "Six platforms".
 *  - The calculator button points at /ask-fruit, its real route.
 */

export const PARTNERS_HUB = {
  path: '/partnerships',
  seoTitle: 'Technology Partners: AI, Work Platforms & Automation | Fruition',
  seoDescription:
    'Fruition is a platform-agnostic consultancy: OpenAI Select Partner, Anthropic Claude partner, monday.com and Atlassian Platinum Partner, n8n and Make partner.',
  eyebrow: 'Partners',
  heading: 'Technology partners for AI, work platforms',
  accent: 'and automation',
  lead: "Fruition is a platform-agnostic consultancy. We're an OpenAI Select Partner, an Anthropic Claude partner, a monday.com and Atlassian Platinum Partner, and an n8n and Make partner, so we can recommend the stack that fits your process instead of the one we resell.",
  facts: [
    'OpenAI Select Partner',
    'monday.com Platinum · Rising Star 2026',
    'Atlassian Platinum · Rising Star 2026',
    '900+ implementations',
    'AU · UK · US · APAC',
  ],
  coreHeading: 'Our core partners',
  coreLede: 'Six platforms we certify on, build with every week and support after go-live.',
  core: [
    {
      group: 'AI platform',
      title: 'OpenAI',
      badge: 'Select Partner',
      body: 'ChatGPT Enterprise rollouts, custom GPTs and agents with governance from day one.',
      links: [
        { label: 'AI capability assessment', href: '/ai-capability-assessment' },
        { label: 'Agent development', href: '/ai-consulting/agent-development' },
      ],
      cta: 'OpenAI services →',
      href: '/partnerships/openai-chatgpt-partner',
    },
    {
      group: 'AI platform',
      title: 'Anthropic Claude',
      badge: 'Claude partner',
      body: 'Claude Enterprise and Claude Code, deployed securely with Anthropic-certified architects.',
      links: [
        { label: 'AI strategy & execution', href: '/ai-strategy-and-execution' },
        { label: 'Governance & compliance', href: '/ai-consulting/governance-and-compliance' },
      ],
      cta: 'Claude services →',
      href: '/partnerships/anthropic-claude-partner',
    },
    {
      group: 'Work platform',
      title: 'monday.com',
      badge: 'Platinum · Rising Star 2026',
      body: 'Implementation, CRM and training for work management, CRM, Service and dev.',
      links: [
        { label: 'Implementation packages', href: '/implementation-packages' },
        { label: 'CRM consulting', href: '/monday-crm-consulting' },
        { label: 'Training', href: '/monday-training' },
      ],
      cta: 'monday.com services →',
      href: '/partnerships/monday-consulting-partner',
    },
    {
      group: 'Work platform',
      title: 'Atlassian',
      badge: 'Platinum · Rising Star 2026',
      body: 'Jira, Jira Service Management and Confluence implementation, optimisation and rescue.',
      links: [
        { label: 'Jira', href: '/atlassian-consulting/jira' },
        { label: 'Jira Service Management', href: '/atlassian-consulting/jira-service-management' },
      ],
      cta: 'Atlassian services →',
      href: '/partnerships/certified-atlassian-partner',
    },
    {
      group: 'Automation',
      title: 'n8n',
      badge: 'n8n partner',
      body: 'Self-hosted workflows and AI agents for teams that need control over their data.',
      cta: 'n8n services →',
      href: '/partnerships/n8n-integration-partner',
    },
    {
      group: 'Automation',
      title: 'Make',
      badge: 'Make partner',
      body: 'No-code automation that connects your CRM, finance and messaging tools.',
      cta: 'Make services →',
      href: '/partnerships/make-partners',
    },
  ] satisfies HubCard[],
  pick: {
    heading: 'Not sure which platform fits?',
    body: "Tell us the process and we'll recommend the stack. It's often the one you already pay for.",
    primary: { label: 'Book a free consultation', href: '/contact-us#book' },
    secondary: { label: 'Try the implementation calculator', href: '/ask-fruit' },
  },
  othersHeading: 'Other platforms and integrations',
  othersLede: 'We also deliver on these platforms, usually alongside a core partner above.',
  others: [
    { label: 'HubSpot', href: '/partnerships/certified-hubspot-partner' },
    { label: 'ClickUp', href: '/partnerships/certified-clickup-partner' },
    { label: 'Microsoft Copilot', href: '/partnerships/microsoft-copilot-partner' },
    { label: 'Google Gemini & Vertex AI', href: '/partnerships/google-gemini-vertex-ai-partner' },
    { label: 'Azure', href: '/partnerships/microsoft-azure-partner' },
    { label: 'AWS', href: '/partnerships/aws-partner' },
    { label: 'Google Cloud', href: '/partnerships/google-cloud-partner' },
    { label: 'Supabase', href: '/partnerships/supabase-partner' },
    { label: 'Zapier', href: '/integrations/zapier' },
    { label: 'LangGraph', href: '/partnerships/langgraph-partner' },
    { label: 'Clay', href: '/partnerships/clay-partner' },
    { label: 'ElevenLabs', href: '/partnerships/elevenlabs-partner' },
    { label: 'Aircall', href: '/partnerships/aircall-partner' },
    { label: 'Hootsuite', href: '/partnerships/hootsuite-delivery-partner' },
    { label: 'WhatsApp', href: '/integrations/whatsapp' },
    { label: 'Viber', href: '/integrations/viber' },
    { label: 'All integrations', href: '/integrations', primary: true },
  ],
  faqs: [
    {
      question: 'Is Fruition tied to one software vendor?',
      answer:
        'No. Fruition is platform-agnostic. We hold partner status with OpenAI, Anthropic, monday.com, Atlassian, n8n and Make, and we recommend whichever platform fits your process and budget.',
    },
    {
      question: 'What does Platinum Partner status mean?',
      answer:
        'Platinum is the highest partner tier at both monday.com and Atlassian. It reflects delivery volume, certified consultants and customer outcomes.',
    },
    {
      question: 'Can you combine AI with our existing work platform?',
      answer:
        'Yes. Most projects pair a work platform like monday.com or Jira with ChatGPT or Claude, connected by n8n or Make, with governance and permissions designed up front.',
    },
  ],
}

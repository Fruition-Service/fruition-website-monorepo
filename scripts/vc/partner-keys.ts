/**
 * Which partner a badge, logo or directory tile belongs to, from its label or
 * link. Shared by the partner registry migration and its checks.
 */
export const PARTNER_RULES: { key: string; name: string; href?: string; label: RegExp; hrefs?: string[] }[] = [
  { key: 'monday-advanced-delivery', name: 'monday.com Advanced Delivery Partner', label: /^Advanced Delivery/i },
  { key: 'monday', name: 'monday.com', href: '/partnerships/monday-consulting-partner', label: /^monday\.com( Platinum Partner)?$/i, hrefs: ['/partnerships/monday-consulting-partner'] },
  { key: 'atlassian', name: 'Atlassian', href: '/atlassian-consulting', label: /^Atlassian/i, hrefs: ['/atlassian-consulting'] },
  { key: 'hubspot', name: 'HubSpot', href: '/hubspot-consulting', label: /^HubSpot( Solutions?)?( Partner)?$/i, hrefs: ['/hubspot-consulting'] },
  { key: 'clickup', name: 'ClickUp', href: '/partnerships/certified-clickup-partner', label: /^ClickUp/i, hrefs: ['/partnerships/certified-clickup-partner'] },
  { key: 'aws', name: 'AWS', href: '/partnerships/aws-partner', label: /^AWS( Partner)?$/i, hrefs: ['/partnerships/aws-partner'] },
  { key: 'google-cloud', name: 'Google Cloud', href: '/partnerships/google-cloud-partner', label: /^Google Cloud( Partner)?$/i, hrefs: ['/partnerships/google-cloud-partner'] },
  { key: 'google-gemini', name: 'Google Gemini', href: '/partnerships/google-gemini-vertex-ai-partner', label: /^Google Gemini$/i, hrefs: ['/partnerships/google-gemini-vertex-ai-partner'] },
  { key: 'microsoft-copilot', name: 'Microsoft Copilot', href: '/partnerships/microsoft-copilot-partner', label: /^Microsoft Copilot$/i, hrefs: ['/partnerships/microsoft-copilot-partner'] },
  { key: 'azure', name: 'Microsoft Azure', href: '/partnerships/microsoft-azure-partner', label: /^Azure$/i, hrefs: ['/partnerships/microsoft-azure-partner'] },
  { key: 'openai', name: 'OpenAI', href: '/partnerships/openai-chatgpt-partner', label: /^OpenAI( Select Partner)?$/i, hrefs: ['/partnerships/openai-chatgpt-partner'] },
  { key: 'claude', name: 'Anthropic Claude', href: '/partnerships/anthropic-claude-partner', label: /^(Anthropic Claude|Claude (Partner Network )?Select Services Partner|Anthropic Claude Partner Network)/i, hrefs: ['/partnerships/anthropic-claude-partner'] },
  { key: 'elevenlabs', name: 'ElevenLabs', href: '/partnerships/elevenlabs-partner', label: /^ElevenLabs/i, hrefs: ['/partnerships/elevenlabs-partner'] },
  { key: 'hootsuite', name: 'Hootsuite', href: '/partnerships/hootsuite-delivery-partner', label: /^Hootsuite/i, hrefs: ['/partnerships/hootsuite-delivery-partner'] },
  { key: 'aircall', name: 'Aircall', href: '/partnerships/aircall-partner', label: /^Aircall( Partner)?$/i, hrefs: ['/partnerships/aircall-partner'] },
  { key: 'make', name: 'Make', href: '/partnerships/make-partners', label: /^Make( Gold)?( Partner)?$/i, hrefs: ['/partnerships/make-partners'] },
  { key: 'n8n', name: 'n8n', href: '/partnerships/n8n-integration-partner', label: /^n8n( Certified Expert Partner)?$/i, hrefs: ['/partnerships/n8n-integration-partner'] },
  { key: 'supabase', name: 'Supabase', href: '/partnerships/supabase-partner', label: /^Supabase$/i, hrefs: ['/partnerships/supabase-partner'] },
  { key: 'clay', name: 'Clay', href: '/partnerships/clay-partner', label: /^Clay$/i, hrefs: ['/partnerships/clay-partner'] },
  { key: 'vapi', name: 'Vapi', href: '/partnerships/vapi-partner', label: /^Vapi$/i, hrefs: ['/partnerships/vapi-partner'] },
  { key: 'openclaw', name: 'OpenClaw', href: '/partnerships/openclaw-partner', label: /^OpenClaw$/i, hrefs: ['/partnerships/openclaw-partner'] },
  { key: 'langgraph', name: 'LangGraph', label: /^LangGraph$/i },
]

export function partnerKeyFor(label?: string, href?: string): string | null {
  const l = (label || '').trim()
  for (const r of PARTNER_RULES) {
    if (href && r.hrefs?.includes(href)) return r.key
    if (l && r.label.test(l)) return r.key
  }
  return null
}

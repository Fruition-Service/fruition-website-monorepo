export default {
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string' },
    { name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'category',
      title: 'Category (tab label)',
      type: 'string',
      description:
        'Used to group FAQs into tabs on the FAQs page and on per-page FAQ sections. Examples: "monday Work Management", "Retail", "General Questions".',
    },
    {
      name: 'pages',
      title: 'Show on pages',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { value: 'faqs', title: 'FAQs (/faqs)' },
          { value: 'implementation-packages', title: 'Implementation Packages' },
          { value: 'monday-training', title: 'monday Training' },
          { value: 'monday-implementation-consultants', title: 'monday Implementation Consultants' },
          { value: 'monday-consulting-solutions', title: 'monday Consulting Solutions' },
          { value: 'monday-crm-consulting', title: 'monday CRM Consulting' },
          { value: 'monday-for-construction', title: 'monday for Construction' },
          { value: 'monday-for-manufacturing', title: 'monday for Manufacturing' },
          { value: 'monday-for-retail', title: 'monday for Retail' },
          { value: 'monday-for-professional-services', title: 'monday for Professional Services' },
          { value: 'monday-for-government', title: 'monday for Government' },
          { value: 'monday-for-marketing', title: 'monday for Marketing' },
          { value: 'monday-for-real-estate', title: 'monday for Real Estate' },
          { value: 'ai-strategy-and-execution', title: 'AI Strategy & Execution' },
          { value: 'partnerships', title: 'Partnerships' },
          { value: 'partnerships/make-partners', title: 'Make Partners' },
          { value: 'partnerships/n8n-integration-partner', title: 'n8n Integration Partner' },
          { value: 'partnerships/aircall-partner', title: 'Aircall Partner' },
          { value: 'partnerships/certified-atlassian-partner', title: 'Atlassian Partner' },
          { value: 'partnerships/monday-consulting-partner', title: 'monday Consulting Partner' },
          /* AI partner pages (AiPartnerTemplate) */
          { value: 'ai-capability-assessment', title: 'AI Capability Assessment' },
          { value: 'partnerships/anthropic-claude-partner', title: 'Anthropic Claude Partner' },
          { value: 'partnerships/openai-chatgpt-partner', title: 'OpenAI ChatGPT Partner' },
          { value: 'partnerships/openclaw-partner', title: 'Openclaw Partner' },
          { value: 'partnerships/aws-partner', title: 'AWS Partner' },
          { value: 'partnerships/google-cloud-partner', title: 'Google Cloud Partner' },
          { value: 'partnerships/google-gemini-vertex-ai-partner', title: 'Google Gemini Vertex AI Partner' },
          { value: 'partnerships/microsoft-copilot-partner', title: 'Microsoft Copilot Partner' },
          /* Practice cluster pages (PracticePageTemplate) — key = route path */
          { value: 'ai-consulting', title: 'AI Consulting (hub)' },
          { value: 'ai-consulting/agent-development', title: 'AI · Agent Development' },
          { value: 'ai-consulting/customer-service', title: 'AI · Customer Service' },
          { value: 'ai-consulting/governance-and-compliance', title: 'AI · Governance & Compliance' },
          { value: 'ai-consulting/marketing-automation', title: 'AI · Marketing Automation' },
          { value: 'ai-consulting/operations-back-office', title: 'AI · Operations & Back Office' },
          { value: 'ai-consulting/rag-knowledge-systems', title: 'AI · RAG & Knowledge Systems' },
          { value: 'ai-consulting/sales-outbound', title: 'AI · Sales & Outbound' },
          { value: 'atlassian-consulting', title: 'Atlassian Consulting (hub)' },
          { value: 'case-studies', title: 'Case Studies' },
          { value: 'certifications-and-awards', title: 'Certifications & Awards' },
          { value: 'hubspot-consulting', title: 'HubSpot Consulting (hub)' },
          // The four HubSpot leaf pages are sections of the hub now (monday
          // 2900266080). The hub still reads questions tagged with these keys
          // (HUBSPOT_FAQ_PAGE_KEYS), after its own, so the values stay.
          { value: 'hubspot-consulting/breeze-ai', title: 'HubSpot hub · Breeze AI section' },
          { value: 'hubspot-consulting/hubspot-to-monday-migration', title: 'HubSpot hub · HubSpot→monday Migration section' },
          { value: 'hubspot-consulting/implementation', title: 'HubSpot hub · Implementation section' },
          { value: 'hubspot-consulting/monday-hubspot-integration', title: 'HubSpot hub · monday Integration section' },
          { value: 'industries', title: 'Industries (hub)' },
          { value: 'industries/financial-services', title: 'Industries · Financial Services' },
          { value: 'industries/healthcare', title: 'Industries · Healthcare' },
          { value: 'industries/solar-renewables', title: 'Industries · Solar & Renewables' },
          { value: 'industries/transport-logistics', title: 'Industries · Transport & logistics' },
          { value: 'industries/hospitality-tourism-events', title: 'Industries · Hospitality, tourism & events' },
          { value: 'industries/technology-saas', title: 'Industries · Technology & SaaS' },
          { value: 'industries/energy-utilities', title: 'Industries · Energy & utilities' },
          { value: 'industries/media-entertainment', title: 'Industries · Media & entertainment' },
          { value: 'industries/legal', title: 'Industries · Legal' },
          { value: 'integrations', title: 'Integrations (hub)' },
          { value: 'integrations/aircall', title: 'Integrations · Aircall' },
          { value: 'integrations/make', title: 'Integrations · Make' },
          { value: 'integrations/twilio', title: 'Integrations · Twilio' },
          { value: 'integrations/zapier', title: 'Integrations · Zapier' },






          { value: 'pricing', title: 'Pricing' },
          /* Department solution pages (FAQ-bank agentic sets) */
          { value: 'monday-consulting-solutions/monday-for-finance', title: 'monday for Finance' },
          { value: 'monday-consulting-solutions/monday-for-hr', title: 'monday for HR' },
          { value: 'partnerships/certified-hubspot-partner', title: 'HubSpot Partner' },
        ],
      },
      description:
        'Every page key listed here will show this FAQ in its FAQ section. The /faqs page shows every FAQ regardless of this field.',
    },
    {
      name: 'categoryOrder',
      title: 'Category order',
      type: 'number',
      description: 'Lower numbers show their tab earlier on the tab bar.',
    },
    { name: 'order', title: 'Order within category', type: 'number' },
  ],
  orderings: [
    {
      title: 'Category then order',
      name: 'categoryThenOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
}

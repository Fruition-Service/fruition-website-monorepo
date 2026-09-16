export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'emoji', title: 'Emoji', type: 'string' },
    { name: 'photo', title: 'Photo', type: 'image' },
    { name: 'bio', title: 'Bio', type: 'text' },
    {
      name: 'certifications',
      title: 'Certifications (badges shown under the bio)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Certified Core Consultant', value: 'Certified Core Consultant' },
          { title: 'Advanced Workflow Builder', value: 'Advanced Workflow Builder' },
          { title: 'CRM Specialist', value: 'CRM Specialist' },
          { title: 'Make.com Certified', value: 'Make.com Certified' },
          { title: 'n8n Specialist', value: 'n8n Specialist' },
          { title: 'Solutions Architect', value: 'Solutions Architect' },
        ],
      },
    },
    { name: 'linkedinUrl', title: 'LinkedIn URL', type: 'string' },
    {
      name: 'regions',
      title: 'Regions',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'APAC 🌏', value: 'APAC' },
          { title: 'Singapore 🇸🇬', value: 'SG' },
          { title: 'India 🇮🇳', value: 'IN' },
          { title: 'Philippines 🇵🇭', value: 'PH' },
          { title: 'United Kingdom 🇬🇧', value: 'UK' },
          { title: 'United States 🇺🇸', value: 'US' },
          { title: 'Australia 🇦🇺 (legacy)', value: 'AU' },
        ],
      },
    },
    {
      name: 'regionPagesOnly',
      title: 'Show on these region pages only',
      description:
        'Leave empty for everyone normal — the Regions field above decides where they appear. Set it only to pin someone to specific /monday-partner-* pages, which Regions cannot do on its own (Australia, Singapore and the Philippines all share the APAC code). Anyone listed here appears on the chosen pages and no other region page.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Australia 🇦🇺', value: 'monday-partner-australia' },
          { title: 'Singapore 🇸🇬', value: 'monday-partner-singapore' },
          { title: 'India 🇮🇳', value: 'monday-partner-india' },
          { title: 'Philippines 🇵🇭', value: 'monday-partner-philippines' },
          { title: 'United Kingdom 🇬🇧', value: 'monday-partner-uk' },
          { title: 'United States 🇺🇸', value: 'monday-partner-us' },
        ],
      },
    },
    { name: 'order', title: 'Order', type: 'number' },
  ],
}

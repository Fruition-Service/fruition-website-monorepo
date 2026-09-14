/**
 * proofStats — the single source of truth for Fruition's entity-signal
 * numbers (the ones AEO/SEO copy and stat cards cite). Edit here once;
 * anything wired to getProofStats() updates everywhere.
 *
 * Singleton: exactly one document with _id "proofStats".
 */
export default {
  name: 'proofStats',
  title: 'Proof stats (entity signals)',
  type: 'document',
  fields: [
    {
      name: 'implementations',
      title: 'Implementations completed',
      type: 'string',
      description: 'e.g. "900+" — the number cited in FAQ answers, stat cards and hero copy.',
    },
    { name: 'clientRating', title: 'Client rating', type: 'string', description: 'e.g. "4.9"' },
    { name: 'marketsCount', title: 'Markets served', type: 'string', description: 'e.g. "6" (Australia, UK, US, Singapore, India, Philippines)' },
    { name: 'mondayEcosystemCustomers', title: 'monday.com global customers', type: 'string', description: 'monday.com\'s own customer count, e.g. "180,000+" (external stat, cite consistently)' },
    { name: 'partnerTierMonday', title: 'monday.com partner tier', type: 'string', description: 'e.g. "Platinum monday.com Partner"' },
    { name: 'partnerTierAtlassian', title: 'Atlassian partner tier', type: 'string', description: 'e.g. "Platinum Atlassian Partner"' },
    {
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "monday.com Rising Star 2026", "Atlassian Rising Star of the Year 2026"',
    },
  ],
}

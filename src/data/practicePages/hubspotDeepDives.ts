/**
 * The four in-page sections on /hubspot-consulting (monday 2900266080).
 *
 * Each one is a retired leaf page folded into the hub: its own heading (now
 * an H2), its lead, its approach heading with three numbered cards and its
 * services eyebrow and heading with four cards, copied verbatim. They are
 * code-only on purpose, as on /atlassian-consulting: the hub's `practicePage`
 * document does not carry them, so a stale or missing Sanity document can
 * never blank a section.
 *
 * The order matches the hub's four service cards, which link to these ids.
 */
export interface HubspotDeepDive {
  /** In-page anchor, also the section id. The retired routes 301 here. */
  id: 'implementation' | 'breeze-ai' | 'integration' | 'migration'
  eyebrow: string
  heading: string
  lead: string
  stepsHeading: string
  steps: { title: string; body: string }[]
  cardsEyebrow: string
  cardsHeading: string
  cards: { title: string; body: string }[]
}

export const HUBSPOT_DEEP_DIVES: HubspotDeepDive[] = [
  {
    id: 'implementation',
    eyebrow: '01 · HubSpot implementation',
    heading: 'HubSpot set up right the first time',
    lead: 'Fruition implements HubSpot for teams across Australia, the UK, and the US: portal architecture, lifecycle design, and automation that make the platform earn its licence fee.',
    stepsHeading: 'Architecture before automation.',
    steps: [
      {
        title: 'Lifecycle stages that mean something',
        body: 'Deal stages, lifecycle stages, and lead status mapped to your actual funnel: the foundation everything else depends on.',
      },
      {
        title: 'Data hygiene from day one',
        body: 'Property governance, deduplication rules, and required-field discipline before the database becomes a swamp.',
      },
      {
        title: 'Reporting leaders trust',
        body: 'Attribution and pipeline reporting configured so the Monday revenue meeting runs off HubSpot, not a spreadsheet export.',
      },
    ],
    cardsEyebrow: 'What we implement',
    cardsHeading: 'Across all three Hubs.',
    cards: [
      {
        title: 'Marketing Hub',
        body: 'Email, forms, landing pages, lead scoring, and campaign attribution: HubSpot’s strongest surface, configured properly.',
      },
      {
        title: 'Sales Hub',
        body: 'Pipelines, sequences, playbooks, and forecast configuration for sales teams.',
      },
      {
        title: 'Service Hub',
        body: 'Ticketing, knowledge base, and feedback loops connected to the customer record.',
      },
      {
        title: 'Integrations',
        body: 'Aircall telephony, Xero, monday.com, and the webhook-level connections packaged apps can’t do.',
      },
    ],
  },
  {
    id: 'breeze-ai',
    eyebrow: '02 · Breeze AI enablement',
    heading: 'Breeze AI configured by an actual AI practice',
    lead: 'Fruition enables HubSpot’s Breeze AI for teams across Australia, the UK, and the US: agents, copilot, and intelligence features configured with real AI governance, by a firm that builds AI systems beyond HubSpot too.',
    stepsHeading: 'The bridge between two practices.',
    steps: [
      {
        title: 'Native Breeze first',
        body: 'Breeze agents, copilot, and intelligence cover substantial ground. We configure the native layer fully before recommending anything custom.',
      },
      {
        title: 'Governed like real AI',
        body: 'Usage policies, output review gates, and data-handling rules applied to Breeze with the same discipline as our enterprise AI work.',
      },
      {
        title: 'Escalation without handoff',
        body: 'When workloads outgrow Breeze (custom agents, deep RAG, cross-platform orchestration), our AI consulting practice continues the work. Same team.',
      },
    ],
    cardsEyebrow: 'What we configure',
    cardsHeading: 'The Breeze surface.',
    cards: [
      {
        title: 'Breeze agents',
        body: 'Content, social, and prospecting agents configured to your brand voice, ICP, and approval workflows.',
      },
      {
        title: 'Breeze copilot',
        body: 'Team enablement on the CRM-embedded assistant, the prompts and patterns that produce real output.',
      },
      {
        title: 'Breeze intelligence',
        body: 'Data enrichment, buyer intent, and form shortening configured with data governance attached.',
      },
      {
        title: 'Beyond Breeze',
        body: 'Custom AI agents, n8n orchestration, and RAG systems connected to HubSpot data via our AI practice.',
      },
    ],
  },
  {
    id: 'integration',
    eyebrow: '03 · monday ↔ HubSpot integration',
    heading: 'Marketing in HubSpot. Delivery in monday. One system',
    lead: 'Fruition builds monday↔HubSpot integrations for teams across Australia, the UK, and the US: certified on both platforms, so the sync architecture respects how each side actually works.',
    stepsHeading: 'Dual certification, real architecture.',
    steps: [
      {
        title: 'Clear system-of-record rules',
        body: 'Every field has one owner. Contacts master in HubSpot, delivery status masters in monday: ambiguity is where syncs rot.',
      },
      {
        title: 'Native first, n8n where needed',
        body: 'The native integration where it suffices; n8n or Make middleware where field mapping, transformation, or error handling demand more.',
      },
      {
        title: 'Built for failure modes',
        body: 'Rate limits, deletion handling, and conflict resolution designed in: the difference between an integration and a demo.',
      },
    ],
    cardsEyebrow: 'Integration patterns',
    cardsHeading: 'What we typically connect.',
    cards: [
      {
        title: 'Deal → project handoff',
        body: 'Closed-won deals in HubSpot spawn structured monday project boards with brief data pre-populated.',
      },
      {
        title: 'Bi-directional status sync',
        body: 'Delivery milestones from monday flowing back to HubSpot so account teams see project reality in the CRM.',
      },
      {
        title: 'Marketing → operations flow',
        body: 'Campaign requests and content production bridging from HubSpot campaigns into monday marketing boards.',
      },
      {
        title: 'Revenue reporting unification',
        body: 'Pipeline and delivery data combined into dashboards leadership reads in one place.',
      },
    ],
  },
  {
    id: 'migration',
    eyebrow: '04 · HubSpot → monday migration',
    heading: 'Leave HubSpot with your pipeline history intact',
    lead: 'Fruition runs structured HubSpot-to-monday CRM migrations across Australia, the UK, and the US, as the partner certified on both platforms, with a playbook built from dozens of CRM moves.',
    stepsHeading: 'Why teams make this move, and how.',
    steps: [
      {
        title: 'The consolidation driver',
        body: 'Teams running delivery on monday tire of the two-platform tax: double licences, sync overhead, and split reporting. CRM consolidation onto monday removes all three.',
      },
      {
        title: 'The cost driver',
        body: 'HubSpot development and admin costs escalate with sophistication; monday’s flexibility means teams manage their own system after training. Our clients have cut technical administration costs materially on this move.',
      },
      {
        title: 'History preserved',
        body: 'Contacts, companies, deals, activity timelines, and attachments migrate with integrity through a staged, validated process.',
      },
    ],
    cardsEyebrow: 'The playbook',
    cardsHeading: 'How the migration runs.',
    cards: [
      {
        title: 'Audit & mapping (wk 1)',
        body: 'Full HubSpot inventory: properties, pipelines, workflows, integrations. Field-by-field mapping to monday CRM architecture.',
      },
      {
        title: 'CRM build (wk 2–3)',
        body: 'monday CRM structure: boards, mirror-column architecture, automation recipes replacing HubSpot workflows.',
      },
      {
        title: 'Staged migration (wk 3–4)',
        body: 'Contacts, companies, deals, and activity history migrated with parallel-run validation.',
      },
      {
        title: 'Training & cutover (wk 4–5)',
        body: 'Sales team training, integration cutover (email, telephony, forms), and HubSpot decommission planning.',
      },
    ],
  },
]

/** The hub's four service cards, in order, point at these anchors. */
export const HUBSPOT_SERVICE_ANCHORS = HUBSPOT_DEEP_DIVES.map((d) => `#${d.id}`)

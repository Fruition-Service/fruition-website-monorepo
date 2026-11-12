/**
 * The four product deep dives on /atlassian-consulting (monday 2899845035).
 *
 * Since 12 Nov 2026 this is the SOURCE COPY for the page-specific Version C
 * `vcDeepDive` sections (scripts/vc/atlassian-deep-dives.ts seeds them into
 * vcPage-atlassian-consulting). The live text is in Sanity: edit it there,
 * not here. The note below describes the pre-Version C page.
 *
 * Each one is a retired leaf page folded into the hub: its own heading (now
 * an H2), its lead, its approach heading with three numbered steps and its
 * services heading with four cards, copied verbatim. They are code-only on
 * purpose: the hub's `practicePage` document does not carry them, so a stale
 * or missing Sanity document can never blank a section.
 *
 * The order matches the hub's four service cards, which link to these ids.
 */
export interface AtlassianDeepDive {
  /** In-page anchor, also the section id. */
  id: 'jira' | 'confluence' | 'jsm' | 'migration'
  eyebrow: string
  heading: string
  lead: string
  stepsHeading: string
  steps: { title: string; body: string }[]
  cardsHeading: string
  cards: { title: string; body: string }[]
}

export const ATLASSIAN_DEEP_DIVES: AtlassianDeepDive[] = [
  {
    id: 'jira',
    eyebrow: 'Jira',
    heading: 'Jira that developers tolerate and leaders can read',
    lead: 'Fruition delivers Jira consulting across Australia, the UK, and the US: implementations that start clean, rescues that untangle years of configuration debt, and integrations that end the visibility gap.',
    stepsHeading: 'Configuration discipline.',
    steps: [
      {
        title: 'Workflow minimalism',
        body: 'Every status, transition, and required field must earn its place. Most Jira misery is workflow maximalism nobody remembers approving.',
      },
      {
        title: 'Permission sanity',
        body: 'Scheme consolidation and role-based access that admins can actually reason about, and auditors can actually audit.',
      },
      {
        title: 'Business-tool bridges',
        body: 'Jira↔monday.com and Jira↔Slack integrations that give non-technical stakeholders visibility without Jira licences or training.',
      },
    ],
    cardsHeading: 'Jira engagements we run.',
    cards: [
      {
        title: 'New implementations',
        body: 'Greenfield Jira setups with disciplined project templates, workflow standards, and governance from day one.',
      },
      {
        title: 'Instance rescue',
        body: 'The 3–4 week cleanup: workflow consolidation, permission untangling, plugin audit, and board restructure.',
      },
      {
        title: 'Advanced workflows',
        body: 'Automation rules, cross-project dependencies, and release management for scaled delivery organisations.',
      },
      {
        title: 'Integration builds',
        body: 'GitHub, Bitbucket, monday.com, Slack, and CI/CD pipeline connections.',
      },
    ],
  },
  {
    id: 'confluence',
    eyebrow: 'Confluence',
    heading: 'Confluence as a knowledge base, not a document graveyard',
    lead: 'Fruition delivers Confluence consulting across Australia, the UK, and the US: space architecture, governance, and content structure that keeps knowledge findable at year three, not just week three.',
    stepsHeading: 'Architecture beats enthusiasm.',
    steps: [
      {
        title: 'Space strategy first',
        body: 'Deliberate space taxonomy, ownership models, and lifecycle rules: the difference between a knowledge base and 4,000 orphaned pages.',
      },
      {
        title: 'Templates as governance',
        body: 'Structured templates for the content types that matter, making the right format the easy format.',
      },
      {
        title: 'AI-ready knowledge',
        body: 'Content structured for retrieval, which pays off doubly when you point RAG systems at it later. Our AI practice does exactly that.',
      },
    ],
    cardsHeading: 'Confluence engagements.',
    cards: [
      {
        title: 'Knowledge architecture',
        body: 'Space design, page hierarchies, labels, and navigation for organisations from 50 to 5,000 users.',
      },
      {
        title: 'Content migration',
        body: 'Structured moves from SharePoint, Notion, Google Drive, or legacy wikis with cleanup en route.',
      },
      {
        title: 'Governance programs',
        body: 'Ownership models, review cadences, archival rules, and the analytics to enforce them.',
      },
      {
        title: 'Jira integration',
        body: 'Requirements, documentation, and decision records linked into delivery workflows.',
      },
    ],
  },
  {
    id: 'jsm',
    eyebrow: 'Jira Service Management',
    heading: 'ITSM that resolves tickets instead of routing them in circles',
    lead: 'Fruition implements Jira Service Management for IT and support teams across Australia, the UK, and the US: service desks, SLA automation, asset management, and portals users actually use.',
    stepsHeading: 'Service design before tool config.',
    steps: [
      {
        title: 'Request-type discipline',
        body: 'A curated request catalogue with smart forms, not 90 request types nobody can choose between.',
      },
      {
        title: 'SLAs that mean something',
        body: 'Escalation rules and breach alerts tied to commitments your team can actually keep.',
      },
      {
        title: 'Dev-connected incidents',
        body: 'Incidents linked to Jira Software issues so support and engineering work one thread, not two ticket systems.',
      },
    ],
    cardsHeading: 'JSM engagements.',
    cards: [
      {
        title: 'Service desk implementation',
        body: 'Request catalogues, queues, automation, and portal design for IT and internal service teams.',
      },
      {
        title: 'SLA and escalation design',
        body: 'Priority matrices, escalation chains, and the reporting that keeps commitments visible.',
      },
      {
        title: 'Asset and configuration management',
        body: 'Insight-based asset tracking connected to incident and change workflows.',
      },
      {
        title: 'Alternative honesty',
        body: 'When JSM is overkill or underpowered, we’ll say so: monday Service and other options compared straight.',
      },
    ],
  },
  {
    id: 'migration',
    eyebrow: 'Jira to monday.com migration',
    heading: 'Leave Jira without leaving your history behind',
    lead: 'Fruition runs structured Jira-to-monday.com migrations across Australia, the UK, and the US, as the rare partner certified on both platforms, with the Givergy case study to prove the playbook.',
    stepsHeading: 'The dual-certification advantage.',
    steps: [
      {
        title: 'Certified both sides',
        body: 'Atlassian consulting practice plus monday.com Platinum status means we map Jira concepts to monday architecture correctly: epics, sprints, components, and custom fields all land somewhere sensible.',
      },
      {
        title: 'History preserved',
        body: 'Issues, comments, attachments, and status history migrate with integrity, because losing three years of context is how migrations get reversed.',
      },
      {
        title: 'Workflow rebuild, not replication',
        body: 'Migration is the moment to fix process debt. We rebuild automation on monday-native patterns rather than replicating Jira’s workarounds.',
      },
    ],
    cardsHeading: 'How the migration runs.',
    cards: [
      {
        title: 'Audit and mapping (wk 1–2)',
        body: 'Full Jira inventory: projects, workflows, custom fields, plugins, integrations. Mapping document to monday architecture with gap analysis.',
      },
      {
        title: 'Structure build (wk 2–4)',
        body: 'monday workspace, board, and automation architecture built and validated with pilot team data.',
      },
      {
        title: 'Migration and validation (wk 4–6)',
        body: 'Staged data migration with parallel-run validation. GitHub integration cutover for dev teams, the Givergy pattern.',
      },
      {
        title: 'Training and cutover (wk 6–8)',
        body: 'Role-based training, hypercare support, and Jira decommission planning.',
      },
    ],
  },
]

/** The hub's four service cards, in order, point at these anchors. */
export const ATLASSIAN_SERVICE_ANCHORS = ATLASSIAN_DEEP_DIVES.map((d) => `#${d.id}`)

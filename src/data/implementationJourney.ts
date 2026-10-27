/**
 * /implementation-packages delivery content: the phases of an implementation,
 * who does what in each, what is in and out of scope, what we need from the
 * client and what drives the timeline. No prices: those live on /pricing.
 */

export interface DeliveryPhase {
  number: string
  title: string
  summary: string
  weDo: string[]
  youDo: string[]
  youGet: string[]
}

export const DELIVERY_PHASES: DeliveryPhase[] = [
  {
    number: '01',
    title: 'Discovery and process analysis',
    summary: 'We look at how work actually moves through your teams before anyone opens a board.',
    weDo: [
      'Workshops with each team in scope',
      'Current tools, spreadsheets and workarounds mapped',
      'Automation and reporting opportunities scored by effort and payoff',
    ],
    youDo: [
      'Name one owner per team',
      'Give us access to the tools you use today',
      'Share a real example of the work, not a cleaned-up one',
    ],
    youGet: [
      'A written scope: the processes, boards, dashboards and integrations, and the order we build them in',
    ],
  },
  {
    number: '02',
    title: 'Solution design and configuration',
    summary: 'The workspace is designed around the process, then built in a sandbox you can review.',
    weDo: [
      'Board structure, naming and permissions designed',
      'Views, dashboards and native automations built',
      'Configuration reviewed with your team before go-live',
    ],
    youDo: ['Review the design at the checkpoint', 'Confirm the fields your reporting has to show'],
    youGet: ['A working workspace modelling the core processes, ready for your data'],
  },
  {
    number: '03',
    title: 'Data migration and integration',
    summary: 'Existing data moves across and the tools around monday.com get connected.',
    weDo: [
      'Lists, spreadsheets and legacy boards migrated',
      'Email, CRM, accounting and project tools connected',
      'Integrations tested with real records',
    ],
    youDo: ['Confirm which source is authoritative', 'Nominate who approves the cut-over'],
    youGet: [
      'Data in place, integrations running, and a record of what moved and what was left behind',
    ],
  },
  {
    number: '04',
    title: 'Training and onboarding',
    summary: 'Role-based sessions so admins, managers and daily users each know their part.',
    weDo: [
      'Separate sessions for admins, managers and daily users',
      'Short how-to recordings and written guides',
      'Admin handover: permissions, automations and what to change safely',
    ],
    youDo: ['Attend the sessions', 'Nominate internal champions per team'],
    youGet: ['Trained teams, admin documentation and a handover pack you keep'],
  },
  {
    number: '05',
    title: 'Go-live and ongoing support',
    summary: 'We watch the first weeks of real use and fix what they expose.',
    weDo: [
      'Rollout monitored with your champions',
      'Feedback gathered and automations tuned',
      'Fixes and refinements inside the agreed support window',
    ],
    youDo: ['Use the system for real work', 'Report friction early', 'Decide what changes next'],
    youGet: ['A stabilised system and a shortlist of sensible next improvements'],
  },
]

export const SCOPE_IN: string[] = [
  'Discovery workshops and process mapping',
  'Board, view, dashboard and permission build',
  'Native monday.com automations',
  'Integrations for the tools agreed in scope',
  'Data migration from the agreed sources',
  'Role-based training and written documentation',
  'Post-launch tuning inside the support window',
]

export const SCOPE_OUT: string[] = [
  'monday.com licence fees (bought separately, see /pricing)',
  'Third-party subscriptions for the tools we connect',
  'Custom code beyond native monday.com capability, quoted separately when it is needed',
  'Ongoing admin after the support window (that is Managed Services)',
  'Internal change management and HR rollout',
]

export const PREREQUISITES: { title: string; body: string }[] = [
  {
    title: 'A named owner',
    body: 'One person on your side who can make decisions about process, access and priorities.',
  },
  {
    title: 'Access, not screenshots',
    body: 'Admin access to the tools in scope, or someone who can grant it during the first workshop.',
  },
  {
    title: 'A real process',
    body: 'We would rather map the process that causes trouble than the one that looks good in a slide.',
  },
  {
    title: 'Two hours a week',
    body: 'Enough time from each team in scope to review, test and be trained.',
  },
]

export const DELIVERY_TIMELINE: { heading: string; body: string; drivers: string[] } = {
  heading: 'Two to four weeks is typical',
  body: 'Most engagements go live within two to four weeks of kickoff. A single-team build can be running inside a week. Wider rollouts with data migration and finance integrations take longer. The schedule is agreed during scoping, not discovered halfway through, and you get it in writing with the scope.',
  drivers: [
    'How many teams and processes are in scope',
    'How much data has to move, and how clean it is',
    'Which integrations are needed',
    'How quickly your team can review and test',
  ],
}

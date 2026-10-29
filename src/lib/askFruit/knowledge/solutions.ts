// Catalog of 45 solutions lifted from the 2026 Solutions Atlas mock.
// Data structure is intentionally preserved verbatim to keep the mock and the
// site in sync without a translation layer.

export type ProductType = "wm" | "crm" | "svc" | "ops" | "new"

export type IndustryKey =
  | "construction"
  | "manufacturing"
  | "real-estate"
  | "financial"
  | "healthcare"
  | "agency"
  | "field-service"
  | "people-ops"
  | "retail"
  | "logistics"
  | "nonprofit"
  | "energy"
  | "platform"
  | "australia"
  | "apac"
  | "uk"

export interface Module {
  name: string
  items: string[]
}

export interface Phase {
  pn: string
  name: string
  focus: string
}

export interface Solution {
  key: string
  tag: string
  productType: ProductType
  industries: IndustryKey[]
  enriched?: boolean
  title: string
  desc: string
  longDesc?: string
  highlights: [string, string][]
  outcomes?: string[]
  personas?: [string, string][]
  modules?: Module[]
  phases?: Phase[]
  kpis?: string[]
  integrations?: string[]
  team?: string
  mermaid: string
  cap: string
  useCases: [string, string][]
}

export const SOLUTIONS: Solution[] = [
    { key: 'c-commercial-ppm', tag: 'Work Management', productType: 'wm', industries: ['construction','australia','uk'], enriched: true,
      title: 'Construction Commercial PPM',
      desc: 'Phase-gated commercial build program that ties preconstruction, budget, schedule, submittals, RFIs, change orders, and closeout into one connected board family.',
      longDesc: 'A full operating spine for commercial GCs and owner-reps. Preconstruction, field, and finance all share one record, so the executive dashboard is a native view, not an export. Built for shops running multiple concurrent commercial jobs that need discipline on RFIs, change orders, and AIA billing without running a second PM system on the side.',
      highlights: [['Scope','Phase-gated commercial'],['Users','PMs, Supers, Execs'],['Strength','Budget + change control']],
      outcomes: [
        'Cut RFI cycle time by routing every RFI through a single, tracked channel.',
        'Protect job margin with live PCO-to-budget variance and forecast-to-complete.',
        'Shrink AIA billing cycle with structured pay app workflows tied to field progress.',
        'Surface portfolio-level risk to execs without a monthly slide-deck grind.'
      ],
      personas: [
        ['Executive Sponsor','Watches portfolio P&L, cash, and risk on the dashboard.'],
        ['Project Manager','Lives in schedule, RFIs, change orders, pay apps.'],
        ['Superintendent','Logs field daily, photos, safety, manpower.'],
        ['Finance Controller','Runs AIA billing, committed-cost roll-ups, GL sync.']
      ],
      modules: [
        { name: 'Preconstruction', items: ['Bid invitations and leveling', 'Estimating and assemblies', 'Schedule of values baseline'] },
        { name: 'Contracts', items: ['Owner and sub contracts', 'Insurance and bonds', 'Exhibits and addenda'] },
        { name: 'Field Ops', items: ['Daily logs and photos', 'Safety and toolbox talks', 'Manpower tracking'] },
        { name: 'RFIs & Submittals', items: ['RFI log with routing', 'Submittal register', 'Response SLA and escalations'] },
        { name: 'Change Orders', items: ['PCO log', 'Pricing and owner approval', 'Budget impact tied back to GL'] },
        { name: 'Finance', items: ['AIA G702/G703 billing', 'Retainage and lien waivers', 'Cost control and FTC'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Field + Finance Spine', focus: 'Precon, field, RFI, CO, AIA billing.' },
        { pn: 'Phase 02', name: 'Portfolio + Dashboards', focus: 'Executive view, risk heatmap, cost forecasting.' }
      ],
      kpis: ['RFI cycle time', 'PCO approval time', 'Schedule variance', 'Billing cycle days', 'Job fade vs baseline'],
      integrations: ['Procore', 'QuickBooks / Sage 300', 'DocuSign', 'Bluebeam', 'Gmail / Outlook'],
      team: '12-25 seats: execs, PMs, supers, finance.',
      mermaid: '',
      cap: 'Precon to closeout, with finance and execs reading from the same spine as the field.',
      useCases: [
        ['Lee Company','Multi-trade commercial program with field and finance rollups; portfolio-level exec reporting live.'],
        ['Structis','Commercial PPM with submittal and RFI control across concurrent active projects.'],
        ['Unispan','Commercial delivery ops with rigorous punch and closeout discipline on large scopes.']
      ] },

    { key: 'c-residential-hv', tag: 'Work Management', productType: 'wm', industries: ['construction','real-estate','australia','uk'], enriched: true,
      title: 'Construction Residential (High Volume)',
      desc: 'Lot-based residential build pipeline for production builders. Every lot moves through templated phases with punch-ready closeout so operations scale without adding PMs per unit.',
      longDesc: 'A residential production operating system for homebuilders. Lot, permit, trade, inspection, punch, and closing live on one spine so division leaders, superintendents, and warranty can share the same record. Designed to eliminate the classic production-builder problem of each community running a different spreadsheet and the trades all getting mixed signals.',
      highlights: [['Scope','Production homebuilders'],['Users','Land, Prod, Super'],['Strength','Templated lot flow']],
      outcomes: [
        'Compress cycle time with standardized lot templates across plans and communities.',
        'Cut trade rework by enforcing inspection-pass gates before next trade releases.',
        'Reduce warranty calls with structured buyer walkthrough and punch workflows.',
        'Make trade performance scorecards a continuous, not quarterly, conversation.'
      ],
      personas: [
        ['Division President','Portfolio cycle time, margin, warranty.'],
        ['Superintendent','Daily site and trade management per lot.'],
        ['Purchasing / Estimating','Options, upgrades, cost baselines.'],
        ['Warranty Manager','Post-close service workflow.']
      ],
      modules: [
        { name: 'Lot Inventory', items: ['Community and plan type', 'Release date', 'Options and upgrades'] },
        { name: 'Home Sales', items: ['Buyer profile and financing', 'Earnest money', 'Option selections'] },
        { name: 'Permitting', items: ['Submittal and plan check', 'Approvals and fees'] },
        { name: 'Production', items: ['Foundation through finish', 'Inspection gates', 'Trade scheduling'] },
        { name: 'QC & Walkthrough', items: ['Buyer orientation', 'Punch list', 'Re-walks'] },
        { name: 'Dashboards', items: ['Cycle time by plan', 'Trade scorecards', 'Defect density'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Lot-to-Close Spine', focus: 'Lot, sales, permit, production, QC, close.' },
        { pn: 'Phase 02', name: 'Trade Performance & Warranty', focus: 'Scorecards, defect analysis, warranty flow.' }
      ],
      kpis: ['Cycle time per plan', 'Trade defect rate', 'Buyer walk punch count', 'On-time close rate', 'Warranty call density'],
      integrations: ['Sales Simplicity', 'BuilderTrend', 'QuickBooks / Sage', 'Procore'],
      team: '15-40 seats: division leaders, sales, purchasing, production, warranty.',
      mermaid: '',
      cap: 'Every lot on the same spine, with inspection and punch as hard gates.',
      useCases: [
        ['Mod-U-Kraf Homes','Modular residential pipeline with lot templates across plan types.'],
        ['VETTA Windows','Residential trade partner integrated into builder lot cadence.'],
        ['Cascade Living','Senior-living residential pipeline with turn tracking.']
      ] },

    { key: 'c-commercial-lv', tag: 'Work Management', productType: 'wm', industries: ['construction','australia','uk'],
      title: 'Construction Commercial (Low Volume)',
      desc: 'Lighter commercial variant for shops running a small number of high-dollar jobs that need heavier documentation, compliance checks, and inspection rigor without full enterprise PPM overhead.',
      highlights: [['Scope','Low-volume commercial'],['Users','PM, Compliance'],['Strength','Docs and compliance']],
      mermaid: 'flowchart LR\n A[Bid or Proposal]-->B[Contract]\n B-->C[Mobilization]\n C-->D[Construction]\n D-->E[Inspections]\n E-->F[Handover]\n F-->G[Warranty]',
      cap: 'Fewer jobs, more documentation weight per job.',
      useCases: [['Allied Modular','Specialty commercial with inspection discipline.'],['SHS Power','Energy-sector commercial with compliance.'],['Gateway Fiber','Telecom construction with documented inspections.']] },

    { key: 'eng-ppm', tag: 'Work Management', productType: 'wm', industries: ['construction','people-ops','australia'],
      title: 'Fruition Engineering PPM',
      desc: 'Engineering-grade PPM for design teams, civil firms, and MEP shops. Utilization, WIP, and deliverable QA are first-class citizens.',
      highlights: [['Scope','AEC design firms'],['Users','PMs, Leads, Partners'],['Strength','Utilization and WIP']],
      mermaid: 'flowchart LR\n A[New Project]-->B[Resource Allocation]\n B-->C[Design Phase]\n C-->D[QA Review]\n D-->E[Client Review]\n E-->F[Revisions]\n F-->G[Final Deliverable]\n G-->H[Billing]',
      cap: 'Hours, deliverables, and billing tracked on the same spine.',
      useCases: [['Grid 151','Engineering firm with portfolio utilization reporting.'],['Parkhill','Multi-discipline engineering PPM with WIP visibility.'],['Cumming Group','Construction consulting PPM tied to client delivery.']] },

    { key: 'mfg-build-tracker', tag: 'Work Management', productType: 'wm', industries: ['manufacturing','australia','uk'], enriched: true,
      title: 'Manufacturing Project Build Tracker',
      desc: 'Shop-floor-aware build tracker connecting sales orders, BOMs, and production sequencing to delivery milestones. Built for configured-to-order shops.',
      longDesc: 'A per-project build tracker for manufacturers who ship by project, not by SKU. Sales orders, BOMs, procurement, production sequencing, QC, and shipping all share one spine. The executive view and the shop-floor view read from the same record, so the dashboard is never behind what is actually happening on the floor.',
      highlights: [['Scope','CTO manufacturing'],['Users','Ops, Prod, Sales'],['Strength','SO to ship linkage']],
      outcomes: [
        'Lock quoted margins with live actual-vs-quoted cost tracking per work order.',
        'Cut expedite costs by flagging low-stock items against open work orders daily.',
        'Improve first-pass yield with structured in-process and final QC gates.',
        'Ship on promised dates by making the dashboard the single truth.'
      ],
      personas: [
        ['Plant Manager','Schedule health, yield, labor variance.'],
        ['Production Planner','Work order release, sequencing, materials ready.'],
        ['Shop Floor Lead','Station-level progress, scrap, NCRs.'],
        ['Customer Service','Order status, promise dates.']
      ],
      modules: [
        { name: 'Sales Order', items: ['CRM handoff', 'CTO configuration', 'Engineering review'] },
        { name: 'BOM', items: ['Parts and assemblies', 'Sub-assemblies', 'Revisions'] },
        { name: 'Procurement', items: ['PO board', 'Receiving and QC', 'Raw inventory'] },
        { name: 'Production', items: ['Build sequence', 'Station and operator', 'QC gates'] },
        { name: 'Shipping', items: ['Pack and carrier', 'BOL and tracking', 'Promise date sync'] },
        { name: 'Dashboards', items: ['OTD', 'Build margin', 'First-pass yield'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Order-to-Ship Spine', focus: 'SO, BOM, procurement, production, ship.' },
        { pn: 'Phase 02', name: 'Cost + Quality Analytics', focus: 'Margin, yield, schedule analytics.' }
      ],
      kpis: ['On-time delivery', 'First-pass yield', 'Labor variance', 'Material cost variance', 'Expedite count'],
      integrations: ['NetSuite', 'SolidWorks PDM', 'Apollo', 'Shippo / EDI'],
      team: '15-50 seats: sales ops, engineering, planners, shop floor.',
      mermaid: '',
      cap: 'Every order has one spine from sale to ship, with cost and yield live.',
      useCases: [
        ['JOMAC','Custom manufacturing with per-project build tracking.'],
        ['Matcor Matsu','Tier-one manufacturing with production sequencing.'],
        ['Nemak','Global manufacturer with cross-plant build visibility.']
      ] },

    { key: 'erp-production', tag: 'Operations and ERP', productType: 'ops', industries: ['manufacturing','australia'], enriched: true,
      title: 'Fruition ERP Production',
      desc: 'Lightweight ERP overlay on monday.com covering inventory, purchasing, production, and fulfillment. Ideal for shops that have outgrown spreadsheets but do not justify a full ERP.',
      longDesc: 'A practical ERP spine built inside monday.com. Demand, supply, production, fulfillment, and finance live on one platform with GL sync to NetSuite or QuickBooks. Designed for the SMB manufacturer or distributor that has outgrown spreadsheets and Tribal Knowledge but does not want the weight of a full-stack enterprise ERP yet.',
      highlights: [['Scope','SMB manufacturing'],['Users','Ops, Finance'],['Strength','No second system']],
      outcomes: [
        'Replace spreadsheet MRP with a transparent, auditable supply plan.',
        'Protect cash by tightening inventory holds and cycle counts.',
        'Shrink close cycle with daily GL sync and clean COGS roll-up.',
        'Give leaders a single view of demand, supply, and margin without a data pull.'
      ],
      personas: [
        ['COO / GM','Demand, supply, and margin in one view.'],
        ['Planner','MRP, PO release, inventory health.'],
        ['Shop Floor','Work orders, labor, scrap, yield.'],
        ['Controller','GL sync, COGS, AR/AP posture.']
      ],
      modules: [
        { name: 'Demand', items: ['Sales orders and forecasts', 'EDI and web channel intake'] },
        { name: 'Supply Chain', items: ['MRP Lite', 'Purchase orders', 'Receiving and putaway'] },
        { name: 'Production', items: ['Work orders and routings', 'Shop floor clock-in', 'Finished goods'] },
        { name: 'Fulfillment', items: ['Pick and pack', 'Ship and BOL', 'Auto-invoice'] },
        { name: 'Finance', items: ['GL sync', 'COGS roll-up', 'Customer AR posture'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Operations Core', focus: 'Demand, supply, production, fulfillment.' },
        { pn: 'Phase 02', name: 'Finance + Analytics', focus: 'GL sync, COGS, margin analytics.' }
      ],
      kpis: ['Inventory turns', 'Stockout rate', 'Labor productivity', 'COGS variance', 'Close-cycle days'],
      integrations: ['NetSuite', 'QuickBooks', 'ShipStation', 'Shopify', 'EDI (SPS)'],
      team: '10-30 seats: ops, planners, shop, finance.',
      mermaid: '',
      cap: 'A real ERP spine without a second system or a re-platform project.',
      useCases: [
        ['DAKO Worldwide','SMB manufacturer running ops end-to-end on monday.com.'],
        ['American Bath Group','Multi-plant operations with NetSuite integration.'],
        ['Stand Industries','Industrial ops unified from demand to invoice.']
      ] },

    { key: 'ppm-general', tag: 'Work Management', productType: 'wm', industries: ['agency','people-ops','australia','uk'], enriched: true,
      title: 'Fruition PPM',
      desc: 'General-purpose portfolio and project management for services firms, internal PMOs, and agencies. Intake, prioritization, assignment, execution, and reporting.',
      longDesc: 'A general-purpose PPM spine for services firms, agencies, and internal PMOs. Intake, prioritization, charter, execution, risk, and change all share one record, with an exec portfolio view on top. Designed for teams that have twenty-plus concurrent projects and need one governance model instead of five.',
      highlights: [['Scope','Services and PMOs'],['Users','PMs, Leadership'],['Strength','Portfolio-wide lens']],
      outcomes: [
        'Stand up a governed demand intake that filters noise from real work.',
        'Protect team capacity with explicit utilization and capacity boards.',
        'Surface red status early with automated exec alerts, not ad-hoc emails.',
        'Tie benefits tracking to delivery so portfolios prove value, not just output.'
      ],
      personas: [
        ['PMO Leader','Governs intake, prioritization, resourcing.'],
        ['Project Manager','Runs plan, risk, change, status.'],
        ['Team Lead','Sees resource load and commitments.'],
        ['Exec Sponsor','Portfolio health, budget vs actual.']
      ],
      modules: [
        { name: 'Demand Intake', items: ['Business case form', 'Sponsor', 'Requested date'] },
        { name: 'Prioritization', items: ['Scoring model', 'Governance forum', 'Rolling backlog'] },
        { name: 'Execution', items: ['Project plan', 'Resourcing', 'Weekly status'] },
        { name: 'Risk & Change', items: ['Risk register', 'Change requests', 'Baselines'] },
        { name: 'Portfolio View', items: ['Executive health', 'Budget vs actual', 'Benefits tracking'] },
        { name: 'Utilization', items: ['Team load', 'Billable percent', 'WIP'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Governance + Delivery', focus: 'Intake, priority, execute, risk/change.' },
        { pn: 'Phase 02', name: 'Portfolio + Utilization', focus: 'Exec view, utilization, benefits.' }
      ],
      kpis: ['Intake-to-charter time', 'On-time delivery percent', 'Red status rate', 'Utilization', 'Benefits realized'],
      integrations: ['Gmail / Outlook', 'Slack', 'Jira', 'Harvest'],
      team: '10-80 seats: PMO leads, PMs, delivery teams, execs.',
      mermaid: '',
      cap: 'Intake to portfolio on one governed spine.',
      useCases: [
        ['BasePoint','Services-firm work management with rep accountability and delivery tracking.'],
        ['White Space Israel','Agency PPM with retainer and campaign tracking.'],
        ['Third Eye Global','Consulting PPM with client portfolio lens.'],
        ['Peter Thomas Designs','Design-firm PPM with per-client delivery.']
      ] },

    { key: 'hr', tag: 'Work Management', productType: 'wm', industries: ['people-ops','australia'],
      title: 'Fruition HR',
      desc: 'Full employee lifecycle: onboarding, PTO, performance, comp, and offboarding.',
      highlights: [['Scope','SMB to mid HR'],['Users','HR, People Ops'],['Strength','Lifecycle in one place']],
      mermaid: 'flowchart LR\n A[Hire]-->B[Onboarding]\n B-->C[Performance]\n C-->D[PTO and Comp]\n D-->E[Review Cycle]\n E-->F[Offboarding]',
      cap: 'The complete employee lifecycle on a single board family.',
      useCases: [['AAOS','Association HR with compliance-aware lifecycle.'],['1 Touch Office','Service-ops HR with onboarding and PTO.'],['Sanford Health','Health-system HR with performance cadences.']] },

    { key: 'ats', tag: 'Work Management', productType: 'wm', industries: ['people-ops','australia','uk'],
      title: 'Recruitment and Candidate Management',
      desc: 'Pipeline from req intake to offer with hiring-manager collaboration and structured scorecards.',
      highlights: [['Scope','ATS and hiring ops'],['Users','TA, Hiring Mgrs'],['Strength','Structured scorecards']],
      mermaid: 'flowchart LR\n A[Req Open]-->B[Sourcing]\n B-->C[Screen]\n C-->D[Interview Loop]\n D-->E[Scorecards]\n E-->F[Offer]\n F-->G[Accept and Handoff]',
      cap: 'Req to handoff with structured scorecards at every gate.',
      useCases: [['Sefaria','Nonprofit TA pipeline with hiring-manager collab.'],['Vistage','Member-services TA with structured scoring.'],['Goodwill SEGA','Mission-led hiring with onboarding handoff.']] },

    { key: 'assets', tag: 'Operations and ERP', productType: 'ops', industries: ['manufacturing','construction','logistics','australia'],
      title: 'Asset Management',
      desc: 'Fixed asset registry with maintenance schedules, depreciation, and check-out flow.',
      highlights: [['Scope','Equipment-heavy ops'],['Users','Ops, Maintenance'],['Strength','Check-out plus maintain']],
      mermaid: 'flowchart LR\n A[Acquire Asset]-->B[Tag and Register]\n B-->C[Assign to User]\n C-->D[Maintain]\n D-->E[Depreciate]\n E-->F[Retire]',
      cap: 'Acquire, assign, maintain, retire, reported cleanly.',
      useCases: [['Tidewater','Field-service asset tracking with maintenance schedules.'],['Red Dot Storage','Portfolio-wide fixed asset register.'],['Dultmeier','Distribution asset management with check-out.']] },

    { key: 'dream-crm', tag: 'CRM', productType: 'crm', industries: ['field-service','agency','real-estate','financial','retail','australia','uk'], enriched: true,
      title: 'Dream CRM',
      desc: 'Our opinionated, sales-first CRM on monday.com: leads, accounts, deals, activities, and forecasting in a cohesive shape.',
      longDesc: 'The sales-first CRM we actually believe in. Leads, qualification, opportunities, cadences, proposals, handoff, accounts, and renewals all share one governance model. Scales cleanly from a three-rep startup to a fifty-rep field sales team without becoming a Salesforce administration project.',
      highlights: [['Scope','B2B sales'],['Users','Reps, Mgrs, RevOps'],['Strength','Forecast-ready pipeline']],
      outcomes: [
        'Compress lead response time with round-robin routing and SLA alerts.',
        'Tighten forecast accuracy with structured stage criteria and weighted pipe.',
        'Make handoffs clean so CS starts with the scope the deal actually sold.',
        'Give managers a live activity and pipeline view without a weekly report.'
      ],
      personas: [
        ['SDR / BDR','Lead response, qualification, meetings set.'],
        ['Account Exec','Opportunity cycle, proposals, close.'],
        ['Sales Manager','Forecast, coaching, activity health.'],
        ['RevOps','Governance, reporting, automation.']
      ],
      modules: [
        { name: 'Lead Board', items: ['Source and scoring', 'Round-robin', 'SLA to first touch'] },
        { name: 'Opportunities', items: ['Stage criteria', 'Amount and close date', 'Product mix'] },
        { name: 'Cadence', items: ['Email / call / LinkedIn', 'Touch log', 'Owner rotation'] },
        { name: 'Proposals', items: ['Template', 'Pricing logic', 'DocuSign'] },
        { name: 'Accounts', items: ['Hierarchy', 'Whitespace map', 'Renewal dates'] },
        { name: 'Reporting', items: ['Forecast', 'Activity', 'LTV'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Pipeline Spine', focus: 'Lead to close with governed stages.' },
        { pn: 'Phase 02', name: 'Post-Sale + Reporting', focus: 'Handoff, accounts, forecast and activity.' }
      ],
      kpis: ['Lead response time', 'Qualification rate', 'Win rate', 'Sales cycle length', 'Forecast accuracy'],
      integrations: ['Apollo', 'Gmail / Outlook', 'Google Calendar', 'OpenPhone', 'DocuSign', 'Slack'],
      team: '5-50 seats: SDRs, AEs, Sales Mgmt, RevOps, CS/AM.',
      mermaid: '',
      cap: 'Lead through handoff and renewal on one opinionated spine.',
      useCases: [
        ['Blue Voice','CRM paired with service ops to protect LTV.'],
        ['Ace Hardware Corporate','Enterprise CRM pilot for franchise development.'],
        ['EcoGen','Energy CRM with renewal cadence.']
      ] },

    { key: 'sales-am', tag: 'CRM', productType: 'crm', industries: ['retail','real-estate','australia','uk'],
      title: 'Sales Account Management',
      desc: 'Post-sale account growth and renewal engine with whitespace and QBR cadence.',
      highlights: [['Scope','Post-sale growth'],['Users','AMs, CSMs, Execs'],['Strength','Renewal and whitespace']],
      mermaid: 'flowchart LR\n A[New Customer]-->B[Onboarding]\n B-->C[QBR Cadence]\n C-->D[Whitespace Map]\n D-->E[Expand]\n E-->F[Renew]',
      cap: 'Landed to expanded and renewed, with no blind spots.',
      useCases: [['EcoGen','Energy CRM with renewal cadence.'],['OneSource Water','Distribution account management with QBR.'],['Rates and Forms','Financial services account growth.']] },

    { key: 'trades', tag: 'Work Management', productType: 'wm', industries: ['construction','field-service','australia','uk'], enriched: true,
      title: 'Job Trades Management (Construction OS)',
      desc: 'A trades-first operating system: quoting, job scheduling, crew dispatch, and job costing for specialty contractors.',
      longDesc: 'A trades-first operating system built for specialty contractors who live on utilization and job margin. Sales, dispatch, field, billing, and reporting share one record per job. Crews see only what they need; the office sees everything. Cash and margin are visible per job, per crew, and per tech in real time.',
      highlights: [['Scope','Specialty trades'],['Users','Ops, Dispatch, Techs'],['Strength','Dispatch + job cost']],
      outcomes: [
        'Book more revenue per truck with smarter crew scheduling and routing.',
        'Collect faster by generating invoices at onsite-complete, not week-end.',
        'Protect margin with live labor, materials, and sub costs per job.',
        'Surface upsell and recall revenue with tech scorecards, not spreadsheets.'
      ],
      personas: [
        ['Owner / GM','Revenue per tech, margin, cash.'],
        ['Dispatcher','Calendar, routing, crew capacity.'],
        ['Crew Foreman','Job card, photos, materials.'],
        ['Billing / AR','Invoice cycle, collections aging.']
      ],
      modules: [
        { name: 'Sales & Quoting', items: ['Lead intake', 'Site visit', 'Quote build with margin check'] },
        { name: 'Crew Schedule', items: ['Calendar view', 'Crew capacity', 'Route planning'] },
        { name: 'Dispatch', items: ['Work orders', 'Mobile push', 'Arrival ETA'] },
        { name: 'Onsite', items: ['Clock-in', 'Photos', 'Materials used', 'Customer signature'] },
        { name: 'Job Cost', items: ['Labor hours', 'Materials and subs', 'Live margin'] },
        { name: 'Invoice & Collect', items: ['Auto-invoice', 'Aging and reminders', 'Payment'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Sales + Field Ops', focus: 'Lead to onsite complete.' },
        { pn: 'Phase 02', name: 'Finance + Scorecards', focus: 'Job cost, invoicing, tech performance.' }
      ],
      kpis: ['Revenue per tech', 'First-time-fix rate', 'Invoice cycle days', 'Job margin', 'Customer NPS'],
      integrations: ['ServiceTitan', 'QuickBooks', 'OpenPhone', 'Google Maps', 'DocuSign'],
      team: '20-60 seats: office, sales, field, finance.',
      mermaid: '',
      cap: 'Quote to paid with live margin at every step.',
      useCases: [
        ['Lee Company','Multi-trade specialty contractor operating system.'],
        ['Elliott Electrical','Electrical trades with crew dispatch.'],
        ['Lemko Electric','Electrical trades with job cost discipline.']
      ] },

    { key: 'estimating', tag: 'Operations and ERP', productType: 'ops', industries: ['construction','australia'],
      title: 'Financial Modelling and Estimating',
      desc: 'Estimate-to-budget conversion with assemblies, markups, and live variance reporting.',
      highlights: [['Scope','Estimating teams'],['Users','Estimators, PMs, CFO'],['Strength','Variance-back to budget']],
      mermaid: 'flowchart LR\n A[RFP or Takeoff]-->B[Assemblies]\n B-->C[Markup]\n C-->D[Bid Submitted]\n D-->E[Award]\n E-->F[Budget Handoff]\n F-->G[Variance Tracking]',
      cap: 'Estimate becomes budget, variance stays visible throughout.',
      useCases: [['Structis','Commercial estimator integrated with project board.'],['Pave America','Paving estimator with live job variance.'],['Baldwin Manor','Property estimator tied to turn budgets.']] },

    { key: 're-resi', tag: 'CRM', productType: 'crm', industries: ['real-estate','australia'], enriched: true,
      title: 'Real Estate CRM',
      desc: 'Listings, buyer pipelines, and transaction coordination purpose-built for residential brokerages.',
      longDesc: 'A residential brokerage CRM built around how teams actually work: leads, showings, offers, transaction coordination, and sphere marketing. Transaction coordinators get structured checklists; agents get a lightweight view; team leads get production metrics. No one has to babysit a spreadsheet.',
      highlights: [['Scope','Residential brokerages'],['Users','Agents, TCs'],['Strength','Transaction coordination']],
      outcomes: [
        'Compress lead-to-first-touch time with auto-assignment and SMS.',
        'Reduce closing delays with structured TC checklists and date tracking.',
        'Keep sphere warm with automated anniversary and home-tip cadences.',
        'Give team leaders honest production metrics without a CRM admin project.'
      ],
      personas: [
        ['Agent','Leads, showings, offers.'],
        ['Transaction Coordinator','Checklist, dates, docs.'],
        ['Team Leader','Production, sphere, recruiting.'],
        ['Marketing','Sphere and event cadence.']
      ],
      modules: [
        { name: 'Leads', items: ['Sources and nurture', 'Pre-approval', 'Needs and timeline'] },
        { name: 'Showings', items: ['Saved searches', 'Calendar invite', 'Feedback form'] },
        { name: 'Transaction Coordination', items: ['Under-contract checklist', 'Inspection and appraisal', 'Closing'] },
        { name: 'Sphere / Nurture', items: ['Anniversary and birthdays', 'Home tips', 'Referral asks'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Pipeline + TC', focus: 'Lead to close with TC discipline.' },
        { pn: 'Phase 02', name: 'Sphere + Analytics', focus: 'Post-close nurture and production metrics.' }
      ],
      kpis: ['Lead response time', 'Showings to offer rate', 'On-time close rate', 'Sphere touch frequency'],
      integrations: ['MLS', 'DocuSign', 'Gmail', 'BombBomb'],
      team: '3-20 seats: agents, TCs, team leader, marketing.',
      mermaid: '',
      cap: 'Agent-friendly pipeline plus disciplined TC workflow.',
      useCases: [
        ['Situate','Residential CRM with transaction coordination.'],
        ['Blue Horizon','Boutique brokerage CRM.'],
        ['Keller Williams','Team-level CRM overlay.']
      ] },

    { key: 're-comm', tag: 'CRM', productType: 'crm', industries: ['real-estate','australia','uk'],
      title: 'Real Estate Commercial CRM',
      desc: 'Deal-centric CRE CRM with tenant reps, comps, and lease lifecycle tracking.',
      highlights: [['Scope','CRE and tenant rep'],['Users','Brokers, Associates'],['Strength','Lease lifecycle']],
      mermaid: 'flowchart LR\n A[Prospect or Listing]-->B[Tour]\n B-->C[LOI]\n C-->D[Lease Draft]\n D-->E[Signing]\n E-->F[Tenant Operations]',
      cap: 'Prospect to signed lease with tenant ops continuity.',
      useCases: [['Marathon Group','Commercial portfolio CRM.'],['NorthPoint Development','Development and leasing pipeline.'],['Red Dot Storage','Storage portfolio lease lifecycle.']] },

    { key: 'fs-crm', tag: 'CRM', productType: 'crm', industries: ['financial','australia','uk'],
      title: 'Financial Services CRM',
      desc: 'Advisor and broker workflows with household structures, compliance flags, and service ticketing.',
      highlights: [['Scope','Advisors and brokers'],['Users','Advisors, Ops, Compliance'],['Strength','Household-aware']],
      mermaid: 'flowchart LR\n A[Prospect]-->B[Discovery]\n B-->C[Plan Proposal]\n C-->D[Onboarding]\n D-->E[Service Events]\n E-->F[Compliance Review]',
      cap: 'Prospect to compliant, service-ready client.',
      useCases: [['Rates and Forms','Advisory CRM with household structures.'],['Pinnacle Financial','Mid-market FS CRM.'],['Neoforce','Sales-and-service overlay for advisors.']] },

    { key: 'ag-crm', tag: 'CRM', productType: 'crm', industries: ['retail','australia'],
      title: 'Agriculture and Livestock CRM',
      desc: 'Buyer and grower CRM tied to herd, crop, and seasonal cycles with market-price triggers.',
      highlights: [['Scope','Ag and livestock'],['Users','Reps, Buyers'],['Strength','Market triggers']],
      mermaid: 'flowchart LR\n A[Herd or Crop Intake]-->B[Buyer Match]\n B-->C[Market Price Trigger]\n C-->D[Sale Agreement]\n D-->E[Delivery]\n E-->F[Post-sale Service]',
      cap: 'Commodity cycles drive action, not calendar nags.',
      useCases: [['Humalfa','Livestock feed CRM with seasonal cycles.'],['Fieldale Farms','Poultry CRM with buyer routing.'],['Simplot','Ag giant sales pipeline with triggers.']] },

    { key: 'retail-crm', tag: 'CRM', productType: 'crm', industries: ['retail','australia','uk'],
      title: 'Retail and Ecommerce CRM',
      desc: 'Multi-channel customer record with loyalty, LTV, and returns workflow.',
      highlights: [['Scope','Retail and DTC'],['Users','Marketing, CX'],['Strength','LTV and returns']],
      mermaid: 'flowchart LR\n A[Customer Identified]-->B[Purchase]\n B-->C[Loyalty Event]\n C-->D[Return or Service]\n D-->E[Repeat Purchase]\n E-->F[LTV Report]',
      cap: 'One customer graph across channels, reported cleanly.',
      useCases: [['Worldwise','CPG customer record with loyalty.'],['Retail Merchants Group','Retail CRM with multi-store rollup.'],['Ace Hardware Corporate','Franchise-aware retail CRM.']] },

    { key: 'solar-crm', tag: 'CRM', productType: 'crm', industries: ['energy','construction','australia','uk'],
      title: 'Solar CRM',
      desc: 'Residential and commercial solar deal flow: proposal, permitting, install scheduling, and PTO tracking.',
      highlights: [['Scope','Solar sales and install'],['Users','Reps, Ops, Permitting'],['Strength','Permit and install sync']],
      mermaid: 'flowchart LR\n A[Lead]-->B[Site Survey]\n B-->C[Proposal]\n C-->D[Contract]\n D-->E[Permitting]\n E-->F[Install]\n F-->G[PTO and Handover]',
      cap: 'Sales cannot outrun install capacity or permit timing.',
      useCases: [['Everlight Solar','Residential solar pipeline to PTO.'],['Sustainability Partners','Commercial solar and ESG ops.'],['SHS Power','Energy services with install scheduling.']] },

    { key: 'agency', tag: 'Work Management', productType: 'wm', industries: ['agency','australia','uk'],
      title: 'Global Digital Marketing Agency',
      desc: 'Agency operating model across retainers, campaigns, creative production, and client reporting cycles.',
      highlights: [['Scope','Agencies'],['Users','Account, Creative, Ops'],['Strength','Retainer + campaign']],
      mermaid: 'flowchart LR\n A[Retainer Signed]-->B[Brief Intake]\n B-->C[Creative Production]\n C-->D[Campaign Launch]\n D-->E[Reporting]\n E-->F[QBR and Renewal]',
      cap: 'Brief to renewal with reporting built into the flow.',
      useCases: [['White Space Israel','Multi-market agency ops.'],['Somatic Breathwork','Wellness-brand marketing ops.'],['The Wright Fit','Wellness agency with creative pipeline.']] },

    { key: 'cs-ticketing', tag: 'Service', productType: 'svc', industries: ['field-service','australia','uk'], enriched: true,
      title: 'Customer Service Ticketing',
      desc: 'Omnichannel ticketing with SLA enforcement, escalation pathing, and knowledge-base linkage.',
      longDesc: 'An omnichannel ticketing system built inside monday.com. Email, web form, phone, and chat all flow into one queue with triage, assignment, SLA tracking, escalation, and KB linkage. Works as a standalone desk or as the service layer behind any of the CRM solutions.',
      highlights: [['Scope','Customer service'],['Users','Agents, Supervisors'],['Strength','SLA discipline']],
      outcomes: [
        'Cut response time with auto-classification and SLA alerts.',
        'Increase first-time-fix with KB suggestions at the ticket.',
        'Reduce escalation drama with transparent tier handoffs.',
        'Give CS leadership honest perf metrics per agent and channel.'
      ],
      personas: [
        ['Tier 1 Agent','Works the queue.'],
        ['Tier 2 Specialist','Escalations and deep issues.'],
        ['Supervisor','SLA, scorecards, coaching.'],
        ['KB Editor','Maintains articles and templates.']
      ],
      modules: [
        { name: 'Intake', items: ['Email and web', 'Phone / chat', 'Unified queue'] },
        { name: 'Triage', items: ['Classify by product / severity', 'Assign by skill and load', 'SLA clock'] },
        { name: 'Resolution', items: ['Work ticket', 'KB suggestions', 'Escalation path'] },
        { name: 'Reporting', items: ['SLA health', 'Agent performance', 'Issue trends'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Queue + SLA', focus: 'Intake, triage, resolve, close.' },
        { pn: 'Phase 02', name: 'Analytics + KB', focus: 'SLA, agent, trend reporting and KB.' }
      ],
      kpis: ['First response time', 'Resolution time', 'SLA attainment', 'First-time-fix', 'CSAT'],
      integrations: ['Gmail / Outlook', 'Slack', 'OpenPhone', 'Intercom', 'Jira'],
      team: '8-60 seats: Tier 1, Tier 2, supervisors, KB editors.',
      mermaid: '',
      cap: 'SLA-first ticketing with escalation built into the default path.',
      useCases: [
        ['Blue Voice','Omnichannel service ticketing.'],
        ['Solis Mammography','Healthcare service ticketing.'],
        ['Clark Pest Control','Field-service ticket workflow.']
      ] },

    { key: 'integrations', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Integrations Suite',
      desc: 'Productionized connector patterns across Apollo, NetSuite, QuickBooks, OpenPhone, Qarma, DocuSign, Make.com, and N8N.',
      highlights: [['Scope','Systems integration'],['Users','RevOps, IT, Ops'],['Strength','Hardened patterns']],
      mermaid: 'flowchart LR\n A[Source System]-->B[Connector]\n B-->C[Field Mapping]\n C-->D[monday.com Board]\n D-->E[Downstream Systems]\n E-->F[Error Queue]',
      cap: 'Source to monday.com to downstream with an error queue, not a black box.',
      useCases: [['American Bath Group','NetSuite to monday.com production sync.'],['Humalfa','QuickBooks invoice and AR sync.'],['Aqua Oasis','OpenPhone call events in the CRM record.']] },

    { key: 'pool-construction', tag: 'New in 2026', productType: 'new', industries: ['construction','australia'], enriched: true,
      title: 'Pool Construction CRM + PPM',
      desc: 'Hybrid sales-and-build operating system for pool contractors: design quoting, permits, dig schedule, and punch.',
      longDesc: 'A purpose-built hybrid CRM + PPM for pool contractors. One unified record moves a client from first lead through closeout, covering design, quoting, permits, dig, plumb, plaster, punch, invoicing, and post-install nurture. Designed to eliminate the classic pool-contractor problem where sales sells what operations cannot deliver because the two systems do not talk.',
      highlights: [['Scope','Pool contractors'],['Users','Sales, Design, Ops'],['Strength','CRM and PPM unified']],
      outcomes: [
        'Cut quote-to-signed cycle time by tying renders and pricing to one record.',
        'Eliminate sales-to-ops drops with automated project-board spawn on signature.',
        'Protect margin with live budget variance reported from the field.',
        'Increase referrals with structured post-install nurture and check-ins.'
      ],
      personas: [
        ['Sales Consultant','Captures lead, runs site visit, generates quote.'],
        ['Designer','3D renders, material lists, showroom meeting.'],
        ['Project Manager','Post-signature handoff, trade and material scheduling.'],
        ['Crew Foreman','Field progress, photos, punch list.']
      ],
      modules: [
        { name: 'CRM Board', items: ['Lead intake FB/IG/Google/website/referrals', 'Client profile with language and budget', 'Site measurements and quote'] },
        { name: 'Design Board', items: ['3D render requests', 'Showroom meeting prep', 'Contract signing and deposit'] },
        { name: 'Project Management', items: ['PM handoff with AutoCAD plans', 'Project calendar with trades and materials', 'Daily task tracking and photos'] },
        { name: 'Purchasing Board', items: ['Purchase orders with supplier info', 'Delivery tracking and flags', 'Punch list with photo attachments'] },
        { name: 'Finance Board', items: ['Invoice management with DocuSign', 'Budget tracking with variance', 'Accounting integration QuickBooks or Avantage'] },
        { name: 'Client Portal', items: ['Project schedule', 'Progress photos and change orders', 'Message center and approvals'] }
      ],
      phases: [
        { pn: 'Phase 01', name: 'Sales to Build', focus: 'CRM, Design, PM, Purchasing.' },
        { pn: 'Phase 02', name: 'Finance and Nurture', focus: 'Finance, Dashboards, Client Portal, Nurture.' }
      ],
      kpis: ['Lead to signed conversion', 'Quote cycle time', 'Budget variance per job', 'Portal engagement', 'Post-install NPS'],
      integrations: ['Google Calendar', 'DocuSign', 'QuickBooks / Avantage', 'Gmail / Outlook', 'WhatsApp', 'OpenPhone'],
      team: '12-15 seats: Design, PM, Field, Support.',
      mermaid: '',
      cap: 'One record moves from sales to closeout, not two.',
      useCases: [
        ['Aqua Oasis','Pool construction CRM and build tracker combined.'],
        ['JIM Property Services','Property-side pool turn tracking.'],
        ['Kitchen Tune-Up','Franchise trades with similar sales-and-build pattern.']
      ] },

    { key: 'property-os', tag: 'New in 2026', productType: 'new', industries: ['real-estate','australia','uk'],
      title: 'Property Management OS',
      desc: 'Unit, tenant, and maintenance ticket operating system for small-to-mid property operators.',
      highlights: [['Scope','SMB property mgmt'],['Users','PM, Maintenance'],['Strength','Turn and inspection']],
      mermaid: 'flowchart LR\n A[Unit and Tenant]-->B[Move-in]\n B-->C[Maintenance Ticket]\n C-->D[Vendor Dispatch]\n D-->E[Turn on Move-out]\n E-->F[Inspection and Re-list]',
      cap: 'The full tenant lifecycle plus vendor dispatch on one spine.',
      useCases: [['Baldwin Manor','Turn-tracking property OS.'],['RPM','Mid-market property portfolio ops.'],['First Service Residential','Residential property management ops.']] },

    { key: 'nonprofit', tag: 'New in 2026', productType: 'new', industries: ['nonprofit','australia','uk'],
      title: 'Nonprofit Solution',
      desc: 'Donor, grant, and program management with outcome tracking and board reporting.',
      highlights: [['Scope','Nonprofit ops'],['Users','Dev, Programs, ED'],['Strength','Outcome tracking']],
      mermaid: 'flowchart LR\n A[Donor Pipeline]-->B[Campaign]\n B-->C[Grant Application]\n C-->D[Program Execution]\n D-->E[Outcome Tracking]\n E-->F[Board Report]',
      cap: 'Donor to outcome to board report without hand-exports.',
      useCases: [['ETR','Education nonprofit program and grants.'],['Goodwill SEGA','Mission ops with outcome tracking.'],['Sefaria','Nonprofit platform with donor and program flow.']] },

    { key: 'wealth-crm', tag: 'New in 2026', productType: 'new', industries: ['financial','uk'],
      title: 'Wealth Management CRM',
      desc: 'Advisor-facing CRM with household trees, review cadences, compliance checklists, and custodian integrations.',
      highlights: [['Scope','Wealth management'],['Users','Advisors, Ops, Compliance'],['Strength','Household tree']],
      mermaid: 'flowchart LR\n A[Prospect]-->B[Discovery]\n B-->C[Financial Plan]\n C-->D[Onboarding]\n D-->E[Review Cadence]\n E-->F[Compliance Checkpoints]',
      cap: 'Discovery to compliance-safe review cadence on autopilot.',
      useCases: [['LCG Advisors','RIA-style wealth management CRM.'],['Pinnacle Financial','Hybrid advisor and broker CRM.'],['Neoforce','Sales-and-service CRM for advisors.']] },

    { key: 'claims', tag: 'New in 2026', productType: 'new', industries: ['financial','field-service','australia'],
      title: 'Insurance Claims Management',
      desc: 'First-notice-of-loss through settlement with adjuster routing, SLA alarms, and document trails.',
      highlights: [['Scope','Claims ops'],['Users','FNOL, Adjusters'],['Strength','SLA and audit trail']],
      mermaid: 'flowchart LR\n A[FNOL Intake]-->B[Triage]\n B-->C[Adjuster Assigned]\n C-->D[Investigation]\n D-->E[Settlement Offer]\n E-->F[Close and Pay]',
      cap: 'Loss notice to payment with SLA enforced at every gate.',
      useCases: [['AIC Claims','Specialty claims ops build.'],['Gallop Insurance','Claims management with adjuster routing.'],['Resilience','Cyber insurance claims and audit trail.']] },

    { key: 'training', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','uk'],
      title: 'monday.com Training and Enablement',
      desc: 'Structured enablement program: role-based training paths, certification tracking, and office hours cadence.',
      highlights: [['Scope','Change management'],['Users','Ops, People, Leaders'],['Strength','Role-based paths']],
      mermaid: 'flowchart LR\n A[Skill Assessment]-->B[Role-based Path]\n B-->C[Learning Sessions]\n C-->D[Certification]\n D-->E[Office Hours]\n E-->F[Re-assessment]',
      cap: 'Enablement as a closed loop, not a single kickoff.',
      useCases: [['Hazel Health','Health-system enablement cadence.'],['Parkhill','Engineering firm admin enablement.'],['Cumming Group','Consulting firm rollout and certification.']] },

    { key: 'migration', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','uk'],
      title: 'Migration Services',
      desc: 'Repeatable playbook for moving off Smartsheet, Asana, ClickUp, Airtable, and Salesforce into monday.com.',
      highlights: [['Scope','Platform migrations'],['Users','Admins, PMOs'],['Strength','No-gap cutover']],
      mermaid: 'flowchart LR\n A[Source System Audit]-->B[Mapping]\n B-->C[Data Prep]\n C-->D[Migrate]\n D-->E[Validate]\n E-->F[Go-live]\n F-->G[Hypercare]',
      cap: 'Audit to hypercare, with validation as its own gate.',
      useCases: [['Fuse Medical','Salesforce to monday.com migration.'],['Solis Mammography','Smartsheet to monday.com migration.'],['Corporate Traveler','Asana to monday.com migration.']] },

    { key: 'ai-agents', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'AI Agent Enablement',
      desc: 'Productionized monday.com AI agents for triage, drafting, classification, and report summarization.',
      highlights: [['Scope','AI automation'],['Users','Ops, Ops Leaders'],['Strength','Measured rollout']],
      mermaid: 'flowchart LR\n A[Use Case Intake]-->B[Data Prep]\n B-->C[Agent Config]\n C-->D[Test and Tune]\n D-->E[Deploy]\n E-->F[Monitor and Measure]',
      cap: 'Narrow use case to measured production in a documented path.',
      useCases: [['Engraphix','AI triage for incoming signage orders.'],['Third Eye Global','Report-summarization agent for consulting.'],['Blue Voice','Ticket-triage agent on the service desk.']] },

    { key: 'proposal-auto', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Proposal and Project Plan Automation',
      desc: 'Template-driven proposal generation tied back to monday.com scope, pricing, and kickoff boards.',
      highlights: [['Scope','Sales to delivery'],['Users','Sales, Delivery Ops'],['Strength','One source for both']],
      mermaid: 'flowchart LR\n A[Intake Form]-->B[Scope Builder]\n B-->C[Pricing Engine]\n C-->D[Proposal Generated]\n D-->E[Signed]\n E-->F[Project Board Spawned]',
      cap: 'Signature triggers the build board, not a second intake call.',
      useCases: [['Internal Fruition','Our own proposal-to-kickoff automation.'],['White Space Israel','Agency proposal-to-retainer flow.'],['Third Eye Global','Consulting proposal auto-spawning projects.']] },

    { key: 'healthcare', tag: 'New in 2026', productType: 'new', industries: ['healthcare','australia','uk'],
      title: 'Healthcare Practice Solution',
      desc: 'Specialty-practice operations with intake, referrals, protocol tracking, and patient-facing workflows.',
      highlights: [['Scope','Specialty practices'],['Users','Front desk, Clinical, Ops'],['Strength','Protocol discipline']],
      mermaid: 'flowchart LR\n A[Patient Intake]-->B[Scheduling]\n B-->C[Protocol Applied]\n C-->D[Visit]\n D-->E[Followup]\n E-->F[Billing and Reporting]',
      cap: 'A non-EMR ops spine for specialty practices.',
      useCases: [['Nsight Health','Specialty practice ops on monday.com.'],['Fuse Medical','Provider-ops with protocol tracking.'],['Summit Behavioral','Behavioral-health practice ops.']] },

    { key: 'fleet', tag: 'New in 2026', productType: 'new', industries: ['logistics','uk'],
      title: 'Logistics and Fleet OS',
      desc: 'Fleet, driver, and dispatch operating system for logistics operators with maintenance and fuel reporting overlays.',
      highlights: [['Scope','Fleet and 3PL'],['Users','Dispatch, Drivers, Ops'],['Strength','Dispatch + maintenance']],
      mermaid: 'flowchart LR\n A[Order Intake]-->B[Dispatch]\n B-->C[Route Assigned]\n C-->D[Driver Log]\n D-->E[Delivery]\n E-->F[Maintenance Cycle]',
      cap: 'One spine across dispatch, delivery, and maintenance.',
      useCases: [['Unified Fleet','Fleet ops with driver logs and maintenance.'],['Craters and Freighters','3PL dispatch and delivery.'],['Westcor','Logistics dispatch and delivery operations.']] },

    { key: 'signage', tag: 'New in 2026', productType: 'new', industries: ['construction','australia'],
      title: 'Signage and Architectural Firm Solution',
      desc: 'Design-to-install pipeline for signage and architectural shops with fabrication and site-install tracking.',
      highlights: [['Scope','Signage and architectural'],['Users','Design, Fab, Install'],['Strength','Design to site']],
      mermaid: 'flowchart LR\n A[Design Request]-->B[Concept]\n B-->C[Approval]\n C-->D[Fabrication]\n D-->E[Site Install]\n E-->F[Punch and Close]',
      cap: 'Design to install with fab and site as first-class phases.',
      useCases: [['Engraphix','Signage shop design-to-install ops.'],['Mobile Solutions','Dealer-install signage workflow.'],['Peter Thomas Designs','Architectural design to install pipeline.'],['Dream Drafting Sydney','AU drafting and signage ops.'],['Zencos Architectural','UK architectural signage pipeline.']] },

    { key: 'proploy', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Proploy',
      desc: 'Vendor and procurement marketplace with AI-driven brief generation, structured vendor responses, and milestone-based payments. Built as FastAPI and Next.js with monday.com as the operational spine.',
      highlights: [['Scope','Procurement marketplace'],['Users','Ops, Procurement, Vendors'],['Strength','AI briefs + milestones']],
      mermaid: 'flowchart LR\n A[Brief Intake]-->B[AI Scope Builder]\n B-->C[Vendor Match]\n C-->D[Responses]\n D-->E[Selection]\n E-->F[Milestone Payments]',
      cap: 'AI briefs in, milestone payouts out, monday.com runs the spine.',
      useCases: [['Fruition Internal','Our own vendor procurement and payout flow.'],['OG Labs','Vendor brief engine for agency clients.'],['Proploy Beta','Live client pilots across AU and UK.']] },

    { key: 'reachly', tag: 'New in 2026', productType: 'new', industries: ['platform','agency','australia','apac','uk'],
      title: 'Reachly Outbound Engine',
      desc: 'Clay-powered outbound SDR engine targeting construction, manufacturing, and services verticals. Delivered as a done-for-you retainer or as white-label infrastructure for partners.',
      highlights: [['Scope','Outbound SDR'],['Users','Growth, Sales, Partners'],['Strength','Clay + monday + AI']],
      mermaid: 'flowchart LR\n A[ICP Definition]-->B[Clay Enrichment]\n B-->C[AI Copy]\n C-->D[Multi-Channel Send]\n D-->E[Reply Triage]\n E-->F[monday.com Handoff]',
      cap: 'ICP to booked meeting without a human in the middle of the top of funnel.',
      useCases: [['Fruition Internal','Our own outbound engine feeding APAC and UK pipelines.'],['Partner White-Label','Licensed to agencies as a turnkey outbound infra.']] },

    { key: 'content-system', tag: 'New in 2026', productType: 'new', industries: ['agency','platform','australia','apac','uk'],
      title: 'Content Creation System',
      desc: 'End-to-end editorial pipeline covering ideation, drafting, approval, scheduling, and distribution across social, blog, and email channels on top of monday.com.',
      highlights: [['Scope','Editorial pipeline'],['Users','Marketing, Content, Social'],['Strength','Ideation to publish']],
      mermaid: 'flowchart LR\n A[Ideation]-->B[Drafting]\n B-->C[Approval]\n C-->D[Scheduling]\n D-->E[Distribution]\n E-->F[Performance Loop]',
      cap: 'Ideation to published measured content on one spine.',
      useCases: [['Fruition Marketing','Our own editorial spine running the atlas and case studies.'],['Thinkerbell','Creative agency content ops on monday.com.'],['Tourism Australia','National tourism editorial pipeline.']] },

    { key: 'fruition-security', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Fruition Security',
      desc: 'Managed cyber-security uplift and compliance posture offering, built from our own internal uplift program and resold as a retainer across all three regions.',
      highlights: [['Scope','Security uplift'],['Users','Ops leaders, CTOs, Compliance'],['Strength','SOC 2 aligned']],
      mermaid: 'flowchart LR\n A[Posture Audit]-->B[Gap Analysis]\n B-->C[Uplift Plan]\n C-->D[Controls Deployed]\n D-->E[Evidence Collection]\n E-->F[Ongoing Monitoring]',
      cap: 'Audit to ongoing monitoring, with evidence collection built in.',
      useCases: [['Fruition Internal','Our own SOC 2 aligned uplift program.'],['Senzo','Partner organization security uplift.'],['Client retainers','Active across US, APAC, and UK.']] },

    { key: 'marketing-agent', tag: 'New in 2026', productType: 'new', industries: ['agency','platform','australia','apac','uk'],
      title: 'Marketing Agent',
      desc: 'Productized monday.com marketing AI agent that drafts campaign plans, rewrites branded content, and sequences outbound moves aligned to each client ICP.',
      highlights: [['Scope','Marketing AI'],['Users','CMO, Growth, Agency'],['Strength','Campaign to send']],
      mermaid: 'flowchart LR\n A[ICP Intake]-->B[Campaign Plan]\n B-->C[AI Drafting]\n C-->D[Human Review]\n D-->E[Scheduled Send]\n E-->F[Measure + Iterate]',
      cap: 'Brief in, scheduled and measurable campaigns out.',
      useCases: [['Fruition Marketing','Our own marketing agent.'],['Tourism Australia','Editorial assistance for social.'],['UK Agencies','Outbound content assistance for retainer clients.']] },

    { key: 'kb-chatbot', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Knowledge Base Chatbot',
      desc: 'RAG-powered chatbot trained on a client’s monday.com boards, Confluence, and Google Drive for self-serve answers to internal support queries.',
      highlights: [['Scope','Internal support'],['Users','Ops, Support, Everyone'],['Strength','Self-serve knowledge']],
      mermaid: 'flowchart LR\n A[Source Ingest]-->B[Indexing]\n B-->C[RAG Retrieval]\n C-->D[LLM Answer]\n D-->E[Source Citations]\n E-->F[Feedback Loop]',
      cap: 'Internal knowledge in, cited answers out.',
      useCases: [['Fruition Internal','Our own knowledge base chatbot on monday boards and drive.']] },

    { key: 'fireflies-pipeline', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Fireflies Automation Pipeline',
      desc: 'Meeting-to-monday pipeline: Fireflies transcript triggers AI summary, action-item extraction, monday.com item creation, and Slack digests.',
      highlights: [['Scope','Meeting ops'],['Users','Sales, Delivery, Ops'],['Strength','No-lift capture']],
      mermaid: 'flowchart LR\n A[Meeting]-->B[Fireflies Transcript]\n B-->C[AI Summary]\n C-->D[Action Items]\n D-->E[monday Item Created]\n E-->F[Slack Digest]',
      cap: 'Conversation to structured work item without a lift.',
      useCases: [['Fruition Internal','Every client call auto-creates follow-ups on monday.']] },

    { key: 'workload-dash', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Workload and Home Dashboards',
      desc: 'Fruition’s internal resourcing and home dashboards, now offered as a client-facing PMO telemetry layer on top of any monday.com implementation.',
      highlights: [['Scope','PMO telemetry'],['Users','PMO, Delivery Leads'],['Strength','Utilization at a glance']],
      mermaid: 'flowchart LR\n A[Time Source]-->B[Allocation Model]\n B-->C[Home Dashboards]\n C-->D[Utilization Signals]\n D-->E[Manager Alerts]\n E-->F[Rebalance Plan]',
      cap: 'Utilization to rebalance plan in one view.',
      useCases: [['Fruition Internal','Our home dashboard running team workload visibility.']] },

    { key: 'crm-demo-env', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Dream CRM Demo Environment',
      desc: 'Pre-built demo monday.com CRM environment that lets prospects evaluate the full Dream CRM without a dedicated implementation kickoff.',
      highlights: [['Scope','Sales enablement'],['Users','AEs, Prospects'],['Strength','Zero setup trial']],
      mermaid: 'flowchart LR\n A[Prospect Request]-->B[Demo Env Spawned]\n B-->C[Sample Data Loaded]\n C-->D[Prospect Explores]\n D-->E[Hand to Implementation]\n E-->F[Live Build]',
      cap: 'A demo environment that converts directly into a live build.',
      useCases: [['Fruition Sales','Used with every Dream CRM evaluation call.']] },

    { key: 'handover-auto', tag: 'New in 2026', productType: 'new', industries: ['platform','australia','apac','uk'],
      title: 'Sales-to-Delivery Handover Automation',
      desc: 'Signed proposal in, project board and work order out. Replaces DocuSign handoff and eliminates duplicate sales-to-delivery kickoff calls across all three regions.',
      highlights: [['Scope','Cross-region handover'],['Users','Sales, Delivery'],['Strength','One handoff trigger']],
      mermaid: 'flowchart LR\n A[Signed Proposal]-->B[Work Order Spawned]\n B-->C[Project Board Spawned]\n C-->D[Delivery Assigned]\n D-->E[Kickoff Scheduled]\n E-->F[Clockify Project Ready]',
      cap: 'Signature triggers the full delivery stack, no second kickoff call.',
      useCases: [['Fruition Internal','Our own sales-to-delivery handover running across US, APAC, and UK.']] }
]

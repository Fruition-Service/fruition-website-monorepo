/**
 * Turn the eight /customer-testimonials case studies from images into text.
 *
 * Each case study was a single designed image (challenge, solution, impact,
 * quote, facts), so none of it was readable by search engines. This writes the
 * same copy, transcribed verbatim from those images, into the structured fields
 * on each `caseStudyCards[]` entry of page-customer-testimonials, and uploads
 * the client logo and headshots cropped from them (public/images/case-studies).
 *
 * The one deviation from the images: the em dash in the Givergy quote is a
 * comma, per the site's no-dash house style.
 *
 *   npx tsx scripts/sanity-migrate/case-study-text.ts           # dry run
 *   npx tsx scripts/sanity-migrate/case-study-text.ts --apply   # write
 *
 * Idempotent: re-running overwrites these fields with the same values.
 */
import { writeClient, uploadLocalImage } from "./lib"

const PAGE_ID = "page-customer-testimonials"
const APPLY = process.argv.includes("--apply")

// ── Portable Text helpers ──────────────────────────────────────────────────

type Item = string | [string, string[]]

interface Span { _type: "span"; _key: string; text: string; marks: string[] }
interface Block {
  _type: "block"
  _key: string
  style: "normal"
  markDefs: []
  children: Span[]
  listItem?: "bullet" | "number"
  level?: number
}

let keySeq = 0
const k = () => `k${(keySeq++).toString(36)}`

/** `**text**` (the whole line) renders bold, matching the bold lines in the images. */
function block(text: string, list?: "bullet" | "number", level = 1): Block {
  const bold = text.startsWith("**") && text.endsWith("**")
  const b: Block = {
    _type: "block",
    _key: k(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: k(), text: bold ? text.slice(2, -2) : text, marks: bold ? ["strong"] : [] }],
  }
  if (list) {
    b.listItem = list
    b.level = level
  }
  return b
}

const p = (text: string) => [block(text)]

function list(kind: "bullet" | "number", items: Item[]): Block[] {
  return items.flatMap((item) =>
    typeof item === "string"
      ? [block(item, kind)]
      : [block(item[0], kind), ...item[1].map((sub) => block(sub, "bullet", 2))],
  )
}
const ul = (...items: Item[]) => list("bullet", items)
const ol = (...items: Item[]) => list("number", items)

// ── Content ────────────────────────────────────────────────────────────────

interface Person { name: string; role: string; company?: string; photo: string }
interface Metric { value: string; label: string; note?: string }
interface CaseStudy {
  clientName: string
  logo: string
  quote: string
  people: Person[]
  challenge: Block[]
  solution: Block[]
  metrics: Metric[]
  impact: Block[]
  location: string
  companySize: string
  sector: string
  useCase: string
}

const IMG = "/images/case-studies"
const roi = (value: string): Metric => ({ value, label: "Licenses & Services" })
const perYear = (value: string): Metric => ({ value, label: "Saved per year" })

const CASE_STUDIES: Record<string, CaseStudy> = {
  "cs-bl-air": {
    clientName: "BL Air Conditioning",
    logo: `${IMG}/bl-air-logo.png`,
    quote: 'This system will save "hundreds of thousands of dollars a year guaranteed"',
    people: [{ name: "Brandon-Lee Horridge", role: "Managing Director", company: "BL Air Conditioning", photo: `${IMG}/bl-air-person-1.jpg` }],
    challenge: ul(
      "Manual tracking of installation progress across hundreds of units per project",
      "No standardized process for operations managers to follow",
      "Quality assurance documentation scattered across different systems",
      "Difficulty maintaining oversight of multiple concurrent projects",
      "Time-consuming manual reporting process for client updates",
      "Limited ability to forecast resource availability for new projects",
      "Risk of missed steps in quality control process",
      "No central system for photo documentation and sign-offs",
    ),
    solution: ul(
      "Implemented Monday.com with custom templates for different project types",
      ["Created automated workflows for:", [
        "Project setup based on scope and scale",
        "Unit-level quality control checklists",
        "Photo documentation linked to specific tasks",
        "Progress tracking and reporting",
        "Client communication",
      ]],
      "Built mobile-friendly interface for on-site updates",
      "Integrated automated PDF generation for professional client reporting",
      "Established progress tracking at unit, level and project-wide scale",
      "Created standardized processes for operations managers",
    ),
    metrics: [roi("17x ROI"), perYear("540 hrs"), perYear("$125,000")],
    impact: [
      ...p("Time Savings Per Project:"),
      ...ul(
        "Assume 15 minutes saved per unit in documentation/QA process",
        "Average 100 units per project = 25 hours saved per project",
        "2 hours saved per week in progress reporting = 8 hours per month",
        "3 hours saved per week in project planning/oversight = 12 hours per month",
        "**Total monthly time savings: 45 hours**",
      ),
    ],
    location: "Brisbane, QLD",
    companySize: "10+",
    sector: "Industrial",
    useCase: "Project Management",
  },

  "cs-clsq": {
    clientName: "CLSQ",
    logo: `${IMG}/clsq-logo.png`,
    quote: "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.",
    people: [{ name: "Lorenzo Tejada-Orrell", role: "Chief Innovation Officer", company: "CLSQ", photo: `${IMG}/clsq-person-1.jpg` }],
    challenge: ul(
      "No centralized project management system implemented across the 50-person organization",
      "Different departments adopting various disconnected approaches to project management",
      "Manual processes requiring duplication of data entry between Azure DevOps and reporting systems",
      "Lack of visibility for senior leadership team and board into development project status",
      "Existing workflow processes that need complete restructuring",
      "No standardized approach to Sprint management and development project tracking",
      "Manual approval process using Word documents sent to decision makers, then manually added to spreadsheets",
    ),
    solution: ul(
      ["Monday.com Work Management platform with:", [
        "Project portfolio dashboard for leadership oversight",
        "Resource allocation visualization across 50+ employees",
        "Real-time project dependencies and timeline tracking",
      ]],
      ["Custom workflow automation for:", [
        "Project approval process (replacing manual word documents)",
        "Automated task assignment and notifications",
        "Cross-departmental communication",
        "Integration of disconnected systems",
      ]],
      ["Implementation services:", [
        "Microsoft Project data migration",
        "Admin and workflow training (5-6 hours total)",
        "Ongoing support and customization assistance",
      ]],
    ),
    metrics: [roi("3x ROI"), perYear("260 hrs"), perYear("$13,000")],
    impact: p(
      "This integrated Monday.com solution allowed CLSQ to centralize their project operations without losing departmental autonomy. Automated approval workflows streamlined their complex project initiation processes, portfolio dashboard access enhanced leadership visibility into resource allocation, and multi-level board structures improved cross-departmental collaboration.",
    ),
    location: "London, United Kingdom",
    companySize: "51-200",
    sector: "Real Estate",
    useCase: "Project Management",
  },

  "cs-givergy": {
    clientName: "Givergy",
    logo: `${IMG}/givergy-logo.png`,
    quote:
      "We found Monday to be more customisable and transparent for both internal and external stakeholders. It reduced double handling of issues, as the Monday boards provide clear, accessible information, eliminating the need to email around for updates.",
    people: [
      { name: "Mairhead McKinley", role: "Delivery Manager", company: "Givergy", photo: `${IMG}/givergy-person-1.jpg` },
      { name: "Swav Swiac", role: "Head of Technology Development", company: "Givergy", photo: `${IMG}/givergy-person-2.jpg` },
    ],
    challenge: [
      ...p("Givergy faced significant challenges with their JIRA and BitBucket system - communication silos between teams, poor visibility of project status, and technical frustrations."),
      ...p('Swav, who leads the Development Team found the platform "glitchy and complicated," with team members struggling with limited transparency, inadequate editing capabilities, and slow performance.'),
      ...p("These issues severely hampered collaboration across their five-country operation and prevented clients from accessing critical development information."),
    ],
    solution: [
      ...p("The team delivered a comprehensive solution by migrating from JIRA to mondayDev with GitHub integration."),
      ...p("The solution features several key requirements from the Givergy team:"),
      ...ul(
        "GitHub integration with automated branch tracking and status updates",
        "Flexible sprint management across multiple concurrent releases",
        "Multi-repository task management with unified visibility",
        "Role-based dashboards for developers, QA and management",
        "Customisable workflow automation to reduce manual processes",
        "Centralised release tracking with version control integration",
      ),
      ...p("The new system preserves Givergy's established development processes while enhancing visibility across teams, enabling transparent end-to-end software development lifecycle management."),
    ],
    metrics: [
      { value: "1,300 hrs", label: "Saved annually", note: "On average switching to mondayDev" },
      { value: "£66,820", label: "Saved annually", note: "On average estimation" },
      { value: "10x ROI", label: "License investment" },
    ],
    impact: [
      ...p("The solution transformed Givergy's development workflow with seamless GitHub integrations across their DevOps."),
      ...p("Enhanced visibility broke down long-standing silos between departments, while shareable boards were key to improving stakeholder engagement."),
      ...p("Streamlined bug tracking and intuitive release management empowered the team to manage their distributed resources more effectively, eliminating confusion and significantly reducing response times to critical issues."),
    ],
    location: "London, UK",
    companySize: "51-200",
    sector: "Fundraising",
    useCase: "DevOps",
  },

  "cs-hvac": {
    clientName: "HVAC Australia",
    logo: `${IMG}/hvac-logo.png`,
    quote: "We gained efficiency on project tasks... Now that the solution has automated a lot of the manual work we can focus on the critical risks effectively.",
    people: [{ name: "Stephen Coates", role: "Division Manager", company: "HVAC Australia", photo: `${IMG}/hvac-person-1.jpg` }],
    challenge: ul(
      "Managing 40-80 concurrent telecom infrastructure projects across Australia",
      "Manual Excel tracking system requiring extensive time for client updates",
      "Difficulty filtering sensitive information for different client views",
      "No automated scheduling or resource management",
      "Limited visibility of project status for field teams",
      "Risk of missed tasks and delayed project completions (~30% of projects delayed)",
      "Multiple disconnected tracking systems for bids, variations, and stock management",
      "Large amount of raw data was being manually entered",
    ),
    solution: ul(
      ["Implementation of monday.com Enterprise platform with:", [
        "Centralized project portfolio dashboard",
        "Client-specific filtered views",
        "Automated task creation and dependencies",
        "Resource scheduling with calendar integration",
      ]],
      ["Custom workflow automation for:", [
        "Bid to project conversion",
        "Material procurement scheduling",
        "Installation scheduling",
        "Task notifications",
        "Client communications",
      ]],
    ),
    metrics: [roi("10x ROI"), perYear("1,056 hrs"), perYear("$52,000")],
    impact: [
      ...p("Time Savings Per Project:"),
      ...ul(
        "7 hours of manual data entry across the team per week",
        "6 hours per week - 24 hours per month",
        "10 hours per week in client updates - 40 hours per month",
        "6 hours per week in project management inefficiencies - 24 hours per month",
        "**Total monthly time savings: 88 hours**",
        "**Go Live + Time to Value: 4 weeks**",
      ),
    ],
    location: "Redbank, QLD",
    companySize: "100-500",
    sector: "Manufacturing - Industrial",
    useCase: "Project Management",
  },

  "cs-popology": {
    clientName: "Popology",
    logo: `${IMG}/popology-logo.png`,
    quote:
      "We are now utilising monday.com to its full potential, from lead through design and production teams - everyone knows what stage our projects are in, what's next and what our process is.",
    people: [{ name: "Jade Wood", role: "Managing Director", company: "Popology", photo: `${IMG}/popology-person-1.jpg` }],
    challenge: ol(
      "Fragmented project management across multiple systems and spreadsheets",
      "Lack of standardized workflow for different project tiers",
      "No unified time tracking or budget monitoring",
      "Disconnected CRM and production processes",
      "Manual data entry and duplicate work",
      "Limited visibility into project status and resource allocation",
    ),
    solution: ul(
      "Implemented monday CRM with integrated production workflow",
      ["Created three-tier project template system:", [
        "Tier 1: Full service (strategy through execution)",
        "Tier 2: No strategy phase",
        "Tier 3: Execution only",
      ]],
      "Integrated Toggle time tracking with automatic project creation",
      "Established standardized brief forms and approval workflows",
      "Built automated status updates and notifications",
      "Created centralized dashboard for time/budget tracking",
      "Implemented email integration for client communications",
    ),
    metrics: [roi("17x ROI"), perYear("540 hrs"), perYear("$125,000")],
    impact: [
      ...p("**Time Savings Per Project:**"),
      ...ul(
        "Consolidated 2 separate software subscriptions into monday CRM",
        "Eliminated duplicate data entry",
        "Improved project timeline adherence through standardized workflows",
        "Better utilization of team resources through integrated time tracking",
        "Enhanced ability to quote accurately based on historical data",
        "**Total monthly time savings: 45 hours**",
        "**Time to Value: 7 weeks**",
      ),
    ],
    location: "Surry Hills, NSW",
    companySize: "11-50",
    sector: "Creative & Events Services",
    useCase: "CRM + Project Management",
  },

  "cs-promotify": {
    clientName: "Promotify Canada",
    logo: `${IMG}/promotify-logo.png`,
    quote: "We successfully aligned clients and projects in an organized and seamless manner, resolving a key operational challenge.",
    people: [{ name: "Robinson Sandino", role: "Chief Executive Officer", company: "Promotify Canada", photo: `${IMG}/promotify-person-1.jpg` }],
    challenge: ul(
      "Non-linear creative process with overlapping stages",
      "Scattered tools with Google Drive for files but no unified project tracking system",
      "Limited client visibility into project progress without exposing internal workflow details",
      "Manual lead qualification and opportunity management with no systematic sales pipeline tracking",
      "Difficulty quantifying effort and resource allocation across team members with varying skill levels",
      "Multiple briefs, strategies, and templates scattered across projects without centralized asset management",
      "Complex payment structures (50%/25%/25%) requiring manual tracking of milestone-based payments",
      "No automated project templating despite repetitive workflow patterns across similar projects",
      "Manual client communication requiring individual updates rather than automated status sharing",
    ),
    solution: ul(
      ["Implementation of monday CRM platform with:", [
        "Automated project board creation from templates, eliminating manual setup",
        "Standardized lead data capture",
        "Google Drive integration to monday.com",
        "Templated project workflows for both major projects (full-service) and minor projects (one-off work) with predefined stages",
        "Client portal access through monday.com allowing clients to see project progress without exposing internal processes",
        "Editorial checklist templates embedded in project workflows to ensure quality control before client presentations",
        "Automated status updates for clients showing project stage progression without manual communication",
        "Standardized proposal and service agreement tracking",
        "Scalable team management with effort quantification and resource allocation",
      ]],
    ),
    metrics: [roi("14x ROI"), perYear("1440 hrs"), perYear("$72,000")],
    impact: p(
      "This integrated solution allowed Promotify to scale their creative operations without sacrificing quality. Automated workflows streamlined their complex processes, client portal access enhanced their client communication process, and resource optimization tools improved team allocation visibility, transforming an ad-hoc workflow into a scalable system for sustainable growth.",
    ),
    location: "Mississauga, Ontario",
    companySize: "1-10",
    sector: "Creative Services",
    useCase: "CRM",
  },

  "cs-r2s": {
    clientName: "Risk 2 Solutions",
    logo: `${IMG}/r2s-logo.png`,
    quote: "Fruition have been instrumental in moving us to a 'single source of truth' system for managing sales and projects.",
    people: [{ name: "Ron Amaram", role: "General Manager", company: "Risk 2 Solutions", photo: `${IMG}/r2s-person-1.jpg` }],
    challenge: [
      ...p("We were using multiple legacy systems from a previous provider. The systems were cumbersome, confusing to use, and inefficient."),
      ...p("This means it was hard to track where things were at different stages of our cycles and on which system different things were stored."),
      ...p("All of this meant that unless you were specifically involved with a particular client from start to finish and knew exactly where to find relevant things, it was incredibly hard to just step into a project and know what needed to be done."),
      ...p("It also meant a tremendous amount of time was wasted on looking for information."),
    ],
    solution: [
      ...p("The new monday CRM & Project Management solution allows to track everything from the point a lead is created, through the sales pipeline, turning opportunities to projects, and managing them successfully to completion and renewal."),
      ...p("Automations, a new structure, and clear process articulation have resulted in:"),
      ...ul(
        "Using our time more efficiently",
        "Better communications internally and with clients",
        "Speeding up our production and making service delivery more efficient",
        "Less frustration! Simple to follow and use processes and flows from lead to project completion, allowing to better track and measure performance at each stage, giving us time to focus on the things that really matter - delivering top quality service, keeping our clients happy, and growing our business!",
      ),
    ],
    metrics: [roi("11x ROI"), perYear("780 hrs"), perYear("$117,000")],
    impact: [
      ...p("Through the use of effective process design and automations, we have seen the following improvements:"),
      ...ul(
        "Everything is in one place, accessible, and easy to find, saving us lots of time on trying to find where things are, what's been said and done, etc.",
        "Helped improve accountability for project ownership",
        "Improved and centralised project-specific communication",
        "Significant efficiencies in using team resources to ensure the right people are working on the right things at the right time",
        "Across our entire team, we estimate there's a probably 2-3 hours of time saved per FTE/week, and even more across our sales team.",
      ),
    ],
    location: "Perth, WA",
    companySize: "100+",
    sector: "Consulting - Industrial",
    useCase: "CRM & Project Management",
  },

  "cs-tourism-nt": {
    clientName: "Tourism Northern Territory",
    logo: `${IMG}/tourism-nt-logo.png`,
    quote:
      "Process automation across campaign management, budget management and project approvals has saved significant amounts of time for staff globally and also improved collaboration across global teams.",
    people: [{ name: "Emily Hill", role: "International Markets Manager", company: "Tourism Northern Territory", photo: `${IMG}/tourism-nt-person-1.jpg` }],
    challenge: ol(
      "Managed project approvals, campaign activity, and reporting manually via Word documents and Google Drive",
      "Lack of collaboration between teams",
      "Lots of duplicates were created in the process",
      "No shared network between teams, creating silos",
      "Time-consuming manual reporting process",
      "Manual approval form workflow",
    ),
    solution: ul(
      ["Created automated workflows for:", [
        "All approval forms, meaning approvals were instantaneous and completed with a click of a button",
        "Form content populated boards, so the information was readily available and accessible to all",
        "KPI data export from forms into reports, eliminating a need for manual data entry",
        "Campaign management",
        "Budget management",
      ]],
      "Dashboards were created to provide a global overview on budget expenditure and campaign activity across the globe",
    ),
    metrics: [roi("4x ROI"), perYear("1,020 hrs"), perYear("$50,000")],
    impact: ul(
      "**Total monthly time savings: 85**",
      "**Go Live + Time to Value: 9 weeks**",
    ),
    location: "Sydney, NSW",
    companySize: "100-500",
    sector: "Tourism",
    useCase: "Project Management + Finance Workflow",
  },
}

// ── Write ──────────────────────────────────────────────────────────────────

async function main() {
  const page = await writeClient.fetch<{ caseStudyCards?: { _key: string; title?: string }[] }>(
    `*[_id == $id][0]{ caseStudyCards[]{ _key, title } }`,
    { id: PAGE_ID },
  )
  const draft = await writeClient.fetch<string | null>(`*[_id == $id][0]._id`, { id: `drafts.${PAGE_ID}` })
  if (draft) console.warn(`⚠️  ${draft} exists; publishing it later would drop these fields unless it is discarded first.`)

  const keys = new Set((page?.caseStudyCards ?? []).map((c) => c._key))
  const missing = Object.keys(CASE_STUDIES).filter((key) => !keys.has(key))
  if (missing.length) throw new Error(`Cards not found on ${PAGE_ID}: ${missing.join(", ")}`)

  const set: Record<string, unknown> = {}
  for (const [key, cs] of Object.entries(CASE_STUDIES)) {
    const at = (field: string) => `caseStudyCards[_key=="${key}"].${field}`
    const upload = (path: string) => (APPLY ? uploadLocalImage(path) : Promise.resolve({ _type: "image", path }))
    set[at("clientName")] = cs.clientName
    set[at("logo")] = await upload(cs.logo)
    set[at("quote")] = cs.quote
    set[at("quotePeople")] = await Promise.all(
      cs.people.map(async (person, i) => ({
        _type: "caseStudyPerson",
        _key: `${key}-person-${i + 1}`,
        name: person.name,
        role: person.role,
        company: person.company,
        photo: await upload(person.photo),
      })),
    )
    set[at("challenge")] = cs.challenge
    set[at("solution")] = cs.solution
    set[at("impactMetrics")] = cs.metrics.map((m, i) => ({ _type: "caseStudyMetric", _key: `${key}-metric-${i + 1}`, ...m }))
    set[at("impact")] = cs.impact
    set[at("location")] = cs.location
    set[at("companySize")] = cs.companySize
    set[at("sector")] = cs.sector
    set[at("useCase")] = cs.useCase
    console.log(`  ${key}: ${cs.clientName} (${cs.challenge.length}/${cs.solution.length}/${cs.impact.length} blocks)`)
  }

  if (!APPLY) {
    console.log(`\nDry run: ${Object.keys(set).length} field sets on ${PAGE_ID}. Re-run with --apply to write.`)
    return
  }
  await writeClient.patch(PAGE_ID).set(set).commit()
  console.log(`\n✓ Patched ${PAGE_ID}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

import type {
  RegionContent,
  RegionProcessStep,
  RegionServiceLink,
  RegionStat,
} from "@/components/region/types"

/**
 * Content for the six /monday-partner-* region pages.
 *
 * Written against the redesigned structure (hero credentials → services →
 * answer block → proof → process → numbers → team → coverage → FAQ → booking).
 * See `src/components/region/types.ts` for why this lives in code rather than
 * in the `locationPage` Sanity schema.
 *
 * Copy rules followed here:
 *  - Claims are limited to ones the site already makes (Platinum Partner,
 *    Advanced Delivery Partner, 500+ implementations, ex-monday.com founder).
 *  - No invented CSAT/review scores — the real review figures live on the
 *    testimonials page and are not restated as headline stats.
 *  - Regional detail is factual context (time zones, privacy law, local
 *    accounting stacks), never a claim of certification under those regimes.
 *  - Spelling follows the market: -ise/-isation for AU/UK/SG/IN/PH, -ize for US.
 */

/* ------------------------------------------------------------------ */
/*  Shared blocks                                                      */
/* ------------------------------------------------------------------ */

/** The delivery method is one methodology globally — only the lead changes. */
const PROCESS_STEPS: RegionProcessStep[] = [
  {
    title: "Discovery & Scoping",
    body: "Mapping your operational gaps, workflows and technical requirements — with a fixed quote before any build begins.",
  },
  {
    title: "Solution Architecture",
    body: "Designing boards, automations and dashboards around how your team actually works, not around a template.",
  },
  {
    title: "Data Migration",
    body: "Moving historical data out of spreadsheets and legacy systems into the new workspace, with history intact.",
  },
  {
    title: "Training & Adoption",
    body: "Champion training and end-user enablement so the system is used after we leave, not abandoned.",
  },
]

const STATS: RegionStat[] = [
  {
    value: "260+",
    label: "hours saved per year by a typical client team after automation",
  },
  {
    value: "20–30%",
    label: 'of team time recovered from "work about work" and manual re-keying',
  },
  { value: "2–4 wks", label: "typical time from kickoff to a live, working system" },
  { value: "500+", label: "monday.com implementations delivered across six offices" },
]

const STATS_FOOTNOTE =
  "Figures are typical outcomes drawn from Fruition engagements and published monday.com research. Individual results vary with scope, team size and adoption."

const ALSO_LINKS: RegionServiceLink[] = [
  { label: "AI Consulting", href: "/ai-consulting" },
  { label: "Atlassian & Jira", href: "/atlassian-consulting" },
  { label: "HubSpot", href: "/hubspot-consulting" },
  { label: "Integrations", href: "/integrations" },
]

/** Cards 1, 2, 5 and 6 are the same offer everywhere; 3 and 4 are localised. */
function baseServiceCards(opts: {
  /** Named local systems for the integrations card. */
  stack: string
  /** Where training is delivered. */
  training: string
}) {
  return [
    {
      icon: "layers" as const,
      title: "monday.com Implementation",
      body: "End-to-end setup: board architecture, automations, dashboards and permissions designed around your actual processes — live in days, not months.",
    },
    {
      icon: "chart" as const,
      title: "monday CRM Builds",
      body: "Custom sales pipelines, quoting workflows and forecasting — with migration from Salesforce, HubSpot, Zoho or spreadsheets, history intact.",
    },
    {
      icon: "zap" as const,
      title: "Integrations & Automation",
      body: `Connect monday.com to ${opts.stack} and the rest of your stack using native integrations, Make or custom API work — no more re-keying.`,
    },
    {
      icon: "users" as const,
      title: "Training & Enablement",
      body: `Admin deep-dives and end-user training run on your own boards, ${opts.training}, with follow-up clinics once people are actually using it.`,
    },
    {
      icon: "database" as const,
      title: "Data Migration",
      body: "Structured moves from Jira, Asana, Trello, Smartsheet and Excel — preserving history while fixing the process debt you're leaving behind.",
    },
    {
      icon: "sparkles" as const,
      title: "Managed Support & AI",
      body: "Ongoing optimisation retainers plus monday AI enablement — AI Blocks, Sidekick and agents configured with proper governance.",
    },
  ]
}

/* ------------------------------------------------------------------ */
/*  Regions                                                            */
/* ------------------------------------------------------------------ */

const australia: RegionContent = {
  slug: "monday-partner-australia",
  country: "Australia",
  teamRegion: "APAC",
  bookingRegion: "APAC",
  flag: "🇦🇺",
  hero: {
    eyebrow: "monday.com Platinum Partner · Sydney · Melbourne · Brisbane · Adelaide · Perth",
    heading: "Drive peak efficiency with a premier",
    headingAccent: "monday.com partner in Australia.",
    subheading:
      "Work with a certified monday.com Platinum Partner and expert consultants who handle your entire monday CRM implementation and integration. Servicing clients across Sydney, Melbourne, Brisbane, Adelaide and Perth — get running in days, not months.",
    badgeStrap: "Advanced Delivery Partner · 500+ Implementations",
  },
  services: {
    eyebrow: "Services in Australia",
    heading: "How Fruition supports monday.com teams in Australia",
    lead: "Every service below is delivered by certified, Australian-based consultants — scoped and led by the same person from first call to handover.",
    cards: baseServiceCards({
      stack: "Xero, MYOB, Aircall and HubSpot",
      training: "on-site in five cities or remote nationwide",
    }),
    alsoLabel: "Also delivered by our Australian team:",
    alsoLinks: ALSO_LINKS,
  },
  answerBlock: {
    question: "Who is the best monday.com partner in Australia?",
    answer:
      "Fruition Services is a leading monday.com partner in Australia — a Platinum Partner and Advanced Delivery Partner founded by an ex-monday.com team member, with 500+ implementations delivered and certified consultants based locally across Sydney, Melbourne, Brisbane, Adelaide and Perth. Fruition combines the highest partner tier with insider product knowledge and Australian time-zone delivery, so scoping, build and training all happen in your working hours.",
  },
  testimonials: {
    heading: "What clients say about Fruition's monday.com consultants",
    lead: "Operations and IT leaders across Sydney, Melbourne, Brisbane, Adelaide and Perth on what changed after go-live.",
  },
  process: {
    eyebrow: "What to expect",
    heading: "How a monday.com implementation works",
    lead: "A proven, fixed-fee framework — the same methodology behind 500+ delivered systems.",
    steps: PROCESS_STEPS,
  },
  numbers: {
    eyebrow: "The numbers",
    heading: "The economic impact of working with a certified monday.com partner",
    lead: "What partner-led implementation actually returns, measured across Fruition's client base.",
    stats: STATS,
    footnote: STATS_FOOTNOTE,
  },
  team: {
    heading: "Meet the Fruition Australia team",
    lead: "The consultants below scope and deliver Australian engagements personally — no handoffs to an offshore bench.",
  },
  coverage: {
    eyebrow: "National coverage",
    heading: "monday.com consultants across Australia",
    lead: "Local consultants in every major market, working your time zone — with on-site workshops available in all five cities.",
    locations: [
      {
        city: "Sydney — Headquarters",
        detail: "Level 12, 64 York Street, Sydney NSW 2000 · AEST/AEDT",
        headquarters: true,
      },
      { city: "Melbourne", detail: "On-site workshops and local delivery · AEST/AEDT" },
      { city: "Brisbane", detail: "Government and infrastructure procurement experience · AEST" },
      { city: "Adelaide", detail: "Remote-first delivery with on-site available · ACST" },
      { city: "Perth", detail: "AWST-hours consultants for Western Australian businesses · AWST" },
      { city: "Regional & New Zealand", detail: "Remote delivery Australia-wide and across the Tasman" },
    ],
    office: {
      title: "Visit our Sydney office",
      address: "Level 12, 64 York Street, Sydney NSW 2000",
      mapQuery: "Level 12, 64 York Street, Sydney NSW 2000, Australia",
      mapUrl: "https://maps.app.goo.gl/1tHxQSq7Db3Xq4Rk7",
    },
  },
  faq: {
    heading: "monday.com partners in Australia — your questions answered",
    contactLead: "Prefer a person? An Australian consultant will answer in one business day.",
    items: [
      {
        question: "Is Fruition an official monday.com partner in Australia?",
        answer:
          "Yes. Fruition Services is a certified monday.com Platinum Partner and Advanced Delivery Partner, with an Australian head office in Sydney and consultants across Melbourne, Brisbane, Adelaide and Perth. Platinum is monday.com's highest partner tier, awarded on delivery volume and customer outcomes rather than on reselling alone.",
      },
      {
        question: "How much does a monday.com implementation cost in Australia?",
        answer:
          "Implementations are quoted as a fixed fee after a scoping call, so you know the number before any build starts. A single-team CRM or project workspace typically sits at the smaller end; multi-department rollouts with migration and integrations sit higher. Licences are billed separately by monday.com, and we will tell you which plan tier you actually need rather than the largest one.",
      },
      {
        question: "How long does a monday.com rollout take?",
        answer:
          "Most Australian engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; a multi-entity rollout with data migration and finance integrations runs longer. The schedule is agreed in scoping, not discovered halfway through.",
      },
      {
        question: "Do you have consultants in my city, or is delivery remote?",
        answer:
          "Both. Fruition has an office in Sydney and consultants working AEST/AEDT, ACST and AWST hours, so Perth and Adelaide teams are not stuck waiting on the east coast. On-site discovery and training workshops are available in Sydney, Melbourne, Brisbane, Adelaide and Perth; everything else is delivered remotely nationwide and to New Zealand.",
      },
      {
        question: "Can you integrate monday.com with Xero, MYOB or our accounting system?",
        answer:
          "Yes. We connect monday.com to Xero, MYOB, Aircall, HubSpot, Google Workspace, Microsoft 365 and Sharepoint using native integrations, Make scenarios or direct API work — so quotes, invoices and job records stop being re-keyed between systems.",
      },
      {
        question: "Where is our data stored, and can it stay in Australia?",
        answer:
          "monday.com hosts customer data in its own regional cloud regions and publishes its data-residency options and certifications directly. We will walk your IT or risk team through the current options and help you record the answer for your own governance process — the platform's residency commitments come from monday.com, not from us.",
      },
      {
        question: "Do you work with government and not-for-profit organisations?",
        answer:
          "Yes. We deliver for state and local government bodies, not-for-profits and NDIS providers, and have worked through Australian public-sector procurement and vendor-onboarding processes. We can supply insurance certificates, security questionnaires and referee details as part of a tender response.",
      },
      {
        question: "What happens after go-live?",
        answer:
          "Every build includes handover documentation and admin training so your team can run the system. Beyond that, optimisation retainers cover ongoing changes, new automations, additional boards and monday AI enablement — used by clients who would rather keep improving the system than freeze it.",
      },
    ],
  },
  closingCta: {
    heading: "Ready to get running in days, not months?",
    lead: "Book a free consultation with Fruition's Australian team — a frank read on scope, fit and cost from a certified Platinum Partner.",
  },
}

const unitedKingdom: RegionContent = {
  slug: "monday-partner-uk",
  country: "the United Kingdom",
  teamRegion: "UK",
  bookingRegion: "UK",
  flag: "🇬🇧",
  hero: {
    eyebrow: "monday.com Platinum Partner · London · Manchester · Birmingham · Edinburgh",
    heading: "Drive peak operational performance with an elite",
    headingAccent: "monday.com partner in the UK.",
    subheading:
      "Partner with certified monday.com consultants who build the infrastructure and architecture your business actually runs on. Our UK team gets you operational immediately, without the time and budget usually lost to trial-and-error setup.",
    badgeStrap: "Advanced Delivery Partner · 500+ Implementations",
  },
  services: {
    eyebrow: "Services in the UK",
    heading: "How Fruition supports monday.com teams across the UK",
    lead: "Every service below is delivered by certified, UK-based consultants — scoped and led by the same person from first call to handover.",
    cards: baseServiceCards({
      stack: "Xero, Sage, HubSpot and Microsoft 365",
      training: "on-site in London and the major regional hubs or remote UK-wide",
    }),
    alsoLabel: "Also delivered by our UK team:",
    alsoLinks: ALSO_LINKS,
  },
  answerBlock: {
    question: "Who is the best monday.com partner in the UK?",
    answer:
      "Fruition Services is a leading monday.com partner in the United Kingdom — a Platinum Partner and Advanced Delivery Partner founded by an ex-monday.com team member, with 500+ implementations delivered and a London office supporting clients across England, Scotland, Wales and Northern Ireland. Fruition pairs monday.com's highest partner tier with UK-hours delivery and consultants who have taken enterprise and public-sector organisations through procurement, migration and adoption.",
  },
  testimonials: {
    heading: "What clients say about Fruition's monday.com consultants",
    lead: "Operations and IT leaders across London, Manchester, Birmingham, Leeds and Edinburgh on what changed after go-live.",
  },
  process: {
    eyebrow: "What to expect",
    heading: "How a monday.com implementation works",
    lead: "A proven, fixed-fee framework — the same methodology behind 500+ delivered systems.",
    steps: PROCESS_STEPS,
  },
  numbers: {
    eyebrow: "The numbers",
    heading: "The economic impact of working with a certified monday.com partner",
    lead: "What partner-led implementation actually returns, measured across Fruition's client base.",
    stats: STATS,
    footnote: STATS_FOOTNOTE,
  },
  team: {
    heading: "Meet the Fruition UK team",
    lead: "The consultants below scope and deliver UK engagements personally — no handoffs to an offshore bench.",
  },
  coverage: {
    eyebrow: "National coverage",
    heading: "monday.com consultants across the United Kingdom",
    lead: "A London base with consultants working GMT/BST hours, and on-site workshops available in every major UK business hub.",
    locations: [
      {
        city: "London — EMEA Office",
        detail: "423 Linen Hall, 162–168 Regent Street, London W1B 5TE · GMT/BST",
        headquarters: true,
      },
      { city: "Manchester & the North West", detail: "On-site workshops and local delivery · GMT/BST" },
      { city: "Birmingham & the Midlands", detail: "Manufacturing and professional services rollouts · GMT/BST" },
      { city: "Leeds & Yorkshire", detail: "Remote-first delivery with on-site available · GMT/BST" },
      { city: "Edinburgh & Glasgow", detail: "Scottish public sector and services clients · GMT/BST" },
      { city: "Wales, NI & Europe", detail: "Remote delivery UK-wide and across the EU" },
    ],
    office: {
      title: "Visit our London office",
      address: "423 Linen Hall, 162–168 Regent Street, London W1B 5TE",
      mapQuery: "162-168 Regent Street, London W1B 5TE, United Kingdom",
      mapUrl: "https://maps.app.goo.gl/H8gDDCChm9Q5uMDm8",
    },
  },
  faq: {
    heading: "monday.com partners in the UK — your questions answered",
    contactLead: "Prefer a person? A UK consultant will answer in one business day.",
    items: [
      {
        question: "Is Fruition an official monday.com partner in the UK?",
        answer:
          "Yes. Fruition Services is a certified monday.com Platinum Partner and Advanced Delivery Partner with a London office and UK-based consultants. Platinum is monday.com's highest partner tier, awarded on delivery volume and customer outcomes rather than on reselling alone.",
      },
      {
        question: "How much does a monday.com implementation cost in the UK?",
        answer:
          "Implementations are quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team CRM or project workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licences are billed separately, and we will tell you which plan tier you actually need.",
      },
      {
        question: "How long does a monday.com rollout take?",
        answer:
          "Most UK engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; a group-wide rollout with data migration and finance integrations runs longer. The schedule is agreed during scoping rather than discovered halfway through.",
      },
      {
        question: "How does monday.com handle UK GDPR and data protection?",
        answer:
          "monday.com publishes its own UK and EU data-residency options, sub-processor list, DPA and security certifications. We help your team read those against your DPIA and records of processing, and we design boards and permissions so personal data sits only where your policy allows. The platform commitments come from monday.com; the workflow design is where we add control.",
      },
      {
        question: "Can you integrate monday.com with Xero, Sage or Microsoft 365?",
        answer:
          "Yes. We connect monday.com to Xero, Sage, HubSpot, Salesforce, Microsoft 365, Teams, SharePoint and Google Workspace using native integrations, Make scenarios or direct API work — so finance, sales and delivery stop re-keying the same records.",
      },
      {
        question: "Do you work with UK public sector organisations?",
        answer:
          "Yes. We deliver for councils, housing associations, universities, NHS-adjacent bodies and charities, and have worked through UK public-sector procurement, security questionnaires and supplier onboarding. We can provide insurance certificates and referee details as part of a tender response.",
      },
      {
        question: "Are your consultants actually in the UK?",
        answer:
          "Yes — UK engagements are scoped and delivered by consultants working GMT/BST hours, with on-site discovery and training available in London and the major regional hubs. Our global team across Australia, the US and Asia is available where a client wants follow-the-sun coverage, but that is an option, not the default.",
      },
      {
        question: "What happens after go-live?",
        answer:
          "Every build includes handover documentation and admin training so your team owns the system. Optimisation retainers then cover ongoing changes, new automations, extra boards and monday AI enablement for clients who want to keep developing the platform rather than freeze it.",
      },
    ],
  },
  closingCta: {
    heading: "Ready to get running in days, not months?",
    lead: "Book a free consultation with Fruition's UK team — a frank read on scope, fit and cost from a certified Platinum Partner.",
  },
}

const unitedStates: RegionContent = {
  slug: "monday-partner-us",
  country: "the United States",
  teamRegion: "US",
  bookingRegion: "NA",
  flag: "🇺🇸",
  hero: {
    eyebrow: "monday.com Platinum Partner · New York · Chicago · Austin · San Francisco",
    heading: "Drive localized growth with an elite",
    headingAccent: "monday.com partner in the USA.",
    subheading:
      "Get certified monday.com consultants to build the infrastructure and architecture your business runs on. Our US team gets you up and running right away, without burning internal resources figuring it out yourselves.",
    badgeStrap: "Advanced Delivery Partner · 500+ Implementations",
  },
  services: {
    eyebrow: "Services in the US",
    heading: "How Fruition supports monday.com teams across the US",
    lead: "Every service below is delivered by certified consultants working US hours — scoped and led by the same person from first call to handover.",
    cards: baseServiceCards({
      stack: "Salesforce, HubSpot, QuickBooks and Slack",
      training: "on-site in major metros or remote nationwide",
    }),
    alsoLabel: "Also delivered by our US team:",
    alsoLinks: ALSO_LINKS,
  },
  answerBlock: {
    question: "Who is the best monday.com partner in the United States?",
    answer:
      "Fruition Services is a leading monday.com partner in the United States — a Platinum Partner and Advanced Delivery Partner founded by an ex-monday.com team member, with 500+ implementations delivered and a New York office supporting clients coast to coast. Fruition pairs monday.com's highest partner tier with consultants covering Eastern through Pacific hours, and specialises in migrations off Salesforce, HubSpot, Asana and spreadsheets without losing history.",
  },
  testimonials: {
    heading: "What clients say about Fruition's monday.com consultants",
    lead: "Operations and IT leaders from New York to San Francisco on what changed after go-live.",
  },
  process: {
    eyebrow: "What to expect",
    heading: "How a monday.com implementation works",
    lead: "A proven, fixed-fee framework — the same methodology behind 500+ delivered systems.",
    steps: PROCESS_STEPS,
  },
  numbers: {
    eyebrow: "The numbers",
    heading: "The economic impact of working with a certified monday.com partner",
    lead: "What partner-led implementation actually returns, measured across Fruition's client base.",
    stats: STATS,
    footnote: STATS_FOOTNOTE,
  },
  team: {
    heading: "Meet the Fruition US team",
    lead: "The consultants below scope and deliver US engagements personally — no handoffs to an offshore bench.",
  },
  coverage: {
    eyebrow: "National coverage",
    heading: "monday.com consultants across the United States",
    lead: "A New York base with consultants covering Eastern through Pacific hours, and on-site workshops available in major metros.",
    locations: [
      {
        city: "New York — North America Office",
        detail: "205 W 37th St, New York, NY 10018 · Eastern",
        headquarters: true,
      },
      { city: "Chicago & the Midwest", detail: "Manufacturing and logistics rollouts · Central" },
      { city: "Austin & Texas", detail: "On-site workshops and local delivery · Central" },
      { city: "San Francisco Bay Area", detail: "Tech and professional services builds · Pacific" },
      { city: "Los Angeles & Southern California", detail: "Media, creative and agency workflows · Pacific" },
      { city: "Nationwide & Canada", detail: "Remote delivery across all US states and Canada" },
    ],
    office: {
      title: "Visit our New York office",
      address: "205 W 37th St, New York, NY 10018",
      mapQuery: "205 W 37th St, New York, NY 10018, United States",
      mapUrl: "https://maps.google.com/?cid=12106880826435152823",
    },
  },
  faq: {
    heading: "monday.com partners in the US — your questions answered",
    contactLead: "Prefer a person? A US-hours consultant will answer in one business day.",
    items: [
      {
        question: "Is Fruition an official monday.com partner in the US?",
        answer:
          "Yes. Fruition Services is a certified monday.com Platinum Partner and Advanced Delivery Partner with a New York office and consultants working US hours. Platinum is monday.com's highest partner tier, awarded on delivery volume and customer outcomes rather than on reselling alone.",
      },
      {
        question: "How much does a monday.com implementation cost in the US?",
        answer:
          "Implementations are quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team CRM or project workspace sits at the smaller end; multi-department rollouts with migration and integrations sit higher. monday.com licenses are billed separately, and we will tell you which plan tier you actually need.",
      },
      {
        question: "How long does a monday.com rollout take?",
        answer:
          "Most US engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; an enterprise rollout with data migration and system integrations runs longer. The schedule is agreed during scoping rather than discovered halfway through.",
      },
      {
        question: "Can you migrate us off Salesforce, HubSpot or Asana?",
        answer:
          "Yes — migrations are a large share of our US work. We map your existing objects, pipelines and history to monday.com's data model, move the records, and rebuild the automations and reporting so nothing silently stops working. Where a system should stay in place, we integrate rather than replace it.",
      },
      {
        question: "Can you support our security review or vendor onboarding?",
        answer:
          "Yes. monday.com publishes its own certifications, sub-processor list and security documentation, and we help your security team locate and interpret those during review. On our side we sign NDAs and MSAs, complete vendor questionnaires, and design permissions and board structure so sensitive records are only visible to the roles that need them.",
      },
      {
        question: "Do you work across all US time zones?",
        answer:
          "Yes. Our consultants cover Eastern through Pacific hours, so West Coast teams are not stuck with early-morning calls. On-site discovery and training are available in major metros; everything else is delivered remotely nationwide and into Canada.",
      },
      {
        question: "Which industries do you work with most in the US?",
        answer:
          "Professional services, construction and trades, manufacturing, real estate, marketing agencies and fast-growing SaaS companies. Each has a different definition of a well-run pipeline, so we build to the operating model rather than dropping in a generic template.",
      },
      {
        question: "What happens after go-live?",
        answer:
          "Every build includes handover documentation and admin training so your team owns the system. Optimization retainers then cover ongoing changes, new automations, extra boards and monday AI enablement for clients who want to keep developing the platform rather than freeze it.",
      },
    ],
  },
  closingCta: {
    heading: "Ready to get running in days, not months?",
    lead: "Book a free consultation with Fruition's US team — a frank read on scope, fit and cost from a certified Platinum Partner.",
  },
}

const singapore: RegionContent = {
  slug: "monday-partner-singapore",
  country: "Singapore",
  teamRegion: "APAC",
  bookingRegion: "SEA",
  flag: "🇸🇬",
  hero: {
    eyebrow: "monday.com Platinum Partner · Singapore · Malaysia · Indonesia · Thailand",
    heading: "Build your operating system with a certified",
    headingAccent: "monday.com partner in Singapore.",
    subheading:
      "Work with accredited monday.com consultants to develop the systems and operational blueprint your business runs on. Based in Singapore, our specialists serve companies across Southeast Asia — Singapore, Malaysia, Indonesia, Thailand, Vietnam and the Philippines.",
    badgeStrap: "Advanced Delivery Partner · 500+ Implementations",
  },
  services: {
    eyebrow: "Services in Singapore & ASEAN",
    heading: "How Fruition supports monday.com teams across Southeast Asia",
    lead: "Every service below is delivered by certified consultants working SGT hours — scoped and led by the same person from first call to handover.",
    cards: baseServiceCards({
      stack: "Xero, HubSpot, Aircall and Microsoft 365",
      training: "on-site in Singapore or remote across ASEAN",
    }),
    alsoLabel: "Also delivered by our Singapore team:",
    alsoLinks: ALSO_LINKS,
  },
  answerBlock: {
    question: "Who is the best monday.com partner in Singapore?",
    answer:
      "Fruition Services is a leading monday.com partner in Singapore — a Platinum Partner and Advanced Delivery Partner founded by an ex-monday.com team member, with 500+ implementations delivered and a Singapore entity supporting regional headquarters across ASEAN. Fruition pairs monday.com's highest partner tier with SGT-hours delivery and consultants who routinely roll one workspace out across multiple countries, entities and currencies.",
  },
  testimonials: {
    heading: "What clients say about Fruition's monday.com consultants",
    lead: "Operations and IT leaders across Singapore and Southeast Asia on what changed after go-live.",
  },
  process: {
    eyebrow: "What to expect",
    heading: "How a monday.com implementation works",
    lead: "A proven, fixed-fee framework — the same methodology behind 500+ delivered systems.",
    steps: PROCESS_STEPS,
  },
  numbers: {
    eyebrow: "The numbers",
    heading: "The economic impact of working with a certified monday.com partner",
    lead: "What partner-led implementation actually returns, measured across Fruition's client base.",
    stats: STATS,
    footnote: STATS_FOOTNOTE,
  },
  team: {
    heading: "Meet the Fruition Singapore team",
    lead: "The consultants below scope and deliver ASEAN engagements personally — no handoffs to an unnamed bench.",
  },
  coverage: {
    eyebrow: "Regional coverage",
    heading: "monday.com consultants across Singapore and ASEAN",
    lead: "A Singapore base working SGT hours, with delivery across the six markets most regional headquarters actually operate in.",
    locations: [
      {
        city: "Singapore — ASEAN Office",
        detail: "Goldhill Plaza #07-07, Singapore 308900 · SGT",
        headquarters: true,
      },
      { city: "Malaysia", detail: "Kuala Lumpur and Penang delivery · MYT (SGT-aligned)" },
      { city: "Indonesia", detail: "Jakarta-based rollouts and multi-entity structures · WIB" },
      { city: "Thailand", detail: "Bangkok delivery for manufacturing and services teams · ICT" },
      { city: "Vietnam", detail: "Ho Chi Minh City and Hanoi remote delivery · ICT" },
      { city: "Philippines & wider APAC", detail: "Served from our Manila office and Sydney headquarters" },
    ],
    office: {
      title: "Visit our Singapore office",
      address: "Goldhill Plaza #07-07, Singapore 308900",
      mapQuery: "Goldhill Plaza, 51 Goldhill Plaza, Singapore 308900",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Fruition%20Services%20Singapore%20Goldhill%20Plaza",
    },
  },
  faq: {
    heading: "monday.com partners in Singapore — your questions answered",
    contactLead: "Prefer a person? A Singapore-based consultant will answer in one business day.",
    items: [
      {
        question: "Is Fruition an official monday.com partner in Singapore?",
        answer:
          "Yes. Fruition Services Asia Pte. Ltd. is the Singapore entity of a certified monday.com Platinum Partner and Advanced Delivery Partner, with an office at Goldhill Plaza and consultants working SGT hours. Platinum is monday.com's highest partner tier, awarded on delivery volume and customer outcomes rather than on reselling alone.",
      },
      {
        question: "How much does a monday.com implementation cost in Singapore?",
        answer:
          "Implementations are quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team CRM or project workspace sits at the smaller end; regional rollouts across several entities with migration and integrations sit higher. monday.com licences are billed separately, and we will tell you which plan tier you actually need.",
      },
      {
        question: "Can you roll one workspace out across several ASEAN countries?",
        answer:
          "Yes — this is the most common Singapore engagement. We design a shared board architecture with per-country boards, currencies and permissions, so a regional head office gets consolidated reporting while each market keeps the local detail it needs. Rollout is usually sequenced country by country rather than switched on everywhere at once.",
      },
      {
        question: "How long does a monday.com rollout take?",
        answer:
          "Most Singapore engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; a multi-country rollout with data migration and finance integrations runs longer. The schedule is agreed during scoping rather than discovered halfway through.",
      },
      {
        question: "How does monday.com fit with Singapore's PDPA?",
        answer:
          "monday.com publishes its own data-residency options, sub-processor list and security certifications, which your DPO can assess against your PDPA obligations. On our side we design boards, permissions and automations so personal data is collected and visible only where your policy allows, and we document the structure for your data inventory.",
      },
      {
        question: "Can you integrate monday.com with Xero and our regional finance stack?",
        answer:
          "Yes. We connect monday.com to Xero, HubSpot, Salesforce, Aircall, Microsoft 365 and Google Workspace using native integrations, Make scenarios or direct API work — including multi-entity setups where each country files separately but leadership needs one view.",
      },
      {
        question: "Are your consultants in Singapore, or working from elsewhere?",
        answer:
          "Singapore engagements are scoped and delivered by consultants working SGT hours, supported by our wider APAC team out of Sydney and Manila. On-site discovery and training workshops are available in Singapore; delivery across Malaysia, Indonesia, Thailand and Vietnam is typically remote with travel on request.",
      },
      {
        question: "What happens after go-live?",
        answer:
          "Every build includes handover documentation and admin training so your team owns the system. Optimisation retainers then cover ongoing changes, new automations, extra boards and monday AI enablement for clients who want to keep developing the platform rather than freeze it.",
      },
    ],
  },
  closingCta: {
    heading: "Ready to get running in days, not months?",
    lead: "Book a free consultation with Fruition's Singapore team — a frank read on scope, fit and cost from a certified Platinum Partner.",
  },
}

const india: RegionContent = {
  slug: "monday-partner-india",
  country: "India",
  teamRegion: "IN",
  bookingRegion: "IND",
  flag: "🇮🇳",
  hero: {
    eyebrow: "monday.com Platinum Partner · Delhi NCR · Mumbai · Bengaluru · Hyderabad",
    heading: "Build operations that scale with a certified",
    headingAccent: "monday.com partner in India.",
    subheading:
      "Get certified monday.com consultants and implementation experts to build the infrastructure and architecture your business runs on. Our India team gets you operational immediately, removing the time and budget usually lost to trial-and-error setup.",
    badgeStrap: "Advanced Delivery Partner · 500+ Implementations",
  },
  services: {
    eyebrow: "Services in India",
    heading: "How Fruition supports monday.com teams across India",
    lead: "Every service below is delivered by certified, India-based consultants — scoped and led by the same person from first call to handover.",
    cards: baseServiceCards({
      stack: "Zoho, Tally, HubSpot and Microsoft 365",
      training: "on-site in Delhi NCR or remote across every major hub",
    }),
    alsoLabel: "Also delivered by our India team:",
    alsoLinks: ALSO_LINKS,
  },
  answerBlock: {
    question: "Who is the best monday.com partner in India?",
    answer:
      "Fruition Services is a leading monday.com partner in India — a Platinum Partner and Advanced Delivery Partner founded by an ex-monday.com team member, with 500+ implementations delivered and a New Delhi office supporting clients across Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune and Chennai. Fruition pairs monday.com's highest partner tier with IST-hours delivery and consultants experienced in migrating teams off Zoho, Tally-adjacent spreadsheets and legacy trackers.",
  },
  testimonials: {
    heading: "What clients say about Fruition's monday.com consultants",
    lead: "Operations and IT leaders across Delhi NCR, Mumbai, Bengaluru and Hyderabad on what changed after go-live.",
  },
  process: {
    eyebrow: "What to expect",
    heading: "How a monday.com implementation works",
    lead: "A proven, fixed-fee framework — the same methodology behind 500+ delivered systems.",
    steps: PROCESS_STEPS,
  },
  numbers: {
    eyebrow: "The numbers",
    heading: "The economic impact of working with a certified monday.com partner",
    lead: "What partner-led implementation actually returns, measured across Fruition's client base.",
    stats: STATS,
    footnote: STATS_FOOTNOTE,
  },
  team: {
    heading: "Meet the Fruition India team",
    lead: "The consultants below scope and deliver Indian engagements personally — no handoffs to an unnamed bench.",
  },
  coverage: {
    eyebrow: "National coverage",
    heading: "monday.com consultants across India",
    lead: "A New Delhi base working IST hours, with delivery into every major commercial hub and on-site workshops on request.",
    locations: [
      {
        city: "New Delhi — India Office",
        detail: "WeWork Eldeco Centre, Malviya Nagar, New Delhi 110017 · IST",
        headquarters: true,
      },
      { city: "Mumbai", detail: "Financial services and media rollouts · IST" },
      { city: "Bengaluru", detail: "SaaS, GCC and engineering team builds · IST" },
      { city: "Hyderabad", detail: "Global capability centre and services delivery · IST" },
      { city: "Pune & Chennai", detail: "Manufacturing and IT services workflows · IST" },
      { city: "Nationwide & Middle East", detail: "Remote delivery India-wide and into the UAE" },
    ],
    office: {
      title: "Visit our New Delhi office",
      address: "WeWork Eldeco Centre, Block A, Malviya Nagar, New Delhi 110017",
      mapQuery: "WeWork Eldeco Centre, Malviya Nagar, New Delhi, Delhi 110017, India",
      mapUrl: "https://maps.google.com/?cid=12495776467071715702",
    },
  },
  faq: {
    heading: "monday.com partners in India — your questions answered",
    contactLead: "Prefer a person? An India-based consultant will answer in one business day.",
    items: [
      {
        question: "Is Fruition an official monday.com partner in India?",
        answer:
          "Yes. Fruition Services is a certified monday.com Platinum Partner and Advanced Delivery Partner with a New Delhi office and India-based consultants. Platinum is monday.com's highest partner tier, awarded on delivery volume and customer outcomes rather than on reselling alone.",
      },
      {
        question: "How much does a monday.com implementation cost in India?",
        answer:
          "Implementations are quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team CRM or project workspace sits at the smaller end; multi-site or multi-entity rollouts with migration and integrations sit higher. monday.com licences are billed separately, and we will tell you which plan tier you actually need.",
      },
      {
        question: "How long does a monday.com rollout take?",
        answer:
          "Most Indian engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; a multi-location rollout with data migration and finance integrations runs longer. The schedule is agreed during scoping rather than discovered halfway through.",
      },
      {
        question: "Can you migrate us off Zoho or our existing trackers?",
        answer:
          "Yes. We map your existing modules, pipelines and history to monday.com's data model, move the records, and rebuild automations and reporting so nothing silently stops working. Where a system should stay — a finance or payroll platform, for instance — we integrate with it instead of replacing it.",
      },
      {
        question: "How does monday.com fit with India's DPDP Act?",
        answer:
          "monday.com publishes its own data-residency options, sub-processor list and security certifications, which your compliance team can assess against your obligations as a data fiduciary under the DPDP Act. On our side we design boards, permissions and automations so personal data is collected and visible only where your policy allows, and we document the structure for your records.",
      },
      {
        question: "Do you work with global capability centres and multi-site teams?",
        answer:
          "Yes. GCC and shared-services engagements are common: a single workspace with per-site boards, role-based permissions and consolidated dashboards, so a global parent gets one view while each site keeps the operational detail it needs.",
      },
      {
        question: "Are your consultants in India, or working from overseas?",
        answer:
          "Indian engagements are scoped and delivered by consultants working IST hours from our New Delhi office, backed by the wider global team across Australia, the UK and Singapore where a client wants follow-the-sun coverage. On-site discovery and training are available in Delhi NCR and on request in other hubs.",
      },
      {
        question: "What happens after go-live?",
        answer:
          "Every build includes handover documentation and admin training so your team owns the system. Optimisation retainers then cover ongoing changes, new automations, extra boards and monday AI enablement for clients who want to keep developing the platform rather than freeze it.",
      },
    ],
  },
  closingCta: {
    heading: "Ready to get running in days, not months?",
    lead: "Book a free consultation with Fruition's India team — a frank read on scope, fit and cost from a certified Platinum Partner.",
  },
}

const philippines: RegionContent = {
  slug: "monday-partner-philippines",
  country: "the Philippines",
  teamRegion: "APAC",
  bookingRegion: "SEA",
  flag: "🇵🇭",
  hero: {
    eyebrow: "monday.com Platinum Partner · Metro Manila · Cebu · Davao · Clark",
    heading: "Run every shift on one system with a certified",
    headingAccent: "monday.com partner in the Philippines.",
    subheading:
      "Get certified monday.com consultants and implementation experts to build the infrastructure your operation runs on. Our Philippines-based specialists serve teams across Metro Manila, Cebu and Davao — from fast-scaling startups to BPO and outsourcing operations — getting you operational in days, not months.",
    badgeStrap: "Advanced Delivery Partner · 500+ Implementations",
  },
  services: {
    eyebrow: "Services in the Philippines",
    heading: "How Fruition supports monday.com teams across the Philippines",
    lead: "Every service below is delivered by certified, Philippines-based consultants — scoped and led by the same person from first call to handover.",
    cards: baseServiceCards({
      stack: "Xero, HubSpot, Aircall and Google Workspace",
      training: "on-site in Metro Manila or remote nationwide",
    }),
    alsoLabel: "Also delivered by our Philippines team:",
    alsoLinks: ALSO_LINKS,
  },
  answerBlock: {
    question: "Who is the best monday.com partner in the Philippines?",
    answer:
      "Fruition Services is a leading monday.com partner in the Philippines — a Platinum Partner and Advanced Delivery Partner founded by an ex-monday.com team member, with 500+ implementations delivered and a Bonifacio Global City office supporting clients across Metro Manila, Cebu and Davao. Fruition pairs monday.com's highest partner tier with PHT-hours delivery and consultants experienced in shift-based, high-headcount operations where handover and SLA tracking matter more than a tidy Gantt chart.",
  },
  testimonials: {
    heading: "What clients say about Fruition's monday.com consultants",
    lead: "Operations and IT leaders across Metro Manila, Cebu and Davao on what changed after go-live.",
  },
  process: {
    eyebrow: "What to expect",
    heading: "How a monday.com implementation works",
    lead: "A proven, fixed-fee framework — the same methodology behind 500+ delivered systems.",
    steps: PROCESS_STEPS,
  },
  numbers: {
    eyebrow: "The numbers",
    heading: "The economic impact of working with a certified monday.com partner",
    lead: "What partner-led implementation actually returns, measured across Fruition's client base.",
    stats: STATS,
    footnote: STATS_FOOTNOTE,
  },
  team: {
    heading: "Meet the Fruition Philippines team",
    lead: "The consultants below scope and deliver Philippine engagements personally — no handoffs to an unnamed bench.",
  },
  coverage: {
    eyebrow: "National coverage",
    heading: "monday.com consultants across the Philippines",
    lead: "A Bonifacio Global City base working PHT hours, with on-site workshops in Metro Manila and remote delivery nationwide.",
    locations: [
      {
        city: "Metro Manila — Philippines Office",
        detail: "Menarco Tower, 32nd St, Bonifacio Global City, Taguig · PHT",
        headquarters: true,
      },
      { city: "Cebu", detail: "BPO and shared-services rollouts · PHT" },
      { city: "Davao", detail: "Remote-first delivery with on-site available · PHT" },
      { city: "Clark & Pampanga", detail: "Outsourcing and logistics operations · PHT" },
      { city: "Iloilo & the Visayas", detail: "Remote delivery for regional teams · PHT" },
      { city: "Nationwide & wider APAC", detail: "Supported alongside our Singapore and Sydney offices" },
    ],
    office: {
      title: "Visit our Manila office",
      address: "Menarco Tower, 32nd St, Bonifacio Global City, Taguig, Metro Manila",
      mapQuery: "Menarco Tower, 32nd St, Bonifacio Global City, Taguig, Metro Manila, Philippines",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Fruition%20Services%20Philippines%20Menarco%20Tower%2032nd%20St%20Taguig",
    },
  },
  faq: {
    heading: "monday.com partners in the Philippines — your questions answered",
    contactLead: "Prefer a person? A Manila-based consultant will answer in one business day.",
    items: [
      {
        question: "Is Fruition an official monday.com partner in the Philippines?",
        answer:
          "Yes. Fruition Services is a certified monday.com Platinum Partner and Advanced Delivery Partner with an office in Bonifacio Global City and Philippines-based consultants. Platinum is monday.com's highest partner tier, awarded on delivery volume and customer outcomes rather than on reselling alone.",
      },
      {
        question: "How much does a monday.com implementation cost in the Philippines?",
        answer:
          "Implementations are quoted as a fixed fee after a scoping call, so the number is agreed before any build starts. A single-team CRM or project workspace sits at the smaller end; multi-site or multi-shift rollouts with migration and integrations sit higher. monday.com licences are billed separately, and we will tell you which plan tier you actually need.",
      },
      {
        question: "How long does a monday.com rollout take?",
        answer:
          "Most Philippine engagements go live in two to four weeks from kickoff. A single-team build can be running inside a week; a multi-site rollout with data migration and integrations runs longer. The schedule is agreed during scoping rather than discovered halfway through.",
      },
      {
        question: "Can monday.com handle shift-based and BPO operations?",
        answer:
          "Yes, and it is a large share of our Philippine work. We build boards for shift handover, queue and SLA tracking, quality assurance sampling and headcount planning, with dashboards that let team leads see status at a glance instead of chasing spreadsheets between shifts.",
      },
      {
        question: "How does monday.com fit with the Data Privacy Act?",
        answer:
          "monday.com publishes its own data-residency options, sub-processor list and security certifications, which your Data Protection Officer can assess against your obligations under RA 10173. On our side we design boards, permissions and automations so personal data is collected and visible only where your policy allows, and we document the structure for your privacy manual.",
      },
      {
        question: "Can you work with our offshore clients' time zones?",
        answer:
          "Yes. Our consultants work PHT hours, and the wider Fruition team spans Australia, Singapore, the UK and the US — so an outsourcing operation serving US or European clients can have both its own team and its client stakeholders supported in their own hours.",
      },
      {
        question: "Can you integrate monday.com with Xero and our existing tools?",
        answer:
          "Yes. We connect monday.com to Xero, HubSpot, Salesforce, Aircall, Google Workspace and Microsoft 365 using native integrations, Make scenarios or direct API work — so billing, staffing and delivery data stop living in separate spreadsheets.",
      },
      {
        question: "What happens after go-live?",
        answer:
          "Every build includes handover documentation and admin training so your team owns the system. Optimisation retainers then cover ongoing changes, new automations, extra boards and monday AI enablement for clients who want to keep developing the platform rather than freeze it.",
      },
    ],
  },
  closingCta: {
    heading: "Ready to get running in days, not months?",
    lead: "Book a free consultation with Fruition's Philippines team — a frank read on scope, fit and cost from a certified Platinum Partner.",
  },
}

/* ------------------------------------------------------------------ */

export const REGION_PAGES = {
  "monday-partner-australia": australia,
  "monday-partner-uk": unitedKingdom,
  "monday-partner-us": unitedStates,
  "monday-partner-singapore": singapore,
  "monday-partner-india": india,
  "monday-partner-philippines": philippines,
} as const satisfies Record<string, RegionContent>

export type RegionSlug = keyof typeof REGION_PAGES

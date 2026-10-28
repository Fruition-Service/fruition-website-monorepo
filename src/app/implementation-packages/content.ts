/**
 * /implementation-packages copy and structured data.
 *
 * Source: Josh Jebathilak's redesign (14 Oct 2026, "implementation-packages.html")
 * plus the 27 Oct 2026 review: three price cards with a "See what's included"
 * fold-out holding the comparison table, the booking CTA directly below the
 * packages, blue CTAs, no package hours.
 *
 * The page used to render from the Sanity singleton `implementationPackagesPage`.
 * That document is no longer read by this route: the redesign's copy, prices
 * and FAQs live here so the visible page and the JSON-LD @graph come from one
 * source and cannot disagree. Edit prices in PACKAGES only; the cards, the
 * comparison table, the summary and the Offer nodes all derive from it.
 *
 * Copy is Josh's, verbatim, except numeric ranges ("1-2 teams") which use a
 * hyphen instead of an en dash, and empty table cells, which read "Not included".
 */

export const PAGE_PATH = "/implementation-packages"
export const SITE_URL = "https://www.fruitionservices.io"
export const PAGE_URL = `${SITE_URL}${PAGE_PATH}`

export const SEO_TITLE = "monday.com Implementation Packages | Platinum Partner"
export const SEO_DESCRIPTION =
  "monday.com implementation packages from a Platinum Partner: Training & Optimisation from $2,500, Lock-Step from $5,000, Deployed Engineer from $2,500/month."
export const DATE_MODIFIED = "2026-10-28"

export const PHONE_DISPLAY = "+61 483 955 931"
export const PHONE_HREF = "tel:+61483955931"

/* ------------------------------------------------------------------ */
/*  Packages: the single source for every price on the page            */
/* ------------------------------------------------------------------ */

export type PackageId = "training" | "lockstep" | "deployed"

export interface ImplementationPackage {
  id: PackageId
  tag: string
  name: string
  team: string
  /** USD at the US team rate. The currency switcher converts from this. */
  basePriceUsd: number
  cadence: "one-time" | "per month"
  bestFor: string
  highlights: string[]
  ctaLabel: string
  /** Offer description for the JSON-LD OfferCatalog. */
  offerDescription: string
  offerServiceName: string
}

export const PACKAGES: ImplementationPackage[] = [
  {
    id: "training",
    tag: "Reset and train",
    name: "Training & Optimisation",
    team: "1 team · up to 25 users",
    basePriceUsd: 2500,
    cadence: "one-time",
    bestFor: "teams already on monday.com whose boards, automations or adoption need fixing.",
    highlights: [
      "Up to 5 boards reviewed and cleaned up",
      "Up to 10 automations optimised",
      "2 training sessions",
    ],
    ctaLabel: "Get started",
    offerDescription:
      "One-time, 1 team up to 25 users: up to 5 boards reviewed, up to 10 automations optimised, 2 training sessions and a handover guide.",
    offerServiceName: "monday.com Training & Optimisation",
  },
  {
    id: "lockstep",
    tag: "We build and deploy together",
    name: "Lock-Step",
    team: "1-2 teams · up to 50 users",
    basePriceUsd: 5000,
    cadence: "one-time",
    bestFor: "new rollouts and rebuilds of the workflows your business runs on.",
    highlights: [
      "1-2 workflows mapped and built",
      "Up to 8 boards + 2 dashboards",
      "Up to 15 automations + 1 integration",
    ],
    ctaLabel: "Get quote",
    offerDescription:
      "We build and deploy together. One-time, 1-2 teams up to 50 users: 1-2 workflows, up to 8 boards and 2 dashboards, up to 15 automations, 1 integration, 3 training sessions and 30 days of go-live support.",
    offerServiceName: "monday.com Lock-Step implementation",
  },
  {
    id: "deployed",
    tag: "Ongoing, embedded",
    name: "Deployed Engineer",
    team: "Multiple teams · up to 250 users",
    basePriceUsd: 2500,
    cadence: "per month",
    bestFor:
      "organisations whose processes keep changing and want monday.com expertise on the team.",
    highlights: [
      "1 named forward deployed engineer",
      "Change requests in 2 business days",
      "Monthly roadmap review",
    ],
    ctaLabel: "Get your options",
    offerDescription:
      "Monthly, multiple teams up to 250 users: a named forward deployed engineer for ongoing builds, automations and integrations, change requests within 2 business days and monthly roadmap reviews.",
    offerServiceName: "monday.com Deployed Engineer",
  },
]

/** "$2,500" in USD, the crawler-visible default and the JSON-LD figure. */
export function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`
}

const [TRAINING, LOCKSTEP, DEPLOYED] = PACKAGES

/** One row of the comparison table. `null` renders as "Not included". */
export interface CompareRow {
  label: string
  cells: [string | null, string | null, string | null]
}

export const COMPARE_ROWS: CompareRow[] = [
  { label: "Team size", cells: ["1 team, up to 25 users", "1-2 teams, up to 50 users", "Multiple teams, up to 250 users"] },
  { label: "Best for", cells: ["Existing accounts that need a reset", "New rollouts and core rebuilds, built and deployed together", "Continuous change and scale"] },
  { label: "Process mapping", cells: ["Review of current boards and workflows", "1-2 workflows mapped end to end", "Every new workflow, as needed"] },
  { label: "Solution design", cells: ["Written recommendations", "✓ Signed off before build", "✓ For each new build"] },
  { label: "Boards and dashboards", cells: ["Up to 5 boards cleaned up", "Up to 8 boards + 2 dashboards built", "New boards and dashboards each month"] },
  { label: "Automations", cells: ["Up to 10 optimised", "Up to 15 built", "✓ Ongoing"] },
  { label: "Integrations and data migration", cells: [null, "1 integration + 1 data import", "✓ Ongoing"] },
  { label: "Working sessions", cells: ["1 discovery session", "4 build sessions with your team", "Weekly check-in"] },
  { label: "Training", cells: ["2 sessions (users and admins)", "3 sessions (users, champions, admins)", "✓ As teams and roles change"] },
  { label: "Go-live support", cells: [null, "30 days after go-live", "✓ Ongoing"] },
  { label: "Admin support and change requests", cells: [null, null, "✓ Within 2 business days"] },
  { label: "Documentation", cells: ["✓ Handover guide", "✓ Handover and admin guide", "✓ Living documentation"] },
  { label: "Roadmap reviews", cells: [null, null, "✓ Monthly"] },
]

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: "monday.com Platinum Partner · AU · UK · US · India · Singapore",
  h1Before: "monday.com implementation packages, ",
  h1Accent: "fixed in scope",
  h1After: " and built to be adopted.",
  /** Answer-first summary: the WebPage speakable selector points at it. */
  answer: `Fruition is a monday.com Platinum Partner offering three monday.com implementation packages: Training & Optimisation (from ${usd(TRAINING.basePriceUsd)} one-time, 1 team up to 25 users), Lock-Step, where we build and deploy together (from ${usd(LOCKSTEP.basePriceUsd)} one-time, up to 50 users), and Deployed Engineer (from ${usd(DEPLOYED.basePriceUsd)} per month, up to 250 users). Each package maps your process first, then builds boards, automations and integrations your team actually uses.`,
  lead: "Most teams buy monday.com, build a few boards and stall. Our packages fix the process before the platform, so you get workflows, reporting and automations that hold up after go-live.",
  bullets: [
    "Three packages: optimise, build together, or embed an engineer",
    "Process mapping and solution design before anything is built",
    "Integrations, data migration, training and handover documentation included where scoped",
    "Consultants in Sydney, Singapore, India, London and New York time zones",
  ],
  chips: [
    "monday.com Platinum Partner",
    "Atlassian Platinum Partner (Senzo)",
    "2026 Rising Star awards",
    "OpenAI & Anthropic partner",
    "NSW Gov ICT Scheme SCM0020",
  ],
}

export const FORM = {
  heading: "Book a free 30-minute system audit",
  intro:
    "We map your workflow, spot the automation wins and recommend the right implementation package. No obligation.",
  industries: ["Construction & trades", "Government", "Manufacturing", "Professional services", "Real estate & property", "Marketing & agencies", "Retail", "Other"],
  plans: ["Not on monday.com yet", "Basic / Standard", "Pro", "Enterprise"],
  products: ["Work Management", "monday CRM", "monday Service", "monday dev", "Not sure"],
  regions: ["Australia & NZ", "South-East Asia", "India & UAE", "UK & Europe", "US & Canada"],
  submit: "Book my system audit",
  footnote: "Reply within one business day, in your time zone.",
  thanksHeading: "Thanks, we've got it.",
  thanks:
    "A Fruition monday.com consultant will email you within one business day to book your audit.",
}

export const LOGOS = [
  { src: "https://cdn.sanity.io/images/bt6nb58h/production/034c0b291272f680c860dc42ac88d17776d2f356-900x248.png?w=260&fit=max&auto=format", alt: "Telstra", width: 124, height: 34 },
  { src: "https://cdn.sanity.io/images/bt6nb58h/production/ae132b4ca3b3c0a8d8494b5b83b31f7f2ba2478c-354x206.png?w=260&fit=max&auto=format", alt: "Reserve Bank of Australia", width: 58, height: 34 },
  { src: "https://cdn.sanity.io/images/bt6nb58h/production/81985272b636b9b5ea67500e58ba32665bfd027e-900x207.png?w=260&fit=max&auto=format", alt: "CSIRO", width: 130, height: 30 },
  { src: "https://cdn.sanity.io/images/bt6nb58h/production/a76238ed023b45602730a252c456f248216a4664-259x280.png?w=260&fit=max&auto=format", alt: "Transport for NSW", width: 32, height: 34 },
  { src: "https://cdn.sanity.io/images/bt6nb58h/production/f7d89f47cc4927d8c57031744dc8e311370bb591-640x437.png?w=260&fit=max&auto=format", alt: "SBS", width: 50, height: 34 },
  { src: "https://cdn.sanity.io/images/bt6nb58h/production/9435fce8d10d7491b53c702de6cbf0d50e5e508f-899x344.png?w=260&fit=max&auto=format", alt: "Specsavers", width: 89, height: 34 },
]

export const AT_A_GLANCE: Array<[string, string]> = [
  ["Company", "Fruition Services"],
  ["monday.com status", "monday.com Platinum Partner"],
  ["Other partnerships", "Atlassian Platinum Partner (Senzo) · OpenAI partner · Anthropic Claude partner"],
  ["Recognition", "2026 Rising Star awards · Finalist, 2026 Australian AI Awards · NSW Government ICT Services Scheme (SCM0020, Advanced)"],
  ["Clients", "900+ small and mid-sized organisations"],
  ["Implementation packages", PACKAGES.map((p) => `${p.name} (from ${usd(p.basePriceUsd)} ${p.cadence})`).join(" · ")],
  ["monday.com products", "Work Management, monday CRM, monday Service, monday dev, monday AI and Vibe apps"],
  ["Regions", "Australia & NZ, South-East Asia, India & UAE, UK & Europe, US & Canada"],
  ["Approach", "Process before platform: map and agree the process, then design, build, train and hand over"],
]

export const EXAMPLE = {
  eyebrow: "What an implementation actually changes",
  heading: "One workflow, before and after a Fruition implementation",
  lead: "A typical first use case from a Lock-Step package on a construction operations board. The same pattern applies to CRM pipelines, service desks and project portfolios.",
  steps: [
    { tag: "Trigger", title: "A site request lands on the board", body: "Submitted through a monday.com form, the mobile app or an email integration. No more requests buried in inboxes." },
    { tag: "Automate", title: "It's routed, prioritised and assigned", body: "Automations set status, owner and due date from your routing rules. monday AI can summarise and categorise the request where you want it to." },
    { tag: "Report", title: "Everyone sees what's next", body: "Dashboards show workload, SLAs and blockers by project. The client gets an automatic update, and the PM reviews exceptions, not every request." },
  ],
}

export const WHY_NOW = {
  eyebrow: "Why implementation matters",
  heading: "Your monday.com plan can do more than your team is using",
  paragraphs: [
    "Most monday.com accounts we audit run a fraction of what their plan already includes. Automations, integrations, dashboards, forms and monday AI sit unused while the same work is still done by hand: chasing updates, re-keying data and building the Monday status report from scratch.",
    "A Fruition implementation package closes that gap one workflow at a time. We start with the process, agree it with the people who run it, then build it in monday.com so the system matches how the work really happens.",
  ],
  signsHeading: "Signs you need an implementation partner",
  signs: [
    "Boards were built by different people, with no shared structure",
    "Reporting still lives in spreadsheets",
    "Automations break or nobody owns them",
    "Data sits in a CRM, finance or document tool that monday.com can't see",
    "Adoption dropped after the first month",
  ],
}

export const PACKAGES_INTRO = {
  eyebrow: "monday.com implementation pricing",
  heading: "Three packages, sized to your team",
  lead: "Choose by team size and what you need done. Every package starts with your workflows, not a template, and every price is fixed before work starts.",
  enterprise: "More than 250 users or several departments? We scope enterprise rollouts separately.",
  enterpriseCta: "Get quote",
  compareHeading: "What's included in each monday.com implementation package",
  compareToggle: "See what's included",
  footnote:
    "Prices shown in USD at the US team rate. Local rates apply for Australia & NZ, South-East Asia, India & UAE and UK & Europe. One package is purchased per monday.com product. monday.com licences are paid separately to monday.com.",
}

export const CTA = {
  heading: "Find the right monday.com implementation package",
  body: "Book a free 30-minute system audit. We'll map your workflow, spot the automation wins and recommend the package to get there.",
  primary: "Book a free system audit",
  secondary: `Call ${PHONE_DISPLAY}`,
}

export const METHOD = {
  eyebrow: "Our implementation method",
  heading: "How a Fruition monday.com implementation runs",
  lead: "The same five stages sit behind every package. Training & Optimisation compresses them; Lock-Step and Deployed Engineer run each one in full.",
  steps: [
    { title: "Discovery and process analysis", body: "We map team structures, current tools and the steps people actually follow, then agree the future process with the people who run it." },
    { title: "Configuration and customisation", body: "Boards, columns, views, dashboards, forms and permissions built to the agreed design, using monday.com's native features first." },
    { title: "Data migration and integration", body: "Data moved from spreadsheets or legacy tools, and integrations set up to systems such as Xero, HubSpot, Salesforce, Outlook, Slack or Jira." },
    { title: "Training and onboarding", body: "Role-based training for end users, champions and admins, with documentation written for your workflows rather than generic guides." },
    { title: "Go-live and ongoing support", body: "A supported go-live, adoption checks and a clear path to a Deployed Engineer or ad-hoc help as your processes change." },
  ],
}

export const INDUSTRIES = {
  eyebrow: "Implementation by industry",
  heading: "monday.com implementations for the industries we know",
  lead: "Every package starts from a proven pattern for your sector, then gets shaped around your workflows.",
  items: [
    { href: "/monday-for-construction", title: "Construction & trades", body: "Tenders, project delivery, variations, site diaries and subcontractor management.", link: "monday.com for construction" },
    { href: "/monday-for-government", title: "Government", body: "Program and project portfolios, approvals and reporting under procurement and records rules.", link: "monday.com for government" },
    { href: "/monday-for-manufacturing", title: "Manufacturing", body: "Production planning, quality, maintenance and supplier workflows.", link: "monday.com for manufacturing" },
    { href: "/monday-for-real-estate", title: "Real estate & property", body: "Listings, developments, leasing and property management pipelines.", link: "monday.com for real estate" },
    { href: "/monday-for-marketing", title: "Marketing & agencies", body: "Campaigns, content calendars, approvals and client reporting.", link: "monday.com for marketing" },
    { href: "/monday-crm-consulting", title: "Sales teams on monday CRM", body: "Pipelines, lead routing, quoting and CRM migrations from Salesforce, HubSpot or Pipedrive.", link: "monday CRM consulting" },
  ],
}

export const WHY = {
  eyebrow: "Why Fruition",
  heading: "Why teams choose Fruition for monday.com implementation",
  items: [
    { title: "Process before platform", body: "We map and agree the process before we build. It's why our implementations get adopted instead of abandoned after the first month." },
    { title: "monday.com insiders", body: "Fruition was founded by Josh Jebathilak after about six years in sales leadership at monday.com, and is a monday.com Platinum Partner." },
    { title: "Your time zone, not ours", body: "Consultants working in Sydney, Singapore, India, London and New York hours, with pricing for each region." },
    { title: "More than monday.com", body: "Our group includes an Atlassian Platinum Partner (Senzo) and a HubSpot practice, and we're OpenAI and Anthropic partners for monday AI and agent work." },
  ],
}

export const REVIEWS = {
  eyebrow: "Client proof",
  heading: "What clients say after a Fruition implementation",
  items: [
    { quote: "We are now utilising monday.com to its full potential, from lead through design and production teams. Everyone knows what stage our projects are in, what's next and what our process is.", name: "Jade Wood", role: "Managing Director, Popology" },
    { quote: "Process automation across campaign management, budget management and project approvals has saved significant amounts of time for staff globally and also improved collaboration across global teams.", name: "Emily Hill", role: "International Markets Manager, Tourism Northern Territory" },
    { quote: "Josh and his team were excellent from start to finish on building our monday.com integrations and automations. Very happy with them.", name: "Luke Reddin", role: "Director, Clean Power Australia" },
    { quote: "Since implementing monday.com, CLSQ has experienced a significant transformation in operational efficiency.", name: "Lorenzo Tejada-Orrell", role: "Chief Innovation Officer, CLSQ" },
  ],
}

export const REGIONS = {
  eyebrow: "monday.com implementation in your region",
  links: [
    { href: "/monday-partner-australia", label: "monday.com partner Australia" },
    { href: "/monday-partner-uk", label: "monday.com partner UK" },
    { href: "/monday-partner-us", label: "monday.com partner US" },
    { href: "/monday-partner-india", label: "monday.com partner India" },
    { href: "/monday-partner-singapore", label: "monday.com partner Singapore" },
    { href: "/monday-implementation-consultants", label: "monday.com implementation consultants" },
    { href: "/monday-training", label: "monday.com training" },
  ],
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

export const FAQ_INTRO = {
  eyebrow: "monday.com implementation FAQ",
  heading: "Questions about our implementation packages",
}

export const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How much does a monday.com implementation cost?",
    a: `A monday.com implementation with Fruition costs from ${usd(TRAINING.basePriceUsd)} one-time for Training & Optimisation (1 team, up to 25 users), from ${usd(LOCKSTEP.basePriceUsd)} one-time for a Lock-Step build (1-2 teams, up to 50 users), or from ${usd(DEPLOYED.basePriceUsd)} per month for a Deployed Engineer (multiple teams, up to 250 users). Prices are in USD at the US team rate and fixed before work starts. monday.com licences are paid separately.`,
  },
  {
    q: "How long does a monday.com implementation take?",
    a: "Training & Optimisation is typically completed in 1-2 weeks. A Lock-Step implementation of one or two workflows typically takes 3-6 weeks from discovery to go-live, followed by 30 days of go-live support. A Deployed Engineer works with you month to month, with change requests handled within 2 business days.",
  },
  {
    q: "What are the steps in a monday.com implementation?",
    a: "A Fruition monday.com implementation follows five steps: 1. discovery and process mapping, 2. configuration of boards, dashboards and permissions, 3. data migration and integrations, 4. role-based training, and 5. go-live and ongoing support. The solution design is signed off before anything is built.",
  },
  {
    q: "Which monday.com implementation package should I choose?",
    a: "Choose Training & Optimisation if you already use monday.com and need boards, automations and adoption fixed for one team. Choose Lock-Step if you are rolling out monday.com or rebuilding a core workflow for up to 50 users. Choose Deployed Engineer if several teams need ongoing builds, integrations and change requests.",
  },
  {
    q: `What is included in the ${usd(LOCKSTEP.basePriceUsd)} Lock-Step package?`,
    a: "Lock-Step includes mapping of 1-2 workflows, a signed-off solution design, up to 8 boards and 2 dashboards, up to 15 automations, 1 integration and 1 data import, 4 build sessions with your team, 3 training sessions, handover and admin documentation, and 30 days of go-live support.",
  },
  {
    q: "How does Deployed Engineer pricing work?",
    a: `Deployed Engineer starts at ${usd(DEPLOYED.basePriceUsd)} per month and gives you a named Fruition engineer for ongoing monday.com builds, automations, integrations and admin support. Change requests are handled within 2 business days, with a weekly check-in and a monthly roadmap review. Pricing scales with the number of teams and users supported.`,
  },
  {
    q: "Do implementation prices include monday.com licences?",
    a: "No. Fruition's implementation pricing covers consulting, configuration, integrations and training. monday.com seat licences are purchased separately from monday.com, and we can advise on the right plan (Basic, Standard, Pro or Enterprise) during your free system audit.",
  },
  {
    q: "Are data migration and integrations included?",
    a: "Lock-Step includes 1 integration and 1 data import, for example from spreadsheets or a legacy CRM. Deployed Engineer includes integrations and migrations on an ongoing basis. Larger migrations, such as moving from Salesforce or HubSpot to monday CRM, are scoped and quoted separately.",
  },
  {
    q: "What if we have more than 250 users or several departments?",
    a: "Rollouts above 250 users, or across several departments and monday.com products, are scoped as an enterprise implementation. We combine a Lock-Step build per department with a Deployed Engineer for ongoing change, and quote it after a free system audit.",
  },
  {
    q: "Do monday.com implementation prices differ by region?",
    a: "Yes. Prices on this page are in USD at the US team rate. Fruition has local rates for Australia & NZ, South-East Asia, India & UAE and UK & Europe, delivered by consultants in your time zone.",
  },
  {
    q: "Is Fruition a certified monday.com partner?",
    a: "Yes. Fruition is a monday.com Platinum Partner with consultants in Australia, Singapore, India, the UK and the US, and has worked with more than 900 small and mid-sized organisations.",
  },
]

/* ------------------------------------------------------------------ */
/*  JSON-LD: one @graph for the whole page                             */
/* ------------------------------------------------------------------ */

/**
 * The page's only JSON-LD block. The Organization node is the site-wide one
 * from the root layout (`/#organization`), referenced by @id rather than
 * redefined; the breadcrumb trail lives here too, and `Breadcrumbs` skips its
 * own BreadcrumbList for this path (see PAGES_WITH_OWN_BREADCRUMB_SCHEMA).
 */
export function buildJsonLd() {
  const ORG_ID = `${SITE_URL}/#organization`
  const SERVICE_ID = `${PAGE_URL}#service`
  const COUNTRIES = ["Australia", "New Zealand", "Singapore", "India", "United Arab Emirates", "United Kingdom", "United States", "Canada"]

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: SEO_TITLE,
        description: SEO_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Fruition Services" },
        about: { "@id": SERVICE_ID },
        publisher: { "@id": ORG_ID },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        dateModified: DATE_MODIFIED,
        speakable: { "@type": "SpeakableSpecification", cssSelector: [".answer"] },
      },
      {
        "@type": "Service",
        "@id": SERVICE_ID,
        name: "monday.com implementation packages",
        serviceType: [
          "monday.com implementation",
          "monday.com implementation packages",
          "monday.com implementation services",
          "monday.com implementation consultant",
          "monday.com implementation partner",
          "monday.com setup",
          "monday.com onboarding",
          "monday.com professional services",
        ],
        url: PAGE_URL,
        provider: { "@id": ORG_ID },
        areaServed: COUNTRIES.map((name) => ({ "@type": "Country", name })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "monday.com implementation packages",
          itemListElement: PACKAGES.map((p) => ({
            "@type": "Offer",
            name: p.name,
            description: p.offerDescription,
            url: `${PAGE_URL}#packages`,
            priceSpecification:
              p.cadence === "per month"
                ? {
                    "@type": "UnitPriceSpecification",
                    price: p.basePriceUsd,
                    priceCurrency: "USD",
                    referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
                  }
                : { "@type": "PriceSpecification", minPrice: p.basePriceUsd, priceCurrency: "USD" },
            itemOffered: { "@type": "Service", name: p.offerServiceName },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "monday.com consulting", item: `${SITE_URL}/partnerships/monday-consulting-partner` },
          { "@type": "ListItem", position: 3, name: "Implementation packages", item: PAGE_URL },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#josh-jebathilak`,
        name: "Josh Jebathilak",
        jobTitle: "Founder & Managing Director",
        worksFor: { "@id": ORG_ID },
      },
    ],
  }
}

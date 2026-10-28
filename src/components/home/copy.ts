/**
 * Home page copy slots.
 *
 * The text lives on the `homePage` Sanity document as `copy[]`, one entry per
 * slot, keyed by slot id (`_key`). That makes every line editable with the
 * inline editor (stega marks it as `copy[_key=="<id>"].text`). The wording
 * below is the default: a slot missing or emptied in Sanity falls back to it,
 * so the page can never render blank. `scripts/seed-home-copy.ts` writes these
 * defaults into Sanity for any slot that doesn't exist there yet.
 *
 * To add text to the home page: add a slot here, read it with homeText(), then
 * run the seed script. Slot ids must match /^[\w-]+$/ (they become `_key`s).
 */

export const HOME_COPY = {
  // Hero
  "hero-badge": { label: "Hero: award badge", text: "Rising Star 2026" },
  "hero-title": { label: "Hero: title", text: "Implementation, integration and AI advisory for" },
  "hero-title-accent": { label: "Hero: title (purple part)", text: "monday.com, Atlassian and HubSpot." },
  "hero-lead": { label: "Hero: lead paragraph", text: "Fruition is a monday.com Platinum Partner helping small businesses, mid-market and enterprise teams across Australia, India, the Philippines, Singapore, the UK and the US. We design the way work should run \u2014 build it, and help you maintain it." },
  "hero-cta-primary": { label: "Hero: primary button", text: "Book a discovery call" },
  "hero-cta-secondary": { label: "Hero: secondary button", text: "Explore our services" },
  "hero-proof": { label: "Hero: proof line under buttons", text: "900+ implementations · 6 markets" },
  "hero-orbit-more": { label: "Hero graphic: orbit badge", text: "+40" },
  "hero-node-monday": { label: "Hero graphic: monday.com pill", text: "monday.com" },
  "hero-node-atlassian": { label: "Hero graphic: Atlassian pill", text: "Atlassian" },
  "hero-node-hubspot": { label: "Hero graphic: HubSpot pill", text: "HubSpot" },
  "hero-node-claude": { label: "Hero graphic: Claude pill", text: "Claude" },
  "hero-node-openai": { label: "Hero graphic: OpenAI pill", text: "OpenAI" },
  "hero-node-copilot": { label: "Hero graphic: Copilot pill", text: "Copilot" },
  "hero-node-n8n": { label: "Hero graphic: n8n pill", text: "n8n" },

  // Clients
  "clients-heading": { label: "Clients strip: heading", text: "Trusted by teams across 900+ implementations" },
  "clients-more": { label: "Clients strip: last tile", text: "900+ more" },

  // Services
  "services-eyebrow": { label: "Services: eyebrow", text: "What we do" },
  "services-heading": { label: "Services: heading", text: "Six practices, one operating model \u2014 designed to make platforms fit your business." },
  "services-1-title": { label: "Services: card 1 title", text: "Platform implementation" },
  "services-1-body": { label: "Services: card 1 body", text: "monday.com, Atlassian and HubSpot: discovery, solution design, build, data migration and go-live." },
  "services-2-title": { label: "Services: card 2 title", text: "Integrations & automation" },
  "services-2-body": { label: "Services: card 2 body", text: "Native integrations, API and middleware on n8n, and migrations off any current tools or spreadsheets." },
  "services-3-title": { label: "Services: card 3 title", text: "AI advisory & implementation" },
  "services-3-body": { label: "Services: card 3 body", text: "Readiness, adoption frameworks and agent builds on Claude, OpenAI and Copilot, with platform-native AI." },
  "services-4-title": { label: "Services: card 4 title", text: "Change management & adoption" },
  "services-4-body": { label: "Services: card 4 body", text: "Stakeholder engagement, training, comms and measurement: the reason implementations stick." },
  "services-5-title": { label: "Services: card 5 title", text: "Software licence procurement" },
  "services-5-body": { label: "Services: card 5 body", text: "Audit, sourcing, negotiation and renewal management for Microsoft, Google, Adobe, Atlassian, monday.com and similar software." },
  "services-6-title": { label: "Services: card 6 title", text: "FDE & managed services" },
  "services-6-body": { label: "Services: card 6 body", text: "Full deployment experience, ongoing optimisation, and managed support that keeps your platforms running long after go-live." },
  "services-card-cta": { label: "Services: card link text (all cards)", text: "Learn more →" },

  // Booking
  "booking-heading": { label: "Booking: heading", text: "Let's design the way your business should run." },
  "booking-subheading": { label: "Booking: subheading", text: "30 minutes. No obligation. Speak to a consultant, not a salesperson." },

  // Testimonials
  "testimonials-eyebrow": { label: "Client proof: eyebrow", text: "Client proof" },
  "testimonials-heading": { label: "Client proof: heading", text: "What our customers say about us" },
  "testimonials-intro": { label: "Client proof: intro", text: "Operations and IT leaders on what changed after we mapped the process first." },
  "testimonials-cta": { label: "Client proof: button", text: "Book a call" },

  // Stats
  "stats-eyebrow": { label: "By the numbers: eyebrow", text: "By the numbers" },
  "stats-heading": { label: "By the numbers: heading", text: "Platinum tier, earned in under two years." },
  "stats-1-value": { label: "By the numbers: tile 1 figure", text: "900+" },
  "stats-1-label": { label: "By the numbers: tile 1 label", text: "implementations delivered" },
  "stats-2-value": { label: "By the numbers: tile 2 figure", text: "6" },
  "stats-2-label": { label: "By the numbers: tile 2 label", text: "markets · 3 entities" },
  "stats-3-value": { label: "By the numbers: tile 3 figure", text: "<24m" },
  "stats-3-label": { label: "By the numbers: tile 3 label", text: "Authorised → Platinum" },
  "stats-4-value": { label: "By the numbers: tile 4 figure", text: "2026" },
  "stats-4-label": { label: "By the numbers: tile 4 label", text: "Rising Star winner" },

  // Method
  "method-eyebrow": { label: "Method: eyebrow", text: "The Fruition method" },
  "method-heading": { label: "Method: heading", text: "Process before platform." },
  "method-lead": { label: "Method: lead paragraph", text: "We design how your business should run first \u2014 then configure the platform to match. Numbered because the sequence matters." },
  "method-1-title": { label: "Method: step 1 title", text: "Discover" },
  "method-1-desc": { label: "Method: step 1 description", text: "Map how work should run" },
  "method-2-title": { label: "Method: step 2 title", text: "Design" },
  "method-2-desc": { label: "Method: step 2 description", text: "Blueprint process, data, integrations" },
  "method-3-title": { label: "Method: step 3 title", text: "Deliver" },
  "method-3-desc": { label: "Method: step 3 description", text: "Build and migrate in sprints" },
  "method-4-title": { label: "Method: step 4 title", text: "Adopt" },
  "method-4-desc": { label: "Method: step 4 description", text: "Change management and training" },

  // Where we work
  "where-eyebrow": { label: "Where we work: eyebrow", text: "Where we work" },
  "where-heading": { label: "Where we work: heading", text: "Consultants across six markets." },
  "where-lead": { label: "Where we work: side note", text: "Whatever your time zone, one of our hubs is online during your working day." },
  "where-country-au": { label: "Where we work: country name (Australia)", text: "Australia" },
  "where-country-sg": { label: "Where we work: country name (Singapore)", text: "Singapore" },
  "where-country-ph": { label: "Where we work: country name (Philippines)", text: "Philippines" },
  "where-country-in": { label: "Where we work: country name (India)", text: "India" },
  "where-country-uk": { label: "Where we work: country name (United Kingdom)", text: "United Kingdom" },
  "where-country-us": { label: "Where we work: country name (United States)", text: "United States" },

  // Industries
  "industries-eyebrow": { label: "Industries: eyebrow", text: "Industries we focus on" },
  "industries-heading": { label: "Industries: heading", text: "Four industries. One method." },
  "industries-lead": { label: "Industries: lead paragraph", text: "We work deep in a small set of industries \u2014 so your processes aren't new to us." },
  "industries-1-title": { label: "Industries: card 1 title", text: "Industrial" },
  "industries-1-tagline": { label: "Industries: card 1 tagline", text: "Heavy process, heavy coordination." },
  "industries-1-chip-1": { label: "Industries: card 1 chip 1", text: "Manufacturing" },
  "industries-1-chip-2": { label: "Industries: card 1 chip 2", text: "Construction" },
  "industries-1-chip-3": { label: "Industries: card 1 chip 3", text: "Engineering" },
  "industries-1-chip-4": { label: "Industries: card 1 chip 4", text: "Infrastructure" },
  "industries-2-title": { label: "Industries: card 2 title", text: "Public sector" },
  "industries-2-tagline": { label: "Industries: card 2 tagline", text: "Accountable, auditable delivery." },
  "industries-2-chip-1": { label: "Industries: card 2 chip 1", text: "Local government" },
  "industries-2-chip-2": { label: "Industries: card 2 chip 2", text: "State government" },
  "industries-2-chip-3": { label: "Industries: card 2 chip 3", text: "Federal agencies" },
  "industries-2-chip-4": { label: "Industries: card 2 chip 4", text: "NGOs" },
  "industries-3-title": { label: "Industries: card 3 title", text: "FSI" },
  "industries-3-tagline": { label: "Industries: card 3 tagline", text: "Regulated work, zero slippage." },
  "industries-3-chip-1": { label: "Industries: card 3 chip 1", text: "Banks" },
  "industries-3-chip-2": { label: "Industries: card 3 chip 2", text: "Insurance" },
  "industries-3-chip-3": { label: "Industries: card 3 chip 3", text: "Accounting" },
  "industries-3-chip-4": { label: "Industries: card 3 chip 4", text: "Investments & capital" },
  "industries-4-title": { label: "Industries: card 4 title", text: "Retail" },
  "industries-4-tagline": { label: "Industries: card 4 tagline", text: "High volume, fast cycles." },
  "industries-4-chip-1": { label: "Industries: card 4 chip 1", text: "FMCG" },
  "industries-4-chip-2": { label: "Industries: card 4 chip 2", text: "Franchises" },
  "industries-4-chip-3": { label: "Industries: card 4 chip 3", text: "Ecommerce" },

  // Certifications
  "platforms-eyebrow": { label: "Certifications: eyebrow", text: "Certifications" },
  "platforms-heading": { label: "Certifications: heading", text: "Certified where it counts." },
  "platforms-lead": { label: "Certifications: lead paragraph", text: "Platinum on the platform we build on. Credentialled on everything it has to talk to." },
  "platforms-stat-1-value": { label: "Certifications: figure 1", text: "8" },
  "platforms-stat-1-label": { label: "Certifications: figure 1 label", text: "vendor certifications" },
  "platforms-stat-2-value": { label: "Certifications: figure 2", text: "900+" },
  "platforms-stat-2-label": { label: "Certifications: figure 2 label", text: "implementations" },
  "platforms-monday-title": { label: "Certifications: monday.com card heading", text: "Platinum tier \u2014 the top 1% of monday.com partners." },
  "platforms-monday-body": { label: "Certifications: monday.com card body", text: "Our founder spent six years in sales leadership at monday.com, so rollouts start from how the platform is meant to be used." },
  "platforms-monday-point-1": { label: "Certifications: monday.com bullet 1", text: "Work OS rollouts" },
  "platforms-monday-point-2": { label: "Certifications: monday.com bullet 2", text: "monday CRM builds" },
  "platforms-monday-point-3": { label: "Certifications: monday.com bullet 3", text: "Platform migrations" },
  "platforms-monday-point-4": { label: "Certifications: monday.com bullet 4", text: "monday AI enablement" },
  "platforms-monday-cta": { label: "Certifications: monday.com link", text: "Our monday.com services →" },
  "platforms-atlassian-title": { label: "Certifications: Atlassian card title", text: "Jira, JSM and Confluence" },
  "platforms-atlassian-body": { label: "Certifications: Atlassian card body", text: "Service desks and engineering workflows, with accredited cloud migrations." },
  "platforms-atlassian-cta": { label: "Certifications: Atlassian card link", text: "Our Atlassian services" },
  "platforms-hubspot-title": { label: "Certifications: HubSpot card title", text: "Marketing and sales hubs" },
  "platforms-hubspot-body": { label: "Certifications: HubSpot card body", text: "Pipeline and campaign automation, synced two ways with monday CRM." },
  "platforms-hubspot-cta": { label: "Certifications: HubSpot card link", text: "Our HubSpot services" },
  "platforms-also": { label: "Certifications: \"also certified\" label", text: "Also certified" },

  // AI capability
  "ai-eyebrow": { label: "AI capability: eyebrow", text: "AI capability" },
  "ai-heading": { label: "AI capability: heading", text: "Every function, on one connected layer." },
  "ai-lead": { label: "AI capability: lead paragraph", text: "We map the work your teams actually do, then put AI where it removes the handoffs \u2014 readiness, agent builds and adoption run as one programme." },
  "ai-point-1": { label: "AI capability: bullet 1", text: "Readiness and use-case scoring first" },
  "ai-point-2": { label: "AI capability: bullet 2", text: "Agents on Claude, OpenAI and Copilot" },
  "ai-point-3": { label: "AI capability: bullet 3", text: "n8n automations across the whole stack" },
  "ai-cta": { label: "AI capability: button", text: "Book an AI readiness call" },
  "ai-tile-1-label": { label: "AI board: tile 1 label", text: "Strategy" },
  "ai-tile-1-sub": { label: "AI board: tile 1 caption", text: "roadmap" },
  "ai-tile-2-label": { label: "AI board: tile 2 label", text: "Marketing" },
  "ai-tile-2-sub": { label: "AI board: tile 2 caption", text: "campaigns" },
  "ai-tile-3-label": { label: "AI board: tile 3 label", text: "Revenue" },
  "ai-tile-3-sub": { label: "AI board: tile 3 caption", text: "monday CRM" },
  "ai-tile-4-label": { label: "AI board: tile 4 label", text: "Projects" },
  "ai-tile-4-sub": { label: "AI board: tile 4 caption", text: "delivery" },
  "ai-tile-5-label": { label: "AI board: tile 5 label", text: "Finance" },
  "ai-tile-5-sub": { label: "AI board: tile 5 caption", text: "approvals" },
  "ai-tile-6-label": { label: "AI board: tile 6 label", text: "AI layer" },
  "ai-tile-7-label": { label: "AI board: tile 7 label", text: "Operations" },
  "ai-tile-7-sub": { label: "AI board: tile 7 caption", text: "workflows" },
  "ai-tile-8-label": { label: "AI board: tile 8 label", text: "Service desk" },
  "ai-tile-8-sub": { label: "AI board: tile 8 caption", text: "Jira & JSM" },
  "ai-tile-9-label": { label: "AI board: tile 9 label", text: "Data" },
  "ai-tile-9-sub": { label: "AI board: tile 9 caption", text: "one model" },
  "ai-tile-10-label": { label: "AI board: tile 10 label", text: "Automations" },
  "ai-tile-10-sub": { label: "AI board: tile 10 caption", text: "n8n" },
  "ai-tile-11-label": { label: "AI board: tile 11 label", text: "Integration" },
  "ai-tile-11-sub": { label: "AI board: tile 11 caption", text: "HubSpot" },
  "ai-tile-12-label": { label: "AI board: tile 12 label", text: "Adoption" },
  "ai-tile-12-sub": { label: "AI board: tile 12 caption", text: "training" },
  "ai-legend-1": { label: "AI board: legend 1", text: "AI layer" },
  "ai-legend-2": { label: "AI board: legend 2", text: "AI-enabled now" },
  "ai-legend-3": { label: "AI board: legend 3", text: "Next in the roadmap" },

  // Insights
  "insights-eyebrow": { label: "Insights: eyebrow", text: "Insights" },
  "insights-heading": { label: "Insights: heading", text: "Fresh thinking from the delivery floor." },
  "insights-all": { label: "Insights: \"all\" link", text: "All insights →" },
  "insights-min-read": { label: "Insights: read-time unit", text: "min read" },

  // FAQ
  "faq-eyebrow": { label: "FAQ: eyebrow", text: "FAQs" },
  "faq-heading": { label: "FAQ: heading", text: "Ask us anything \u2014 we answer in plain language." },
  "faq-lead": { label: "FAQ: lead paragraph", text: "Every answer is under 50 words and self-contained, mirrored in FAQPage schema for AEO." },
  "faq-person": { label: "FAQ: \"prefer a person\" note", text: "Prefer a person? A consultant will answer in one business day." },
  "faq-1-question": { label: "FAQ 1: question", text: "What does Fruition Services do?" },
  "faq-1-answer": { label: "FAQ 1: answer", text: "Fruition Services is a technology consultancy that implements and integrates monday.com, Atlassian and HubSpot, and delivers AI advisory and change management. Headquartered in Sydney, Fruition works with mid-market and enterprise teams across Australia, the UK, the US, Singapore, India and the Philippines." },
  "faq-2-question": { label: "FAQ 2: question", text: "Is Fruition an official monday.com partner?" },
  "faq-2-answer": { label: "FAQ 2: answer", text: "Yes. Fruition is a monday.com Platinum Partner and won the Rising Star Award at the 2026 monday.com Partner Summit. Our founder spent six years at monday.com before starting Fruition, so we know the platform from the inside." },
  "faq-3-question": { label: "FAQ 3: question", text: "Which platforms and AI tools do you work with?" },
  "faq-3-answer": { label: "FAQ 3: answer", text: "monday.com, Atlassian (Jira, Jira Service Management, Confluence) and HubSpot, plus AI implementation across Anthropic Claude, OpenAI and Microsoft Copilot, with automation on n8n and native platform integrations." },
  "faq-4-question": { label: "FAQ 4: question", text: "Where does Fruition operate?" },
  "faq-4-answer": { label: "FAQ 4: answer", text: "Fruition is headquartered at 64 York Street, Sydney, with entities in Australia, the US and the UK, and consultants delivering across Australia, the UK, the US, Singapore, India and the Philippines: coverage in your time zone." },
  "faq-5-question": { label: "FAQ 5: question", text: "How much does a monday.com implementation cost?" },
  "faq-5-answer": { label: "FAQ 5: answer", text: "It depends on scope. Focused implementations start from a fixed price; larger programs are phased with a fixed scope per phase. Book a discovery call and you'll have a tailored estimate within 48 hours." },
  "faq-6-question": { label: "FAQ 6: question", text: "Can you migrate us from another tool?" },
  "faq-6-answer": { label: "FAQ 6: answer", text: "Yes. We regularly migrate teams from Smartsheet, Asana, Trello, Wrike, SimPro and spreadsheets (including data, automations and integrations) with training and change management so the new platform actually gets adopted." },
  "faq-7-question": { label: "FAQ 7: question", text: "How is Fruition different from other partners?" },
  "faq-7-answer": { label: "FAQ 7: answer", text: "Process before platform: we design how your business should run first, then configure the tool to match. Combined with insider platform experience and in-house AI capability, implementations land faster and stick." },
} as const satisfies Record<string, { label: string; text: string }>

export type HomeCopySlot = keyof typeof HOME_COPY
export type HomeCopy = Partial<Record<string, string>>

/** Text for a slot: the Sanity value, or the default when it is missing or blank. */
export function homeText(copy: HomeCopy | undefined, id: HomeCopySlot): string {
  const v = copy?.[id]
  return v && v.trim() ? v : HOME_COPY[id].text
}

/** Sanity `copy[]` → lookup map. */
export function toHomeCopy(slots: { _key?: string; text?: string }[] | null | undefined): HomeCopy {
  const out: HomeCopy = {}
  for (const s of slots ?? []) if (s?._key && typeof s.text === "string") out[s._key] = s.text
  return out
}

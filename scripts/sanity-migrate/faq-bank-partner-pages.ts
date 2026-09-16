/**
 * Sanity migration: FAQ Bank — Implementation Partner pages.
 *
 * Applies the July 2026 partner FAQ bank (AEO/GEO-optimised, 40–70-word answers).
 *
 *   Group A — central `faqItem` docs (what the partnership/service pages render
 *             via getFaqItemsForPage → groupFaqsIntoTabs). Appended to existing
 *             branded tabs, or new branded tabs on pages that had none.
 *   Group B — `aiPartnerPage.faq` arrays. Non-duplicate bank questions appended
 *             to the existing 10-question sets (dedup by question text).
 *
 * Group C (Agentic Sales/Marketing/Finance/HR) is intentionally NOT handled here
 * — those are hardcoded TS practice pages (src/data/practicePages), and HR has no
 * page. Deferred by decision.
 *
 * Idempotent:
 *   - Group A faqItems use fixed _ids (createOrReplace).
 *   - Group B appends are keyed `bankfaq-*` and skipped if the question already
 *     exists on the target doc.
 *
 * Usage:
 *   npx tsx scripts/sanity-migrate/faq-bank-partner-pages.ts --dry   # preview
 *   npx tsx scripts/sanity-migrate/faq-bank-partner-pages.ts         # apply
 */
import { writeClient } from './lib'

const DRY = process.argv.includes('--dry')

// ── helpers ────────────────────────────────────────────────────────────────
/** Plain text → single Portable Text block (faqItem.answer is block content). */
function pt(text: string, key: string) {
  return [
    {
      _type: 'block',
      _key: `${key}-b`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
    },
  ]
}

const norm = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

// ── Group A content ─────────────────────────────────────────────────────────
interface FaqSpec {
  id: string
  question: string
  answer: string
  category: string
  categoryOrder: number
  order: number
  pages: string[]
}

// monday Set 1 — the implementation count is 900+ (confirmed 2026-09-16); an
// earlier draft of this bank said 500+.
const MONDAY_PAGES = ['monday-implementation-consultants', 'partnerships/monday-consulting-partner']

const GROUP_A: FaqSpec[] = [
  // 1. monday.com Implementation Partner → new "Implementation Partner" tab
  { id: 'faqItem-bank-monday-1', category: 'Implementation Partner', categoryOrder: 3, order: 1, pages: MONDAY_PAGES,
    question: 'What does a monday.com implementation partner do?',
    answer: 'A monday.com implementation partner scopes, builds, integrates and supports monday.com on your behalf. Fruition is a Platinum-tier partner — the highest tier — delivering implementation, monday CRM, integrations, training and managed support across Australia, the UK, the US, Singapore, India and the Philippines, with 900+ implementations completed.' },
  { id: 'faqItem-bank-monday-2', category: 'Implementation Partner', categoryOrder: 3, order: 2, pages: MONDAY_PAGES,
    question: 'How much does monday.com implementation cost?',
    answer: 'Fruition monday.com implementations start at AUD $8,000 for focused single-team builds. Mid-size deployments typically run AUD $15,000–$60,000, and enterprise multi-department programs from $80,000. Every phase is fixed-fee, published before work begins, and priced locally in AUD, GBP, SGD and USD.' },
  { id: 'faqItem-bank-monday-3', category: 'Implementation Partner', categoryOrder: 3, order: 3, pages: MONDAY_PAGES,
    question: 'How do I choose between monday.com partners?',
    answer: "Compare partner tier (Platinum is the highest), implementation volume, certified consultants on active delivery, industry experience and whether the person scoping your project also delivers it. Fruition holds Platinum status, 900+ implementations, and monday.com's Rising Star Award 2026 — and the consultant who scopes your engagement leads your delivery." },
  { id: 'faqItem-bank-monday-4', category: 'Implementation Partner', categoryOrder: 3, order: 4, pages: MONDAY_PAGES,
    question: 'How long does a monday.com implementation take?',
    answer: 'Single-team implementations take 2–4 weeks; department-wide builds 4–8 weeks; enterprise deployments 8–16 weeks with phased rollout and training. Fruition works in fixed phases with defined outcomes so you always know what ships and when.' },
  { id: 'faqItem-bank-monday-5', category: 'Implementation Partner', categoryOrder: 3, order: 5, pages: MONDAY_PAGES,
    question: 'Can Fruition migrate us to monday.com from another platform?',
    answer: "Yes. Fruition runs structured migrations from Jira, Asana, Trello, Smartsheet, Salesforce, HubSpot, Zoho and spreadsheet systems — with data mapping, automation rebuilding and team training included. As a partner certified across multiple platforms, Fruition also advises honestly when migration isn't the right call." },

  // 2. Atlassian → append to existing "Atlassian FAQs" tab (categoryOrder 19, maxOrder 4)
  { id: 'faqItem-bank-atlassian-1', category: 'Atlassian FAQs', categoryOrder: 19, order: 5, pages: ['partnerships/certified-atlassian-partner'],
    question: 'What does an Atlassian implementation partner do?',
    answer: "An Atlassian partner implements, optimises and integrates Jira, Confluence and Jira Service Management. Fruition is a Platinum Atlassian Partner delivering workflow design, permission architecture, instance rescue and cross-tool integration across Australia, the UK, the US and Asia — and won Atlassian's Rising Star of the Year 2026." },
  { id: 'faqItem-bank-atlassian-2', category: 'Atlassian FAQs', categoryOrder: 19, order: 6, pages: ['partnerships/certified-atlassian-partner'],
    question: 'How much does Jira implementation or consulting cost?',
    answer: 'Fruition Jira engagements start at AUD $12,000 for a structured optimisation or focused implementation. Instance rescues and scaled implementations are quoted after a configuration audit, typically AUD $15,000–$60,000, always as fixed-fee phases with defined outcomes.' },
  { id: 'faqItem-bank-atlassian-3', category: 'Atlassian FAQs', categoryOrder: 19, order: 7, pages: ['partnerships/certified-atlassian-partner'],
    question: 'Can you fix a messy Jira instance without starting over?',
    answer: 'Usually, yes. Most Jira pain is configuration debt — workflow sprawl, permission chaos, plugin bloat — not platform failure. A structured 3–4 week rescue (workflow consolidation, permission cleanup, plugin audit, board restructure) resolves the majority of instances without rebuild or migration.' },
  { id: 'faqItem-bank-atlassian-4', category: 'Atlassian FAQs', categoryOrder: 19, order: 8, pages: ['partnerships/certified-atlassian-partner'],
    question: 'Should we use Jira or monday.com?',
    answer: 'Jira wins for deep software delivery with heavy ecosystem dependencies; monday.com wins for cross-functional visibility and business-team adoption. Many organisations run both, integrated. Fruition holds Platinum partnerships with both vendors — a genuine rarity — so the recommendation follows your teams, not a vendor margin.' },
  { id: 'faqItem-bank-atlassian-5', category: 'Atlassian FAQs', categoryOrder: 19, order: 9, pages: ['partnerships/certified-atlassian-partner'],
    question: 'Does Fruition handle Jira to monday.com migrations?',
    answer: "Yes — it's a signature service. Fruition migrates projects, issues, comments, attachments and history through a staged 6–8 week playbook with parallel-run validation, proven in published case studies. Being certified on both platforms means Jira concepts map to monday architecture correctly the first time." },

  // 3. HubSpot → new "HubSpot FAQs" tab (page had no specific faqItems)
  { id: 'faqItem-bank-hubspot-1', category: 'HubSpot FAQs', categoryOrder: 1, order: 1, pages: ['partnerships/certified-hubspot-partner'],
    question: 'What does a HubSpot implementation partner do?',
    answer: 'A HubSpot partner implements and optimises Marketing, Sales and Service Hubs — portal architecture, lifecycle stages, automation, reporting and integrations. Fruition delivers HubSpot implementation across Australia, the UK, the US and Asia as a certified partner, alongside Breeze AI enablement and monday.com integration.' },
  { id: 'faqItem-bank-hubspot-2', category: 'HubSpot FAQs', categoryOrder: 1, order: 2, pages: ['partnerships/certified-hubspot-partner'],
    question: 'How much does HubSpot implementation cost?',
    answer: 'Fruition HubSpot implementations start at AUD $12,000 for a focused single-Hub setup. Multi-Hub deployments with migrations and integrations typically run AUD $20,000–$60,000 over 6–12 weeks. All pricing is fixed-fee per phase and published before work begins.' },
  { id: 'faqItem-bank-hubspot-3', category: 'HubSpot FAQs', categoryOrder: 1, order: 3, pages: ['partnerships/certified-hubspot-partner'],
    question: 'Our HubSpot portal is a mess — can it be rescued?',
    answer: 'Yes. Portal rescue engagements — property cleanup, lifecycle rebuild, automation audit, deduplication — are as common as fresh implementations. A one-week portal audit scopes the fix, and most portals are recoverable without migration or data loss.' },
  { id: 'faqItem-bank-hubspot-4', category: 'HubSpot FAQs', categoryOrder: 1, order: 4, pages: ['partnerships/certified-hubspot-partner'],
    question: 'Should we choose HubSpot or monday CRM?',
    answer: 'HubSpot wins when marketing automation is your centre of gravity; monday CRM wins when you want sales, projects and operations on one flexible platform at lower admin cost. Fruition implements both and migrates in either direction, so the fit assessment is honest — the answer depends on where your operational weight sits.' },
  { id: 'faqItem-bank-hubspot-5', category: 'HubSpot FAQs', categoryOrder: 1, order: 5, pages: ['partnerships/certified-hubspot-partner'],
    question: 'Does HubSpot integrate with monday.com?',
    answer: 'Yes. A native integration covers common contact and deal syncing; complex field mapping and error handling typically need middleware, which Fruition architects with n8n or Make. The standard pattern: HubSpot masters contacts and marketing, monday masters delivery, with bi-directional status sync between them.' },

  // 4. ClickUp → new "ClickUp FAQs" tab (page had no specific faqItems)
  { id: 'faqItem-bank-clickup-1', category: 'ClickUp FAQs', categoryOrder: 1, order: 1, pages: ['partnerships/certified-clickup-partner'],
    question: 'What does a ClickUp implementation partner do?',
    answer: 'A ClickUp partner designs your workspace hierarchy, builds views and automations, migrates your data and trains your teams. Fruition is a certified ClickUp partner implementing ClickUp for teams across Australia, the UK, the US and Asia — with honest cross-platform advice, since Fruition also holds monday.com and Atlassian partnerships.' },
  { id: 'faqItem-bank-clickup-2', category: 'ClickUp FAQs', categoryOrder: 1, order: 2, pages: ['partnerships/certified-clickup-partner'],
    question: 'How much does ClickUp implementation cost?',
    answer: 'Fruition ClickUp implementations start at AUD $6,000 for single-team setups, with multi-team deployments typically AUD $10,000–$30,000 including migration, automation and training. Fixed-fee phases, published before work starts.' },
  { id: 'faqItem-bank-clickup-3', category: 'ClickUp FAQs', categoryOrder: 1, order: 3, pages: ['partnerships/certified-clickup-partner'],
    question: 'ClickUp or monday.com — which should we choose?',
    answer: 'ClickUp offers aggressive pricing and feature density; monday.com offers stronger enterprise governance, a larger partner ecosystem and easier business-team adoption. Fruition is certified on both, implements both weekly, and recommends per team structure and scale rather than per partnership.' },
  { id: 'faqItem-bank-clickup-4', category: 'ClickUp FAQs', categoryOrder: 1, order: 4, pages: ['partnerships/certified-clickup-partner'],
    question: 'How long does a ClickUp implementation take?',
    answer: "Single-team ClickUp implementations run 2–3 weeks; company-wide rollouts 4–8 weeks including hierarchy design, migration, automation and role-based training. The determining factor is data cleanliness in the system you're leaving." },
  { id: 'faqItem-bank-clickup-5', category: 'ClickUp FAQs', categoryOrder: 1, order: 5, pages: ['partnerships/certified-clickup-partner'],
    question: 'Can Fruition migrate us from ClickUp to another platform (or into ClickUp)?',
    answer: 'Yes, in both directions. Fruition migrates teams into ClickUp from spreadsheets, Trello, Asana and Wrike — and out of ClickUp to monday.com where governance or ecosystem needs demand it — with structure mapping, automation rebuilding and history preserved.' },

  // 5. n8n → append to existing "n8n FAQs" tab (categoryOrder 18, maxOrder 5)
  { id: 'faqItem-bank-n8n-1', category: 'n8n FAQs', categoryOrder: 18, order: 6, pages: ['partnerships/n8n-integration-partner'],
    question: 'What does an n8n implementation partner do?',
    answer: 'An n8n partner designs, builds and hosts production automation and AI agent workflows. Fruition is a certified n8n partner building agentic workflow networks — connecting AI models, CRMs and work platforms — across Australia, the UK, the US and Asia, including self-hosted deployments for data-sovereignty requirements.' },
  { id: 'faqItem-bank-n8n-2', category: 'n8n FAQs', categoryOrder: 18, order: 7, pages: ['partnerships/n8n-integration-partner'],
    question: 'How is n8n different from Zapier or Make?',
    answer: 'n8n adds native AI agent capabilities, code-level flexibility and a self-hosting option that Zapier and Make lack. Zapier wins on speed and app catalogue; Make on visual complexity at mid-scale; n8n on AI-driven, high-volume and sovereignty-constrained workflows. Fruition implements all three and migrates between them.' },
  { id: 'faqItem-bank-n8n-3', category: 'n8n FAQs', categoryOrder: 18, order: 8, pages: ['partnerships/n8n-integration-partner'],
    question: 'How much does n8n consulting and implementation cost?',
    answer: 'Fruition n8n engagements start at AUD $12,000 for a production workflow build, including error handling, logging and documentation. Self-hosted deployment with security hardening is scoped separately, and agentic AI networks typically run AUD $20,000–$80,000 depending on integration depth.' },
  { id: 'faqItem-bank-n8n-4', category: 'n8n FAQs', categoryOrder: 18, order: 9, pages: ['partnerships/n8n-integration-partner'],
    question: 'Can n8n be self-hosted for compliance reasons?',
    answer: "Yes — self-hosting is one of n8n's core advantages. Fruition deploys and manages self-hosted n8n for clients in financial services, healthcare and government where workflow data cannot leave controlled infrastructure, with the security posture regulated industries require." },
  { id: 'faqItem-bank-n8n-5', category: 'n8n FAQs', categoryOrder: 18, order: 10, pages: ['partnerships/n8n-integration-partner'],
    question: 'Does n8n work with monday.com and HubSpot?',
    answer: 'Yes. n8n connects monday.com, HubSpot, Jira, Xero, Slack and hundreds of other systems. As a Platinum monday.com partner and certified n8n partner, Fruition builds these integrations with proper rate-limit management, error handling and logging — production-grade, not demo-grade.' },

  // 6. Make → new "Make FAQs" tab (page had no specific faqItems)
  { id: 'faqItem-bank-make-1', category: 'Make FAQs', categoryOrder: 1, order: 1, pages: ['partnerships/make-partners'],
    question: 'What does a Make implementation partner do?',
    answer: 'A Make partner designs and builds automation scenarios connecting your platforms — with the error handling, documentation and governance DIY builds skip. Fruition is a certified Make partner delivering scenario architecture, estate audits and platform migrations across Australia, the UK, the US and Asia.' },
  { id: 'faqItem-bank-make-2', category: 'Make FAQs', categoryOrder: 1, order: 2, pages: ['partnerships/make-partners'],
    question: 'How much does Make automation consulting cost?',
    answer: 'Fruition Make engagements start at AUD $4,000 for a governed scenario build, with multi-scenario architectures typically AUD $8,000–$25,000. Estate audits — consolidating years of accumulated scenarios into documented architecture — are quoted after a scenario inventory.' },
  { id: 'faqItem-bank-make-3', category: 'Make FAQs', categoryOrder: 1, order: 3, pages: ['partnerships/make-partners'],
    question: 'Make or Zapier — which is better for our business?',
    answer: 'Make offers stronger visual logic, cheaper high-volume operations and better data transformation; Zapier offers speed and the broadest app catalogue. For AI-heavy or self-hosted requirements, n8n beats both. Fruition is certified across the stack and recommends per workload.' },
  { id: 'faqItem-bank-make-4', category: 'Make FAQs', categoryOrder: 1, order: 4, pages: ['partnerships/make-partners'],
    question: 'Why do Make scenarios break, and how do you prevent it?',
    answer: 'Most failures trace to missing error routes, unhandled rate limits and undocumented dependencies. Every Fruition scenario ships with error paths, retry logic, alerting and a runbook — the difference between automation your business relies on and automation that fails silently.' },
  { id: 'faqItem-bank-make-5', category: 'Make FAQs', categoryOrder: 1, order: 5, pages: ['partnerships/make-partners'],
    question: 'Can Fruition migrate us from Make to n8n?',
    answer: 'Yes. When AI workloads, volume costs or self-hosting needs outgrow Make, Fruition runs structured Make-to-n8n migrations with parallel-run validation — typically consolidating around 40% of scenarios in the process, because migration is the moment to remove automation debt.' },
]

// ── Group B content (append non-duplicate bank Qs to aiPartnerPage.faq) ──────
const GROUP_B: Record<string, { question: string; answer: string }[]> = {
  'aiPartnerPage-anthropic-claude-partner': [
    { question: 'What is Claude best suited for compared with other AI models?',
      answer: 'Claude excels at reasoning-heavy work: complex analysis, long-document processing, agentic coding via Claude Code, and safety-sensitive deployments. Fruition works across Anthropic, OpenAI, Microsoft, Google and AWS, and recommends Claude when the workload rewards deep reasoning and reliability — not by default.' },
    { question: 'How do we get started with Claude in our business?',
      answer: "Start with a use-case assessment rather than a licence purchase. Fruition's AI Capability Assessment (four weeks, fixed fee) identifies where Claude creates measurable value in your operations, then a first implementation phase ships a production use case with evaluation metrics — typically inside 12 weeks end to end." },
  ],
  'aiPartnerPage-microsoft-copilot-partner': [
    { question: 'Is Copilot worth the licence cost?',
      answer: "It depends on data readiness and adoption discipline — licensed-but-unused Copilot is pure cost. Fruition's assessment quantifies value per role before you commit, then the adoption program targets measured usage. Clients typically see clear ROI in document-heavy and meeting-heavy roles first." },
  ],
  'aiPartnerPage-google-gemini-vertex-ai-partner': [
    { question: 'What is Gemini best suited for?',
      answer: "Gemini leads on multimodal work (documents, images, video, audio in one model), long-context processing, and Google-stack integration — Workspace, BigQuery and Vertex AI. Fruition recommends Gemini when your data and productivity stack live in Google, and other models when they don't." },
    { question: 'Gemini for Workspace or Microsoft Copilot — which should we choose?',
      answer: 'Choose by your existing stack: Gemini for Google Workspace organisations, Copilot for Microsoft 365 organisations. Cross-stack deployments rarely justify their friction. Fruition implements both, so the recommendation follows your infrastructure, not a vendor relationship.' },
  ],
  'aiPartnerPage-openai-chatgpt-partner': [
    { question: "What's the difference between ChatGPT Enterprise and the OpenAI API?",
      answer: 'ChatGPT Enterprise is the managed workspace product — admin controls, SSO, no training on your data — best for organisation-wide productivity. The API is for building custom applications and agents. Most Fruition clients need both, deployed under one governance framework.' },
    { question: 'Should we build on OpenAI, Claude, Gemini or Copilot?',
      answer: 'Per workload, not per brand. OpenAI leads on ecosystem breadth and multimodal tooling, Claude on deep reasoning, Gemini on Google-stack multimodal work, Copilot on M365-native productivity. Fruition works across all four, so the platform recommendation follows your use case and infrastructure.' },
    { question: 'How do we stop staff using ChatGPT with sensitive data?',
      answer: "Bans don't work — governed access does. Deploy ChatGPT Enterprise (which doesn't train on your data), publish a usage policy that names approved tools and prohibited inputs, and monitor adoption. Fruition delivers this as a standard governance package with every rollout." },
  ],
}

// ── run ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${DRY ? '🔎 DRY RUN' : '✍️  APPLYING'} — FAQ Bank partner pages\n`)

  // Group A
  console.log('── Group A: central faqItem docs ──')
  for (const f of GROUP_A) {
    const doc = {
      _id: f.id,
      _type: 'faqItem',
      question: f.question,
      answer: pt(f.answer, f.id),
      category: f.category,
      pages: f.pages,
      categoryOrder: f.categoryOrder,
      order: f.order,
    }
    console.log(`  [${f.pages[0]}] «${f.category}» ${f.question}`)
    if (!DRY) await writeClient.createOrReplace(doc)
  }
  console.log(`  → ${GROUP_A.length} faqItems ${DRY ? 'planned' : 'written'}\n`)

  // Group B
  console.log('── Group B: aiPartnerPage.faq appends (dedup by question) ──')
  let appended = 0
  for (const [docId, adds] of Object.entries(GROUP_B)) {
    const current = await writeClient.fetch<{ faq?: { question: string }[] }>(
      `*[_id==$id][0]{ "faq": faq[]{question} }`, { id: docId })
    const existing = new Set((current?.faq ?? []).map((x) => norm(x.question)))
    const fresh = adds.filter((a) => !existing.has(norm(a.question)))
    const skipped = adds.filter((a) => existing.has(norm(a.question)))
    console.log(`  ${docId}`)
    for (const s of skipped) console.log(`    · skip (dup): ${s.question}`)
    for (const a of fresh) console.log(`    + add: ${a.question}`)
    if (!fresh.length) continue
    const items = fresh.map((a, i) => ({
      _type: 'aiFaq',
      _key: `bankfaq-${docId.split('-').pop()}-${i}`,
      question: a.question,
      answer: a.answer,
    }))
    appended += items.length
    if (!DRY) {
      await writeClient
        .patch(docId)
        .setIfMissing({ faq: [] })
        .insert('after', 'faq[-1]', items)
        .commit()
    }
  }
  console.log(`  → ${appended} aiFaq items ${DRY ? 'planned' : 'appended'}\n`)

  console.log(DRY ? '🔎 Dry run complete — no writes made.\n' : '✅ Done.\n')
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1) })

/**
 * Two new Version C AI platform pages (13 Nov 2026): Grok Bot and Meta Muse,
 * built on the approved OpenClaw partner layout (same sections, tones, trust
 * logos, client results, video, practitioner note and quotes).
 *
 *   npx tsx scripts/vc/add-ai-partners-2026-11.ts                  # dry run
 *   npx tsx scripts/vc/add-ai-partners-2026-11.ts --apply          # hero art, FAQs, pages
 *   npx tsx scripts/vc/add-ai-partners-2026-11.ts --apply --menu   # also the two menu items (after deploy)
 *
 * Idempotent: fixed document ids and createOrReplace; Sanity dedupes uploads by
 * content hash. Copy describes delivery capability only. Fruition holds no
 * formal xAI or Meta partner tier, so there is no tier badge and no invented
 * outcome figure; the results cards are the same published client builds the
 * OpenClaw page shows.
 *
 * The "What it does best" section uses the plain four-card layout, because the
 * OpenClaw version's product screenshots are OpenClaw's own.
 */
import * as fs from 'fs'
import * as path from 'path'
import { randomBytes } from 'crypto'
import { writeClient } from '../sanity-migrate/lib'

const APPLY = process.argv.includes('--apply')
const ASSETS = path.join(__dirname, 'assets', 'ai-partners-2026-11')
const TEMPLATE_ID = 'vcPage-openclaw-partner'

const k = () => randomBytes(6).toString('hex')
const img = (ref: string) => ({ _type: 'image', asset: { _type: 'reference', _ref: ref } })
const ref = (id: string) => ({ _key: k(), _type: 'reference', _ref: id })
const block = (text: string) => [
  { _key: k(), _type: 'block', style: 'normal', markDefs: [], children: [{ _key: k(), _type: 'span', marks: [], text }] },
]

type Pair = [title: string, body: string]
type Spec = {
  slug: string
  path: string
  name: string
  seoTitle: string
  seoDescription: string
  hero: { badge: string; heading: string; lead: string; art: string; artAlt: string; secondary: string }
  why: { badge: string; heading: string; lead: string; items: Pair[] }
  approach: { heading: string; steps: Pair[] }
  audit: { heading: string; text: string; cta: string }
  services: { heading: string; items: Pair[] }
  practitioner: string
  booking: { calTitle: string; heading: string; lead: string }
  faqs: Pair[]
  closing: { heading: string; lead: string }
}

const PAGES: Spec[] = [
  {
    slug: 'grok-bot-partner',
    path: '/partnerships/grok-bot-partner',
    name: 'Grok Bot',
    seoTitle: 'Grok Bot Consulting & Implementation | AI Teammates for Teams | Fruition',
    seoDescription:
      'Fruition designs, sets up and governs Grok Bot agents for teams: shared Bots in Slack and Microsoft Teams, sign-in to your tools, scheduled routines and approval gates, across Australia, the UK and the US.',
    hero: {
      badge: 'Grok Bot consulting & implementation',
      heading: 'AI teammates that *finish the work.*',
      lead: 'Fruition sets up Grok Bot for teams: shared Bots in Slack and Microsoft Teams with their own computer, signed in to your tools, with the guardrails and approvals your business needs.',
      art: 'hero-grok.png',
      artAlt: 'A friendly robot teammate waving beside the Fruition apple and pear',
      secondary: 'What Grok Bot does',
    },
    why: {
      badge: 'Why Grok Bot',
      heading: 'What it does *best.*',
      lead: 'Four things teams hand to Grok Bot every day.',
      items: [
        ['Works in Slack and Teams', 'Share a Bot with your team and bring it into Slack or Microsoft Teams channels, where anyone can ask it questions, hand it work or loop it into a thread.'],
        ['Its own computer', 'Each Bot runs on its own cloud computer and signs in to your apps and websites once, then uses them the way a person would.'],
        ['Routines on a schedule', 'Show a Bot a workflow once and it repeats it on a schedule, from a weekly report to an overnight research and outreach batch.'],
        ['A team of Bots', 'Give each Bot one job, run several in parallel and let them hand work to each other, with sensitive actions held for your approval.'],
      ],
    },
    approach: {
      heading: 'How we deliver *Grok Bot.*',
      steps: [
        ['Diagnose', 'Map the workflow and pick the job a Bot should own first.'],
        ['Build to production', 'A shared Bot working in your channels within six weeks, with real users.'],
        ['Scale the team', 'More Bots for adjacent jobs, hand-offs between them and deeper tool access. Governance hardens as capability grows.'],
      ],
    },
    audit: { heading: 'Find the work a Bot *can finish for you.*', text: 'A free 30-minute session to pick your first Grok Bot job.', cta: 'Pick my first Bot' },
    services: {
      heading: 'Our *Grok Bot services.*',
      items: [
        ['Bot design & rollout', 'Bots built for one job done well, with clear instructions, the right tool sign-ins and human review where the stakes demand it.'],
        ['Slack & Teams deployment', 'Shared Team Bots set up in the right channels, with access rules for guests, Slack Connect and sensitive data.'],
        ['Tool & data connections', 'Sign-ins, connectors and MCP servers that give Bots safe access to monday.com, your CRM and your internal systems.'],
        ['Governance & managed operations', 'Admin controls, approval gates, usage monitoring and regular reviews so Bots stay useful, safe and on budget.'],
      ],
    },
    practitioner: 'Josh Jebathilak, Managing Director, leads every Grok Bot engagement. He has led over 900 implementations across work platforms and AI systems.',
    booking: { calTitle: 'Grok Bot scoping call', heading: 'Scope your first *Grok Bot.*', lead: '30 minutes to pick the workflow, agree the guardrails and price a fixed discovery phase.' },
    faqs: [
      ['What is Grok Bot?', 'Grok Bot is the AI agent product from xAI. Each Bot has its own cloud computer, signs in to your tools and works through tasks on its own, and a Bot can be shared with a whole team and brought into Slack, Microsoft Teams and video calls.'],
      ['What does Fruition do with Grok Bot?', 'We pick the jobs worth handing to a Bot, write its instructions, set up its tool sign-ins and connectors, deploy it to the right channels and put approval gates around anything sensitive. Then we monitor and tune it so it keeps earning its place.'],
      ['Can Grok Bot work with monday.com and our CRM?', 'Yes. A Bot can sign in to web apps like monday.com, HubSpot and Salesforce, and we can expose internal systems through connectors or a custom MCP server, so it reads and updates records with the same permissions you give it.'],
      ['How do you keep a Grok Bot safe in a shared channel?', 'We scope each Bot to one job and the least access it needs, decide who can talk to it in Slack or Teams, route sensitive actions through review before they run and use the admin controls on the Teams and Enterprise plans for data and network rules.'],
      ['Which plan do we need for Grok Bot?', 'A personal Bot comes with an eligible individual plan. Shared Bots for a team need a Teams or Enterprise plan, where an admin turns them on. We help you choose the plan that fits the number of people and Bots you need.'],
    ],
    closing: {
      heading: 'Ready for a Bot that *actually finishes work?*',
      lead: "Book a 30-minute discovery call. We'll map the highest-leverage workflow in your team, pick the first Grok Bot to build and quote a fixed-price discovery engagement.",
    },
  },
  {
    slug: 'meta-muse-partner',
    path: '/partnerships/meta-muse-partner',
    name: 'Meta Muse',
    seoTitle: 'Meta Muse Consulting & Implementation | Muse Agents & Muse Spark | Fruition',
    seoDescription:
      'Fruition helps businesses put Meta Muse to work: Muse agents connected to your business accounts, WhatsApp workflows and Muse Spark builds on the Meta Model API, with guardrails, across Australia, the UK and the US.',
    hero: {
      badge: 'Meta Muse consulting & implementation',
      heading: 'An agent that *runs the errands.*',
      lead: 'Fruition puts Meta Muse to work for your business: Muse agents connected to the accounts you already run, WhatsApp workflows and custom builds on Muse Spark, with the guardrails your team needs.',
      art: 'hero-muse.png',
      artAlt: 'A friendly assistant character with a shopping bag and calendar beside the Fruition apple and pear',
      secondary: 'What Muse does',
    },
    why: {
      badge: 'Why Meta Muse',
      heading: 'What it does *best.*',
      lead: 'Four things businesses use Muse for every day.',
      items: [
        ['Works where customers are', 'Talk to Muse in its app, on the web or in WhatsApp, the channel many small businesses already run on.'],
        ['Acts through your accounts', 'Muse books, emails and buys through the accounts you connect, and asks before it does anything sensitive.'],
        ['Small-business connectors', 'Muse for Small Business connects to tools such as QuickBooks, Shopify, Slack and Meta ad accounts to help run the books, ads and storefront.'],
        ['Built on Muse Spark', 'Meta’s multimodal reasoning model, available on the Meta Model API, so the same intelligence can power agents you build yourself.'],
      ],
    },
    approach: {
      heading: 'How we deliver *Meta Muse.*',
      steps: [
        ['Diagnose', 'Map the workflow and pick the errands Muse should own first.'],
        ['Build to production', 'Muse connected to your accounts and working for real users within six weeks.'],
        ['Scale up', 'More connected accounts, WhatsApp workflows and custom Muse Spark agents. Governance hardens as capability grows.'],
      ],
    },
    audit: { heading: 'Find the errands Muse *can run for you.*', text: 'A free 30-minute session to pick your first Meta Muse workflow.', cta: 'Pick my first workflow' },
    services: {
      heading: 'Our *Meta Muse services.*',
      items: [
        ['Muse setup & account connections', 'Muse connected to the right business accounts, with clear rules for what it can do on its own and what needs your approval.'],
        ['WhatsApp & customer workflows', 'Enquiries, bookings and follow-ups handled in the channels your customers already use, handed to your team when it matters.'],
        ['Muse Spark builds on the Meta Model API', 'Custom agents and integrations on Muse Spark, connected to monday.com, your CRM and internal data through MCP and APIs.'],
        ['Governance & managed operations', 'Data and training settings, approval gates, usage monitoring and regular reviews so Muse stays useful, safe and on budget.'],
      ],
    },
    practitioner: 'Josh Jebathilak, Managing Director, leads every Meta Muse engagement. He has led over 900 implementations across work platforms and AI systems.',
    booking: { calTitle: 'Meta Muse scoping call', heading: 'Scope your first *Meta Muse workflow.*', lead: '30 minutes to pick the workflow, agree the guardrails and price a fixed discovery phase.' },
    faqs: [
      ['What is Meta Muse?', 'Muse is Meta’s AI agent. It runs on Meta’s Muse Spark models, works through its own app, the web and WhatsApp, and completes tasks such as bookings, emails and purchases through the accounts you connect. Muse for Small Business adds business connectors.'],
      ['What does Fruition do with Meta Muse?', 'We choose the workflows worth handing to Muse, connect the right accounts, set the rules for what it can do without asking, and build custom agents on Muse Spark through the Meta Model API when a workflow needs deeper integration.'],
      ['Can Muse work with monday.com and our CRM?', 'Muse acts through the accounts and connectors you give it. For monday.com, your CRM or internal systems we build an integration on the Meta Model API or a custom MCP server, so data moves with the permissions you set.'],
      ['Is Meta Muse safe to use with business data?', 'We review Meta’s data and training settings with you, connect only the accounts a workflow needs, keep a human approval on payments and anything customer-facing, and document what Muse can and cannot do before it goes live.'],
      ['Is Meta Muse available in our country?', 'Muse launched in the US and has expanded to Canada, with more regions to follow. The Muse Spark models are available through the Meta Model API, so we can build Muse Spark agents for teams in Australia, the UK and elsewhere today.'],
    ],
    closing: {
      heading: 'Ready for an agent that *runs the errands?*',
      lead: "Book a 30-minute discovery call. We'll map the highest-leverage workflow in your business, pick where Muse fits first and quote a fixed-price discovery engagement.",
    },
  },
]

type Sec = Record<string, unknown> & { _type: string; _key?: string }

/** Fresh _key on every array item, so the clone shares nothing with the template. */
function rekey<T>(v: T): T {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === 'object' && '_key' in x ? { ...rekey(x), _key: k() } : rekey(x))) as T
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([a, b]) => [a, rekey(b)])) as T
  return v
}

async function upload(file: string): Promise<string> {
  if (!APPLY) return `image-dry-run-${file}`
  const doc = await writeClient.assets.upload('image', fs.readFileSync(path.join(ASSETS, file)), { filename: file })
  return doc._id
}

async function main() {
  const tpl = await writeClient.getDocument<{ sections: Sec[] }>(TEMPLATE_ID)
  if (!tpl) throw new Error(`${TEMPLATE_ID} not found`)
  const expected = 'vcHero vcCards vcSteps vcAudit vcCards vcCards vcVideo vcPractitioners vcProof vcBooking vcFaq vcClosing'
  const got = tpl.sections.map((s) => s._type).join(' ')
  if (got !== expected) throw new Error(`template layout changed: ${got}`)

  const docs: Record<string, unknown>[] = []
  for (const p of PAGES) {
    const t = rekey(tpl.sections)
    const [hero, why, steps, audit, services, results, video, prac, proof, booking, faq, closing] = t as Sec[]
    const faqIds = p.faqs.map((_, i) => `faqItem-vc-${p.slug}-${i}`)
    p.faqs.forEach(([q, a], i) =>
      docs.push({ _id: faqIds[i], _type: 'faqItem', question: q, answer: block(a), category: p.name, order: i, pages: [p.path.slice(1)] }),
    )
    // The template's tab also holds n8n and Vapi questions; only the general agent one fits here.
    const sharedFaqs = ['faqItem-migrated-ai-consulting-agent-development-0']

    const heroCtas = hero.ctas as Record<string, unknown>[]
    const sections: Sec[] = [
      {
        ...hero,
        badge: p.hero.badge,
        heading: p.hero.heading,
        lead: p.hero.lead,
        art: { ...img(await upload(p.hero.art)), alt: p.hero.artAlt },
        ctas: [heroCtas[0], { ...heroCtas[1], label: p.hero.secondary, href: '#why' }],
      },
      {
        _key: why._key,
        _type: 'vcCards',
        layout: 'cards4',
        tone: why.tone,
        anchor: 'why',
        head: { _type: 'vcHead', badge: p.why.badge, heading: p.why.heading, lead: p.why.lead },
        items: p.why.items.map(([title, body], i) => ({ _key: k(), _type: 'vcItem', label: String(i + 1).padStart(2, '0'), title, body })),
      },
      {
        ...steps,
        head: { ...(steps.head as object), heading: p.approach.heading },
        items: (steps.items as Record<string, unknown>[]).map((it, i) => ({ ...it, title: p.approach.steps[i][0], body: p.approach.steps[i][1] })),
      },
      { ...audit, heading: p.audit.heading, text: p.audit.text, cta: { ...(audit.cta as object), label: p.audit.cta } },
      {
        ...services,
        head: { ...(services.head as object), heading: p.services.heading },
        items: (services.items as Record<string, unknown>[]).map((it, i) => ({ ...it, title: p.services.items[i][0], body: p.services.items[i][1] })),
      },
      results,
      video,
      {
        ...prac,
        paragraphs: (prac.paragraphs as Record<string, unknown>[]).map((para, i) => (i === 0 ? { ...para, text: p.practitioner } : para)),
      },
      proof,
      { ...booking, calTitle: p.booking.calTitle, heading: p.booking.heading, lead: p.booking.lead },
      { ...faq, tabs: [{ _key: k(), _type: 'vcFaqTab', label: 'FAQ', items: [...faqIds, ...sharedFaqs].map(ref) }] },
      { ...closing, heading: p.closing.heading, lead: p.closing.lead },
    ]
    const leftover = JSON.stringify(sections).match(/open ?claw/gi)
    if (leftover) throw new Error(`${p.slug}: template copy left behind (${leftover.length}x OpenClaw)`)

    docs.push({ _id: `vcPage-${p.slug}`, _type: 'vcPage', group: 'partner', path: p.path, title: p.name, seoTitle: p.seoTitle, seoDescription: p.seoDescription, sections })
  }

  // Every reference must resolve before anything is written.
  const refIds = new Set<string>()
  JSON.stringify(docs, (key, v) => (key === '_ref' && typeof v === 'string' && !v.startsWith('image-') ? (refIds.add(v), v) : v))
  const own = new Set(docs.map((d) => d._id as string))
  const external = [...refIds].filter((id) => !own.has(id))
  const found = await writeClient.fetch<string[]>(`*[_id in $ids]._id`, { ids: external })
  const missing = external.filter((id) => !found.includes(id))
  if (missing.length) throw new Error(`missing referenced documents: ${missing.join(', ')}`)

  for (const d of docs) {
    const s = (d.sections as Sec[] | undefined)?.map((x) => x._type).join(' ')
    console.log(`${d._id}${s ? `  [${s}]` : ''}`)
  }
  if (!APPLY) {
    console.log(`\nDry run: ${docs.length} documents. Re-run with --apply to write.`)
  } else {
    const tx = writeClient.transaction()
    for (const d of docs) tx.createOrReplace(d as { _id: string; _type: string })
    await tx.commit()
    console.log(`\nWrote ${docs.length} documents.`)
  }
  await addToMenu()
}

// The two menu items, appended to the live Platforms > AI platforms column
// (siteSettings.navigation). Patches only that list, so editor changes made
// since the nav seed survive; items already present (same href) are skipped.
const MENU_ITEMS = [
  { label: 'Grok Bot', href: '/partnerships/grok-bot-partner', description: 'AI teammates in Slack, Teams and your tools', icon: 'grok' },
  { label: 'Meta Muse', href: '/partnerships/meta-muse-partner', description: 'Muse agents for small-business operations', icon: 'meta-muse' },
]

type NavLink = { _key: string; href?: string; description?: string }
type NavSection = { _key: string; heading?: string; items?: NavLink[] }
type NavItem = { _key: string; label?: string; sections?: NavSection[] }

async function addToMenu() {
  const settings = await writeClient.fetch<{ _id: string; navigation: NavItem[] } | null>(`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{ _id, navigation }`)
  if (!settings) throw new Error('no siteSettings document')
  const tab = settings.navigation.find((n) => n.label === 'Platforms')
  const section = tab?.sections?.find((s) => s.heading?.toLowerCase() === 'ai platforms')
  if (!tab || !section) throw new Error('Platforms > AI platforms menu column not found')
  const have = new Set((section.items ?? []).map((i) => i.href))
  const todo = MENU_ITEMS.filter((m) => !have.has(m.href))
  console.log(`\nMenu: ${section.items?.length ?? 0} AI platforms live (${(section.items ?? []).map((i) => i.href).join(', ')}), ${todo.length} to add`)
  // Separate flag: run it only once the routes are deployed, so the menu never links to an empty page.
  if (!todo.length || !APPLY || !process.argv.includes('--menu')) return

  const backup = path.join(__dirname, '..', 'nav-backups', `nav-ai-platforms-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(backup, JSON.stringify(settings.navigation, null, 2))
  console.log(`Backed up navigation to ${backup}`)

  const items = []
  for (const m of todo) {
    const buf = fs.readFileSync(path.join(__dirname, '..', 'nav-icons', `${m.icon}.svg`))
    const asset = await writeClient.assets.upload('image', buf, { filename: `${m.icon}.svg`, contentType: 'image/svg+xml' })
    items.push({ _key: `${m.icon}-${k()}`, _type: 'navLink', label: m.label, href: m.href, description: m.description, logo: img(asset._id) })
  }
  await writeClient
    .patch(settings._id)
    .insert('after', `navigation[_key=="${tab._key}"].sections[_key=="${section._key}"].items[-1]`, items)
    .commit()
  console.log(`Added ${items.length} menu items.`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

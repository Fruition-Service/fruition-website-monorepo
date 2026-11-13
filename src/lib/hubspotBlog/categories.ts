/**
 * Pick existing Fruition blog categories (Sanity `blogCategory` ids) and the
 * `industry` value for a post from outside the portal, so HubSpot and ported
 * OG Labs posts land in the right blog filters without anyone tagging them.
 */

const TITLE_RULES: [RegExp, string][] = [
  [/\bAI\b|\bagent(ic|s)?\b/i, "blogCategory-ai"],
  [/automat/i, "blogCategory-automation"],
  [/\bCRM\b|lifecycle|lead status|contacts?\b/i, "blogCategory-crm"],
  [/integrat|connect/i, "blogCategory-integration"],
  [/construction|builders?\b|contractors?\b/i, "blogCategory-construction"],
  [/financ|accounting/i, "blogCategory-finance-accounting"],
]

/** The two core platforms count anywhere in the post; tooling only in the title. */
const BODY_RULES: [RegExp, string][] = [
  [/\bHubSpot\b/, "blogCategory-hubspot"],
  [/\bClickUp\b/, "blogCategory-clickup"],
]
const TOOL_RULES: [RegExp, string][] = [
  [/\bn8n\b/i, "blogCategory-n8n"],
  [/\bMake(\.com)?\b/, "blogCategory-make-com"],
]

export function categoriesFor(post: { title: string; excerpt?: string; body: string }): string[] {
  const head = `${post.title} ${post.excerpt ?? ""}`
  const ids = new Set<string>()
  // Topics first so the cap never drops them for a product tag.
  for (const [re, id] of TITLE_RULES) if (re.test(head)) ids.add(id)
  for (const [re, id] of TOOL_RULES) if (re.test(post.title)) ids.add(id)
  for (const [re, id] of BODY_RULES) if (re.test(post.title) || re.test(post.body)) ids.add(id)
  return [...ids].slice(0, 4)
}

/** Mirror of the `industry` enum in src/sanity/schemas/blogPost.ts, where it is obvious. */
export function industryFor(post: { title: string; excerpt?: string }): string | undefined {
  const head = `${post.title} ${post.excerpt ?? ""}`
  if (/construction|builders?\b|contractors?\b/i.test(head)) return "construction"
  if (/\bAI\b|\bagent(ic|s)?\b/i.test(head)) return "ai"
  return undefined
}

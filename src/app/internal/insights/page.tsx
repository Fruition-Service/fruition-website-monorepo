import { redirect } from "next/navigation"

/**
 * Retired. "Content performance" was a fourth place to read numbers that
 * already had homes: blog traffic now lives on /internal/blog's Performance
 * view, social engagement on /internal/social's, and AI visibility plus the
 * Umami traffic view are tabs on the dashboard.
 *
 * The route stays as a redirect because staff have it bookmarked and the old
 * tab links are in Slack.
 */
export default async function RetiredInsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const raw = Array.isArray(params.tab) ? params.tab[0] : params.tab
  if (raw === "social") redirect("/internal/social")
  if (raw === "blog") redirect("/internal/blog?view=performance")
  redirect("/internal")
}

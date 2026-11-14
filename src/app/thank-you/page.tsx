import "@/styles/vc/pages/thank-you.css"
import type { Metadata } from "next"
import { getBlogPosts } from "@/sanity/queries"
import { THANK_YOU_NEXT_PATH } from "@/lib/thankYou"
import ThankYouContent, { type ThankYouPost } from "./ThankYouContent"

/**
 * Post-conversion confirmation. Lead forms land here instead of swapping
 * themselves for an inline success panel, so the conversion has its own URL for
 * GA4/Ads goals and the visitor gets somewhere to go next.
 *
 * noindex: a thank-you page in the index is a thank-you page strangers can
 * reach without converting. Deliberately absent from `sitemap.ts` for the same
 * reason.
 */
export const metadata: Metadata = {
  title: "Thank you: Fruition",
  description: "Your request is with the Fruition team. We reply within one business day.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you" },
}

export default async function ThankYouPage() {
  // Three most recent articles — the reason the redirect is worth taking.
  const posts = (await getBlogPosts(3, 0)) as ThankYouPost[]

  return <ThankYouContent posts={posts ?? []} nextPath={THANK_YOU_NEXT_PATH} />
}

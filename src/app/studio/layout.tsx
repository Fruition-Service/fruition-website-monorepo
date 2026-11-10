import type { Metadata } from "next"

// The embedded Sanity Studio is staff-only. Keep it out of search results; the
// X-Robots-Tag header in next.config.ts says the same for non-HTML responses.
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}

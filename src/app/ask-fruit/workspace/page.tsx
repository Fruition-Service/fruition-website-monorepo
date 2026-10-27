import type { Metadata } from "next"
import WorkspaceEntry from "@/components/ask-fruit/WorkspaceEntry"

export const metadata: Metadata = {
  title: "Implementation Calculator | Fruition",
  description: "Scope your monday.com, CRM, integration or AI project with the Implementation Calculator: matched solutions, a rough quote and a call with a consultant.",
  alternates: { canonical: "/ask-fruit" },
  // An app surface, not content: the /ask-fruit page is the indexable entry.
  robots: { index: false, follow: true },
}

export default function AskFruitWorkspacePage() {
  return <WorkspaceEntry />
}

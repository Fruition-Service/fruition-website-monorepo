import type { Metadata } from "next"
import WorkspaceEntry from "@/components/ask-fruit/WorkspaceEntry"

export const metadata: Metadata = {
  title: "Fruitai | Fruition",
  description: "Talk to Fruitai, Fruition's AI assistant, about your monday.com, CRM, integration or AI project.",
  alternates: { canonical: "/ask-fruit" },
  // An app surface, not content: the /ask-fruit page is the indexable entry.
  robots: { index: false, follow: true },
}

export default function AskFruitWorkspacePage() {
  return <WorkspaceEntry />
}

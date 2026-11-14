import "@/styles/vc/pages/ask-fruit-workspace.css"
import type { Metadata } from "next"
import WorkspaceEntry from "@/components/ask-fruit/WorkspaceEntry"
import { Trust } from "@/components/vc/sections/basic"
import type { VcHeroData } from "@/components/vc/types"
import { getVcPage } from "@/sanity/vcQueries"

export const metadata: Metadata = {
  title: "Implementation Calculator | Fruition",
  description: "Talk to the Implementation Calculator, Fruition's AI assistant, about your monday.com, CRM, integration or AI project.",
  alternates: { canonical: "/ask-fruit" },
  // An app surface, not content: the /ask-fruit page is the indexable entry.
  robots: { index: false, follow: true },
}

export default async function AskFruitWorkspacePage() {
  // The start screen shows the same client logo strip as the /ask-fruit hero (Sanity, vcPage-ask-fruit).
  const page = await getVcPage("/ask-fruit")
  const hero = page?.sections?.find((s) => s._type === "vcHero") as VcHeroData | undefined
  const trust = hero?.trustLogos?.length ? <Trust label={hero.trustLabel} logos={hero.trustLogos} /> : null
  return <WorkspaceEntry trust={trust} />
}

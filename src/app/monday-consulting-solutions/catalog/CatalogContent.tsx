"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import CatalogCta from "./components/CatalogCta"
import CatalogHero from "./components/CatalogHero"
import DeliveryMethod from "./components/DeliveryMethod"
import IndustryMap from "./components/IndustryMap"
import ProjectBuildsIndex from "./components/ProjectBuildsIndex"
// Client-only: SolutionModal lazy-loads mermaid (~4.6 MB) for its workflow
// diagram. ssr:false keeps mermaid out of the Cloudflare edge Worker bundle.
const SolutionModal = dynamic(() => import("./components/SolutionModal"), { ssr: false })
import SolutionsAdvisor from "./components/SolutionsAdvisor"
import SolutionsGrid from "./components/SolutionsGrid"
import { SOLUTIONS } from "./data/solutions"
import { findSolution, SOLUTION_PARAM } from "./lib/deepLink"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("popstate", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("popstate", listener)
  }
}

function readParam() {
  return new URLSearchParams(window.location.search).get(SOLUTION_PARAM)
}

/** replaceState, so opening and closing solutions does not fill the Back stack. */
function writeParam(key: string | null) {
  const url = new URL(window.location.href)
  if (key) url.searchParams.set(SOLUTION_PARAM, key)
  else url.searchParams.delete(SOLUTION_PARAM)
  window.history.replaceState(window.history.state, "", url)
  listeners.forEach((l) => l())
}

interface CatalogContentProps {
  calendlyUrl: string
}

export default function CatalogContent({ calendlyUrl }: CatalogContentProps) {
  // The open solution lives in the URL (?solution=<key>), so a link from Ask
  // Fruitai, a nav item or a shared URL lands on that solution's details rather
  // than the top of the catalog. Reading it through an external store keeps
  // the page itself statically rendered.
  const param = useSyncExternalStore(subscribe, readParam, () => null)
  const activeSolution = useMemo(() => findSolution(SOLUTIONS, param), [param])

  const handleOpen = useCallback((key: string) => writeParam(key), [])
  const handleClose = useCallback(() => writeParam(null), [])

  return (
    <div>
      <CatalogHero advisorSlot={<SolutionsAdvisor onOpenSolution={handleOpen} />} />
      <SolutionsGrid onOpen={handleOpen} />
      <IndustryMap />

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />

      <ProjectBuildsIndex />
      <DeliveryMethod />
      <CatalogCta calendlyUrl={calendlyUrl} />

      {/* Mobile/tablet floating advisor — hidden on lg+ where it lives in the hero */}
      <div className="lg:hidden">
        <SolutionsAdvisor variant="floating" onOpenSolution={handleOpen} />
      </div>

      <SolutionModal solution={activeSolution} onClose={handleClose} />
    </div>
  )
}

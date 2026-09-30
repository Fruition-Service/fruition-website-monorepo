"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Printer } from "lucide-react"
import { getEvaluation } from "@/lib/askFruit/client"
import type { BriefDocument } from "@/lib/askFruit/types"
import { BriefBody, BriefFooter } from "./BriefView"

/**
 * A brief on its own, laid out for the browser's "Save as PDF", served at
 * /ask-fruit/workspace?brief=<evaluationId>:<docId>. Replaces
 * Proploy's server-side WeasyPrint export, which needed a separate renderer and
 * never had the styles its HTML was written for.
 */
export default function PrintableBrief({ evaluationId, docId }: { evaluationId: string; docId: string }) {
  const [doc, setDoc] = useState<BriefDocument | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading")

  useEffect(() => {
    getEvaluation(evaluationId)
      .then((ev) => {
        const found = ev.documents.find((d) => d.doc_id === docId) ?? null
        setDoc(found)
        setState(found ? "ready" : "missing")
      })
      .catch(() => setState("missing"))
  }, [evaluationId, docId])

  if (state === "loading") return <p className="p-10 text-center font-mono text-[12px] text-muted">Loading brief…</p>
  if (state === "missing" || !doc) {
    return (
      <div className="mx-auto max-w-[560px] p-10 text-center">
        <p className="text-[15px] text-body">This brief is not available in this browser.</p>
        <Link href="/ask-fruit/workspace" className="mt-4 inline-block font-semibold text-brand">
          Back to Ask Fruit
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[960px] px-5 py-8 md:px-8 print:max-w-none print:p-0">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-ui pb-5">
        <Image src="/images/logo-fruition-black.svg" alt="Fruition Services" width={1366} height={280} className="h-7 w-auto" unoptimized />
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-pill bg-brand px-4 text-[13.5px] font-semibold text-white hover:bg-brand-dark print:hidden"
        >
          <Printer size={16} aria-hidden /> Print or save PDF
        </button>
      </div>
      <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
        {doc.doc_type === "comparison_brief" ? "Comparison brief" : "Implementation brief"} ·{" "}
        {new Date(doc.created_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="text-section-h2 mt-3 mb-8 text-body">{doc.title}</h1>
      <BriefBody document={doc} />
      <BriefFooter />
    </div>
  )
}

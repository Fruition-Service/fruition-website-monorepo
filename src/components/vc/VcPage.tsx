import type { Metadata } from "next"
import { vercelStegaClean } from "@vercel/stega"
import { notFound } from "next/navigation"
import { buildOgMetadata } from "@/lib/metadata"
import { getVcPage, getVcShared } from "@/sanity/vcQueries"
import type { VcPageData, VcSection, VcSharedData } from "./types"
import {
  VcAudit,
  VcCards,
  VcCases,
  VcClosing,
  VcHero,
  VcLogos,
  VcProducts,
  VcProof,
  VcSteps,
} from "./sections/basic"
import { VcFaq, VcPractitioners, VcUseCases } from "./sections/rich"
import VcBooking from "./sections/VcBooking"
import { VcDirectory, VcFix, VcIndustryTabs, VcPartnerStatus, VcTable, VcTextPair, VcToolkit, VcTrack, VcVideo } from "./sections/more"

/**
 * Renders a Version C page (vcPage document) section by section.
 *
 * The route file owns the URL, imports the page's own stylesheet
 * (src/styles/vc/pages/<slug>.css: the Version C base plus that page's own
 * rules, one file so their order is fixed) and passes the slug, so the root element
 * carries `vc vc-p-<slug>` and the page renders exactly like its approved
 * mock-up. Every string is Sanity copy, so the whole page is click-to-edit on
 * editing.fruitionservices.io.
 */
function Section({ s, shared }: { s: VcSection; shared: VcSharedData | null }) {
  switch (s._type) {
    case "vcHero": return <VcHero s={s} />
    case "vcLogos": return <VcLogos s={s} />
    case "vcSteps": return <VcSteps s={s} />
    case "vcCases": return <VcCases s={s} />
    case "vcAudit": return <VcAudit s={s} />
    case "vcCards": return <VcCards s={s} />
    case "vcProducts": return <VcProducts s={s} />
    case "vcUseCases": return <VcUseCases s={s} />
    case "vcProof": return <VcProof s={s} />
    case "vcPractitioners": return <VcPractitioners s={s} shared={shared} />
    case "vcBooking": return <VcBooking s={s} email={shared?.bookingEmail} />
    case "vcFaq": return <VcFaq s={s} />
    case "vcClosing": return <VcClosing s={s} />
    case "vcVideo": return <VcVideo s={s} />
    case "vcTextPair": return <VcTextPair s={s} />
    case "vcFix": return <VcFix s={s} />
    case "vcIndustryTabs": return <VcIndustryTabs s={s} />
    case "vcTrack": return <VcTrack s={s} />
    case "vcTable": return <VcTable s={s} />
    case "vcPartnerStatus": return <VcPartnerStatus s={s} />
    case "vcDirectory": return <VcDirectory s={s} />
    case "vcToolkit": return <VcToolkit s={s} />
    default: return null
  }
}

export async function VcPage({ path, slug, page: given }: { path: string; slug: string; page?: VcPageData | null }) {
  const [page, shared] = await Promise.all([given ?? getVcPage(path), getVcShared()])
  if (!page) notFound()
  return (
    <div className={`vc vc-p-${slug}`}>
      {(page.sections ?? []).map((s) => (
        <Section key={s._key} s={s} shared={shared} />
      ))}
    </div>
  )
}

/** Page metadata from the vcPage document, with the route's own fallbacks. */
export async function vcMetadata(
  path: string,
  fallback: { title?: string | null; description?: string | null } = {},
): Promise<Metadata> {
  const page = await getVcPage(path)
  const title = page?.seoTitle || fallback.title || undefined
  const description = page?.seoDescription || fallback.description || undefined
  return {
    alternates: { canonical: path },
    title,
    description,
    ...buildOgMetadata({
      title: title ? vercelStegaClean(title) : title,
      description: description ? vercelStegaClean(description) : description,
      path,
      ogImageSource: page?.ogImage?.asset ? page.ogImage : undefined,
    }),
  }
}

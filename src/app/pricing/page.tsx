import PracticePageTemplate from '@/components/PracticePageTemplate'
import { getLicensingPageContent } from '@/features/content/licensingPage'
import { practiceMetadata } from '@/data/practicePages/types'
import { getImplementationPackagesPage } from '@/sanity/queries'
import { buildPackageTiers } from '@/data/pricing/packages'

/**
 * /pricing: the commercial page. Implementation package prices (tiers from the
 * `implementationPackagesPage` document, fallback in src/data/pricing/packages.ts)
 * plus software licence procurement. Copy lives in
 * src/data/practicePages/licensing.ts and is overridden field by field by the
 * `licensingPage` document in the Studio.
 */
export async function generateMetadata() {
  return practiceMetadata(await getLicensingPageContent())
}

export default async function Page() {
  const [page, impl] = await Promise.all([
    getLicensingPageContent(),
    // A Sanity blip falls back to the shipped tiers instead of failing the page.
    getImplementationPackagesPage().catch(() => null),
  ])
  return <PracticePageTemplate page={page} packages={buildPackageTiers(impl?.packageTiers)} />
}

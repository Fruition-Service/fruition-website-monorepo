import PracticePageTemplate from '@/components/PracticePageTemplate'
import { getLicensingPageContent } from '@/features/content/licensingPage'
import { practiceMetadata } from '@/data/practicePages/types'

/**
 * /pricing — licence procurement. Copy lives in
 * src/data/practicePages/licensing.ts and is overridden field by field by the
 * `licensingPage` document in the Studio.
 */
export async function generateMetadata() {
  return practiceMetadata(await getLicensingPageContent())
}

export default async function Page() {
  return <PracticePageTemplate page={await getLicensingPageContent()} />
}

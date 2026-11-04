import PracticePageTemplate from '@/components/PracticePageTemplate'
import { HUBSPOT_PAGES } from '@/data/practicePages/hubspot'
import { practiceMetadata } from '@/data/practicePages/types'
import { getPracticePageContent } from '@/features/content/practicePage'

const page = HUBSPOT_PAGES['monday-hubspot-integration']

export async function generateMetadata() {
  return practiceMetadata(await getPracticePageContent(page))
}

export default async function Page() {
  return <PracticePageTemplate page={await getPracticePageContent(page)} />
}

import PracticePageTemplate from '@/components/PracticePageTemplate'
import { INTEGRATIONS_PAGES } from '@/data/practicePages/integrations'
import { practiceMetadata } from '@/data/practicePages/types'
import { getPracticePageContent } from '@/features/content/practicePage'

const page = INTEGRATIONS_PAGES['zapier']

export async function generateMetadata() {
  return practiceMetadata(await getPracticePageContent(page))
}

export default async function Page() {
  return <PracticePageTemplate page={await getPracticePageContent(page)} />
}

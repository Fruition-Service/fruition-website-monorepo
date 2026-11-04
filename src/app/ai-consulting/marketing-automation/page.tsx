import PracticePageTemplate from '@/components/PracticePageTemplate'
import { AI_CONSULTING_PAGES } from '@/data/practicePages/aiConsulting'
import { practiceMetadata } from '@/data/practicePages/types'
import { getPracticePageContent } from '@/features/content/practicePage'

const page = AI_CONSULTING_PAGES['marketing-automation']

export async function generateMetadata() {
  return practiceMetadata(await getPracticePageContent(page))
}

export default async function Page() {
  return <PracticePageTemplate page={await getPracticePageContent(page)} />
}

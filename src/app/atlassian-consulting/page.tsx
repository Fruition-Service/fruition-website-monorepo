import PracticePageTemplate from '@/components/PracticePageTemplate'
import { ATLASSIAN_PAGES } from '@/data/practicePages/atlassian'
import { practiceMetadata } from '@/data/practicePages/types'
import { getPracticePageContent } from '@/features/content/practicePage'

const page = ATLASSIAN_PAGES['hub']

export async function generateMetadata() {
  return practiceMetadata(await getPracticePageContent(page))
}

export default async function Page() {
  return <PracticePageTemplate page={await getPracticePageContent(page)} />
}

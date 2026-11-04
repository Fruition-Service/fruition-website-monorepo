import PracticePageTemplate from '@/components/PracticePageTemplate'
import { PROOF_PAGES } from '@/data/practicePages/proof'
import { practiceMetadata } from '@/data/practicePages/types'
import { getPracticePageContent } from '@/features/content/practicePage'

const page = PROOF_PAGES['certifications-and-awards']

export async function generateMetadata() {
  return practiceMetadata(await getPracticePageContent(page))
}

export default async function Page() {
  return <PracticePageTemplate page={await getPracticePageContent(page)} />
}

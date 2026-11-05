import HubspotConsultingPage from '@/components/hubspot/HubspotConsultingPage'
import { HUBSPOT_PAGES } from '@/data/practicePages/hubspot'
import { practiceMetadata } from '@/data/practicePages/types'
import { getPracticePageContent } from '@/features/content/practicePage'

const page = HUBSPOT_PAGES['hub']

// practiceMetadata sets title, description, alternates.canonical
// ('/hubspot-consulting') and spreads buildOgMetadata for the same path.
export async function generateMetadata() {
  return practiceMetadata(await getPracticePageContent(page))
}

export default async function Page() {
  return <HubspotConsultingPage page={await getPracticePageContent(page)} />
}

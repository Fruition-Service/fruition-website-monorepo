import "@/styles/vc/pages/ai-capability-assessment.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ai-capability-assessment"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="ai-capability-assessment" />
}

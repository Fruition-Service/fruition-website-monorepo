import "@/styles/vc/pages/ai-readiness-blueprint.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ai-readiness-blueprint"
const TITLE = "Free AI Readiness Blueprint | 12-Question Self-Assessment | Fruition"
const DESCRIPTION =
  "Answer 12 questions and get an instant AI & work-platform blueprint: readiness scores across 8 dimensions, a recommended stack, a phased build plan and an indicative investment. Free, no obligation."

export function generateMetadata() {
  return vcMetadata(PATH, { title: TITLE, description: DESCRIPTION })
}

export default function Page() {
  return <VcPage path={PATH} slug="ai-readiness-blueprint" />
}

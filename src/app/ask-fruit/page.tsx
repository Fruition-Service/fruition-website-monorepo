import "@/styles/vc/pages/ask-fruit.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ask-fruit"
const TITLE = "Implementation Calculator | Find the Right monday.com, CRM or AI Solution | Fruition"
const DESCRIPTION =
  "Describe what you are trying to fix. The Implementation Calculator, Fruition's AI assistant, recommends the right monday.com, CRM, integration or AI solution, scores it against your requirements and writes a brief you can share."

export function generateMetadata() {
  return vcMetadata(PATH, { title: TITLE, description: DESCRIPTION })
}

export default function Page() {
  return <VcPage path={PATH} slug="ask-fruit" />
}

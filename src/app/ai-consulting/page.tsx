import "@/styles/vc/pages/ai-consulting.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ai-consulting"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="ai-consulting" />
}

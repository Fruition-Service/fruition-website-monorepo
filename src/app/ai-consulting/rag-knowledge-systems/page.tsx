import "@/styles/vc/pages/rag-knowledge-systems.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ai-consulting/rag-knowledge-systems"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="rag-knowledge-systems" />
}

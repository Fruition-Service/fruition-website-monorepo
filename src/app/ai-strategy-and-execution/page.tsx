import "@/styles/vc/pages/ai-strategy-and-execution.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ai-strategy-and-execution"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="ai-strategy-and-execution" />
}

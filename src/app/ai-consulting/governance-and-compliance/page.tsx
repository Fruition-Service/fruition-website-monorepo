import "@/styles/vc/pages/governance-and-compliance.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/ai-consulting/governance-and-compliance"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="governance-and-compliance" />
}

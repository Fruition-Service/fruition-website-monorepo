import "@/styles/vc/pages/vapi-partner.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/partnerships/vapi-partner"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="vapi-partner" />
}

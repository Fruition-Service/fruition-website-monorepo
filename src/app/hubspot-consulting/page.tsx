import "@/styles/vc/pages/hubspot-consulting.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/hubspot-consulting"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="hubspot-consulting" />
}

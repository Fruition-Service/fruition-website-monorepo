// Built on the approved healthcare industry layout, so it shares that page's
// Version C stylesheet and scope class (docs/version-c.md).
import "@/styles/vc/pages/healthcare.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/industries/hospitality-tourism-events"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="healthcare" />
}

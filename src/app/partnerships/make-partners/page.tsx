import "@/styles/vc/pages/make-partners.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/partnerships/make-partners"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="make-partners" />
}

import "@/styles/vc/pages/faqs.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/faqs"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="faqs" />
}

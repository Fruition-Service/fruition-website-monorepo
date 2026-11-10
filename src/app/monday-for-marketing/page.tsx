import "@/styles/vc/pages/monday-for-marketing.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-for-marketing"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-for-marketing" />
}

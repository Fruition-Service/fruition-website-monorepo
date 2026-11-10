import "@/styles/vc/pages/monday-for-manufacturing.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-for-manufacturing"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-for-manufacturing" />
}

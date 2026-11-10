import "@/styles/vc/pages/monday-for-government.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-for-government"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-for-government" />
}

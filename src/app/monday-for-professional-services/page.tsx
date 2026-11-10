import "@/styles/vc/pages/monday-for-professional-services.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-for-professional-services"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-for-professional-services" />
}

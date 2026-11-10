import "@/styles/vc/pages/financial-services.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/industries/financial-services"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="financial-services" />
}

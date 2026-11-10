import "@/styles/vc/pages/monday-service.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-consulting-solutions/monday-service"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-service" />
}

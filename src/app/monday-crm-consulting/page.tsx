import "@/styles/vc/pages/monday-crm-consulting.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-crm-consulting"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-crm-consulting" />
}

import "@/styles/vc/pages/monday-for-hr.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-consulting-solutions/monday-for-hr"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-for-hr" />
}

import "@/styles/vc/pages/monday-project-management.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-consulting-solutions/monday-project-management"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-project-management" />
}

import "@/styles/vc/pages/fruition-team.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/fruition-team"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="fruition-team" />
}

import "@/styles/vc/pages/solar-renewables.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/industries/solar-renewables"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="solar-renewables" />
}

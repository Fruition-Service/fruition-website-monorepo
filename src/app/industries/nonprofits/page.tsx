import "@/styles/vc/pages/industries-nonprofits.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/industries/nonprofits"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="industries-nonprofits" />
}

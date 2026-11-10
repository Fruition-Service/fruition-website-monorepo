import "@/styles/vc/pages/about-us.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/about-us"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="about-us" />
}

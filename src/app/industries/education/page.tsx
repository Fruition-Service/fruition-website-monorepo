import "@/styles/vc/pages/industries-education.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/industries/education"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="industries-education" />
}

import "@/styles/vc/pages/careers.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/careers"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="careers" />
}

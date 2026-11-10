import "@/styles/vc/pages/monday-partner-philippines.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-partner-philippines"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_PH" })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-philippines" />
}

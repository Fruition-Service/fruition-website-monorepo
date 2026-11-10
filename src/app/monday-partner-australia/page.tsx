import "@/styles/vc/pages/monday-partner-australia.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-partner-australia"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_AU" })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-australia" />
}

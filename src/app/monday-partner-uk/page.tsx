import "@/styles/vc/pages/monday-partner-uk.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-partner-uk"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_GB" })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-uk" />
}

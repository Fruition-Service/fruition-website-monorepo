import "@/styles/vc/pages/monday-partner-india.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-partner-india"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_IN" })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-india" />
}

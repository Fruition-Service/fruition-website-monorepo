import "@/styles/vc/pages/monday-partner-singapore.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-partner-singapore"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_SG" })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-singapore" />
}

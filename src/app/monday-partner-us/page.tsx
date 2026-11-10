import "@/styles/vc/pages/monday-partner-us.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/monday-partner-us"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_US" })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-us" />
}

import "@/styles/vc/pages/monday-partner-india.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { locationHreflangAlternates } from "@/lib/metadata"

const PATH = "/monday-partner-india"

export function generateMetadata() {
  return vcMetadata(PATH, { locale: "en_IN", languages: locationHreflangAlternates() })
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-partner-india" />
}

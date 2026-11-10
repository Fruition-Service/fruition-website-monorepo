import "@/styles/vc/pages/integrations.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/integrations"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="integrations" />
}

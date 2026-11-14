// Version C (14 Nov 2026): built on the approved Integrations hub layout, so it shares that page's
// stylesheet and scope class. Content: vcPage document for /integrations/twilio (docs/version-c.md).
import "@/styles/vc/pages/integrations.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/integrations/twilio"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="integrations" />
}

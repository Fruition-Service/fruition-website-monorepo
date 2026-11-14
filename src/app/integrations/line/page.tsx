// Version C (14 Nov 2026): built on the approved /integrations hub layout, so it shares
// that page's stylesheet and scope class. Content: the vcPage document for
// /integrations/line (docs/version-c.md). The old MessagingChannelTemplate copy
// (src/data/messagingChannels) was carried over section by section.
import "@/styles/vc/pages/integrations.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/integrations/line"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="integrations" />
}

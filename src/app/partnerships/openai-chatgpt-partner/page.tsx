import "@/styles/vc/pages/openai-chatgpt-partner.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/partnerships/openai-chatgpt-partner"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="openai-chatgpt-partner" />
}

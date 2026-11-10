import "@/styles/vc/pages/gemini-partner.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/partnerships/google-gemini-vertex-ai-partner"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="gemini-partner" />
}

import "@/styles/vc/pages/certifications-and-awards.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/certifications-and-awards"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="certifications-and-awards" />
}

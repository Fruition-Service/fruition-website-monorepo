import "@/styles/vc/pages/monday-training.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/training"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="monday-training" />
}

import "@/styles/vc/pages/consulting-blog.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"

const PATH = "/consulting-blog"

export function generateMetadata() {
  return vcMetadata(PATH)
}

export default function Page() {
  return <VcPage path={PATH} slug="consulting-blog" />
}

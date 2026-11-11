import "@/styles/vc/pages/home.css"
import { VcPage, vcMetadata } from "@/components/vc/VcPage"
import { getHomePage } from "@/features/content/loaders"

const PATH = "/"

export async function generateMetadata() {
  const homePage = await getHomePage()
  return vcMetadata(PATH, {
    title: homePage?.seoTitle ?? "Fruition | monday.com Platinum Partners | monday CRM Experts",
    description: homePage?.seoDescription ?? "monday.com Partner certified: Fruition is an expert in Monday implementation and integration.",
  })
}

export default function Home() {
  return <VcPage path={PATH} slug="home" />
}

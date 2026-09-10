import { notFound } from "next/navigation"
import { requirePortalUser, getPortalAdmin } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import DesignDocViewer from "@/components/internal/DesignDocViewer"

export const dynamic = "force-dynamic"

export default async function DesignDocPage({
  params,
}: {
  params: Promise<{ docId: string }>
}) {
  const { docId } = await params
  const user = await requirePortalUser({ next: `/internal/design/${docId}` })

  const admin = getPortalAdmin()
  const { data } = await admin
    .from("design_docs")
    .select("id, title, source_filename, html, template")
    .eq("id", docId)
    .eq("author_id", user.id) // docs are private to their author
    .maybeSingle()
  if (!data?.html) notFound()

  return (
    <PortalShell email={user.email} title="Design document">
      <DesignDocViewer
        id={data.id}
        title={data.title}
        html={data.html}
        sourceFilename={data.source_filename}
        template={data.template}
      />
    </PortalShell>
  )
}

import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import QrCodeGenerator from "@/components/internal/QrCodeGenerator"

export const dynamic = "force-dynamic"

/**
 * Branded QR codes for print and events. Everything runs in the browser — the URL
 * never leaves the page, and there is nothing to store.
 */
export default async function QrCodePage() {
  const user = await requirePortalUser({ next: "/internal/qr" })
  return (
    <PortalShell email={user.email} active="qr">
      <PageHeader
        title="QR code generator"
        description="Turn any link into a branded QR code with the Fruition mark in the middle."
      />
      <QrCodeGenerator />
    </PortalShell>
  )
}

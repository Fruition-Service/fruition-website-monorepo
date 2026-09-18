import Link from 'next/link'
import { requirePortalUser } from '@/lib/portalAuth'
import PortalShell from '@/components/internal/PortalShell'
import PageHeader from '@/components/internal/PageHeader'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import InvoiceListClient from './InvoiceListClient'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const user = await requirePortalUser({ next: '/internal/invoices' })

  return (
    <PortalShell email={user.email} title="Invoices">
      <>
        <PageHeader
          title="Invoices"
          description="Your Clockify hours, turned into an invoice you can send. Only you can see yours."
          actions={
            <Button render={<Link href="/internal/invoices/new" />}>
              <Plus className="mr-2 size-4" />
              New Invoice
            </Button>
          }
        />
        <InvoiceListClient userId={user.id} />
      </>
    </PortalShell>
  )
}

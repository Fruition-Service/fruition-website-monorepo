import { requirePortalUser, getPortalAdmin } from '@/lib/portalAuth'
import PortalShell from '@/components/internal/PortalShell'
import NewInvoiceClient from './NewInvoiceClient'
import type { ConsultantProfile, Invoice, LineItem } from '@/types/invoice'
import type { InvoiceDefaults } from '@/lib/invoiceDefaults'
import { bankPart, paymentDetailsOf } from '@/lib/invoicePayment'

export const dynamic = 'force-dynamic'

export default async function NewInvoicePage() {
  const user = await requirePortalUser({ next: '/internal/invoices/new' })

  let profile: ConsultantProfile | null = null
  let defaults: Partial<InvoiceDefaults> | undefined
  try {
    const admin = getPortalAdmin()
    const { data } = await admin
      .from('fruition_consultant_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    profile = data as ConsultantProfile | null

    // Consultant, region, currency and rate are the same every month, so carry
    // them over from the last invoice rather than making them something to
    // re-enter (or get wrong) each time. The client layers its own localStorage
    // copy on top, which also covers exporting without saving.
    const { data: last } = await admin
      .from('fruition_invoices')
      .select(
        'consultant_name, wise_name, wise_tag, payment_method, bank_account_name, bank_name, bank_address, bank_code, bank_account_number, bank_swift, region, currency, line_items'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle<Pick<
        Invoice,
        | 'consultant_name'
        | 'wise_name'
        | 'wise_tag'
        | 'payment_method'
        | 'bank_account_name'
        | 'bank_name'
        | 'bank_address'
        | 'bank_code'
        | 'bank_account_number'
        | 'bank_swift'
        | 'region'
        | 'currency'
        | 'line_items'
      >>()

    if (last) {
      const lastRate = (last.line_items as LineItem[] | undefined)?.[0]?.rate
      defaults = {}
      if (last.consultant_name) defaults.consultantName = last.consultant_name
      if (typeof last.wise_name === 'string') defaults.wiseName = last.wise_name
      if (typeof last.wise_tag === 'string') defaults.wiseTag = last.wise_tag
      // Only carry bank details from an invoice that was actually paid by bank;
      // an old Wise invoice leaves the new one on the bank tab, empty.
      if (last.payment_method === 'bank') {
        defaults.payment = bankPart(paymentDetailsOf(last as Invoice))
      }
      if (last.region) defaults.region = last.region
      if (last.currency) defaults.currency = last.currency
      if (typeof lastRate === 'number' && lastRate > 0) defaults.rate = lastRate
    }
  } catch {
    // No profile or no previous invoice — the form falls back to its default.
  }

  return (
    <PortalShell email={user.email} title="New Invoice">
      <div
        className="rounded-card bg-surface p-6 sm:p-8"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
          Create New Invoice
        </h1>
        <NewInvoiceClient profile={profile} defaults={defaults} />
      </div>
    </PortalShell>
  )
}

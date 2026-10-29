'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, ArrowLeft, Landmark } from 'lucide-react'
import type { Invoice } from '@/types/invoice'
import InvoicePreview from '@/components/internal/invoices/InvoicePreview'
import PaymentDetailsFields from '@/components/internal/invoices/PaymentDetailsFields'
import { paymentDetailsOf, type PaymentDetails } from '@/lib/invoicePayment'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  invoice: Invoice
}

export default function InvoiceDetailClient({ invoice: saved }: Props) {
  const router = useRouter()
  const [invoice, setInvoice] = useState(saved)
  // Payment details are the one thing worth changing on a saved invoice:
  // Fruition moved consultants from Wise to bank transfers after invoices had
  // already been raised.
  const [editing, setEditing] = useState(false)
  const [payment, setPayment] = useState<PaymentDetails>(() => paymentDetailsOf(saved))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleExport = async () => {
    // Lazy-load pdfmake client-side only — keeps it out of the edge Worker bundle.
    const { exportInvoiceToPDF } = await import('@/lib/invoicePdf')
    await exportInvoiceToPDF(editing ? { ...invoice, ...payment } : invoice)
  }

  const handleSavePayment = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch('/api/internal/invoices/' + invoice.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...invoice, ...payment }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(data.error || 'Failed to save payment details')
      }
      setInvoice((await res.json()) as Invoice)
      setEditing(false)
      router.refresh()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save payment details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="rounded-card bg-surface p-6 sm:p-8"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" render={<Link href="/internal/invoices" />}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Invoices
        </Button>
        <div className="flex flex-wrap gap-2">
          {!editing && (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Landmark className="mr-2 size-4" />
              Payment details
            </Button>
          )}
          <Button onClick={handleExport}>
            <Download className="mr-2 size-4" />
            Export PDF
          </Button>
        </div>
      </div>
      <div className="mx-auto flex max-w-[900px] flex-col gap-6">
        {editing && (
          <div className="flex flex-col gap-4 rounded-xl border p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Payment details</p>
              <p className="text-xs text-muted-foreground">
                Where Fruition should pay this invoice. The preview below updates as you type.
              </p>
            </div>
            <PaymentDetailsFields value={payment} onChange={setPayment} />
            {saveError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{saveError}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSavePayment} disabled={saving}>
                {saving ? 'Saving…' : 'Save payment details'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setPayment(paymentDetailsOf(invoice))
                  setEditing(false)
                  setSaveError('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <InvoicePreview invoice={editing ? { ...invoice, ...payment } : invoice} />
      </div>
    </div>
  )
}

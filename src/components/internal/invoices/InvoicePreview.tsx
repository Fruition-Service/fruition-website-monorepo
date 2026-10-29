'use client'

import type { Invoice } from '@/types/invoice'
import { paymentBlock } from '@/lib/invoicePayment'

interface Props {
  invoice: Invoice
}

export default function InvoicePreview({ invoice }: Props) {
  const totalAmount = invoice.line_items.reduce((sum, item) => sum + item.total, 0)
  const currency = invoice.currency || 'USD'
  const payment = paymentBlock(invoice)

  return (
    <div
      id="invoice-preview"
      className="rounded-xl border bg-card p-6 shadow-md md:p-8"
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">{invoice.consultant_name}</p>
            {/* Only rendered when present — these aren't set on new invoices. */}
            {invoice.consultant_address && (
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {invoice.consultant_address}
              </p>
            )}
            {invoice.consultant_phone && (
              <p className="text-sm text-muted-foreground">{invoice.consultant_phone}</p>
            )}
            {invoice.consultant_email && (
              <p className="text-sm text-muted-foreground">{invoice.consultant_email}</p>
            )}
            <div className="mt-4 w-full border-t pt-3">
              <p className="mb-2 text-xs font-semibold">Kindly make payment to:</p>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground">{payment.heading}</p>
                {payment.lines.map((line) => (
                  <p key={line} className="text-xs text-muted-foreground">{line}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 md:items-end">
            <p className="text-4xl font-bold text-purple-600">INVOICE</p>
            <p className="text-base font-medium">{invoice.invoice_no}</p>
            <p className="text-sm text-muted-foreground">{invoice.invoice_date}</p>
          </div>
        </div>

        <hr />

        <div>
          <p className="text-sm font-semibold">TO:</p>
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {invoice.billing_address}
          </p>
        </div>

        <p className="text-sm font-medium">
          Period: {invoice.billing_period}
        </p>

        <hr />

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[2fr_80px_100px_100px] gap-3 border-b-2 pb-2">
            <p className="text-xs font-semibold">Description</p>
            <p className="text-center text-xs font-semibold">Qty (Hrs)</p>
            <p className="text-right text-xs font-semibold">Rate ({currency})</p>
            <p className="text-right text-xs font-semibold">Total ({currency})</p>
          </div>
          {invoice.line_items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[2fr_80px_100px_100px] gap-3 border-b py-2"
            >
              <div>
                <p className="mb-1 text-sm font-medium">{item.projectName}</p>
                <p className="whitespace-pre-line text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <p className="text-center text-sm">{item.hours}</p>
              <p className="text-right text-sm">{item.rate.toFixed(2)}</p>
              <p className="text-right text-sm">{item.total.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <hr />

        <div className="flex items-center justify-end gap-4">
          <p className="text-lg font-semibold">TOTAL {currency}:</p>
          <p className="text-2xl font-bold text-purple-600">
            {totalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {invoice.notes && (
          <>
            <hr />
            <p className="whitespace-pre-line text-xs italic text-muted-foreground">
              {invoice.notes}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import type { Invoice, LineItem, ConsultantProfile } from '@/types/invoice'
import {
  REGION_ADDRESSES,
  REGIONS,
  CURRENCIES,
  generateMonthOptions,
  monthToBillingPeriod,
  getCurrentYearMonth,
} from '@/types/invoice'
import InvoicePreview from './InvoicePreview'
import LineItemRow from './LineItemRow'
import ClockifyDropzone from './ClockifyDropzone'
import type { ParsedProject } from '@/lib/clockifyPdf'
import {
  FALLBACK_DEFAULTS,
  readRememberedDefaults,
  rememberDefaults,
  type InvoiceDefaults,
} from '@/lib/invoiceDefaults'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const monthOptions = generateMonthOptions()

const round2 = (n: number) => Math.round(n * 100) / 100

function toLineItem(project: ParsedProject, rate: number): LineItem {
  return {
    projectId: null,
    projectName: project.name,
    description: project.description,
    hours: project.hours,
    rate,
    total: round2(project.hours * rate),
  }
}

interface Props {
  /** Pre-fetched consultant profile from Supabase. */
  profile?: ConsultantProfile | null
  /** Values carried over from the last invoice saved, read server-side. */
  defaults?: Partial<InvoiceDefaults>
  /** Called after successful save. */
  onSave: (invoice: Invoice) => Promise<void>
}

export default function InvoiceForm({ profile, defaults, onSave }: Props) {
  // Server defaults come from the last invoice saved; localStorage is layered
  // on top in the effect below.
  const initial: InvoiceDefaults = {
    ...FALLBACK_DEFAULTS,
    consultantName: profile?.consultant_name || FALLBACK_DEFAULTS.consultantName,
    wiseName: profile?.wise_name ?? FALLBACK_DEFAULTS.wiseName,
    wiseTag: profile?.wise_tag ?? FALLBACK_DEFAULTS.wiseTag,
    region: profile?.region || FALLBACK_DEFAULTS.region,
    ...defaults,
  }

  const [consultantName, setConsultantName] = useState(initial.consultantName)
  const [wiseName, setWiseName] = useState(initial.wiseName)
  const [wiseTag, setWiseTag] = useState(initial.wiseTag)
  const [region, setRegion] = useState(initial.region)
  const [invoiceNo, setInvoiceNo] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [billingMonth, setBillingMonth] = useState(getCurrentYearMonth())
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [notes, setNotes] = useState('')
  // One rate for the whole invoice — it's a property of the consultant, not of
  // each project. Every line is billed at it.
  const [rate, setRate] = useState(initial.rate)
  const [currency, setCurrency] = useState(initial.currency)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // localStorage can only be read after mount — doing it during render would
  // make the server and client markup disagree. Line items are empty at this
  // point, so there is nothing to re-price.
  useEffect(() => {
    const remembered = readRememberedDefaults()
    if (!remembered) return
    if (remembered.consultantName) setConsultantName(remembered.consultantName)
    if (remembered.wiseName !== undefined) setWiseName(remembered.wiseName)
    if (remembered.wiseTag !== undefined) setWiseTag(remembered.wiseTag)
    if (remembered.region) setRegion(remembered.region)
    if (remembered.currency) setCurrency(remembered.currency)
    if (remembered.rate) setRate(remembered.rate)
  }, [])

  const currentDefaults = (): InvoiceDefaults => ({
    consultantName,
    wiseName,
    wiseTag,
    region,
    currency,
    rate,
  })

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return day + '/' + month + '/' + year
  }

  const buildInvoice = (): Invoice => ({
    invoice_no: invoiceNo,
    invoice_date: formatDate(invoiceDate),
    billing_month: billingMonth,
    billing_period: monthToBillingPeriod(billingMonth),
    consultant_name: consultantName,
    // No longer edited in the form. Kept on the record so a consultant profile
    // (and any already-saved invoice) still renders a full header.
    consultant_address: profile?.consultant_address || '',
    consultant_phone: profile?.consultant_phone || '',
    consultant_email: profile?.consultant_email || '',
    wise_name: wiseName,
    wise_tag: wiseTag,
    billing_address: REGION_ADDRESSES[region] || '',
    region,
    currency,
    line_items: lineItems,
    notes,
  })

  const addManualLine = () => {
    setLineItems([
      ...lineItems,
      { projectId: null, projectName: '', description: '', hours: 0, rate, total: 0 },
    ])
  }

  // A parsed Clockify report replaces the line items outright — re-uploading a
  // corrected export should not stack duplicates on top of the previous run.
  const applyParsedReport = (projects: ParsedProject[], parsedMonth: string) => {
    setLineItems(projects.map((p) => toLineItem(p, rate)))
    setBillingMonth(parsedMonth)
  }

  const removeLine = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const updateLine = (
    index: number,
    field: 'projectName' | 'description' | 'hours',
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item, i) => {
        if (i !== index) return item
        if (field === 'hours') {
          const hours = Number(value)
          return { ...item, hours, total: round2(hours * rate) }
        }
        return { ...item, [field]: String(value) }
      })
    )
  }

  // Changing the rate re-prices every line — that's the point of it being one
  // field. Keep `rate` on each stored line so the preview, the PDF and any
  // already-saved invoice keep rendering unchanged.
  const updateRate = (next: number) => {
    setRate(next)
    setLineItems((items) =>
      items.map((item) => ({ ...item, rate: next, total: round2(item.hours * next) }))
    )
  }

  const handleSave = async () => {
    if (!consultantName || !region || lineItems.length === 0) {
      setSaveError('Fill in consultant, region, and at least one line item.')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      await onSave(buildInvoice())
      rememberDefaults(currentDefaults())
    } catch (error) {
      console.error('Save failed:', error)
      // Show what actually went wrong — a swallowed "Failed to save invoice"
      // hid a missing Supabase table for weeks.
      setSaveError(
        error instanceof Error ? error.message : 'Failed to save invoice.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = async () => {
    if (!consultantName || !region || lineItems.length === 0) {
      setSaveError('Fill in consultant, region, and at least one line item.')
      return
    }
    setSaveError('')
    // Lazy-load pdfmake client-side only — keeps it out of the edge Worker bundle.
    const { exportInvoiceToPDF } = await import('@/lib/invoicePdf')
    await exportInvoiceToPDF(buildInvoice())
    // Exporting doesn't touch the database, so remember here too — otherwise an
    // export-only month would leave the next invoice blank.
    rememberDefaults(currentDefaults())
  }

  const invoice = buildInvoice()
  const totalHours = lineItems.reduce((sum, i) => sum + (i.hours || 0), 0)
  const totalAmount = lineItems.reduce((sum, i) => sum + (i.total || 0), 0)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        {/* Clockify upload — the default way in; everything below is editable
            afterwards, and stays usable if you'd rather key an invoice by hand.
            Numbered, because an invoice really does start with the report. */}
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--purple-primary)] font-mono text-xs font-semibold text-white">
            1
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Drop in the Clockify report</p>
            <p className="text-xs text-muted-foreground">Every line item, the hours and the billing period are read from it</p>
          </div>
        </div>
        <div>
          <ClockifyDropzone onParsed={applyParsedReport} />
        </div>

        {/* Consultant & Region */}
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--purple-primary)] font-mono text-xs font-semibold text-white">
            2
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Who is billing</p>
            <p className="text-xs text-muted-foreground">Your Wise details come from your profile — the name never does</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Consultant Name
            </label>
            <Input
              placeholder="e.g. Jane Doe"
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wise */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Wise Account Name
            </label>
            <Input
              placeholder="Account holder name"
              value={wiseName}
              onChange={(e) => setWiseName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Wisetag</label>
            <Input
              placeholder="@wisetag"
              value={wiseTag}
              onChange={(e) => setWiseTag(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice meta */}
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--purple-primary)] font-mono text-xs font-semibold text-white">
            3
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">What it comes to</p>
            <p className="text-xs text-muted-foreground">Number, dates, rate and every line on the invoice</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Invoice No.
            </label>
            <Input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Invoice Date
            </label>
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>
        </div>

        {/* Billing Month */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Billing Month
          </label>
          <select
            value={billingMonth}
            onChange={(e) => setBillingMonth(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Period: {monthToBillingPeriod(billingMonth)}
          </p>
        </div>

        {/* Rate & currency — set once, applied to every line below. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Hourly rate
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={rate || ''}
              onChange={(e) => updateRate(parseFloat(e.target.value) || 0)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Applies to every line item.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold">
              Line items {lineItems.length > 0 && `(${lineItems.length})`}
            </p>
            {lineItems.length > 0 && (
              <p className="text-xs text-muted-foreground tabular-nums">
                {totalHours.toFixed(2)} hrs · {currency} {totalAmount.toFixed(2)}
              </p>
            )}
          </div>

          {lineItems.map((item, idx) => (
            <LineItemRow
              key={idx}
              item={item}
              index={idx}
              currency={currency}
              onChange={updateLine}
              onRemove={removeLine}
            />
          ))}

          {lineItems.length === 0 && (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Upload a Clockify report above, or add a line by hand.
            </p>
          )}
        </div>

        <Button variant="outline" onClick={addManualLine} type="button">
          <Plus className="mr-2 size-4" />
          Add line
        </Button>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Notes (optional)
          </label>
          <textarea
            placeholder="Additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
            rows={3}
          />
        </div>

        {saveError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{saveError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Invoice'}
          </Button>
          <Button variant="outline" onClick={handleExportPDF} type="button">
            Export to PDF
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  )
}

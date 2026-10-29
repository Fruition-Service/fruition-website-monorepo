'use client'

import type { PaymentMethod } from '@/types/invoice'
import type { PaymentDetails } from '@/lib/invoicePayment'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  value: PaymentDetails
  onChange: (next: PaymentDetails) => void
}

const BANK_FIELDS: Array<{
  key: keyof PaymentDetails
  label: string
  placeholder: string
  wide?: boolean
}> = [
  { key: 'bank_account_name', label: 'Account name', placeholder: 'Name on the account' },
  { key: 'bank_name', label: 'Bank', placeholder: 'e.g. DBS Bank Ltd' },
  { key: 'bank_code', label: 'Bank code', placeholder: 'BSB, sort code or bank/branch code' },
  { key: 'bank_account_number', label: 'Account number', placeholder: 'Account number' },
  { key: 'bank_swift', label: 'SWIFT/BIC', placeholder: 'For transfers from abroad' },
  { key: 'bank_address', label: 'Bank address', placeholder: 'Optional', wide: true },
]

/**
 * Where the consultant wants to be paid. Fruition now pays by bank transfer;
 * Wise stays selectable so older invoices (and anyone not yet switched) still
 * edit cleanly.
 */
export default function PaymentDetailsFields({ value, onChange }: Props) {
  const set = (key: keyof PaymentDetails, v: string) => onChange({ ...value, [key]: v })
  const method = value.payment_method

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={method}
        onValueChange={(m) => onChange({ ...value, payment_method: m as PaymentMethod })}
      >
        <TabsList aria-label="Payment method" className="group-data-horizontal/tabs:h-auto">
          <TabsTrigger value="bank" className="min-h-11 px-4">Bank account</TabsTrigger>
          <TabsTrigger value="wise" className="min-h-11 px-4">Wise</TabsTrigger>
        </TabsList>
      </Tabs>

      {method === 'bank' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {BANK_FIELDS.map((f) => (
            <div key={f.key} className={f.wide ? 'md:col-span-2' : undefined}>
              <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
              <Input
                placeholder={f.placeholder}
                value={(value[f.key] as string) || ''}
                onChange={(e) => set(f.key, e.target.value)}
                autoComplete="off"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Wise Account Name</label>
            <Input
              placeholder="Account holder name"
              value={value.wise_name}
              onChange={(e) => set('wise_name', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Wisetag</label>
            <Input
              placeholder="@wisetag"
              value={value.wise_tag}
              onChange={(e) => set('wise_tag', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export interface LineItem {
  projectId?: string | null
  projectName: string
  description: string
  hours: number
  rate: number
  total: number
}

export type PaymentMethod = 'wise' | 'bank'

export interface Invoice {
  id?: string
  user_id?: string
  invoice_no: string
  invoice_date: string
  billing_month?: string
  billing_period: string
  currency: string
  consultant_name: string
  consultant_address: string
  consultant_phone: string
  consultant_email: string
  wise_name: string
  wise_tag: string
  /** Which payment block the invoice prints. Missing on invoices saved before bank details existed: treat as Wise. */
  payment_method?: PaymentMethod | null
  bank_account_name?: string | null
  bank_name?: string | null
  bank_address?: string | null
  /** Local routing code: BSB, sort code, bank/branch code, ABA routing. */
  bank_code?: string | null
  bank_account_number?: string | null
  bank_swift?: string | null
  billing_address: string
  notes: string
  line_items: LineItem[]
  region: string
  created_at?: string
  updated_at?: string
}

export interface ConsultantProfile {
  id?: string
  user_id?: string
  consultant_name: string
  consultant_address: string
  consultant_phone: string
  consultant_email: string
  wise_name: string
  wise_tag: string
  region: string
  updated_at?: string
}

export const REGION_ADDRESSES: Record<string, string> = {
  NA: 'Fruition Services Inc\n1 Beaux Arts Ln, Halesite NY 11743, United States',
  APAC: 'Fruition Services Pty Ltd\n12/64 York Street, Sydney NSW 2000, Australia',
  UK: 'Fruition Services Limited\nC/O Gpc Financial Management\n423 Linen Hall, 162-168 Regent Street\nLondon, United Kingdom, W1B 5TE',
}

export const CURRENCIES = ['USD', 'SGD', 'AUD', 'GBP', 'EUR'] as const

export const REGIONS = ['NA', 'APAC', 'UK'] as const

export function generateMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = -12; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const label = d.toLocaleString('default', { month: 'short' }) + ' ' + year
    options.push({ value: year + '-' + month, label })
  }
  return options.reverse()
}

export function monthToBillingPeriod(yearMonth: string): string {
  if (!yearMonth) return ''
  const parts = yearMonth.split('-').map(Number)
  const year = parts[0]
  const month = parts[1]
  const lastDay = new Date(year, month, 0).getDate()
  const pad = (n: number) => String(n).padStart(2, '0')
  return pad(1) + '/' + pad(month) + '/' + year + ' to ' + pad(lastDay) + '/' + pad(month) + '/' + year
}

export function getCurrentYearMonth(): string {
  const now = new Date()
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
}

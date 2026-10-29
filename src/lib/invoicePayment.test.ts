import { describe, expect, it } from 'vitest'
import type { Invoice } from '@/types/invoice'
import { bankPart, paymentBlock, paymentDetailsOf, paymentMethodOf } from './invoicePayment'
import { readPayment } from './invoiceDefaults'

const base: Invoice = {
  invoice_no: '001',
  invoice_date: '01/01/2026',
  billing_period: '01/01/2026 to 31/01/2026',
  currency: 'USD',
  consultant_name: 'Jane Doe',
  consultant_address: '',
  consultant_phone: '',
  consultant_email: '',
  wise_name: 'Jane Doe',
  wise_tag: '@janed',
  billing_address: '',
  notes: '',
  line_items: [],
  region: 'APAC',
}

describe('paymentBlock', () => {
  it('renders an invoice saved before bank details existed exactly as before', () => {
    expect(paymentMethodOf(base)).toBe('wise')
    expect(paymentBlock(base)).toEqual({
      heading: 'Wise account',
      lines: ['Name: Jane Doe', 'Wisetag: @janed'],
    })
  })

  it('prints the bank block, skipping blank fields', () => {
    const inv: Invoice = {
      ...base,
      payment_method: 'bank',
      bank_account_name: 'Jane Doe',
      bank_name: 'Example Bank',
      bank_code: '1234',
      bank_account_number: '000-111',
      bank_swift: '  EXAMPXXX ',
      bank_address: '',
    }
    expect(paymentBlock(inv)).toEqual({
      heading: 'Bank account',
      lines: [
        'Account name: Jane Doe',
        'Bank: Example Bank',
        'Bank code: 1234',
        'Account number: 000-111',
        'SWIFT/BIC: EXAMPXXX',
      ],
    })
  })
})

describe('payment details round trip', () => {
  it('keeps the bank half for remembering, without the Wise fields', () => {
    const d = paymentDetailsOf({ ...base, payment_method: 'bank', bank_name: 'Example Bank' })
    const bank = bankPart(d)
    expect(bank).not.toHaveProperty('wise_tag')
    expect(bank.bank_name).toBe('Example Bank')
    expect(readPayment(bank)).toEqual(bank)
  })

  it('rejects a stored payment object with no valid method', () => {
    expect(readPayment({ bank_name: 'x' })).toBeNull()
    expect(readPayment('nope')).toBeNull()
  })
})

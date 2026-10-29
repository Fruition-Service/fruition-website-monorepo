import type { Invoice, PaymentMethod } from '@/types/invoice'

/** The payment fields an invoice carries, as one editable unit. */
export type PaymentDetails = Pick<
  Invoice,
  | 'wise_name'
  | 'wise_tag'
  | 'bank_account_name'
  | 'bank_name'
  | 'bank_address'
  | 'bank_code'
  | 'bank_account_number'
  | 'bank_swift'
> & { payment_method: PaymentMethod }

export const EMPTY_PAYMENT_DETAILS: PaymentDetails = {
  payment_method: 'bank',
  wise_name: '',
  wise_tag: '',
  bank_account_name: '',
  bank_name: '',
  bank_address: '',
  bank_code: '',
  bank_account_number: '',
  bank_swift: '',
}

/** The bank half of the payment details: what is remembered alongside the Wise fields. */
export type BankDetails = Omit<PaymentDetails, 'wise_name' | 'wise_tag'>

export function bankPart(p: PaymentDetails): BankDetails {
  return {
    payment_method: p.payment_method,
    bank_account_name: p.bank_account_name,
    bank_name: p.bank_name,
    bank_address: p.bank_address,
    bank_code: p.bank_code,
    bank_account_number: p.bank_account_number,
    bank_swift: p.bank_swift,
  }
}

/** Invoices saved before bank details existed have no method and were all Wise. */
export function paymentMethodOf(invoice: Pick<Invoice, 'payment_method'>): PaymentMethod {
  return invoice.payment_method === 'bank' ? 'bank' : 'wise'
}

export function paymentDetailsOf(invoice: Invoice): PaymentDetails {
  return {
    payment_method: paymentMethodOf(invoice),
    wise_name: invoice.wise_name || '',
    wise_tag: invoice.wise_tag || '',
    bank_account_name: invoice.bank_account_name || '',
    bank_name: invoice.bank_name || '',
    bank_address: invoice.bank_address || '',
    bank_code: invoice.bank_code || '',
    bank_account_number: invoice.bank_account_number || '',
    bank_swift: invoice.bank_swift || '',
  }
}

/**
 * The "Kindly make payment to:" block, shared by the on-screen preview and the
 * PDF so the two can never disagree. Bank lines that are blank are left out;
 * the Wise block keeps its old fixed shape so old invoices render unchanged.
 */
export function paymentBlock(invoice: Invoice): { heading: string; lines: string[] } {
  if (paymentMethodOf(invoice) === 'wise') {
    return {
      heading: 'Wise account',
      lines: ['Name: ' + (invoice.wise_name || ''), 'Wisetag: ' + (invoice.wise_tag || '')],
    }
  }
  const rows: Array<[string, string | null | undefined]> = [
    ['Account name', invoice.bank_account_name],
    ['Bank', invoice.bank_name],
    ['Bank code', invoice.bank_code],
    ['Account number', invoice.bank_account_number],
    ['SWIFT/BIC', invoice.bank_swift],
    ['Bank address', invoice.bank_address],
  ]
  return {
    heading: 'Bank account',
    lines: rows
      .filter(([, v]) => typeof v === 'string' && v.trim() !== '')
      .map(([label, v]) => label + ': ' + (v as string).trim()),
  }
}

/**
 * The parts of an invoice that are the same every month.
 *
 * These are remembered so a new invoice starts filled in. Two sources feed them:
 *
 *   * the server, from the last invoice saved to Supabase — works on any device
 *   * localStorage, written whenever you export or save — also covers the case
 *     where you export a PDF without saving, which never touches the database
 *
 * localStorage wins when both exist: every save writes it too, so it is never
 * older than the server copy for the browser you are sitting at.
 */

import type { BankDetails } from '@/lib/invoicePayment'
import { EMPTY_PAYMENT_DETAILS, bankPart } from '@/lib/invoicePayment'

export interface InvoiceDefaults {
  consultantName: string
  wiseName: string
  wiseTag: string
  /** Bank transfer details and which method to print, carried like the Wise ones. */
  payment: BankDetails
  region: string
  currency: string
  rate: number
}

const STORAGE_KEY = 'fruition.invoice.defaults.v1'

/**
 * Used when there is nothing remembered and no previous invoice.
 *
 * `consultantName` is deliberately blank. It used to carry a real consultant's
 * name, which meant anyone raising their first invoice started with someone
 * else's name already filled in — an invoice is a financial document and must
 * never default to the wrong payee. Empty lets the field's placeholder show and
 * the form's own validation block the save until it is filled.
 */
export const FALLBACK_DEFAULTS: InvoiceDefaults = {
  consultantName: '',
  wiseName: '',
  wiseTag: '',
  payment: bankPart(EMPTY_PAYMENT_DETAILS),
  region: 'APAC',
  currency: 'SGD',
  rate: 40,
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim() !== ''
}

/**
 * Reads remembered defaults. Returns null when nothing is stored, the browser
 * has no localStorage (SSR), or the stored value is unusable.
 *
 * Only call this from an effect — reading storage during render would make the
 * server and client markup disagree.
 */
export function readRememberedDefaults(): Partial<InvoiceDefaults> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const o = parsed as Record<string, unknown>
    const out: Partial<InvoiceDefaults> = {}
    if (isNonEmptyString(o.consultantName)) out.consultantName = o.consultantName
    if (typeof o.wiseName === 'string') out.wiseName = o.wiseName
    if (typeof o.wiseTag === 'string') out.wiseTag = o.wiseTag
    const payment = readPayment(o.payment)
    if (payment) out.payment = payment
    if (isNonEmptyString(o.region)) out.region = o.region
    if (isNonEmptyString(o.currency)) out.currency = o.currency
    if (typeof o.rate === 'number' && o.rate > 0) out.rate = o.rate
    return Object.keys(out).length > 0 ? out : null
  } catch {
    // Corrupt JSON or storage blocked — fall back to the server defaults.
    return null
  }
}

const BANK_KEYS = [
  'bank_account_name',
  'bank_name',
  'bank_address',
  'bank_code',
  'bank_account_number',
  'bank_swift',
] as const

/** Accepts a stored payment object only if every field is the right type. */
export function readPayment(v: unknown): InvoiceDefaults['payment'] | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  if (o.payment_method !== 'bank' && o.payment_method !== 'wise') return null
  const out: InvoiceDefaults['payment'] = { ...FALLBACK_DEFAULTS.payment, payment_method: o.payment_method }
  for (const k of BANK_KEYS) {
    if (typeof o[k] === 'string') out[k] = o[k] as string
  }
  return out
}

/** Remembers the current values. Never throws: storage can be full or blocked. */
export function rememberDefaults(defaults: InvoiceDefaults): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
  } catch {
    // Private mode / quota — remembering is a convenience, not a requirement.
  }
}

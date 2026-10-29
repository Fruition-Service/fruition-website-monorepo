import { getPortalApiUser, getPortalAdmin } from '@/lib/portalAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from('fruition_invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const admin = getPortalAdmin()
  const { data, error } = await admin
    .from('fruition_invoices')
    .update({
      invoice_no: body.invoice_no,
      invoice_date: body.invoice_date,
      billing_month: body.billing_month,
      billing_period: body.billing_period,
      currency: body.currency,
      consultant_name: body.consultant_name,
      consultant_address: body.consultant_address,
      consultant_phone: body.consultant_phone,
      consultant_email: body.consultant_email,
      wise_name: body.wise_name,
      wise_tag: body.wise_tag,
      payment_method:
        body.payment_method === undefined ? undefined : body.payment_method === 'bank' ? 'bank' : 'wise',
      bank_account_name: body.bank_account_name,
      bank_name: body.bank_name,
      bank_address: body.bank_address,
      bank_code: body.bank_code,
      bank_account_number: body.bank_account_number,
      bank_swift: body.bank_swift,
      billing_address: body.billing_address,
      notes: body.notes,
      line_items: body.line_items,
      region: body.region,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update invoice:', error)
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const admin = getPortalAdmin()
  const { error } = await admin
    .from('fruition_invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete invoice:', error)
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

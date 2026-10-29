import type { Invoice } from '@/types/invoice'
import { paymentBlock } from '@/lib/invoicePayment'

let pdfMake: typeof import('pdfmake/build/pdfmake').default | null = null

async function getPdfMake() {
  if (!pdfMake) {
    const pdfMakeMod = await import('pdfmake/build/pdfmake')
    const pdfFonts = await import('pdfmake/build/vfs_fonts')
    pdfMake = pdfMakeMod.default
    if (pdfFonts?.pdfMake?.vfs) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs
    }
  }
  return pdfMake
}

export async function exportInvoiceToPDF(invoice: Invoice) {
  const pdf = await getPdfMake()
  const currency = invoice.currency || 'USD'
  const payment = paymentBlock(invoice)

  const tableBody: Array<Array<Record<string, unknown>>> = [
    [
      { text: 'Description', style: 'tableHeader' },
      { text: 'Qty (Hrs)', style: 'tableHeader', alignment: 'center' },
      { text: 'Rate (' + currency + ')', style: 'tableHeader', alignment: 'right' },
      { text: 'Total (' + currency + ')', style: 'tableHeader', alignment: 'right' },
    ],
  ]

  for (const item of invoice.line_items) {
    const descriptionText = item.projectName
      ? item.projectName + '\n' + (item.description || '')
      : item.description || ''
    tableBody.push([
      { text: descriptionText, style: item.projectName ? 'lineItemWithProject' : 'lineItem' },
      { text: item.hours.toString(), style: 'lineItemNumber', alignment: 'center' },
      { text: item.rate.toFixed(2), style: 'lineItemNumber', alignment: 'right' },
      { text: item.total.toFixed(2), style: 'lineItemNumber', alignment: 'right' },
    ])
  }

  const totalAmount = invoice.line_items.reduce((sum, item) => sum + item.total, 0)

  const docDefinition = {
    content: [
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: invoice.consultant_name, style: 'consultantName' },
              // Dropped entirely when blank — an empty line still takes vertical
              // space in pdfmake, which left a gap under the name.
              ...[
                invoice.consultant_address,
                invoice.consultant_phone,
                invoice.consultant_email,
              ]
                .filter((v): v is string => !!v && v.trim() !== '')
                .map((text) => ({ text, style: 'consultantInfo' })),
              { text: '', margin: [0, 10, 0, 0] },
              { text: 'Kindly make payment to:', style: 'paymentLabel' },
              { text: payment.heading, style: 'consultantInfo' },
              ...payment.lines.map((text) => ({ text, style: 'consultantInfo' })),
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'INVOICE', style: 'invoiceTitle', alignment: 'right' },
              { text: invoice.invoice_no, style: 'invoiceNumber', alignment: 'right' },
              { text: invoice.invoice_date, style: 'invoiceDate', alignment: 'right' },
            ],
          },
        ],
        margin: [0, 0, 0, 30],
      },
      { text: 'TO:', style: 'sectionLabel', margin: [0, 0, 0, 5] },
      { text: invoice.billing_address, style: 'billingAddress', margin: [0, 0, 0, 20] },
      { text: 'Period: ' + invoice.billing_period, style: 'billingPeriod', margin: [0, 0, 0, 30] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 60, 80, 80],
          body: tableBody,
        },
        layout: {
          hLineWidth: (i: number, node: { table: { body: unknown[] } }) =>
            i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5,
          vLineWidth: () => 0,
          hLineColor: () => '#E5E5E5',
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 220,
            stack: [
              {
                columns: [
                  { text: 'TOTAL ' + currency + ':', style: 'totalLabel', width: '50%' },
                  {
                    text: totalAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                    style: 'totalAmount',
                    alignment: 'right',
                    width: '50%',
                  },
                ],
                margin: [0, 15, 0, 0],
              },
            ],
          },
        ],
      },
      invoice.notes
        ? { text: invoice.notes, style: 'notes', margin: [0, 30, 0, 0] }
        : {},
    ],
    styles: {
      invoiceTitle: { fontSize: 32, bold: true, color: '#6C3FC4' },
      paymentLabel: { fontSize: 9, bold: true, color: '#2D2D2D' },
      invoiceNumber: { fontSize: 14, color: '#2D2D2D', margin: [0, 5, 0, 0] },
      invoiceDate: { fontSize: 12, color: '#6B6B6B' },
      consultantName: { fontSize: 14, bold: true, color: '#2D2D2D' },
      consultantInfo: { fontSize: 10, color: '#6B6B6B', lineHeight: 1.4 },
      sectionLabel: { fontSize: 11, bold: true, color: '#2D2D2D' },
      billingAddress: { fontSize: 10, color: '#6B6B6B', lineHeight: 1.4 },
      billingPeriod: { fontSize: 11, color: '#2D2D2D' },
      tableHeader: { fontSize: 10, bold: true, color: '#2D2D2D', fillColor: '#FAFAFA' },
      lineItem: { fontSize: 9, color: '#2D2D2D' },
      lineItemWithProject: { fontSize: 9, color: '#2D2D2D', bold: true },
      lineItemNumber: { fontSize: 9, color: '#2D2D2D' },
      totalLabel: { fontSize: 12, bold: true, color: '#2D2D2D' },
      totalAmount: { fontSize: 16, bold: true, color: '#6C3FC4' },
      notes: { fontSize: 9, color: '#6B6B6B', italics: true },
    },
    defaultStyle: { font: 'Roboto' },
  }

  pdf.createPdf(docDefinition).download('Invoice_' + invoice.invoice_no + '.pdf')
}

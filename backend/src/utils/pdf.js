function escapePdfText(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function generateReceiptPdf(order) {
  const lines = [
    'PMarketplace Order Receipt',
    `Order #${order.id}`,
    `Date: ${order.created_at}`,
    `Total: $${Number(order.total).toFixed(2)}`,
    ' ',
    'Items:'
  ]

  order.items.forEach((item) => {
    lines.push(`- ${item.name} ($${Number(item.price).toFixed(2)})`)
  })

  let y = 760
  const contentLines = ['BT', '/F1 12 Tf']

  lines.forEach((line) => {
    contentLines.push(`1 0 0 1 50 ${y} Tm (${escapePdfText(line)}) Tj`)
    y -= 18
  })

  contentLines.push('ET')
  const content = contentLines.join('\n')
  const contentBuffer = Buffer.from(content, 'utf8')

  const objects = []
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`)
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`)
  objects.push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`
  )
  objects.push(
    `4 0 obj\n<< /Length ${contentBuffer.length} >>\nstream\n${content}\nendstream\nendobj\n`
  )
  objects.push(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`)

  const header = Buffer.from('%PDF-1.4\n', 'utf8')
  const buffers = [header]
  const offsets = [0]
  let offset = header.length

  for (const obj of objects) {
    offsets.push(offset)
    const buf = Buffer.from(obj, 'utf8')
    buffers.push(buf)
    offset += buf.length
  }

  const xrefStart = offset
  let xref = `xref\n0 ${offsets.length}\n`
  xref += '0000000000 65535 f \n'
  for (let i = 1; i < offsets.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }

  const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  buffers.push(Buffer.from(xref, 'utf8'))
  buffers.push(Buffer.from(trailer, 'utf8'))

  return Buffer.concat(buffers)
}

module.exports = {
  generateReceiptPdf
}

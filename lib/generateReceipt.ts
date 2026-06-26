import type { FeeDTO } from '@/models/Fee'
import type { RegistrationDTO } from '@/models/Registration'

export async function generateReceipt(fee: FeeDTO, student: RegistrationDTO): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: html2canvas } = await import('html2canvas')

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

  const statusColors: Record<string, string> = {
    paid: '#065f46',
    pending: '#92400e',
    partial: '#1e40af',
  }
  const statusBg: Record<string, string> = {
    paid: '#d1fae5',
    pending: '#fef3c7',
    partial: '#dbeafe',
  }

  const div = document.createElement('div')
  div.style.cssText = 'position:absolute;left:-9999px;top:0;width:794px;background:#fff;font-family:Arial,sans-serif;'
  div.innerHTML = `
    <div style="width:794px;padding:0;background:#fff;">
      <!-- Header -->
      <div style="background:#1D5CE3;padding:28px 40px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Branky STEM Labs</div>
          <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:4px;">Empowering Future Innovators</div>
        </div>
        <div style="text-align:right;">
          <div style="color:#FF931E;font-size:18px;font-weight:800;">FEE RECEIPT</div>
          <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:4px;">#FEE-${fee.id.padStart(4,'0')}</div>
          <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">${today}</div>
        </div>
      </div>

      <!-- Orange accent line -->
      <div style="height:4px;background:linear-gradient(90deg,#FF931E,#1D5CE3);"></div>

      <!-- Student info -->
      <div style="padding:28px 40px 20px;display:flex;gap:32px;">
        <div style="flex:1;">

          <div style="font-size:17px;font-weight:800;color:#0d0d0d;">${student.studentName}</div>
          <div style="font-size:13px;color:#64748b;margin-top:3px;">Parent / Guardian: ${student.parentName}</div>
          <div style="font-size:13px;color:#64748b;margin-top:2px;">Phone: ${student.phone}</div>
          <div style="font-size:13px;color:#64748b;margin-top:2px;">Age: ${student.age} &nbsp;·&nbsp; City: ${student.city}</div>
        </div>
        <div style="flex:1;">
          <div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;">Program Details</div>
          <div style="font-size:15px;font-weight:700;color:#1D5CE3;">${student.program}</div>
          <div style="font-size:13px;color:#64748b;margin-top:4px;">Source: ${student.source}</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="margin:0 40px;height:1px;background:#e2e8f0;"></div>

      <!-- Fee table -->
      <div style="padding:24px 40px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.07em;text-transform:uppercase;border-radius:8px 0 0 8px;">Description</th>
              <th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.07em;text-transform:uppercase;">Total Amount</th>
              <th style="padding:10px 14px;text-align:right;font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.07em;text-transform:uppercase;">Amount Paid</th>
              <th style="padding:10px 14px;text-align:center;font-size:10px;font-weight:700;color:#64748b;letter-spacing:0.07em;text-transform:uppercase;border-radius:0 8px 8px 0;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:14px 14px;font-size:14px;font-weight:600;color:#1e293b;">
                ${fee.label}
                <div style="font-size:11px;color:#94a3b8;margin-top:3px;">Due: ${fee.dueDate}${fee.paidDate ? ` &nbsp;·&nbsp; Paid: ${fee.paidDate}` : ''}</div>
              </td>
              <td style="padding:14px 14px;text-align:right;font-size:14px;font-weight:700;color:#0d0d0d;">${formatCurrency(fee.amount)}</td>
              <td style="padding:14px 14px;text-align:right;font-size:14px;font-weight:700;color:#065f46;">${formatCurrency(fee.paidAmount)}</td>
              <td style="padding:14px 14px;text-align:center;">
                <span style="padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;background:${statusBg[fee.status]??'#f1f5f9'};color:${statusColors[fee.status]??'#1e293b'};text-transform:uppercase;letter-spacing:0.05em;">${fee.status}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total box -->
      <div style="margin:0 40px 28px;background:#f8fafc;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border:1.5px solid #e2e8f0;">
        <div>
          <div style="font-size:11px;font-weight:700;color:#64748b;letter-spacing:0.06em;text-transform:uppercase;">Total Paid</div>
          <div style="font-size:26px;font-weight:800;color:#1D5CE3;margin-top:2px;">${formatCurrency(fee.paidAmount)}</div>
        </div>
        ${fee.status !== 'paid' ? `
        <div style="text-align:right;">
          <div style="font-size:11px;font-weight:700;color:#64748b;letter-spacing:0.06em;text-transform:uppercase;">Balance Due</div>
          <div style="font-size:22px;font-weight:800;color:#FF931E;margin-top:2px;">${formatCurrency(fee.amount - fee.paidAmount)}</div>
        </div>` : ''}
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;border-top:2px solid #e2e8f0;padding:18px 40px;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:12px;color:#64748b;">Thank you for being part of <strong style="color:#1D5CE3;">Branky STEM Labs</strong>!</div>
        <div style="font-size:12px;color:#64748b;">brankylabs.in</div>
      </div>
    </div>
  `

  document.body.appendChild(div)

  try {
    const canvas = await html2canvas(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false })
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgW = pageW - 20
    const imgH = (canvas.height * imgW) / canvas.width
    const yOffset = imgH < pageH - 20 ? (pageH - imgH) / 2 : 10
    pdf.addImage(imgData, 'JPEG', 10, yOffset, imgW, Math.min(imgH, pageH - 20))
    pdf.save(`Receipt-${student.studentName.replace(/\s+/g, '-')}-FEE${fee.id}.pdf`)
  } finally {
    document.body.removeChild(div)
  }
}

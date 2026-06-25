import type { InstallmentDTO, FeePlanDTO } from '@/models/FeePlan'
import type { StudentDTO } from '@/models/Student'

const fmt = (n: number) => `&#8377;${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export async function generateInstallmentReceipt(
  inst: InstallmentDTO,
  student: StudentDTO,
  plan: FeePlanDTO
): Promise<void> {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const receiptNo = `BSL-${plan.id}-${String(inst.installmentNumber).padStart(2, '0')}`

  const rows = plan.installments.map(i => {
    const isCurrent = i.id === inst.id
    const bg = isCurrent ? '#fff7ed' : i.status === 'paid' ? '#f0fdf4' : '#fff'
    const statusColor = i.status === 'paid' ? '#065f46' : i.dueDate < new Date().toISOString().split('T')[0] ? '#991b1b' : '#92400e'
    const statusBg   = i.status === 'paid' ? '#d1fae5' : i.dueDate < new Date().toISOString().split('T')[0] ? '#fee2e2' : '#fef3c7'
    return `
      <tr style="background:${bg};${isCurrent ? 'font-weight:700;' : ''}">
        <td style="padding:9px 12px;text-align:center;border-bottom:1px solid #e2e8f0;">${i.installmentNumber}</td>
        <td style="padding:9px 12px;border-bottom:1px solid #e2e8f0;">${i.label}${isCurrent ? ' <span style="font-size:10px;background:#FF931E;color:#fff;padding:1px 6px;border-radius:10px;vertical-align:middle;">THIS</span>' : ''}</td>
        <td style="padding:9px 12px;text-align:center;border-bottom:1px solid #e2e8f0;">${fmtDate(i.dueDate)}</td>
        <td style="padding:9px 12px;text-align:right;border-bottom:1px solid #e2e8f0;">${fmt(i.amount)}</td>
        <td style="padding:9px 12px;text-align:right;border-bottom:1px solid #e2e8f0;color:#065f46;font-weight:700;">${i.status === 'paid' ? fmt(i.paidAmount) : '—'}</td>
        <td style="padding:9px 12px;text-align:center;border-bottom:1px solid #e2e8f0;">${fmtDate(i.paidDate)}</td>
        <td style="padding:9px 12px;text-align:center;border-bottom:1px solid #e2e8f0;">
          <span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:800;text-transform:uppercase;background:${statusBg};color:${statusColor};">${i.status}</span>
        </td>
      </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Branky Fee Receipt</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Karla', Arial, sans-serif; background: #fff; color: #1e293b; font-size: 13px; }
    @media print {
      @page { margin: 0; size: A4 portrait; }
      .no-print { display: none !important; }
      body { padding: 12mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <!-- Print button -->
  <div class="no-print" style="background:#1D5CE3;padding:10px 20px;display:flex;align-items:center;justify-content:flex-end;">
    <button onclick="window.print()" style="padding:8px 20px;background:#FF931E;color:#fff;border:none;border-radius:8px;font-family:Karla,Arial,sans-serif;font-weight:700;font-size:14px;cursor:pointer;">🖨 Print / Save PDF</button>
  </div>

  <div style="max-width:750px;margin:0 auto;padding:24px 20px;">

    <!-- Header -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;">
      <tr>
        <td style="padding:20px 24px;background:#1D5CE3;vertical-align:middle;border-radius:12px 0 0 0;">
          <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Branky STEM Labs</div>
          <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:3px;">Empowering Future Innovators · brankystemlab.com</div>
        </td>
        <td style="padding:20px 24px;background:#1D5CE3;text-align:right;vertical-align:middle;border-radius:0 12px 0 0;">
          <div style="color:#FF931E;font-size:18px;font-weight:800;">FEE RECEIPT</div>
          <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:4px;">${receiptNo}</div>
          <div style="color:rgba(255,255,255,0.65);font-size:11px;margin-top:2px;">Printed: ${today}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="height:4px;background:linear-gradient(90deg,#FF931E,#1D5CE3);padding:0;"></td>
      </tr>
    </table>

    <!-- Student & Course info table -->
    <table style="width:100%;border-collapse:collapse;border:1.5px solid #e2e8f0;border-top:none;margin-bottom:20px;">
      <tr style="background:#f8fafc;">
        <td colspan="4" style="padding:6px 14px;font-size:10px;font-weight:800;color:#64748b;letter-spacing:0.07em;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">Student & Course Information</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;width:22%;border-bottom:1px solid #f1f5f9;">Student</td>
        <td style="padding:10px 14px;font-weight:700;color:#0d0d0d;width:28%;border-bottom:1px solid #f1f5f9;">${student.studentName}</td>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;width:22%;border-bottom:1px solid #f1f5f9;">Course</td>
        <td style="padding:10px 14px;font-weight:700;color:#1D5CE3;width:28%;border-bottom:1px solid #f1f5f9;">${plan.courseName}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #f1f5f9;">Parent</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">${student.parentName || '—'}</td>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #f1f5f9;">Duration</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">${plan.durationMonths} months</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #f1f5f9;">Phone</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">${student.phone}</td>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #f1f5f9;">Start Date</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">${fmtDate(plan.startDate)}</td>
      </tr>
      ${plan.discount > 0 ? `
      <tr>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Discount</td>
        <td style="padding:10px 14px;color:#065f46;font-weight:700;">&#8377;${Number(plan.discount).toLocaleString('en-IN')}</td>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Net Fee</td>
        <td style="padding:10px 14px;font-weight:700;color:#1D5CE3;">&#8377;${Number(plan.netFee).toLocaleString('en-IN')}</td>
      </tr>` : ''}
    </table>

    <!-- Instalments table -->
    <table style="width:100%;border-collapse:collapse;border:1.5px solid #e2e8f0;margin-bottom:20px;">
      <thead>
        <tr style="background:#1D5CE3;">
          <th style="padding:10px 12px;text-align:center;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;width:40px;">#</th>
          <th style="padding:10px 12px;text-align:left;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Description</th>
          <th style="padding:10px 12px;text-align:center;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Due Date</th>
          <th style="padding:10px 12px;text-align:right;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Amount</th>
          <th style="padding:10px 12px;text-align:right;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Paid</th>
          <th style="padding:10px 12px;text-align:center;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Paid On</th>
          <th style="padding:10px 12px;text-align:center;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <!-- Summary table -->
    <table style="width:100%;border-collapse:collapse;border:1.5px solid #e2e8f0;margin-bottom:24px;">
      <tr style="background:#f8fafc;">
        <td colspan="4" style="padding:6px 14px;font-size:10px;font-weight:800;color:#64748b;letter-spacing:0.07em;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">Payment Summary</td>
      </tr>
      <tr>
        <td style="padding:10px 20px;font-weight:600;color:#64748b;width:25%;border-bottom:1px solid #f1f5f9;">Course Fee</td>
        <td style="padding:10px 20px;font-weight:700;color:#0d0d0d;width:25%;border-bottom:1px solid #f1f5f9;">${fmt(plan.totalFee)}</td>
        <td style="padding:10px 20px;font-weight:600;color:#64748b;width:25%;border-bottom:1px solid #f1f5f9;">Monthly Amount</td>
        <td style="padding:10px 20px;font-weight:700;color:#0d0d0d;width:25%;border-bottom:1px solid #f1f5f9;">${fmt(plan.monthlyAmount)}</td>
      </tr>
      ${plan.discount > 0 ? `
      <tr>
        <td style="padding:10px 20px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;">Discount</td>
        <td style="padding:10px 20px;font-weight:700;color:#065f46;border-bottom:1px solid #f1f5f9;">− ${fmt(plan.discount)}</td>
        <td style="padding:10px 20px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;">Net Fee</td>
        <td style="padding:10px 20px;font-weight:700;color:#1D5CE3;border-bottom:1px solid #f1f5f9;">${fmt(plan.netFee)}</td>
      </tr>` : ''}
      <tr style="background:#eff6ff;">
        <td style="padding:12px 20px;font-weight:800;color:#0d0d0d;font-size:14px;">Total Paid</td>
        <td style="padding:12px 20px;font-weight:800;color:#065f46;font-size:16px;">${fmt(plan.totalPaid)}</td>
        <td style="padding:12px 20px;font-weight:800;color:#0d0d0d;font-size:14px;">${plan.totalRemaining > 0 ? 'Balance Due' : 'Fully Paid'}</td>
        <td style="padding:12px 20px;font-weight:800;font-size:16px;color:${plan.totalRemaining > 0 ? '#dc2626' : '#065f46'};">${plan.totalRemaining > 0 ? fmt(plan.totalRemaining) : '&#10003; Nil'}</td>
      </tr>
    </table>

    <!-- Footer -->
    <table style="width:100%;border-collapse:collapse;border-top:2px solid #e2e8f0;padding-top:12px;">
      <tr>
        <td style="padding:14px 0;color:#64748b;font-size:12px;">
          Thank you for being part of <strong style="color:#1D5CE3;">Branky STEM Labs</strong>! 🚀
        </td>
        <td style="padding:14px 0;text-align:right;color:#94a3b8;font-size:11px;">
          This is a computer-generated receipt. No signature required.
        </td>
      </tr>
    </table>

  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=800,height=900')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

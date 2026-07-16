import type { InstallmentDTO, FeePlanDTO } from '@/models/FeePlan'
import type { StudentDTO } from '@/models/Student'

const fmt = (n: number) => `&#8377;${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

// Accepts one installment or a group of installments covered by a single
// payment — the group prints as ONE receipt with the combined amount.
export async function generateInstallmentReceipt(
  instOrInsts: InstallmentDTO | InstallmentDTO[],
  student: StudentDTO,
  plan: FeePlanDTO
): Promise<void> {
  const insts = (Array.isArray(instOrInsts) ? [...instOrInsts] : [instOrInsts])
    .sort((a, b) => a.installmentNumber - b.installmentNumber)
  const first = insts[0]
  const last = insts[insts.length - 1]

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const receiptNo = `BSL-${plan.id}-${String(first.installmentNumber).padStart(2, '0')}`
  const logoUrl = `${window.location.origin}/assets/logo-main-2.png`

  const paidThis = insts.reduce((s, i) => s + (i.paidAmount > 0 ? i.paidAmount : i.amount), 0)
  const defaultDesc = insts.map(i => i.label).join(' + ')
  const description = window.prompt('Receipt description (custom text):', defaultDesc) || defaultDesc
  const instCell = insts.length > 1
    ? `${first.installmentNumber}&#8211;${last.installmentNumber} / ${plan.durationMonths}`
    : `${first.installmentNumber} / ${plan.durationMonths}`

  const paidSoFar = plan.totalPaid

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Receipt ${receiptNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Karla', Arial, sans-serif; background: #fff; color: #1e293b; font-size: 13px; }
    @media print {
      @page { margin: 0; size: A4 portrait; }
      .no-print { display: none !important; }
      body { padding: 10mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- Print button -->
  <div class="no-print" style="background:#1D5CE3;padding:10px 20px;display:flex;align-items:center;justify-content:flex-end;">
    <button onclick="window.print()" style="padding:8px 20px;background:#FF931E;color:#fff;border:none;border-radius:8px;font-family:Karla,Arial,sans-serif;font-weight:700;font-size:14px;cursor:pointer;">Print / Save PDF</button>
  </div>

  <div style="max-width:720px;margin:0 auto;padding:24px 20px;">

    <!-- Header -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;">
      <tr>
        <td style="padding:18px 24px;background:#1D5CE3;vertical-align:middle;border-radius:12px 0 0 0;">
          <img src="${logoUrl}" alt="Branky STEM Labs" style="height:80px;max-width:240px;object-fit:contain;filter:brightness(0) invert(1);display:block;" onerror="this.style.display='none';this.nextSibling.style.display='block'"/>
          <div style="display:none;color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">Branky STEM Labs</div>
          <div style="color:rgba(255,255,255,0.65);font-size:11px;margin-top:5px;">brankystemlab.com</div>
        </td>
        <td style="padding:18px 24px;background:#1D5CE3;text-align:right;vertical-align:middle;border-radius:0 12px 0 0;">
          <div style="color:#fff;font-size:20px;font-weight:800;letter-spacing:1px;">FEE RECEIPT</div>
          <div style="color:rgba(255,255,255,0.85);font-size:13px;font-weight:700;margin-top:5px;">${receiptNo}</div>
          <div style="color:rgba(255,255,255,0.6);font-size:11px;margin-top:3px;">Printed: ${today}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="height:4px;background:#FF931E;padding:0;"></td>
      </tr>
    </table>

    <!-- Student & Course info -->
    <table style="width:100%;border-collapse:collapse;border:1.5px solid #e2e8f0;border-top:none;margin-bottom:20px;">
      <!-- Billed To + Course side by side -->
      <tr>
        <td style="width:50%;padding:16px 20px;border-right:1px solid #e2e8f0;vertical-align:top;">

          <div style="font-size:18px;font-weight:800;color:#0d0d0d;line-height:1.2;">${student.studentName}</div>
          <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
            <span style="font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.05em;">Parents / Guardians:</span>
            <span style="font-size:14px;font-weight:700;color:#1D5CE3;">${student.parentName || '—'}</span>
          </div>
          <div style="margin-top:5px;font-size:12px;color:#64748b;"><span style="font-weight:700;color:#475569;">Contact No.:</span> ${student.phone}</div>
          ${student.city ? `<div style="font-size:12px;color:#64748b;margin-top:2px;"><span style="font-weight:700;color:#475569;">Address:</span> ${student.city}</div>` : ''}
        </td>
        <td style="width:50%;padding:16px 20px;vertical-align:top;background:#f8fafc;">
          <div style="font-size:10px;font-weight:800;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;">Course Details</div>
          <div style="font-size:15px;font-weight:800;color:#1D5CE3;line-height:1.3;">${plan.courseName}</div>
          <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px;">
            <div style="font-size:12px;color:#64748b;"><span style="font-weight:700;color:#475569;">Duration:</span> ${plan.durationMonths} months</div>
            <div style="font-size:12px;color:#64748b;"><span style="font-weight:700;color:#475569;">Start Date:</span> ${fmtDate(plan.startDate)}</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- This Installment -->
    <table style="width:100%;border-collapse:collapse;border:1.5px solid #e2e8f0;margin-bottom:20px;">
      <thead>
        <tr style="background:#1D5CE3;">
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Description</th>
          <th style="padding:10px 14px;text-align:center;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Instalment</th>
          <th style="padding:10px 14px;text-align:center;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Paid On</th>
          <th style="padding:10px 14px;text-align:right;color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Amount Paid</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:#fff7ed;">
          <td style="padding:14px;font-weight:700;color:#0d0d0d;">
            ${description}
            <div style="margin-top:4px;">
              <span style="font-size:10px;background:#FF931E;color:#fff;padding:2px 8px;border-radius:10px;font-weight:800;">CURRENT PAYMENT</span>
            </div>
            ${(first.paymentMethod || first.notes) ? `<div style="font-size:11px;color:#64748b;margin-top:4px;font-style:italic;">${[first.paymentMethod, first.notes].filter(Boolean).join(' &middot; ')}</div>` : ''}
          </td>
          <td style="padding:14px;text-align:center;font-weight:700;color:#1D5CE3;">${instCell}</td>
          <td style="padding:14px;text-align:center;font-weight:700;color:#065f46;">${fmtDate(first.paidDate)}</td>
          <td style="padding:14px;text-align:right;font-size:16px;font-weight:800;color:#065f46;">${fmt(paidThis)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Payment Summary -->
    <table style="width:100%;border-collapse:collapse;border:1.5px solid #e2e8f0;margin-bottom:24px;">
      <tr style="background:#f8fafc;">
        <td colspan="4" style="padding:6px 14px;font-size:10px;font-weight:800;color:#64748b;letter-spacing:0.07em;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">Payment Summary</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-weight:600;color:#64748b;width:25%;border-bottom:1px solid #f1f5f9;">Course Fee</td>
        <td style="padding:10px 16px;font-weight:700;color:#0d0d0d;width:25%;border-bottom:1px solid #f1f5f9;">${fmt(plan.totalFee)}</td>
        <td style="padding:10px 16px;font-weight:600;color:#64748b;width:25%;border-bottom:1px solid #f1f5f9;">Paid Amount</td>
        <td style="padding:10px 16px;font-weight:700;color:#065f46;width:25%;border-bottom:1px solid #f1f5f9;">${fmt(paidThis)}</td>
      </tr>
      ${plan.discount > 0 ? `
      <tr>
        <td style="padding:10px 16px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;">Discount</td>
        <td style="padding:10px 16px;font-weight:700;color:#065f46;border-bottom:1px solid #f1f5f9;">&#8722; ${fmt(plan.discount)}</td>
        <td style="padding:10px 16px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;">Net Fee</td>
        <td style="padding:10px 16px;font-weight:700;color:#1D5CE3;border-bottom:1px solid #f1f5f9;">${fmt(plan.netFee)}</td>
      </tr>` : ''}
      <tr style="background:#eff6ff;">
        <td style="padding:12px 16px;font-weight:800;color:#0d0d0d;font-size:14px;">Total Paid</td>
        <td colspan="3" style="padding:12px 16px;font-weight:800;color:#065f46;font-size:17px;">${fmt(paidSoFar)}</td>
      </tr>
    </table>

    <!-- Footer -->
    <table style="width:100%;border-collapse:collapse;border-top:2px solid #e2e8f0;">
      <tr>
        <td style="padding:14px 0;color:#64748b;font-size:12px;">
          Thank you for being part of <strong style="color:#1D5CE3;">Branky STEM Labs</strong>!
          <div style="margin-top:3px;font-size:11px;color:#94a3b8;">Email: <a href="mailto:brankystemlab@gmail.com" style="color:#1D5CE3;text-decoration:none;font-weight:700;">brankystemlab@gmail.com</a></div>
        </td>
        <td style="padding:14px 0;text-align:right;color:#94a3b8;font-size:11px;vertical-align:top;">
          Computer-generated receipt. No signature required.
        </td>
      </tr>
    </table>

  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`

  // Open via a Blob URL as a plain new tab — mobile browsers block
  // window.open with width/height features as a popup.
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (!win) {
    // Popup still blocked — trigger the tab through a real anchor click
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

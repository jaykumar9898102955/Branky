import { getPool } from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export type FeePlanStatus = 'active' | 'completed' | 'cancelled'

export interface FeePlanRow extends RowDataPacket {
  id: number
  student_id: number
  registration_id: number
  course_name: string
  total_fee: string
  discount: string
  duration_months: number
  monthly_amount: string
  start_date: Date | string
  notes: string | null
  status: FeePlanStatus
  created_at: Date
  // joined
  studentName?: string
  phone?: string
  program?: string
}

export interface InstallmentRow extends RowDataPacket {
  id: number
  registrationId: number
  fee_plan_id: number
  installment_number: number
  label: string
  amount: string
  dueDate: Date | string
  paidDate: Date | string | null
  status: 'pending' | 'paid' | 'partial'
  paidAmount: string
  payment_method: string | null
  notes: string | null
  reminderSent: number
  createdAt: Date
  updatedAt: Date
}

export interface InstallmentDTO {
  id: string
  feePlanId: string
  installmentNumber: number
  label: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: 'pending' | 'paid' | 'partial'
  paidAmount: number
  paymentMethod: string
  notes: string
}

export interface FeePlanDTO {
  id: string
  studentId: string
  registrationId: string
  courseName: string
  totalFee: number
  discount: number
  netFee: number
  durationMonths: number
  monthlyAmount: number
  startDate: string
  notes: string
  status: FeePlanStatus
  createdAt: string
  installments: InstallmentDTO[]
  // summary
  totalPaid: number
  totalRemaining: number
  paidCount: number
  studentName?: string
  phone?: string
  program?: string
}

export interface CreateFeePlanInput {
  studentId: number
  registrationId: number
  courseName?: string
  totalFee: number
  discount?: number
  durationMonths: number
  startDate: string
  notes?: string
}

function toDateStr(v: Date | string | null | undefined): string | null {
  if (v == null) return null
  if (v instanceof Date) return v.toISOString().split('T')[0]
  return String(v).split('T')[0]
}

function installmentToDTO(row: InstallmentRow): InstallmentDTO {
  return {
    id: String(row.id),
    feePlanId: String(row.fee_plan_id),
    installmentNumber: row.installment_number,
    label: row.label,
    amount: Number(row.amount),
    dueDate: toDateStr(row.dueDate) ?? '',
    paidDate: toDateStr(row.paidDate),
    status: row.status,
    paidAmount: Number(row.paidAmount),
    paymentMethod: row.payment_method ?? '',
    notes: row.notes ?? '',
  }
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split('T')[0]
}

export async function createFeePlan(data: CreateFeePlanInput): Promise<number> {
  const pool = getPool()
  const discount = data.discount ?? 0
  const net = data.totalFee - discount
  const monthly = Math.round((net / data.durationMonths) * 100) / 100

  const [planResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO fee_plans (student_id, registration_id, course_name, total_fee, discount, duration_months, monthly_amount, start_date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.studentId,
      data.registrationId,
      data.courseName ?? 'Program Fee',
      data.totalFee,
      discount,
      data.durationMonths,
      monthly,
      data.startDate,
      data.notes ?? null,
    ]
  )
  const planId = planResult.insertId

  for (let i = 0; i < data.durationMonths; i++) {
    const dueDate = addMonths(data.startDate, i)
    const label = `Month ${i + 1}/${data.durationMonths}`
    const amount = i === data.durationMonths - 1
      ? Math.round((net - monthly * (data.durationMonths - 1)) * 100) / 100
      : monthly
    await pool.query(
      `INSERT INTO fees (registrationId, fee_plan_id, installment_number, label, amount, dueDate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.registrationId, planId, i + 1, label, amount, dueDate]
    )
  }

  return planId
}

export async function getFeePlanById(planId: number): Promise<FeePlanDTO | null> {
  const pool = getPool()
  const [planRows] = await pool.query<FeePlanRow[]>(
    `SELECT fp.*, r.studentName, r.phone, r.program
     FROM fee_plans fp
     JOIN registrations r ON r.id = fp.registration_id
     WHERE fp.id = ? LIMIT 1`,
    [planId]
  )
  const plan = planRows[0]
  if (!plan) return null

  const [instRows] = await pool.query<InstallmentRow[]>(
    'SELECT * FROM fees WHERE fee_plan_id = ? ORDER BY installment_number ASC',
    [planId]
  )

  const installments = instRows.map(installmentToDTO)
  const totalPaid = installments.reduce((s, i) => s + i.paidAmount, 0)
  const totalFee = Number(plan.total_fee)
  const discount = Number(plan.discount ?? 0)
  const netFee = totalFee - discount
  const paidCount = installments.filter(i => i.status === 'paid').length

  return {
    id: String(plan.id),
    studentId: String(plan.student_id),
    registrationId: String(plan.registration_id),
    courseName: plan.course_name,
    totalFee,
    discount,
    netFee,
    durationMonths: plan.duration_months,
    monthlyAmount: Number(plan.monthly_amount),
    startDate: toDateStr(plan.start_date) ?? '',
    notes: plan.notes ?? '',
    status: plan.status,
    createdAt: plan.created_at instanceof Date ? plan.created_at.toISOString() : String(plan.created_at),
    installments,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalRemaining: Math.round((netFee - totalPaid) * 100) / 100,
    paidCount,
    studentName: plan.studentName,
    phone: plan.phone,
    program: plan.program,
  }
}

export async function getFeePlansByStudentId(studentId: number): Promise<FeePlanDTO[]> {
  const pool = getPool()
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM fee_plans WHERE student_id = ? ORDER BY created_at DESC',
    [studentId]
  )
  const plans = await Promise.all(rows.map(r => getFeePlanById(r.id as number)))
  return plans.filter((p): p is FeePlanDTO => p !== null)
}

// Backward-compat alias used by offline POST route
export async function getFeePlanByStudentId(studentId: number): Promise<FeePlanDTO | null> {
  const plans = await getFeePlansByStudentId(studentId)
  return plans[0] ?? null
}

export interface FeePlanSummaryRow extends RowDataPacket {
  id: number
  student_id: number
  registration_id: number
  course_name: string
  total_fee: string
  discount: string
  duration_months: number
  monthly_amount: string
  start_date: Date | string
  status: FeePlanStatus
  created_at: Date
  studentName: string
  phone: string
  program: string
  total_paid: string
  paid_count: number
}

export async function getAllFeePlans(): Promise<FeePlanSummaryRow[]> {
  const pool = getPool()
  const [rows] = await pool.query<FeePlanSummaryRow[]>(
    `SELECT fp.*,
            r.studentName, r.phone, r.program,
            COALESCE(SUM(f.paidAmount), 0) AS total_paid,
            SUM(f.status = 'paid') AS paid_count
     FROM fee_plans fp
     JOIN registrations r ON r.id = fp.registration_id
     LEFT JOIN fees f ON f.fee_plan_id = fp.id
     GROUP BY fp.id
     ORDER BY fp.created_at DESC`
  )
  return rows
}

// Apply a lump-sum payment across pending/partial installments in order.
// e.g. ₹10,000 on a ₹15,000/3-month plan → Month 1 paid, Month 2 paid.
export async function payAmount(
  planId: number,
  amount: number,
  paidDate: string,
  paymentNotes?: string,
  paymentMethod?: string
): Promise<void> {
  const pool = getPool()
  const [rows] = await pool.query<InstallmentRow[]>(
    `SELECT * FROM fees WHERE fee_plan_id = ? AND status != 'paid' ORDER BY installment_number ASC`,
    [planId]
  )

  let left = Math.round(amount * 100) / 100
  for (const row of rows) {
    if (left <= 0) break
    const due = Math.round((Number(row.amount) - Number(row.paidAmount)) * 100) / 100
    if (due <= 0) continue
    const pay = Math.min(due, left)
    left = Math.round((left - pay) * 100) / 100
    const newPaid = Math.round((Number(row.paidAmount) + pay) * 100) / 100
    const fullyPaid = newPaid >= Number(row.amount) - 0.009
    await pool.query(
      `UPDATE fees
       SET paidAmount = ?, status = ?, paidDate = ?,
           payment_method = COALESCE(NULLIF(?, ''), payment_method),
           notes = COALESCE(NULLIF(?, ''), notes)
       WHERE id = ?`,
      [newPaid, fullyPaid ? 'paid' : 'partial', paidDate, paymentMethod ?? '', paymentNotes ?? '', row.id]
    )
  }

  await pool.query(
    `UPDATE fee_plans fp
     SET fp.status = IF(
       (SELECT COUNT(*) FROM fees f WHERE f.fee_plan_id = fp.id AND f.status != 'paid') = 0,
       'completed', 'active'
     )
     WHERE fp.id = ?`,
    [planId]
  )
}

export async function payInstallments(
  installmentIds: number[],
  paidDate: string,
  paymentNotes?: string,
  paymentMethod?: string
): Promise<void> {
  const pool = getPool()
  for (const feeId of installmentIds) {
    await pool.query(
      `UPDATE fees
       SET status = 'paid', paidDate = ?, paidAmount = amount,
           payment_method = COALESCE(NULLIF(?, ''), payment_method),
           notes = COALESCE(NULLIF(?, ''), notes)
       WHERE id = ?`,
      [paidDate, paymentMethod ?? '', paymentNotes ?? '', feeId]
    )
  }
  // Auto-complete plan if all instalments paid
  if (installmentIds.length > 0) {
    const [row] = await pool.query<RowDataPacket[]>(
      'SELECT fee_plan_id FROM fees WHERE id = ? LIMIT 1',
      [installmentIds[0]]
    )
    const planId = row[0]?.fee_plan_id
    if (planId) {
      await pool.query(
        `UPDATE fee_plans fp
         SET fp.status = IF(
           (SELECT COUNT(*) FROM fees f WHERE f.fee_plan_id = fp.id AND f.status != 'paid') = 0,
           'completed', 'active'
         )
         WHERE fp.id = ?`,
        [planId]
      )
    }
  }
}

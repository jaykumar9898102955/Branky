import { getPool } from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export type FeeStatus = 'pending' | 'paid' | 'partial'

export interface FeeRow extends RowDataPacket {
  id: number
  registrationId: number
  label: string
  amount: string
  dueDate: Date | string
  paidDate: Date | string | null
  status: FeeStatus
  paidAmount: string
  notes: string | null
  reminderSent: number
  createdAt: Date
  updatedAt: Date
}

export interface FeeWithStudentRow extends FeeRow {
  studentName: string
  parentName: string
  phone: string
  program: string
  city: string
}

export interface FeeDTO {
  id: string
  registrationId: string
  label: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: FeeStatus
  paidAmount: number
  notes: string
  reminderSent: boolean
  createdAt: string
  updatedAt: string
  studentName?: string
  parentName?: string
  phone?: string
  program?: string
  city?: string
}

export interface CreateFeeInput {
  registrationId: number
  label?: string
  amount: number
  dueDate: string
  notes?: string
}

export interface UpdateFeeInput {
  label?: string
  amount?: number
  dueDate?: string
  paidDate?: string | null
  status?: FeeStatus
  paidAmount?: number
  notes?: string
}

export interface FeeStats {
  total: number
  totalAmount: number
  totalCollected: number
  totalPending: number
  overdueCount: number
}

function toDateStr(v: Date | string | null | undefined): string | null {
  if (v == null) return null
  if (v instanceof Date) return v.toISOString().split('T')[0]
  return String(v).split('T')[0]
}

export function feeToDTO(row: FeeRow & Partial<FeeWithStudentRow>): FeeDTO {
  return {
    id: String(row.id),
    registrationId: String(row.registrationId),
    label: row.label,
    amount: Number(row.amount),
    dueDate: toDateStr(row.dueDate) ?? '',
    paidDate: toDateStr(row.paidDate),
    status: row.status,
    paidAmount: Number(row.paidAmount),
    notes: row.notes ?? '',
    reminderSent: Boolean(row.reminderSent),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
    studentName: row.studentName,
    parentName: row.parentName,
    phone: row.phone,
    program: row.program,
    city: row.city,
  }
}

export async function createFee(data: CreateFeeInput): Promise<number> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO fees (registrationId, label, amount, dueDate, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [data.registrationId, data.label ?? 'Program Fee', data.amount, data.dueDate, data.notes ?? null]
  )
  return result.insertId
}

export async function findFeesByRegistration(registrationId: number): Promise<FeeRow[]> {
  const pool = getPool()
  const [rows] = await pool.query<FeeRow[]>(
    'SELECT * FROM fees WHERE registrationId = ? ORDER BY dueDate DESC',
    [registrationId]
  )
  return rows
}

export interface FindAllFeesFilter {
  registrationId?: number
  status?: string
  search?: string
}

export async function findAllFeesWithStudent(filter: FindAllFeesFilter = {}): Promise<FeeWithStudentRow[]> {
  const pool = getPool()
  const where: string[] = []
  const params: any[] = []

  if (filter.registrationId) {
    where.push('f.registrationId = ?')
    params.push(filter.registrationId)
  }
  if (filter.status && filter.status !== 'all') {
    where.push('f.status = ?')
    params.push(filter.status)
  }
  if (filter.search) {
    where.push('(r.studentName LIKE ? OR r.phone LIKE ? OR r.program LIKE ?)')
    const like = `%${filter.search}%`
    params.push(like, like, like)
  }

  const sql =
    `SELECT f.*, r.studentName, r.parentName, r.phone, r.program, r.city
     FROM fees f
     JOIN registrations r ON r.id = f.registrationId` +
    (where.length ? ' WHERE ' + where.join(' AND ') : '') +
    ' ORDER BY f.dueDate ASC'

  const [rows] = await pool.query<FeeWithStudentRow[]>(sql, params)
  return rows
}

export async function getFeeById(id: number): Promise<FeeWithStudentRow | null> {
  const pool = getPool()
  const [rows] = await pool.query<FeeWithStudentRow[]>(
    `SELECT f.*, r.studentName, r.parentName, r.phone, r.program, r.city
     FROM fees f
     JOIN registrations r ON r.id = f.registrationId
     WHERE f.id = ? LIMIT 1`,
    [id]
  )
  return rows[0] ?? null
}

const UPDATABLE_FIELDS = ['label', 'amount', 'dueDate', 'paidDate', 'status', 'paidAmount', 'notes'] as const

export async function updateFee(id: number, patch: UpdateFeeInput): Promise<FeeRow | null> {
  const pool = getPool()
  const sets: string[] = []
  const params: any[] = []

  for (const field of UPDATABLE_FIELDS) {
    if ((patch as any)[field] !== undefined) {
      sets.push(`${field} = ?`)
      params.push((patch as any)[field])
    }
  }

  if (sets.length > 0) {
    params.push(id)
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE fees SET ${sets.join(', ')} WHERE id = ?`,
      params
    )
    if (result.affectedRows === 0) return null
  }

  const [rows] = await pool.query<FeeRow[]>('SELECT * FROM fees WHERE id = ? LIMIT 1', [id])
  return rows[0] ?? null
}

export async function deleteFee(id: number): Promise<boolean> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM fees WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function markReminderSent(id: number): Promise<void> {
  const pool = getPool()
  await pool.query('UPDATE fees SET reminderSent = 1 WHERE id = ?', [id])
}

export async function getFeeStats(): Promise<FeeStats> {
  const pool = getPool()
  const today = new Date().toISOString().split('T')[0]

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      COUNT(*) AS total,
      COALESCE(SUM(amount), 0) AS totalAmount,
      COALESCE(SUM(paidAmount), 0) AS totalCollected,
      COALESCE(SUM(CASE WHEN status != 'paid' THEN amount - paidAmount ELSE 0 END), 0) AS totalPending,
      SUM(CASE WHEN status != 'paid' AND dueDate < ? THEN 1 ELSE 0 END) AS overdueCount
     FROM fees`,
    [today]
  )
  const r = rows[0]
  return {
    total: Number(r?.total ?? 0),
    totalAmount: Number(r?.totalAmount ?? 0),
    totalCollected: Number(r?.totalCollected ?? 0),
    totalPending: Number(r?.totalPending ?? 0),
    overdueCount: Number(r?.overdueCount ?? 0),
  }
}

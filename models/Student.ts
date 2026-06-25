import { getPool } from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export type StudentStatus = 'current' | 'past'

export interface StudentRow extends RowDataPacket {
  id: number
  registration_id: number
  status: StudentStatus
  join_date: Date | string
  end_date: Date | string | null
  notes: string | null
  created_at: Date
  updated_at: Date
  // joined from registrations
  studentName: string
  parentName: string
  phone: string
  age: string
  program: string
  city: string
  source: string
  reg_status: string
  // fee summary (from subqueries)
  fee_paid: string
  fee_total: string
  fee_course: string | null
  has_overdue: number
}

export interface StudentDTO {
  id: string
  registrationId: string
  status: StudentStatus
  joinDate: string
  endDate: string | null
  notes: string
  createdAt: string
  // from registration
  studentName: string
  parentName: string
  phone: string
  age: string
  program: string
  city: string
  source: string
  // fee summary
  feePaid: number
  feeTotal: number
  feeCourse: string | null
  hasOverdue: boolean
}

export interface StudentStats {
  total: number
  current: number
  past: number
}

function toDateStr(v: Date | string | null | undefined): string | null {
  if (v == null) return null
  if (v instanceof Date) return v.toISOString().split('T')[0]
  return String(v).split('T')[0]
}

export function studentToDTO(row: StudentRow): StudentDTO {
  return {
    id: String(row.id),
    registrationId: String(row.registration_id),
    status: row.status,
    joinDate: toDateStr(row.join_date) ?? '',
    endDate: toDateStr(row.end_date),
    notes: row.notes ?? '',
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    studentName: row.studentName,
    parentName: row.parentName,
    phone: row.phone,
    age: row.age,
    program: row.program,
    city: row.city,
    source: row.source,
    feePaid: Number(row.fee_paid ?? 0),
    feeTotal: Number(row.fee_total ?? 0),
    feeCourse: row.fee_course ?? null,
    hasOverdue: Number(row.has_overdue ?? 0) > 0,
  }
}

const JOIN_REG = `
  SELECT s.*, r.studentName, r.parentName, r.phone, r.age, r.program, r.city, r.source,
         r.status AS reg_status,
         COALESCE((SELECT SUM(f.paidAmount) FROM fees f JOIN fee_plans fp ON f.fee_plan_id = fp.id WHERE fp.student_id = s.id), 0) AS fee_paid,
         COALESCE((SELECT SUM(fp2.total_fee - fp2.discount) FROM fee_plans fp2 WHERE fp2.student_id = s.id), 0) AS fee_total,
         (SELECT fp3.course_name FROM fee_plans fp3 WHERE fp3.student_id = s.id ORDER BY fp3.created_at DESC LIMIT 1) AS fee_course,
         (SELECT COUNT(*) FROM fees f4 JOIN fee_plans fp4 ON f4.fee_plan_id = fp4.id WHERE fp4.student_id = s.id AND f4.status != 'paid' AND f4.dueDate < CURDATE()) AS has_overdue
  FROM students s
  JOIN registrations r ON r.id = s.registration_id`

export type StudentsFilter = { status?: 'current' | 'past' | 'all'; search?: string }

export async function getAllStudents(filter: StudentsFilter = {}): Promise<StudentRow[]> {
  const pool = getPool()
  const where: string[] = []
  const params: any[] = []

  if (filter.status && filter.status !== 'all') {
    where.push('s.status = ?')
    params.push(filter.status)
  }
  if (filter.search) {
    where.push('(r.studentName LIKE ? OR r.phone LIKE ? OR r.program LIKE ?)')
    const like = `%${filter.search}%`
    params.push(like, like, like)
  }

  const sql = JOIN_REG + (where.length ? ' WHERE ' + where.join(' AND ') : '') + ' ORDER BY s.created_at DESC'
  const [rows] = await pool.query<StudentRow[]>(sql, params)
  return rows
}

export async function getStudentById(id: number): Promise<StudentRow | null> {
  const pool = getPool()
  const [rows] = await pool.query<StudentRow[]>(JOIN_REG + ' WHERE s.id = ? LIMIT 1', [id])
  return rows[0] ?? null
}

export async function getStudentByRegistrationId(registrationId: number): Promise<StudentRow | null> {
  const pool = getPool()
  const [rows] = await pool.query<StudentRow[]>(JOIN_REG + ' WHERE s.registration_id = ? LIMIT 1', [registrationId])
  return rows[0] ?? null
}

export async function createStudent(registrationId: number, joinDate: string): Promise<number> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO students (registration_id, join_date) VALUES (?, ?)',
    [registrationId, joinDate]
  )
  return result.insertId
}

export interface UpdateStudentInput {
  status?: StudentStatus
  endDate?: string | null
  notes?: string
  // registration fields
  studentName?: string
  parentName?: string
  phone?: string
  program?: string
  joinDate?: string
}

export async function updateStudent(id: number, patch: UpdateStudentInput): Promise<StudentRow | null> {
  const pool = getPool()

  const stuSets: string[] = []
  const stuParams: any[] = []
  if (patch.status !== undefined) { stuSets.push('status = ?'); stuParams.push(patch.status) }
  if (patch.endDate !== undefined) { stuSets.push('end_date = ?'); stuParams.push(patch.endDate) }
  if (patch.notes !== undefined) { stuSets.push('notes = ?'); stuParams.push(patch.notes) }
  if (patch.joinDate !== undefined) { stuSets.push('join_date = ?'); stuParams.push(patch.joinDate) }
  if (stuSets.length > 0) {
    stuParams.push(id)
    await pool.query<ResultSetHeader>(`UPDATE students SET ${stuSets.join(', ')} WHERE id = ?`, stuParams)
  }

  const regSets: string[] = []
  const regParams: any[] = []
  if (patch.studentName !== undefined) { regSets.push('studentName = ?'); regParams.push(patch.studentName) }
  if (patch.parentName !== undefined) { regSets.push('parentName = ?'); regParams.push(patch.parentName) }
  if (patch.phone !== undefined) { regSets.push('phone = ?'); regParams.push(patch.phone) }
  if (patch.program !== undefined) { regSets.push('program = ?'); regParams.push(patch.program) }
  if (regSets.length > 0) {
    regParams.push(id)
    await pool.query<ResultSetHeader>(
      `UPDATE registrations r JOIN students s ON s.registration_id = r.id SET ${regSets.join(', ')} WHERE s.id = ?`,
      regParams
    )
  }

  return getStudentById(id)
}

export async function deleteStudent(id: number): Promise<boolean> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM students WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function getStudentStats(): Promise<StudentStats> {
  const pool = getPool()
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'current') AS current_count,
       SUM(status = 'past') AS past_count
     FROM students`
  )
  const r = rows[0]
  return {
    total: Number(r?.total ?? 0),
    current: Number(r?.current_count ?? 0),
    past: Number(r?.past_count ?? 0),
  }
}

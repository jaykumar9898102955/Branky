import { getPool } from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export type RegistrationStatus = 'new' | 'reviewed' | 'confirmed' | 'waitlist'

export interface RegistrationRow extends RowDataPacket {
  id: number
  studentName: string
  parentName: string
  phone: string
  email: string
  age: string
  program: string
  city: string
  source: string
  message: string | null
  status: RegistrationStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface RegistrationDTO {
  _id: string
  id: number
  studentName: string
  parentName: string
  phone: string
  email: string
  age: string
  program: string
  city: string
  source: string
  message: string
  status: RegistrationStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export function toDTO(row: RegistrationRow): RegistrationDTO {
  return {
    _id: String(row.id),
    id: row.id,
    studentName: row.studentName,
    parentName: row.parentName,
    phone: row.phone,
    email: row.email,
    age: row.age,
    program: row.program,
    city: row.city,
    source: row.source,
    message: row.message ?? '',
    status: row.status,
    notes: row.notes ?? '',
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
  }
}

export interface CreateInput {
  studentName: string
  parentName: string
  phone: string
  email: string
  age: string
  program: string
  city: string
  source?: string
  message?: string
}

export async function findByEmailAndProgram(email: string, program: string): Promise<RegistrationRow | null> {
  const pool = getPool()
  const [rows] = await pool.query<RegistrationRow[]>(
    'SELECT * FROM registrations WHERE email = ? AND program = ? LIMIT 1',
    [email, program]
  )
  return rows[0] ?? null
}

export async function createRegistration(data: CreateInput): Promise<number> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO registrations
      (studentName, parentName, phone, email, age, program, city, source, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.studentName,
      data.parentName,
      data.phone,
      data.email,
      data.age,
      data.program,
      data.city,
      data.source || 'Website',
      data.message || '',
    ]
  )
  return result.insertId
}

export interface FindAllFilter {
  status?: string
  search?: string
}

export async function findAllRegistrations(filter: FindAllFilter): Promise<RegistrationRow[]> {
  const pool = getPool()
  const where: string[] = []
  const params: any[] = []

  if (filter.status && filter.status !== 'all') {
    where.push('status = ?')
    params.push(filter.status)
  }
  if (filter.search) {
    where.push('(studentName LIKE ? OR email LIKE ? OR city LIKE ? OR program LIKE ?)')
    const like = `%${filter.search}%`
    params.push(like, like, like, like)
  }

  const sql =
    'SELECT * FROM registrations' +
    (where.length ? ' WHERE ' + where.join(' AND ') : '') +
    ' ORDER BY createdAt DESC'

  const [rows] = await pool.query<RegistrationRow[]>(sql, params)
  return rows
}

export interface Stats {
  total: number
  new: number
  confirmed: number
  waitlist: number
}

export async function getStats(): Promise<Stats> {
  const pool = getPool()
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT status, COUNT(*) AS c FROM registrations GROUP BY status`
  )
  const [totalRows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM registrations'
  )

  const stats: Stats = { total: Number(totalRows[0]?.total ?? 0), new: 0, confirmed: 0, waitlist: 0 }
  for (const r of rows) {
    if (r.status === 'new') stats.new = Number(r.c)
    else if (r.status === 'confirmed') stats.confirmed = Number(r.c)
    else if (r.status === 'waitlist') stats.waitlist = Number(r.c)
  }
  return stats
}

const UPDATABLE_FIELDS = [
  'studentName',
  'parentName',
  'phone',
  'email',
  'age',
  'program',
  'city',
  'source',
  'message',
  'status',
  'notes',
] as const

export async function updateRegistration(
  id: number,
  patch: Record<string, any>
): Promise<RegistrationRow | null> {
  const pool = getPool()
  const sets: string[] = []
  const params: any[] = []

  for (const field of UPDATABLE_FIELDS) {
    if (patch[field] !== undefined) {
      sets.push(`${field} = ?`)
      params.push(patch[field])
    }
  }

  if (sets.length > 0) {
    params.push(id)
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE registrations SET ${sets.join(', ')} WHERE id = ?`,
      params
    )
    if (result.affectedRows === 0) return null
  }

  const [rows] = await pool.query<RegistrationRow[]>(
    'SELECT * FROM registrations WHERE id = ? LIMIT 1',
    [id]
  )
  return rows[0] ?? null
}

export async function deleteRegistration(id: number): Promise<boolean> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM registrations WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

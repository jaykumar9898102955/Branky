import { getPool } from '@/lib/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export interface ProgramRow extends RowDataPacket {
  id: number
  name: string
  duration_months: number
  is_active: number
  created_at: Date
  updated_at: Date
}

export interface ProgramDTO {
  id: string
  name: string
  durationMonths: number
  isActive: boolean
}

function programToDTO(row: ProgramRow): ProgramDTO {
  return {
    id: String(row.id),
    name: row.name,
    durationMonths: row.duration_months,
    isActive: !!row.is_active,
  }
}

export async function getAllPrograms(activeOnly = false): Promise<ProgramDTO[]> {
  const pool = getPool()
  const sql = activeOnly
    ? 'SELECT * FROM programs WHERE is_active = 1 ORDER BY name ASC'
    : 'SELECT * FROM programs ORDER BY name ASC'
  const [rows] = await pool.query<ProgramRow[]>(sql)
  return rows.map(programToDTO)
}

export interface CreateProgramInput {
  name: string
  durationMonths: number
}

export async function createProgram(data: CreateProgramInput): Promise<number> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO programs (name, duration_months) VALUES (?, ?)',
    [data.name, data.durationMonths]
  )
  return result.insertId
}

export interface UpdateProgramInput {
  name?: string
  durationMonths?: number
  isActive?: boolean
}

export async function updateProgram(id: number, patch: UpdateProgramInput): Promise<void> {
  const pool = getPool()
  const sets: string[] = []
  const params: any[] = []
  if (patch.name !== undefined) { sets.push('name = ?'); params.push(patch.name) }
  if (patch.durationMonths !== undefined) { sets.push('duration_months = ?'); params.push(patch.durationMonths) }
  if (patch.isActive !== undefined) { sets.push('is_active = ?'); params.push(patch.isActive ? 1 : 0) }
  if (sets.length === 0) return
  params.push(id)
  await pool.query<ResultSetHeader>(`UPDATE programs SET ${sets.join(', ')} WHERE id = ?`, params)
}

export async function deleteProgram(id: number): Promise<boolean> {
  const pool = getPool()
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM programs WHERE id = ?', [id])
  return result.affectedRows > 0
}

import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB, { getPool } from '@/lib/db'
import { ResultSetHeader } from 'mysql2'
import {
  getAllStudents, createStudent, getStudentById,
  getStudentByRegistrationId, getStudentStats, studentToDTO,
  StudentsFilter,
} from '@/models/Student'
import { createFeePlan } from '@/models/FeePlan'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { searchParams } = new URL(req.url)
  const filter: StudentsFilter = {
    status: (searchParams.get('status') ?? 'all') as StudentsFilter['status'],
    search: searchParams.get('search') ?? undefined,
  }

  const [rows, stats] = await Promise.all([getAllStudents(filter), getStudentStats()])
  return NextResponse.json({ students: rows.map(studentToDTO), stats })
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const body = await req.json()
  const date = body.joinDate ?? new Date().toISOString().split('T')[0]

  // ── Offline student: create registration + student in one shot ──
  if (body.offline) {
    const { studentName, parentName, phone, age, program, city } = body
    if (!studentName || !phone || !program) {
      return NextResponse.json({ error: 'studentName, phone and program are required' }, { status: 400 })
    }
    const pool = getPool()
    const [regResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO registrations (studentName, parentName, phone, age, program, city, source, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Offline', 'confirmed')`,
      [studentName, parentName ?? '', phone, age ?? '', program, city ?? '']
    )
    const registrationId = regResult.insertId
    const studentId = await createStudent(registrationId, date)

    // Optionally create fee plan in the same request
    if (body.feeData) {
      const { feeCourse, feeMonths, feeTotalFee, feeDiscount, feeStartDate, feeNotes } = body.feeData
      if (feeCourse && feeTotalFee && feeMonths) {
        await createFeePlan({
          studentId,
          registrationId,
          courseName: feeCourse,
          totalFee: Number(feeTotalFee),
          discount: feeDiscount ? Number(feeDiscount) : 0,
          durationMonths: Number(feeMonths),
          startDate: feeStartDate ?? date,
          notes: feeNotes,
        })
      }
    }

    const student = await getStudentById(studentId)
    return NextResponse.json({ success: true, student: studentToDTO(student!) }, { status: 201 })
  }

  // ── Promote existing registration to student ──
  const { registrationId } = body
  if (!registrationId) return NextResponse.json({ error: 'registrationId required' }, { status: 400 })

  const existing = await getStudentByRegistrationId(Number(registrationId))
  if (existing) {
    return NextResponse.json({ student: studentToDTO(existing), alreadyExists: true })
  }

  const id = await createStudent(Number(registrationId), date)
  const student = await getStudentById(id)
  return NextResponse.json({ success: true, student: studentToDTO(student!) }, { status: 201 })
}

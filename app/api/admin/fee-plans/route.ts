import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB from '@/lib/db'
import { getAllFeePlans, createFeePlan, getFeePlanById } from '@/models/FeePlan'
import { getStudentById, updateStudent } from '@/models/Student'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const rows = await getAllFeePlans()
  const plans = rows.map(r => ({
    id: String(r.id),
    studentId: String(r.student_id),
    registrationId: String(r.registration_id),
    courseName: r.course_name,
    totalFee: Number(r.total_fee),
    discount: Number(r.discount ?? 0),
    netFee: Number(r.total_fee) - Number(r.discount ?? 0),
    durationMonths: r.duration_months,
    monthlyAmount: Number(r.monthly_amount),
    startDate: r.start_date instanceof Date ? r.start_date.toISOString().split('T')[0] : String(r.start_date).split('T')[0],
    status: r.status,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    studentName: r.studentName,
    phone: r.phone,
    program: r.program,
    totalPaid: Number(r.total_paid),
    paidCount: Number(r.paid_count),
    totalRemaining: Math.round((Number(r.total_fee) - Number(r.discount ?? 0) - Number(r.total_paid)) * 100) / 100,
  }))

  const totalCollected = plans.reduce((s, p) => s + p.totalPaid, 0)
  const totalOutstanding = plans.reduce((s, p) => s + p.totalRemaining, 0)
  return NextResponse.json({ plans, stats: { total: plans.length, totalCollected, totalOutstanding } })
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const body = await req.json()
  const { studentId, registrationId, totalFee, durationMonths, startDate, courseName, notes, discount } = body

  if (!studentId || !registrationId || !totalFee || !durationMonths || !startDate) {
    return NextResponse.json({ error: 'studentId, registrationId, totalFee, durationMonths, startDate are required' }, { status: 400 })
  }

  const planId = await createFeePlan({
    studentId: Number(studentId),
    registrationId: Number(registrationId),
    totalFee: Number(totalFee),
    discount: discount ? Number(discount) : 0,
    durationMonths: Number(durationMonths),
    startDate,
    courseName,
    notes,
  })

  // Auto-set student back to current if they were past (new course enrolled)
  const student = await getStudentById(Number(studentId))
  if (student?.status === 'past') {
    await updateStudent(Number(studentId), { status: 'current', endDate: null })
  }

  const plan = await getFeePlanById(planId)
  return NextResponse.json({ success: true, plan }, { status: 201 })
}

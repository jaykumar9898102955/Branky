import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB from '@/lib/db'
import { getStudentById, updateStudent, deleteStudent, studentToDTO } from '@/models/Student'
import { getFeePlansByStudentId } from '@/models/FeePlan'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const student = await getStudentById(Number(id))
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const feePlans = await getFeePlansByStudentId(Number(id))
  return NextResponse.json({ student: studentToDTO(student), feePlans })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const body = await req.json()
  const updated = await updateStudent(Number(id), {
    status: body.status,
    endDate: body.endDate,
    notes: body.notes,
    studentName: body.studentName,
    parentName: body.parentName,
    phone: body.phone,
    program: body.program,
    joinDate: body.joinDate,
  })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, student: studentToDTO(updated) })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const ok = await deleteStudent(Number(id))
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

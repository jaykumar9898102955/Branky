import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB from '@/lib/db'
import { payInstallments, getFeePlanById } from '@/models/FeePlan'
import { updateStudent } from '@/models/Student'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const { installmentIds, paidDate, paymentNotes } = await req.json()

  if (!installmentIds?.length) {
    return NextResponse.json({ error: 'installmentIds array required' }, { status: 400 })
  }
  const date = paidDate ?? new Date().toISOString().split('T')[0]
  await payInstallments(installmentIds.map(Number), date, paymentNotes)

  const plan = await getFeePlanById(Number(id))
  // When all instalments are paid, auto-mark the student as past
  if (plan?.status === 'completed') {
    await updateStudent(Number(plan.studentId), { status: 'past', endDate: date })
  }
  return NextResponse.json({ success: true, plan })
}

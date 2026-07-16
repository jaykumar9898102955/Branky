import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB from '@/lib/db'
import { payInstallments, payAmount, getFeePlanById } from '@/models/FeePlan'
import { updateStudent } from '@/models/Student'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const { installmentIds, amount, paidDate, paymentNotes, paymentMethod } = await req.json()

  const date = paidDate ?? new Date().toISOString().split('T')[0]

  if (amount != null && Number(amount) > 0) {
    // Lump-sum payment spread across pending installments in order
    await payAmount(Number(id), Number(amount), date, paymentNotes, paymentMethod)
  } else if (installmentIds?.length) {
    await payInstallments(installmentIds.map(Number), date, paymentNotes, paymentMethod)
  } else {
    return NextResponse.json({ error: 'installmentIds array or amount required' }, { status: 400 })
  }

  const plan = await getFeePlanById(Number(id))
  // When all instalments are paid, auto-mark the student as past
  if (plan?.status === 'completed') {
    await updateStudent(Number(plan.studentId), { status: 'past', endDate: date })
  }
  return NextResponse.json({ success: true, plan })
}

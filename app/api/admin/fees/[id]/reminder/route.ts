import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getFeeById, markReminderSent } from '@/models/Fee'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const fee = await getFeeById(Number(id))
    if (!fee) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const digits = (fee.phone || '').replace(/\D/g, '')
    const phone = digits.startsWith('91') ? digits : `91${digits}`

    const dueStr = fee.dueDate instanceof Date
      ? fee.dueDate.toLocaleDateString('en-IN')
      : String(fee.dueDate).split('T')[0]

    const message = `Hi ${fee.parentName}! Friendly reminder from Branky STEM Labs.\n\n${fee.studentName}'s ${fee.label} of ₹${Number(fee.amount).toLocaleString('en-IN')} is due on ${dueStr}.\n\nPlease contact us to complete your payment.\n🌐 brankylabs.in\n\nThank you! 🙏`

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    await markReminderSent(Number(id))

    return NextResponse.json({ success: true, whatsappUrl })
  } catch (err) {
    console.error('Admin fees reminder error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

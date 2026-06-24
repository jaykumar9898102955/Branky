import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { findAllFeesWithStudent, getFeeStats, createFee, feeToDTO } from '@/models/Fee'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const registrationId = searchParams.get('registrationId')
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    const rows = await findAllFeesWithStudent({
      registrationId: registrationId ? Number(registrationId) : undefined,
      status,
      search,
    })
    const stats = await getFeeStats()

    return NextResponse.json({ fees: rows.map(feeToDTO), stats })
  } catch (err) {
    console.error('Admin fees GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const { registrationId, label, amount, dueDate, notes } = body

    if (!registrationId || !amount || !dueDate) {
      return NextResponse.json({ error: 'registrationId, amount, and dueDate are required' }, { status: 400 })
    }

    const id = await createFee({ registrationId: Number(registrationId), label, amount: Number(amount), dueDate, notes })
    const rows = await findAllFeesWithStudent({ registrationId: Number(registrationId) })
    const created = rows.find(r => r.id === id)
    if (!created) return NextResponse.json({ error: 'Created but not found' }, { status: 500 })

    return NextResponse.json({ success: true, fee: feeToDTO(created) }, { status: 201 })
  } catch (err) {
    console.error('Admin fees POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

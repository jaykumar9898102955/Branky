import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getFeeById, updateFee, deleteFee, feeToDTO } from '@/models/Fee'
import { findAllRegistrations, toDTO } from '@/models/Registration'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const fee = await getFeeById(Number(id))
    if (!fee) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const regs = await findAllRegistrations({ status: undefined, search: undefined })
    const student = regs.find(r => r.id === fee.registrationId)

    return NextResponse.json({
      fee: feeToDTO(fee),
      student: student ? toDTO(student) : null,
    })
  } catch (err) {
    console.error('Admin fees GET[id] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const body = await req.json()
    const updated = await updateFee(Number(id), body)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, fee: feeToDTO(updated) })
  } catch (err) {
    console.error('Admin fees PATCH error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await connectDB()
    const ok = await deleteFee(Number(id))
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin fees DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

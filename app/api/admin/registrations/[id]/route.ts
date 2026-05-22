import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Registration from '@/models/Registration'
import { isAuthenticated } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const reg = await Registration.findByIdAndUpdate(params.id, body, { new: true })
    if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, registration: reg })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    await Registration.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

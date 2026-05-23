import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { updateRegistration, deleteRegistration, toDTO } from '@/models/Registration'
import { isAuthenticated } from '@/lib/auth'

function parseId(raw: string): number | null {
  const n = Number(raw)
  if (!Number.isInteger(n) || n <= 0) return null
  return n
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseId(params.id)
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  try {
    await connectDB()
    const body = await req.json()
    const row = await updateRegistration(id, body)
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, registration: toDTO(row) })
  } catch (err) {
    console.error('Admin PATCH error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseId(params.id)
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  try {
    await connectDB()
    const ok = await deleteRegistration(id)
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

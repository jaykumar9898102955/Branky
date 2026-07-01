import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB from '@/lib/db'
import { updateProgram, deleteProgram } from '@/models/Program'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const body = await req.json()
  const { name, durationMonths, isActive } = body

  await updateProgram(Number(id), {
    name,
    durationMonths: durationMonths !== undefined ? Number(durationMonths) : undefined,
    isActive,
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const ok = await deleteProgram(Number(id))
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

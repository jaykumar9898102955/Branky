import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB, { getPool } from '@/lib/db'
import { getFeePlanById } from '@/models/FeePlan'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const plan = await getFeePlanById(Number(id))
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ plan })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const { id } = await params
  const pool = getPool()
  await pool.query('DELETE FROM fee_plans WHERE id = ?', [Number(id)])
  return NextResponse.json({ success: true })
}

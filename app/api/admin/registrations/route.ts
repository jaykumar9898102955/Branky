import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { findAllRegistrations, getStats, toDTO } from '@/models/Registration'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    const rows = await findAllRegistrations({ status, search })
    const stats = await getStats()

    return NextResponse.json({
      registrations: rows.map(toDTO),
      stats,
    })
  } catch (err) {
    console.error('Admin registrations error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

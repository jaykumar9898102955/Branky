import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Registration from '@/models/Registration'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const filter: any = {}
    if (status && status !== 'all') filter.status = status
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { program: { $regex: search, $options: 'i' } },
      ]
    }
    const regs = await Registration.find(filter).sort({ createdAt: -1 }).lean()
    const total = await Registration.countDocuments()
    const newCount = await Registration.countDocuments({ status: 'new' })
    const confirmed = await Registration.countDocuments({ status: 'confirmed' })
    const waitlist = await Registration.countDocuments({ status: 'waitlist' })
    return NextResponse.json({ registrations: regs, stats: { total, new: newCount, confirmed, waitlist } })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

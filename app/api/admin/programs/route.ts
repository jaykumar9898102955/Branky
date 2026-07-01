import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB from '@/lib/db'
import { getAllPrograms, createProgram } from '@/models/Program'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const activeOnly = req.nextUrl.searchParams.get('activeOnly') === '1'
  const programs = await getAllPrograms(activeOnly)
  return NextResponse.json({ programs })
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const body = await req.json()
  const { name, durationMonths } = body
  if (!name || !durationMonths) {
    return NextResponse.json({ error: 'name and durationMonths are required' }, { status: 400 })
  }

  const id = await createProgram({ name, durationMonths: Number(durationMonths) })
  return NextResponse.json({ success: true, id: String(id) }, { status: 201 })
}

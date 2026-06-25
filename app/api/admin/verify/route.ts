import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ valid: false }, { status: 401 })
  return NextResponse.json({ valid: true })
}

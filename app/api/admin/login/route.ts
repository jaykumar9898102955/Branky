import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@brankylabs.in'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Branky@2026'

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    const token = signToken({ email, role: 'admin' })
    const res = NextResponse.json({ success: true, token })
    res.cookies.set('branky_admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('branky_admin', '', { maxAge: 0, path: '/' })
  return res
}

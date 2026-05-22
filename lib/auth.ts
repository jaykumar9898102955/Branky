import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'branky_secret_2026'

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): any {
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

export function getAdminToken(req: NextRequest): string | null {
  const cookie = req.cookies.get('branky_admin')?.value
  if (cookie) return cookie
  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  return null
}

export function isAuthenticated(req: NextRequest): boolean {
  const token = getAdminToken(req)
  if (!token) return false
  return !!verifyToken(token)
}

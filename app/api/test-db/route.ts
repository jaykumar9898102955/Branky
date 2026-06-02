import { NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export async function GET() {
  const config = {
    DB_HOST: process.env.DB_HOST || 'NOT SET',
    DB_PORT: process.env.DB_PORT || 'NOT SET',
    DB_USER: process.env.DB_USER || 'NOT SET',
    DB_NAME: process.env.DB_NAME || 'NOT SET',
    DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
  }

  try {
    const pool = getPool()
    await pool.query('SELECT 1')
    return NextResponse.json({ status: 'ok', message: 'Connected!', config })
  } catch (err: any) {
    return NextResponse.json({ status: 'error', error: err.message, config }, { status: 500 })
  }
}

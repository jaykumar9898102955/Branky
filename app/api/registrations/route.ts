import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { findByEmailAndProgram, createRegistration } from '@/models/Registration'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { studentName, parentName, phone, email, age, program, city, source, message } = body

    const missing = ['studentName','parentName','phone','email','age','program','city'].filter(f => !body[f])
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const existing = await findByEmailAndProgram(normalizedEmail, program)
    if (existing) {
      return NextResponse.json({ error: 'Already registered for this program with this email.' }, { status: 409 })
    }

    const insertId = await createRegistration({
      studentName: String(studentName).trim(),
      parentName: String(parentName).trim(),
      phone: String(phone).trim(),
      email: normalizedEmail,
      age, program, city,
      source: source || 'Website',
      message: message || '',
    })

    return NextResponse.json({ success: true, id: String(insertId) }, { status: 201 })
  } catch (err: any) {
    console.error('Registration error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}

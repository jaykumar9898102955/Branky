import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Registration from '@/models/Registration'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { studentName, parentName, phone, email, age, program, city, source, message } = body

    if (!studentName || !parentName || !phone || !email || !age || !program || !city) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
    }

    const existing = await Registration.findOne({ email: email.toLowerCase(), program })
    if (existing) {
      return NextResponse.json({ error: 'Already registered for this program with this email.' }, { status: 409 })
    }

    const reg = await Registration.create({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      age, program, city,
      source: source || 'Website',
      message: message || '',
    })

    return NextResponse.json({ success: true, id: reg._id.toString() }, { status: 201 })
  } catch (err: any) {
    console.error('Registration error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import connectDB, { getPool } from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const pool = getPool()

  const [[regStats]] = await pool.query<RowDataPacket[]>(`
    SELECT
      COUNT(*) AS total,
      SUM(status='new') AS new_count,
      SUM(status='reviewed') AS reviewed,
      SUM(status='confirmed') AS confirmed,
      SUM(status='waitlist') AS waitlist
    FROM registrations`)

  const [[stuStats]] = await pool.query<RowDataPacket[]>(`
    SELECT COUNT(*) AS total, SUM(status='current') AS current_count, SUM(status='past') AS past_count
    FROM students`)

  const [[feeStats]] = await pool.query<RowDataPacket[]>(`
    SELECT
      COALESCE(SUM(CASE WHEN f.status='paid' THEN f.paidAmount ELSE 0 END),0) AS collected,
      COALESCE(SUM(CASE WHEN f.status!='paid' THEN (f.amount - f.paidAmount) ELSE 0 END),0) AS outstanding,
      SUM(CASE WHEN f.status!='paid' AND f.dueDate < CURDATE() THEN 1 ELSE 0 END) AS overdue_count
    FROM fees f`)

  // Monthly fee collections — last 7 months
  const [monthlyFees] = await pool.query<RowDataPacket[]>(`
    SELECT DATE_FORMAT(f.paidDate,'%b %Y') AS month,
           DATE_FORMAT(f.paidDate,'%Y-%m') AS sort_key,
           COALESCE(SUM(f.paidAmount),0) AS total
    FROM fees f
    WHERE f.status='paid' AND f.paidDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
    GROUP BY month, sort_key
    ORDER BY sort_key ASC`)

  // Monthly registrations — last 7 months
  const [monthlyRegs] = await pool.query<RowDataPacket[]>(`
    SELECT DATE_FORMAT(createdAt,'%b %Y') AS month,
           DATE_FORMAT(createdAt,'%Y-%m') AS sort_key,
           COUNT(*) AS total
    FROM registrations
    WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
    GROUP BY month, sort_key
    ORDER BY sort_key ASC`)

  // Top 5 courses by student count
  const [topCourses] = await pool.query<RowDataPacket[]>(`
    SELECT fp.course_name AS course, COUNT(DISTINCT fp.student_id) AS students,
           COALESCE(SUM(f.paidAmount),0) AS collected
    FROM fee_plans fp
    LEFT JOIN fees f ON f.fee_plan_id = fp.id AND f.status = 'paid'
    GROUP BY fp.course_name
    ORDER BY students DESC
    LIMIT 5`)

  // Recent 5 students
  const [recentStudents] = await pool.query<RowDataPacket[]>(`
    SELECT s.id, r.studentName, r.program, s.status, s.join_date
    FROM students s JOIN registrations r ON r.id = s.registration_id
    ORDER BY s.created_at DESC LIMIT 5`)

  // Recent 5 registrations
  const [recentRegs] = await pool.query<RowDataPacket[]>(`
    SELECT id, studentName, program, status, createdAt
    FROM registrations ORDER BY createdAt DESC LIMIT 5`)

  return NextResponse.json({
    regStats: {
      total: Number(regStats.total),
      new: Number(regStats.new_count),
      reviewed: Number(regStats.reviewed),
      confirmed: Number(regStats.confirmed),
      waitlist: Number(regStats.waitlist),
    },
    stuStats: {
      total: Number(stuStats.total),
      current: Number(stuStats.current_count),
      past: Number(stuStats.past_count),
    },
    feeStats: {
      collected: Number(feeStats.collected),
      outstanding: Number(feeStats.outstanding),
      overdueCount: Number(feeStats.overdue_count),
    },
    monthlyFees: monthlyFees.map(r => ({ month: r.month, total: Number(r.total) })),
    monthlyRegs: monthlyRegs.map(r => ({ month: r.month, total: Number(r.total) })),
    topCourses: topCourses.map(r => ({ course: r.course, students: Number(r.students), collected: Number(r.collected) })),
    recentStudents: recentStudents.map(r => ({ id: r.id, name: r.studentName, program: r.program, status: r.status, joinDate: String(r.join_date).split('T')[0] })),
    recentRegs: recentRegs.map(r => ({ id: r.id, name: r.studentName, program: r.program, status: r.status, createdAt: String(r.createdAt).split('T')[0] })),
  })
}

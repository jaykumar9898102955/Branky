'use client'
import { useState, useEffect } from 'react'
import { ClipboardList, Users, IndianRupee, TrendingUp, ArrowRight } from 'lucide-react'

interface RegStats  { total: number; new: number; confirmed: number; waitlist: number }
interface StudentStats { total: number; current: number; past: number }
interface FeeStats  { totalCollected: number; totalOutstanding: number }

const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default function AdminDashboard() {
  const [regStats,  setRegStats]  = useState<RegStats>({ total: 0, new: 0, confirmed: 0, waitlist: 0 })
  const [stuStats,  setStuStats]  = useState<StudentStats>({ total: 0, current: 0, past: 0 })
  const [feeStats,  setFeeStats]  = useState<FeeStats>({ totalCollected: 0, totalOutstanding: 0 })
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [regRes, stuRes, feeRes] = await Promise.all([
          fetch('/api/admin/registrations'),
          fetch('/api/admin/students'),
          fetch('/api/admin/fee-plans'),
        ])
        if (regRes.ok) { const d = await regRes.json(); setRegStats(d.stats ?? {}) }
        if (stuRes.ok) { const d = await stuRes.json(); setStuStats(d.stats ?? {}) }
        if (feeRes.ok) { const d = await feeRes.json(); setFeeStats({ totalCollected: d.stats?.totalCollected ?? 0, totalOutstanding: d.stats?.totalOutstanding ?? 0 }) }
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const F = { fontFamily: "'Karla',sans-serif" }

  const SECTIONS = [
    {
      href:  '/admin/registrations',
      icon:  '📋',
      title: 'Registrations',
      desc:  'View and manage all website applications.',
      color: '#1D5CE3',
      stats: [
        { label: 'Total',     value: regStats.total     },
        { label: 'New',       value: regStats.new,       color: '#FF931E' },
        { label: 'Confirmed', value: regStats.confirmed, color: '#065f46' },
        { label: 'Waitlist',  value: regStats.waitlist,  color: '#92400e' },
      ],
    },
    {
      href:  '/admin/students',
      icon:  '👥',
      title: 'Students',
      desc:  'Manage enrolled students and fee plans.',
      color: '#065f46',
      stats: [
        { label: 'Total',   value: stuStats.total              },
        { label: 'Current', value: stuStats.current, color: '#065f46' },
        { label: 'Past',    value: stuStats.past,    color: '#64748b' },
      ],
    },
    {
      href:  '/admin/students',
      icon:  '💰',
      title: 'Fees',
      desc:  'Track collected fees and outstanding payments.',
      color: '#FF931E',
      stats: [
        { label: 'Collected',    value: fmt(feeStats.totalCollected),    color: '#065f46' },
        { label: 'Outstanding',  value: fmt(feeStats.totalOutstanding),  color: '#dc2626' },
      ],
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', ...F }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&display=swap');*{box-sizing:border-box;}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}` }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 6 }}>Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '.92rem' }}>Overview of Branky STEM Labs admin.</p>
        </div>

        {/* Top stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 36 }}>
          {loading ? [1,2,3,4].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '20px', height: 90, boxShadow: '0 2px 8px rgba(0,0,0,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 28, height: 28, border: '3px solid #e2e8f0', borderTop: '3px solid #1D5CE3', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          )) : [
            { label: 'Registrations', value: regStats.total,              color: '#1D5CE3', IC: ClipboardList },
            { label: 'Active Students', value: stuStats.current,          color: '#065f46', IC: Users        },
            { label: 'Fees Collected', value: fmt(feeStats.totalCollected), color: '#FF931E', IC: IndianRupee },
            { label: 'Outstanding',   value: fmt(feeStats.totalOutstanding), color: '#dc2626', IC: TrendingUp },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', borderLeft: `4px solid ${s.color}`, boxShadow: '0 2px 8px rgba(0,0,0,.04)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ color: s.color, flexShrink: 0 }}><s.IC size={24} /></div>
              <div>
                <div style={{ fontSize: typeof s.value === 'number' ? '1.7rem' : '1.2rem', fontWeight: 800, color: '#0d0d0d', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {SECTIONS.map(sec => (
            <a key={sec.href + sec.title} href={sec.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '2px solid transparent', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: sec.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{sec.icon}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0d0d0d' }}>{sec.title}</div>
                      <div style={{ fontSize: '.75rem', color: '#94a3b8', marginTop: 1 }}>{sec.desc}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} color={sec.color} />
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {sec.stats.map(st => (
                    <div key={st.label}>
                      <div style={{ fontSize: typeof st.value === 'number' ? '1.4rem' : '1rem', fontWeight: 800, color: (st as any).color ?? '#0d0d0d', lineHeight: 1 }}>{st.value}</div>
                      <div style={{ fontSize: '.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 2 }}>{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

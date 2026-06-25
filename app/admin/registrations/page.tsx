'use client'
import { useState, useCallback, useEffect } from 'react'
import { AlertTriangle, Inbox, RefreshCw, Save, Trash2, User, Users, Phone, Target, MapPin, Link2, Calendar, X } from 'lucide-react'

type Status = 'new' | 'reviewed' | 'confirmed' | 'waitlist'
interface Reg { _id: string; studentName: string; parentName: string; phone: string; age: string; program: string; city: string; source: string; message: string; status: Status; notes: string; createdAt: string }
interface RegStats { total: number; new: number; confirmed: number; waitlist: number }

const SC: Record<Status, { bg: string; color: string; label: string }> = {
  new:      { bg: '#dbeafe', color: '#1e40af', label: 'New'      },
  reviewed: { bg: '#e0e7ff', color: '#3730a3', label: 'Reviewed' },
  confirmed:{ bg: '#d1fae5', color: '#065f46', label: 'Confirmed'},
  waitlist: { bg: '#fef3c7', color: '#92400e', label: 'Waitlist' },
}

export default function RegistrationsPage() {
  const [regs, setRegs]       = useState<Reg[]>([])
  const [stats, setStats]     = useState<RegStats>({ total: 0, new: 0, confirmed: 0, waitlist: 0 })
  const [search, setSearch]   = useState('')
  const [sf, setSf]           = useState('all')
  const [loading, setLoading] = useState(false)
  const [sel, setSel]         = useState<Reg | null>(null)
  const [notes, setNotes]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [delId, setDelId]     = useState<string | null>(null)
  const [addingStudent, setAddingStudent] = useState(false)
  const [toast, setToast]     = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (sf !== 'all') p.set('status', sf)
      if (search) p.set('search', search)
      const r = await fetch(`/api/admin/registrations?${p}`)
      if (r.ok) {
        const d = await r.json()
        setRegs(d.registrations ?? [])
        setStats(d.stats ?? { total: 0, new: 0, confirmed: 0, waitlist: 0 })
      }
    } finally { setLoading(false) }
  }, [sf, search])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: Status) => {
    await fetch(`/api/admin/registrations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setRegs(r => r.map(x => x._id === id ? { ...x, status } : x))
    if (sel?._id === id) setSel(s => s ? { ...s, status } : s)
    load()
  }

  const saveNotes = async () => {
    if (!sel) return; setSaving(true)
    try {
      await fetch(`/api/admin/registrations/${sel._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes }) })
      setRegs(r => r.map(x => x._id === sel._id ? { ...x, notes } : x))
      setSel(s => s ? { ...s, notes } : s)
    } finally { setSaving(false) }
  }

  const deleteReg = async (id: string) => {
    await fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' })
    setRegs(r => r.filter(x => x._id !== id))
    setDelId(null)
    if (sel?._id === id) setSel(null)
    load()
  }

  const addAsStudent = async (reg: Reg) => {
    setAddingStudent(true)
    try {
      const r = await fetch('/api/admin/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ registrationId: reg._id }) })
      const d = await r.json()
      if (d.alreadyExists) showToast('Already a student — manage in Students page.')
      else if (d.success) showToast(`${reg.studentName} added as student!`)
      else showToast('Error adding student.')
    } catch { showToast('Network error.') }
    finally { setAddingStudent(false) }
  }

  const F = { fontFamily: "'Karla',sans-serif" }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', ...F }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;}
        tr:hover td{background:#f0f5ff}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      ` }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 4 }}>Registrations</h1>
          <p style={{ color: '#64748b', fontSize: '.9rem' }}>All website applications and walk-in registrations.</p>
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[{ v: 'all', l: `All (${stats.total})` }, { v: 'new', l: `New (${stats.new})` }, { v: 'confirmed', l: `Confirmed (${stats.confirmed})` }, { v: 'waitlist', l: `Waitlist (${stats.waitlist})` }, { v: 'reviewed', l: 'Reviewed' }].map(t => (
            <button key={t.v} onClick={() => setSf(t.v)}
              style={{ padding: '7px 16px', borderRadius: 20, border: `2px solid ${sf === t.v ? '#1D5CE3' : '#e2e8f0'}`, background: sf === t.v ? '#1D5CE3' : '#fff', color: sf === t.v ? '#fff' : '#64748b', fontWeight: 700, fontSize: '.82rem', cursor: 'pointer', fontFamily: 'Karla,sans-serif', transition: 'all .18s' }}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: sel ? '1fr 380px' : '1fr', gap: 20 }}>
          {/* Table card */}
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,.05)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Search name, phone, program…"
                style={{ flex: 1, minWidth: 180, padding: '8px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: '.85rem', outline: 'none' }} />
              <button onClick={load}
                style={{ padding: '8px 14px', background: '#1D5CE3', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '.85rem', fontFamily: 'Karla,sans-serif' }}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ padding: 52, textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTop: '3px solid #1D5CE3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                Loading…
              </div>
            ) : regs.length === 0 ? (
              <div style={{ padding: 52, textAlign: 'center', color: '#94a3b8' }}>
                <Inbox size={44} strokeWidth={1.2} style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontWeight: 700, marginBottom: 4 }}>No registrations found</p>
                <p style={{ fontSize: '.85rem' }}>Try a different filter or wait for new applications.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['#', 'Student', 'Parent', 'Phone', 'Program', 'City', 'Date', 'Status', '→ Student', ''].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', background: '#f8fafc', fontSize: '.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {regs.map((r, i) => {
                      const st = SC[r.status] ?? SC.new
                      const isSelected = sel?._id === r._id
                      return (
                        <tr key={r._id}
                          style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: isSelected ? '#eff6ff' : 'transparent' }}
                          onClick={() => { setSel(r); setNotes(r.notes || '') }}>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1D5CE3', fontSize: '.82rem' }}>#{String(i + 1).padStart(3, '0')}</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0d0d0d', whiteSpace: 'nowrap', fontSize: '.85rem' }}>{r.studentName}</td>
                          <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '.83rem', whiteSpace: 'nowrap' }}>{r.parentName}</td>
                          <td style={{ padding: '12px 14px', fontSize: '.83rem', whiteSpace: 'nowrap' }}>{r.phone}</td>
                          <td style={{ padding: '12px 14px', fontSize: '.83rem', whiteSpace: 'nowrap' }}>{r.program}</td>
                          <td style={{ padding: '12px 14px', fontSize: '.83rem' }}>{r.city}</td>
                          <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select value={r.status}
                              onClick={e => e.stopPropagation()}
                              onChange={e => { e.stopPropagation(); updateStatus(r._id, e.target.value as Status) }}
                              style={{ padding: '4px 8px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '.76rem', cursor: 'pointer', background: st.bg, color: st.color, fontWeight: 700, outline: 'none' }}>
                              {Object.entries(SC).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {r.status === 'confirmed' ? (
                              <button onClick={e => { e.stopPropagation(); addAsStudent(r) }} disabled={addingStudent}
                                style={{ padding: '4px 10px', background: '#d1fae5', border: '1.5px solid #6ee7b7', borderRadius: 8, color: '#065f46', cursor: 'pointer', fontSize: '.75rem', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'Karla,sans-serif' }}>
                                → Student
                              </button>
                            ) : <span style={{ color: '#cbd5e1', fontSize: '.72rem' }}>—</span>}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <button onClick={e => { e.stopPropagation(); setDelId(r._id) }}
                              style={{ padding: '4px 10px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 8, color: '#dc2626', cursor: 'pointer', fontSize: '.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Karla,sans-serif' }}>
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {sel && (
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,.05)', overflow: 'hidden', height: 'fit-content', position: 'sticky', top: 20 }}>
              <div style={{ background: 'linear-gradient(135deg,#1D5CE3,#0a3db5)', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <User size={22} />
                  </div>
                  <button onClick={() => setSel(null)}
                    style={{ background: 'rgba(255,255,255,.15)', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={14} />
                  </button>
                </div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{sel.studentName}</div>
                <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '.8rem', marginTop: 2 }}>{sel.age}{sel.city ? ` · ${sel.city}` : ''}</div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', background: SC[sel.status]?.bg, color: SC[sel.status]?.color }}>
                    {SC[sel.status]?.label}
                  </span>
                </div>
              </div>

              <div style={{ padding: '18px 20px' }}>
                {/* Info fields */}
                {([
                  { IC: Users,    k: 'Parent',  v: sel.parentName },
                  { IC: Phone,    k: 'Phone',   v: sel.phone      },
                  { IC: Target,   k: 'Program', v: sel.program    },
                  { IC: MapPin,   k: 'City',    v: sel.city       },
                  { IC: Link2,    k: 'Source',  v: sel.source     },
                  { IC: Calendar, k: 'Applied', v: new Date(sel.createdAt).toLocaleString('en-IN') },
                ] as const).map(({ IC, k, v }) => v ? (
                  <div key={k} style={{ display: 'flex', gap: 10, marginBottom: 9, fontSize: '.85rem' }}>
                    <span style={{ color: '#94a3b8', minWidth: 80, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <IC size={12} />{k}
                    </span>
                    <span style={{ color: '#1e293b', fontWeight: 500, wordBreak: 'break-all' }}>{v}</span>
                  </div>
                ) : null)}

                {sel.message && (
                  <div style={{ marginTop: 8, padding: '10px 14px', background: '#eff6ff', borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: '.7rem', fontWeight: 800, color: '#1D5CE3', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Message</div>
                    <p style={{ fontSize: '.85rem', color: '#1e293b', lineHeight: 1.6 }}>{sel.message}</p>
                  </div>
                )}

                {/* Status change */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 800, color: '#0d0d0d', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Change Status</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(Object.entries(SC) as [Status, typeof SC.new][]).map(([s, st]) => (
                      <button key={s} onClick={() => updateStatus(sel._id, s)}
                        style={{ padding: '5px 12px', borderRadius: 20, border: `2px solid ${sel.status === s ? st.color : 'transparent'}`, background: sel.status === s ? st.bg : '#f1f5f9', color: sel.status === s ? st.color : '#64748b', fontSize: '.76rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Karla,sans-serif', transition: 'all .15s' }}>
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add as student */}
                {sel.status === 'confirmed' && (
                  <button onClick={() => addAsStudent(sel)} disabled={addingStudent}
                    style={{ marginTop: 14, width: '100%', padding: '9px 0', background: addingStudent ? '#94a3b8' : '#065f46', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.86rem', cursor: 'pointer', fontFamily: 'Karla,sans-serif' }}>
                    {addingStudent ? 'Adding…' : '→ Add as Student'}
                  </button>
                )}

                {/* Notes */}
                <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 800, color: '#0d0d0d', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Admin Notes</div>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes…"
                    style={{ width: '100%', height: 80, padding: 10, border: '2px solid #e2e8f0', borderRadius: 10, fontSize: '.85rem', resize: 'vertical', outline: 'none', fontFamily: 'Karla,sans-serif', boxSizing: 'border-box' }} />
                  <button onClick={saveNotes} disabled={saving}
                    style={{ marginTop: 6, width: '100%', padding: '8px 0', background: saving ? '#94a3b8' : '#1D5CE3', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', fontFamily: 'Karla,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {saving ? 'Saving…' : <><Save size={13} /> Save Notes</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#065f46', color: '#fff', padding: '12px 20px', borderRadius: 12, zIndex: 999, fontWeight: 700, fontSize: '.88rem', boxShadow: '0 8px 24px rgba(0,0,0,.2)', maxWidth: 320 }}>
          {toast}
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setDelId(null)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', width: 'min(360px,92vw)', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#dc2626' }}><AlertTriangle size={40} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 8, textAlign: 'center' }}>Delete Registration?</h3>
            <p style={{ fontSize: '.87rem', color: '#64748b', marginBottom: 24, textAlign: 'center', lineHeight: 1.6 }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDelId(null)}
                style={{ flex: 1, padding: 11, background: '#f1f5f9', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '.9rem', fontFamily: 'Karla,sans-serif' }}>
                Cancel
              </button>
              <button onClick={() => deleteReg(delId)}
                style={{ flex: 1, padding: 11, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '.9rem', fontFamily: 'Karla,sans-serif' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

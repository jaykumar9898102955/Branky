'use client'
import { useState, useCallback, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, BookOpen } from 'lucide-react'

interface Program { id: string; name: string; durationMonths: number; isActive: boolean }

const BLANK_FORM = { open: false, id: '', name: '', durationMonths: '3' }

export default function ProgramsMasterPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(BLANK_FORM)
  const [saving, setSaving] = useState(false)
  const [delId, setDelId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/programs')
      if (r.ok) {
        const d = await r.json()
        setPrograms(d.programs ?? [])
      }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => setForm({ ...BLANK_FORM, open: true })
  const openEdit = (p: Program) => setForm({ open: true, id: p.id, name: p.name, durationMonths: String(p.durationMonths) })

  const save = async () => {
    if (!form.name || !form.durationMonths) return
    setSaving(true)
    try {
      const body = { name: form.name, durationMonths: Number(form.durationMonths) }
      const r = form.id
        ? await fetch(`/api/admin/programs/${form.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/admin/programs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (r.ok) {
        showToast(form.id ? 'Program updated.' : 'Program added.')
        setForm(BLANK_FORM)
        load()
      } else {
        const d = await r.json()
        showToast(d.error ?? 'Something went wrong.')
      }
    } finally { setSaving(false) }
  }

  const toggleActive = async (p: Program) => {
    await fetch(`/api/admin/programs/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !p.isActive }) })
    load()
  }

  const remove = async (id: string) => {
    await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' })
    setDelId(null)
    load()
  }

  const F = { fontFamily: "'Karla',sans-serif" }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', ...F }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;}
        tr:hover td{background:#eef3ff!important;transition:background .1s;}
      ` }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              <BookOpen size={22} color="#1D5CE3" /> Programs
            </h1>
            <p style={{ color: '#64748b', fontSize: '.9rem' }}>Admin-only list used for student registration and fee-plan dropdowns.</p>
          </div>
          <button onClick={openAdd}
            style={{ padding: '10px 18px', background: '#1D5CE3', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '.88rem', fontFamily: 'Karla,sans-serif' }}>
            <Plus size={16} /> Add Program
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,.05)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 20px', fontSize: '.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em' }}>Name</th>
                <th style={{ padding: '12px 20px', fontSize: '.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em' }}>Duration</th>
                <th style={{ padding: '12px 20px', fontSize: '.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</th>
                <th style={{ padding: '12px 20px', fontSize: '.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading…</td></tr>
              )}
              {!loading && programs.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No programs yet. Add one to get started.</td></tr>
              )}
              {programs.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 20px', fontSize: '.88rem', fontWeight: 700, color: '#0d0d0d' }}>{p.name}</td>
                  <td style={{ padding: '12px 20px', fontSize: '.85rem', color: '#475569' }}>{p.durationMonths} {p.durationMonths === 1 ? 'month' : 'months'}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <button onClick={() => toggleActive(p)}
                      style={{ padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '.78rem', fontFamily: 'Karla,sans-serif', background: p.isActive ? '#d1fae5' : '#f1f5f9', color: p.isActive ? '#065f46' : '#64748b' }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                    <button onClick={() => openEdit(p)} title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1D5CE3', padding: 6 }}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDelId(p.id)} title="Delete"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 6 }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      {form.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
          onClick={() => setForm(BLANK_FORM)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(420px,96vw)', boxShadow: '0 30px 80px rgba(0,0,0,.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0d0d0d' }}>{form.id ? 'Edit Program' : 'Add Program'}</h3>
              <button onClick={() => setForm(BLANK_FORM)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '.73rem', fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6, color: '#1e293b' }}>Program Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 10, fontFamily: 'Karla,sans-serif', fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '.73rem', fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6, color: '#1e293b' }}>Duration (months)</label>
              <input type="number" min={1} value={form.durationMonths} onChange={e => setForm(f => ({ ...f, durationMonths: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 10, fontFamily: 'Karla,sans-serif', fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={save} disabled={saving || !form.name || !form.durationMonths}
              style={{ width: '100%', padding: 12, background: (saving || !form.name || !form.durationMonths) ? '#94a3b8' : '#1D5CE3', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '.92rem', cursor: 'pointer', fontFamily: 'Karla,sans-serif' }}>
              {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Add Program'}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
          onClick={() => setDelId(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(380px,96vw)', boxShadow: '0 30px 80px rgba(0,0,0,.3)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 10 }}>Delete this program?</h3>
            <p style={{ fontSize: '.87rem', color: '#64748b', marginBottom: 22 }}>This only removes it from the admin dropdown list. Existing students keep their recorded program name.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDelId(null)} style={{ flex: 1, padding: 11, background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', fontFamily: 'Karla,sans-serif' }}>Cancel</button>
              <button onClick={() => remove(delId)} style={{ flex: 1, padding: 11, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', fontFamily: 'Karla,sans-serif' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0d0d0d', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: '.85rem', fontWeight: 600, zIndex: 200, boxShadow: '0 10px 30px rgba(0,0,0,.3)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

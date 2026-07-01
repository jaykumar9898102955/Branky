'use client'
import { useEffect, useState, useCallback, type CSSProperties } from 'react'
import { generateInstallmentReceipt } from '@/lib/generateInstallmentReceipt'
import type { StudentDTO } from '@/models/Student'
import type { FeePlanDTO, InstallmentDTO } from '@/models/FeePlan'

// ─── courses (loaded from the admin Programs master, see /admin/programs) ────
const OTHER_COURSE = { name: 'Other', months: null as number | null }

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`
const todayStr = () => new Date().toISOString().split('T')[0]

function getToken() {
  if (typeof document === 'undefined') return ''
  const m = document.cookie.match(/branky_admin=([^;]+)/)
  return m ? m[1] : ''
}
async function apiFetch(path: string, opts?: RequestInit) {
  const r = await fetch(path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(opts?.headers ?? {}) },
  })
  const text = await r.text()
  try { return JSON.parse(text) } catch { return { error: `Server error (${r.status})` } }
}

// ─── types ───────────────────────────────────────────────────────────────────
type Tab = 'all' | 'current' | 'past'
interface Stats { total: number; current: number; past: number }
interface PayForm { open: boolean; multi: boolean; ids: number[]; date: string; notes: string }

const BLANK_OFFLINE = {
  open: false, step: 1 as 1 | 2,
  studentName: '', parentName: '', phone: '', program: '', customProgram: '', joinDate: todayStr(),
  feeMonths: '3', feeTotalFee: '', feeDiscount: '0', feeStartDate: todayStr(), feeNotes: '',
}

const BLANK_FP = { open: false, courseName: '', courseCustom: '', totalFee: '', discount: '0', months: '3', startDate: todayStr(), notes: '' }

// ─── component ───────────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<{ name: string; months: number | null }[]>([])
  const [students, setStudents] = useState<StudentDTO[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, current: 0, past: 0 })
  const [tab, setTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')
  const [sel, setSel] = useState<StudentDTO | null>(null)
  const [plans, setPlans] = useState<FeePlanDTO[]>([])
  const [activePlan, setActivePlan] = useState(0)
  const [planLoading, setPlanLoading] = useState(false)
  const [fpForm, setFpForm] = useState(BLANK_FP)
  const [fpSaving, setFpSaving] = useState(false)
  const [payForm, setPayForm] = useState<PayForm>({ open: false, multi: false, ids: [], date: todayStr(), notes: '' })
  const [paySaving, setPaySaving] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [offlineForm, setOfflineForm] = useState(BLANK_OFFLINE)
  const [offlineSaving, setOfflineSaving] = useState(false)
  const [editForm, setEditForm] = useState<{ open: boolean; studentName: string; parentName: string; phone: string; program: string; joinDate: string }>({ open: false, studentName: '', parentName: '', phone: '', program: '', joinDate: '' })
  const [editSaving, setEditSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  // ── data ──────────────────────────────────────────────────────────────────
  const loadStudents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ status: tab, ...(search ? { search } : {}) })
    const data = await apiFetch(`/api/admin/students?${params}`)
    setStudents(data.students ?? [])
    setStats(data.stats ?? { total: 0, current: 0, past: 0 })
    setLoading(false)
  }, [tab, search])

  useEffect(() => { loadStudents() }, [loadStudents])

  useEffect(() => {
    apiFetch('/api/admin/programs?activeOnly=1').then(data => {
      const list = (data.programs ?? []).map((p: { name: string; durationMonths: number }) => ({ name: p.name, months: p.durationMonths }))
      setCourses([...list, OTHER_COURSE])
    })
  }, [])

  const selectStudent = async (s: StudentDTO) => {
    setSel(s); setPlans([]); setActivePlan(0); setFpForm(BLANK_FP); setPayForm(p => ({ ...p, open: false, ids: [] })); setEditForm(f => ({ ...f, open: false })); setDeleteConfirm(false)
    setPlanLoading(true)
    const data = await apiFetch(`/api/admin/students/${s.id}`)
    setPlans(data.feePlans ?? [])
    setPlanLoading(false)
  }

  const refreshPlans = async (studentId: string) => {
    const data = await apiFetch(`/api/admin/students/${studentId}`)
    setPlans(data.feePlans ?? [])
    const listData = await apiFetch(`/api/admin/students?status=${tab}${search ? `&search=${search}` : ''}`)
    setStudents(listData.students ?? [])
    setStats(listData.stats ?? stats)
    const updated = (listData.students ?? []).find((x: StudentDTO) => x.id === studentId)
    if (updated) setSel(updated)
  }

  // ── offline student ───────────────────────────────────────────────────────
  const submitOfflineStudent = async (withFees: boolean) => {
    const { studentName, phone, program, customProgram, parentName, joinDate,
      feeMonths, feeTotalFee, feeDiscount, feeStartDate, feeNotes } = offlineForm
    if (!studentName || !phone || !program) return
    setOfflineSaving(true)

    const effectiveCourse = program === 'Other' ? customProgram : program
    const feeData = withFees && effectiveCourse && feeTotalFee && feeMonths
      ? { feeCourse: effectiveCourse, feeMonths, feeTotalFee, feeDiscount, feeStartDate, feeNotes }
      : undefined

    const data = await apiFetch('/api/admin/students', {
      method: 'POST',
      body: JSON.stringify({ offline: true, studentName, parentName, phone, program: effectiveCourse || program, joinDate, feeData }),
    })
    setOfflineSaving(false)
    if (data.success) {
      setOfflineForm(BLANK_OFFLINE)
      await loadStudents()
      showToast(`${data.student.studentName} added!${feeData ? ' Fee plan created.' : ''}`)
      selectStudent(data.student)
    } else {
      showToast(data.error ?? 'Error adding student')
    }
  }

  // ── fee plan ──────────────────────────────────────────────────────────────
  const currentPlan = plans[activePlan] ?? null
  const fpCourseName = () => fpForm.courseName === 'Other' ? fpForm.courseCustom : fpForm.courseName

  const createPlan = async () => {
    if (!sel || !fpForm.totalFee || !fpForm.months) return
    setFpSaving(true)
    const data = await apiFetch('/api/admin/fee-plans', {
      method: 'POST',
      body: JSON.stringify({
        studentId: sel.id,
        registrationId: sel.registrationId,
        totalFee: Number(fpForm.totalFee),
        discount: Number(fpForm.discount) || 0,
        durationMonths: Number(fpForm.months),
        startDate: fpForm.startDate,
        courseName: fpCourseName() || undefined,
        notes: fpForm.notes || undefined,
      }),
    })
    setFpSaving(false)
    if (data.plan) {
      setFpForm(BLANK_FP)
      if (sel) await refreshPlans(sel.id)
      // Switch to new plan tab (last one)
      setActivePlan(0) // newest plan is first (API returns newest-first)
      showToast('Fee plan created!')
    } else showToast(data.error ?? 'Error creating plan')
  }

  const deletePlanAndEdit = async () => {
    if (!currentPlan) return
    const ok = confirm('Delete this fee plan and recreate it? This cannot be undone.')
    if (!ok) return
    await apiFetch(`/api/admin/fee-plans/${currentPlan.id}`, { method: 'DELETE' })
    const isKnown = courses.some(c => c.name === currentPlan.courseName)
    setFpForm({
      open: true,
      courseName: isKnown ? currentPlan.courseName : 'Other',
      courseCustom: isKnown ? '' : currentPlan.courseName,
      totalFee: String(currentPlan.totalFee),
      discount: String(currentPlan.discount),
      months: String(currentPlan.durationMonths),
      startDate: currentPlan.startDate,
      notes: currentPlan.notes,
    })
    if (sel) await refreshPlans(sel.id)
  }

  // ── pay ───────────────────────────────────────────────────────────────────
  const paySingle = (inst: InstallmentDTO) => {
    setPayForm({ open: true, multi: false, ids: [Number(inst.id)], date: todayStr(), notes: '' })
  }

  const confirmPay = async () => {
    if (!currentPlan || payForm.ids.length === 0) return
    setPaySaving(true)
    await apiFetch(`/api/admin/fee-plans/${currentPlan.id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ installmentIds: payForm.ids, paidDate: payForm.date, paymentNotes: payForm.notes }),
    })
    setPaySaving(false)
    setPayForm(p => ({ ...p, open: false, ids: [] }))
    if (sel) await refreshPlans(sel.id)
    showToast('Payment recorded!')
  }

  const multiToggle = (id: number) => {
    setPayForm(p => ({ ...p, ids: p.ids.includes(id) ? p.ids.filter(x => x !== id) : [...p.ids, id] }))
  }

  // ── status ────────────────────────────────────────────────────────────────
  const toggleStatus = async (s: StudentDTO) => {
    setStatusSaving(true)
    const newStatus = s.status === 'current' ? 'past' : 'current'
    const endDate = newStatus === 'past' ? todayStr() : null
    await apiFetch(`/api/admin/students/${s.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus, endDate }) })
    setStatusSaving(false)
    await loadStudents()
    if (sel?.id === s.id) setSel(st => st ? { ...st, status: newStatus } : st)
    showToast(`Student marked as ${newStatus}`)
  }

  const openEdit = (s: StudentDTO) => {
    setEditForm({ open: true, studentName: s.studentName, parentName: s.parentName ?? '', phone: s.phone, program: s.program ?? '', joinDate: s.joinDate ?? '' })
  }

  const saveEdit = async () => {
    if (!sel) return
    setEditSaving(true)
    const data = await apiFetch(`/api/admin/students/${sel.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ studentName: editForm.studentName, parentName: editForm.parentName, phone: editForm.phone, program: editForm.program, joinDate: editForm.joinDate }),
    })
    setEditSaving(false)
    if (data.success) {
      setSel(data.student)
      setStudents(prev => prev.map(s => s.id === sel.id ? data.student : s))
      setEditForm(f => ({ ...f, open: false }))
      showToast('Student details updated!')
    } else showToast(data.error ?? 'Error saving')
  }

  const confirmDeleteStudent = async () => {
    if (!sel) return
    setDeleting(true)
    const data = await apiFetch(`/api/admin/students/${sel.id}`, { method: 'DELETE' })
    setDeleting(false)
    if (data.success) {
      setSel(null); setPlans([]); setDeleteConfirm(false)
      await loadStudents()
      showToast('Student deleted.')
    } else showToast(data.error ?? 'Error deleting')
  }

  const instStatus = (inst: InstallmentDTO) => {
    if (inst.status === 'paid') return { label: 'Paid', color: '#065f46', bg: '#d1fae5' }
    if (inst.dueDate < todayStr()) return { label: 'Overdue', color: '#991b1b', bg: '#fee2e2' }
    return { label: 'Pending', color: '#92400e', bg: '#fef3c7' }
  }

  // ── fee preview helper ────────────────────────────────────────────────────
  const feePreview = (totalFee: string, discount: string, months: string) => {
    const total = Number(totalFee)
    const disc = Number(discount) || 0
    const m = Number(months)
    if (!total || !m) return null
    const net = total - disc
    const monthly = Math.round(net / m)
    return { net, monthly, disc }
  }

  // ── shared styles ─────────────────────────────────────────────────────────
  const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2364748b' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`
  const inputSt: CSSProperties = { width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }
  const selectSt: CSSProperties = { ...inputSt, backgroundImage: chevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 28, cursor: 'pointer' }
  const panelInputSt: CSSProperties = { width: '100%', padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '.85rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }
  const panelSelectSt: CSSProperties = { ...panelInputSt, backgroundImage: chevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: 24, cursor: 'pointer' }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'var(--font-body,system-ui,sans-serif)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media(max-width:600px){.stu-stats{grid-template-columns:1fr!important;}}
        @media(max-width:768px){.stu-modal-cols{grid-template-columns:1fr!important;}.stu-modal-left{border-right:none!important;border-bottom:1px solid #e2e8f0;}}
      ` }} />
      {/* ── Offline Modal (2 steps) ── */}
      {offlineForm.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setOfflineForm(BLANK_OFFLINE)}>
          <div style={{ background: '#fff', borderRadius: 20, width: 'min(520px,96vw)', boxShadow: '0 24px 64px rgba(0,0,0,.25)', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ background: '#FF931E', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                  {offlineForm.step === 1 ? 'Add Offline Student — Step 1 of 2' : 'Fee Plan — Step 2 of 2'}
                </div>
                <div style={{ color: 'rgba(255,255,255,.8)', fontSize: '.78rem', marginTop: 2 }}>
                  {offlineForm.step === 1 ? 'Walk-in / direct admission' : 'Set up monthly installments (optional)'}
                </div>
              </div>
              <button onClick={() => setOfflineForm(BLANK_OFFLINE)}
                style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ display: 'flex', height: 4 }}>
              <div style={{ flex: 1, background: '#FF931E' }} />
              <div style={{ flex: 1, background: offlineForm.step === 2 ? '#FF931E' : '#e2e8f0', transition: 'background .3s' }} />
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {offlineForm.step === 1 ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[{ label: 'Student Name *', key: 'studentName', type: 'text', ph: 'Full name' }, { label: 'Phone *', key: 'phone', type: 'tel', ph: '98765 43210' }].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>{f.label}</label>
                        <input type={f.type} placeholder={f.ph} value={(offlineForm as any)[f.key]}
                          onChange={e => setOfflineForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputSt} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Course *</label>
                    <select value={offlineForm.program}
                      onChange={e => { const c = courses.find(x => x.name === e.target.value); setOfflineForm(p => ({ ...p, program: e.target.value, feeMonths: c?.months ? String(c.months) : p.feeMonths })) }}
                      style={selectSt}>
                      <option value="">Select course…</option>
                      {courses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  {offlineForm.program === 'Other' && (
                    <div>
                      <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Course Name</label>
                      <input type="text" placeholder="Enter course name" value={offlineForm.customProgram}
                        onChange={e => setOfflineForm(p => ({ ...p, customProgram: e.target.value }))} style={inputSt} />
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Parent Name</label>
                    <input type="text" placeholder="Parent / Guardian" value={offlineForm.parentName}
                      onChange={e => setOfflineForm(p => ({ ...p, parentName: e.target.value }))} style={inputSt} />
                  </div>
                  <div>
                    <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Join Date</label>
                    <input type="date" value={offlineForm.joinDate}
                      onChange={e => setOfflineForm(p => ({ ...p, joinDate: e.target.value }))} style={inputSt} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button onClick={() => { const ok = offlineForm.studentName && offlineForm.phone && offlineForm.program && (offlineForm.program !== 'Other' || offlineForm.customProgram); if (ok) setOfflineForm(p => ({ ...p, step: 2 })) }}
                      disabled={!offlineForm.studentName || !offlineForm.phone || !offlineForm.program || (offlineForm.program === 'Other' && !offlineForm.customProgram)}
                      style={{ flex: 1, padding: '10px 0', background: (!offlineForm.studentName || !offlineForm.phone || !offlineForm.program) ? '#94a3b8' : '#FF931E', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '.9rem', cursor: 'pointer' }}>
                      Next: Add Fee Plan →
                    </button>
                    <button onClick={() => submitOfflineStudent(false)} disabled={offlineSaving || !offlineForm.studentName || !offlineForm.phone || !offlineForm.program || (offlineForm.program === 'Other' && !offlineForm.customProgram)}
                      style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap' }}>
                      {offlineSaving ? 'Adding…' : 'Skip Fees'}
                    </button>
                    <button onClick={() => setOfflineForm(BLANK_OFFLINE)}
                      style={{ padding: '10px 14px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', color: '#64748b' }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: '#eff6ff', borderRadius: 10, padding: '8px 14px', fontSize: '.85rem', fontWeight: 700, color: '#1D5CE3', border: '1.5px solid #bfdbfe' }}>
                    📚 {offlineForm.program === 'Other' ? offlineForm.customProgram : offlineForm.program}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Total Fee (₹) *</label>
                      <input type="number" placeholder="15000" value={offlineForm.feeTotalFee}
                        onChange={e => setOfflineForm(p => ({ ...p, feeTotalFee: e.target.value }))} style={inputSt} />
                    </div>
                    <div>
                      <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Discount (₹)</label>
                      <input type="number" placeholder="0" value={offlineForm.feeDiscount}
                        onChange={e => setOfflineForm(p => ({ ...p, feeDiscount: e.target.value }))} style={inputSt} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Duration (months)</label>
                      <input type="number" min="1" value={offlineForm.feeMonths}
                        onChange={e => setOfflineForm(p => ({ ...p, feeMonths: e.target.value }))} style={inputSt} />
                    </div>
                    <div>
                      <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Start Date</label>
                      <input type="date" value={offlineForm.feeStartDate}
                        onChange={e => setOfflineForm(p => ({ ...p, feeStartDate: e.target.value }))} style={inputSt} />
                    </div>
                  </div>
                  {(() => { const pv = feePreview(offlineForm.feeTotalFee, offlineForm.feeDiscount, offlineForm.feeMonths); return pv ? (
                    <div style={{ background: '#fff7ed', borderRadius: 10, padding: '8px 14px', fontSize: '.82rem', color: '#FF931E', fontWeight: 700, border: '1.5px solid #fed7aa' }}>
                      {pv.disc > 0 ? `${fmt(Number(offlineForm.feeTotalFee))} − ${fmt(pv.disc)} = ${fmt(pv.net)}` : fmt(pv.net)} → {fmt(pv.monthly)}/month × {offlineForm.feeMonths} months
                    </div>
                  ) : null })()}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button onClick={() => submitOfflineStudent(true)}
                      disabled={offlineSaving || !offlineForm.feeTotalFee}
                      style={{ flex: 1, padding: '10px 0', background: offlineSaving ? '#94a3b8' : '#FF931E', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer' }}>
                      {offlineSaving ? 'Adding…' : 'Add Student + Fee Plan'}
                    </button>
                    <button onClick={() => submitOfflineStudent(false)} disabled={offlineSaving}
                      style={{ padding: '10px 14px', background: '#f1f5f9', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', color: '#475569', whiteSpace: 'nowrap' }}>Skip</button>
                    <button onClick={() => setOfflineForm(p => ({ ...p, step: 1 }))}
                      style={{ padding: '10px 14px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', color: '#64748b' }}>← Back</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1D5CE3', color: '#fff', padding: '12px 20px', borderRadius: 12, zIndex: 999, fontWeight: 700, fontSize: '.9rem', boxShadow: '0 8px 24px rgba(29,92,227,.3)' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 20px' }}>
        {/* Stats */}
        <div className="stu-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
          {[{ label: 'Total Students', value: stats.total, color: '#1D5CE3' }, { label: 'Current', value: stats.current, color: '#065f46' }, { label: 'Past', value: stats.past, color: '#64748b' }].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div>
          {/* Student list */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,.06)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
                {(['all', 'current', 'past'] as Tab[]).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ padding: '5px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '.82rem', textTransform: 'capitalize', background: tab === t ? '#1D5CE3' : 'transparent', color: tab === t ? '#fff' : '#64748b' }}>
                    {t === 'all' ? `All (${stats.total})` : t === 'current' ? `Current (${stats.current})` : `Past (${stats.past})`}
                  </button>
                ))}
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, program…"
                style={{ flex: 1, minWidth: 180, padding: '7px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none' }} />
              <button onClick={loadStudents} style={{ padding: '7px 14px', background: '#f1f5f9', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: '.82rem', fontWeight: 700, color: '#64748b' }}>Refresh</button>
              <button onClick={() => setOfflineForm(f => ({ ...f, open: true }))}
                style={{ padding: '7px 16px', background: '#FF931E', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: '.82rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                + Add Offline Student
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['#', 'Student', 'Program', 'Phone', 'Joined', 'Fees', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading…</td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No students found</td></tr>
                  ) : students.map((s, i) => (
                    <tr key={s.id} onClick={() => selectStudent(s)}
                      style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer', background: s.hasOverdue ? '#fff5f5' : 'transparent', borderLeft: s.hasOverdue ? '3px solid #ef4444' : '3px solid transparent' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.hasOverdue ? '#fee2e2' : '#f8fafc' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = s.hasOverdue ? '#fff5f5' : 'transparent' }}>
                      <td style={{ padding: '10px 14px', fontSize: '.8rem', color: '#94a3b8', fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#0d0d0d', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {s.studentName}
                          {s.hasOverdue && <span style={{ fontSize: '.65rem', fontWeight: 800, background: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: 20 }}>OVERDUE</span>}
                        </div>
                        <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{s.parentName}</div>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '.85rem', color: '#475569', fontWeight: 600 }}>{s.program}</td>
                      <td style={{ padding: '10px 14px', fontSize: '.85rem', color: '#475569' }}>{s.phone}</td>
                      <td style={{ padding: '10px 14px', fontSize: '.82rem', color: '#64748b' }}>{s.joinDate}</td>
                      {/* Fees column */}
                      <td style={{ padding: '10px 14px', minWidth: 110 }}>
                        {s.feeTotal > 0 ? (
                          <div>
                            <div style={{ fontSize: '.78rem', fontWeight: 700, color: s.hasOverdue ? '#ef4444' : '#065f46' }}>{fmt(s.feePaid)}</div>
                            <div style={{ fontSize: '.68rem', color: '#94a3b8' }}>/ {fmt(s.feeTotal)}</div>
                            <div style={{ marginTop: 3, height: 3, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden', width: 64 }}>
                              <div style={{ height: '100%', background: s.hasOverdue ? '#ef4444' : '#1D5CE3', width: `${Math.min(100, (s.feePaid / s.feeTotal) * 100)}%`, borderRadius: 99 }} />
                            </div>
                          </div>
                        ) : <span style={{ color: '#cbd5e1', fontSize: '.72rem', fontWeight: 600 }}>No fees</span>}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', background: s.status === 'current' ? '#d1fae5' : '#f1f5f9', color: s.status === 'current' ? '#065f46' : '#64748b' }}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button onClick={e => { e.stopPropagation(); toggleStatus(s) }} disabled={statusSaving}
                          style={{ padding: '4px 10px', fontSize: '.75rem', fontWeight: 700, border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', background: '#fff', color: '#64748b' }}>
                          {s.status === 'current' ? '→ Past' : '→ Current'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student detail modal popup */}
          {sel && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
              onClick={() => { setSel(null); setPlans([]); setDeleteConfirm(false) }}>
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 32px 80px rgba(0,0,0,.35)', overflow: 'hidden', width: 'min(780px,98vw)', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}>
              {/* Student header */}
              <div style={{ background: 'linear-gradient(135deg,#1D5CE3,#0a3db5)', padding: '20px 20px 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
                    {sel.studentName[0]}
                  </div>
                  <button onClick={() => { setSel(null); setPlans([]) }} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>{sel.studentName}</div>
                <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '.8rem', marginTop: 2 }}>{sel.program}{sel.city ? ` · ${sel.city}` : ''}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[{ label: 'Phone', value: sel.phone }, { label: 'Parent', value: sel.parentName }, { label: 'Joined', value: sel.joinDate }].filter(x => x.value).map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,.12)', borderRadius: 8, padding: '4px 10px' }}>
                      <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.68rem', fontWeight: 700 }}>{item.label}: </span>
                      <span style={{ color: '#fff', fontSize: '.75rem', fontWeight: 700 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stu-modal-cols" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0, minHeight: 400 }}>
                {/* Left column — student info + status */}
                <div className="stu-modal-left" style={{ padding: '20px 20px', borderRight: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: '.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Student Info</div>
                    {!editForm.open && (
                      <button onClick={() => openEdit(sel)}
                        style={{ padding: '3px 10px', fontSize: '.72rem', fontWeight: 700, border: '1.5px solid #e2e8f0', borderRadius: 8, background: '#fff', color: '#64748b' }}>
                        ✏ Edit
                      </button>
                    )}
                  </div>

                  {editForm.open ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Student Name', key: 'studentName', type: 'text' },
                        { label: 'Parent Name', key: 'parentName', type: 'text' },
                        { label: 'Phone', key: 'phone', type: 'tel' },
                        { label: 'Program', key: 'program', type: 'text' },
                        { label: 'Join Date', key: 'joinDate', type: 'date' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize: '.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 3 }}>{f.label}</label>
                          <input type={f.type} value={(editForm as any)[f.key]}
                            onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                            style={{ width: '100%', padding: '6px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '.85rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <button onClick={saveEdit} disabled={editSaving}
                          style={{ flex: 1, padding: '7px 0', background: editSaving ? '#94a3b8' : '#1D5CE3', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.82rem' }}>
                          {editSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={() => setEditForm(f => ({ ...f, open: false }))}
                          style={{ padding: '7px 12px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.82rem', color: '#64748b' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                  {[
                    { label: 'Phone', value: sel.phone },
                    { label: 'Parent', value: sel.parentName },
                    { label: 'City', value: sel.city },
                    { label: 'Joined', value: sel.joinDate },
                    { label: 'End Date', value: sel.endDate },
                    { label: 'Source', value: sel.source },
                  ].filter(x => x.value).map(item => (
                    <div key={item.label} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em' }}>{item.label}</div>
                      <div style={{ fontSize: '.88rem', fontWeight: 600, color: '#0d0d0d', marginTop: 2 }}>{item.value}</div>
                    </div>
                  ))}
                    </>
                  )}

                  <div style={{ marginTop: 20, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: '.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Status</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(['current', 'past'] as const).map(st => (
                        <button key={st} onClick={() => toggleStatus(sel)} disabled={sel.status === st || statusSaving}
                          style={{ padding: '8px 12px', borderRadius: 10, border: '2px solid', cursor: sel.status === st ? 'default' : 'pointer', fontWeight: 700, fontSize: '.82rem', textTransform: 'capitalize', textAlign: 'left', borderColor: sel.status === st ? (st === 'current' ? '#1D5CE3' : '#64748b') : '#e2e8f0', background: sel.status === st ? (st === 'current' ? '#eff6ff' : '#f1f5f9') : '#fff', color: sel.status === st ? (st === 'current' ? '#1D5CE3' : '#475569') : '#94a3b8' }}>
                          {st === 'current' ? '✓ Current' : '✓ Past'}
                        </button>
                      ))}
                    </div>
                    {sel.hasOverdue && (
                      <div style={{ marginTop: 12, padding: '8px 12px', background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 10 }}>
                        <div style={{ fontWeight: 800, fontSize: '.78rem', color: '#991b1b' }}>⚠ Overdue Payments</div>
                        <div style={{ fontSize: '.72rem', color: '#b91c1c', marginTop: 2 }}>Some installments are past due date</div>
                      </div>
                    )}
                  </div>

                  {/* Delete student */}
                  <div style={{ marginTop: 20, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                    {!deleteConfirm ? (
                      <button onClick={() => setDeleteConfirm(true)}
                        style={{ width: '100%', padding: '8px 0', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, color: '#dc2626', fontWeight: 700, fontSize: '.82rem' }}>
                        🗑 Delete Student
                      </button>
                    ) : (
                      <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '.8rem', color: '#991b1b', marginBottom: 6 }}>Delete this student and all fee records?</div>
                        <div style={{ fontSize: '.72rem', color: '#b91c1c', marginBottom: 10 }}>This cannot be undone. The registration record will be kept.</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={confirmDeleteStudent} disabled={deleting}
                            style={{ flex: 1, padding: '7px 0', background: deleting ? '#94a3b8' : '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.8rem' }}>
                            {deleting ? 'Deleting…' : 'Yes, Delete'}
                          </button>
                          <button onClick={() => setDeleteConfirm(false)}
                            style={{ padding: '7px 12px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, fontWeight: 700, fontSize: '.8rem', color: '#64748b' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right column — fee plans */}
                <div style={{ padding: '20px 20px', overflowY: 'auto' }}>
                {/* Fee Plans */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: '.95rem', color: '#0d0d0d', marginBottom: 14 }}>Fee Plans</div>

                  {planLoading ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '.85rem' }}>Loading…</div>
                  ) : (
                    <>
                      {/* Plan tabs */}
                      {plans.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
                          {plans.map((p, idx) => (
                            <button key={p.id} onClick={() => { setActivePlan(idx); setPayForm(pf => ({ ...pf, open: false, multi: false, ids: [] })) }}
                              style={{ padding: '5px 12px', borderRadius: 20, border: `2px solid ${activePlan === idx ? '#1D5CE3' : '#e2e8f0'}`, background: activePlan === idx ? '#eff6ff' : '#fff', color: activePlan === idx ? '#1D5CE3' : '#64748b', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                              {p.status === 'completed' ? <span style={{ color: '#065f46' }}>✓</span> : <span style={{ color: '#FF931E' }}>→</span>}
                              {p.courseName.length > 14 ? p.courseName.slice(0, 13) + '…' : p.courseName}
                            </button>
                          ))}
                          <button onClick={() => { setFpForm(f => ({ ...f, open: true })); setActivePlan(plans.length) }}
                            style={{ padding: '5px 12px', borderRadius: 20, border: '2px dashed #cbd5e1', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            + New Course
                          </button>
                        </div>
                      )}

                      {/* No plans yet */}
                      {plans.length === 0 && !fpForm.open && (
                        <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>📋</div>
                          <div style={{ fontWeight: 800, fontSize: '.9rem', color: '#1e293b', marginBottom: 4 }}>No fee plan set up yet</div>
                          <div style={{ fontSize: '.78rem', color: '#64748b', marginBottom: 14, lineHeight: 1.5 }}>Set up monthly installments to track<br />payments and generate receipts</div>
                          <button onClick={() => setFpForm(f => ({ ...f, open: true }))}
                            style={{ padding: '9px 24px', background: '#1D5CE3', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer' }}>
                            + Setup Fee Plan
                          </button>
                        </div>
                      )}

                      {/* Fee plan creation form */}
                      {fpForm.open && (
                        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                          <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#0d0d0d' }}>
                            {plans.length > 0 ? `Add Course ${plans.length + 1}` : 'Create Fee Plan'}
                          </div>
                          <div>
                            <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Course</label>
                            <select value={fpForm.courseName}
                              onChange={e => { const c = courses.find(x => x.name === e.target.value); setFpForm(f => ({ ...f, courseName: e.target.value, months: c?.months ? String(c.months) : f.months })) }}
                              style={panelSelectSt}>
                              <option value="">Select course…</option>
                              {courses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                          </div>
                          {fpForm.courseName === 'Other' && (
                            <div>
                              <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Custom Course Name</label>
                              <input type="text" placeholder="Enter course name" value={fpForm.courseCustom}
                                onChange={e => setFpForm(p => ({ ...p, courseCustom: e.target.value }))} style={panelInputSt} />
                            </div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[{ label: 'Total Fee (₹)', key: 'totalFee', type: 'number', ph: '15000' }, { label: 'Discount (₹)', key: 'discount', type: 'number', ph: '0' }].map(f => (
                              <div key={f.key}>
                                <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.ph} value={(fpForm as any)[f.key]}
                                  onChange={e => setFpForm(p => ({ ...p, [f.key]: e.target.value }))} style={panelInputSt} />
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[{ label: 'Duration (months)', key: 'months', type: 'number', ph: '3' }, { label: 'Start Date', key: 'startDate', type: 'date', ph: '' }].map(f => (
                              <div key={f.key}>
                                <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>{f.label}</label>
                                <input type={f.type} placeholder={f.ph} value={(fpForm as any)[f.key]}
                                  onChange={e => setFpForm(p => ({ ...p, [f.key]: e.target.value }))} style={panelInputSt} />
                              </div>
                            ))}
                          </div>
                          <div>
                            <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Notes (optional)</label>
                            <textarea value={fpForm.notes} onChange={e => setFpForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                              style={{ ...panelInputSt, resize: 'vertical' }} />
                          </div>
                          {(() => { const pv = feePreview(fpForm.totalFee, fpForm.discount, fpForm.months); return pv ? (
                            <div style={{ background: '#eff6ff', borderRadius: 8, padding: '8px 12px', fontSize: '.8rem', color: '#1D5CE3', fontWeight: 700 }}>
                              {pv.disc > 0 ? `${fmt(Number(fpForm.totalFee))} − ${fmt(pv.disc)} = ${fmt(pv.net)}` : fmt(pv.net)} → {fmt(pv.monthly)}/month × {fpForm.months}
                            </div>
                          ) : null })()}
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={createPlan} disabled={fpSaving || !fpForm.totalFee || !fpForm.months}
                              style={{ flex: 1, padding: '8px 0', background: fpSaving || !fpForm.totalFee || !fpForm.months ? '#94a3b8' : '#1D5CE3', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer' }}>
                              {fpSaving ? 'Creating…' : plans.length > 0 ? `Add Course ${plans.length + 1}` : 'Create Plan'}
                            </button>
                            <button onClick={() => setFpForm(BLANK_FP)}
                              style={{ padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', color: '#64748b' }}>Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* Current plan details */}
                      {currentPlan && !fpForm.open && (
                        <>
                          {/* Plan header */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', background: currentPlan.status === 'completed' ? '#d1fae5' : currentPlan.status === 'cancelled' ? '#f1f5f9' : '#eff6ff', color: currentPlan.status === 'completed' ? '#065f46' : currentPlan.status === 'cancelled' ? '#64748b' : '#1D5CE3' }}>{currentPlan.status}</span>
                            </div>
                            <button onClick={deletePlanAndEdit}
                              style={{ padding: '3px 10px', fontSize: '.72rem', fontWeight: 700, border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', background: '#fff', color: '#64748b' }}>
                              Update Plan
                            </button>
                          </div>

                          {/* Course Complete Banner */}
                          {currentPlan.status === 'completed' && sel.status === 'current' && (
                            <div style={{ background: '#d1fae5', border: '1.5px solid #6ee7b7', borderRadius: 12, padding: '12px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '.88rem', color: '#065f46' }}>Course complete! 🎉</div>
                                <div style={{ fontSize: '.75rem', color: '#047857', marginTop: 1 }}>All instalments paid.</div>
                              </div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => setFpForm(f => ({ ...f, open: true }))}
                                  style={{ padding: '6px 12px', background: '#1D5CE3', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                  + New Course
                                </button>
                                <button onClick={() => toggleStatus(sel)} disabled={statusSaving}
                                  style={{ padding: '6px 12px', background: '#065f46', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                  Mark Past
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Plan summary */}
                          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                            <div style={{ fontSize: '.85rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 8 }}>{currentPlan.courseName}</div>
                            {currentPlan.discount > 0 && (
                              <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: 6 }}>
                                Original: {fmt(currentPlan.totalFee)} − Discount: {fmt(currentPlan.discount)} = <strong style={{ color: '#0d0d0d' }}>{fmt(currentPlan.netFee)}</strong>
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                              {[
                                { label: 'Net Fee', value: fmt(currentPlan.netFee), color: '#0d0d0d' },
                                { label: 'Paid', value: fmt(currentPlan.totalPaid), color: '#065f46' },
                                { label: 'Remaining', value: fmt(currentPlan.totalRemaining), color: currentPlan.totalRemaining > 0 ? '#FF931E' : '#065f46' },
                              ].map(s => (
                                <div key={s.label} style={{ flex: 1, minWidth: 80 }}>
                                  <div style={{ fontSize: '.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</div>
                                  <div style={{ fontSize: '1rem', fontWeight: 800, color: s.color, marginTop: 2 }}>{s.value}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: 'linear-gradient(90deg,#1D5CE3,#065f46)', width: `${Math.min(100, currentPlan.netFee > 0 ? (currentPlan.totalPaid / currentPlan.netFee) * 100 : 0).toFixed(1)}%`, borderRadius: 99, transition: 'width .4s' }} />
                            </div>
                            <div style={{ fontSize: '.72rem', color: '#94a3b8', marginTop: 4 }}>
                              {currentPlan.paidCount}/{currentPlan.durationMonths} months paid · Started {currentPlan.startDate}
                            </div>
                          </div>

                          {/* Multi-pay toggle */}
                          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <button onClick={() => setPayForm(p => ({ ...p, multi: !p.multi, ids: [], open: false }))}
                              style={{ flex: 1, padding: '7px 0', border: `2px solid ${payForm.multi ? '#1D5CE3' : '#e2e8f0'}`, borderRadius: 10, background: payForm.multi ? '#eff6ff' : '#fff', color: payForm.multi ? '#1D5CE3' : '#64748b', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer' }}>
                              {payForm.multi ? '✓ Select Months' : 'Pay Multiple Months'}
                            </button>
                            {payForm.multi && payForm.ids.length > 0 && (
                              <button onClick={() => setPayForm(p => ({ ...p, open: true }))}
                                style={{ padding: '7px 14px', background: '#1D5CE3', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.8rem', cursor: 'pointer' }}>
                                Pay {payForm.ids.length}
                              </button>
                            )}
                          </div>

                          {/* Instalments */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {currentPlan.installments.map(inst => {
                              const st = instStatus(inst)
                              const isSelected = payForm.ids.includes(Number(inst.id))
                              return (
                                <div key={inst.id}
                                  onClick={() => payForm.multi && inst.status !== 'paid' ? multiToggle(Number(inst.id)) : undefined}
                                  style={{ border: `1.5px solid ${isSelected ? '#1D5CE3' : '#e2e8f0'}`, borderRadius: 12, padding: '10px 14px', background: isSelected ? '#eff6ff' : '#fff', cursor: payForm.multi && inst.status !== 'paid' ? 'pointer' : 'default' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                                      {payForm.multi && inst.status !== 'paid' && (
                                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isSelected ? '#1D5CE3' : '#cbd5e1'}`, background: isSelected ? '#1D5CE3' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                          {isSelected && <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>✓</span>}
                                        </div>
                                      )}
                                      <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: '.82rem', color: '#0d0d0d' }}>{inst.label}</div>
                                        <div style={{ fontSize: '.72rem', color: '#94a3b8', marginTop: 1 }}>Due: {inst.dueDate}{inst.paidDate ? ` · Paid: ${inst.paidDate}` : ''}</div>
                                        {inst.notes && <div style={{ fontSize: '.7rem', color: '#94a3b8', marginTop: 1, fontStyle: 'italic' }}>{inst.notes}</div>}
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                      <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, fontSize: '.88rem', color: '#0d0d0d' }}>{fmt(inst.amount)}</div>
                                        {inst.paidAmount > 0 && <div style={{ fontSize: '.72rem', color: '#065f46', fontWeight: 700 }}>Paid: {fmt(inst.paidAmount)}</div>}
                                      </div>
                                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '.7rem', fontWeight: 700, background: st.bg, color: st.color, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                        {st.label}
                                      </span>
                                      {inst.status === 'paid' ? (
                                        <button onClick={() => generateInstallmentReceipt(inst, { ...sel, joinDate: sel.joinDate ?? '' }, currentPlan)}
                                          style={{ padding: '4px 8px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 8, cursor: 'pointer', fontSize: '.72rem', fontWeight: 700, color: '#065f46', whiteSpace: 'nowrap' }}>
                                          ↓ Receipt
                                        </button>
                                      ) : !payForm.multi ? (
                                        <button onClick={() => paySingle(inst)}
                                          style={{ padding: '4px 10px', background: '#1D5CE3', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '.75rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                                          Pay
                                        </button>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Pay form */}
                          {payForm.open && (
                            <div style={{ marginTop: 14, background: '#f8fafc', borderRadius: 12, padding: 14, border: '1.5px solid #e2e8f0' }}>
                              <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#0d0d0d', marginBottom: 10 }}>
                                Record Payment — {payForm.ids.length} instalment{payForm.ids.length > 1 ? 's' : ''}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div>
                                  <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Payment Date</label>
                                  <input type="date" value={payForm.date} onChange={e => setPayForm(p => ({ ...p, date: e.target.value }))} style={panelInputSt} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3 }}>Notes (optional)</label>
                                  <input type="text" placeholder="e.g. Cash, UPI…" value={payForm.notes} onChange={e => setPayForm(p => ({ ...p, notes: e.target.value }))} style={panelInputSt} />
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button onClick={confirmPay} disabled={paySaving}
                                    style={{ flex: 1, padding: '8px 0', background: '#065f46', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer' }}>
                                    {paySaving ? 'Saving…' : 'Confirm Payment'}
                                  </button>
                                  <button onClick={() => setPayForm(p => ({ ...p, open: false }))}
                                    style={{ padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', color: '#64748b' }}>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

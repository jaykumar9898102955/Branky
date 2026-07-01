'use client'
import { useState } from 'react'
import { CheckCircle, BadgeCheck, Phone, Mail } from 'lucide-react'

const ageGroups = ['4–6 Years', '7–10 Years', '11–14 Years']
const programOptions = [
  'STEM Foundations (4–6 Years)',
  'Foundation of Robotics – Level 1 (7–10)',
  'Core Robotics & Coding (11–14)',
  'Not Sure – Need Guidance',
]
const timeSlots = ['Morning', 'Afternoon', 'Evening']

export default function BookingForm() {
  const [form, setForm] = useState({
    childName:'', parentName:'', phone:'', schoolName:'',
    ageGroup:'', program:'', demoDate:'', timeSlot:'', city:'Vadodara', message:''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]:v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!form.childName || !form.parentName || !form.phone || !form.ageGroup || !form.program) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/registrations', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          studentName: form.childName,
          parentName: form.parentName,
          phone: form.phone,
          email: '',
          age: form.ageGroup,
          program: form.program,
          city: form.city,
          source: 'Website',
          message: [
            form.schoolName ? `School: ${form.schoolName}` : '',
            form.demoDate ? `Demo Date: ${form.demoDate}` : '',
            form.timeSlot ? `Time Slot: ${form.timeSlot}` : '',
            form.message,
          ].filter(Boolean).join(' | ')
        })
      })
      if(res.ok) setSuccess(true)
      else { const d = await res.json(); setError(d.error || 'Something went wrong. Please try again.') }
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  if(success) {
    return (
      <div style={{ textAlign:'center', padding:'64px 32px', background:'var(--green-pale,#d1fae5)', borderRadius:28, border:'2px solid rgba(16,185,129,.3)' }}>
        <div style={{ width:72, height:72, background:'rgba(16,185,129,.15)', borderRadius:50, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', animation:'successPop .6s ease both' }}>
          <CheckCircle size={36} style={{ color:'#10b981' }} />
        </div>
        <h3 className="h-display" style={{ fontSize:'1.6rem', color:'var(--black)', marginBottom:12 }}>Demo Session Booked!</h3>
        <p style={{ color:'var(--gray)', lineHeight:1.75, marginBottom:8 }}>
          Thank you! Our team will call you within 24 hours to confirm your Free Demo Session.
        </p>
        <p style={{ fontSize:'.85rem', color:'var(--gray-mid)', display:'flex', alignItems:'center', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Phone size={14} /> +91 91044 01104</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Mail size={14} /> brankystemlab@gmail.com</span>
        </p>
      </div>
    )
  }

  const field = (label: string, required: boolean, children: React.ReactNode) => (
    <div>
      <label style={{ display:'block', fontSize:'.85rem', fontWeight:800, color:'var(--text)', marginBottom:8 }}>
        {label}{required && <span style={{ color:'var(--orange)' }}> *</span>}
      </label>
      {children}
    </div>
  )

  const radioGroup = (key: string, opts: string[]) => (
    <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
      {opts.map(o => (
        <label key={o} className="booking-radio-label">
          <input type="radio" name={key} value={o} checked={form[key as keyof typeof form]===o} onChange={() => set(key, o)} />
          {o}
        </label>
      ))}
    </div>
  )

  return (
    <form onSubmit={submit} style={{ background:'#fff', borderRadius:28, border:'2px solid var(--blue-pale)', padding:'48px 44px', boxShadow:'0 16px 48px rgba(29,92,227,.08)' }} className="booking-form">
      {/* Gradient top bar */}
      <div style={{ height:5, background:'linear-gradient(90deg,var(--blue),var(--orange))', borderRadius:'4px 4px 0 0', margin:'-48px -44px 40px', position:'relative', zIndex:1 }} className="form-bar" />

      <h2 className="h-display" style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)', color:'var(--black)', marginBottom:8 }}>
        Book Your Child's Free Demo Session
      </h2>
      <p style={{ fontSize:'.92rem', color:'var(--gray)', lineHeight:1.7, marginBottom:36 }}>
        Experience hands-on learning in AI, Robotics, Coding &amp; Future Technologies at Branky STEM Labs.
      </p>

      {error && (
        <div style={{ padding:'14px 18px', background:'#fef2f2', border:'2px solid #fca5a5', borderRadius:14, marginBottom:24, fontSize:'.9rem', color:'#dc2626', fontWeight:700 }}>
          {error}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }} className="form-grid-2">
        {field("Child's Name", true, <input value={form.childName} onChange={e=>set('childName',e.target.value)} placeholder="Enter child's full name" />)}
        {field("Parent / Guardian Name", true, <input value={form.parentName} onChange={e=>set('parentName',e.target.value)} placeholder="Enter parent's name" />)}
        {field("Contact Number", true, <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91 XXXXX XXXXX" />)}
        {field("Child's School Name", false, <input value={form.schoolName} onChange={e=>set('schoolName',e.target.value)} placeholder="School name (optional)" />)}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:24, marginBottom:28 }}>
        {field("Child's Age Group", true, radioGroup('ageGroup', ageGroups))}
        {field("Select Program Interested In", true, radioGroup('program', programOptions))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }} className="form-grid-2">
        {field("Preferred Demo Date", false,
          <input type="date" value={form.demoDate} onChange={e=>set('demoDate',e.target.value)}
            min={new Date().toISOString().split('T')[0]} />
        )}
        {field("City", false, <input value={form.city} onChange={e=>set('city',e.target.value)} placeholder="Vadodara" />)}
      </div>

      {field("Preferred Time Slot", false, radioGroup('timeSlot', timeSlots))}

      <div style={{ marginTop:24, marginBottom:32 }}>
        <label style={{ display:'block', fontSize:'.85rem', fontWeight:800, color:'var(--text)', marginBottom:8 }}>
          Any Questions / Message? <span style={{ fontWeight:400, color:'var(--gray-mid)' }}>(Optional)</span>
        </label>
        <textarea rows={4} value={form.message} onChange={e=>set('message',e.target.value)}
          placeholder="Tell us anything you'd like us to know — about your child's interests, current skills, questions etc." />
      </div>

      <button type="submit" className="btn btn-orange btn-lg" disabled={loading}
        style={{ width:'100%', justifyContent:'center', opacity:loading?.8:1, transition:'opacity .2s' }}>
        {loading ? 'Booking...' : "Reserve My Child's Free Demo Session →"}
      </button>

      <p style={{ textAlign:'center', fontSize:'.78rem', color:'var(--gray-mid)', marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
        <BadgeCheck size={14} style={{ color:'var(--blue)', flexShrink:0 }} />
        Your information is safe. We never share your data.
      </p>

      <style dangerouslySetInnerHTML={{__html:`
        .booking-form .form-grid-2 { grid-template-columns:1fr 1fr; }
        @media(max-width:600px){
          .booking-form{padding:32px 24px!important;}
          .booking-form .form-bar{margin:-32px -24px 32px!important;}
          .booking-form .form-grid-2{grid-template-columns:1fr!important;}
        }
      `}} />
    </form>
  )
}

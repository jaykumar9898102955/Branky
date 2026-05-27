'use client'
import { useEffect } from 'react'
import { FlaskConical, GraduationCap, BadgeCheck, Users } from 'lucide-react'

const badges = [
  { IC:FlaskConical, label:'Smart Labs', sub:'State-of-the-art equipment', color:'var(--blue)' },
  { IC:GraduationCap, label:'Expert Mentors', sub:'Industry-trained educators', color:'var(--orange)' },
  { IC:BadgeCheck, label:'Certified Course', sub:'Structured curriculum', color:'var(--blue)' },
  { IC:Users, label:'Inclusive Batches', sub:'8–12 students per batch', color:'var(--orange)' },
]

export default function TrustBarSection() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold:0.2 }
    )
    document.querySelectorAll('.trust-badge').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section style={{ background:'var(--blue-xpale)', padding:'48px 5%', borderTop:'1px solid var(--blue-pale)', borderBottom:'1px solid var(--blue-pale)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }} className="trust-grid">
        {badges.map((b, i) => (
          <div key={b.label} className={`trust-badge d${i+1}`} style={{ display:'flex', alignItems:'center', gap:16, padding:'20px 22px', background:'#fff', borderRadius:20, border:'2px solid var(--blue-pale)', boxShadow:'0 4px 18px rgba(29,92,227,.06)' }}>
            <div style={{ width:52, height:52, background: i%2===0 ? 'var(--blue-pale)' : 'var(--orange-pale)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <b.IC size={26} style={{ color:b.color }} />
            </div>
            <div>
              <strong style={{ display:'block', fontSize:'.95rem', fontWeight:800, color:'var(--black)', lineHeight:1.2 }}>{b.label}</strong>
              <span style={{ fontSize:'.78rem', color:'var(--gray)', lineHeight:1.4 }}>{b.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){ .trust-grid{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:480px){ .trust-grid{grid-template-columns:1fr!important;} }
      `}} />
    </section>
  )
}

'use client'
import { Medal, Zap, GraduationCap, Monitor, Target, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const events: { IC: LucideIcon; title: string; desc: string }[] = [
  { IC:Medal,         title:'Competition Training', desc:'Prepare for WRO, FLL and national robotics olympiads with expert coaching and practice matches.' },
  { IC:Zap,           title:'Hackathons',           desc:'Time-bound innovation challenges where students solve real-world problems with technology.' },
  { IC:GraduationCap, title:'Holiday Workshops',   desc:'Intensive weekend and holiday workshops covering specific technology themes and skills.' },
  { IC:Monitor,       title:'Project Exhibitions',  desc:'Showcase student projects to parents, industry professionals and the wider community.' },
  { IC:Target,        title:'Personalised Projects',desc:"One-on-one guided project work tailored to each student's interest and program level." },
  { IC:Rocket,        title:'Demo Sessions',        desc:'Try-before-you-join sessions — hands-on 45-minute tasters for prospective students.' },
]

export default function BootcampCards() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="bootcamp-grid">
      {events.map((e, i) => (
        <div key={e.title} className={`reveal d${(i%3)+1}`}
          style={{ background:'#fff', border:'2px solid var(--blue-pale)', borderRadius:24, padding:'28px 24px', transition:'all .4s', cursor:'default' }}
          onMouseEnter={el => { const t=el.currentTarget as HTMLElement; t.style.transform='translateY(-8px)'; t.style.borderColor='var(--orange)'; t.style.boxShadow='0 20px 48px rgba(255,147,30,.12)' }}
          onMouseLeave={el => { const t=el.currentTarget as HTMLElement; t.style.transform=''; t.style.borderColor='var(--blue-pale)'; t.style.boxShadow='' }}>
          <div style={{ width:52, height:52, background:'var(--blue-pale)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
            <e.IC size={26} style={{ color:'var(--blue)' }} />
          </div>
          <h3 className="h-display" style={{ fontSize:'1.1rem', fontWeight:400, color:'var(--black)', marginBottom:10 }}>{e.title}</h3>
          <p style={{ fontSize:'.88rem', color:'var(--gray)', lineHeight:1.7, margin:0 }}>{e.desc}</p>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){ .bootcamp-grid{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:480px){ .bootcamp-grid{grid-template-columns:1fr!important;} }
      `}} />
    </div>
  )
}

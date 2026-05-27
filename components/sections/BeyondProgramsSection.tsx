'use client'
import Link from 'next/link'
import { Medal, Zap, GraduationCap, Monitor, Target, Rocket, FlaskConical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const differentiators: { IC: LucideIcon; title: string; desc: string }[] = [
  { IC:Medal,         title:'Competition Training', desc:'WRO, FLL and national olympiad preparation' },
  { IC:Zap,           title:'Hackathons',           desc:'Time-bound innovation challenges' },
  { IC:GraduationCap, title:'Workshops',            desc:'Intensive skill-focused sessions' },
  { IC:Monitor,       title:'Project Exhibitions',  desc:'Student showcases for parents & community' },
  { IC:Target,        title:'Personalised Projects',desc:'Tailored builds for each student' },
  { IC:Rocket,        title:'Demo Sessions',        desc:'Try before you join — free 45-min tasters' },
  { IC:FlaskConical,  title:'Bootcamps',            desc:'Intensive multi-day deep-dive programs' },
]

export default function BeyondProgramsSection() {
  return (
    <section style={{ padding:'96px 5%', background:'#fff', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div className="tag tag-orange reveal">Beyond Programs</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.6rem,3vw,2.5rem)', color:'var(--black)', marginBottom:16, lineHeight:1.2 }}>
          More Than a Classroom —<br/>
          <span style={{ color:'var(--blue)' }}>A Complete Tech Ecosystem</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex', gap:8, marginBottom:48 }}>
          <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
          <div style={{ height:4, width:110, background:'var(--blue)', borderRadius:8 }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }} className="beyond-grid">
          {differentiators.map((d, i) => (
            <div key={d.title} className={`reveal d${(i%4)+1}`}
              style={{ background:'var(--blue-xpale)', border:'2px solid var(--blue-pale)', borderRadius:22, padding:'24px 20px', transition:'all .4s', cursor:'default' }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background='var(--blue)'; el.style.borderColor='var(--blue)'; el.style.transform='translateY(-6px)'; el.style.boxShadow='0 20px 48px rgba(29,92,227,.2)' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background='var(--blue-xpale)'; el.style.borderColor='var(--blue-pale)'; el.style.transform=''; el.style.boxShadow='' }}
            >
              <div style={{ marginBottom:12 }}>
                <d.IC size={28} className="beyond-icon" style={{ color:'var(--blue)' }} />
              </div>
              <strong style={{ display:'block', fontSize:'.95rem', fontWeight:800, color:'inherit', marginBottom:6, transition:'color .3s' }}>{d.title}</strong>
              <span style={{ fontSize:'.82rem', color:'var(--gray)', lineHeight:1.5, transition:'color .3s' }}>{d.desc}</span>
            </div>
          ))}
        </div>

        <div className="reveal d3" style={{ marginTop:48, textAlign:'center' }}>
          <Link href="/bootcamp-workshops" className="btn btn-blue btn-lg">View All Events &amp; Workshops →</Link>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        .beyond-grid>div:hover>strong{color:#fff!important;}
        .beyond-grid>div:hover>span{color:rgba(255,255,255,.75)!important;}
        .beyond-grid>div:hover .beyond-icon{color:#fff!important;}
        @media(max-width:860px){ .beyond-grid{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:480px){ .beyond-grid{grid-template-columns:1fr!important;} }
      `}} />
    </section>
  )
}

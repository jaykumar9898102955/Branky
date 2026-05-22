import Image from 'next/image'
import { FlaskConical, Code2, Settings, Rocket, Dna, Leaf, Monitor, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const mentors: { Icon: LucideIcon; name: string; role: string; org: string; accent: string }[] = [
  { Icon:FlaskConical, name:'Ravi Patel', role:'Lead Robotics', org:'Ex-ISRO · IIT Bombay', accent:'blue' },
  { Icon:Code2, name:'Priya Sharma', role:'AI & Coding Lead', org:'Google · 8 yrs', accent:'orange' },
  { Icon:Settings, name:'Arjun Mehta', role:'Mechanical Design', org:'Tesla · IIT Delhi', accent:'blue' },
  { Icon:Rocket, name:'Neha Kapoor', role:'Space & Electronics', org:'DRDO · ISRO Fellow', accent:'orange' },
  { Icon:Dna, name:'Dr. Suman Das', role:'Biomedical Engineer', org:'AIIMS · Niramai', accent:'blue' },
  { Icon:Leaf, name:'Kavya Reddy', role:'Clean Energy', org:'IIT Madras · Ola', accent:'orange' },
  { Icon:Monitor, name:'Rohan Joshi', role:'Full-Stack Dev', org:'Meta · 6 yrs', accent:'blue' },
  { Icon:Target, name:'Anjali Singh', role:'Curriculum Director', org:'MIT Sloan · EdTech', accent:'orange' },
]

export default function MentorsSection() {
  return (
    <section id="mentors" style={{ background:'#fff', padding:'96px 5%', position:'relative', overflow:'hidden' }}>
      {/* Top stripe */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:5, background:'linear-gradient(90deg,var(--orange),var(--blue),var(--orange))' }} />

      {/* Logo watermark */}
      <div style={{ position:'absolute', right:'3%', top:48, opacity:.04, pointerEvents:'none' }}>
        <Image src="/assets/logo-icon-blue.png" alt="" width={200} height={200} style={{ objectFit:'contain' }} />
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="tag tag-orange reveal">Meet the Team</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'var(--black)', marginBottom:12 }}>
          Learn from <span style={{ color:'var(--orange)' }}>practitioners</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex', gap:8, marginBottom:16 }}>
          <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
          <div style={{ height:4, width:110, background:'var(--blue)', borderRadius:8 }} />
        </div>
        <p className="reveal d2" style={{ color:'var(--gray)', fontSize:'1rem', lineHeight:1.7, marginBottom:48 }}>
          Our mentors are engineers and scientists who work in industry — bringing real-world experience to every session.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {mentors.map((m, i) => (
            <div key={m.name} className={`reveal d${(i%4)+1}`}
              style={{ background:'#fff', borderRadius:20, padding:'24px 18px', textAlign:'center', border:`2px solid ${m.accent==='blue'?'var(--blue-pale)':'var(--orange-pale)'}`, transition:'all .4s cubic-bezier(.23,1,.32,1)', cursor:'default' }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=m.accent==='blue'?'var(--blue)':'var(--orange)'; el.style.transform='translateY(-10px)'; el.style.boxShadow=m.accent==='blue'?'0 20px 48px rgba(29,92,227,.13)':'0 20px 48px rgba(255,147,30,.13)' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=m.accent==='blue'?'var(--blue-pale)':'var(--orange-pale)'; el.style.transform=''; el.style.boxShadow='' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', margin:'0 auto 14px', background:`linear-gradient(135deg,${m.accent==='blue'?'var(--blue-pale),var(--blue-xpale)':'var(--orange-pale),#fff3e0'})`, display:'flex', alignItems:'center', justifyContent:'center', border:`3px solid ${m.accent==='blue'?'var(--blue-pale)':'var(--orange-pale)'}`, transition:'border-color .3s', color:m.accent==='blue'?'var(--blue)':'var(--orange)' }}><m.Icon size={32}/></div>
              <div style={{ fontWeight:800, fontSize:'.92rem', color:'var(--black)', marginBottom:4 }}>{m.name}</div>
              <div style={{ fontSize:'.78rem', color:m.accent==='blue'?'var(--blue)':'var(--orange)', fontWeight:700, marginBottom:3 }}>{m.role}</div>
              <div style={{ fontSize:'.73rem', color:'var(--gray-mid)' }}>{m.org}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:860px){#mentors{padding:64px 20px!important;} #mentors>div>div:last-child{grid-template-columns:1fr 1fr!important;}}`}</style>
    </section>
  )
}

import { Bot, Cpu, Code2, Zap, Rocket, Settings, Globe, Users, Monitor, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const techTags: { IC: LucideIcon; label: string; color: string }[] = [
  { IC:Bot,      label:'Robotics',              color:'blue' },
  { IC:Cpu,      label:'Artificial Intelligence', color:'orange' },
  { IC:Code2,    label:'Python Coding',          color:'blue' },
  { IC:Zap,      label:'Electronics',            color:'orange' },
  { IC:Rocket,   label:'Drones',                 color:'blue' },
  { IC:Settings, label:'Mechatronics',           color:'orange' },
  { IC:Globe,    label:'IoT',                    color:'blue' },
  { IC:Users,    label:'Leadership',             color:'orange' },
  { IC:Monitor,  label:'Tech Designing',         color:'blue' },
  { IC:Target,   label:'Problem Solving',        color:'orange' },
]
const doubled = [...techTags, ...techTags]

export default function TechPillsSection() {
  return (
    <section style={{ padding:'64px 0', background:'#fff', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 5%', marginBottom:32, textAlign:'center' }}>
        <div className="tag tag-blue reveal" style={{ margin:'0 auto 12px' }}>Future Technologies Students Explore</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', color:'var(--black)', marginBottom:10 }}>
          Skills shaping the <span style={{ color:'var(--orange)' }}>innovators, engineers</span> and creators of 2035
        </h2>
      </div>

      {/* Marquee strip */}
      <div style={{ position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, background:'linear-gradient(to right,#fff,transparent)', zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, background:'linear-gradient(to left,#fff,transparent)', zIndex:2, pointerEvents:'none' }} />

        <div style={{ overflow:'hidden', padding:'12px 0' }}>
          <div className="pills-track">
            {doubled.map((tag, i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 22px', background: tag.color==='blue' ? 'var(--blue-xpale)' : 'var(--orange-pale)', border:`2px solid ${tag.color==='blue'?'rgba(29,92,227,.15)':'rgba(255,147,30,.18)'}`, borderRadius:50, fontFamily:"'Karla',sans-serif", fontWeight:700, fontSize:'.88rem', color:'var(--text)', marginRight:12, flexShrink:0, whiteSpace:'nowrap' }}>
                <tag.IC size={16} style={{ color: tag.color==='blue'?'var(--blue)':'var(--orange)', flexShrink:0 }} />
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'

const programs = [
  { img:'/assets/robot2.png', badge:'Ages 8–14', bt:'blue', title:'Robotics Bootcamp', desc:'Build, program, and compete with robots using LEGO Technic, Arduino, and sensors. 12-week intensive.', duration:'12 Weeks', level:'Beginner Friendly', program:'Robotics Bootcamp' },
  { img:'/assets/robot5.png', badge:'Ages 12–18', bt:'orange', title:'AI & Coding Camp', desc:'Python, machine learning, computer vision, and deploying real AI projects. Learn by doing.', duration:'8 Weeks', level:'Intermediate', program:'AI & Coding Camp' },
  { img:'/assets/robot4.png', badge:'Ages 10–16', bt:'blue', title:'Engineering Design', desc:'Mechanical design, gears, pulleys, 3D printing and structural engineering. Idea to prototype.', duration:'6 Weeks', level:'All Levels', program:'Engineering Design' },
  { img:'/assets/robot3.png', badge:'Ages 10–16', bt:'orange', title:'Space Science', desc:'Satellite design, orbital mechanics, propulsion basics, and model rocketry. Reach for the stars.', duration:'8 Weeks', level:'Intermediate', program:'Space Science' },
  { img:'/assets/robot6.png', badge:'Ages 8–18', bt:'blue', title:'Electronics & IoT', desc:'Circuits, sensors, microcontrollers, and building connected smart devices. The future is now.', duration:'6 Weeks', level:'Beginner', program:'Electronics & IoT' },
  { img:'/assets/robot1.png', badge:'Ages 12–18', bt:'orange', title:'Summer Intensive', desc:'All programs combined into one action-packed 4-week summer camp. The ultimate STEM experience.', duration:'4 Weeks', level:'Mixed Levels', program:'Summer Intensive' },
]

export default function ProgramsSection({ onApply }: { onApply: (p: string) => void }) {
  return (
    <section id="programs" style={{ padding:'96px 5%', background:'#fff', position:'relative', overflow:'hidden' }}>
      {/* Brand grid bg */}
      <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/brand-grid.png')", backgroundSize:'cover', opacity:.025, pointerEvents:'none', zIndex:0 }} />
      {/* Top stripe */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:5, background:'linear-gradient(90deg,var(--blue),var(--orange),var(--blue))' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="tag tag-orange reveal">Programs</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'var(--black)', marginBottom:12 }}>
          Hands-on STEM for <span style={{ color:'var(--blue)' }}>every age</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex', gap:8, marginBottom:16 }}>
          <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
          <div style={{ height:4, width:110, background:'var(--blue)', borderRadius:8 }} />
        </div>
        <p className="reveal d2" style={{ fontSize:'1rem', color:'var(--gray)', lineHeight:1.7, marginBottom:52, maxWidth:520 }}>
          Six tracks designed by engineers, taught by practitioners. Real equipment, real projects, real results.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {programs.map((p, i) => (
            <div key={p.title} className={`reveal d${(i%3)+1}`}
              onClick={() => onApply(p.program)}
              style={{ background:'#fff', borderRadius:24, border:`2px solid ${p.bt==='blue'?'var(--blue-pale)':'var(--orange-pale)'}`, overflow:'hidden', cursor:'pointer', display:'flex', flexDirection:'column', transition:'all .4s cubic-bezier(.23,1,.32,1)' }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.transform='translateY(-10px)'; el.style.boxShadow='0 28px 56px rgba(29,92,227,.14)'; el.style.borderColor=p.bt==='blue'?'var(--blue)':'var(--orange)' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow=''; el.style.borderColor=p.bt==='blue'?'var(--blue-pale)':'var(--orange-pale)' }}>
              <div style={{ height:200, overflow:'hidden', position:'relative', flexShrink:0 }}>
                <Image src={p.img} alt={p.title} fill style={{ objectFit:'cover', transition:'transform .5s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform=''} />
                <div style={{ position:'absolute', top:14, left:14, padding:'4px 12px', borderRadius:50, fontSize:'.7rem', fontWeight:800, letterSpacing:'.07em', textTransform:'uppercase', background:p.bt==='blue'?'var(--blue)':'var(--orange)', color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,.2)' }}>{p.badge}</div>
              </div>
              <div style={{ padding:'22px 22px 26px', display:'flex', flexDirection:'column', flex:1 }}>
                <h3 className="h-display" style={{ fontSize:'1.1rem', fontWeight:400, color:'var(--black)', marginBottom:9 }}>{p.title}</h3>
                <p style={{ fontSize:'.87rem', color:'var(--gray)', lineHeight:1.65, flex:1, marginBottom:18 }}>{p.desc}</p>
                <div style={{ display:'flex', gap:14, paddingTop:14, borderTop:`2px solid ${p.bt==='blue'?'var(--blue-pale)':'var(--orange-pale)'}` }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.77rem', color:'var(--gray)', fontWeight:700 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--orange)', display:'inline-block' }} />{p.duration}
                  </span>
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.77rem', color:'var(--gray)', fontWeight:700 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--blue)', display:'inline-block' }} />{p.level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`@media(max-width:860px){#programs{padding:64px 20px!important;} #programs>div>div:last-child{grid-template-columns:1fr!important;}}`}} />
    </section>
  )
}

'use client'
import { useEffect } from 'react'

const steps = [
  { label:'Foundations', sub:'Core STEM concepts' },
  { label:'Experimentation', sub:'Hands-on building' },
  { label:'Project Building', sub:'Real-world projects' },
  { label:'Tech Challenges', sub:'Competitive events' },
  { label:'Global Competitions', sub:'WRO, FLL & more' },
  { label:'Future Problem Solvers', sub:'Ready for tomorrow' },
]

export default function ProgressStepsSection() {
  useEffect(() => {
    const section = document.querySelector('.progress-steps-section')
    if(!section) return
    const io = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting) {
        document.querySelectorAll<HTMLElement>('.step-connector-fill').forEach((el, i) => {
          setTimeout(() => el.classList.add('animated'), i * 320)
        })
        io.disconnect()
      }
    }, { threshold: 0.3 })
    io.observe(section)
    return () => io.disconnect()
  }, [])

  return (
    <section className="progress-steps-section" style={{ padding:'96px 5%', background:'var(--blue-xpale)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div className="tag tag-blue reveal" style={{ marginBottom:16 }}>Learning Journey</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.6rem,3vw,2.5rem)', color:'var(--black)', marginBottom:48, lineHeight:1.2 }}>
          From Curious Beginner to <span style={{ color:'var(--orange)' }}>Future Problem Solver</span>
        </h2>

        {/* Steps — horizontal on desktop */}
        <div className="reveal d2 steps-row" style={{ display:'flex', alignItems:'flex-start', overflowX:'auto', paddingBottom:8, gap:0 }}>
          {steps.map((step, i) => (
            <div key={step.label} style={{ display:'flex', alignItems:'flex-start', flex: i < steps.length-1 ? '1' : '0 0 auto', minWidth:0 }}>
              {/* Step node */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, width:112 }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background: i === steps.length-1 ? 'var(--orange)' : 'var(--blue)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Fredoka One','Karla',sans-serif", fontSize:'1.1rem', fontWeight:400, zIndex:1, boxShadow: i === steps.length-1 ? '0 6px 20px rgba(255,147,30,.35)' : '0 6px 20px rgba(29,92,227,.25)' }}>
                  {i + 1}
                </div>
                <strong style={{ marginTop:12, fontSize:'.78rem', textAlign:'center', color:'var(--black)', fontWeight:800, lineHeight:1.3, padding:'0 4px', display:'block' }}>
                  {step.label}
                </strong>
                <span style={{ fontSize:'.68rem', color:'var(--gray)', textAlign:'center', marginTop:4, padding:'0 4px' }}>
                  {step.sub}
                </span>
              </div>
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="step-connector" style={{ marginTop:24, flex:1 }}>
                  <div className="step-connector-fill" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){
          .steps-row{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:16px;}
          .steps-row>div{min-width:90px;}
        }
      `}} />
    </section>
  )
}

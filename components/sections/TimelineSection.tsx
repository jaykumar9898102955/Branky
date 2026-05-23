import Image from 'next/image'
import { Trophy } from 'lucide-react'

const steps = [
  { week:'Weeks 1–2', color:'var(--blue)', title:'Orientation & Foundations', desc:"Meet your team, get your kit, and set up your tools. Day-7 mini-hackathon with prizes!", side:'left' },
  { week:'Weeks 3–5', color:'var(--orange)', title:'Core Skills Sprint', desc:'Deep-dive into your chosen track. Daily builds, weekly challenges, mentor check-ins every Friday.', side:'right' },
  { week:'Weeks 6–8', color:'var(--blue)', title:'Project Build Phase', desc:"Start your signature project. Apply everything you've learned with full mentor support.", side:'left' },
  { week:'Weeks 9–11', color:'var(--orange)', title:'Refinement & Testing', desc:'Polish your project, iterate with engineer feedback, and prepare your demo presentation.', side:'right' },
  { week:'Week 12', color:'var(--blue)', title:'Demo Day & Celebration', desc:'Present to parents, industry experts & fellow innovators. Receive your Branky certification!', side:'left', highlight:true },
]

export default function TimelineSection() {
  return (
    <section id="timeline" style={{ background:'var(--gray-xlight)', padding:'96px 5%', position:'relative', overflow:'hidden' }}>
      {/* Blueprint grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/brand-grid.png')", backgroundSize:'cover', opacity:.035, pointerEvents:'none', zIndex:0 }} />
      {/* Brand wave decor */}
      <div style={{ position:'absolute', right:-30, bottom:40, width:'16%', maxWidth:160, opacity:.06, pointerEvents:'none', transform:'rotate(180deg)' }}>
        <Image src="/assets/brand-wave.png" alt="" width={160} height={160} style={{ width:'100%', height:'auto' }} />
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="tag tag-blue reveal">Bootcamp Journey</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'var(--black)', marginBottom:12 }}>
          Your 12-week <span style={{ color:'var(--blue)' }}>transformation</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex', gap:8, marginBottom:16 }}>
          <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
          <div style={{ height:4, width:110, background:'var(--blue)', borderRadius:8 }} />
        </div>
        <p className="reveal d2" style={{ color:'var(--gray)', fontSize:'1rem', lineHeight:1.7, marginBottom:68 }}>
          Every week is designed for maximum learning. No filler — just building, breaking, and growing.
        </p>

        {/* Timeline */}
        <div style={{ position:'relative' }}>
          {/* Center line */}
          <div className="tl-center-line" style={{ position:'absolute', left:'50%', top:0, bottom:0, width:4, background:'linear-gradient(to bottom,var(--blue),var(--orange),var(--blue))', transform:'translateX(-50%)', borderRadius:4 }} />

          {steps.map((s, i) => (
            <div key={i} className={`tl-row tl-row-${s.side}`} style={{ display:'grid', gridTemplateColumns:'1fr 72px 1fr', marginBottom:44, alignItems:'start' }}>
              {/* Left box or spacer */}
              {s.side==='left' ? (
                <div className="tl-box" style={{ paddingRight:36 }}>
                  <div style={{ background:'#fff', borderRadius:20, padding:'22px 26px', border:`2.5px solid ${s.highlight?s.color:'var(--blue-pale)'}`, boxShadow:s.highlight?`0 8px 28px rgba(29,92,227,.14)`:'var(--shadow-card)', transition:'all .3s', cursor:'default' }}
                    onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=s.color; el.style.boxShadow=`0 12px 36px rgba(29,92,227,.13)` }}
                    onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=s.highlight?s.color:'var(--blue-pale)'; el.style.boxShadow=s.highlight?`0 8px 28px rgba(29,92,227,.14)`:'var(--shadow-card)' }}>
                    <div style={{ fontSize:'.7rem', fontWeight:800, color:s.color, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>{s.week}{s.highlight&&<Trophy size={13}/>}</div>
                    <h4 className="h-display" style={{ fontSize:'1.05rem', fontWeight:400, color:'var(--black)', marginBottom:7 }}>{s.title}</h4>
                    <p style={{ fontSize:'.86rem', color:'var(--gray)', lineHeight:1.65 }}>{s.desc}</p>
                  </div>
                </div>
              ) : <div />}

              {/* Dot */}
              <div style={{ display:'flex', justifyContent:'center', paddingTop:22 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'#fff', border:`4px solid ${s.color}`, position:'relative', flexShrink:0, boxShadow:`0 0 0 5px ${s.color}22` }}>
                  <div style={{ position:'absolute', inset:4, background:s.color, borderRadius:'50%' }} />
                </div>
              </div>

              {/* Right box or spacer */}
              {s.side==='right' ? (
                <div className="tl-box" style={{ paddingLeft:36 }}>
                  <div style={{ background:'#fff', borderRadius:20, padding:'22px 26px', border:'2.5px solid var(--blue-pale)', boxShadow:'var(--shadow-card)', transition:'all .3s', cursor:'default' }}
                    onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=s.color; el.style.boxShadow=`0 12px 36px rgba(255,147,30,.11)` }}
                    onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor='var(--blue-pale)'; el.style.boxShadow='var(--shadow-card)' }}>
                    <div style={{ fontSize:'.7rem', fontWeight:800, color:s.color, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>{s.week}</div>
                    <h4 className="h-display" style={{ fontSize:'1.05rem', fontWeight:400, color:'var(--black)', marginBottom:7 }}>{s.title}</h4>
                    <p style={{ fontSize:'.86rem', color:'var(--gray)', lineHeight:1.65 }}>{s.desc}</p>
                  </div>
                </div>
              ) : <div />}
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        /* PC: alternating left/right — default inline style */
        /* Phone: all items stack as [dot | content] */
        @media(max-width:760px){
          #timeline { padding:64px 20px !important; }

          /* Shift the vertical line to align with the dots on the left */
          #timeline .tl-center-line { left:18px !important; transform:none !important; }

          /* Each row becomes: [36px dot col] [1fr content col] */
          .tl-row { grid-template-columns:36px 1fr !important; gap:0 10px !important; margin-bottom:28px !important; }

          /* Left steps: child1=content, child2=dot, child3=spacer
             → move content to col 2, dot to col 1, hide spacer */
          .tl-row-left > div:first-child  { grid-column:2 !important; grid-row:1 !important; padding:0 !important; }
          .tl-row-left > div:nth-child(2) { grid-column:1 !important; grid-row:1 !important; justify-content:flex-start !important; padding-left:6px !important; }
          .tl-row-left > div:last-child   { display:none !important; }

          /* Right steps: child1=spacer, child2=dot, child3=content
             → hide spacer, keep dot in col 1, move content to col 2 */
          .tl-row-right > div:first-child  { display:none !important; }
          .tl-row-right > div:nth-child(2) { grid-column:1 !important; justify-content:flex-start !important; padding-left:6px !important; }
          .tl-row-right > div:last-child   { grid-column:2 !important; padding:0 !important; }

          /* Remove horizontal padding from content wrappers (gap handles spacing) */
          .tl-box { padding:0 !important; }
        }
      `}} />
    </section>
  )
}

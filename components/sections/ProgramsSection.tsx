'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { programs } from '@/lib/programs-data'

const altText: Record<string, string> = {
  'stem-foundations': 'Young child exploring early robotics and STEM activities at Branky STEM Labs Vadodara',
  'foundation-of-robotics': 'Student assembling a robot and learning electronics at Branky STEM Labs Vadodara',
  'core-robotics-coding': 'Teenager building and coding a robotics project at Branky STEM Labs Vadodara',
}

export default function ProgramsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const idxRef = useRef(0)

  const scrollTo = (idx: number) => {
    const el = scrollRef.current
    if (!el) return
    const cards = el.children
    const total = cards.length
    idxRef.current = (idx + total) % total
    const card = cards[idxRef.current] as HTMLElement
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }

  useEffect(() => {
    const timer = setInterval(() => scrollTo(idxRef.current + 1), 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="programs" style={{ padding:'96px 5%', background:'#fff', position:'relative', overflow:'hidden' }}>
      {/* Brand grid bg */}
      <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/brand-grid.png')", backgroundSize:'cover', opacity:.025, pointerEvents:'none', zIndex:0 }} />
      {/* Top stripe */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:5, background:'linear-gradient(90deg,var(--blue),var(--orange),var(--blue))' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="tag tag-orange reveal">Programs</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'var(--black)', marginBottom:12 }}>
          A Learning Journey for <span style={{ color:'var(--blue)' }}>Every Young Tech Explorer</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex', gap:8, marginBottom:16 }}>
          <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
          <div style={{ height:4, width:110, background:'var(--blue)', borderRadius:8 }} />
        </div>
        <p id="programs-description" className="reveal d2" style={{ fontSize:'1rem', color:'var(--gray)', lineHeight:1.7, marginBottom:52, maxWidth:560 }}>
          A progressive learning journey that grows with your child's skills, creativity and ambition.
        </p>

        <div ref={scrollRef} className="programs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {programs.map((p, i) => (
            <div key={p.title}
              className={`prog-card${p.accent==='orange'?' orange-accent':''} reveal d${Math.min(i+1,4)}`}>

              {/* Image */}
              <div style={{ height:200, overflow:'hidden', position:'relative', flexShrink:0 }}>
                <Image src={p.img} alt={altText[p.slug]} fill style={{ objectFit:'cover', transition:'transform .5s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform='scale(1.06)')}
                  onMouseLeave={e => (e.currentTarget.style.transform='')} />
                {/* Age badge */}
                <div style={{ position:'absolute', top:14, left:14, padding:'4px 14px', borderRadius:50, fontSize:'.7rem', fontWeight:800, letterSpacing:'.07em', textTransform:'uppercase', background: p.accent==='orange'?'var(--orange)':'var(--blue)', color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,.2)' }}>
                  Age: {p.age}
                </div>
                {/* Duration badge */}
                <div style={{ position:'absolute', top:14, right:14, padding:'4px 12px', borderRadius:50, fontSize:'.68rem', fontWeight:700, background:'rgba(0,0,0,.55)', backdropFilter:'blur(8px)', color:'#fff' }}>
                  {p.duration}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding:'22px 24px 26px', display:'flex', flexDirection:'column', flex:1 }}>
                <h3 className="h-display" style={{ fontSize:'1.1rem', fontWeight:400, color:'var(--black)', marginBottom:14 }}>{p.title}</h3>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8, flex:1, marginBottom:20 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:'.87rem', color:'var(--gray)', lineHeight:1.55, minWidth:0 }}>
                      <span style={{ width:18, height:18, background: p.accent==='orange'?'var(--orange-pale)':'var(--blue-pale)', borderRadius:50, display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background: p.accent==='orange'?'var(--orange)':'var(--blue)', display:'block' }} />
                      </span>
                      <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/programs/${p.slug}`} className={`btn btn-${p.accent==='orange'?'orange':'outline'} btn-md`} style={{ alignSelf:'flex-start' }}>
                  Know More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile scroll buttons */}
        <div className="prog-nav" style={{ display:'none', justifyContent:'center', gap:12, marginTop:20 }}>
          <button onClick={() => scrollTo(idxRef.current - 1)} style={{ width:42, height:42, borderRadius:'50%', border:'2px solid var(--blue)', background:'#fff', color:'var(--blue)', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>‹</button>
          <button onClick={() => scrollTo(idxRef.current + 1)} style={{ width:42, height:42, borderRadius:'50%', border:'none', background:'var(--blue)', color:'#fff', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>›</button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){
          .prog-nav{display:flex!important;}
          #programs{padding:64px 0 64px!important;}
          #programs>div{padding:0 20px;}
          #programs>div>p,#programs>div>.tag,#programs>div>h2,#programs>div>div{padding-left:0;padding-right:0;}
          .programs-grid{
            display:flex!important;
            flex-direction:row!important;
            overflow-x:auto!important;
            gap:16px!important;
            padding:8px 20px 20px!important;
            scroll-snap-type:x mandatory;
            -webkit-overflow-scrolling:touch;
            scrollbar-width:none;
          }
          .programs-grid::-webkit-scrollbar{display:none;}
          .programs-grid>div{
            grid-column:auto!important;
            min-width:78vw!important;
            max-width:320px!important;
            flex-shrink:0;
            scroll-snap-align:start;
          }
        }
        @media(max-width:576px){
           #programs-description{
             margin-bottom : 10px !important;
             }
           }
        @media(max-width:480px){
          #programs{padding:52px 0 52px!important;}
          .programs-grid>div{min-width:86vw!important;}
        }
      `}} />
    </section>
  )
}

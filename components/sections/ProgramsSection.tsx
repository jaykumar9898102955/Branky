'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { programs } from '@/lib/programs-data'
import { Check } from 'lucide-react'

const altText: Record<string, string> = {
  'stem-foundations': 'Young child exploring early robotics and STEM activities at Branky STEM Labs Vadodara',
  'foundation-of-robotics': 'Student assembling a robot and learning electronics at Branky STEM Labs Vadodara',
  'core-robotics-coding': 'Teenager building and coding a robotics project at Branky STEM Labs Vadodara',
}

export default function ProgramsSection() {
  const [selected, setSelected] = useState(programs[0])

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

        <div className="programs-layout reveal d2" style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:28, alignItems:'start' }}>
          {/* Program list */}
          <div className="programs-list" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {programs.map(p => {
              const active = p.slug === selected.slug
              return (
                <button key={p.slug} onClick={() => setSelected(p)}
                  style={{
                    display:'flex', alignItems:'center', gap:14, textAlign:'left', width:'100%',
                    padding:12, borderRadius:16, cursor:'pointer',
                    border: active ? `2px solid ${p.accent==='orange'?'var(--orange)':'var(--blue)'}` : '2px solid transparent',
                    background: active ? (p.accent==='orange'?'var(--orange-pale)':'var(--blue-pale)') : '#f7f7f8',
                    transition:'all .25s',
                  }}>
                  <div style={{ width:64, height:64, borderRadius:12, overflow:'hidden', position:'relative', flexShrink:0 }}>
                    <Image src={p.img} alt={altText[p.slug]} fill style={{ objectFit:'cover' }} />
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:'.92rem', fontWeight:700, color:'var(--black)', marginBottom:4, lineHeight:1.3 }}>{p.title}</div>
                    <div style={{ fontSize:'.75rem', color:'var(--gray)' }}>Age: {p.age}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail panel */}
          <div className="programs-detail" style={{ background: selected.accent==='orange' ? 'var(--orange-pale)' : 'var(--blue-pale)', borderRadius:28, padding:28, display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'center' }}>
            <div style={{ height:320, borderRadius:20, overflow:'hidden', position:'relative' }}>
              <Image src={selected.img} alt={altText[selected.slug]} fill style={{ objectFit:'cover' }} />
              <div style={{ position:'absolute', top:14, left:14, padding:'4px 14px', borderRadius:50, fontSize:'.7rem', fontWeight:800, letterSpacing:'.07em', textTransform:'uppercase', background: selected.accent==='orange'?'var(--orange)':'var(--blue)', color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,.2)' }}>
                Age: {selected.age}
              </div>
              <div style={{ position:'absolute', top:14, right:14, padding:'4px 12px', borderRadius:50, fontSize:'.68rem', fontWeight:700, background:'rgba(0,0,0,.55)', backdropFilter:'blur(8px)', color:'#fff' }}>
                {selected.duration}
              </div>
            </div>

            <div>
              <h3 className="h-display" style={{ fontSize:'1.5rem', fontWeight:400, color:'var(--black)', marginBottom:12 }}>{selected.title}</h3>
              <p style={{ fontSize:'.92rem', color:'var(--gray)', lineHeight:1.65, marginBottom:20 }}>{selected.shortDescription}</p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                {selected.features.map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:'.87rem', color:'var(--black)', lineHeight:1.5 }}>
                    <span style={{ width:20, height:20, background:'#fff', borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Check size={12} strokeWidth={3} color={selected.accent==='orange'?'var(--orange)':'var(--blue)'} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/programs/${selected.slug}`} className={`btn btn-${selected.accent==='orange'?'orange':'outline'} btn-md`}>
                Know More →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){
          #programs{padding:64px 0 64px!important;}
          #programs>div{padding:0 20px;}
          #programs>div>p,#programs>div>.tag,#programs>div>h2,#programs>div>div{padding-left:0;padding-right:0;}
          .programs-layout{
            grid-template-columns:1fr!important;
          }
          .programs-list{
            flex-direction:row!important;
            overflow-x:auto!important;
            scrollbar-width:none;
          }
          .programs-list::-webkit-scrollbar{display:none;}
          .programs-list>button{
            width:auto!important;
            flex-shrink:0;
          }
          .programs-detail{
            grid-template-columns:1fr!important;
          }
        }
        @media(max-width:576px){
           #programs-description{
             margin-bottom : 10px !important;
             }
           }
        @media(max-width:480px){
          #programs{padding:52px 0 52px!important;}
        }
      `}} />
    </section>
  )
}

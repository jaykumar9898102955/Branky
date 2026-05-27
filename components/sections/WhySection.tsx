'use client'
import Image from 'next/image'
import { Microscope, Users, Medal, Backpack, Globe, CreditCard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const cards: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon:Microscope, title:'Real Lab Equipment', desc:'Students use actual sensors, actuators, 3D printers, and Raspberry Pi — not simulations or toys.' },
  { Icon:Users, title:'1:8 Mentor Ratio', desc:'Maximum 8 students per mentor ensures personalised attention for every single student.' },
  { Icon:Medal, title:'Competition Prep', desc:'200+ students trained who have won at WRO, FLL, and national robotics olympiads.' },
  { Icon:Backpack, title:'Kit Take-Home', desc:'Every student gets a STEM kit to keep — continue building at home after bootcamp ends.' },
  { Icon:Globe, title:'Online + Offline', desc:'Hybrid format — attend in Ahmedabad or join live-streamed sessions from anywhere in India.' },
  { Icon:CreditCard, title:'Flexible Fees', desc:'EMI options, sibling discounts, and merit scholarships for deserving students.' },
]

export default function WhySection() {
  return (
    <section id="why" style={{ background:'var(--orange)', padding:'96px 5%', position:'relative', overflow:'hidden' }}>
      {/* Brand wave top-left */}
      <div style={{ position:'absolute', top:-20, left:-30, width:'20%', maxWidth:200, opacity:.1, pointerEvents:'none', animation:'blobFloat 10s ease-in-out infinite' }}>
        <Image src="/assets/brand-wave.png" alt="" width={200} height={200} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>
      {/* Brand shapes bottom-right */}
      <div style={{ position:'absolute', bottom:-30, right:-20, width:'18%', maxWidth:180, opacity:.07, pointerEvents:'none' }}>
        <Image src="/assets/brand-shapes.png" alt="" width={180} height={180} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="tag tag-white reveal">Why Choose Us</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#fff', marginBottom:12 }}>
          The Branky <span style={{ color:'var(--black)' }}>difference</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex', gap:8, marginBottom:48 }}>
          <div style={{ height:4, width:40, background:'var(--black)', borderRadius:8 }} />
          <div style={{ height:4, width:110, background:'rgba(255,255,255,.4)', borderRadius:8 }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
          {cards.map((c, i) => (
            <div key={c.title} className={`reveal d${(i%3)+1}`}
              style={{ background:'rgba(255,255,255,.14)', border:'2px solid rgba(255,255,255,.24)', borderRadius:22, padding:'26px 26px', backdropFilter:'blur(12px)', transition:'all .4s', cursor:'default' }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,.26)'; el.style.transform='translateY(-8px)'; el.style.borderColor='rgba(255,255,255,.5)' }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,.14)'; el.style.transform=''; el.style.borderColor='rgba(255,255,255,.24)' }}>
              <div style={{ marginBottom:14, color:'rgba(255,255,255,.9)' }}><c.Icon size={36}/></div>
              <h3 className="h-display" style={{ fontSize:'1.05rem', fontWeight:400, color:'#fff', marginBottom:9 }}>{c.title}</h3>
              <p style={{ fontSize:'.87rem', color:'rgba(255,255,255,.83)', lineHeight:1.65 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        /* PC: repeat(3,1fr) — default inline style */
        /* Tablet+Phone */
        @media(max-width:860px){#why{padding:64px 20px!important;} #why>div>div:last-child{grid-template-columns:1fr 1fr!important;}}
        /* Phone only */
        @media(max-width:480px){#why>div>div:last-child{grid-template-columns:1fr!important;}}
      `}} />
    </section>
  )
}

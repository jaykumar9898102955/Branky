import Image from 'next/image'
import Link from 'next/link'
import { Monitor, Backpack, Globe, Microscope } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const concerns: { IC: LucideIcon; title: string; desc: string }[] = [
  { IC:Monitor,    title:'Screen time with no learning value', desc:'Endless scrolling replaces structured skill-building during the most critical developmental years.' },
  { IC:Backpack,   title:'Schools teach theory, not application', desc:'Traditional education rarely covers robotics, AI, or coding in a hands-on, meaningful way.' },
  { IC:Globe,      title:'The world is changing faster than ever', desc:'By 2030, most jobs will require tech fluency. Early exposure makes all the difference.' },
  { IC:Microscope, title:'Not sure where to start', desc:'With so many options, parents struggle to find age-appropriate, structured tech education.' },
]

export default function PainPointSection() {
  return (
    <section style={{ background:'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding:'96px 5%', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/brand-grid.png')", backgroundSize:'cover', opacity:.03, pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', top:-40, right:-60, width:'28%', maxWidth:300, opacity:.06, pointerEvents:'none', animation:'blobFloat 12s ease-in-out infinite' }}>
        <Image src="/assets/brand-wave.png" alt="" width={300} height={300} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 18px', borderRadius:50, background:'rgba(255,255,255,.1)', border:'1.5px solid rgba(255,255,255,.2)', fontSize:'.72rem', fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.7)', marginBottom:24 }} className="reveal">
          Every Parent Thinks About This
        </div>

        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,4vw,3rem)', color:'#fff', marginBottom:16, maxWidth:680, lineHeight:1.15 }}>
          Is Your Child Ready for a World That Runs on <span style={{ color:'var(--orange)' }}>AI &amp; Robots?</span>
        </h2>
        <p className="reveal d2" style={{ fontSize:'1.05rem', color:'rgba(255,255,255,.6)', lineHeight:1.75, marginBottom:52, maxWidth:600 }}>
          The gap between children who understand technology and those who don&apos;t is growing every single year. The question isn&apos;t whether your child needs these skills — it&apos;s whether they&apos;ll get them in time.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }} className="pain-grid">
          {concerns.map((c, i) => (
            <div key={c.title} className={`pain-point-item reveal d${(i%2)+1}`}>
              <div style={{ width:52, height:52, background:'rgba(255,147,30,.15)', border:'1.5px solid rgba(255,147,30,.25)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <c.IC size={26} style={{ color:'var(--orange)' }} />
              </div>
              <div>
                <strong style={{ display:'block', fontSize:'.97rem', fontWeight:800, color:'#fff', marginBottom:5 }}>{c.title}</strong>
                <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,.55)', lineHeight:1.6, margin:0 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal d3" style={{ marginTop:40, padding:'28px 32px', background:'rgba(29,92,227,.2)', border:'1.5px solid rgba(29,92,227,.4)', borderRadius:24, display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, flexWrap:'wrap' }}>
          <div>
            <strong style={{ display:'block', fontSize:'1.1rem', color:'#fff', marginBottom:6, fontWeight:800 }}>Branky STEM Labs is the answer.</strong>
            <p style={{ fontSize:'.9rem', color:'rgba(255,255,255,.6)', margin:0, lineHeight:1.6 }}>
              Structured programs for ages 4–14 · Smart labs · Expert mentors · Vadodara
            </p>
          </div>
          <Link href="/contact" className="btn btn-orange btn-md" style={{ flexShrink:0 }}>
            Book Free Demo →
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){ .pain-grid{grid-template-columns:1fr!important;} }
      `}} />
    </section>
  )
}

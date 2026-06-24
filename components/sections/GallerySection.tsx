'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

const items = [
  { src:'/assets/robot1.png', label:'Bipedal Walker Robot', wide:true },
  { src:'/assets/robot2.png', label:'Smart RC Car' },
  { src:'/assets/robot3.png', label:'Motorized Lift' },
  { src:'/assets/robot4.png', label:'Robotic Crane Arm' },
  { src:'/assets/robot5.png', label:'Gear Train System' },
  { src:'/assets/robot6.png', label:'Electronics Project' },
]

export default function GallerySection() {
  const [light, setLight] = useState<string|null>(null)
  return (
    <section id="gallery" style={{ background:'linear-gradient(145deg,#1255e8 0%,#0a3db5 55%,#082e8a 100%)',padding:'96px 5%',position:'relative',overflow:'hidden' }}>
      {/* Subtle dot pattern */}
      <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none',zIndex:0 }} />

      <div style={{ maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1 }}>
        <div className="tag tag-white reveal">Student Creations</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)',color:'#fff',marginBottom:12 }}>
          What our <span style={{ color:'var(--orange)' }}>kids build</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex',gap:8,marginBottom:14 }}>
          <div style={{ height:4,width:40,background:'var(--orange)',borderRadius:8 }} />
          <div style={{ height:4,width:110,background:'rgba(255,255,255,.35)',borderRadius:8 }} />
        </div>
        <p className="reveal d2" style={{ color:'rgba(255,255,255,.72)',fontSize:'1rem',lineHeight:1.7,marginBottom:44 }}>Real projects. Real engineering. Real pride. Every item below was built by a Branky student.</p>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gridAutoRows:'clamp(160px,20vw,220px)',gap:14 }}>
          {items.map((item,i) => (
            <div key={i} className={`reveal d${Math.min(i+1,6)}`}
              style={{ gridColumn:item.wide?'1/3':'auto',gridRow:item.wide?'1/3':'auto',borderRadius:18,overflow:'hidden',cursor:'pointer',position:'relative',border:'2.5px solid rgba(255,255,255,.12)',transition:'all .3s' }}
              onClick={() => setLight(item.src)}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='var(--orange)';el.style.transform='scale(1.02)'}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(255,255,255,.12)';el.style.transform=''}}>
              <Image src={item.src} alt={item.label} fill style={{ objectFit:'cover',transition:'transform .5s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.07)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''} />
              <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(29,92,227,.8),transparent 55%)',opacity:0,transition:'opacity .3s',display:'flex',alignItems:'flex-end',padding:'16px 18px' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='1'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='0'}>
                <span style={{ color:'#fff',fontWeight:800,fontSize:'.88rem' }}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {light && (
        <div onClick={() => setLight(null)} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.93)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20 }}>
          <Image src={light} alt="" width={900} height={700} style={{ maxWidth:'90vw',maxHeight:'88vh',objectFit:'contain',borderRadius:18,boxShadow:'0 40px 100px rgba(0,0,0,.6)' }} />
          <button onClick={() => setLight(null)} style={{ position:'absolute',top:20,right:24,background:'rgba(255,255,255,.12)',border:'2px solid rgba(255,255,255,.2)',color:'#fff',width:48,height:48,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .3s' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--orange)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.12)'}><X size={20}/></button>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html:`
        /* PC: repeat(4,1fr) — default inline style */
        /* Tablet+Phone */
        @media(max-width:860px){
          #gallery{padding:70px 20px!important;}
          #gallery>div>div:last-child{grid-template-columns:1fr 1fr!important;grid-auto-rows:clamp(140px,35vw,200px)!important;}
          #gallery>div>div:last-child>div:first-child{grid-column:1/-1!important;grid-row:auto!important;}
        }
        /* Phone only */
        @media(max-width:480px){
          #gallery>div>div:last-child{grid-template-columns:1fr!important;grid-auto-rows:clamp(180px,55vw,240px)!important;}
          #gallery>div>div:last-child>div:first-child{grid-column:auto!important;}
        }
      `}} />
    </section>
  )
}
